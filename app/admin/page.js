"use client";

import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between text-white flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Do'konga Qaytish</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm tracking-wide">OPTOM elektro</span>
            <span className="text-xs text-blue-400 font-semibold">Admin Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Tizim Faol
          </span>

          <a
            href="/admin.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <span>To'liq ekranda ochish</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Admin Frame */}
      <main className="flex-1 w-full bg-slate-900 relative">
        <iframe
          src="/admin.html"
          title="OPTOM elektro Admin Panel"
          className="w-full h-full border-0"
        />
      </main>
    </div>
  );
}
