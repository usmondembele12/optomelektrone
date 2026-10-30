"use client";

import { useState } from 'react';
import { X, ShoppingCart, Zap, ShieldCheck, Check, Heart, Phone } from 'lucide-react';

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onQuickBuy,
  cartQuantity = 0
}) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isWholesale = product.minWholesaleQty && quantity >= product.minWholesaleQty && product.wholesalePrice;
  const currentPrice = isWholesale ? product.wholesalePrice : product.price;
  const totalPrice = currentPrice * quantity;

  const validImage = (product.image && (product.image.startsWith('/') || product.image.startsWith('http')))
    ? product.image
    : '/images/products/avtomat-1p.png';

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
              alt={product.name}
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
                <span className="text-slate-400 font-semibold">{product.categoryName}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Omborda {product.stock} {product.unit || 'dona'} mavjud
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h2>

              {/* Pricing Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">
                    {Number(currentPrice).toLocaleString('uz-UZ')} <span className="text-sm font-bold text-slate-500">so'm</span>
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      {Number(product.oldPrice).toLocaleString('uz-UZ')} so'm
                    </span>
                  )}
                  <span className="text-xs text-slate-400">/{product.unit || 'dona'}</span>
                </div>

                {product.wholesalePrice && (
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1.5 rounded-xl">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Optom narxi: <strong>{Number(product.wholesalePrice).toLocaleString('uz-UZ')} so'm</strong> ({product.minWholesaleQty || 10}+ {product.unit || 'dona'} olinganda)</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Specs Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Texnik parametrlar:</h4>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5">
                    {Object.entries(product.specs).map(([key, val]) => (
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
                  <span className="text-xs text-slate-400">Jami summa:</span>
                  <p className="text-lg font-black text-blue-600 leading-none">
                    {Number(totalPrice).toLocaleString('uz-UZ')} so'm
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
                  1 Bosishda Buyurtma
                </button>

                <button
                  onClick={() => {
                    if (onAddToCart) onAddToCart({ ...product, quantity });
                    onClose();
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Savatga Qo'shish</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

