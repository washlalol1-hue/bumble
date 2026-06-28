import { 
  Mail, Globe, MessageSquare, Type, FileText, Calendar,
  Image, Play, Heart, Bot, ArrowRightLeft, Shield, Wrench
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: 'gmail', label: 'Gmail & Pass', icon: Mail },
  { id: 'proxy', label: 'Proxy', icon: Globe },
  { id: 'sms', label: 'SMS API', icon: MessageSquare },
  { id: 'names', label: 'Names', icon: Type },
  { id: 'bios', label: 'Bios', icon: FileText },
  { id: 'age', label: 'Age', icon: Calendar },
  { id: 'images', label: 'Pictures', icon: Image },
  { id: 'create-accounts', label: 'Create', icon: Play },
  { id: 'auto-swiper', label: 'Auto Swipe', icon: Heart },
  { id: 'ai-chatbot', label: 'AI Chat', icon: Bot },
  { id: 'funnel', label: 'Funnel', icon: ArrowRightLeft },
  { id: 'shadowban-checker', label: 'Ban Check', icon: Shield },
  { id: 'shadowban-remover', label: 'Ban Fix', icon: Wrench },
];

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-[57px] bottom-0 w-14 lg:w-52 bg-dark-900/95 backdrop-blur-sm border-r border-dark-700 z-40 overflow-y-auto">
      <nav className="p-2 lg:p-3 space-y-0.5">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isCreateButton = item.id === 'create-accounts';
          return (
            <div key={item.id}>
              {/* Separator before automation section */}
              {idx === 8 && (
                <div className="my-2 border-t border-dark-700/50" />
              )}
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? isCreateButton
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                      : 'bg-gradient-to-r from-brand-500/20 to-accent-500/20 text-brand-300 border border-brand-500/30'
                    : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:block text-xs font-medium truncate">{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
