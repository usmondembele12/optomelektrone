"use client";

import { useState } from 'react';
import { X, Send, CheckCircle2, Phone, User, Zap, AlertCircle } from 'lucide-react';

export default function QuickBuyModal({
  product,
  isOpen,
  onClose,
  onSuccess
}) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const isWholesale = product.minWholesaleQty && quantity >= product.minWholesaleQty && product.wholesalePrice;
  const unitPrice = isWholesale ? product.wholesalePrice : product.price;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError("Iltimos, ismingizni kiriting!");
      return;
    }
    if (phone.trim().length < 13) {
      setError("Iltimos, to'liq telefon raqamingizni kiriting!");
      return;
    }

    setLoading(true);
    setError(null);

    const orderPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: 'Toshkent',
      address: '1 bosishda tezkor buyurtma (Operator aniqlaydi)',
      deliveryMethod: 'yetkazib_berish',
      paymentMethod: 'naqd',
      notes: '1 bosishda tezkor xarid orqali buyurtma berildi',
      items: [
        {
          productId: product.id,
          name: product.name,
          price: unitPrice,
          quantity: quantity,
          unit: product.unit || 'dona',
          total: totalPrice
        }
      ],
      totalAmount: totalPrice
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess(data.order);
      } else {
        setError(data.error || "Buyurtma yuborishda xatolik yuz berdi");
      }
    } catch (err) {
      setError("Server bilan aloqa xatosi");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={handleClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10">
        
        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tezkor Buyurtma Qabul Qilindi!</h3>
            <p className="text-xs text-slate-500">
              Ma'lumotlar Telegram botga yetkazildi. Operatorimiz 5 daqiqada sizga qo'ng'iroq qiladi!
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm"
            >
              Yopish
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">1 Bosishda Buyurtma</h3>
                <p className="text-xs text-slate-500">Tezkor xarid qilish</p>
              </div>
              <button onClick={handleClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Product summary */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <img
                src={(product.image && (product.image.startsWith('/') || product.image.startsWith('http'))) ? product.image : '/images/products/avtomat-1p.png'}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = '/images/products/avtomat-1p.png'; }}
                className="w-14 h-14 object-contain rounded-xl border border-slate-200 p-1 bg-white"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">{product.name}</h4>
                <p className="text-xs font-black text-blue-600 mt-0.5">
                  {Number(unitPrice).toLocaleString('uz-UZ')} so'm
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                >-</button>
                <span className="w-7 text-center text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                >+</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ismingiz *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ismingizni kiriting"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Telefon Raqamingiz *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400">Jami to'lov:</span>
                  <p className="font-black text-lg text-slate-900">
                    {Number(totalPrice).toLocaleString('uz-UZ')} so'm
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Yuborilmoqda..." : "Buyurtma berish"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

