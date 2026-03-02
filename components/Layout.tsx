import React, { useState, useEffect, useRef, useLayoutEffect, Suspense, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, BookOpen, MessageSquare, Skull, Menu, X, 
  GlobeLock, Settings, HelpCircle, ShieldAlert, Activity, 
  Film, Database, WifiOff, Download, Power, Edit3,
  Feather, Search as SearchIcon, Cpu, FileKey, RefreshCw
} from 'lucide-react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BeforeInstallPromptEvent, NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addLog } from '../store/slices/settingsSlice';
import { saveScrollPosition, setSearchOpen, selectActiveFile } from '../store/slices/uiSlice';
import { syncStaticData } from '../store/slices/theoriesSlice';
import { OmniSearch } from './OmniSearch';
import { OnboardingTour } from './OnboardingTour';

// --- Ambient Background (Memoized) ---
const BackgroundGrid = React.memo(() => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
    {/* Base Grid */}
    <div className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-[0.02]" />
    {/* Vignette */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
    {/* Orbs */}
    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent-cyan/5 blur-[100px] rounded-full animate-pulse-slow" />
    <div className="absolute top-[30%] -right-[5%] w-[30%] h-[30%] bg-accent-purple/5 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }} />
  </div>
));

// --- Sidebar Footer (Memoized) ---
const SystemIntegrityFooter: React.FC<{ isOnline: boolean }> = React.memo(({ isOnline }) => {
    const [latency, setLatency] = useState(24);
    const { t } = useLanguage();

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => {
                // Simulate jitter
                const noise = Math.floor(Math.random() * 6) - 3;
                return Math.max(12, Math.min(60, prev + noise));
            });
        }, 4000); 
        return () => clearInterval(interval);
    }, []);

    const handleReboot = useCallback(() => window.location.reload(), []);

    return (
        <div className="p-4 border-t border-slate-800 bg-[#020617] relative z-10 pb-safe-bottom">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", isOnline ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500')} />
                        <div className="min-w-0">
                            <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest leading-none">
                                {isOnline ? 'UPLINK_OK' : 'OFFLINE'}
                            </div>
                            <div className="text-[9px] text-slate-600 font-mono leading-none mt-1">
                                {isOnline ? `LATENCY: ${latency}ms` : 'CACHE_MODE'}
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleReboot}
                        className="text-slate-600 hover:text-accent-cyan transition-colors p-2 rounded hover:bg-slate-900 active:scale-95 touch-manipulation focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
                        title={t.layout.footer.reboot}
                        aria-label="Reboot System"
                    >
                        <Power size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
});

const ContentLoader = () => (
  <div className="flex h-full w-full items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
        <div className="relative">
            <div className="w-12 h-12 border-2 border-slate-800 rounded-full"></div>
            <div className="absolute inset-0 border-t-2 border-accent-cyan rounded-full animate-spin"></div>
        </div>
        <div className="text-[10px] font-mono text-slate-500 animate-pulse tracking-[0.2em] uppercase">Loading Module</div>
    </div>
  </div>
);

// --- Active File Component ---
const ActiveFileIndicator: React.FC = React.memo(() => {
    const activeFileId = useAppSelector(selectActiveFile);
    const navigate = useNavigate();
    
    if (!activeFileId) return null;

    return (
        <div 
            onClick={() => navigate(`/archive/${activeFileId}`)}
            className="mx-3 mt-2 mb-4 p-3 bg-slate-900/50 border border-slate-800 rounded-lg cursor-pointer hover:border-accent-cyan/50 hover:bg-slate-900 transition-all group active:scale-98 focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/archive/${activeFileId}`)}
            aria-label={`Open active file ${activeFileId}`}
        >
            <div className="flex items-center gap-2 mb-1.5">
                <FileKey size={12} className="text-accent-cyan" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-accent-cyan transition-colors">Open File</span>
            </div>
            <div className="text-xs font-mono text-slate-300 truncate font-bold group-hover:text-white transition-colors">
                {activeFileId.toUpperCase()}
            </div>
        </div>
    );
});

