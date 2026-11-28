"use client";

import { useState } from 'react';
import { X, Send, CheckCircle2, Phone, User, Zap, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

export default function QuickBuyModal({
  product,
  isOpen,
  onClose,
  onSuccess
}) {
  const { t, getLocalized } = useLanguage();
  const { formatPrice, formatSecondaryPrice, currency, usdRate } = useCurrency();
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
  const localizedName = getLocalized(product, 'name');
  const localizedUnit = getLocalized(product, 'unit');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError(t('fullNamePlaceholder'));
      return;
    }
    if (phone.trim().length < 13) {
      setError(t('phonePlaceholder'));
      return;
    }

    setLoading(true);
    setError(null);

    const orderPayload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: 'Toshkent',
      address: '1-Click Fast Order',
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
      totalAmount: totalPrice,
      currency: currency,
      usdRate: usdRate
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
        setError(data.error || "Xatolik yuz berdi");
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
            <h3 className="text-xl font-bold text-slate-900">{t('quickBuySuccess')}</h3>
            <p className="text-xs text-slate-500">
              {t('orderSuccessNotification')}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="tel:+998950090909"
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Tezkor bog'lanish: +998 95 009-09-09</span>
              </a>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t('quickBuyTitle')}</h3>
                  <p className="text-[11px] text-slate-400">{t('quickBuyDesc')}</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected item summary */}
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-100">
              <img
                src={product.image || '/images/products/avtomat-1p.png'}
                alt={localizedName}
                className="w-12 h-12 object-contain rounded-lg border border-slate-200/60 p-1 bg-white"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{localizedName}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs font-black text-blue-600">
                    {formatPrice(unitPrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{formatSecondaryPrice(unitPrice)}</span>
                  <span className="text-[10px] text-slate-400">/{localizedUnit}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('fullName')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('yourPhone')} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-700">{t('quantityLabel')}</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                  >-</button>
                  <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                  >+</button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px]">{t('totalLabel')}</span>
                  <p className="text-base font-black text-slate-900 leading-tight">
                    {formatPrice(totalPrice)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {formatSecondaryPrice(totalPrice)}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? "..." : t('submitQuickBuy')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
