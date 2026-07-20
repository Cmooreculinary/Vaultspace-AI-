import { getActiveProfile } from './profileHelper';

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  status: 'success' | 'warning' | 'error' | 'info';
  operator: string;
}

export const getAuditLogs = (): AuditLog[] => {
  const stored = localStorage.getItem('vault_audit_logs');
  if (!stored) {
    // Seed initial high-fidelity logs for realistic security appearance
    const initialLogs: AuditLog[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        event: 'Vault Initialized',
        details: 'Core Vault System v3.0 booted under FIPS 140-3 protocol.',
        status: 'info',
        operator: 'SYSTEM'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        event: 'Keyring Loaded',
        details: 'AES-256 master decryption keyring loaded from secure enclave.',
        status: 'success',
        operator: 'SYSTEM'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        event: 'Remote Node Handshake',
        details: 'Peer synchronization complete with 3 distributed offline ledger nodes.',
        status: 'success',
        operator: 'SYSTEM'
      }
    ];
    localStorage.setItem('vault_audit_logs', JSON.stringify(initialLogs));
    return initialLogs;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const addAuditLog = (
  event: string, 
  details: string, 
  status: 'success' | 'warning' | 'error' | 'info' = 'info',
  operator: string = getActiveProfile().name
): AuditLog => {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    event,
    details,
    status,
    operator
  };
  const updated = [newLog, ...logs].slice(0, 50); // Keep last 50 logs
  localStorage.setItem('vault_audit_logs', JSON.stringify(updated));
  
  // Dispatch a custom event so other components can auto-update their logs in real-time
  window.dispatchEvent(new Event('audit_logs_updated'));
  
  return newLog;
};
