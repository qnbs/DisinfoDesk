
import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { Theory, Category, CategoryEn, DangerLevel, DangerLevelEn, SortOption } from '../types';
import { 
  Search, Filter, AlertTriangle, Cloud, Heart, X, 
  ArrowUpDown, ShieldAlert, Check, LayoutGrid, List, 
  Table as TableIcon, SlidersHorizontal, ChevronDown, ChevronUp,
  Hash, Eye, RefreshCcw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, Button, Badge, PageFrame, PageHeader, EmptyState } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
    setSearch, toggleCategory, toggleDanger, setTag, setSort, toggleFavorite, resetFilters,
    selectFilteredTheories, selectTagStats
} from '../store/slices/theoriesSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';

type ViewMode = 'GRID' | 'LIST' | 'COMPACT';

// --- 1. Logic Hook ---

const useTheoryListLogic = () => {
  const dispatch = useAppDispatch();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Local State for View Control
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');

  // Redux State
  const processedTheories = useAppSelector(selectFilteredTheories);
  const count = processedTheories.length;
  const searchTerm = useAppSelector(state => state.theories.filterSearch);
  const sortOption = useAppSelector(state => state.theories.sortOption);
  const selectedCategories = useAppSelector(state => state.theories.filterCategories);
  const selectedDanger = useAppSelector(state => state.theories.filterDanger);
  const selectedTag = useAppSelector(state => state.theories.filterTag);
  const favorites = useAppSelector(state => state.theories.favorites);
  const tagData = useAppSelector(selectTagStats);

  // Initialization Effect from URL params
  useEffect(() => {
      const filter = searchParams.get('filter');
      const sort = searchParams.get('sort');

      if (filter === 'CRITICAL') {
          setIsFilterOpen(true);
      } else if (filter) {
          dispatch(setTag(filter));
          setIsFilterOpen(true);
      }
      
      if (sort) {
          dispatch(setSort(sort as SortOption));
      }
  }, [searchParams, dispatch]);

  const onSelect = (theory: Theory) => {
      navigate(`/archive/${theory.id}`);
  };

  const handleToggleFavorite = (id: string) => dispatch(toggleFavorite(id));
  const handleResetFilters = () => dispatch(resetFilters());
  const handleSetSearch = (val: string) => dispatch(setSearch(val));
  const handleSetSort = (val: SortOption) => dispatch(setSort(val));
  const handleToggleCategory = (cat: string) => dispatch(toggleCategory(cat));
  const handleToggleDanger = (lvl: string) => dispatch(toggleDanger(lvl));
  const handleSetTag = (tag: string | null) => dispatch(setTag(tag));

  return {
    t,
    language,
    isFilterOpen,
    setIsFilterOpen,
    viewMode,
    setViewMode,
    processedTheories,
    count,
    searchTerm,
    sortOption,
    selectedCategories,
    selectedDanger,
    selectedTag,
    favorites,
    tagData,
    onSelect,
    handleToggleFavorite,
    handleResetFilters,
    handleSetSearch,
    handleSetSort,
    handleToggleCategory,
    handleToggleDanger,
    handleSetTag
  };
};

// --- 2. Context & Provider ---

type TheoryListContextType = ReturnType<typeof useTheoryListLogic>;
const TheoryListContext = createContext<TheoryListContextType | undefined>(undefined);

const useTheoryList = () => {
  const context = useContext(TheoryListContext);
  if (!context) throw new Error('useTheoryList must be used within a TheoryListProvider');
  return context;
};

const TheoryListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const logic = useTheoryListLogic();
  return <TheoryListContext.Provider value={logic}>{children}</TheoryListContext.Provider>;
};

// --- 3. Sub-Components ---

const ViewSwitcher: React.FC = () => {
  const { viewMode, setViewMode } = useTheoryList();
  const modes: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
    { id: 'GRID', icon: <LayoutGrid size={18} />, label: 'Grid View' },
    { id: 'LIST', icon: <List size={18} />, label: 'List View' },
    { id: 'COMPACT', icon: <TableIcon size={18} />, label: 'Table View' },
  ];

  return (
    <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => setViewMode(mode.id)}
          className={`
            p-2 rounded-md transition-all
            ${viewMode === mode.id 
              ? 'bg-slate-700 text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}
          `}
          title={mode.label}
          aria-label={mode.label}
          aria-pressed={viewMode === mode.id}
        >
          {mode.icon}
        </button>
      ))}
    </div>
  );
};

