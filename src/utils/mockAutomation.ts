import { TerminalLog, LogLevel, CreatedAccount } from '../types';

function generateHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateUUID(): string {
  return `${generateHex(8)}-${generateHex(4)}-4${generateHex(3)}-${generateHex(4)}-${generateHex(12)}`;
}

function generateAccountId(): string {
  return `BM-${Math.floor(Math.random() * 9000000 + 1000000)}`;
}

export function createLog(level: LogLevel, message: string): TerminalLog {
  return {
    id: generateUUID(),
    timestamp: new Date().toISOString(),
    level,
    message,
  };
}

const creationSteps = (email: string, name: string, age: number) => [
  { msg: `[INIT] Starting account creation pipeline...`, level: 'system' as LogLevel, delay: 300 },
  { msg: `[PROXY] Connecting to proxy server...`, level: 'info' as LogLevel, delay: 600 },
  { msg: `[PROXY] ✓ Proxy connected (latency: ${Math.floor(Math.random() * 80 + 20)}ms)`, level: 'success' as LogLevel, delay: 400 },
  { msg: `[AUTH] Authenticating with Gmail: ${email}`, level: 'info' as LogLevel, delay: 500 },
  { msg: `[AUTH] ✓ Gmail login successful`, level: 'success' as LogLevel, delay: 700 },
  { msg: `[SMS] Requesting phone verification...`, level: 'info' as LogLevel, delay: 900 },
  { msg: `[SMS] Waiting for SMS code...`, level: 'info' as LogLevel, delay: 1200 },
  { msg: `[SMS] ✓ Code received: ${Math.floor(Math.random() * 9000 + 1000)}`, level: 'success' as LogLevel, delay: 500 },
  { msg: `[SMS] ✓ Phone verified successfully`, level: 'success' as LogLevel, delay: 400 },
  { msg: `[PROFILE] Setting name: ${name}`, level: 'info' as LogLevel, delay: 300 },
  { msg: `[PROFILE] Setting age: ${age}`, level: 'info' as LogLevel, delay: 200 },
  { msg: `[PROFILE] Uploading photos...`, level: 'info' as LogLevel, delay: 800 },
  { msg: `[PROFILE] ✓ Photos uploaded (${Math.floor(Math.random() * 3 + 2)} images)`, level: 'success' as LogLevel, delay: 500 },
  { msg: `[PROFILE] Setting bio...`, level: 'info' as LogLevel, delay: 300 },
  { msg: `[PROFILE] ✓ Profile complete`, level: 'success' as LogLevel, delay: 400 },
  { msg: `[TOKEN] Retrieving access token...`, level: 'info' as LogLevel, delay: 600 },
  { msg: `[TOKEN] ✓ Token acquired: ${generateHex(32)}...`, level: 'success' as LogLevel, delay: 300 },
  { msg: `[DONE] Account ${generateAccountId()} created successfully!`, level: 'success' as LogLevel, delay: 200 },
];

export async function simulateAccountCreation(
  email: string,
  name: string,
  age: number,
  images: string[],
  onLog: (log: TerminalLog) => void
): Promise<CreatedAccount> {
  const steps = creationSteps(email, name, age);
  const accountId = generateAccountId();

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, step.delay));
    onLog(createLog(step.level, step.msg));
  }

  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    return {
      id: generateUUID(),
      accountId,
      email,
      name,
      age,
      images,
      status: 'success',
      token: generateHex(64),
      createdAt: new Date().toISOString(),
    };
  } else {
    onLog(createLog('error', `[ERROR] Account creation failed for ${email}`));
    return {
      id: generateUUID(),
      accountId: '',
      email,
      name,
      age,
      images,
      status: 'failed',
      createdAt: new Date().toISOString(),
    };
  }
}

export async function simulateShadowbanCheck(
  email: string,
  onLog: (log: TerminalLog) => void
): Promise<'clean' | 'shadowbanned'> {
  onLog(createLog('info', `[CHECK] Analyzing account visibility: ${email}...`));
  await new Promise(r => setTimeout(r, 1500));
  onLog(createLog('info', `[CHECK] Scanning match queue metrics...`));
  await new Promise(r => setTimeout(r, 1000));
  onLog(createLog('info', `[CHECK] Checking profile exposure rate...`));
  await new Promise(r => setTimeout(r, 800));

  const isBanned = Math.random() > 0.6;
  if (isBanned) {
    onLog(createLog('error', `[CHECK] ⚠ SHADOWBAN DETECTED on ${email}`));
    return 'shadowbanned';
  } else {
    onLog(createLog('success', `[CHECK] ✓ Account is clean: ${email}`));
    return 'clean';
  }
}

export async function simulateShadowbanFix(
  email: string,
  onLog: (log: TerminalLog) => void
): Promise<boolean> {
  onLog(createLog('system', `[FIX] Initiating shadowban removal for ${email}...`));
  await new Promise(r => setTimeout(r, 800));
  onLog(createLog('info', `[FIX] Resetting account signals...`));
  await new Promise(r => setTimeout(r, 1200));
  onLog(createLog('info', `[FIX] Rotating profile metadata...`));
  await new Promise(r => setTimeout(r, 1000));
  onLog(createLog('info', `[FIX] Flushing visibility cache...`));
  await new Promise(r => setTimeout(r, 900));
  onLog(createLog('info', `[FIX] Resubmitting profile for indexing...`));
  await new Promise(r => setTimeout(r, 1500));

  const fixed = Math.random() > 0.3;
  if (fixed) {
    onLog(createLog('success', `[FIX] ✓ Shadowban removed successfully for ${email}`));
  } else {
    onLog(createLog('error', `[FIX] ✗ Could not remove shadowban for ${email}. Try again later.`));
  }
  return fixed;
}
