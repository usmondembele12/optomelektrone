"use client";

import { X, Heart, ShoppingCart, Trash2, ArrowRight, Zap, Check } from 'lucide-react';

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites = [],
  products = [],
  cart = [],
  onAddToCart,
  onRemoveFavorite,
  onOpenDetail
}) {
  if (!isOpen) return null;

  // Find all favorite products
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const handleAddAllToCart = () => {
    favoriteProducts.forEach(prod => {
      if (onAddToCart) onAddToCart(prod, 1);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg">Sevimlilar</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {favoriteProducts.length > 0 
                    ? `${favoriteProducts.length} ta saqlangan mahsulot`
                    : 'Saqlangan mahsulotlar'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {favoriteProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                  <Heart className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Sevimlilar ro'yxati bo'sh</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Sizga yoqqan mahsulotlarni keyinroq tez topish va buyurtma qilish uchun mahsulot kartochkasidagi yurakcha belgisini bosing.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                >
                  Katalogga o'tish
                </button>
              </div>
            ) : (
              favoriteProducts.map((product) => {
                const inCart = cart.find(c => c.id === product.id);
                const validImage = (product.image && (product.image.startsWith('/') || product.image.startsWith('http')))
                  ? product.image
                  : '/images/products/avtomat-1p.png';

                return (
                  <div 
                    key={product.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-white shadow-sm flex gap-3 transition-all group"
                  >
                    <div 
                      onClick={() => {
                        onClose();
                        if (onOpenDetail) onOpenDetail(product);
                      }}
                      className="w-20 h-20 bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-center flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={validImage}
                        alt={product.name}
                        onError={(e) => { e.currentTarget.src = '/images/products/avtomat-1p.png'; }}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                            {product.brand}
                          </span>
                          <button
                            onClick={() => onRemoveFavorite && onRemoveFavorite(product.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                            title="Sevimlilardan o'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 
                          onClick={() => {
                            onClose();
                            if (onOpenDetail) onOpenDetail(product);
                          }}
                          className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug hover:text-blue-600 cursor-pointer"
                        >
                          {product.name}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="font-black text-xs text-slate-900">
                            {Number(product.price).toLocaleString('uz-UZ')} so'm
                          </p>
                          {product.wholesalePrice && (
                            <span className="text-[10px] text-blue-600 font-bold block">
                              Optom: {Number(product.wholesalePrice).toLocaleString('uz-UZ')} so'm
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => onAddToCart && onAddToCart(product, 1)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                            inCart 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Savatda ({inCart.quantity})</span>
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
                );
              })
            )}
          </div>

          {/* Footer */}
          {favoriteProducts.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <button
                onClick={handleAddAllToCart}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Barchasini savatga qo'shish</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Xaridni davom ettirish
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

