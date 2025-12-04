
import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react';
import { 
  LayoutDashboard, BookOpen, MessageSquare, Skull, Menu, X, 
  GlobeLock, Settings, HelpCircle, ShieldAlert, Activity, 
  Film, Database, WifiOff, Download, Signal, Power, Edit3,
  Feather, Search as SearchIcon, Cpu, RefreshCw, Wifi, Loader2
} from 'lucide-react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BeforeInstallPromptEvent, NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { TechIconBox } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addLog } from '../store/slices/settingsSlice';
import { saveScrollPosition, setSearchOpen } from '../store/slices/uiSlice';
import { OmniSearch } from './OmniSearch';
import { OnboardingTour } from './OnboardingTour';

// --- Sidebar Footer Component (Simplified) ---
const SystemIntegrityFooter: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
    const [latency, setLatency] = useState(24);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => {
                const noise = Math.floor(Math.random() * 10) - 5;
                return Math.max(12, Math.min(99, prev + noise));
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleReboot = () => {
        window.location.reload();
    };

    return (
        <div className="p-4 border-t border-slate-800/50 bg-slate-950/50 relative z-10 backdrop-blur-md pb-safe-bottom">
            <div className="flex flex-col gap-3">
                {/* Status Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${isOnline ? 'bg-green-500/10 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-red-500/10 text-red-400'}`}>
                            <Wifi size={14} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold font-display text-slate-300 uppercase tracking-widest leading-none">
                                {isOnline ? 'Uplink Stable' : 'Offline Mode'}
                            </div>
                            <div className="text-[9px] text-slate-500 font-mono leading-none mt-1">
                                {isOnline ? `PING ${latency}ms` : 'CACHE_ONLY'}
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleReboot}
                        className="p-2 text-slate-600 hover:text-accent-cyan hover:bg-slate-900 rounded-lg transition-colors group relative"
                        title="System Reboot"
                    >
                        <Power size={14} />
                    </button>
                </div>
                
                {/* ID Tag */}
                <div className="flex justify-between items-center text-[9px] text-slate-700 font-mono border-t border-slate-800/50 pt-2">
                    <span>ID: 0x{latency.toString(16).toUpperCase()}9F</span>
                    <span className="flex items-center gap-1"><Cpu size={8}/> 2.5 GHz</span>
                </div>
            </div>
        </div>
    );
};

const ContentLoader = () => (
  <div className="flex h-full w-full items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4 opacity-50">
        <Loader2 className="animate-spin text-accent-cyan" size={32} />
        <div className="text-xs font-mono text-accent-cyan animate-pulse">LOADING_MODULE...</div>
    </div>
  </div>
);

