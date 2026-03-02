
import React, { useState, useEffect, useCallback, useMemo, createContext, useContext, useRef } from 'react';
import { dbService, StorageStats } from '../services/dbService';
import { StoredAnalysis, StoredChat, StoredSatire, StoredMediaAnalysis, Message } from '../types';
import { Card, Button, Badge, PageFrame, PageHeader, EmptyState } from './ui/Common';
import { 
  Database, Trash2, Edit3, Save, Search, Server, FileText, 
  MessageSquare, Skull, ChevronRight, Lock, 
  Upload, Download, Activity, CheckSquare, Square, 
  Cpu, ShieldCheck, FileJson, AlertTriangle, Terminal, Check, HardDrive,
  FolderOpen, Plus, Film, Zap, Eye, Brain, X, AlignLeft, Calendar,
  Clock, Hash, Shield, BarChart3, Scan
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

type Tab = 'ANALYSES' | 'MEDIA' | 'CHATS' | 'SATIRES';
type DatabaseRecord = StoredAnalysis | StoredChat | StoredSatire | StoredMediaAnalysis;

// --- 0. UTILS & FX ---

const ScrambleText: React.FC<{ text: string, active: boolean }> = ({ text, active }) => {
    const [display, setDisplay] = useState(text);
    const chars = '010101010101<>?#%_';
    
    useEffect(() => {
        if (!active) {
            setDisplay(text);
            return;
        }
        let iter = 0;
        const interval = setInterval(() => {
            setDisplay(text.split('').map((c, i) => {
                if (i < iter) return text[i];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));
            if (iter >= text.length) clearInterval(interval);
            iter += 1/2; 
        }, 30);
        return () => clearInterval(interval);
    }, [text, active]);

    return <span>{display}</span>;
};

// --- 1. LOGIC HOOK ---

const useVaultLogic = () => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<Tab>('ANALYSES');
    const [data, setData] = useState<DatabaseRecord[]>([]);
    const [stats, setStats] = useState<StorageStats>({ usageBytes: 0, recordCounts: { analyses: 0, media_analyses: 0, chats: 0, satires: 0, app_state: 0, blob_storage: 0 }, totalRecords: 0, encrypted: true, compressionRatio: 0 });
    const [loading, setLoading] = useState(false);
    
    // Selection & Viewing
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [inspectorMode, setInspectorMode] = useState<'VISUAL' | 'CODE'>('VISUAL');
    const [isDecrypting, setIsDecrypting] = useState(false);

    // Editing State
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState('');

    // Load Data
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
            
            // Validate selected ID still exists
            if (selectedId && !result.find(i => i.id === selectedId)) {
                setSelectedId(null);
            }
        } catch (e) {
            console.error("Vault Access Denied", e);
            showToast('Secure Vault Connection Failed.', 'error');
        } finally {
            setLoading(false);
        }
    }, [activeTab, selectedId, showToast]);

    useEffect(() => { refreshData(); }, [refreshData]);

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setSelectedId(null);
        setSelectedIds(new Set());
        setSearchTerm('');
    };

    const handleSelect = (id: string, multi: boolean) => {
        if (multi) {
            const newSet = new Set(selectedIds);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            setSelectedIds(newSet);
        } else {
            if (selectedId === id) return;
            setIsDecrypting(true);
            setTimeout(() => setIsDecrypting(false), 600); // Fake decryption delay
            setSelectedId(id);
            setEditMode(false);
            setInspectorMode('VISUAL');
            // If strictly single select mode, clear multi
            if (selectedIds.size <= 1) setSelectedIds(new Set([id]));
        }
    };

    const handleBatchDelete = async () => {
        const ids = selectedIds.size > 0 ? Array.from(selectedIds) : (selectedId ? [selectedId] : []);
        if (ids.length === 0) return;
        
        if (!window.confirm(`SECURITY ALERT: Permanently shredding ${ids.length} records. This action is irreversible. Proceed?`)) return;

        try {
            const storeNameMap: Record<Tab, any> = {
                'ANALYSES': 'analyses',
                'MEDIA': 'media_analyses',
                'CHATS': 'chats',
                'SATIRES': 'satires'
            };
            await dbService.deleteBatch(storeNameMap[activeTab], ids);
            setSelectedIds(new Set());
            setSelectedId(null);
            showToast(`${ids.length} records purged from Vault.`, 'success');
            refreshData();
        } catch (e) {
            showToast('Purge Protocol Failed.', 'error');
        }
    };

    const handleSaveEdit = async () => {
        if(!selectedId) return;
        try {
            const updatedItem = JSON.parse(editedContent) as DatabaseRecord;
            const storeNameMap: Record<Tab, any> = {
                'ANALYSES': 'analyses',
                'MEDIA': 'media_analyses',
                'CHATS': 'chats',
                'SATIRES': 'satires'
            };
            
            // Type-safe save dispatch
            // @ts-ignore - Dynamic dispatch is safe here due to logic
            await dbService.put(storeNameMap[activeTab], updatedItem);

            setEditMode(false);
            showToast('Record re-encrypted and saved.', 'success');
            refreshData();
        } catch (e) {
            showToast('Syntax Error: JSON integrity check failed.', 'error');
        }
    };

    const handleExport = async () => {
        const blob = await dbService.exportFullDatabase();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vault_dump_${new Date().getTime()}.json`;
        a.click();
        showToast('Vault exported to local drive.', 'success');
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
    };

    const filteredData = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return data.filter(item => 
            item.title?.toLowerCase().includes(term) || 
            item.id.toLowerCase().includes(term)
        );
    }, [data, searchTerm]);

    const selectedRecord = useMemo(() => data.find(d => d.id === selectedId), [data, selectedId]);

    return {
        t, activeTab, handleTabChange,
        stats, loading, data: filteredData,
        selectedId, selectedRecord, selectedIds,
        handleSelect, handleBatchDelete, handleSaveEdit, handleExport,
        searchTerm, setSearchTerm,
        inspectorMode, setInspectorMode,
        editMode, setEditMode, editedContent, setEditedContent,
        isDecrypting, formatBytes
    };
};

// --- 2. CONTEXT ---

const VaultContext = createContext<ReturnType<typeof useVaultLogic> | undefined>(undefined);
const useVault = () => {
    const ctx = useContext(VaultContext);
    if (!ctx) throw new Error("useVault outside provider");
    return ctx;
};

// --- 3. COMPONENTS ---

// Left Panel: Data Banks
const DataBankSelector: React.FC = () => {
    const { activeTab, handleTabChange, stats, t } = useVault();
    
    const banks: { id: Tab, label: string, icon: React.ElementType, color: string }[] = [
        { id: 'ANALYSES', label: t.vault.tabs.analyses, icon: FileText, color: 'bg-accent-cyan' },
        { id: 'MEDIA', label: t.vault.tabs.media, icon: Film, color: 'bg-accent-purple' },
        { id: 'CHATS', label: t.vault.tabs.chats, icon: MessageSquare, color: 'bg-green-500' },
        { id: 'SATIRES', label: t.vault.tabs.satires, icon: Skull, color: 'bg-yellow-500' },
    ];

    // Explicit mapping to match StoreName
    const storeMapping: Record<Tab, keyof typeof stats.recordCounts> = {
        'ANALYSES': 'analyses',
        'MEDIA': 'media_analyses',
        'CHATS': 'chats',
        'SATIRES': 'satires'
    };

    // Calc visuals
    const maxCount = Math.max(...(Object.values(stats.recordCounts) as number[]), 1);

    return (
        <div className="flex md:flex-col gap-2 p-2 md:p-4 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl w-full md:w-64 shrink-0 overflow-x-auto md:overflow-visible">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2 hidden md:flex">
                <Server size={12} /> Data Banks
            </div>
            {banks.map(bank => {
                const count = stats.recordCounts[storeMapping[bank.id]] || 0;
                const percent = (count / maxCount) * 100;
                const isActive = activeTab === bank.id;

                return (
                    <button
                        key={bank.id}
                        onClick={() => handleTabChange(bank.id)}
                        className={`
                            relative flex flex-col p-3 md:p-4 rounded-xl border transition-all duration-300 group overflow-hidden text-left min-w-[100px] md:min-w-0 shrink-0
                            ${isActive 
                                ? 'bg-slate-900 border-slate-600 shadow-lg' 
                                : 'bg-slate-950/30 border-slate-800 hover:bg-slate-900 hover:border-slate-700'}
                        `}
                    >
                        {/* Progress Bar Background */}
                        <div 
                            className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${bank.color}`} 
                            style={{ width: isActive ? '100%' : `${percent}%`, opacity: isActive ? 1 : 0.3 }}
                        />
                        
                        <div className="flex flex-col md:flex-row items-center md:justify-between mb-1 md:mb-2 relative z-10 gap-1">
                            <div className={`p-1.5 md:p-2 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'bg-slate-900 text-slate-400'}`}>
                                <bank.icon size={16} />
                            </div>
                            <span className="font-mono text-[10px] md:text-xs font-bold text-slate-400">{count}</span>
                        </div>
                        <div className={`text-[10px] md:text-xs font-bold uppercase tracking-wider relative z-10 text-center md:text-left ${isActive ? 'text-white' : 'text-slate-400'}`}>
                            {bank.label}
                        </div>
                        {isActive && <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />}
                    </button>
                );
            })}
            
            <div className="mt-auto pt-6 border-t border-slate-800 hidden md:block">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                    <ShieldCheck size={16} className="text-green-500" />
                    <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Vault Integrity</div>
                        <div className="text-xs text-green-400 font-mono">100% SECURE</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Center: Holo Grid
