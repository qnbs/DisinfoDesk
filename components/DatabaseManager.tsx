
import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import { dbService, StorageStats } from '../services/dbService';
import { StoredAnalysis, StoredChat, StoredSatire, StoredMediaAnalysis } from '../types';
import { Card, Button, Badge, PageFrame, PageHeader, EmptyState } from './ui/Common';
import { 
  Database, Trash2, Edit3, Save, Search, Server, FileText, 
  MessageSquare, Skull, ChevronRight, Lock, 
  Upload, Download, Activity, CheckSquare, Square, 
  Cpu, ShieldCheck, FileJson, AlertTriangle, Terminal, Check, HardDrive,
  Folder, FolderOpen, Plus, Film, Zap, Eye, Brain
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type Tab = 'ANALYSES' | 'MEDIA' | 'CHATS' | 'SATIRES';
type DatabaseRecord = StoredAnalysis | StoredChat | StoredSatire | StoredMediaAnalysis;

// --- 1. Logic Hook ---

const useDatabaseManagerLogic = () => {
    const { t } = useLanguage();
    const [isUnlocked, setIsUnlocked] = useState(false);
    
    const [activeTab, setActiveTab] = useState<Tab>('ANALYSES');
    const [data, setData] = useState<DatabaseRecord[]>([]);
    const [stats, setStats] = useState<StorageStats>({ usageBytes: 0, recordCounts: { analyses: 0, media_analyses: 0, chats: 0, satires: 0, app_state: 0 }, totalRecords: 0 });
    const [loading, setLoading] = useState(false);
    
    const [selectedItem, setSelectedItem] = useState<DatabaseRecord | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'VISUAL' | 'CODE'>('VISUAL');
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

    const showNotification = useCallback((msg: string, type: 'success' | 'error') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const newStats = await dbService.getStorageStats();
            setStats(newStats);

            let result: DatabaseRecord[] = [];
            switch(activeTab) {
                case 'ANALYSES': result = await dbService.getAll<StoredAnalysis>('analyses'); break;
                case 'MEDIA': result = await dbService.getAll<StoredMediaAnalysis>('media_analyses'); break;
                case 'CHATS': result = await dbService.getAll<StoredChat>('chats'); break;
                case 'SATIRES': result = await dbService.getAll<StoredSatire>('satires'); break;
            }
            setData(result.sort((a, b) => b.timestamp - a.timestamp));
            if (selectedItem) {
                const stillExists = result.find(i => i.id === selectedItem.id);
                if (stillExists) setSelectedItem(stillExists);
                else setSelectedItem(null);
            }
        } catch (e: unknown) {
            console.error("DB Error", e);
        } finally {
            setLoading(false);
        }
    }, [activeTab, selectedItem]);

    useEffect(() => {
        // Auto-unlock for now, can add auth later
        setIsUnlocked(true);
    }, []);

    useEffect(() => {
        if (isUnlocked) refreshData();
    }, [refreshData, isUnlocked]);

    const handleSelect = (id: string, multi: boolean) => {
        if (multi) {
            const newSet = new Set(selectedIds);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            setSelectedIds(newSet);
        } else {
            const item = data.find(d => d.id === id) || null;
            setSelectedItem(item);
            setEditMode(false);
            setViewMode('VISUAL');
            setSelectedIds(new Set([id]));
        }
    };

    const handleBatchDelete = async () => {
        const ids = selectedIds.size > 0 ? Array.from(selectedIds) : (selectedItem ? [selectedItem.id] : []);
        if (ids.length === 0) return;
        
        if (!window.confirm(`WARNING: Permanent deletion of ${ids.length} records initiated. Confirm?`)) return;

        try {
            let store: 'analyses' | 'chats' | 'satires' | 'media_analyses' = 'analyses';
            if (activeTab === 'CHATS') store = 'chats';
            else if (activeTab === 'SATIRES') store = 'satires';
            else if (activeTab === 'MEDIA') store = 'media_analyses';

            await dbService.deleteBatch(store, ids);
            setSelectedIds(new Set());
            setSelectedItem(null);
            showNotification(`Shredded ${ids.length} files successfully.`, 'success');
            refreshData();
        } catch (e: unknown) {
            showNotification('Deletion protocol failed.', 'error');
        }
    };

    const handleExport = async () => {
        const blob = await dbService.exportFullDatabase();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `disinfodesk_vault_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        showNotification('Database dump extracted.', 'success');
    };

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        
        try {
            const text = await file.text();
            const result = await dbService.importDatabase(text);
            if (result.success) {
                showNotification(result.message, 'success');
                refreshData();
            } else {
                showNotification(result.message, 'error');
            }
        } catch (err: unknown) {
            showNotification('Read Error: File inaccessible.', 'error');
        } finally {
            // Reset input so the same file can be selected again if needed
            e.target.value = '';
        }
    };

    const handleSaveEdit = async () => {
        if(!selectedItem) return;
        try {
            const updatedItem = JSON.parse(editedContent) as DatabaseRecord;
            
            if (activeTab === 'ANALYSES') await dbService.saveAnalysis(updatedItem as StoredAnalysis);
            else if (activeTab === 'MEDIA') await dbService.saveMediaAnalysis(updatedItem as StoredMediaAnalysis);
            else if (activeTab === 'CHATS') await dbService.saveChat(updatedItem as StoredChat);
            else await dbService.saveSatire(updatedItem as StoredSatire);

            setSelectedItem(updatedItem);
            setEditMode(false);
            showNotification('Record overwritten successfully.', 'success');
            refreshData();
        } catch (e: unknown) {
            showNotification('Syntax Error: Update aborted.', 'error');
        }
    };

    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return data.filter(item => 
            item.title.toLowerCase().includes(term) || 
            item.id.toLowerCase().includes(term)
        );
    }, [data, searchTerm]);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
    };

    return {
        t,
        isUnlocked, setIsUnlocked,
        activeTab, setActiveTab,
        stats,
        loading,
        selectedItem, setSelectedItem,
        selectedIds, setSelectedIds,
        searchTerm, setSearchTerm,
        viewMode, setViewMode,
        editMode, setEditMode,
        editedContent, setEditedContent,
        notification,
        filteredData,
        handleSelect,
        handleBatchDelete,
        handleExport,
        handleImportFile,
        handleSaveEdit,
        formatBytes
    };
};

// --- 2. Context & Provider ---

type DatabaseContextType = ReturnType<typeof useDatabaseManagerLogic>;
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) throw new Error('useDatabase must be used within a DatabaseProvider');
  return context;
};

const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logic = useDatabaseManagerLogic();
  return <DatabaseContext.Provider value={logic}>{children}</DatabaseContext.Provider>;
};

// --- 3. Sub-Components ---

const CodeViewer: React.FC<{ code: string, onChange?: (val: string) => void, editable?: boolean }> = ({ code, onChange, editable }) => {
    return (
        <div className="relative w-full h-full font-mono text-xs bg-[#0d1117] rounded-lg border border-slate-800 overflow-hidden group shadow-inner">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-[10px] text-slate-500 select-none backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    </div>
                    <span className="ml-2 font-bold text-slate-400">JSON_EDITOR</span>
                </div>
                <div className="font-mono text-slate-600">{editable ? 'RW' : 'RO'}</div>
            </div>
            <textarea
                value={code}
                onChange={(e) => onChange && onChange(e.target.value)}
                readOnly={!editable}
                spellCheck={false}
                className={`
                    w-full h-full p-4 bg-transparent text-emerald-400 outline-none resize-none leading-relaxed
                    selection:bg-accent-cyan/30 selection:text-white
                    ${editable ? 'cursor-text' : 'cursor-default'}
                `}
                style={{ fontFamily: '"Fira Code", monospace' }}
            />
            {!editable && (
                <div className="absolute top-12 right-6 pointer-events-none opacity-20">
                    <Lock size={24} className="text-slate-400" />
                </div>
            )}
        </div>
    );
};

const VaultHeader: React.FC = () => {
  const { stats, formatBytes, handleExport, handleImportFile, handleBatchDelete, t } = useDatabase(); 
  return (
    <PageHeader 
        title={t.vault.title}
        subtitle={t.vault.subtitle}
        icon={Database}
        status="ENCRYPTED"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-6 font-mono border-r border-slate-800 pr-6">
                <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">{t.vault.usedSpace}</div>
                    <div className="text-lg text-white font-bold">{formatBytes(stats.usageBytes)}</div>
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">{t.vault.totalFiles}</div>
                    <div className="text-lg text-white font-bold">{stats.totalRecords}</div>
                </div>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
                <Button variant="secondary" size="sm" onClick={handleExport} icon={<Download size={14} />} className="text-xs border-slate-700 hover:border-accent-cyan bg-slate-900/50">
                    {t.common.export}
                </Button>
                 <label className="cursor-pointer block">
                     <input type="file" className="hidden" accept=".json" onChange={handleImportFile} />
                     <div className="bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700 hover:border-accent-cyan px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all h-full justify-start font-mono uppercase tracking-wide">
                        <Upload size={14} /> {t.common.import}
                     </div>
                 </label>
                 <Button variant="danger" size="sm" onClick={handleBatchDelete} icon={<Trash2 size={14} />} className="text-xs opacity-70 hover:opacity-100 bg-red-950/20 border-red-900/50 ml-auto">
                    {t.vault.purge}
                 </Button>
            </div>
        </div>
    </PageHeader>
  );
};

const VaultBrowser: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedItem, setSearchTerm, searchTerm, handleBatchDelete, selectedIds, loading, filteredData, handleSelect, t } = useDatabase();
  
  return (
    <Card className="w-full md:w-1/3 flex flex-col p-0 bg-slate-950/50 border-slate-800 rounded-lg overflow-hidden backdrop-blur-md">
        {/* Tab Navigation / Folder Metaphor */}
        <div className="flex flex-col bg-slate-900/50 border-b border-slate-800">
            <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {t.vault.directory}
            </div>
            <div className="flex px-2 pb-2 gap-1 overflow-x-auto scrollbar-hide">
                {(['ANALYSES', 'MEDIA', 'CHATS', 'SATIRES'] as Tab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setSelectedItem(null); setSearchTerm(''); }}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap
                            ${activeTab === tab 
                                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}
                        `}
                    >
                        {activeTab === tab ? <FolderOpen size={14} className="text-accent-cyan" /> : <Folder size={14} />}
                        {t.vault.tabs[tab.toLowerCase() as keyof typeof t.vault.tabs]}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-3 border-b border-slate-800 flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                <input 
                    type="text"
                    placeholder={t.vault.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-8 pr-2 py-2 text-xs text-slate-300 focus:border-accent-cyan outline-none font-mono focus:ring-1 focus:ring-accent-cyan/50 transition-all"
                />
            </div>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBatchDelete} 
                disabled={selectedIds.size === 0}
                className={`px-2 ${selectedIds.size > 0 ? 'text-red-400 hover:bg-red-950/50' : 'text-slate-700'}`}
            >
                <Trash2 size={14} />
            </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-slate-950/20 relative min-h-[300px]">
            {loading && <div className="text-center py-8 text-xs text-accent-cyan animate-pulse font-mono">scanning_sectors...</div>}
            
            {!loading && filteredData.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <EmptyState 
                        title={t.vault.empty}
                        description={t.vault.emptyDesc}
                        icon={HardDrive}
                    />
                </div>
            )}

            {!loading && filteredData.map(item => {
                 const isSelected = selectedIds.has(item.id);
                 return (
                    <div 
                        key={item.id}
                        onClick={() => handleSelect(item.id, false)}
                        className={`
                            group flex items-center gap-3 p-3 rounded border cursor-pointer transition-all touch-manipulation
                            ${isSelected
                                ? 'bg-slate-800/60 border-slate-600'
                                : 'bg-transparent border-transparent hover:bg-slate-800/40 hover:border-slate-800'}
                        `}
                    >
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleSelect(item.id, true); }}
                            className={`shrink-0 p-1 -m-1 ${isSelected ? 'text-accent-cyan' : 'text-slate-600 group-hover:text-slate-400'}`}
                        >
                            {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                        </button>
                         <div className="min-w-0 flex-1">
                             <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                {item.title || 'UNKNOWN_FILE'}
                             </div>
                             <div className="text-[10px] text-slate-600 font-mono truncate">
                                {item.id}
                             </div>
                         </div>
                         {isSelected && <ChevronRight size={14} className="text-accent-cyan" />}
                    </div>
                 )
            })}
        </div>
        <div className="p-2 border-t border-slate-800 text-[10px] text-slate-600 font-mono text-center uppercase bg-slate-950">
            {filteredData.length} files
        </div>
    </Card>
  );
};

