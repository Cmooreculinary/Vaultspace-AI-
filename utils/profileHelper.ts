export interface UserProfile {
  name: string;
  role: string;
  alias: string;
  avatarUrl?: string;
  themeColor: string; // 'emerald', 'blue', 'amber'
}

export const PROFILE_PRESETS: UserProfile[] = [
  {
    name: 'Alex Vance',
    role: 'Tactical Analyst',
    alias: 'OPERATOR_01',
    themeColor: 'emerald'
  },
  {
    name: 'Clara Mercer',
    role: 'Elite Consultant',
    alias: 'CONSULTANT_ALPHA',
    themeColor: 'blue'
  },
  {
    name: 'Jamesen Holt',
    role: 'Family Archivist',
    alias: 'SEC_CURATOR',
    themeColor: 'amber'
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Operator',
  role: 'Tactical Commander',
  alias: 'COMMANDER_SEC',
  themeColor: 'blue'
};

export function getActiveProfile(): UserProfile {
  const stored = localStorage.getItem('vaultspace_active_profile');
  if (!stored) {
    return DEFAULT_PROFILE;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function setActiveProfile(profile: UserProfile): void {
  localStorage.setItem('vaultspace_active_profile', JSON.stringify(profile));
  window.dispatchEvent(new Event('vaultspace_profile_updated'));
}

export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem('vaultspace_onboarding_completed') === 'true';
}

export function completeOnboarding(): void {
  localStorage.setItem('vaultspace_onboarding_completed', 'true');
}
