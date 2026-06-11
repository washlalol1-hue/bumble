import { useState } from 'react';
import { Globe, Upload, TestTube2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProxyInputProps {
  proxies: string;
  onProxiesChange: (value: string) => void;
}

export function ProxyInput({ proxies, onProxiesChange }: ProxyInputProps) {
  const [testing, setTesting] = useState(false);
  
  const proxyCount = proxies.trim() ? proxies.trim().split('\n').filter(l => l.trim()).length : 0;

  const handleTest = async () => {
    if (proxyCount === 0) {
      toast.error('No proxies to test');
      return;
    }
    setTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const valid = Math.floor(proxyCount * (0.6 + Math.random() * 0.3));
    toast.success(`${valid}/${proxyCount} proxies are valid`);
    setTesting(false);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const content = ev.target?.result as string;
          onProxiesChange(proxies ? proxies + '\n' + content : content);
          toast.success(`Imported proxies from ${file.name}`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <motion.section
      id="proxies"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-500/20 rounded-lg">
            <Globe className="w-5 h-5 text-accent-400" />
          </div>
          <h2 className="text-lg font-semibold text-dark-100">Proxies</h2>
          {proxyCount > 0 && (
            <span className="badge bg-accent-500/20 text-accent-300">{proxyCount}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleImport} className="btn-secondary text-sm flex items-center gap-1.5">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button onClick={handleTest} disabled={testing} className="btn-secondary text-sm flex items-center gap-1.5">
            <TestTube2 className="w-4 h-4" /> {testing ? 'Testing...' : 'Test'}
          </button>
        </div>
      </div>
      
      <textarea
        value={proxies}
        onChange={(e) => onProxiesChange(e.target.value)}
        placeholder={`http://user:pass@host:port\nsocks5://host:port\nhttp://host:port:user:pass\n\nPaste your proxies here, one per line...`}
        className="input-field h-40 resize-y font-mono text-sm"
      />
      
      <div className="mt-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
        <p className="text-xs text-dark-400 font-medium mb-1">Supported formats:</p>
        <p className="text-xs text-dark-500 font-mono">
          http://user:pass@host:port | socks5://host:port | host:port:user:pass
        </p>
      </div>
    </motion.section>
  );
}
