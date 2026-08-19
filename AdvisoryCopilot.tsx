import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, FileText, ExternalLink, Loader2, Bot, User, CornerDownLeft, RefreshCw } from 'lucide-react';
import { ChatMessage, Citation, ClientProfile } from '../types';

interface AdvisoryCopilotProps {
  client: ClientProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onOpenCitation: (citation: Citation) => void;
}

export const AdvisoryCopilot: React.FC<AdvisoryCopilotProps> = ({
  client,
  messages,
  onSendMessage,
  isLoading,
  onOpenCitation,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Dynamic quick action chips based on client context
  const quickActionChips = [
    `Check loan & CC/OD eligibility`,
    `Analyze overdue receivables (₹${(client.arAging.days31to60 / 100000).toFixed(1)}L)`,
    `Simulate Q3 seasonal stress test`,
    `Draft client advisory review agenda`,
  ];

  return (
    <aside
      id="advisory-copilot-sidebar"
      className="w-full lg:w-[380px] bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 rounded-xl flex flex-col shrink-0 h-[680px] lg:h-[calc(100vh-6.5rem)] lg:sticky lg:top-20 shadow-md transition-colors"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-900 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1960a3]/10 text-[#1960a3] dark:text-blue-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs md:text-sm text-[#002045] dark:text-white">
              Advisory Copilot AI
            </h3>
            <span className="text-[10px] text-gray-500 dark:text-slate-400 block font-mono">
              Grounded in ₹ Indian Rupee Ledgers
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold">
            Active
          </span>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-3.5 md:p-4 space-y-4 text-xs md:text-sm bg-white dark:bg-[#0f172a]">
        {messages.map((msg) => {
          const isCopilot = msg.sender === 'copilot';
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${isCopilot ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-slate-400 px-1">
                {isCopilot ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#1960a3] dark:text-blue-400" />
                    <span>Advisory Copilot • {msg.timestamp}</span>
                  </>
                ) : (
                  <>
                    <span>Relationship Manager • {msg.timestamp}</span>
                    <User className="w-3.5 h-3.5 text-[#002045] dark:text-slate-200" />
                  </>
                )}
              </div>

              <div
                className={`p-3.5 rounded-xl max-w-[94%] leading-relaxed transition-colors ${
                  isCopilot
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-tl-none border border-gray-200 dark:border-slate-700'
                    : 'bg-[#002045] dark:bg-blue-600 text-white rounded-tr-none shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                  {msg.text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Grounded Document / Ledger Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-200 dark:border-slate-700 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase font-semibold text-gray-500 dark:text-slate-400 block">
                      Grounded Ledger & Policy Sources:
                    </span>
                    {msg.citations.map((cite) => (
                      <button
                        key={cite.id}
                        onClick={() => onOpenCitation(cite)}
                        className="w-full text-left text-xs text-[#1960a3] dark:text-blue-300 hover:text-[#002045] dark:hover:text-white font-medium flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 shrink-0 text-[#1960a3] dark:text-blue-400" />
                          <span className="truncate">{cite.title}</span>
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0 ml-1 opacity-70" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#1960a3] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-lg w-fit border border-blue-200 dark:border-blue-800 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Analyzing ledger transactions and credit policies...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Action Chips */}
      <div className="px-3 pt-2 pb-1 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
        <div className="text-[10px] font-mono text-gray-500 dark:text-slate-400 uppercase mb-1 font-semibold">
          Quick Banker Inquiries:
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {quickActionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(chip)}
              disabled={isLoading}
              className="whitespace-nowrap px-2.5 py-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md text-[11px] text-gray-700 dark:text-slate-300 hover:text-[#002045] dark:hover:text-white hover:border-[#1960a3] dark:hover:border-blue-400 hover:bg-gray-100 dark:hover:bg-slate-750 transition-colors shrink-0 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 rounded-b-xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about covenants, aging, stress simulations..."
            disabled={isLoading}
            className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#1960a3] focus:border-[#1960a3] outline-none text-xs bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="absolute right-1.5 p-1.5 text-[#1960a3] dark:text-blue-400 hover:text-[#002045] dark:hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  );
};
