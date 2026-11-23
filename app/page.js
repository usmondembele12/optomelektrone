"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import QuickBuyModal from '../components/QuickBuyModal';
import ProductDetailModal from '../components/ProductDetailModal';
import CategoryDrawer from '../components/CategoryDrawer';
import FavoritesDrawer from '../components/FavoritesDrawer';
import TrackOrderModal from '../components/TrackOrderModal';
import FloatingContactBar from '../components/FloatingContactBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowUpDown, 
  CheckCircle2, 
  PhoneCall, 
  Send, 
  Sparkles,
  Search,
  FilterX,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const { lang, t, getLocalized } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('popular');

  // Cart & Favorites
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  
  const [quickBuyProduct, setQuickBuyProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const productsRef = useRef(null);

  // Helper to merge local client overrides
  const applyClientOverrides = (apiProducts) => {
    if (typeof window === 'undefined') return apiProducts || [];
    try {
      const deletedIds = JSON.parse(localStorage.getItem('optom_deleted_product_ids') || '[]').map(String);
      const deletedNames = JSON.parse(localStorage.getItem('optom_deleted_product_names') || '[]').map(s => String(s).toLowerCase().trim());
      const customProds = JSON.parse(localStorage.getItem('optom_custom_products') || '[]');

      let list = (apiProducts || []).filter(p => {
        if (deletedIds.includes(String(p.id))) return false;
        if (p.name && deletedNames.includes(String(p.name).toLowerCase().trim())) return false;
        return true;
      });

      for (const c of customProds) {
        if (deletedIds.includes(String(c.id))) continue;
        if (c.name && deletedNames.includes(String(c.name).toLowerCase().trim())) continue;
        const idx = list.findIndex(p => String(p.id) === String(c.id));
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...c };
        } else {
          list.unshift(c);
        }
      }
      return list;
    } catch (_) {
      return apiProducts || [];
    }
  };

  const handleDeleteProduct = async (id, name) => {
    try {
      const custom = JSON.parse(localStorage.getItem('optom_custom_products') || '[]');
      const filteredCustom = custom.filter(p => String(p.id) !== String(id) && (!name || p.name.toLowerCase() !== name.toLowerCase()));
      localStorage.setItem('optom_custom_products', JSON.stringify(filteredCustom));

      const deletedIds = JSON.parse(localStorage.getItem('optom_deleted_product_ids') || '[]');
      if (!deletedIds.map(String).includes(String(id))) {
        deletedIds.push(String(id));
        localStorage.setItem('optom_deleted_product_ids', JSON.stringify(deletedIds));
      }

      if (name) {
        const deletedNames = JSON.parse(localStorage.getItem('optom_deleted_product_names') || '[]');
        const cleanName = String(name).toLowerCase().trim();
        if (!deletedNames.includes(cleanName)) {
          deletedNames.push(cleanName);
          localStorage.setItem('optom_deleted_product_names', JSON.stringify(deletedNames));
        }
      }

      setProducts(prev => prev.filter(p => String(p.id) !== String(id) && (!name || (p.name && p.name.toLowerCase() !== name.toLowerCase()))));

      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
      } catch (_) {}

      try {
        if (typeof BroadcastChannel !== 'undefined') {
          new BroadcastChannel('optom_sync').postMessage({ type: 'product_deleted', id, name });
        }
      } catch (_) {}

      showToast(t('toastProductDeleted'));
    } catch (e) {
      console.error(e);
    }
  };

  const loadData = async () => {
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch('/api/products', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' })
      ]);

      if (prodsRes.ok) {
        const prodsData = await prodsRes.json();
        const rawList = Array.isArray(prodsData) ? prodsData : (prodsData.products || []);
        const merged = applyClientOverrides(rawList);
        setProducts(merged);
      }

      if (catsRes.ok) {
        const catsData = await catsRes.json();
        const rawCats = Array.isArray(catsData) ? catsData : (catsData.categories || []);
        setCategories(rawCats);
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('optom_custom_products') || '[]');
      const deleted = JSON.parse(localStorage.getItem('optom_deleted_product_ids') || '[]');
      if (custom.length > 0 || deleted.length > 0) {
        setProducts(prev => applyClientOverrides(prev));
      }
    } catch (_) {}

    loadData();

    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);

    const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('optom_sync') : null;
    if (syncChannel) {
      syncChannel.onmessage = () => {
        loadData();
      };
    }

    const handleMessage = (e) => {
      if (e.data && e.data.optom_sync) {
        loadData();
      }
    };
    window.addEventListener('message', handleMessage);

    const handleStorage = (e) => {
      if (!e.key || e.key === 'optom_custom_products' || e.key === 'optom_deleted_product_ids') {
        loadData();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('optom_sync', () => loadData());

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        loadData();
      }
    }, 5000);

    try {
      const savedCart = localStorage.getItem('optom_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedFavs = localStorage.getItem('optom_favs');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch (_) {}

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
      if (syncChannel) syncChannel.close();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('optom_cart', JSON.stringify(cart));
    } catch (_) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('optom_favs', JSON.stringify(favorites));
    } catch (_) {}
  }, [favorites]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || qty) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            wholesalePrice: product.wholesalePrice,
            minWholesaleQty: product.minWholesaleQty || 10,
            unit: product.unit || 'dona',
            image: product.image,
            quantity: product.quantity || qty
          }
        ];
      }
    });
    showToast(`"${getLocalized(product, 'name')}" ${t('toastAddedToCart')}`);
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveCartItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast(t('toastRemovedFromCart'));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(t('toastRemovedFavorite'));
        return prev.filter((favId) => favId !== id);
      } else {
        showToast(t('toastAddedFavorite'));
        return [...prev, id];
      }
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const isWholesale = item.minWholesaleQty && item.quantity >= item.minWholesaleQty && item.wholesalePrice;
    const price = isWholesale ? item.wholesalePrice : item.price;
    return sum + (price * item.quantity);
  }, 0);

  const brandsList = useMemo(() => {
    const list = ['ALL'];
    const knownBrands = ['LUX VOLT', 'ELEBOX', 'GIP', 'HEV', 'Standart'];
    knownBrands.forEach(b => { if (!list.includes(b)) list.push(b); });
    products.forEach(p => {
      if (p.brand && !list.some(b => b.toLowerCase() === p.brand.toLowerCase())) {
        list.push(p.brand);
      }
    });
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const locName = getLocalized(p, 'name').toLowerCase();
        const rawName = (p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const locCat = getLocalized(p, 'categoryName').toLowerCase();
        return locName.includes(q) || rawName.includes(q) || brand.includes(q) || desc.includes(q) || locCat.includes(q);
      });
    }

    // Category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Brand
    if (selectedBrand && selectedBrand !== 'ALL') {
      result = result.filter((p) => (p.brand || '').toLowerCase() === selectedBrand.toLowerCase());
    }

    // Only Favorites
    if (onlyFavorites) {
      result = result.filter((p) => favorites.includes(p.id));
    }

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, sortBy, onlyFavorites, favorites, lang]);

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* 1. HEADER */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={products}
        onSelectProduct={(p) => setDetailProduct(p)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToProducts();
        }}
        onSelectBrand={(brandName) => {
          setSelectedBrand(brandName);
          scrollToProducts();
        }}
      />

      {/* 2. MAIN STOREFRONT CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        
        {/* HERO SLIDER BANNER */}
        <HeroSlider
          onSelectBrand={(brand) => {
            setSelectedBrand(brand);
            scrollToProducts();
          }}
          onScrollToProducts={scrollToProducts}
        />

        {/* CATEGORY GRID */}
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            scrollToProducts();
          }}
        />

        {/* 3. PRODUCTS CATALOG SECTION */}
        <section ref={productsRef} className="space-y-6 pt-4">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 rounded-full bg-blue-600"></span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {t('catalogTitle')}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-4">
                <strong className="text-blue-600">{filteredProducts.length}</strong> {t('productsFound')}
              </p>
            </div>

            {/* Sort & Quick Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Quick Favorites Toggle */}
              <button
                onClick={() => {
                  setOnlyFavorites(!onlyFavorites);
                  scrollToProducts();
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  onlyFavorites
                    ? 'bg-rose-500 text-white shadow-rose-500/25 ring-2 ring-rose-300'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600'
                }`}
                title={t('filterFavoritesOnly')}
              >
                <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white text-white' : favorites.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                <span>{t('favorites')} ({favorites.length})</span>
              </button>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('sortLabel')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent focus:outline-none text-blue-600 font-bold cursor-pointer"
                >
                  <option value="popular">{t('sortPopular')}</option>
                  <option value="price_asc">{t('sortPriceAsc')}</option>
                  <option value="price_desc">{t('sortPriceDesc')}</option>
                </select>
              </div>

              {(selectedCategory || selectedBrand !== 'ALL' || searchQuery || onlyFavorites) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrand('ALL');
                    setSearchQuery('');
                    setOnlyFavorites(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  <span>{t('filterClear')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Brand Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {brandsList.map((brand) => {
              const label = brand === 'ALL' ? t('filterAll') : brand;
              const isSelected = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">{t('noProductsFound')}</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('noProductsDesc')}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand('ALL');
                  setSearchQuery('');
                  setOnlyFavorites(false);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                {t('filterClear')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const inCart = cart.find((c) => c.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onQuickBuy={(p) => setQuickBuyProduct(p)}
                    onOpenDetail={(p) => setDetailProduct(p)}
                    onDeleteProduct={handleDeleteProduct}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={handleToggleFavorite}
                    cartQuantity={inCart ? inCart.quantity : 0}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 4. WHOLESALE DIRECT PROCUREMENT BANNER */}
        <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              {t('heroBadge2')}
            </span>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {t('heroTitle2')}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {t('heroDesc2')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="tel:+998974474747"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>+998 97 447-47-47 ({t('wholesalePriceLabel')})</span>
              </a>

              <a
                href="https://t.me/optomelektro"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>{t('telegramChannel')}</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* 5. FOOTER */}
      <Footer 
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToProducts();
        }}
      />

      {/* ==================== MODALS ==================== */}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        products={products}
        cart={cart}
        onAddToCart={(p, qty) => handleAddToCart(p, qty || 1)}
        onRemoveFavorite={handleToggleFavorite}
        onOpenDetail={(p) => setDetailProduct(p)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={(order) => {
          handleClearCart();
          loadData();
          showToast(`#${order.id} ${t('orderSuccessHeader')}`);
        }}
      />

      {/* Quick 1-Click Buy Modal */}
      <QuickBuyModal
        isOpen={!!quickBuyProduct}
        product={quickBuyProduct}
        onClose={() => setQuickBuyProduct(null)}
        onSuccess={(order) => {
          loadData();
          showToast(`#${order.id} ${t('quickBuySuccess')}`);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!detailProduct}
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={(p) => handleAddToCart(p, p.quantity || 1)}
        onQuickBuy={(p) => {
          setDetailProduct(null);
          setQuickBuyProduct(p);
        }}
        cartQuantity={
          detailProduct ? (cart.find((c) => c.id === detailProduct.id)?.quantity || 0) : 0
        }
      />

      {/* Full Categories Mega-Menu Drawer */}
      <CategoryDrawer
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        categories={categories}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToProducts();
        }}
      />

      {/* Customer Order Status Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Floating Call & Telegram Contact Buttons */}
      <FloatingContactBar />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
