
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import VaultDetail from './components/VaultDetail';
import OperatorVault from './components/OperatorVault';
import AlertDetail from './components/AlertDetail';
import Settings from './components/Settings';
import MaestroVoice from './components/MaestroVoice';
import Layout from './components/Layout';
import Landing from './components/Landing';
import LockdownOverlay from './components/LockdownOverlay';

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
      <div className="max-w-md mx-auto min-h-screen relative bg-background-dark overflow-hidden">
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
      </div>
    </HashRouter>
  );
};

export default App;
