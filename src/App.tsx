import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GmailInput } from './components/GmailInput';
import { ProxyInput } from './components/ProxyInput';
import { SmsApiInput } from './components/SmsApiInput';
import { NameSelector } from './components/NameSelector';
import { BioSection } from './components/BioSection';
import { AgeSelector } from './components/AgeSelector';
import { ImageUpload } from './components/ImageUpload';
import { AccountCreation } from './components/AccountCreation';
import { AutoSwiper } from './components/AutoSwiper';
import { AIChatbot } from './components/AIChatbot';
import { FunnelSelector } from './components/FunnelSelector';
import { ShadowbanChecker } from './components/ShadowbanChecker';
import { ShadowbanRemover } from './components/ShadowbanRemover';
import { GmailAccount, SmsProvider, Bio, ProfileImage } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('gmail');
  const [isRunning, setIsRunning] = useState(false);

  // 1. Gmail & Password
  const [gmailAccounts, setGmailAccounts] = useState<GmailAccount[]>([]);

  // 2. Proxy
  const [proxy, setProxy] = useState('');

  // 3. SMS
  const [smsProvider, setSmsProvider] = useState<SmsProvider>('smspool');
  const [smsApiKey, setSmsApiKey] = useState('');

  // 4. Names
  const [nameMode, setNameMode] = useState<'auto' | 'manual'>('auto');
  const [manualNames, setManualNames] = useState('');

  // 5. Bios
  const [bios, setBios] = useState<Bio[]>([]);

  // 6. Age
  const [ageMin, setAgeMin] = useState(21);
  const [ageMax, setAgeMax] = useState(28);

  // 7. Images
  const [images, setImages] = useState<ProfileImage[]>([]);

  // Parse manual names into array
  const parsedNames = manualNames
    .split('\n')
    .map(n => n.trim())
    .filter(n => n.length > 0);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

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

      <Header accountCount={gmailAccounts.length} isRunning={isRunning} />
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="ml-14 lg:ml-52 pt-[57px] min-h-screen">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
          {/* Section Order: Gmail → Proxy → SMS → Name → Bio → Age → Pictures → Create */}

          {/* 1. Gmail & Password */}
          <GmailInput
            accounts={gmailAccounts}
            onAccountsChange={setGmailAccounts}
          />

          {/* 2. Proxy */}
          <ProxyInput
            proxy={proxy}
            onProxyChange={setProxy}
          />

          {/* 3. SMS Verification */}
          <SmsApiInput
            provider={smsProvider}
            apiKey={smsApiKey}
            onProviderChange={setSmsProvider}
            onApiKeyChange={setSmsApiKey}
          />

          {/* 4. Names */}
          <NameSelector
            mode={nameMode}
            manualNames={manualNames}
            accountCount={gmailAccounts.length}
            onModeChange={setNameMode}
            onManualNamesChange={setManualNames}
          />

          {/* 5. Bio */}
          <BioSection
            bios={bios}
            onBiosChange={setBios}
          />

          {/* 6. Age */}
          <AgeSelector
            ageMin={ageMin}
            ageMax={ageMax}
            onAgeMinChange={setAgeMin}
            onAgeMaxChange={setAgeMax}
          />

          {/* 7. Pictures */}
          <ImageUpload
            images={images}
            onImagesChange={setImages}
          />

          {/* 8. CREATE ACCOUNTS — Terminal Animation */}
          <AccountCreation
            gmailAccounts={gmailAccounts}
            proxy={proxy}
            smsApiKey={smsApiKey}
            names={parsedNames}
            bios={bios.map(b => b.text)}
            ageMin={ageMin}
            ageMax={ageMax}
            images={images}
            nameMode={nameMode}
          />

          {/* Separator */}
          <div className="border-t border-dark-700/50 my-2" />

          {/* 9. Auto Swiper */}
          <AutoSwiper />

          {/* 10. AI Chatbot */}
          <AIChatbot />

          {/* 11. Funnel */}
          <FunnelSelector />

          {/* 12. Shadowban Checker */}
          <ShadowbanChecker accounts={gmailAccounts} />

          {/* 13. Shadowban Remover */}
          <ShadowbanRemover accounts={gmailAccounts} />
        </div>
      </main>
    </div>
  );
}

export default App;
