"use client";

import { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  Store, 
  CreditCard, 
  Banknote, 
  Building2, 
  Send, 
  Phone, 
  MapPin, 
  User, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  items = [],
  onOrderSuccess
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '+998 ',
    city: 'Toshkent',
    address: '',
    deliveryMethod: 'yetkazib_berish',
    paymentMethod: 'naqd',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 5000000;
  const subtotal = items.reduce((sum, item) => {
    const isWholesale = item.minWholesaleQty && item.quantity >= item.minWholesaleQty && item.wholesalePrice;
    const price = isWholesale ? item.wholesalePrice : item.price;
    return sum + (price * item.quantity);
  }, 0);

  const deliveryFee = formData.deliveryMethod === 'olib_ketish' || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 40000;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setError("Iltimos, ismingizni kiriting!");
      return;
    }
    if (formData.phone.trim().length < 13) {
      setError("Iltimos, to'liq telefon raqamingizni kiriting!");
      return;
    }

    setLoading(true);
    setError(null);

    const orderPayload = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      city: formData.city,
      address: formData.address.trim(),
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes.trim(),
      items: items.map(item => {
        const isWholesale = item.minWholesaleQty && item.quantity >= item.minWholesaleQty && item.wholesalePrice;
        const price = isWholesale ? item.wholesalePrice : item.price;
        return {
          productId: item.id,
          name: item.name,
          price: price,
          quantity: item.quantity,
          unit: item.unit || 'dona',
          total: price * item.quantity
        };
      }),
      totalAmount: totalAmount
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessOrder(data.order);
        if (onOrderSuccess) onOrderSuccess(data.order);
      } else {
        setError(data.error || "Buyurtma yuborishda xatolik yuz berdi");
      }
    } catch (err) {
      console.error(err);
      setError("Server bilan bog'lanishda xatolik. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessOrder(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 my-8">
        
        {/* SUCCESS VIEW */}
        {successOrder ? (
          <div className="text-center py-6 space-y-5">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Muvaffaqiyatli qabul qilindi
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                Rahmat! Buyurtmangiz rasmiylashtirildi
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Buyurtma raqami: <strong className="text-blue-600 font-mono text-base">#{successOrder.id}</strong>
              </p>
            </div>

            {/* Telegram confirmation notification banner */}
            <div className="bg-sky-50 border border-sky-200 text-sky-800 rounded-2xl p-4 text-xs text-left flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Send className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sky-900">Telegram Botga Xabar Yuborildi</p>
                <p className="text-sky-700 leading-relaxed">
                  Buyurtma tafsilotlari darhol do'kon operatorlari va omborxona mas'ullariga yetkazildi. 10 daqiqa ichida siz bilan bog'lanamiz!
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Qabul qiluvchi:</span>
                <strong className="text-slate-800">{successOrder.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Telefon:</span>
                <strong className="text-slate-800 font-mono">{successOrder.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jami to'lov:</span>
                <strong className="text-blue-600 font-bold text-sm">
                  {Number(successOrder.totalAmount).toLocaleString('uz-UZ')} so'm
                </strong>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all"
            >
              Tushunarli, Davom etish
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Buyurtmani Rasmiylashtirish
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ma'lumotlaringizni kiriting va buyurtmani tasdiqlang
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ismingiz va Familiyangiz *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Masalan: Aziz Rahimov"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Telefon Raqamingiz *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Shahar / Viloyat *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none font-medium"
                  >
                    <option value="Toshkent">Toshkent shahri</option>
                    <option value="Toshkent viloyati">Toshkent viloyati</option>
                    <option value="Samarqand">Samarqand</option>
                    <option value="Buxoro">Buxoro</option>
                    <option value="Andijon">Andijon</option>
                    <option value="Farg'ona">Farg'ona</option>
                    <option value="Namangan">Namangan</option>
                    <option value="Qarshi">Qashqadaryo (Qarshi)</option>
                    <option value="Navoiy">Navoiy</option>
                    <option value="Xorazm">Xorazm (Urganch)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Yetkazish Manzili *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required={formData.deliveryMethod === 'yetkazib_berish'}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Tuman, ko'cha, uy raqami"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Yetkazib Berish Usuli
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'yetkazib_berish' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      formData.deliveryMethod === 'yetkazib_berish'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-xs">
                      <p>Kuryer orqali</p>
                      <span className="text-[10px] text-slate-400 font-normal">Manzilga tezkor</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, deliveryMethod: 'olib_ketish' })}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      formData.deliveryMethod === 'olib_ketish'
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <Store className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="text-xs">
                      <p>Olib ketish</p>
                      <span className="text-[10px] text-slate-400 font-normal">O'rikzor do'konimizdan</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  To'lov Turi
                </label>
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'naqd' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      formData.paymentMethod === 'naqd'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Naqd pul</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'karta' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      formData.paymentMethod === 'karta'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Plastik karta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'hisob_raqam' })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                      formData.paymentMethod === 'hisob_raqam'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span>Bank hisob (Optom)</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Qo'shimcha Izoh (Ixtiyoriy)
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Masalan: Soat 15:00 dan keyin yetkazing yoki schet-faktura tayyorlang"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Jami to'lov:</span>
                  <p className="text-xl font-black text-slate-900">
                    {Number(totalAmount).toLocaleString('uz-UZ')} so'm
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Yuborilmoqda..." : "Buyurtmani Tasdiqlash"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

