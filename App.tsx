
import React, { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from './components/Layout';
import { ErrorFallback, Skeleton } from './components/ui/Common';
import { Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { resetTransientState } from './store/slices/uiSlice';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import { createHashRouter, RouterProvider, Navigate, ScrollRestoration } from 'react-router-dom';

// Lazy Load Components
const Dashboard = React.lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const TheoryList = React.lazy(() => import('./components/TheoryList').then(module => ({ default: module.TheoryList })));
const TheoryDetail = React.lazy(() => import('./components/TheoryDetail').then(module => ({ default: module.TheoryDetail })));
const TheoryEditor = React.lazy(() => import('./components/TheoryEditor').then(module => ({ default: module.TheoryEditor })));
const MediaDetail = React.lazy(() => import('./components/MediaDetail').then(module => ({ default: module.MediaDetail })));
const DebunkChat = React.lazy(() => import('./components/DebunkChat').then(module => ({ default: module.DebunkChat })));
const SatireGenerator = React.lazy(() => import('./components/SatireGenerator').then(module => ({ default: module.SatireGenerator })));
const Settings = React.lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const Help = React.lazy(() => import('./components/Help').then(module => ({ default: module.Help })));
const DangerousNarratives = React.lazy(() => import('./components/DangerousNarratives').then(module => ({ default: module.DangerousNarratives })));
const ViralAnalysis = React.lazy(() => import('./components/ViralAnalysis').then(module => ({ default: module.ViralAnalysis })));
const MediaCulture = React.lazy(() => import('./components/MediaCulture').then(module => ({ default: module.MediaCulture })));
const DatabaseManager = React.lazy(() => import('./components/DatabaseManager').then(module => ({ default: module.DatabaseManager })));
const AuthorLibrary = React.lazy(() => import('./components/AuthorLibrary').then(module => ({ default: module.AuthorLibrary })));
const AuthorDetail = React.lazy(() => import('./components/AuthorDetail').then(module => ({ default: module.AuthorDetail })));
const SharedView = React.lazy(() => import('./components/SharedView'));

// Global Effect Handler Wrapper
const GlobalEffects: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const settings = useAppSelector(state => state.settings.config);
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.documentElement.style.fontSize = 
      settings.fontSize === 'small' ? '14px' : 
      settings.fontSize === 'large' ? '18px' : '16px';
      
    if (settings.highContrast) document.documentElement.classList.add('contrast-more');
    else document.documentElement.classList.remove('contrast-more');
  }, [settings]);

  // System Integrity Check on Mount
  useEffect(() => {
    dispatch(resetTransientState());
  }, [dispatch]);

  return <>{children}</>;
};

// Router Configuration
const router = createHashRouter([
  {
    path: "/",
    element: (
      <GlobalEffects>
        <Layout />
        <ScrollRestoration />
      </GlobalEffects>
    ),
    errorElement: <ErrorFallback error={new Error("Route Error")} resetErrorBoundary={() => window.location.reload()} />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "archive",
        element: <TheoryList />,
      },
      {
        path: "archive/:theoryId",
        element: <TheoryDetail />,
      },
      {
        path: "editor",
        element: <TheoryEditor />
      },
      {
        path: "editor/:theoryId",
        element: <TheoryEditor />
      },
      {
        path: "media",
        element: <MediaCulture />,
      },
      {
        path: "media/:mediaId",
        element: <MediaDetail />,
      },
      {
        path: "authors",
        element: <AuthorLibrary />,
      },
      {
        path: "authors/:authorId",
        element: <AuthorDetail />,
      },
      {
        path: "dangerous",
        element: <DangerousNarratives />,
      },
      {
        path: "virality",
        element: <ViralAnalysis />,
      },
      {
        path: "chat",
        element: <DebunkChat />,
      },
      {
        path: "satire",
        element: <SatireGenerator />,
      },
      {
        path: "database",
        element: <DatabaseManager />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "help",
        element: <Help />,
      },
      {
        path: "shared",
        element: <SharedView />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

const App: React.FC = () => {
  return (
    // Redux Provider is in index.tsx
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <SettingsProvider>
        <LanguageProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </LanguageProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
};

export default App;
