
export enum VaultTier {
  FAMILY = 'FAMILY',
  ADULT = 'ADULT',
  OPERATOR = 'OPERATOR'
}

export interface VaultFile {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  category: string;
  recordState: 'Sample' | 'Local demo';
  sharedWith?: string[];
  owner?: string;
}

export interface Suggestion {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: string;
}
