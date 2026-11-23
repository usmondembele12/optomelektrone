"use client";

import { useState } from 'react';
import { 
  Phone, 
  Send, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Building2, 
  Zap, 
  PackageCheck,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingContactBar({ onOpenCallModal }) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const phoneNumbers = [
    {
      id: 'sales',
      number: '+998 95 009-09-09',
      raw: '+998950090909',
      label: "Do'kon & Savdo",
      sub: "Chakana & Buyurtmalar",
      color: "bg-blue-600 text-white",
      icon: Building2
    },
    {
      id: 'wholesale',
      number: '+998 97 447-47-47',
      raw: '+998974474747',
      label: "Optom Ta'minot",
      sub: "Katta obyektlar & Ustalar",
      color: "bg-amber-500 text-slate-900",
      icon: Zap
    },
    {
      id: 'warehouse',
      number: '+998 98 111-70-70',
      raw: '+998981117070',
      label: "Menejer / Ombor",
      sub: "Tezkor jo'natish",
      color: "bg-purple-600 text-white",
      icon: PackageCheck
    }
  ];

  const handleCopy = (e, num, id) => {
    e.stopPropagation();
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(num);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (_) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCall = (e, raw) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${raw}`;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      
      {/* EXPANDABLE QUICK CALL CARD */}
      {isExpanded && (
        <div className="mb-2 bg-white rounded-3xl p-4 shadow-2xl border border-slate-200/90 w-72 sm:w-80 animate-slideUp text-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                {t('callModalTitle')}
              </span>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {phoneNumbers.map((p) => {
              const Icon = p.icon;
              const isCopied = copiedId === p.id;

              return (
                <div 
                  key={p.id}
                  className="p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-all flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-black text-slate-800">
                        {p.label}
                      </span>
                    </div>
                    <a 
                      href={`tel:${p.raw}`}
                      onClick={(e) => handleCall(e, p.raw)}
                      className="block text-xs font-mono font-bold text-blue-600 hover:underline tracking-tight truncate mt-0.5"
                    >
                      {p.number}
                    </a>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Copy Button */}
                    <button
                      onClick={(e) => handleCopy(e, p.number, p.id)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all"
                      title="Nusxalash"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {/* Direct Call Button */}
                    <a
                      href={`tel:${p.raw}`}
                      onClick={(e) => handleCall(e, p.raw)}
                      className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition-all active:scale-95 flex items-center justify-center"
                      title="Qo'ng'iroq qilish"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full modal launcher */}
          {onOpenCallModal && (
            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenCallModal();
              }}
              className="w-full py-2 px-3 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Barcha ma'lumotlar & Telegram</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>
      )}

      {/* Direct Phone Call Button */}
      <div className="flex items-center gap-2 group">
        <button
          onClick={() => {
            if (onOpenCallModal) {
              onOpenCallModal();
            } else {
              setIsExpanded(!isExpanded);
            }
          }}
          className="w-13 h-13 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 relative cursor-pointer"
          title={`${t('callDirect')} +998 95 009-09-09`}
          aria-label="Telefon qilish"
        >
          <Phone className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-extrabold tracking-wide hidden sm:inline whitespace-nowrap">
            {t('callActionBtn')}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute -top-0.5 -right-0.5"></span>
        </button>
      </div>

      {/* Telegram Channel / Support Button */}
      <a
        href="https://t.me/optomelektro"
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        title={t('writeTelegram')}
        aria-label="Telegram"
      >
        <Send className="w-5 h-5 -rotate-12" />
        <span className="hidden group-hover:block absolute right-14 bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-xl whitespace-nowrap shadow-lg">
          💬 {t('writeTelegram')}
        </span>
      </a>
    </div>
  );
}
