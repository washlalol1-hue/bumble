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

// Delays are longer to feel more realistic
const creationSteps = (email: string, name: string, age: number) => [
  { msg: `[INIT] Starting account creation pipeline...`, level: 'system' as LogLevel, delay: 800 + Math.random() * 400 },
  { msg: `[PROXY] Connecting to proxy server...`, level: 'info' as LogLevel, delay: 1200 + Math.random() * 800 },
  { msg: `[PROXY] ✓ Proxy connected (latency: ${Math.floor(Math.random() * 80 + 20)}ms)`, level: 'success' as LogLevel, delay: 600 + Math.random() * 400 },
  { msg: `[AUTH] Authenticating with Gmail: ${email}`, level: 'info' as LogLevel, delay: 1500 + Math.random() * 1000 },
  { msg: `[AUTH] ✓ Gmail login successful`, level: 'success' as LogLevel, delay: 900 + Math.random() * 600 },
  { msg: `[SMS] Requesting phone verification...`, level: 'info' as LogLevel, delay: 1800 + Math.random() * 1200 },
  { msg: `[SMS] Waiting for SMS code...`, level: 'info' as LogLevel, delay: 3000 + Math.random() * 2000 },
  { msg: `[SMS] ✓ Code received: ${Math.floor(Math.random() * 9000 + 1000)}`, level: 'success' as LogLevel, delay: 800 + Math.random() * 400 },
  { msg: `[SMS] ✓ Phone verified successfully`, level: 'success' as LogLevel, delay: 700 + Math.random() * 300 },
  { msg: `[PROFILE] Setting name: ${name}`, level: 'info' as LogLevel, delay: 600 + Math.random() * 400 },
  { msg: `[PROFILE] Setting age: ${age}`, level: 'info' as LogLevel, delay: 500 + Math.random() * 300 },
  { msg: `[PROFILE] Uploading photos...`, level: 'info' as LogLevel, delay: 2000 + Math.random() * 1500 },
  { msg: `[PROFILE] ✓ Photos uploaded (${Math.floor(Math.random() * 3 + 2)} images)`, level: 'success' as LogLevel, delay: 800 + Math.random() * 500 },
  { msg: `[PROFILE] Setting bio...`, level: 'info' as LogLevel, delay: 700 + Math.random() * 400 },
  { msg: `[PROFILE] ✓ Profile complete`, level: 'success' as LogLevel, delay: 600 + Math.random() * 400 },
  { msg: `[TOKEN] Retrieving access token...`, level: 'info' as LogLevel, delay: 1200 + Math.random() * 800 },
  { msg: `[TOKEN] ✓ Token acquired: ${generateHex(32)}...`, level: 'success' as LogLevel, delay: 500 + Math.random() * 300 },
  { msg: `[DONE] Account ${generateAccountId()} created successfully!`, level: 'success' as LogLevel, delay: 400 + Math.random() * 200 },
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

// Shadowban checker ALWAYS returns clean
export async function simulateShadowbanCheck(
  email: string,
  onLog: (log: TerminalLog) => void
): Promise<'clean'> {
  onLog(createLog('info', `[CHECK] Analyzing account visibility: ${email}...`));
  await new Promise(r => setTimeout(r, 1500));
  onLog(createLog('info', `[CHECK] Scanning match queue metrics...`));
  await new Promise(r => setTimeout(r, 1000));
  onLog(createLog('info', `[CHECK] Checking profile exposure rate...`));
  await new Promise(r => setTimeout(r, 800));
  onLog(createLog('success', `[CHECK] ✓ Account is clean: ${email}`));
  return 'clean';
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
  onLog(createLog('success', `[FIX] ✓ Shadowban removed successfully for ${email}`));
  return true;
}
