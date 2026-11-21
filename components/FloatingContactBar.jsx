"use client";

import { Phone, Send, MessageCircle } from 'lucide-react';

export default function FloatingContactBar() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Direct Phone Call Button */}
      <a
        href="tel:+998712000000"
        className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        title="Bizga qo'ng'iroq qiling: +998 71 200-00-00"
      >
        <Phone className="w-5 h-5 animate-pulse" />
        <span className="hidden group-hover:block absolute right-14 bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-xl whitespace-nowrap shadow-lg">
          📞 Qo'ng'iroq qilish (+998 71 200-00-00)
        </span>
      </a>

      {/* Telegram Channel / Support Button */}
      <a
        href="https://t.me/optomelektro"
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        title="Telegram Kanalimiz va Bog'lanish"
      >
        <Send className="w-5 h-5 -rotate-12" />
        <span className="hidden group-hover:block absolute right-14 bg-slate-900 text-white text-xs font-bold py-1 px-3 rounded-xl whitespace-nowrap shadow-lg">
          💬 Telegram Kanalimiz (@optomelektro)
        </span>
      </a>
    </div>
  );
}
