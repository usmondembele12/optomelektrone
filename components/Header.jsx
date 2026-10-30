"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  ShieldCheck, 
  ChevronDown,
  LayoutGrid,
  Zap,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

export default function Header({ 
  cartCount = 0, 
  cartTotal = 0, 
  onOpenCart, 
  onOpenCatalog, 
  favoritesCount = 0,
  searchQuery = '',
  onSearchChange,
  products = [],
  onSelectProduct
}) {
  const [selectedCity, setSelectedCity] = useState("Toshkent");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const cities = ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Namangan", "Qarshi", "Navoiy"];

  const filteredSuggestions = searchQuery.trim().length > 1 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-100">
      {/* 1. TOP CONTACT & LOCATION BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* City Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1.5 hover:text-white transition-colors font-medium text-slate-200"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Shahar: <strong className="text-white">{selectedCity}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCityDropdown && (
                <div className="absolute left-0 top-full mt-2 w-40 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-1 z-50">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-700 transition-colors ${selectedCity === city ? 'text-blue-400 font-bold' : 'text-slate-300'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Har kuni: 08:30 — 18:30 (Dam olishsiz)</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a 
              href="tel:+998712000000" 
              className="flex items-center gap-1.5 hover:text-white transition-colors font-bold text-white tracking-wide"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+998 71 200-00-00</span>
            </a>

            <div className="hidden lg:flex items-center gap-1.5 text-amber-400 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Optom ta'minot: <strong>+998 90 123-45-67</strong></span>
            </div>

            <a 
              href="https://t.me/optomelektro" 
              target="_blank" 
              rel="noreferrer" 
              className="hidden sm:flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Kanal</span>
            </a>

            {/* Admin Dashboard shortcut */}
            <a
              href="http://localhost:5000/admin"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white transition-all font-semibold text-[11px] border border-blue-500/30"
              title="Backend Admin Dashboard"
            >
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>Admin Panel</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* LOGO from Image 1 */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200/80 p-1 shadow-sm group-hover:border-blue-500 transition-colors">
              <img 
                src="/images/logo.png" 
                alt="OPTOM elektro logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  OPTOM
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-600">
                  elektro
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Ulgurji & Chakana Bozor
              </span>
            </div>
          </Link>

          {/* CATALOG BUTTON */}
          <button
            onClick={onOpenCatalog}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 active:scale-95 flex-shrink-0"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Katalog</span>
          </button>

          {/* SEARCH BAR (Instant Live Search) */}
          <div className="relative flex-1 max-w-2xl">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Avtomat, kabel, LUX VOLT, shchit yoki tovar nomini qidiring..."
                className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {showSearchResults && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
                <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Qidiruv natijalari:</p>
                {filteredSuggestions.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(item);
                      setShowSearchResults(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-slate-50 rounded-xl flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image || '/images/products/avtomat-1p.png'} alt={item.name} className="w-9 h-9 object-contain rounded-lg border border-slate-100 p-1 bg-white" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">{item.name}</p>
                        <span className="text-[11px] font-medium text-slate-400">{item.brand} • {item.categoryName}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-black text-blue-600">{Number(item.price).toLocaleString('uz-UZ')} so'm</p>
                      <span className="text-[10px] text-emerald-600 font-bold">Omborda bor</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Catalog button for mobile */}
            <button
              onClick={onOpenCatalog}
              className="sm:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Katalog"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            {/* Favorites Icon */}
            <button 
              className="hidden md:flex flex-col items-center justify-center p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors relative"
              title="Sevimlilar"
            >
              <div className="relative">
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-1">Sevimlilar</span>
            </button>

            {/* CART BUTTON */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/60 text-blue-700 transition-all active:scale-95 group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">Savat</span>
                <span className="text-xs font-black text-slate-900 leading-tight">
                  {cartTotal > 0 ? `${Number(cartTotal).toLocaleString('uz-UZ')} so'm` : "Bo'sh"}
                </span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* 3. CATEGORY QUICK LINKS BAR (sodda.uz style) */}
      <div className="bg-slate-50 border-t border-slate-200/60 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-6 text-xs font-semibold text-slate-600 whitespace-nowrap">
          <button onClick={onOpenCatalog} className="text-blue-600 hover:underline flex items-center gap-1 font-bold">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Barcha turkumlar</span>
          </button>
          <span className="text-slate-300">|</span>
          <a href="#avtomatlar" className="hover:text-blue-600 transition-colors">Avtomatlar & UZO</a>
          <a href="#kabellar" className="hover:text-blue-600 transition-colors">Kabellar & Simlar</a>
          <a href="#shchitlar" className="hover:text-blue-600 transition-colors">Shchitlar & Qutilar</a>
          <a href="#kontaktorlar" className="hover:text-blue-600 transition-colors">Kontaktorlar & Rele</a>
          <a href="#led-yoritish" className="hover:text-blue-600 transition-colors">LED Sanoat Yoritish</a>
          <a href="#stabilizatorlar" className="hover:text-blue-600 transition-colors">Stabilizatorlar</a>
          <a href="#luxvolt" className="text-purple-600 font-bold hover:underline flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-600" />
            <span>LUX VOLT Mahsulotlari</span>
          </a>
        </div>
      </div>
    </header>
  );
}

