import { useState } from 'react';
import { Globe, Shield } from 'lucide-react';

interface ProxyInputProps {
  proxy: string;
  onProxyChange: (proxy: string) => void;
}

export function ProxyInput({ proxy, onProxyChange }: ProxyInputProps) {
  return (
    <div id="proxy" className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Globe className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dark-100">Proxy</h3>
          <p className="text-sm text-dark-400">
            Enter proxy for account creation (one proxy used for all)
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={proxy}
          onChange={(e) => onProxyChange(e.target.value)}
          placeholder="host:port:username:password or http://user:pass@host:port"
          className="input-field font-mono text-sm"
        />
        <div className="flex items-center gap-2 text-xs text-dark-400">
          <Shield className="w-3.5 h-3.5" />
          <span>Supports HTTP, HTTPS, SOCKS5 proxies</span>
        </div>
        {proxy && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/5 border border-green-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-green-400">Proxy configured</span>
          </div>
        )}
      </div>
    </div>
  );
}
