"use client";

import { X, Zap, Layers, Shield, Cpu, Activity, Power, Sun, Wrench, ChevronRight } from 'lucide-react';

const iconMap = {
  avtomatlar: Zap,
  kabellar: Layers,
  shchitlar: Shield,
  kontaktorlar: Cpu,
  stabilizatorlar: Activity,
  rozetkalar: Power,
  'led-yoritish': Sun,
  asboblar: Wrench
};

export default function CategoryDrawer({
  isOpen,
  onClose,
  categories = [],
  onSelectCategory
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                ⚡
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Mahsulotlar Katalogi</h3>
                <p className="text-xs text-slate-400">Barcha mavjud turkumlar</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 divide-y divide-slate-100">
            {categories.map((cat) => {
              const Icon = iconMap[cat.id] || Zap;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className="w-full pt-2 first:pt-0 flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-blue-600 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm leading-tight">{cat.name}</h4>
                      <span className="text-xs text-slate-400">{cat.count} ta mahsulot turi</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Katta partiyada optom buyurtma uchun: <br />
              <strong className="text-blue-600 font-bold">+998 90 123-45-67</strong>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

