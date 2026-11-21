"use client";

import { useState } from 'react';
import { X, Search, Package, Clock, CheckCircle2, Truck, AlertCircle, ShoppingBag } from 'lucide-react';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanId = orderId.trim();
    if (!cleanId) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      // Allow searching by raw number e.g. "984210" or "ORD-984210"
      const formattedId = cleanId.toUpperCase().startsWith('ORD-') ? cleanId.toUpperCase() : `ORD-${cleanId}`;
      const res = await fetch(`/api/orders/${formattedId}`, { cache: 'no-store' });
      const data = await res.json();

      if (res.ok && data && data.id) {
        setOrder(data);
      } else {
        setError("Ushbu raqamli buyurtma topilmadi. Raqamni to'g'ri kiritganingizni tekshiring.");
      }
    } catch (err) {
      setError("Server bilan aloqa xatosi yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step) => {
    if (!order) return 'upcoming';
    const status = order.status;

    if (status === 'bekor_qilindi') {
      return 'cancelled';
    }

    if (step === 1) return 'completed';
    if (step === 2) {
      if (['qabul_qilindi', 'yetkazilmoqda', 'yetkazildi'].includes(status)) return 'completed';
      return 'active';
    }
    if (step === 3) {
      if (['yetkazilmoqda', 'yetkazildi'].includes(status)) return 'completed';
      if (status === 'qabul_qilindi') return 'active';
      return 'upcoming';
    }
    if (step === 4) {
      if (status === 'yetkazildi') return 'completed';
      if (status === 'yetkazilmoqda') return 'active';
      return 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Buyurtma Holatini Tekshirish</h3>
              <p className="text-xs text-slate-500">Buyurtma raqamini kiriting va holatini bilib oling</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Masalan: ORD-984210 yoki 984210"
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all"
            >
              {loading ? "Qidirilmoqda..." : "Tekshirish"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order details display */}
        {order && (
          <div className="mt-6 space-y-5">
            {/* Order status banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buyurtma raqami:</span>
                  <p className="font-mono font-black text-slate-900 text-base">#{order.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jami to'lov:</span>
                  <p className="font-black text-blue-600 text-base">{Number(order.totalAmount).toLocaleString('uz-UZ')} so'm</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                {[
                  { step: 1, label: "Yuborildi", icon: ShoppingBag },
                  { step: 2, label: "Qabul qilindi", icon: Clock },
                  { step: 3, label: "Yetkazilmoqda", icon: Truck },
                  { step: 4, label: "Yetkazildi", icon: CheckCircle2 }
                ].map(({ step, label, icon: Icon }) => {
                  const status = getStepStatus(step);
                  const isDone = status === 'completed';
                  const isActive = status === 'active';

                  return (
                    <div key={step} className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isDone 
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' 
                          : isActive
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-slate-200 text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold leading-tight ${
                        isDone ? 'text-emerald-700' : isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="bg-white rounded-xl border border-slate-100 p-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Qabul qiluvchi:</span>
                <strong className="text-slate-800">{order.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telefon:</span>
                <strong className="text-slate-800 font-mono">{order.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Manzil:</span>
                <strong className="text-slate-800">{order.city}, {order.address}</strong>
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Buyurtmadagi mahsulotlar:</span>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate mr-2">{item.name}</span>
                    <span className="text-slate-500 font-bold whitespace-nowrap">
                      {item.quantity} {item.unit || 'dona'} × {Number(item.price).toLocaleString('uz-UZ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