// --- Nav Button (Memoized) ---
const NavButton: React.FC<{ item: NavItem & { path: string }, id?: string, onClick?: () => void }> = React.memo(({ item, id, onClick }) => {
  return (
    <NavLink
      id={id}
      to={item.path}
      onClick={onClick}
      className={({ isActive }) => cn(
        "group relative flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan touch-manipulation active:scale-98",
        isActive 
          ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent"
      )}
    >
      {({ isActive }) => (
        <>
          <div className={cn("transition-transform duration-300", isActive ? 'scale-105' : 'group-hover:scale-105')}>
            {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
          </div>
          <div className="flex flex-col items-start text-left min-w-0 flex-1">
            <span className="text-xs font-bold font-display uppercase tracking-wide truncate w-full">
              {item.label}
            </span>
          </div>
          {isActive && <div className="w-1 h-1 rounded-full bg-accent-cyan shadow-[0_0_5px_cyan]" />}
        </>
      )}
    </NavLink>
  );
});

export const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isSearchOpen = useAppSelector(state => state.ui.isSearchOpen);
  const settings = useAppSelector(state => state.settings.config);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // Update State
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [wbRegistration, setWbRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Initial Sync
  useEffect(() => {
      dispatch(syncStaticData());
  }, [dispatch]);

  // Service Worker Registration & Update Handling
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
        let swUrl = './sw.js';
        
        try {
            if (window.location.href && window.location.href.startsWith('http')) {
                swUrl = new URL('sw.js', window.location.href).href;
            }
        } catch (urlError) {
            console.warn("Failed to construct absolute SW URL, falling back to relative:", urlError);
        }

        navigator.serviceWorker.register(swUrl)
            .then(registration => {
            setWbRegistration(registration);
            
            if (registration.waiting) {
                setUpdateAvailable(true);
            }

            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setUpdateAvailable(true);
                    dispatch(addLog({ message: 'System Update: Protocol patch detected.', type: 'info' }));
                    }
                };
                }
            };
            })
            .catch(err => {
            console.error('SW Registration failed:', err);
            dispatch(addLog({ message: `SW Error: ${err.message || 'Registration failed'}`, type: 'warning' }));
            });
            
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    window.location.reload();
                    refreshing = true;
                }
            });
      } catch (e) {
          console.error("Critical SW Error", e);
      }
    }
  }, [dispatch]);

  const handleUpdateApp = useCallback(() => {
    if (wbRegistration && wbRegistration.waiting) {
        wbRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
        window.location.reload();
    }
  }, [wbRegistration]);

  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]); 

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
    dispatch(addLog({ message: `Nav: Route [${location.pathname}]`, type: 'info' }));
    setSidebarOpen(false);
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        dispatch(addLog({ message: 'Network Uplink Restored', type: 'success' }));
    };
    const handleOffline = () => {
        setIsOnline(false);
        dispatch(addLog({ message: 'Network Uplink Lost. Switching to Offline Cache.', type: 'warning' }));
    };
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
  }, [dispatch]);

  const handleInstallClick = useCallback(() => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
      setInstallPrompt(null);
    });
  }, [installPrompt]);

  const navItems: (NavItem & { path: string })[] = useMemo(() => [
    { id: 'DASHBOARD', label: t.nav.dashboard, icon: <LayoutDashboard size={20} />, sub: t.layout.sub.overview, path: '/' },
    { id: 'LIST', label: t.nav.archive, icon: <BookOpen size={20} />, sub: t.layout.sub.database, path: '/archive' },
    { id: 'MEDIA', label: t.nav.media, icon: <Film size={20} />, sub: t.layout.sub.culture, path: '/media' },
    { id: 'AUTHORS', label: t.nav.authors, icon: <Feather size={20} />, sub: t.layout.sub.profiles, path: '/authors' },
    { id: 'DANGEROUS', label: t.nav.dangerous, icon: <ShieldAlert size={20} />, sub: t.layout.sub.threats, path: '/dangerous' },
    { id: 'VIRALITY', label: t.nav.virality, icon: <Activity size={20} />, sub: t.layout.sub.analytics, path: '/virality' },
    { id: 'CHAT', label: t.nav.chat, icon: <MessageSquare size={20} />, sub: t.layout.sub.uplink, path: '/chat' },
    { id: 'SATIRE', label: t.nav.generator, icon: <Skull size={20} />, sub: t.layout.sub.simulation, path: '/satire' },
    { id: 'EDITOR', label: t.nav.editor, icon: <Edit3 size={20} />, sub: t.layout.sub.creator, path: '/editor' },
  ], [t]);

  const bottomItems: (NavItem & { path: string })[] = useMemo(() => [
    { id: 'DATABASE', label: t.nav.database, icon: <Database size={20} />, sub: t.layout.sub.storage, path: '/database' },
    { id: 'SETTINGS', label: t.nav.settings, icon: <Settings size={20} />, sub: t.layout.sub.config, path: '/settings' },
    { id: 'HELP', label: t.nav.help, icon: <HelpCircle size={20} />, sub: t.layout.sub.manual, path: '/help' },
  ], [t]);

  const mobileNavItems = useMemo(() => [
    { label: 'Dash', icon: <LayoutDashboard size={22} />, path: '/' },
    { label: 'Files', icon: <BookOpen size={22} />, path: '/archive' },
    { label: 'Chat', icon: <MessageSquare size={22} />, path: '/chat' },
    { label: 'Vault', icon: <Database size={22} />, path: '/database' },
  ], []);

  return (
    <div className={cn("h-[100dvh] bg-[#020617] text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden relative selection:bg-accent-cyan/30 selection:text-white", settings.reducedMotion ? 'motion-reduce' : '')}>
      
      <BackgroundGrid />
      <OnboardingTour />
      <OmniSearch isOpen={isSearchOpen} onClose={() => dispatch(setSearchOpen(false))} />

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-safe left-0 right-0 bg-red-900/90 backdrop-blur border-b border-red-500 text-white text-[10px] font-bold font-mono text-center py-1 z-[100] flex items-center justify-center gap-2">
          <WifiOff size={10} /> OFFLINE MODE - CACHE ACTIVE
        </div>
      )}

      {/* Update Available Banner */}
      {updateAvailable && (
        <div className="fixed top-safe left-0 right-0 bg-accent-cyan/90 backdrop-blur border-b border-accent-cyan text-slate-900 text-[10px] font-bold font-mono text-center py-1.5 z-[100] flex items-center justify-center gap-3 animate-fade-in-up shadow-lg">
          <RefreshCw size={12} className="animate-spin" /> 
          <span>SYSTEM UPDATE AVAILABLE</span>
          <button 
            onClick={handleUpdateApp}
            className="px-2 py-0.5 bg-slate-900 text-accent-cyan rounded hover:bg-slate-800 transition-colors uppercase border border-slate-700 hover:border-accent-cyan"
          >
            RELOAD
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <header className={cn("md:hidden bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-4 fixed top-0 left-0 right-0 z-50 h-[56px] pt-safe shadow-lg transition-all duration-300", !isOnline || updateAvailable ? 'mt-8' : '')}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
             <GlobeLock size={16} className="text-white" />
          </div>
          <div className="text-sm font-bold font-display tracking-tight text-white">DISINFODESK</div>
        </div>
        
        <div className="flex items-center gap-1">
            <button 
                onClick={() => dispatch(setSearchOpen(true))}
                className="p-2 text-slate-400 hover:text-white transition-colors active:scale-95"
                aria-label="Search"
            >
                <SearchIcon size={20} />
            </button>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2 text-slate-400 hover:text-white transition-colors active:scale-95"
              aria-label={isSidebarOpen ? "Close Menu" : "Open Menu"}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Navigation */}
      <aside 
        id="nav-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-[#020617] border-r border-slate-800 transform transition-transform duration-300 ease-out shadow-2xl md:shadow-none",
          "md:relative md:translate-x-0 md:w-64 md:z-0 flex flex-col pt-safe pb-safe",
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          !isOnline || updateAvailable ? 'mt-8 md:mt-0' : ''
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 relative z-10 hidden md:block">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner group">
                <GlobeLock size={20} className="text-accent-cyan group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-bold font-display text-lg text-white tracking-tight leading-none">DISINFODESK</div>
              <div className="text-[9px] font-mono text-slate-500 mt-1">v2.7.0 PWA</div>
            </div>
          </div>
          <div className="h-px w-full bg-slate-800" />
        </div>
        
        {/* Mobile Sidebar Close */}
        <div className="md:hidden p-4 flex justify-between items-center border-b border-slate-800/50">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">System Menu</span>
             <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-900" aria-label="Close sidebar"><X size={20}/></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-800">
          
          <ActiveFileIndicator />

          <div className="space-y-1">
            <div className="px-6 mb-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">Operations</div>
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} id={item.id === 'CHAT' ? 'nav-chat' : undefined} onClick={() => setSidebarOpen(false)} />
            ))}
          </div>

          <div className="space-y-1">
            <div className="px-6 mb-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">System</div>
            {bottomItems.map((item) => (
               <NavButton key={item.id} item={item} onClick={() => setSidebarOpen(false)} />
            ))}
          </div>

          {installPrompt && (
            <div className="px-4 mt-4">
               <button 
                 onClick={handleInstallClick}
                 className="w-full flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-accent-cyan/50 transition-colors group text-left active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
                 aria-label="Install App"
               >
                 <Download size={16} className="text-accent-cyan" />
                 <div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider">{t.layout.sidebar.install}</div>
                    <div className="text-[9px] text-slate-500 font-mono">NATIVE_APP</div>
                 </div>
               </button>
            </div>
          )}
        </nav>

        <SystemIntegrityFooter isOnline={isOnline} />
      </aside>

      {/* Main Content Area */}
      <main className={cn("flex-1 w-full h-full relative overflow-hidden bg-transparent flex flex-col pt-[56px] md:pt-0 transition-all duration-300", !isOnline || updateAvailable ? 'mt-8' : '')} role="main">
        <div 
            ref={scrollContainerRef}
            className="flex-1 w-full overflow-y-auto relative z-10 custom-scrollbar overscroll-contain pb-[80px] md:pb-0"
        >
            <Suspense fallback={<ContentLoader />}>
              <Outlet />
            </Suspense>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Glassmorphic) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-t border-white/5 pb-safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center h-[60px]">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-90 outline-none focus-visible:text-accent-cyan",
                isActive ? 'text-accent-cyan' : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {({ isActive }) => (
                <>
                  <div className={cn("relative transition-all", isActive ? "-translate-y-1" : "")}>
                    {React.cloneElement(item.icon as React.ReactElement, { 
                      size: 22, 
                      className: isActive ? "drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "" 
                    })}
                    {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-cyan rounded-full shadow-[0_0_5px_cyan]" />}
                  </div>
                  <span className={cn("text-[9px] font-bold uppercase tracking-wider transition-opacity", isActive ? "opacity-100" : "opacity-70")}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  );
};