const DangerPip: React.FC<{ level: string }> = React.memo(({ level }) => {
   const color = 
     level.includes('High') || level.includes('Gefährlich') ? 'bg-orange-500' :
     level.includes('Extreme') || level.includes('Demokratie') ? 'bg-red-600' :
     level.includes('Medium') || level.includes('Bedenklich') ? 'bg-yellow-500' : 'bg-green-500';
   
   return <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_5px_currentColor]`}></div>;
});

const ArchiveGridCard: React.FC<{ theory: Theory, index: number }> = React.memo(({ theory, index }) => {
  const { onSelect, handleToggleFavorite, favorites } = useTheoryList();
  const isFav = favorites.includes(theory.id);

  return (
    <div 
      onClick={() => onSelect(theory)}
      className="group relative bg-slate-900/60 rounded-xl border border-white/10 overflow-hidden cursor-pointer hover:z-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-fade-in active:scale-[0.98]"
      style={{ animationDelay: `${index * 50}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if(e.key === 'Enter') onSelect(theory); }}
      aria-label={`View details for ${theory.title}`}
    >
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent-cyan/50 rounded-xl transition-colors pointer-events-none z-20"></div>
      <div className="h-40 relative overflow-hidden bg-black">
        <img 
          src={theory.imageUrl} 
          alt="" 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute top-2 left-2 flex gap-1">
           <Badge label={theory.category.split(' ')[0]} className="bg-slate-900/80 backdrop-blur text-[10px]" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(theory.id); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/50 backdrop-blur hover:bg-white text-white hover:text-red-500 transition-colors touch-manipulation"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={16} className={isFav ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>
      <div className="p-4 relative">
        <div className="flex justify-between items-start mb-1">
           <span className="text-[10px] font-mono text-slate-500">{theory.originYear}</span>
           <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700">
              <DangerPip level={theory.dangerLevel} />
              {theory.dangerLevel.split(' ')[0]}
           </div>
        </div>
        <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-accent-cyan transition-colors">
          {theory.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {theory.shortDescription}
        </p>
        <div className="flex items-end gap-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
           <div className="h-full bg-accent-cyan" style={{ width: `${theory.popularity}%` }}></div>
        </div>
        <div className="flex justify-between mt-1 text-[9px] font-mono text-slate-600 uppercase">
           <span>Virality Index</span>
           <span>{theory.popularity}/100</span>
        </div>
      </div>
    </div>
  );
});

