export interface UserProfile {
  name: string;
  role: string;
  alias: string;
  avatarUrl?: string;
  themeColor: 'orange' | 'steel' | 'slate';
}

export const PROFILE_PRESETS: UserProfile[] = [
  { name: 'Sample Operator', role: 'Workflow Operator', alias: 'DEMO_01', themeColor: 'orange' },
  { name: 'Sample Consultant', role: 'Work Consultant', alias: 'DEMO_02', themeColor: 'steel' },
  { name: 'Sample Archivist', role: 'Family Archivist', alias: 'DEMO_03', themeColor: 'slate' },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Demo Operator',
  role: 'Prototype User',
  alias: 'DEMO_DEFAULT',
  themeColor: 'orange',
};

function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<UserProfile>;
  return (
    typeof profile.name === 'string' &&
    typeof profile.role === 'string' &&
    typeof profile.alias === 'string' &&
    ['orange', 'steel', 'slate'].includes(profile.themeColor ?? '')
  );
}

export function getActiveProfile(): UserProfile {
  const stored = localStorage.getItem('vaultspace_active_profile');
  if (!stored) return DEFAULT_PROFILE;
  try {
    const parsed: unknown = JSON.parse(stored);
    return isUserProfile(parsed) ? parsed : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function setActiveProfile(profile: UserProfile): void {
  const sanitized: UserProfile = {
    name: profile.name.trim().slice(0, 80) || DEFAULT_PROFILE.name,
    role: profile.role.trim().slice(0, 100) || DEFAULT_PROFILE.role,
    alias: profile.alias.trim().slice(0, 40) || DEFAULT_PROFILE.alias,
    themeColor: profile.themeColor,
  };
  localStorage.setItem('vaultspace_active_profile', JSON.stringify(sanitized));
  window.dispatchEvent(new Event('vaultspace_profile_updated'));
}

export function completeOnboarding(): void {
  localStorage.setItem('vaultspace_onboarding_completed', 'true');
}