export const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Reference to the main scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Redux Scroll Persistence & Global Search
  const savedScrollPosition = useAppSelector(state => state.ui.scrollPositions[location.pathname]);
  const isSearchOpen = useAppSelector(state => state.ui.isSearchOpen);
  
  // PWA & Network State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Restore scroll position on navigation
  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
        // If we have a saved position, restore it. Otherwise top.
        const targetScroll = savedScrollPosition || 0;
        scrollContainerRef.current.scrollTo({
            top: targetScroll,
            left: 0,
            behavior: 'auto' // Instant jump to prevent visual flicker
        });
    }
  }, [location.pathname]); // Re-run when path changes

  // Save scroll position on scroll event (debounced or on cleanup)
  useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const handleScroll = () => {
          // We save the position for the CURRENT path
          dispatch(saveScrollPosition({ path: location.pathname, position: container.scrollTop }));
      };

      // Add listener
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
  }, [location.pathname, dispatch]);

  // Keyboard Listener for OmniSearch (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setSearchOpen(true));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    dispatch(addLog({ message: `Navigation: Route changed to [${location.pathname}]`, type: 'info' }));
    setSidebarOpen(false);
  }, [location, dispatch]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setInstallPrompt(null);
    });
  };

  const navItems: (NavItem & { path: string })[] = [
    { id: 'DASHBOARD', label: t.nav.dashboard, icon: <LayoutDashboard size={18} />, sub: 'OVERVIEW', path: '/' },
    { id: 'LIST', label: t.nav.archive, icon: <BookOpen size={18} />, sub: 'DATABASE', path: '/archive' },
    { id: 'MEDIA', label: t.nav.media, icon: <Film size={18} />, sub: 'CULTURE', path: '/media' },
    { id: 'AUTHORS', label: t.nav.authors, icon: <Feather size={18} />, sub: 'PROFILES', path: '/authors' },
    { id: 'DANGEROUS', label: t.nav.dangerous, icon: <ShieldAlert size={18} />, sub: 'THREATS', path: '/dangerous' },
    { id: 'VIRALITY', label: t.nav.virality, icon: <Activity size={18} />, sub: 'ANALYTICS', path: '/virality' },
    { id: 'CHAT', label: t.nav.chat, icon: <MessageSquare size={18} />, sub: 'AI UPLINK', path: '/chat' },
    { id: 'SATIRE', label: t.nav.generator, icon: <Skull size={18} />, sub: 'SIMULATION', path: '/satire' },
    { id: 'EDITOR', label: 'Theory Lab', icon: <Edit3 size={18} />, sub: 'CREATOR', path: '/editor' },
  ];

  const bottomItems: (NavItem & { path: string })[] = [
    { id: 'DATABASE', label: t.nav.database || 'The Vault', icon: <Database size={18} />, sub: 'STORAGE', path: '/database' },
    { id: 'SETTINGS', label: t.nav.settings, icon: <Settings size={18} />, sub: 'CONFIG', path: '/settings' },
    { id: 'HELP', label: t.nav.help, icon: <HelpCircle size={18} />, sub: 'MANUAL', path: '/help' },
  ];

  // Config for Mobile Bottom Bar
  const mobileNavItems = [
    { label: 'Dash', icon: <LayoutDashboard size={20} />, path: '/' },
    { label: 'Archiv', icon: <BookOpen size={20} />, path: '/archive' },
    { label: 'Media', icon: <Film size={20} />, path: '/media' },
    { label: 'Autoren', icon: <Feather size={20} />, path: '/authors' },
    { label: 'Gen', icon: <Skull size={20} />, path: '/satire' },
    { label: 'Vault', icon: <Database size={20} />, path: '/database' },
  ];

  const NavButton: React.FC<{ item: NavItem & { path: string }, isBottom?: boolean, id?: string }> = ({ item, isBottom = false, id }) => {
    const activeColorClass = isBottom ? 'text-accent-purple' : 'text-accent-cyan';
    const activeBgClass = isBottom ? 'bg-accent-purple/10 border-accent-purple/50' : 'bg-accent-cyan/10 border-accent-cyan/50';
    const glowClass = isBottom ? 'shadow-[0_0_15px_rgba(139,92,246,0.15)]' : 'shadow-[0_0_15px_rgba(6,182,212,0.15)]';

    return (
      <NavLink
        id={id}
        to={item.path}
        className={({ isActive }) => `
          group relative w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan
          ${isActive 
            ? `${activeBgClass} ${activeColorClass} ${glowClass}` 
            : 'border-transparent hover:bg-slate-800/50 hover:border-slate-700 text-slate-400 hover:text-slate-200'}
        `}
      >
        {({ isActive }) => (
          <>
            {/* Active Indicator Line */}
            {isActive && (
              <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${isBottom ? 'bg-accent-purple' : 'bg-accent-cyan'}`}></div>
            )}

            {/* Icon Box */}
            <div className={`
              p-2 rounded-lg transition-all duration-300
              ${isActive ? 'bg-slate-950/50 scale-110' : 'bg-slate-900 border border-slate-800 group-hover:border-slate-600'}
            `}>
              {item.icon}
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start text-left">
              <span className={`text-xs font-bold font-display tracking-wider uppercase ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
              <span className="text-[9px] font-mono opacity-50 tracking-widest group-hover:tracking-[0.2em] transition-all">
                {item.sub}
              </span>
            </div>

            {/* Hover Arrow */}
            <div className={`absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 -translate-x-2`}>
              <div className={`w-1.5 h-1.5 border-t border-r rotate-45 ${isActive ? activeColorClass : 'text-slate-500'}`}></div>
            </div>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <div className="h-[100dvh] bg-mystic-dark text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden relative selection:bg-accent-cyan/30 selection:text-white">
      
      <OnboardingTour />
      <OmniSearch isOpen={isSearchOpen} onClose={() => dispatch(setSearchOpen(false))} />

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-safe left-0 right-0 bg-red-900/90 backdrop-blur border-b border-red-500 text-white text-[10px] font-bold font-mono text-center py-1 z-[100] animate-fade-in flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          <WifiOff size={10} />
          OFFLINE MODE // LOCAL CACHE ACCESS ONLY
        </div>
      )}

      {/* Mobile Header */}
      <header className={`md:hidden bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 flex justify-between items-center px-4 fixed top-0 left-0 right-0 z-50 h-[60px] pt-safe shadow-lg transition-all ${!isOnline ? 'mt-6' : ''}`}>
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-accent-cyan to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
             <GlobeLock size={18} className="text-white" />
          </div>
          <div>
             <div className="font-bold text-lg font-display tracking-tight leading-none text-white">DISINFODESK</div>
             <div className="text-[9px] text-accent-cyan font-mono leading-none mt-1 tracking-widest">MOBILE UPLINK</div>
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-1">
            <button 
                onClick={() => dispatch(setSearchOpen(true))}
                aria-label="Open Search"
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
            >
                <SearchIcon size={22} />
            </button>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-40 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        id="nav-sidebar"
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] border-r border-slate-800/50 transform transition-transform duration-300 cubic-bezier(0.2, 0, 0, 1) shadow-2xl md:shadow-none
        md:relative md:translate-x-0 md:w-72 md:z-0 flex flex-col pt-safe pb-safe
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${!isOnline ? 'mt-6 md:mt-0' : ''}
      `}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-950 pointer-events-none"></div>

        {/* Sidebar Header */}
        <div className="p-6 pb-2 relative z-10 hidden md:block">
          <div className="flex items-center gap-4 mb-6">
            <TechIconBox icon={GlobeLock} className="w-12 h-12" />

            <div>
              <div className="font-black font-display text-3xl text-white tracking-tighter leading-none uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">DISINFODESK</div>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                 <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em]">System Online</div>
              </div>
            </div>
          </div>
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-4"></div>
        </div>
        
        <div className="md:hidden p-4 flex justify-end">
             <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="text-slate-500 hover:text-white p-2"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="space-y-2">
            <div className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono mb-2">Primary Modules</div>
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} id={item.id === 'CHAT' ? 'nav-chat' : undefined} />
            ))}
          </div>

          <div className="space-y-2">
            <div className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest font-mono mb-2">System Core</div>
            {bottomItems.map((item) => (
               <NavButton key={item.id} item={item} isBottom />
            ))}
          </div>

          {installPrompt && (
            <div className="pt-2">
               <button 
                 onClick={handleInstallClick}
                 className="w-full relative overflow-hidden group bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 hover:border-accent-cyan/50 p-4 rounded-xl text-left transition-all"
               >
                 <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <Download size={16} className="text-accent-cyan" />
                        <div>
                            <div className="text-xs font-bold text-white">INSTALL APP</div>
                            <div className="text-[9px] text-slate-400 font-mono">Local Protocol</div>
                        </div>
                    </div>
                    <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full shadow-[0_0_8px_cyan]"></div>
                 </div>
               </button>
            </div>
          )}
        </div>

        <SystemIntegrityFooter isOnline={isOnline} />
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 w-full h-full relative overflow-hidden bg-mystic-dark transition-all flex flex-col pt-[60px] md:pt-0 ${!isOnline ? 'mt-6' : ''}`} role="main">
        <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-0 left-0 w-full h-32 bg-accent-cyan/5 blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-full h-32 bg-accent-purple/5 blur-[100px]"></div>
        </div>

        <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar overscroll-contain pb-24 md:pb-0"
        >
            <Suspense fallback={<ContentLoader />}>
              <Outlet />
            </Suspense>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50 pb-safe-bottom">
        <div className="flex items-center justify-around px-2">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center py-2 px-1 w-full transition-all duration-300
                ${isActive ? 'text-accent-cyan' : 'text-slate-500 hover:text-slate-300'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-accent-cyan/10' : ''}`}>
                    {React.cloneElement(item.icon as React.ReactElement, { 
                      className: isActive ? 'drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]' : '' 
                    })}
                  </div>
                  <span className="text-[9px] font-bold mt-0.5 tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  );
};