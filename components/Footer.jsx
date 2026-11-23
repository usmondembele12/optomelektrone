"use client";

import Link from 'next/link';
import { Phone, MapPin, Clock, Send, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer({ onSelectCategory }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                ⚡
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">OPTOM</span>
                <span className="text-xl font-black text-blue-500 tracking-tight"> elektro</span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              {t('footerAboutDesc')}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://t.me/optomelektro" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-sky-500 hover:text-white flex items-center justify-center text-sky-400 border border-slate-800 transition-colors"
                title={t('telegramChannel')}
              >
                <Send className="w-4 h-4" />
              </a>
              <a 
                href="tel:+998950090909" 
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center text-blue-400 border border-slate-800 transition-colors"
                title={t('callDirect')}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('footerPopularCatsTitle')}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onSelectCategory && onSelectCategory('avtomatlar')} className="hover:text-white transition-colors text-left">{t('cat_avtomatlar')}</button></li>
              <li><button onClick={() => onSelectCategory && onSelectCategory('shchitlar')} className="hover:text-white transition-colors text-left">{t('cat_shchitlar')}</button></li>
              <li><button onClick={() => onSelectCategory && onSelectCategory('rele-himoya')} className="hover:text-white transition-colors text-left">{t('cat_rele_himoya')}</button></li>
              <li><button onClick={() => onSelectCategory && onSelectCategory('shinalar')} className="hover:text-white transition-colors text-left">{t('cat_shinalar')}</button></li>
              <li><button onClick={() => onSelectCategory && onSelectCategory('klemma-ulash')} className="hover:text-white transition-colors text-left">{t('cat_klemma_ulash')}</button></li>
              <li><button onClick={() => onSelectCategory && onSelectCategory('ventilyatsiya')} className="hover:text-white transition-colors text-left">{t('cat_ventilyatsiya')}</button></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('prop1Title')}</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-300 font-semibold">{t('prop1Desc')}</span></li>
              <li><span>{t('prop2Title')}</span></li>
              <li><span>{t('prop3Title')}</span></li>
              <li><span>{t('prop4Title')}</span></li>
            </ul>
          </div>

          {/* Col 4: Contacts & Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('footerContactTitle')}</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{t('footerAddress')}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+998950090909" className="hover:text-white font-mono font-bold text-slate-200">+998 95 009-09-09</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>{t('workSchedule')}</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-colors font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('adminPanel')}</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 OPTOM elektro. {t('footerAllRights')}</p>
          <p className="flex items-center gap-2">
            <span>OPTOM ELEKTRO e-Commerce Platform</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
