"use client";

import { useState } from 'react';
import { X, ShoppingCart, Zap, Sparkles, Send, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onQuickBuy,
  cartQuantity = 0
}) {
  const { t, getLocalized } = useLanguage();
  const { formatPrice, formatSecondaryPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isWholesale = product.minWholesaleQty && quantity >= product.minWholesaleQty && product.wholesalePrice;
  const currentPrice = isWholesale ? product.wholesalePrice : product.price;
  const totalPrice = currentPrice * quantity;
  const normalTotal = (product.price || currentPrice) * quantity;
  const wholesaleSavings = normalTotal - totalPrice;
  const neededForWholesale = (product.minWholesaleQty && product.wholesalePrice && quantity < product.minWholesaleQty)
    ? (product.minWholesaleQty - quantity)
    : 0;

  const validImage = (product.image && (product.image.startsWith('/') || product.image.startsWith('http')))
    ? product.image
    : '/images/products/avtomat-1p.png';

  const localizedName = getLocalized(product, 'name');
  const localizedCategory = getLocalized(product, 'categoryName');
  const localizedUnit = getLocalized(product, 'unit');
  const localizedDescription = getLocalized(product, 'description');
  const localizedSpecs = getLocalized(product, 'specs');

  const handleShareTelegram = () => {
    const text = encodeURIComponent(`⚡ ${localizedName}\n💰 ${formatPrice(currentPrice)}\n🏬 OPTOM elektro`);
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://optomelektro.uz');
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center relative min-h-[300px]">
            <img
              src={validImage}
              alt={localizedName}
              onError={(e) => { e.currentTarget.src = '/images/products/avtomat-1p.png'; }}
              className="max-h-72 max-w-full object-contain"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                {product.brand}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">{localizedCategory}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {t('inStock')} ({product.stock} {localizedUnit})
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {localizedName}
              </h2>

              {/* Pricing Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {formatPrice(currentPrice)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-slate-400 line-through font-semibold">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">/{localizedUnit}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 mt-0.5">
                    {formatSecondaryPrice(currentPrice)}
                  </span>
                </div>

                {product.wholesalePrice && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>{t('wholesalePriceLabel')} <strong>{formatPrice(product.wholesalePrice)}</strong> ({product.minWholesaleQty || 10}+ {localizedUnit})</span>
                      </div>
                      {neededForWholesale > 0 && (
                        <button
                          type="button"
                          onClick={() => setQuantity(product.minWholesaleQty || 10)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black transition-colors"
                        >
                          {t('switchToWholesaleBtn')}
                        </button>
                      )}
                    </div>

                    {/* Wholesale Savings Banner */}
                    {isWholesale && wholesaleSavings > 0 && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-pulse">
                        <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{t('wholesaleDiscountSuccess')} {t('savedAmountNotice')} <strong>{formatPrice(wholesaleSavings)}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {localizedDescription}
              </p>

              {/* Specs Table */}
              {localizedSpecs && Object.keys(localizedSpecs).length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('specsTitle')}:</h4>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5">
                    {Object.entries(localizedSpecs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-0.5 border-b border-slate-100 last:border-0">
                        <span className="text-slate-500">{key}:</span>
                        <span className="font-bold text-slate-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                  >-</button>
                  <span className="w-10 text-center font-bold text-slate-900 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200"
                  >+</button>
                </div>

                <div className="flex-1 text-right">
                  <span className="text-xs text-slate-400">{t('totalLabel')}</span>
                  <p className="text-lg font-black text-blue-600 leading-none">
                    {formatPrice(totalPrice)}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                    {formatSecondaryPrice(totalPrice)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    if (onQuickBuy) onQuickBuy(product);
                  }}
                  className="w-full py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs rounded-xl transition-all"
                >
                  {t('quickBuyBtn')}
                </button>

                <button
                  onClick={() => {
                    if (onAddToCart) onAddToCart({ ...product, quantity });
                    onClose();
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('addToCartModalBtn')}</span>
                </button>
              </div>

              {/* Direct Call & Telegram Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="tel:+998950090909"
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1.5"
                  title="Do'konga to'g'ridan-to'g'ri qo'ng'iroq qilish"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Qo'ng'iroq: +998 95 009-09-09</span>
                </a>
                <button
                  type="button"
                  onClick={handleShareTelegram}
                  className="py-2 px-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1.5"
                  title="Telegram orqali do'stlarga yuborish"
                >
                  <Send className="w-3.5 h-3.5 text-sky-500" />
                  <span>Telegram</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
