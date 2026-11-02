"use client";

import { useState } from 'react';
import { ShoppingCart, Zap, Check, Heart, Eye, Trash2 } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onQuickBuy, 
  onOpenDetail,
  onDeleteProduct,
  isFavorite = false,
  onToggleFavorite,
  cartQuantity = 0
}) {
  const [isHovered, setIsHovered] = useState(false);

  const priceFormatted = Number(product.price).toLocaleString('uz-UZ');
  const oldPriceFormatted = product.oldPrice ? Number(product.oldPrice).toLocaleString('uz-UZ') : null;
  const wholesalePriceFormatted = product.wholesalePrice ? Number(product.wholesalePrice).toLocaleString('uz-UZ') : null;

  const validImage = (product.image && (product.image.startsWith('/') || product.image.startsWith('http')))
    ? product.image
    : '/images/products/avtomat-1p.png';

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BADGES & ACTIONS */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm pointer-events-auto">
            {product.brand}
          </span>
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-sm pointer-events-auto">
              ⭐ TAVSIYA
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {onDeleteProduct && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`"${product.name}" mahsulotini o'chirmoqchimisiz?`)) {
                  onDeleteProduct(product.id, product.name);
                }
              }}
              className="w-8 h-8 rounded-full bg-white/95 hover:bg-rose-50 text-slate-400 hover:text-rose-600 backdrop-blur-md shadow-sm border border-slate-200/60 flex items-center justify-center transition-all opacity-75 hover:opacity-100"
              title="Mahsulotni o'chirish"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(product.id);
            }}
            className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-200/60 flex items-center justify-center transition-all ${
              isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
            }`}
            title="Sevimlilarga qo'shish"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* PRODUCT IMAGE */}
      <div 
        onClick={() => onOpenDetail && onOpenDetail(product)}
        className="w-full h-52 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6 relative cursor-pointer overflow-hidden"
      >
        <img
          src={validImage}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = '/images/products/avtomat-1p.png'; }}
          className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
        />

        {/* Quick view overlay button */}
        <div className={`absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenDetail) onOpenDetail(product);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Batafsil ko'rish</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category & Stock status */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">{product.categoryName}</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Omborda bor
            </span>
          </div>

          {/* Product Title */}
          <h4 
            onClick={() => onOpenDetail && onOpenDetail(product)}
            className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug hover:text-blue-600 transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Wholesale Tier Highlight */}
          {product.wholesalePrice && product.wholesalePrice < product.price && (
            <div className="bg-blue-50 border border-blue-100/80 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-600" />
                Optom narx:
              </span>
              <span className="font-extrabold text-blue-800">
                {wholesalePriceFormatted} so'm
              </span>
            </div>
          )}
        </div>

        {/* PRICING & BUTTONS */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          {/* Prices */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">
              {priceFormatted} <span className="text-xs font-bold text-slate-500">so'm</span>
            </span>
            {oldPriceFormatted && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {oldPriceFormatted} so'm
              </span>
            )}
            <span className="text-[10px] text-slate-400">/{product.unit || 'dona'}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {/* Quick 1-click buy */}
            <button
              onClick={() => onQuickBuy && onQuickBuy(product)}
              className="w-full py-2 px-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold transition-all text-center whitespace-nowrap active:scale-95"
            >
              1 bosishda xarid
            </button>

            {/* Add to cart */}
            <button
              onClick={() => onAddToCart && onAddToCart(product)}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap ${
                cartQuantity > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
              }`}
            >
              {cartQuantity > 0 ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Savatda ({cartQuantity})</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Savatga</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

