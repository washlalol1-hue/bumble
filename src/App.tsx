import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header, Platform } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProxyInput } from './components/ProxyInput';
import { AccountCredentials } from './components/AccountCredentials';
import { SmsApiInput } from './components/SmsApiInput';
import { ImageUpload } from './components/ImageUpload';
import { NameSelector } from './components/NameSelector';
import { BioSection } from './components/BioSection';
import { TokenOutput } from './components/TokenOutput';
import { AutomationControl } from './components/AutomationControl';
import { ShadowbanChecker } from './components/ShadowbanChecker';
import { ShadowbanFixer } from './components/ShadowbanFixer';
import { AutoSwiper } from './components/AutoSwiper';
import { AutoMessager } from './components/AutoMessager';
import { FunnelSelector } from './components/FunnelSelector';
import { useAutomation } from './hooks/useAutomation';
import { Account, Bio, ProfileImage, SmsProvider } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('proxies');
  const [activePlatform, setActivePlatform] = useState<Platform>('bumble');
  const [proxies, setProxies] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [smsProvider, setSmsProvider] = useState<SmsProvider>('smspool');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [smsCountry, setSmsCountry] = useState('US');
  const [smsStatus, setSmsStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  const [images, setImages] = useState<ProfileImage[]>([]);
  const [nameMode, setNameMode] = useState<'auto' | 'manual'>('auto');
  const [manualNames, setManualNames] = useState('');
  const [bios, setBios] = useState<Bio[]>([]);

  const automation = useAutomation();

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleStart = () => {
    automation.start(accounts);
  };

  const proxyCount = proxies.trim() ? proxies.trim().split('\n').filter(l => l.trim()).length : 0;

  return (
    <div className="min-h-screen bg-dark-950">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
        }}
      />
      
      <Header
        isRunning={automation.isRunning}
        activePlatform={activePlatform}
        onPlatformChange={setActivePlatform}
      />
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
      
      <main className="ml-16 lg:ml-56 pt-[57px] min-h-screen">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <ProxyInput proxies={proxies} onProxiesChange={setProxies} />
          
          <AccountCredentials accounts={accounts} onAccountsChange={setAccounts} platform={activePlatform} />
          
          <SmsApiInput
            provider={smsProvider}
            apiKey={smsApiKey}
            countryCode={smsCountry}
            status={smsStatus}
            onProviderChange={setSmsProvider}
            onApiKeyChange={setSmsApiKey}
            onCountryCodeChange={setSmsCountry}
            onStatusChange={setSmsStatus}
          />
          
          <ImageUpload images={images} onImagesChange={setImages} />
          
          <NameSelector
            mode={nameMode}
            manualNames={manualNames}
            onModeChange={setNameMode}
            onManualNamesChange={setManualNames}
          />
          
          <BioSection bios={bios} onBiosChange={setBios} />

          <ShadowbanChecker platform={activePlatform} accounts={accounts} />

          <ShadowbanFixer platform={activePlatform} />

          <AutoMessager platform={activePlatform} />

          <FunnelSelector />
          
          <TokenOutput results={automation.results} />
          
          <AutomationControl
            isRunning={automation.isRunning}
            progress={automation.progress}
            currentAccount={automation.currentAccount}
            totalAccounts={accounts.length}
            logs={automation.logs}
            proxyCount={proxyCount}
            accountCount={accounts.length}
            imageCount={images.length}
            onStart={handleStart}
            onStop={automation.stop}
            onReset={automation.reset}
          />

          <AutoSwiper platform={activePlatform} />
        </div>
      </main>
    </div>
  );
}

export default App;
