import Link from 'next/link';
import { Phone, MapPin, Clock, Send, ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
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
              O'zbekistondagi qurilish kompaniyalari, ustalar va do'konlar uchun elektr uskunalari va kabellarning ishonchli ta'minotchisi.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://t.me/optomelektro" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-sky-500 hover:text-white flex items-center justify-center text-sky-400 border border-slate-800 transition-colors"
                title="Telegram Kanal"
              >
                <Send className="w-4 h-4" />
              </a>
              <a 
                href="tel:+998712000000" 
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center text-blue-400 border border-slate-800 transition-colors"
                title="Qo'ng'iroq qilish"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ommabop Turkumlar</h4>
            <ul className="space-y-2">
              <li><a href="#avtomatlar" className="hover:text-white transition-colors">Avtomat uzgichlar va UZO</a></li>
              <li><a href="#kabellar" className="hover:text-white transition-colors">Mis va alyumin quvvat kabellari</a></li>
              <li><a href="#shchitlar" className="hover:text-white transition-colors">Taqsimlash qutilari va shchitlar</a></li>
              <li><a href="#kontaktorlar" className="hover:text-white transition-colors">Magnit kontaktorlar va rele</a></li>
              <li><a href="#led-yoritish" className="hover:text-white transition-colors">LED Sanoat projektorlari</a></li>
              <li><a href="#stabilizatorlar" className="hover:text-white transition-colors">Kuchlanish stabilizatorlari</a></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Mijozlarga Xizmat</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-300 font-semibold">1-3 Yil Rasmiy Kafolat</span></li>
              <li><span>Toshkent bo'ylab 3 soatda yetkazish</span></li>
              <li><span>Viloyatlarga 24 soat ichida yetkazish</span></li>
              <li><span>QQS bilan shartnoma va to'lov</span></li>
              <li><span>Elektr montaj bo'yicha maslahatlar</span></li>
            </ul>
          </div>

          {/* Col 4: Contacts & Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Do'kon Manzili</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Toshkent sh., Chilonzor t., O'rikzor ulgurji bozori, 4-blok, 18-do'kon</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+998712000000" className="hover:text-white font-mono font-bold text-slate-200">+998 71 200-00-00</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Har kuni: 08:30 — 18:30</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="http://localhost:5000/admin"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 transition-colors font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Backend Admin Panel (:5000)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 OPTOM elektro. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-2">
            <span>Sodda.uz talablariga mos zamonaviy e-tijorat tizimi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
