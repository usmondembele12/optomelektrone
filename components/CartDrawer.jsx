"use client";

import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout
}) {
  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 5000000; // 5 mln UZS

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const isWholesale = item.minWholesaleQty && item.quantity >= item.minWholesaleQty && item.wholesalePrice;
    const itemPrice = isWholesale ? item.wholesalePrice : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : 40000;
  const totalAmount = subtotal + deliveryFee;

  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Xarid Savati</h3>
                <p className="text-xs text-slate-500 font-medium">{items.length} ta mahsulot turi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery progress */}
          <div className="bg-blue-50/70 p-4 border-b border-blue-100/60 text-xs">
            {subtotal >= FREE_DELIVERY_THRESHOLD ? (
              <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tabriklaymiz! Sizga <strong>BEPUL YETKAZIB BERISH</strong> taqdim etiladi!</span>
              </p>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Bepul yetkazib berishgacha:</span>
                  <strong className="text-blue-700">{Number(FREE_DELIVERY_THRESHOLD - subtotal).toLocaleString('uz-UZ')} so'm</strong>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Savatchangiz bo'sh</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Kerakli elektr tovarlarini katalogdan tanlang va savatchaga qo'shing.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20"
                >
                  Xarid qilishni boshlash
                </button>
              </div>
            ) : (
              items.map((item) => {
                const isWholesale = item.minWholesaleQty && item.quantity >= item.minWholesaleQty && item.wholesalePrice;
                const activePrice = isWholesale ? item.wholesalePrice : item.price;
                const itemTotal = activePrice * item.quantity;

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <img
                      src={(item.image && (item.image.startsWith('/') || item.image.startsWith('http'))) ? item.image : '/images/products/avtomat-1p.png'}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.src = '/images/products/avtomat-1p.png'; }}
                      className="w-16 h-16 object-contain rounded-xl border border-slate-100 p-1 bg-slate-50 flex-shrink-0"
                    />

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Wholesale alert */}
                      {isWholesale && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          <Zap className="w-3 h-3 text-blue-600" />
                          Optom narx qo'llanildi
                        </span>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-black text-sm text-slate-900">
                            {Number(itemTotal).toLocaleString('uz-UZ')} so'm
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {Number(activePrice).toLocaleString('uz-UZ')} so'm/{item.unit || 'dona'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Mahsulotlar summasi:</span>
                  <span className="font-bold text-slate-900">{Number(subtotal).toLocaleString('uz-UZ')} so'm</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Yetkazib berish:</span>
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {deliveryFee === 0 ? 'BEPUL' : `${Number(deliveryFee).toLocaleString('uz-UZ')} so'm`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Jami to'lov:</span>
                  <span className="text-xl font-black text-blue-600">
                    {Number(totalAmount).toLocaleString('uz-UZ')} so'm
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Buyurtmani Rasmiylashtirish</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

