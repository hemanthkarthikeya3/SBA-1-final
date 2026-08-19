import React from 'react';
import { Users, BrainCircuit, Package, BarChart3, Settings, HelpCircle, Plus, Sparkles, UploadCloud } from 'lucide-react';

export type NavView = 'clients' | 'insights' | 'products' | 'reports';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenNewAnalysis: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenNewAnalysis,
  onOpenSettings,
  onOpenSupport,
}) => {
  const navItems = [
    { id: 'clients' as NavView, label: 'Client Dashboard', icon: Users },
    { id: 'insights' as NavView, label: 'Portfolio Risk Hub', icon: BrainCircuit },
    { id: 'products' as NavView, label: 'Credit & Products', icon: Package },
    { id: 'reports' as NavView, label: 'Advisory Reports', icon: BarChart3 },
  ];

  return (
    <aside
      id="main-sidebar"
      className="fixed left-0 top-0 h-full w-[280px] bg-white dark:bg-[#0b1329] border-r border-gray-200 dark:border-slate-800 flex-col py-6 z-40 hidden md:flex transition-colors duration-200"
    >
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002045] to-[#1960a3] dark:from-blue-700 dark:to-indigo-900 text-white flex items-center justify-center font-black text-lg shadow-md">
          ₹
        </div>
        <div>
          <div className="font-bold text-base text-[#002045] dark:text-white tracking-tight">
            Advisory Copilot
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Commercial Banking AI
          </div>
        </div>
      </div>

      {/* New Analysis / Ingest CTA */}
      <div className="px-4 mb-6">
        <button
          id="btn-new-analysis"
          onClick={onOpenNewAnalysis}
          className="w-full bg-[#1a365d] dark:bg-blue-600 hover:bg-[#002045] dark:hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 flex items-center justify-between transition-all shadow-md text-xs font-bold cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span>Upload / Intake CSV</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-blue-200 dark:text-blue-200 opacity-90 animate-pulse" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <ul className="flex-1 space-y-1.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <li key={item.id}>
              <button
                id={`nav-${item.id}`}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border-l-4 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border-[#1960a3] dark:border-blue-400 text-[#1960a3] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 shadow-xs'
                    : 'border-transparent text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1960a3] dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Bottom Utility Nav */}
      <div className="mt-auto px-3 space-y-1 border-t border-gray-200 dark:border-slate-800 pt-4">
        <button
          id="nav-settings"
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-400 dark:text-slate-500" />
          <span>System Guardrails</span>
        </button>
        <button
          id="nav-support"
          onClick={onOpenSupport}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-gray-400 dark:text-slate-500" />
          <span>Banker Guidelines</span>
        </button>
      </div>
    </aside>
  );
};