const ArchiveListRow: React.FC<{ theory: Theory, index: number }> = React.memo(({ theory, index }) => {
  const { onSelect, favorites } = useTheoryList();
  
  return (
    <div 
      onClick={() => onSelect(theory)}
      className="group flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all animate-fade-in active:bg-slate-800"
      style={{ animationDelay: `${index * 30}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if(e.key === 'Enter') onSelect(theory); }}
      aria-label={`View details for ${theory.title}`}
    >
      <div className="w-full md:w-16 h-32 md:h-16 rounded-md overflow-hidden flex-shrink-0 bg-black relative">
         <img src={theory.imageUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" alt="" />
      </div>
      <div className="flex-1 min-w-0 w-full">
         <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-base truncate group-hover:text-accent-cyan transition-colors">{theory.title}</h3>
            {favorites.includes(theory.id) && <Heart size={12} className="fill-red-500 text-red-500" />}
         </div>
         <p className="text-xs text-slate-400 line-clamp-2 md:line-clamp-1">{theory.shortDescription}</p>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end text-sm mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
         <div className="flex flex-col items-start md:items-end md:w-24">
            <span className="text-[10px] text-slate-500 uppercase">Category</span>
            <span className="text-xs text-slate-300 truncate max-w-full">{theory.category.split(' ')[0]}</span>
         </div>
         <div className="flex flex-col items-center md:items-end md:w-20">
            <span className="text-[10px] text-slate-500 uppercase">Danger</span>
            <div className="flex items-center gap-1.5">
               <DangerPip level={theory.dangerLevel} />
               <span className="text-xs text-slate-300">{theory.dangerLevel.substring(0, 4)}..</span>
            </div>
         </div>
         <div className="flex flex-col items-end md:w-16">
            <span className="text-[10px] text-slate-500 uppercase">Viral</span>
            <span className="font-mono text-accent-purple font-bold">{theory.popularity}%</span>
         </div>
      </div>
    </div>
  );
});

const ArchiveCompactRow: React.FC<{ theory: Theory, index: number }> = React.memo(({ theory, index }) => {
  const { onSelect } = useTheoryList();
  return (
    <div 
      onClick={() => onSelect(theory)}
      className="grid grid-cols-12 gap-4 p-3 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer text-xs items-center font-mono animate-fade-in min-w-[600px]"
      style={{ animationDelay: `${index * 20}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if(e.key === 'Enter') onSelect(theory); }}
      aria-label={`View details for ${theory.title}`}
    >
       <div className="col-span-1 text-slate-500">#{theory.id.toUpperCase()}</div>
       <div className="col-span-4 font-bold text-slate-300 truncate">{theory.title}</div>
       <div className="col-span-2 text-slate-500 truncate">{theory.category.split(' ')[0]}</div>
       <div className="col-span-2 text-slate-500">{theory.originYear}</div>
       <div className="col-span-2 flex items-center gap-2">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
             <div className="bg-slate-500 h-full" style={{ width: `${theory.popularity}%` }}></div>
          </div>
          <span>{theory.popularity}</span>
       </div>
       <div className="col-span-1 text-right text-accent-cyan opacity-0 hover:opacity-100 transition-opacity">
          <Eye size={12} />
       </div>
    </div>
  );
});

const FilterPanel: React.FC = () => {
  const { 
      isFilterOpen, setIsFilterOpen, language, t, 
      selectedCategories, handleToggleCategory, 
      selectedDanger, handleToggleDanger, 
      selectedTag, handleSetTag, tagData
  } = useTheoryList();

  const categories = language === 'de' ? Object.values(Category) : Object.values(CategoryEn);
  const dangerLevels = language === 'de' ? Object.values(DangerLevel) : Object.values(DangerLevelEn);

  if (!isFilterOpen) return null;

  return (
    <div className="bg-slate-900/90 border-t border-slate-700 p-4 md:p-6 mb-6 animate-fade-in relative overflow-hidden mt-4 rounded-xl">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 pointer-events-none"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Filter size={12} /> {t.list.allCategories}
          </h4>
          <div className="space-y-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleToggleCategory(cat)}
                className={`
                  w-full text-left px-3 py-2.5 rounded text-sm md:text-xs font-mono transition-all border
                  ${selectedCategories.includes(cat)
                    ? 'bg-accent-purple/20 border-accent-purple text-white shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                    : 'bg-slate-800/30 border-transparent text-slate-400 hover:bg-slate-800 hover:border-slate-600'}
                `}
                aria-pressed={selectedCategories.includes(cat)}
              >
                <div className="flex justify-between items-center">
                  <span>{cat.split(' ')[0]}...</span>
                  {selectedCategories.includes(cat) && <Check size={12} />}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <ShieldAlert size={12} /> Threat Matrix
          </h4>
          <div className="space-y-2">
            {dangerLevels.map(lvl => {
               let colorClass = 'hover:border-slate-500';
               if(lvl.includes('Harm') || lvl.includes('Harmlos')) colorClass = 'hover:border-green-500 text-green-400';
               if(lvl.includes('Extrem') || lvl.includes('Threat')) colorClass = 'hover:border-red-500 text-red-400';
               const isSelected = selectedDanger.includes(lvl);
               return (
                <button
                  key={lvl}
                  onClick={() => handleToggleDanger(lvl)}
                  className={`
                    w-full text-left px-3 py-2.5 rounded text-sm md:text-xs font-bold uppercase tracking-wider transition-all border
                    ${isSelected
                      ? 'bg-slate-800 border-white text-white shadow-lg'
                      : `bg-slate-800/30 border-transparent text-slate-500 ${colorClass}`}
                  `}
                  aria-pressed={isSelected}
                >
                  <div className="flex justify-between items-center">
                    <span>{lvl}</span>
                    {isSelected && <ShieldAlert size={12} className="animate-pulse" />}
                  </div>
                </button>
               )
            })}
          </div>
        </div>
        <div>
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Hash size={12} /> Metadata Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {tagData.uniqueTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleSetTag(selectedTag === tag ? null : tag)}
                className={`
                  px-3 py-1.5 md:px-2 md:py-1 rounded text-xs font-mono border transition-all
                  ${selectedTag === tag
                    ? 'bg-accent-cyan text-slate-900 border-accent-cyan font-bold'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'}
                `}
                aria-pressed={selectedTag === tag}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button 
        onClick={() => setIsFilterOpen(false)}
        className="absolute top-2 right-2 p-2 text-slate-500 hover:text-white"
        aria-label="Close filters"
      >
        <X size={24} />
      </button>
    </div>
  );
};

