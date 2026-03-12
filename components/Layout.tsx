import React, {
  useState, useEffect, useRef, useLayoutEffect, Suspense, useMemo, useCallback
} from 'react';
import {
  LayoutDashboard, BookOpen, MessageSquare, Skull, Menu, X, GlobeLock, Settings, HelpCircle, ShieldAlert, Activity, Film, Database, WifiOff, Download, Power, Edit3, Feather, Search as SearchIcon, FileKey, RefreshCw, KeyRound, Smartphone, Monitor
} from 'lucide-react';
import {
  Outlet, NavLink, useLocation, useNavigate
} from 'react-router-dom';
import { BeforeInstallPromptEvent, NavItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from './ui/Common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addLog } from '../store/slices/settingsSlice';
import { secureApiKeyService } from '../services/secureApiKeyService';
import {
  setSearchOpen, selectActiveFile, showUpdateModal, hideUpdateModal, dismissUpdateModal
} from '../store/slices/uiSlice';
import { syncStaticData } from '../store/slices/theoriesSlice';
import { OmniSearch } from './OmniSearch';
import { OnboardingTour } from './OnboardingTour';
import { WhatsNewModal } from './ui/WhatsNewModal';
import { playSound, haptic } from '../utils/microInteractions';

// --- Ambient Background (Memoized) ---
const BackgroundGrid = React.memo(() => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
    {/* Base Grid */}
    <div className="absolute inset-0 bg-grid" />
    {/* Vignette */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
    {/* Radial fade from center */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_70%)]" />
    {/* Orbs */}
    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent-cyan/[0.04] blur-[120px] rounded-full animate-pulse-slow" />
    <div className="absolute top-[30%] -right-[5%] w-[30%] h-[30%] bg-accent-purple/[0.04] blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }} />
    <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] bg-blue-500/[0.02] blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '6s' }} />
  </div>
));

