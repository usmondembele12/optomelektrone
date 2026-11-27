"use client";

import { useState } from 'react';
import { 
  X, 
  Phone, 
  PhoneCall, 
  Copy, 
  Check, 
  Send, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  PackageCheck, 
  Zap,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PhoneCallModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const contacts = [
    {
      id: 'sales',
      number: '+998 95 009-09-09',
      rawNumber: '+998950090909',
      title: t('callDeptSales'),
      desc: t('callDeptSalesDesc'),
      badge: "Do'kon & Savdo",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Building2,
      accentColor: "blue",
      isPrimary: true
    },
    {
      id: 'wholesale',
      number: '+998 97 447-47-47',
      rawNumber: '+998974474747',
      title: t('callDeptWholesale'),
      desc: t('callDeptWholesaleDesc'),
      badge: "Optom & Usta",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      icon: Zap,
      accentColor: "amber",
      isPrimary: false
    },
    {
      id: 'warehouse',
      number: '+998 98 111-70-70',
      rawNumber: '+998981117070',
      title: t('callDeptWarehouse'),
      desc: t('callDeptWarehouseDesc'),
      badge: "Menejer & Ombor",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      icon: PackageCheck,
      accentColor: "purple",
      isPrimary: false
    }
  ];

  const handleCopy = (number, idx) => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number);
      } else {
        const input = document.createElement('input');
        input.value = number;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch (_) {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  const handleDirectCall = (rawNumber) => {
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${rawNumber}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
      />

      {/* Centering container with min-h-full to prevent top clipping when viewport is small */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        {/* Modal Dialog */}
        <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 pt-7 sm:p-8 sm:pt-9 shadow-2xl z-10 my-auto text-left border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-500"></div>

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm flex-shrink-0">
              <PhoneCall className="w-6 h-6 animate-pulse text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
                  {t('callModalTitle')}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {t('callModalSubtitle')}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors ml-2"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Work hours banner */}
        <div className="mt-4 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold text-slate-800">Operatorlar aloqada</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>08:30 — 18:30</span>
          </div>
        </div>

        {/* Phone numbers list */}
        <div className="mt-4 space-y-3">
          {contacts.map((contact, idx) => {
            const Icon = contact.icon;
            const isCopied = copiedIndex === idx;

            return (
              <div 
                key={contact.id}
                className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                  contact.isPrimary 
                    ? 'bg-blue-50/40 border-blue-200/80 shadow-sm' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      contact.accentColor === 'blue' ? 'bg-blue-100 text-blue-600' :
                      contact.accentColor === 'amber' ? 'bg-amber-100 text-amber-700' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {contact.title}
                        </h4>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${contact.badgeColor}`}>
                          {contact.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {contact.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Big Number & Actions Row */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="font-mono font-black text-base sm:text-lg text-slate-900 tracking-tight select-all">
                    {contact.number}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(contact.number, idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                        isCopied 
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/60'
                      }`}
                      title="Raqamni nusxalash"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>{t('callCopiedToast')}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t('callCopyBtn')}</span>
                        </>
                      )}
                    </button>

                    {/* Direct Call Anchor Button */}
                    <a
                      href={`tel:${contact.rawNumber}`}
                      onClick={() => handleDirectCall(contact.rawNumber)}
                      className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/25 active:scale-95 flex items-center gap-1.5 group"
                    >
                      <Phone className="w-3.5 h-3.5 group-hover:animate-bounce" />
                      <span>{t('callActionBtn')}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Online Channels (Telegram) */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
          <a
            href="https://t.me/optomelektro"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-800 transition-all flex items-center gap-2.5 text-xs font-bold group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Send className="w-4 h-4 -rotate-12" />
            </div>
            <div className="text-left">
              <span className="block leading-tight font-black">{t('callTelegramChannel')}</span>
              <span className="text-[10px] text-sky-600 font-normal">@optomelektro</span>
            </div>
          </a>

          <a
            href="https://t.me/optomelektro_uz_bot"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-800 transition-all flex items-center gap-2.5 text-xs font-bold group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block leading-tight font-black">{t('callTelegramBot')}</span>
              <span className="text-[10px] text-blue-600 font-normal">@optomelektro_uz_bot</span>
            </div>
          </a>
        </div>

        {/* Physical Address Footnote */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 bg-slate-50 px-3 py-2 rounded-xl">
          <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="line-clamp-1">{t('footerAddress')}</span>
        </div>

      </div>
    </div>
  </div>
);
}