const VaultInspector: React.FC = () => {
  const { selectedItem, activeTab, viewMode, setViewMode, editMode, setEditMode, editedContent, setEditedContent, handleSaveEdit, t } = useDatabase();

  if (!selectedItem) {
      return (
        <Card className="hidden md:flex flex-1 flex-col p-0 bg-slate-950/80 border-slate-800 rounded-lg overflow-hidden relative shadow-2xl backdrop-blur-md min-h-[400px]">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                 <EmptyState 
                    title="AWAITING INPUT"
                    description="Select a record from the vault index to inspect content."
                    icon={Server}
                 />
            </div>
        </Card>
      );
  }

  return (
    <Card className="hidden md:flex flex-1 flex-col p-0 bg-slate-950/80 border-slate-800 rounded-lg overflow-hidden relative shadow-2xl backdrop-blur-md min-h-[400px]">
        <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded bg-slate-800/50 border border-slate-700 ${activeTab === 'ANALYSES' ? 'text-cyan-400' : activeTab === 'MEDIA' ? 'text-blue-400' : activeTab === 'CHATS' ? 'text-purple-400' : 'text-red-400'}`}>
                    {activeTab === 'ANALYSES' && <FileText size={16} />}
                    {activeTab === 'MEDIA' && <Film size={16} />}
                    {activeTab === 'CHATS' && <MessageSquare size={16} />}
                    {activeTab === 'SATIRES' && <Skull size={16} />}
                </div>
                <div className="font-mono">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">ID</div>
                    <div className="text-xs text-slate-200 font-bold">{selectedItem.id}</div>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button 
                    onClick={() => { setViewMode('VISUAL'); setEditMode(false); }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${viewMode === 'VISUAL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {t.vault.visual}
                </button>
                <button 
                    onClick={() => { setViewMode('CODE'); setEditedContent(JSON.stringify(selectedItem, null, 2)); }}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors ${viewMode === 'CODE' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    {t.vault.source}
                </button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto relative bg-[#0a0f18] custom-scrollbar">
            {viewMode === 'CODE' ? (
                <div className="absolute inset-0 flex flex-col">
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        {editMode ? (
                            <>
                                <Button variant="secondary" size="sm" onClick={() => setEditMode(false)} className="text-xs h-7 border-slate-700">{t.common.cancel}</Button>
                                <Button variant="primary" size="sm" onClick={handleSaveEdit} className="text-xs h-7" icon={<Save size={12}/>}>{t.vault.commit}</Button>
                            </>
                        ) : (
                            <Button variant="ghost" size="sm" onClick={() => setEditMode(true)} className="text-xs h-7 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white" icon={<Edit3 size={12}/>}>{t.vault.modify}</Button>
                        )}
                    </div>
                    <CodeViewer 
                        code={editMode ? editedContent : JSON.stringify(selectedItem, null, 2)} 
                        onChange={setEditedContent}
                        editable={editMode}
                    />
                </div>
            ) : (
                <div className="p-8 animate-fade-in max-w-4xl mx-auto">
                    {activeTab === 'ANALYSES' && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center shadow-lg">
                                    <Activity size={32} className="text-cyan-500" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{selectedItem.title}</h1>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <Badge label={(selectedItem as StoredAnalysis).data.category} color="purple" />
                                        <Badge label={(selectedItem as StoredAnalysis).data.dangerLevel} color="red" />
                                        <div className="text-xs text-slate-500 font-mono border-l border-slate-700 pl-3 ml-1">
                                            ORIGIN: {(selectedItem as StoredAnalysis).data.originYear}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-900/30 rounded-lg p-6 border border-slate-800">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <FileText size={14} /> Executive Summary
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {(selectedItem as StoredAnalysis).data.shortDescription}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-800">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Debunking Status</div>
                                    <div className="text-sm font-bold text-green-400">{(selectedItem as StoredAnalysis).data.debunking ? 'DATA_AVAILABLE' : 'PENDING'}</div>
                                </div>
                                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-800">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sources</div>
                                    <div className="text-sm font-bold text-blue-400">{(selectedItem as StoredAnalysis).data.sources?.length || 0} REFERENCES</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'MEDIA' && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center shadow-lg relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-blue-500/10 opacity-50"></div>
                                    <Film size={32} className="text-blue-400 relative z-10" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{selectedItem.title}</h1>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <Badge label={(selectedItem as StoredMediaAnalysis).mediaType} color="cyan" />
                                        <div className="text-xs text-slate-500 font-mono border-l border-slate-700 pl-3 ml-1">
                                            ID: {(selectedItem as StoredMediaAnalysis).id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-900/30 rounded-lg p-6 border border-slate-800">
                                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                                    <FileText size={14} /> Narrative Analysis
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {(selectedItem as StoredMediaAnalysis).data.plotSummary}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-800">
                                    <h3 className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-2"><Eye size={12}/> Hidden Symbolism</h3>
                                    <div className="text-sm text-slate-400 leading-relaxed">{(selectedItem as StoredMediaAnalysis).data.hiddenSymbolism}</div>
                                </div>
                                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-800">
                                    <h3 className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-2"><Zap size={12}/> Predictive Programming</h3>
                                    <div className="text-sm text-slate-400 leading-relaxed">{(selectedItem as StoredMediaAnalysis).data.predictiveProgramming}</div>
                                </div>
                                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-800">
                                    <h3 className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-2"><Brain size={12}/> Real World Parallels</h3>
                                    <div className="text-sm text-slate-400 leading-relaxed">{(selectedItem as StoredMediaAnalysis).data.realWorldParallels}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'CHATS' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-slate-800 pb-6 mb-6">
                                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center">
                                    <MessageSquare size={32} className="text-purple-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h1>
                                    <div className="flex gap-4 text-xs font-mono text-slate-500">
                                        <span>MESSAGES: {(selectedItem as StoredChat).messages.length}</span>
                                        <span>TIMESTAMP: {new Date(selectedItem.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                {(selectedItem as StoredChat).messages.map((msg, i) => (
                                    <div key={i} className={`p-4 rounded-lg border ${msg.role === 'user' ? 'bg-slate-900/30 border-slate-700 ml-8' : 'bg-purple-900/10 border-purple-500/20 mr-8'}`}>
                                        <div className="text-[10px] font-bold uppercase mb-2 opacity-50">{msg.role}</div>
                                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'SATIRES' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-slate-800 pb-6 mb-6">
                                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 shrink-0 flex items-center justify-center">
                                    <Skull size={32} className="text-yellow-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h1>
                                    <div className="flex gap-2 items-center">
                                        <Badge label={(selectedItem as StoredSatire).params.archetype} color="yellow" />
                                        <span className="text-xs text-slate-500 font-mono">PARANOIA: {(selectedItem as StoredSatire).params.paranoia}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-[#fdfbf7] text-slate-900 rounded-sm shadow-xl font-serif leading-relaxed relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Lock size={80} />
                                </div>
                                <h2 className="text-3xl font-black mb-6 uppercase tracking-tight border-b-4 border-slate-900 pb-4">{selectedItem.title}</h2>
                                <div className="whitespace-pre-wrap text-lg">{(selectedItem as StoredSatire).content}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </Card>
  );
};

// --- 4. Main Component ---

export const DatabaseManager: React.FC = () => {
  return (
      <DatabaseProvider>
        <div className="max-w-7xl mx-auto h-full flex flex-col pb-6">
            <VaultHeader />
            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-[600px] overflow-hidden">
                <VaultBrowser />
                <VaultInspector />
            </div>
        </div>
      </DatabaseProvider>
  );
};

export default DatabaseManager;
