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
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CheckoutModal({
  isOpen,
  onClose,
  items = [],
  onOrderSuccess
}) {
  const { t } = useLanguage();
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
      setError(t('fullNamePlaceholder'));
      return;
    }
    if (formData.phone.trim().length < 13) {
      setError(t('phonePlaceholder'));
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
        setError(data.error || "Xatolik yuz berdi");
      }
    } catch (err) {
      console.error(err);
      setError("Server bilan aloqa xatosi");
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
                {t('trackStepAccepted')}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                {t('orderSuccessHeader')}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {t('orderNumberPrefix')} <strong className="text-blue-600 font-mono text-base">#{successOrder.id}</strong>
              </p>
            </div>

            {/* Telegram notification banner */}
            <div className="bg-sky-50 border border-sky-200 text-sky-800 rounded-2xl p-4 text-xs text-left flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Send className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sky-900">{t('telegramChannel')}</p>
                <p className="text-sky-700 leading-relaxed">
                  {t('orderSuccessNotification')}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('fullName')}:</span>
                <strong className="text-slate-800">{successOrder.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('yourPhone')}:</span>
                <strong className="text-slate-800 font-mono">{successOrder.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('totalLabel')}</span>
                <strong className="text-blue-600 font-bold text-sm">
                  {Number(successOrder.totalAmount).toLocaleString('uz-UZ')} {t('som')}
                </strong>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="tel:+998950090909"
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Operator bilan bog'lanish: +998 95 009-09-09</span>
              </a>

              <button
                onClick={handleClose}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all"
              >
                {t('closeBtn')}
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {t('checkoutTitle')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('checkoutCustomerInfo')}
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
                  {t('fullName')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('yourPhone')} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('phonePlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('selectCity')} *
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
                    <option value="Xorazm">Xorazm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('exactAddress')} *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required={formData.deliveryMethod === 'yetkazib_berish'}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={t('exactAddressPlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t('deliveryMethodTitle')}
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
                      <p>{t('deliveryCourier')}</p>
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
                      <p>{t('deliveryPickup')}</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {t('paymentMethodTitle')}
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
                    <span>{t('paymentCash')}</span>
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
                    <span>{t('paymentCard')}</span>
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
                    <span>{t('paymentTransfer')}</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('customerNotes')}
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('customerNotesPlaceholder')}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>

              {/* Total Summary */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">{t('totalLabel')}</span>
                  <p className="text-xl font-black text-slate-900">
                    {Number(totalAmount).toLocaleString('uz-UZ')} {t('som')}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? t('orderSubmitting') : t('confirmAndSend')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
