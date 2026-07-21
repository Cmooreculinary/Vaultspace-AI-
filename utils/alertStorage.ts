import { addAuditLog } from './auditLogger';

export interface AlertItem {
  id: string;
  title: string;
  urgency: 'high' | 'medium' | 'low';
  date: string;
  time: string;
  description: string;
  category: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface LocalStorageInfo {
  storageType: 'Browser localStorage';
  protection: 'Not encrypted';
  approximateBytes: number;
  itemCount: number;
  lastSavedAt: string | null;
}

const ALERTS_KEY = 'vaultspace_active_alerts';
const SAVED_AT_KEY = 'vaultspace_alerts_saved_at';
const LEGACY_KEYS = [
  'vaultspace_alerts_encrypted_backup',
  'vaultspace_alerts_backup_timestamp',
];

const DEFAULT_ALERTS: AlertItem[] = [
  {
    id: 'demo_maintenance',
    title: 'Vehicle Maintenance',
    urgency: 'high',
    date: '2026-07-24',
    time: '10:00 AM',
    description: 'Demo reminder: confirm the service interval and schedule routine maintenance.',
    category: 'Family Care',
    isCompleted: false,
    createdAt: '2026-07-20T10:00:00.000Z',
  },
  {
    id: 'demo_keynote',
    title: 'Keynote Draft',
    urgency: 'medium',
    date: '2026-07-28',
    time: '02:00 PM',
    description: 'Demo reminder: finish the presentation outline and review supporting notes.',
    category: 'Work',
    isCompleted: false,
    createdAt: '2026-07-20T22:00:00.000Z',
  },
];

function removeLegacySimulationData(): void {
  for (const key of LEGACY_KEYS) {
    localStorage.removeItem(key);
  }
}

function isAlertItem(value: unknown): value is AlertItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<AlertItem>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    ['high', 'medium', 'low'].includes(item.urgency ?? '') &&
    typeof item.date === 'string' &&
    typeof item.time === 'string' &&
    typeof item.description === 'string' &&
    typeof item.category === 'string' &&
    typeof item.isCompleted === 'boolean' &&
    typeof item.createdAt === 'string'
  );
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `alert_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getAlerts(): AlertItem[] {
  removeLegacySimulationData();
  const stored = localStorage.getItem(ALERTS_KEY);
  if (!stored) {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(DEFAULT_ALERTS));
    localStorage.setItem(SAVED_AT_KEY, new Date().toISOString());
    return DEFAULT_ALERTS;
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return DEFAULT_ALERTS;
    return parsed.filter(isAlertItem);
  } catch {
    return DEFAULT_ALERTS;
  }
}

export function saveAlerts(alerts: AlertItem[]): void {
  const savedAt = new Date().toISOString();
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  localStorage.setItem(SAVED_AT_KEY, savedAt);
  removeLegacySimulationData();

  addAuditLog(
    'Local alerts updated',
    `${alerts.length} demo alert${alerts.length === 1 ? '' : 's'} saved in this browser without encryption.`,
    'info',
  );
  window.dispatchEvent(new Event('alerts_updated'));
}

export function getLocalStorageInfo(): LocalStorageInfo {
  const serialized = localStorage.getItem(ALERTS_KEY) ?? '';
  return {
    storageType: 'Browser localStorage',
    protection: 'Not encrypted',
    approximateBytes: new Blob([serialized]).size,
    itemCount: getAlerts().length,
    lastSavedAt: localStorage.getItem(SAVED_AT_KEY),
  };
}

export function createAlert(
  title: string,
  description: string,
  urgency: AlertItem['urgency'] = 'medium',
  category = 'Assistant Command',
): AlertItem {
  const alerts = getAlerts();
  const now = new Date();
  const newItem: AlertItem = {
    id: createId(),
    title: title.trim().slice(0, 160),
    urgency,
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: description.trim().slice(0, 1000),
    category: category.trim().slice(0, 80) || 'Uncategorized',
    isCompleted: false,
    createdAt: now.toISOString(),
  };

  saveAlerts([newItem, ...alerts]);
  addAuditLog(
    'Assistant alert created',
    `Demo alert created locally: "${newItem.title}".`,
    'info',
  );
  return newItem;
}
