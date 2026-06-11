export interface Proxy {
  id: string;
  raw: string;
  protocol: 'http' | 'https' | 'socks5';
  host: string;
  port: string;
  username?: string;
  password?: string;
  status?: 'untested' | 'valid' | 'invalid';
}

export type AccountType = 'facebook' | 'gmail';

export interface Account {
  id: string;
  type: AccountType;
  email: string;
  password: string;
}

export type SmsProvider = 'smspool' | 'sms-activate' | 'verifywithsms' | 'textverified' | 'custom';

export interface SmsConfig {
  provider: SmsProvider;
  apiKey: string;
  apiUrl?: string;
  countryCode: string;
  status: 'disconnected' | 'connected' | 'error';
}

export interface ProfileImage {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

export interface NameConfig {
  mode: 'auto' | 'manual';
  manualNames: string[];
  previewNames: { first: string; last: string }[];
}

export interface Bio {
  id: string;
  text: string;
  isRewriting?: boolean;
}

export interface TokenResult {
  id: string;
  email: string;
  status: 'success' | 'failed';
  token: string;
  accountId: string;
  userId: string;
  createdAt: string;
  message: string;
}

export type LogLevel = 'info' | 'warning' | 'success' | 'error';

export interface AutomationLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface AppState {
  proxies: Proxy[];
  accounts: Account[];
  smsConfig: SmsConfig;
  images: ProfileImage[];
  nameConfig: NameConfig;
  bios: Bio[];
  results: TokenResult[];
  logs: AutomationLog[];
  isRunning: boolean;
  progress: number;
  currentAccount: number;
  totalAccounts: number;
}
