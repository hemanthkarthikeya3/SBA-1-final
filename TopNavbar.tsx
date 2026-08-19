import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Building2, ChevronDown, Moon, Sun, UploadCloud, Command, Edit3 } from 'lucide-react';
import { ClientProfile } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TopNavbarProps {
  clients: ClientProfile[];
  selectedClient: ClientProfile;
  onSelectClient: (client: ClientProfile) => void;
  onOpenHelp: () => void;
  onOpenNotifications: () => void;
  onOpenUpload: () => void;
  onOpenCommandPalette: () => void;
  onOpenEditClient: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadCount?: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  clients,
  selectedClient,
  onSelectClient,
  onOpenHelp,
  onOpenNotifications,
  onOpenUpload,
  onOpenCommandPalette,
  onOpenEditClient,
  searchQuery,
  onSearchChange,
  unreadCount = 3,
}) => {
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      id="top-navbar"
      className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] h-16 bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex justify-between items-center px-4 md:px-8 z-30 transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-[#002045] dark:text-white tracking-tight flex items-center gap-2">
          Advisory AI
        </span>

        {/* Global Search / Command Bar */}
        <button
          onClick={onOpenCommandPalette}
          className="relative hidden sm:flex items-center gap-2 pl-3 pr-4 py-1.5 bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200/70 dark:hover:bg-slate-700/80 border border-gray-300/80 dark:border-slate-700 rounded-lg text-xs text-gray-500 dark:text-slate-400 w-60 md:w-72 transition-all group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 group-hover:text-[#1960a3] dark:group-hover:text-blue-400" />
          <span className="flex-1 text-left truncate">Search or press Ctrl+K...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded text-gray-600 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Direct Upload Ledger Button */}
        <button
          onClick={onOpenUpload}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#1960a3]/10 dark:bg-blue-900/30 text-[#1960a3] dark:text-blue-300 hover:bg-[#1960a3]/20 rounded-lg text-xs font-semibold transition-colors"
          title="Upload Client CSV / Ledger"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload CSV</span>
        </button>

        {/* Client Switcher in Top Bar */}
        <div className="relative">
          <button
            id="client-switcher-btn"
            onClick={() => setShowClientDropdown(!showClientDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-[#1960a3] dark:hover:border-blue-400 rounded-lg text-xs md:text-sm font-medium text-[#002045] dark:text-white transition-colors shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1960a3] dark:text-blue-400 shrink-0" />
            <span className="max-w-[120px] md:max-w-[160px] truncate">{selectedClient.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
          </button>

          {showClientDropdown && (
            <div className="absolute right-0 mt-1 w-68 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <span>Select Business Client</span>
                <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-[#1960a3] dark:text-blue-400 px-1.5 py-0.5 rounded">
                  {clients.length} Profiles
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {clients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectClient(c);
                      setShowClientDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors ${
                      c.id === selectedClient.id
                        ? 'bg-[#1960a3]/10 dark:bg-blue-900/30 font-semibold text-[#1960a3] dark:text-blue-400'
                        : 'text-gray-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{c.industry}</div>
                    </div>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                        c.riskTier === 'Low'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : c.riskTier === 'Moderate'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {c.riskTier}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-1.5 border-t border-gray-100 dark:border-slate-800 flex gap-1">
                <button
                  onClick={() => {
                    setShowClientDropdown(false);
                    onOpenUpload();
                  }}
                  className="w-full text-center py-1 bg-[#1960a3] dark:bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-[#002045]"
                >
                  + Add / Upload Client CSV
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Edit Current Client */}
        <button
          onClick={onOpenEditClient}
          className="p-2 text-gray-600 dark:text-slate-300 hover:text-[#1960a3] dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Edit Active Client Financial Metrics"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode (Key: D)`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          id="btn-notifications"
          onClick={onOpenNotifications}
          className="p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          title="Notifications & Risk Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          )}
        </button>

        {/* Help / Guide */}
        <button
          id="btn-help"
          onClick={onOpenHelp}
          className="p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Advisory Methodology & Bank Guardrails"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Banker Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-[#1a365d] dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            MV
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-[#002045] dark:text-white leading-tight">Marcus Vance</div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400">VP Commercial Banking</div>
          </div>
        </div>
      </div>
    </nav>
  );
};
