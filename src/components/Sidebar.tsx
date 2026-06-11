import { 
  Globe, Users, MessageSquare, Image, Type, FileText, 
  Trophy, Play 
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: 'proxies', label: 'Proxies', icon: Globe },
  { id: 'accounts', label: 'Accounts', icon: Users },
  { id: 'sms', label: 'SMS API', icon: MessageSquare },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'names', label: 'Names', icon: Type },
  { id: 'bios', label: 'Bios', icon: FileText },
  { id: 'results', label: 'Results', icon: Trophy },
  { id: 'automation', label: 'Run', icon: Play },
];

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-[57px] bottom-0 w-16 lg:w-56 bg-dark-900/95 backdrop-blur-sm border-r border-dark-700 z-40 overflow-y-auto">
      <nav className="p-2 lg:p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-brand-500/20 to-accent-500/20 text-brand-300 border border-brand-500/30' 
                  : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