// --- Sidebar Footer (Memoized) ---
const SystemIntegrityFooter: React.FC<{ isOnline: boolean; hasApiKey: boolean; isStandalone: boolean }> = React.memo(({ isOnline, hasApiKey, isStandalone }) => {
    const [latency, setLatency] = useState(24);
    const { t } = useLanguage();
    const navigate = useNavigate();
    const APP_VERSION = '1.0.0';

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(prev => {
                const noise = Math.floor(Math.random() * 6) - 3;
                return Math.max(12, Math.min(60, prev + noise));
            });
        }, 4000); 
        return () => clearInterval(interval);
    }, []);

    const handleReboot = useCallback(() => window.location.reload(), []);

    return (
        <div className="p-4 border-t border-slate-800/50 bg-[#020617] relative z-10 pb-safe-bottom">
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            <div className="flex flex-col gap-3">
                {/* API Key + Standalone Status Row */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => navigate('/settings')}
                        className={cn(
                            'inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[8px] font-mono uppercase tracking-wider transition-all hover:border-accent-cyan/50 focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none',
                            hasApiKey
                                ? 'bg-green-950/30 border-green-800/40 text-green-500'
                                : 'bg-amber-950/30 border-amber-800/40 text-amber-500 animate-pulse'
                        )}
                        title={hasApiKey ? 'API Key: Configured' : 'API Key: Not set – click to configure'}
                    >
                        <KeyRound size={9} />
                        {hasApiKey ? 'BYOK_OK' : 'NO_KEY'}
                    </button>
                    {isStandalone && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-950/30 border border-purple-800/40 text-[8px] font-mono text-purple-400 uppercase tracking-wider">
                            <Smartphone size={9} /> PWA
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", isOnline ? 'bg-green-500 text-green-500' : 'bg-red-500 text-red-500')} />
                          <div className={cn("absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-30", isOnline ? 'bg-green-500' : 'bg-red-500')} />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest leading-none">
                                {isOnline ? 'UPLINK_OK' : 'OFFLINE'}
                            </div>
                            <div className="text-[9px] text-slate-600 font-mono leading-none mt-1">
                                {isOnline ? `LATENCY: ${latency}ms` : 'CACHE_MODE'}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-900/50 border border-slate-800 text-[8px] font-mono text-slate-500 uppercase tracking-wider">
                            v{APP_VERSION}
                        </span>
                        <button 
                            onClick={handleReboot}
                            className="text-slate-600 hover:text-accent-cyan transition-all p-2 rounded-lg hover:bg-slate-900 active:scale-95 touch-manipulation focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none hover:shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                            title={t.layout.footer.reboot}
                          aria-label={t.layout.footer.reboot}
                        >
                            <Power size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

const ContentLoader = () => {
  const { t } = useLanguage();

  return (
    <div className="flex h-full w-full items-center justify-center min-h-[400px] animate-fade-in" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
          <div className="relative">
              <div className="w-14 h-14 border-2 border-slate-800 rounded-full backdrop-blur-sm"></div>
              <div className="absolute inset-0 border-t-2 border-accent-cyan rounded-full animate-spin"></div>
              <div className="absolute inset-1.5 border-t border-purple-500/50 rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-0 w-14 h-14 bg-accent-cyan/5 rounded-full blur-xl" />
          </div>
          <div className="text-[10px] font-mono text-slate-500 animate-pulse tracking-[0.2em] uppercase">{t.layout.loadingModule}</div>
          <span className="sr-only">{t.a11y?.loading || t.common.loading}</span>
          {/* Skeleton preview bars */}
          <div className="flex flex-col gap-2 w-48 opacity-40">
            <div className="h-2 w-full rounded shimmer-loading" />
            <div className="h-2 w-3/4 rounded shimmer-loading" style={{ animationDelay: '200ms' }} />
            <div className="h-2 w-5/6 rounded shimmer-loading" style={{ animationDelay: '400ms' }} />
          </div>
      </div>
    </div>
  );
};

// --- Active File Component ---
const ActiveFileIndicator: React.FC = React.memo(() => {
    const activeFileId = useAppSelector(selectActiveFile);
    const navigate = useNavigate();
  const { t } = useLanguage();
    
    if (!activeFileId) return null;

    return (
        <div 
            onClick={() => navigate(`/archive/${activeFileId}`)}
            className="mx-3 mt-2 mb-4 p-3 bg-slate-900/50 border border-slate-800 rounded-lg cursor-pointer hover:border-accent-cyan/50 hover:bg-slate-900 transition-all group active:scale-98 focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/archive/${activeFileId}`)}
            aria-label={`${t.layout.activeFileAriaPrefix} ${activeFileId}`}
        >
            <div className="flex items-center gap-2 mb-1.5">
                <FileKey size={12} className="text-accent-cyan" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-accent-cyan transition-colors">{t.layout.openFile}</span>
            </div>
            <div className="text-xs font-mono text-slate-300 truncate font-bold group-hover:text-white transition-colors">
                {activeFileId.toUpperCase()}
            </div>
        </div>
    );
});

// --- Nav Button (Memoized) ---
const NavButton: React.FC<{ item: NavItem & { path: string }, id?: string, onClick?: () => void }> = React.memo(({ item, id, onClick }) => {
  const soundEnabled = useAppSelector(s => s.settings.config.soundEnabled);
  const handleClick = useCallback(() => {
    playSound('navigate', soundEnabled);
    haptic('light');
    onClick?.();
  }, [soundEnabled, onClick]);

  return (
    <NavLink
      id={id}
      to={item.path}
      onClick={handleClick}
      className={({ isActive }) => cn(
        "group relative flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan touch-manipulation active:scale-98",
        isActive 
          ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
      )}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent-cyan rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />}
          <div className={cn("transition-transform duration-300", isActive ? 'scale-105' : 'group-hover:scale-105')}>
            {React.cloneElement(item.icon as React.ReactElement<Record<string, unknown>>, { size: 20 })}
          </div>
          <div className="flex flex-col items-start text-left min-w-0 flex-1">
            <span className="text-xs font-bold font-display uppercase tracking-wide truncate w-full">
              {item.label}
            </span>
          </div>
          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_cyan] animate-pulse" />}
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
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const isStandalone = useMemo(() =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true,
  []);
  
  // Update State
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [wbRegistration, setWbRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const updateModalState = useAppSelector(state => state.ui.updateModal);
  const hasSeenOnboarding = useAppSelector(state => state.settings.config.hasSeenOnboarding);
  const APP_VERSION = '1.0.0';

  // Check API key status on mount and when returning to app
  useEffect(() => {
    const checkKey = () => { secureApiKeyService.hasApiKey().then(setHasApiKey).catch(() => setHasApiKey(false)); };
    checkKey();
    const onFocus = () => checkKey();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Check version and show update modal on mount (only if onboarding is complete)
  useEffect(() => {
    if (!hasSeenOnboarding) return; // Don't show WhatsNew until onboarding is done
    
    const lastSeenVersion = localStorage.getItem('disinfodesk_last_seen_version') || '0.0.0';
    if (lastSeenVersion !== APP_VERSION) {
      dispatch(showUpdateModal());
    }
  }, [dispatch, hasSeenOnboarding]);

  // Initial Sync
  useEffect(() => {
      dispatch(syncStaticData());
  }, [dispatch]);

  // Service Worker Registration & Update Handling
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
      const swUrl = `${(import.meta as unknown as { env: Record<string, string> }).env.BASE_URL}sw.js`;

      navigator.serviceWorker.register(swUrl, { scope: (import.meta as unknown as { env: Record<string, string> }).env.BASE_URL })
            .then(registration => {
            setWbRegistration(registration);
            
            if (registration.waiting) {
                // SW already waiting — apply immediately
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }

            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New version installed — auto-activate without user action
                    setUpdateAvailable(true);
                    dispatch(addLog({ message: 'System Update: Protocol patch detected. Auto-applying...', type: 'info' }));
                    if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                    }
                };
                }
            };

            // Poll for SW updates every 60 seconds
            const updateInterval = setInterval(() => {
                registration.update().catch(() => {});
            }, 60 * 1000);

            // Check for updates when user returns to tab
            const onVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    registration.update().catch(() => {});
                }
            };
            document.addEventListener('visibilitychange', onVisibilityChange);

            // Register periodic background sync for content freshness
            if ('periodicSync' in registration) {
                (registration as unknown as { periodicSync: { register: (tag: string, opts: { minInterval: number }) => Promise<void> } }).periodicSync
                    .register('disinfodesk-content-refresh', { minInterval: 24 * 60 * 60 * 1000 })
                    .catch(() => { /* Permission not granted – graceful fallback */ });
            }

            // Cleanup on unmount
            return () => {
                clearInterval(updateInterval);
                document.removeEventListener('visibilitychange', onVisibilityChange);
            };
            })
            .catch(err => {
            console.error('SW Registration failed:', err);
            dispatch(addLog({ message: `SW Error: ${err.message || 'Registration failed'}`, type: 'warning' }));
            });
            
            // Listen for new SW activation — and for version notifications
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });

            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data?.type === 'SW_ACTIVATED') {
                    dispatch(addLog({ message: `System Update: SW ${event.data.version} activated.`, type: 'info' }));
                }
            });
      } catch (e) {
          console.error("Critical SW Error", e);
      }
    }
  }, [dispatch]);

  const handleUpdateApp = useCallback(() => {
    if (wbRegistration?.waiting) {
        wbRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else if (navigator.serviceWorker?.controller) {
        // No waiting worker — force purge caches and reload
        navigator.serviceWorker.controller.postMessage({ type: 'FORCE_REFRESH' });
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
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      dispatch(addLog({ message: 'PWA installed successfully.', type: 'success' }));
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [dispatch]);

  const handleInstallClick = useCallback(() => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((_choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
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
    { label: t.nav.dashboard, icon: <LayoutDashboard size={22} />, path: '/' },
    { label: t.nav.archive, icon: <BookOpen size={22} />, path: '/archive' },
    { label: t.nav.chat, icon: <MessageSquare size={22} />, path: '/chat' },
    { label: t.nav.database, icon: <Database size={22} />, path: '/database' },
  ], [t]);

  return (
    <div className={cn("h-[100dvh] bg-[#020617] text-slate-200 font-sans flex flex-col md:flex-row overflow-hidden relative selection:bg-accent-cyan/30 selection:text-white", settings.reducedMotion ? 'motion-reduce' : '')}>
      
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent-cyan focus:text-slate-950 focus:rounded-lg focus:font-bold focus:shadow-neon-cyan"
      >
        {t.a11y?.skipToMain || 'Skip to main content'}
      </a>
      
      <BackgroundGrid />
      <OnboardingTour />
      <OmniSearch isOpen={isSearchOpen} onClose={() => dispatch(setSearchOpen(false))} />
      <WhatsNewModal 
        isOpen={updateModalState.isOpen}
        onClose={() => dispatch(hideUpdateModal())}
        onDismiss={() => {
          localStorage.setItem('disinfodesk_last_seen_version', APP_VERSION);
          dispatch(dismissUpdateModal(APP_VERSION));
        }}
      />

      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-safe left-0 right-0 bg-red-950/90 backdrop-blur-xl border-b border-red-500/50 text-white text-[10px] font-bold font-mono text-center py-1.5 z-[100] flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(239,68,68,0.15)]">
          <WifiOff size={10} className="animate-pulse" /> OFFLINE MODE — CACHE ACTIVE
        </div>
      )}

      {/* Update Available Banner */}
      {updateAvailable && (
        <div className="fixed top-safe left-0 right-0 bg-gradient-to-r from-accent-cyan/90 to-cyan-400/90 backdrop-blur-xl border-b border-accent-cyan/50 text-slate-900 text-[10px] font-bold font-mono text-center py-1.5 z-[100] flex items-center justify-center gap-3 animate-fade-in-down shadow-[0_2px_20px_rgba(6,182,212,0.2)]">
          <RefreshCw size={12} className="animate-spin" /> 
          <span>{t.layout.updateAvailable}</span>
          <button 
            onClick={handleUpdateApp}
            className="px-2.5 py-0.5 bg-slate-900 text-accent-cyan rounded-md hover:bg-slate-800 transition-all uppercase border border-slate-700 hover:border-accent-cyan hover:shadow-neon-cyan text-[10px]"
          >
            {t.layout.reload}
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <header className={cn("md:hidden bg-[#020617]/80 backdrop-blur-2xl border-b border-white/[0.06] flex justify-between items-center px-4 fixed top-0 left-0 right-0 z-50 h-[56px] pt-safe shadow-elevation-1 transition-all duration-300", !isOnline || updateAvailable ? 'mt-8' : '')}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-center backdrop-blur-sm">
             <GlobeLock size={16} className="text-accent-cyan" />
          </div>
          <div className="text-sm font-bold font-display tracking-tight text-white">DISINFODESK</div>
        </div>
        
        <div className="flex items-center gap-1">
            <button 
                onClick={() => dispatch(setSearchOpen(true))}
                className="p-2 min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-95"
                aria-label={t.layout.searchAria}
            >
                <SearchIcon size={20} />
            </button>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
              className="p-2 min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-400 hover:text-white transition-colors active:scale-95"
              aria-label={isSidebarOpen ? t.layout.closeMenu : t.layout.openMenu}
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
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-[#020617]/95 backdrop-blur-2xl border-r border-slate-800/50 transform transition-transform duration-300 ease-out shadow-2xl md:shadow-none",
          "md:relative md:translate-x-0 md:w-64 md:z-0 flex flex-col pt-safe pb-safe",
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          !isOnline || updateAvailable ? 'mt-8 md:mt-0' : ''
        )}
      >
        {/* Sidebar right edge glow */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700/30 to-transparent pointer-events-none" aria-hidden="true" />
        
        {/* Sidebar Header */}
        <div className="p-6 relative z-10 hidden md:block">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <GlobeLock size={20} className="text-accent-cyan group-hover:text-white transition-colors relative z-10" />
            </div>
            <div>
              <div className="font-bold font-display text-lg text-white tracking-tight leading-none">DISINFODESK</div>
              <div className="text-[9px] font-mono text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-accent-cyan/60" />
                v2.8.0 PWA
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-slate-800 via-slate-700/50 to-slate-800" />
        </div>
        
        {/* Mobile Sidebar Close */}
        <div className="md:hidden p-4 flex justify-between items-center border-b border-slate-800/50">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">{t.layout.systemMenu}</span>
             <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-white p-2 rounded-lg hover:bg-slate-900" aria-label={t.layout.closeSidebar}><X size={20}/></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-800">
          
          <ActiveFileIndicator />

          <div className="space-y-1">
            <div className="px-6 mb-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">{t.layout.operations}</div>
            {navItems.map((item) => (
              <NavButton key={item.id} item={item} id={item.id === 'CHAT' ? 'nav-chat' : undefined} onClick={() => setSidebarOpen(false)} />
            ))}
          </div>

          <div className="space-y-1">
            <div className="px-6 mb-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">{t.layout.systemSection}</div>
            {bottomItems.map((item) => (
               <NavButton key={item.id} item={item} onClick={() => setSidebarOpen(false)} />
            ))}
          </div>

          {installPrompt && !isInstalled && (
            <div className="px-4 mt-4">
               <button 
                 onClick={handleInstallClick}
                 className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-accent-cyan/10 to-purple-500/10 border border-accent-cyan/30 rounded-lg hover:border-accent-cyan/60 transition-all group text-left active:scale-95 shadow-md focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                 aria-label={t.layout.installAppAria}
               >
                 <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center shrink-0">
                   <Download size={16} className="text-accent-cyan group-hover:animate-bounce" />
                 </div>
                 <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider">{t.layout.sidebar.install}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{t.layout.sidebar.installSub || 'Chrome App · Android · Desktop'}</div>
                 </div>
               </button>
            </div>
          )}
          {isInstalled && (
            <div className="px-4 mt-4">
              <div className="w-full flex items-center gap-3 p-3 bg-green-950/20 border border-green-800/30 rounded-lg">
                <Monitor size={16} className="text-green-500" />
                <div className="text-[10px] font-bold text-green-400 uppercase tracking-wider">{t.layout.sidebar.installed || 'APP INSTALLIERT'}</div>
              </div>
            </div>
          )}
        </nav>

        <SystemIntegrityFooter isOnline={isOnline} hasApiKey={hasApiKey} isStandalone={isStandalone} />
      </aside>

      {/* Main Content Area */}
      <main id="main-content" className={cn("flex-1 w-full h-full relative overflow-hidden bg-transparent flex flex-col pt-[56px] md:pt-0 transition-all duration-300", !isOnline || updateAvailable ? 'mt-8' : '')} role="main" aria-label="Hauptinhalt">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#020617]/85 backdrop-blur-2xl border-t border-white/[0.06] pb-safe-bottom shadow-[0_-4px_30px_rgba(0,0,0,0.6)]" aria-label="Mobile navigation">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent pointer-events-none" />
        <div className="flex justify-around items-center h-[60px]">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all active:scale-90 outline-none focus-visible:text-accent-cyan relative",
                isActive ? 'text-accent-cyan' : 'text-slate-500 hover:text-slate-300'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-accent-cyan rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />}
                  <div className={cn("relative transition-all duration-200", isActive ? "-translate-y-0.5" : "")}>
                    {React.cloneElement(item.icon as React.ReactElement<Record<string, unknown>>, { 
                      size: 22, 
                      className: isActive ? "drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "" 
                    })}
                  </div>
                  <span className={cn("text-[9px] font-bold uppercase tracking-wider transition-opacity", isActive ? "opacity-100" : "opacity-60")}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  );
};