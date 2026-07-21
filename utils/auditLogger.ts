import { getActiveProfile } from './profileHelper';

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  status: 'success' | 'warning' | 'error' | 'info';
  operator: string;
}

const LOG_KEY = 'vault_audit_logs';

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'demo-local-mode',
    timestamp: '2026-07-21T12:00:00.000Z',
    event: 'Demo initialized',
    details: 'Browser-local prototype started. No backend, encryption, or cloud synchronization is connected.',
    status: 'info',
    operator: 'DEMO',
  },
  {
    id: 'demo-storage-notice',
    timestamp: '2026-07-21T12:00:01.000Z',
    event: 'Storage notice',
    details: 'Demo preferences and alerts use unencrypted browser localStorage. Do not enter sensitive information.',
    status: 'warning',
    operator: 'DEMO',
  },
];

function isAuditLog(value: unknown): value is AuditLog {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<AuditLog>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.timestamp === 'string' &&
    typeof entry.event === 'string' &&
    typeof entry.details === 'string' &&
    ['success', 'warning', 'error', 'info'].includes(entry.status ?? '') &&
    typeof entry.operator === 'string'
  );
}

function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `log_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getAuditLogs(): AuditLog[] {
  const stored = localStorage.getItem(LOG_KEY);
  if (!stored) {
    localStorage.setItem(LOG_KEY, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isAuditLog) : [];
  } catch {
    return [];
  }
}

export function addAuditLog(
  event: string,
  details: string,
  status: AuditLog['status'] = 'info',
  operator: string = getActiveProfile().name,
): AuditLog {
  const newLog: AuditLog = {
    id: createId(),
    timestamp: new Date().toISOString(),
    event: event.slice(0, 120),
    details: details.slice(0, 500),
    status,
    operator: operator.slice(0, 120),
  };
  localStorage.setItem(LOG_KEY, JSON.stringify([newLog, ...getAuditLogs()].slice(0, 50)));
  window.dispatchEvent(new Event('audit_logs_updated'));
  return newLog;
}
