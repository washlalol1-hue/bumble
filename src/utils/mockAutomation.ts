import { TokenResult, AutomationLog, LogLevel } from '../types';

function generateHexToken(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateUUID(): string {
  return `${generateHexToken(8)}-${generateHexToken(4)}-4${generateHexToken(3)}-${generateHexToken(4)}-${generateHexToken(12)}`;
}

function generateAccountId(): string {
  return `ACC-${Math.floor(Math.random() * 900000000 + 100000000)}`;
}

function generateUserId(): string {
  return `USR-${generateHexToken(16)}`;
}

export function createLogEntry(level: LogLevel, message: string): AutomationLog {
  return {
    id: generateUUID(),
    timestamp: new Date().toISOString(),
    level,
    message,
  };
}

export async function simulateAccountCreation(
  email: string,
  onLog: (log: AutomationLog) => void
): Promise<TokenResult> {
  const steps = [
    { message: `Connecting proxy for ${email}...`, level: 'info' as LogLevel, delay: 500 },
    { message: `Proxy connected successfully`, level: 'success' as LogLevel, delay: 300 },
    { message: `Initiating account creation for ${email}`, level: 'info' as LogLevel, delay: 400 },
    { message: `Requesting SMS verification...`, level: 'info' as LogLevel, delay: 800 },
    { message: `SMS code received, verifying...`, level: 'success' as LogLevel, delay: 600 },
    { message: `Phone number verified`, level: 'success' as LogLevel, delay: 300 },
    { message: `Creating profile...`, level: 'info' as LogLevel, delay: 500 },
    { message: `Uploading profile photos...`, level: 'info' as LogLevel, delay: 700 },
    { message: `Setting bio and preferences...`, level: 'info' as LogLevel, delay: 400 },
    { message: `Retrieving access token...`, level: 'info' as LogLevel, delay: 500 },
  ];

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, step.delay));
    onLog(createLogEntry(step.level, step.message));
  }

  const isSuccess = Math.random() > 0.15;

  if (isSuccess) {
    const token = generateHexToken(64);
    const accountId = generateAccountId();
    const userId = generateUserId();

    onLog(createLogEntry('success', `Account created successfully! Token: ${token.substring(0, 16)}...`));

    return {
      id: generateUUID(),
      email,
      status: 'success',
      token,
      accountId,
      userId,
      createdAt: new Date().toISOString(),
      message: 'Account created successfully',
    };
  } else {
    const errorMessages = [
      'Phone verification timeout',
      'Proxy connection failed',
      'Rate limited - try again later',
      'Account creation blocked',
    ];
    const errorMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    onLog(createLogEntry('error', `Failed: ${errorMsg}`));

    return {
      id: generateUUID(),
      email,
      status: 'failed',
      token: '',
      accountId: '',
      userId: '',
      createdAt: new Date().toISOString(),
      message: errorMsg,
    };
  }
}