const HoloGrid: React.FC = () => {
    const { data, loading, selectedId, handleSelect, searchTerm, setSearchTerm, selectedIds, t } = useVault();

    if (loading) return (
        <div className="flex-1 flex flex-col items-center justify-center text-accent-cyan gap-4 min-h-[300px]">
            <Scan size={48} className="animate-spin-slow" />
            <div className="text-xs font-mono uppercase tracking-[0.2em] animate-pulse">Decrypting Index...</div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-[#050b14] relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-800 flex gap-4 items-center bg-slate-900/80 backdrop-blur-sm z-10">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-accent-cyan transition-colors" size={14} />
                    <input 
                        type="text" 
                        placeholder="SEARCH_INDEX..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white font-mono focus:border-accent-cyan outline-none transition-all placeholder-slate-700"
                    />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span className="hidden md:inline">INDEX:</span>
                    <span className="text-white">{data.length}</span>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar z-0">
                {data.length === 0 ? (
                    <EmptyState title="SECTOR EMPTY" description="No data shards found in this bank." icon={HardDrive} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.map((item, idx) => {
                            const isSelected = selectedId === item.id;
                            const isChecked = selectedIds.has(item.id);
                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => handleSelect(item.id, false)}
                                    className={`
                                        group relative p-4 rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden
                                        ${isSelected 
                                            ? 'bg-accent-cyan/10 border-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-900/80'}
                                    `}
                                    style={{ animationDelay: `${idx * 20}ms` }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={`p-1.5 rounded-md ${isSelected ? 'bg-accent-cyan text-slate-900' : 'bg-slate-950 text-slate-500 group-hover:text-white'}`}>
                                            <FileText size={14} />
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleSelect(item.id, true); }}
                                            className={`hover:text-accent-cyan transition-colors ${isChecked ? 'text-accent-cyan' : 'text-slate-700'}`}
                                        >
                                            {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
                                        </button>
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-200 truncate mb-1 font-mono group-hover:text-accent-cyan transition-colors">
                                        <ScrambleText text={item.title || 'UNTITLED_SHARD'} active={isSelected} />
                                    </h4>
                                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-800/50">
                                        <span className="text-[9px] text-slate-600 font-mono truncate max-w-[80px]">{item.id}</span>
                                        <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                                            <Clock size={8} /> {new Date(item.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                        </span>
                                    </div>
                                    {isSelected && <div className="absolute inset-0 bg-accent-cyan/5 animate-pulse pointer-events-none" />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Right Panel: Deep Inspector
const DeepInspector: React.FC = () => {
    const { 
        selectedRecord, isDecrypting, inspectorMode, setInspectorMode, 
        editMode, setEditMode, editedContent, setEditedContent, handleSaveEdit, t 
    } = useVault();

    if (!selectedRecord) {
        return (
            <div className="hidden lg:flex w-96 bg-slate-950 border-l border-slate-800 flex-col items-center justify-center p-8 text-center">
                <div className="p-4 bg-slate-900/50 rounded-full mb-4 border border-slate-800 animate-pulse">
                    <Lock size={32} className="text-slate-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Secure Terminal</h3>
                <p className="text-xs text-slate-600 mt-2 font-mono">Awaiting Shard Selection...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 md:static md:z-auto md:w-[450px] bg-[#020617] border-l border-slate-800 flex flex-col h-full shadow-2xl animate-fade-in-left">
            {/* Mobile Close Handle (only visible on mobile via css usually, but logic kept simple here) */}
            <div className="md:hidden h-1 w-12 bg-slate-700 rounded-full mx-auto my-2" />

            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 pt-safe-top">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-accent-cyan/10 rounded text-accent-cyan border border-accent-cyan/20">
                        <Database size={16} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate max-w-[150px]">{selectedRecord.title}</div>
                        <div className="text-[9px] text-slate-500 font-mono">{selectedRecord.id}</div>
                    </div>
                </div>
                <div className="flex gap-1">
                    {!editMode ? (
                        <Button size="sm" variant="ghost" onClick={() => { setEditMode(true); setEditedContent(JSON.stringify(selectedRecord, null, 2)); }} icon={<Edit3 size={14}/>} />
                    ) : (
                        <Button size="sm" variant="primary" onClick={handleSaveEdit} icon={<Save size={14}/>} />
                    )}
                    {/* Add explicit close button for mobile overlay */}
                    <Button size="sm" variant="ghost" onClick={() => window.history.back()} className="md:hidden" icon={<X size={14}/>} aria-label="Close panel" />
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex border-b border-slate-800">
                <button 
                    onClick={() => setInspectorMode('VISUAL')} 
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${inspectorMode === 'VISUAL' ? 'bg-slate-900 text-accent-cyan border-b-2 border-accent-cyan' : 'text-slate-500 hover:text-white'}`}
                >
                    <Eye size={12} /> Visual Decrypt
                </button>
                <button 
                    onClick={() => setInspectorMode('CODE')} 
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${inspectorMode === 'CODE' ? 'bg-slate-900 text-accent-purple border-b-2 border-accent-purple' : 'text-slate-500 hover:text-white'}`}
                >
                    <Terminal size={12} /> Source Matrix
                </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-hidden relative pb-safe-bottom">
                {isDecrypting && (
                    <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center text-accent-cyan font-mono text-xs">
                        <Scan size={32} className="animate-spin mb-2" />
                        <div>DECRYPTING_SHARD...</div>
                    </div>
                )}

                {editMode || inspectorMode === 'CODE' ? (
                    <textarea 
                        className="w-full h-full bg-[#0d1117] text-green-400 font-mono text-xs p-4 outline-none resize-none leading-relaxed"
                        value={editMode ? editedContent : JSON.stringify(selectedRecord, null, 2)}
                        onChange={e => editMode && setEditedContent(e.target.value)}
                        readOnly={!editMode}
                        spellCheck={false}
                    />
                ) : (
                    <div className="h-full overflow-y-auto p-6 bg-slate-900/20">
                        {/* DYNAMIC VISUALIZER BASED ON TYPE */}
                        {'messages' in selectedRecord ? (
                            <div className="space-y-4">
                                <Badge label="ENCRYPTED CHAT LOG" className="bg-green-500/10 text-green-400 border-green-500/30" />
                                {selectedRecord.messages.map((m, i) => (
                                    <div key={i} className={`p-3 rounded-lg text-xs ${m.role === 'user' ? 'bg-slate-800 ml-8 border border-slate-700' : 'bg-slate-900 mr-8 border border-slate-800'}`}>
                                        <div className="font-bold text-[9px] mb-1 opacity-50 uppercase">{m.role}</div>
                                        <div className="text-slate-300 whitespace-pre-wrap">{m.text}</div>
                                    </div>
                                ))}
                            </div>
                        ) : 'content' in selectedRecord ? (
                            <div className="bg-[#f4f4f5] text-black p-6 font-serif shadow-xl rounded-sm transform rotate-1">
                                <h2 className="font-black text-xl mb-4 uppercase border-b-2 border-black pb-2">{selectedRecord.title}</h2>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">{selectedRecord.content}</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Cpu size={12}/> Metadata</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><div className="text-[9px] text-slate-600">ID</div><div className="text-xs font-mono text-slate-300">{selectedRecord.id}</div></div>
                                        <div><div className="text-[9px] text-slate-600">SIZE</div><div className="text-xs font-mono text-slate-300">{JSON.stringify(selectedRecord).length} B</div></div>
                                    </div>
                                </div>
                                {'fullDescription' in selectedRecord && (
                                    <div className="bg-slate-950/50 border border-slate-800/50 p-4 rounded-lg">
                                        <div className="text-xs text-slate-300 leading-relaxed font-sans">{String((selectedRecord as Record<string, unknown>).fullDescription ?? '')}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Top Bar: Telemetry
const VaultTelemetry: React.FC = () => {
    const { stats, formatBytes, handleExport, handleBatchDelete, t } = useVault();
    const usedPercent = Math.min(100, (stats.usageBytes / (50 * 1024 * 1024)) * 100); // Assume 50MB quota

    return (
        <PageHeader 
            title="SECURE VAULT"
            subtitle="ENCRYPTED STORAGE MANAGEMENT"
            icon={Database}
            status="LOCKED"
            visualizerState="IDLE"
            actions={
                <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={handleBatchDelete} icon={<Trash2 size={14} />} className="border-red-900/50 bg-red-950/20 hover:bg-red-900/40">
                        SHRED
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleExport} icon={<Download size={14} />}>
                        DUMP
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500 uppercase">
                        <span>Storage Usage</span>
                        <span>{formatBytes(stats.usageBytes)} / 50 MB</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple" style={{ width: `${usedPercent}%` }}></div>
                    </div>
                </div>
                
                <div className="flex gap-4 border-l border-slate-800 pl-6">
                    <div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase">Files</div>
                        <div className="text-lg font-mono font-bold text-white">{stats.totalRecords}</div>
                    </div>
                    <div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase">Version</div>
                        <div className="text-lg font-mono font-bold text-slate-400">v3.0</div>
                    </div>
                </div>

                <div className="h-8 w-full">
                    {/* Tiny Sparkline for activity visualization */}
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <AreaChart data={new Array(10).fill(0).map((_, i) => ({ val: Math.random() * 100 }))}>
                            <Area type="monotone" dataKey="val" stroke="#334155" fill="#1e293b" strokeWidth={1} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </PageHeader>
    );
};

// --- 4. MAIN LAYOUT ---

export const DatabaseManager: React.FC = () => {
    return (
        <VaultContext.Provider value={useVaultLogic()}>
            <PageFrame>
                <VaultTelemetry />
                <Card className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-280px)] min-h-[600px] p-0 overflow-hidden bg-slate-950 border-slate-800 shadow-2xl mt-6 relative">
                    {/* Background Noise */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 pointer-events-none"></div>
                    
                    <DataBankSelector />
                    <HoloGrid />
                    <DeepInspector />
                </Card>
            </PageFrame>
        </VaultContext.Provider>
    );
};

export default DatabaseManager;
