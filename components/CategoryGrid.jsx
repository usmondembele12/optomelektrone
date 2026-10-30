"use client";

import { 
  Zap, 
  Layers, 
  Shield, 
  Cpu, 
  Activity, 
  Power, 
  Sun, 
  Wrench,
  ArrowRight
} from 'lucide-react';

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

export default function CategoryGrid({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Turkumlar bo'yicha saralash
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Barcha elektr tovarlari ishonchli zavod standartlarida jamlangan
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Barchasini ko'rsatish
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.id] || Zap;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 group relative overflow-hidden ${
                isSelected 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]' 
                  : 'bg-white border-slate-200/80 hover:border-blue-400 hover:shadow-md text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count} ta
                </span>
              </div>

              <div>
                <h4 className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'}`}>
                  {cat.name}
                </h4>
                <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  Optom va chakana
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

