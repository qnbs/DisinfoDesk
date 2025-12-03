
import React, { useState, useEffect, useMemo } from 'react';
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTheory, updateTheory, selectAllTheories } from '../store/slices/theoriesSlice';
import { PageFrame, PageHeader, Card, Button, Badge } from './ui/Common';
import { Save, X, Edit3, Tag, AlertTriangle, Image as ImageIcon, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const TheoryEditor: React.FC = () => {
    const { t, language } = useLanguage();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { theoryId } = useParams<{ theoryId: string }>();
    const allTheories = useAppSelector(selectAllTheories);
    
    const existingTheory = useMemo(() => 
        theoryId ? allTheories.find(t => t.id === theoryId) : null,
    [theoryId, allTheories]);

    const initialTheory: Theory = existingTheory || {
        id: `custom_${Date.now()}`,
        title: '',
        shortDescription: '',
        category: language === 'de' ? Category.MODERN_MYTHS : CategoryEn.MODERN_MYTHS,
        dangerLevel: language === 'de' ? DangerLevel.LOW : DangerLevelEn.LOW,
        popularity: 50,
        originYear: new Date().getFullYear().toString(),
        tags: [],
        imageUrl: '',
        isUserCreated: true,
        lastEdited: Date.now()
    };

    const [formState, setFormState] = useState<Theory>(initialTheory);
    const [tagInput, setTagInput] = useState('');
    const [touched, setTouched] = useState(false);

    // Reset form when switching between create/edit or id changes
    useEffect(() => {
        setFormState(existingTheory || {
            id: `custom_${Date.now()}`,
            title: '',
            shortDescription: '',
            category: language === 'de' ? Category.MODERN_MYTHS : CategoryEn.MODERN_MYTHS,
            dangerLevel: language === 'de' ? DangerLevel.LOW : DangerLevelEn.LOW,
            popularity: 50,
            originYear: new Date().getFullYear().toString(),
            tags: [],
            imageUrl: '',
            isUserCreated: true,
            lastEdited: Date.now()
        });
    }, [existingTheory, language]);

    const categories = language === 'de' ? Object.values(Category) : Object.values(CategoryEn);
    const dangerLevels = language === 'de' ? Object.values(DangerLevel) : Object.values(DangerLevelEn);

    const handleChange = (field: keyof Theory, value: Theory[keyof Theory]) => {
        setFormState(prev => ({ ...prev, [field]: value }));
        setTouched(true);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formState.tags.includes(tagInput.trim())) {
            setFormState(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormState(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    };

    const handleSave = () => {
        if (!formState.title || !formState.shortDescription) {
            alert(language === 'de' ? 'Titel und Beschreibung sind erforderlich.' : 'Title and description are required.');
            return;
        }

        const payload = { 
            ...formState, 
            lastEdited: Date.now(),
            // Generate a placeholder image if none provided
            imageUrl: formState.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formState.title)}&background=0f172a&color=06b6d4&size=512`
        };

        if (existingTheory) {
            dispatch(updateTheory({ lang: language, theory: payload }));
        } else {
            dispatch(addTheory({ lang: language, theory: payload }));
        }
        
        // Navigate back or to detail
        if (existingTheory) {
            navigate(`/archive/${existingTheory.id}`);
        } else {
            navigate('/archive');
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <PageFrame>
            <PageHeader 
                title={existingTheory ? (language === 'de' ? 'AKTE BEARBEITEN' : 'EDIT FILE') : (language === 'de' ? 'NEUE THEORIE' : 'NEW THEORY')}
                subtitle="THEORY LAB // EDITOR"
                icon={Edit3}
                status={touched ? "UNSAVED CHANGES" : "READY"}
                statusColor={touched ? "bg-yellow-500" : "bg-green-500"}
                actions={
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={handleCancel} icon={<X size={16} />}>
                            {language === 'de' ? 'Abbrechen' : 'Cancel'}
                        </Button>
                        <Button variant="primary" onClick={handleSave} icon={<Save size={16} />}>
                            {language === 'de' ? 'Speichern' : 'Save Record'}
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card className="p-6 space-y-4 bg-slate-900/50 border-slate-800">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Title / Subject</label>
                            <input 
                                type="text" 
                                value={formState.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none transition-all font-bold text-lg"
                                placeholder="e.g., The Moon is Cheese"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Short Description (Summary)</label>
                            <textarea 
                                value={formState.shortDescription}
                                onChange={(e) => handleChange('shortDescription', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-300 focus:border-accent-cyan outline-none transition-all h-32 resize-none leading-relaxed"
                                placeholder="Describe the theory in 1-2 sentences..."
                            />
                        </div>
                    </Card>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 space-y-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                <AlertTriangle size={16} className="text-accent-cyan" /> Classification
                            </h3>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category</label>
                                <select 
                                    value={formState.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-accent-cyan outline-none"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Threat Level</label>
                                <select 
                                    value={formState.dangerLevel}
                                    onChange={(e) => handleChange('dangerLevel', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-accent-cyan outline-none"
                                >
                                    {dangerLevels.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Origin Year</label>
                                <input 
                                    type="text"
                                    value={formState.originYear || ''}
                                    onChange={(e) => handleChange('originYear', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-accent-cyan outline-none"
                                />
                            </div>
                        </Card>

                        <Card className="p-6 space-y-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                <Tag size={16} className="text-accent-purple" /> Meta Tags
                            </h3>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-accent-purple outline-none"
                                    placeholder="Add tag..."
                                />
                                <Button variant="secondary" size="sm" onClick={handleAddTag}>+</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[50px] content-start">
                                {formState.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">
                                        #{tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-400 ml-1"><X size={12}/></button>
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Sidebar / Visuals */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                            <ImageIcon size={14} /> Cover Visual
                        </label>
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 mb-4 group">
                            {formState.imageUrl ? (
                                <img src={formState.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                    <ImageIcon size={32} opacity={0.5} />
                                </div>
                            )}
                            <input 
                                type="text"
                                value={formState.imageUrl || ''}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                                className="absolute bottom-0 left-0 w-full bg-black/80 text-xs p-2 text-white border-t border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity outline-none"
                                placeholder="Paste Image URL..."
                            />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Virality Index</label>
                                <input 
                                    type="range" 
                                    min="0" max="100" 
                                    value={formState.popularity}
                                    onChange={(e) => handleChange('popularity', parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-accent-cyan"
                                />
                                <div className="text-right text-xs font-mono text-accent-cyan">{formState.popularity}%</div>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
                        <div className="flex items-center gap-2 mb-2 text-white font-bold">
                            <CheckCircle2 size={14} className="text-green-500" /> Auto-Save Ready
                        </div>
                        User-created theories are stored in your local browser cache (Redux Persist). They will persist across reloads but are not uploaded to any server. Use "Export" in Settings to back them up.
                    </div>
                </div>
            </div>
        </PageFrame>
    );
};