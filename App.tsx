
import React, { lazy, Suspense, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './components/Landing';
import LockdownOverlay from './components/LockdownOverlay';

const Home = lazy(() => import('./components/Home'));
const VaultDetail = lazy(() => import('./components/VaultDetail'));
const OperatorVault = lazy(() => import('./components/OperatorVault'));
const AlertDetail = lazy(() => import('./components/AlertDetail'));
const Settings = lazy(() => import('./components/Settings'));
const MaestroVoice = lazy(() => import('./components/MaestroVoice'));

const LoadingScreen: React.FC = () => (
  <div className="grid min-h-screen place-items-center bg-background-dark px-6 text-center">
    <div>
      <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-slate-700 border-t-primary" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        Loading VaultSpace demo
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isMaestroOpen, setIsMaestroOpen] = useState(false);
  const [isLockingDown, setIsLockingDown] = useState(false);
  const [hasEntered, setHasEntered] = useState(() => {
    // Optional: persist state to avoid re-landing on refresh during development
    return localStorage.getItem('vault_entered') === 'true';
  });

  const handleEnter = () => {
    setHasEntered(true);
    localStorage.setItem('vault_entered', 'true');
    localStorage.removeItem('vault_locked_down'); // clear lock down state on successful entry
  };

  const handleLockdownComplete = () => {
    localStorage.removeItem('vault_entered');
    localStorage.setItem('vault_locked_down', 'true');
    setHasEntered(false);
    setIsLockingDown(false);
  };

  if (isLockingDown) {
    return <LockdownOverlay onComplete={handleLockdownComplete} />;
  }
  
  if (!hasEntered) {
    return <Landing onEnter={handleEnter} />;
  }

  return (
    <HashRouter>
      <div className="relative mx-auto min-h-screen max-w-md overflow-hidden bg-background-dark">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route element={
              <Layout
                onVoiceToggle={() => setIsMaestroOpen(true)}
                onSosTrigger={() => setIsLockingDown(true)}
              />
            }>
              <Route path="/" element={<Home />} />
              <Route path="/vault/family" element={<VaultDetail tier="FAMILY" />} />
              <Route path="/vault/adult" element={<VaultDetail tier="ADULT" />} />
              <Route path="/vault/operator" element={<OperatorVault />} />
              <Route path="/alert" element={<AlertDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {isMaestroOpen && (
            <MaestroVoice onClose={() => setIsMaestroOpen(false)} />
          )}
        </Suspense>
      </div>
    </HashRouter>
  );
};

export default App;
