export interface GmailAccount {
  id: string;
  email: string;
  password: string;
}

export interface ProxyConfig {
  raw: string;
}

export type SmsProvider = 'smspool' | 'sms-activate' | 'textverified' | 'custom';

export interface SmsConfig {
  provider: SmsProvider;
  apiKey: string;
  countryCode: string;
}

export interface ProfileImage {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export interface NameConfig {
  mode: 'auto' | 'manual';
  manualNames: string[];
}

export interface Bio {
  id: string;
  text: string;
}

export interface AgeConfig {
  min: number;
  max: number;
}

export interface CreatedAccount {
  id: string;
  accountId: string;
  email: string;
  name: string;
  age: number;
  images: string[];
  status: 'creating' | 'success' | 'failed';
  token?: string;
  createdAt: string;
  verified?: boolean;
}

export type LogLevel = 'info' | 'warning' | 'success' | 'error' | 'system';

export interface TerminalLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface AutoSwiperConfig {
  enabled: boolean;
  swipesPerMinute: number;
  duration: number; // minutes
  likeRatio: number; // 0-100 percentage of right swipes
}

export interface AIChatbotConfig {
  enabled: boolean;
  personality: 'flirty' | 'chill' | 'funny' | 'deep';
  responseDelay: number; // seconds
  autoReply: boolean;
}

export type FunnelPlatform = 'telegram' | 'whatsapp' | 'instagram';

export interface FunnelConfig {
  platform: FunnelPlatform;
  username: string;
  message: string;
  enabled: boolean;
}

export interface ShadowbanResult {
  accountId: string;
  email: string;
  status: 'clean' | 'shadowbanned' | 'checking' | 'fixed' | 'fixing';
  details?: string;
}