const ListHeader: React.FC = () => {
  const { t, count, searchTerm, handleSetSearch, isFilterOpen, setIsFilterOpen, sortOption, handleSetSort } = useTheoryList();

  return (
    <PageHeader 
      title={t.list.title}
      subtitle={`${count} RECORDS FOUND`}
      icon={Cloud}
      actions={<ViewSwitcher />}
    >
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={t.list.searchPlaceholder}
            aria-label={t.list.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSetSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-base md:text-sm focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all font-mono text-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-expanded={isFilterOpen}
            className={`
                px-4 py-3 rounded-lg border flex-1 md:flex-none justify-center items-center gap-2 text-sm font-medium transition-all
                ${isFilterOpen 
                ? 'bg-slate-800 border-slate-600 text-white' 
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'}
            `}
            >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
            {isFilterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <div className="relative flex-1 md:flex-none">
            <select 
                value={sortOption}
                onChange={(e) => handleSetSort(e.target.value as SortOption)}
                aria-label="Sort theories"
                className="w-full h-full appearance-none bg-slate-900/50 border border-slate-700 text-slate-400 pl-4 pr-10 py-3 rounded-lg text-sm focus:outline-none focus:border-accent-cyan cursor-pointer hover:bg-slate-800 transition-colors"
            >
                <option value="POPULARITY_DESC">Viral (High)</option>
                <option value="POPULARITY_ASC">Viral (Low)</option>
                <option value="YEAR_DESC">Newest</option>
                <option value="YEAR_ASC">Oldest</option>
                <option value="TITLE_ASC">A-Z</option>
            </select>
            <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
        </div>
      </div>
      <FilterPanel />
    </PageHeader>
  );
};

const ListResults: React.FC = () => {
  const { processedTheories, viewMode, t, handleResetFilters } = useTheoryList();

  if (processedTheories.length === 0) {
    return (
      <EmptyState 
        title={t.list.noResults}
        description={t.list.noResultsSub}
        icon={AlertTriangle}
        action={
          <Button variant="secondary" onClick={handleResetFilters} icon={<RefreshCcw size={14}/>}>
            Clear Filters
          </Button>
        }
      />
    );
  }

  return (
    <div className="pb-20">
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {processedTheories.map((t, i) => <ArchiveGridCard key={t.id} theory={t} index={i} />)}
        </div>
      )}
      {viewMode === 'LIST' && (
        <div className="space-y-3">
          {processedTheories.map((t, i) => <ArchiveListRow key={t.id} theory={t} index={i} />)}
        </div>
      )}
      {viewMode === 'COMPACT' && (
         <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 overflow-x-auto">
            <div className="min-w-[600px] grid grid-cols-12 gap-4 p-3 bg-slate-950 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
               <div className="col-span-1">ID</div>
               <div className="col-span-4">Title</div>
               <div className="col-span-2">Type</div>
               <div className="col-span-2">Origin</div>
               <div className="col-span-2">Virality</div>
               <div className="col-span-1">Action</div>
            </div>
            {processedTheories.map((t, i) => <ArchiveCompactRow key={t.id} theory={t} index={i} />)}
         </div>
      )}
    </div>
  );
};

// --- 4. Main Component ---

export const TheoryList: React.FC = () => {
  return (
      <TheoryListProvider>
        <PageFrame>
           <ListHeader />
           <div className="pt-2">
              <ListResults />
           </div>
        </PageFrame>
      </TheoryListProvider>
  );
};

export default TheoryList;