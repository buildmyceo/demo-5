/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  User, 
  Star, 
  Clock, 
  ChevronRight, 
  Plus, 
  Minus, 
  X, 
  ArrowLeft,
  Filter,
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  Zap,
  Award,
  Smartphone,
  Store,
  Bike,
  Globe,
  Heart,
  Loader2,
  Info,
  MessageSquare,
  Percent,
  Navigation,
  Phone,
  MessageCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Page, Restaurant, FoodItem, CartItem, Review, TrackingStatus } from './types';
import { RESTAURANTS, MENU_ITEMS, CATEGORIES, INSPIRATION_CATEGORIES, REVIEWS } from './constants';

// Fix for Leaflet default icon issues in Vite
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

const LoadingOverlay = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Loader2 size={48} className="text-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
        </div>
      </div>
      <p className="text-slate-600 font-bold animate-pulse tracking-widest uppercase text-xs">QuickBite</p>
    </div>
  </motion.div>
);

const RestaurantCard = ({ restaurant, onClick }: { restaurant: Restaurant, onClick: () => void, key?: string | number }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
    onClick={onClick}
  >
    <div className="relative h-52 overflow-hidden">
      <img 
        src={restaurant.image} 
        alt={restaurant.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
          {restaurant.categories[0]}
        </div>
        {restaurant.rating >= 4.5 && (
          <div className="bg-amber-400 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Award size={12} />
            Top Rated
          </div>
        )}
      </div>
      {restaurant.isVeg && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-white" />
        </div>
      )}
    </div>
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">{restaurant.name}</h4>
          <ShieldCheck size={18} className="text-blue-500" />
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
          <Star size={14} fill="currentColor" />
          <span>{restaurant.rating}</span>
        </div>
      </div>
      <p className="text-slate-500 text-sm line-clamp-1">{restaurant.description}</p>
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1 text-slate-600 text-sm font-medium">
          <Clock size={14} />
          <span>{restaurant.deliveryTime}</span>
        </div>
        <div className="text-slate-900 font-bold text-sm">
          {restaurant.priceRange}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'delivery' | 'dining' | 'nightlife'>('delivery');
  const [isLoading, setIsLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<'menu' | 'reviews' | 'offers'>('menu');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('placed');
  const [driverLocation, setDriverLocation] = useState<[number, number]>([25.5941, 85.1376]); // Patna coordinates
  const [eta, setEta] = useState(25);

  // Cart Logic
  const addToCart = (item: FoodItem, restaurantId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, restaurantId }];
    });
    setToastMessage(`Added ${item.name} to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i).filter(i => i.quantity > 0));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // Navigation
  useEffect(() => {
    if (currentPage === 'tracking') {
      const interval = setInterval(() => {
        setDriverLocation(prev => {
          const target: [number, number] = [25.6126, 85.1588]; // Destination
          const step = 0.0001;
          const newLat = prev[0] + (target[0] > prev[0] ? step : -step);
          const newLng = prev[1] + (target[1] > prev[1] ? step : -step);
          
          // Update status based on proximity
          const dist = Math.sqrt(Math.pow(target[0] - newLat, 2) + Math.pow(target[1] - newLng, 2));
          if (dist < 0.005) setTrackingStatus('near-you');
          if (dist < 0.001) setTrackingStatus('delivered');
          
          return [newLat, newLng];
        });
        setEta(prev => Math.max(1, prev - 0.1));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [currentPage]);

  const navigateTo = (page: Page) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setOrderConfirmed(false);
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 600);
  };

  const navigateToRestaurant = (restaurant: Restaurant) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedRestaurant(restaurant);
      setCurrentPage('detail');
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 600);
  };

  const goBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (currentPage === 'detail') setCurrentPage('listing');
      else if (currentPage === 'listing') setCurrentPage('home');
      else if (currentPage === 'checkout') setCurrentPage('cart');
      else setCurrentPage('home');
      setIsLoading(false);
      window.scrollTo(0, 0);
    }, 400);
  };

  // Components
  const Navbar = () => (
    <nav className="sticky top-0 z-50 glass-morphism border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 md:gap-8">
        <h1 
          className="text-xl md:text-2xl font-black text-primary cursor-pointer tracking-tighter" 
          onClick={() => setCurrentPage('home')}
        >
          QUICKBITE
        </h1>
        <div className="hidden sm:flex items-center gap-2 text-slate-500 text-xs md:text-sm font-medium bg-slate-50 px-3 py-1.5 md:py-2 rounded-full border border-slate-100">
          <MapPin size={14} className="text-primary md:w-4 md:h-4" />
          <span className="truncate max-w-[80px] md:max-w-none">Patna, Bihar</span>
          <ChevronRight size={12} />
        </div>
      </div>

      {/* Desktop Search */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block relative group">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for restaurants or dishes..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => currentPage !== 'listing' && setCurrentPage('listing')}
          />
        </div>
        
        {/* Search Suggestions Mock */}
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Trending Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Biryani', 'Pizza', 'Burgers', 'Dosa', 'Thali'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="p-2 md:hidden hover:bg-slate-100 rounded-full transition-colors"
        >
          <Search size={22} className="text-slate-700" />
        </button>
        <button 
          onClick={() => navigateTo('listing')}
          className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-primary transition-all font-bold text-sm bg-amber-400/10 px-4 py-2 rounded-full border border-amber-400/20 group"
        >
          <Zap size={16} fill="currentColor" className="text-amber-500 group-hover:scale-125 transition-transform" />
          QuickBite One
        </button>
        <button 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag size={24} className="text-slate-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
        <button 
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full font-medium hover:bg-slate-800 transition-all"
          onClick={() => setCurrentPage('auth')}
        >
          <User size={18} />
          <span className="hidden sm:inline">Sign In</span>
        </button>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 md:hidden z-[60] shadow-xl"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search for food..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsMobileSearchOpen(false);
                    navigateTo('listing');
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  const CartSidebar = () => (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="text-slate-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Your cart is empty</h3>
                    <p className="text-slate-500">Add some delicious food to get started!</p>
                  </div>
                  <button 
                    onClick={() => { setIsCartOpen(false); setCurrentPage('listing'); }}
                    className="bg-primary text-white px-6 py-2 rounded-full font-bold"
                  >
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-slate-500 text-sm">₹{item.price}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item, item.restaurantId)}
                          className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="font-bold">₹{item.price * item.quantity}</div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold text-2xl">₹{cartTotal}</span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); setCurrentPage('checkout'); }}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const Toast = () => (
    <AnimatePresence>
      {showToast && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
        >
          <CheckCircle2 size={20} className="text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Page Views
  const HomeView = () => (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center px-4 md:px-8 overflow-hidden rounded-b-[40px]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 max-w-4xl space-y-6 md:space-y-8">
          <div className="space-y-4">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter"
            >
              CRAVE IT.<br />GET IT <span className="text-primary italic">FAST.</span>
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-xl text-slate-200 max-w-xl font-medium"
            >
              The best restaurants in Patna, delivered to your doorstep.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 text-white/60 text-sm font-bold uppercase tracking-widest overflow-hidden"
          >
            <span>Trending:</span>
            <div className="flex gap-6 animate-pulse">
              <span className="text-white">#Biryani</span>
              <span className="text-white">#Pizza</span>
              <span className="text-white">#Burgers</span>
              <span className="text-white">#Dosa</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 md:px-8 py-8 border-y border-slate-100 bg-slate-50/50">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 font-bold text-2xl"><Globe size={24} /> GLOBAL FOOD</div>
          <div className="flex items-center gap-2 font-bold text-2xl"><Award size={24} /> QUALITY FIRST</div>
          <div className="flex items-center gap-2 font-bold text-2xl"><Zap size={24} /> FLASH DELIVERY</div>
          <div className="flex items-center gap-2 font-bold text-2xl"><ShieldCheck size={24} /> SECURE PAY</div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold">What's on your mind?</h3>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex-shrink-0 group cursor-pointer"
              onClick={() => setCurrentPage('listing')}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-3 border-4 border-transparent group-hover:border-primary transition-all">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <p className="text-center font-bold text-slate-700">{cat.name} {cat.icon}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Offers Banner */}
      <section className="px-4 md:px-8">
        <div className="bg-gradient-to-r from-primary to-accent rounded-[32px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-center text-center gap-8 overflow-hidden relative">
          <div className="space-y-4 relative z-10 max-w-2xl">
            <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">Limited Offer</span>
            <h3 className="text-4xl md:text-5xl font-bold">Get 50% OFF on your<br />first 3 orders!</h3>
            <p className="text-white/80 text-lg">Use code: <span className="font-bold text-white">QUICK50</span></p>
            <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all">Order Now</button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Why QuickBite Section */}
      <section className="px-4 md:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">Why choose QuickBite?</h2>
          <p className="text-slate-500 text-lg">We're more than just a food delivery app. We're a technology company dedicated to bringing the best of your city to your doorstep.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-amber-500" />, title: "Lightning Fast", desc: "Our advanced routing technology ensures your food arrives hot and fresh in under 30 minutes." },
            { icon: <ShieldCheck className="text-emerald-500" />, title: "Quality Assured", desc: "We partner only with the highest-rated restaurants that pass our strict hygiene and quality audits." },
            { icon: <Award className="text-blue-500" />, title: "Best Offers", desc: "Enjoy exclusive deals and discounts from your favorite local spots, only available on QuickBite." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
              </div>
              <h4 className="text-xl font-bold text-slate-900">{feature.title}</h4>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold">Popular Restaurants Near You</h3>
          <button 
            onClick={() => setCurrentPage('listing')}
            className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESTAURANTS.slice(0, 3).map((res) => (
            <RestaurantCard key={res.id} restaurant={res} onClick={() => navigateToRestaurant(res)} />
          ))}
        </div>
      </section>

      {/* Partner Section */}
      <section className="px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Partner with us</h3>
              <p className="text-slate-400 text-lg max-w-md">Join our network of 500+ restaurants in Patna and grow your business with QuickBite's advanced logistics.</p>
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center gap-2">
                Register Now <ChevronRight size={20} />
              </button>
            </div>
            <Store size={200} className="absolute -right-10 -bottom-10 text-white/5 group-hover:scale-110 transition-transform duration-700" />
          </div>
          
          <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl font-bold">Ride with us</h3>
              <p className="text-white/80 text-lg max-w-md">Become a delivery partner and enjoy flexible hours, competitive pay, and the freedom to be your own boss.</p>
              <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                Join our Fleet <ChevronRight size={20} />
              </button>
            </div>
            <Bike size={200} className="absolute -right-10 -bottom-10 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="px-4 md:px-8 py-12">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-[48px] p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden border border-white shadow-inner">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Get the full experience on our mobile app</h2>
              <p className="text-slate-500 text-xl">Track orders in real-time, get exclusive app-only offers, and order your favorites with just a tap.</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all">
                <Smartphone size={24} />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-60">Download on the</p>
                  <p className="text-lg font-bold">App Store</p>
                </div>
              </button>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all">
                <Globe size={24} />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-60">Get it on</p>
                  <p className="text-lg font-bold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative z-10 bg-white p-4 rounded-[40px] shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500 border-8 border-slate-900/5">
              <img 
                src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600&auto=format&fit=crop" 
                alt="App Screenshot" 
                className="rounded-[32px] w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-4 md:px-8 rounded-t-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-3xl font-black tracking-tighter">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Zap size={24} fill="white" />
              </div>
              QUICKBITE
            </div>
            <p className="text-slate-400 leading-relaxed">Bringing the best flavors of Patna to your doorstep. Fast, reliable, and always delicious.</p>
            <div className="flex gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Heart size={18} />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Team</li>
              <li className="hover:text-white cursor-pointer transition-colors">QuickBite One</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">For Restaurants</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Partner with us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Apps for you</li>
              <li className="hover:text-white cursor-pointer transition-colors">Business solutions</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-white cursor-pointer transition-colors">Safety</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <p>© 2026 QuickBite Technologies Ltd. All rights reserved.</p>
          <div className="flex gap-8">
            <span>English (India)</span>
            <span className="flex items-center gap-2"><Globe size={14} /> Patna</span>
          </div>
        </div>
      </footer>
    </div>
  );

  const ListingView = () => {
    const [filter, setFilter] = useState<'all' | 'veg' | 'rating'>('all');
    
    const filteredRestaurants = RESTAURANTS.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           res.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      if (filter === 'veg') return matchesSearch && res.isVeg;
      if (filter === 'rating') return matchesSearch && res.rating >= 4.5;
      return matchesSearch;
    });

    return (
      <div className="pb-20">
        {/* Breadcrumbs */}
        <div className="px-4 md:px-8 py-4 text-xs text-slate-400 flex items-center gap-2">
          <span>Home</span> <ChevronRight size={10} /> 
          <span>India</span> <ChevronRight size={10} /> 
          <span>Patna</span> <ChevronRight size={10} /> 
          <span className="text-slate-600">Patna Restaurants</span>
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-8 border-b border-slate-100 flex items-center justify-between md:justify-start md:gap-12 mb-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`flex items-center gap-2 md:gap-3 py-4 border-b-2 transition-all font-medium whitespace-nowrap ${activeTab === 'delivery' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
          >
            <div className={`p-1.5 md:p-2 rounded-full ${activeTab === 'delivery' ? 'bg-primary/10' : 'bg-slate-100'}`}>
              <Truck size={18} className="md:w-5 md:h-5" />
            </div>
            <span className="text-base md:text-lg">Delivery</span>
          </button>
          <button 
            onClick={() => setActiveTab('dining')}
            className={`flex items-center gap-2 md:gap-3 py-4 border-b-2 transition-all font-medium whitespace-nowrap ${activeTab === 'dining' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
          >
            <div className={`p-1.5 md:p-2 rounded-full ${activeTab === 'dining' ? 'bg-primary/10' : 'bg-slate-100'}`}>
              <ShoppingBag size={18} className="md:w-5 md:h-5" />
            </div>
            <span className="text-base md:text-lg">Dining Out</span>
          </button>
          <button 
            onClick={() => setActiveTab('nightlife')}
            className={`flex items-center gap-2 md:gap-3 py-4 border-b-2 transition-all font-medium whitespace-nowrap ${activeTab === 'nightlife' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
          >
            <div className={`p-1.5 md:p-2 rounded-full ${activeTab === 'nightlife' ? 'bg-primary/10' : 'bg-slate-100'}`}>
              <User size={18} className="md:w-5 md:h-5" />
            </div>
            <span className="text-base md:text-lg">Nightlife</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="px-4 md:px-8 flex items-center justify-between gap-3 mb-10">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 flex items-center gap-2 hover:bg-slate-50 text-sm whitespace-nowrap">
              <Filter size={14} /> Filters
            </button>
            <button 
              onClick={() => setFilter('rating')}
              className={`px-4 py-2 rounded-lg border text-sm transition-all whitespace-nowrap ${filter === 'rating' ? 'bg-primary/5 border-primary text-primary' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Rating: 4.0+
            </button>
            <button 
              onClick={() => setFilter('veg')}
              className={`px-4 py-2 rounded-lg border text-sm transition-all whitespace-nowrap ${filter === 'veg' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Pure Veg
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm whitespace-nowrap">
              Cuisines
            </button>
          </div>
          
          <div className="hidden md:block">
            <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Sort by: Relevance</option>
              <option>Rating: High to Low</option>
              <option>Delivery Time</option>
              <option>Cost: Low to High</option>
              <option>Cost: High to Low</option>
            </select>
          </div>
        </div>

        {/* Inspiration Section */}
        <section className="px-4 md:px-8 mb-12 bg-slate-50 py-8 md:py-12">
          <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Inspiration for your first order</h3>
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {INSPIRATION_CATEGORIES.map((item) => (
              <div key={item.name} className="flex-shrink-0 text-center cursor-pointer group">
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <p className="text-sm md:text-base font-medium text-slate-700">{item.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* QuickBite One Banner */}
        <section className="px-4 md:px-8 mb-12">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  <Zap size={14} fill="currentColor" />
                  QuickBite One
                </div>
                <h3 className="text-3xl md:text-4xl font-bold">Get FREE delivery on every order!</h3>
                <p className="text-slate-400 max-w-md">Join QuickBite One and save up to ₹150 on every order with free delivery and exclusive discounts.</p>
                <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold hover:bg-amber-400 transition-all active:scale-95">
                  Join Now for ₹99/month
                </button>
              </div>
              <div className="hidden lg:block relative">
                <div className="w-64 h-64 bg-amber-400/20 rounded-full blur-3xl absolute -top-10 -right-10 animate-pulse" />
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[40px] border border-white/10 shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center">
                      <Percent className="text-slate-900" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Savings</p>
                      <p className="text-2xl font-black">₹4,250</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-amber-400" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">You've saved more than 95% of members!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant Grid */}
        <div className="px-4 md:px-8 space-y-8">
          <div>
            <h2 className="text-3xl font-bold">Delivery Restaurants in Patna</h2>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Search size={40} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold">No restaurants found</h3>
              <p className="text-slate-500">Try searching for something else or clear your filters.</p>
              <button onClick={() => {setSearchQuery(''); setFilter('all');}} className="text-primary font-bold">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((res) => (
                <RestaurantCard key={res.id} restaurant={res} onClick={() => navigateToRestaurant(res)} />
              ))}
            </div>
          )}
        </div>

        {/* Localities Section */}
        <section className="px-4 md:px-8 mt-20">
          <h3 className="text-2xl font-bold mb-8">Popular localities in and around Patna</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {['Boring Road', 'Kankarbagh', 'Patliputra', 'Bailey Road', 'Frazer Road', 'Rajendra Nagar', 'Anisabad', 'Digha', 'Phulwari Sharif'].map(loc => (
              <div key={loc} className="p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between cursor-pointer group">
                <div>
                  <h4 className="font-medium text-slate-800">{loc}</h4>
                  <p className="text-xs text-slate-400">350+ places</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const DetailView = () => {
    if (!selectedRestaurant) return null;
    const menu = MENU_ITEMS[selectedRestaurant.id] || [];
    const categories = ['Starters', 'Main Course', 'Desserts'];

    return (
      <div className="pb-20">
        {/* Banner */}
        <div className="h-80 relative">
          <img src={selectedRestaurant.image} className="w-full h-full object-cover" alt={selectedRestaurant.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:px-12 text-white">
            <button 
              onClick={goBack}
              className="mb-6 bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-bold">{selectedRestaurant.name}</h2>
                <p className="text-white/80 text-lg">{selectedRestaurant.categories.join(', ')}</p>
                <div className="flex items-center gap-6 text-sm font-medium">
                  <div className="flex items-center gap-1 bg-emerald-500 px-2 py-1 rounded-lg">
                    <Star size={14} fill="currentColor" />
                    <span>{selectedRestaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{selectedRestaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard size={16} />
                    <span>{selectedRestaurant.priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 border-b border-slate-100 flex items-center gap-6 md:gap-8 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'menu', label: 'Order Online', icon: <ShoppingBag size={18} /> },
            { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={18} /> },
            { id: 'offers', label: 'Offers', icon: <Percent size={18} /> },
            { id: 'info', label: 'Info', icon: <Info size={18} /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setDetailTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 border-b-2 transition-all font-medium whitespace-nowrap ${detailTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
            >
              {tab.icon}
              <span className="text-sm md:text-base">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-4">
          {detailTab === 'menu' && (
            <div className="flex flex-col md:flex-row gap-12">
              {/* Menu Categories Sidebar */}
              <div className="md:w-64 flex-shrink-0 hidden md:block">
                <div className="sticky top-32 space-y-2">
                  <h3 className="text-xl font-bold mb-4">Menu</h3>
                  {categories.map(cat => (
                    <a 
                      key={cat} 
                      href={`#${cat.replace(' ', '-')}`}
                      className="block py-2 px-4 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-primary transition-all font-medium"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 space-y-12">
                {categories.map(cat => {
                  const items = menu.filter(i => i.category === cat);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat} id={cat.replace(' ', '-')} className="scroll-mt-32">
                      <h3 className="text-2xl font-bold mb-6 border-b border-slate-100 pb-2">{cat}</h3>
                      <div className="space-y-8">
                        {items.map(item => (
                          <div key={item.id} className="flex gap-6 group">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                {item.isVeg ? (
                                  <div className="w-4 h-4 border border-emerald-500 flex items-center justify-center p-0.5">
                                    <div className="w-full h-full bg-emerald-500 rounded-full" />
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 border border-red-500 flex items-center justify-center p-0.5">
                                    <div className="w-full h-full bg-red-500 rounded-full" />
                                  </div>
                                )}
                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{item.name}</h4>
                              </div>
                              <p className="text-slate-900 font-bold">₹{item.price}</p>
                              <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                            </div>
                            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-2xl shadow-md" />
                              <button 
                                onClick={() => addToCart(item, selectedRestaurant.id)}
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-primary border border-slate-200 px-4 md:px-6 py-1.5 rounded-lg font-bold text-xs md:text-sm shadow-lg hover:bg-slate-50 transition-all active:scale-95"
                              >
                                ADD
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {detailTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{selectedRestaurant.name} Reviews</h3>
                <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm">Write a Review</button>
              </div>
              <div className="space-y-6">
                {(REVIEWS[selectedRestaurant.id] || []).map(review => (
                  <div key={review.id} className="p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={review.userImage} className="w-10 h-10 rounded-full" alt={review.userName} />
                        <div>
                          <p className="font-bold">{review.userName}</p>
                          <p className="text-xs text-slate-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="bg-emerald-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                        <span>{review.rating}</span>
                        <Star size={10} fill="currentColor" />
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <button className="flex items-center gap-1 hover:text-primary"><Heart size={14} /> Helpful</button>
                      <button className="flex items-center gap-1 hover:text-primary"><MessageSquare size={14} /> Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailTab === 'offers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: '50% OFF up to ₹100', code: 'WELCOME50', desc: 'Use code WELCOME50 | Above ₹199' },
                { title: 'Flat ₹125 OFF', code: 'QUICK125', desc: 'Use code QUICK125 | Above ₹499' },
                { title: 'Free Delivery', code: 'FREEDEL', desc: 'Use code FREEDEL | Above ₹299' },
              ].map(offer => (
                <div key={offer.code} className="p-6 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col justify-between gap-4 hover:border-primary/30 transition-all group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-black">
                      <Percent size={20} />
                      <h4 className="text-xl">{offer.title}</h4>
                    </div>
                    <p className="text-sm text-slate-500">{offer.desc}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 px-4 py-1 rounded-lg font-mono font-bold text-slate-700">{offer.code}</span>
                    <button className="text-primary font-bold text-sm group-hover:underline">COPY CODE</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const CheckoutView = () => (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={goBack} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold">Checkout</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Address Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 text-xl font-bold">
              <MapPin className="text-primary" />
              <h3>Delivery Address</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border-2 border-primary bg-primary/5 relative">
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle2 size={20} />
                </div>
                <h4 className="font-bold mb-1">Home</h4>
                <p className="text-slate-500 text-sm">402, Skyline Apartments, Worli, Mumbai - 400018</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 cursor-pointer transition-all">
                <h4 className="font-bold mb-1">Office</h4>
                <p className="text-slate-500 text-sm">12th Floor, Tech Park, Andheri East, Mumbai - 400069</p>
              </div>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              <Plus size={18} /> Add New Address
            </button>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 text-xl font-bold">
              <CreditCard className="text-primary" />
              <h3>Payment Method</h3>
            </div>
            <div className="space-y-3">
              {['Google Pay / UPI', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery'].map((method, i) => (
                <div key={method} className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${i === 0 ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-primary' : 'border-slate-300'}`}>
                      {i === 0 && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <span className="font-medium">{method}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 sticky top-32">
            <h3 className="text-xl font-bold">Order Summary</h3>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.name} x {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Item Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span>₹40</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Taxes & Charges</span>
                <span>₹25</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 text-slate-900">
                <span>Total</span>
                <span>₹{cartTotal + 65}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setCart([]);
                  setOrderConfirmed(true);
                  setIsLoading(false);
                  window.scrollTo(0, 0);
                }, 1500);
              }}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Truck size={20} />
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const OrderConfirmedView = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 space-y-8">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20"
      >
        <CheckCircle2 size={64} />
      </motion.div>
      
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-slate-900">Order Confirmed!</h2>
        <p className="text-slate-500 text-lg">Your delicious meal is being prepared with love.</p>
      </div>

      <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 w-full max-w-md space-y-6">
        <div className="flex items-center justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
          <span>Order ID</span>
          <span className="text-slate-900">#QB-928374</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Truck className="text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-slate-900">Arriving in 25-30 mins</p>
            <p className="text-sm text-slate-500">Our delivery partner is on the way.</p>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '30%' }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="h-full bg-primary"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={() => navigateTo('home')}
          className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Back to Home
        </button>
        <button 
          onClick={() => navigateTo('tracking')}
          className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          Track Order
        </button>
      </div>
    </div>
  );

  const TrackingView = () => {
    const restaurantPos: [number, number] = [25.5941, 85.1376];
    const userPos: [number, number] = [25.6126, 85.1588];

    const MapUpdater = ({ center }: { center: [number, number] }) => {
      const map = useMap();
      useEffect(() => {
        map.setView(center, map.getZoom());
      }, [center, map]);
      return null;
    };

    return (
      <div className="h-[calc(100vh-80px)] relative overflow-hidden">
        {/* Map Container */}
        <div className="absolute inset-0 z-0">
          <MapContainer center={driverLocation} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater center={driverLocation} />
            
            {/* Restaurant Marker */}
            <Marker position={restaurantPos}>
              <Popup>Restaurant: {selectedRestaurant?.name}</Popup>
            </Marker>

            {/* User Marker */}
            <Marker position={userPos}>
              <Popup>Your Location</Popup>
            </Marker>

            {/* Driver Marker */}
            <Marker position={driverLocation}>
              <Popup>Delivery Partner</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigateTo('home')}
          className="absolute top-6 left-6 z-10 bg-white p-4 rounded-2xl shadow-xl hover:bg-slate-50 transition-all border border-slate-100"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Tracking Info Overlay */}
        <div className="absolute bottom-6 left-4 right-4 md:bottom-10 md:left-10 md:right-auto md:w-[400px] z-10 space-y-4">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl border border-slate-100 p-6 md:p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Arrival</p>
                <h3 className="text-3xl font-black text-slate-900">{Math.ceil(eta)} mins</h3>
              </div>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Clock size={28} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Truck className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {trackingStatus === 'placed' && 'Order Placed'}
                    {trackingStatus === 'preparing' && 'Preparing your meal'}
                    {trackingStatus === 'picked-up' && 'Picked up by partner'}
                    {trackingStatus === 'near-you' && 'Arriving soon'}
                    {trackingStatus === 'delivered' && 'Delivered'}
                  </p>
                  <p className="text-sm text-slate-500">Your order is on its way</p>
                </div>
              </div>

              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  animate={{ 
                    width: trackingStatus === 'placed' ? '20%' : 
                           trackingStatus === 'preparing' ? '40%' : 
                           trackingStatus === 'picked-up' ? '60%' : 
                           trackingStatus === 'near-you' ? '90%' : '100%' 
                  }}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" alt="Driver" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Rahul Kumar</p>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star size={12} fill="currentColor" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-all">
                  <Phone size={20} />
                </button>
                <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const AuthView = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white rounded-[40px] border border-slate-100 p-10 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Welcome to QuickBite</h2>
          <p className="text-slate-500">Sign in to track orders and save addresses</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
            <div className="flex gap-2">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700">+91</div>
              <input 
                type="tel" 
                placeholder="Enter your mobile number" 
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
          <button 
            onClick={() => setCurrentPage('home')}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            Send OTP
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 border border-slate-100 py-3 rounded-2xl hover:bg-slate-50 transition-all font-medium">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 border border-slate-100 py-3 rounded-2xl hover:bg-slate-50 transition-all font-medium">
            <User size={18} className="text-slate-400" />
            Guest
          </button>
        </div>

        <p className="text-center text-sm text-slate-500">
          By continuing, you agree to our <span className="text-primary font-bold cursor-pointer">Terms of Service</span> & <span className="text-primary font-bold cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10 selection:text-primary">
      <AnimatePresence>
        {isLoading && <LoadingOverlay />}
      </AnimatePresence>
      
      <Navbar />
      <CartSidebar />
      <Toast />

      <main className="max-w-7xl mx-auto min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + (orderConfirmed ? '-confirmed' : '')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === 'home' && <HomeView />}
            {currentPage === 'listing' && <ListingView />}
            {currentPage === 'detail' && <DetailView />}
            {currentPage === 'checkout' && !orderConfirmed && <CheckoutView />}
            {orderConfirmed && currentPage !== 'tracking' && <OrderConfirmedView />}
            {currentPage === 'tracking' && <TrackingView />}
            {currentPage === 'auth' && <AuthView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Cart Bar for Mobile */}
      {cartCount > 0 && currentPage !== 'checkout' && currentPage !== 'auth' && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-4 right-4 md:hidden z-40"
        >
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-primary text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase opacity-80">{cartCount} Items</p>
                <p className="font-bold">₹{cartTotal}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 font-bold">
              View Cart <ChevronRight size={20} />
            </div>
          </button>
        </motion.div>
      )}

      {/* Global Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-4 md:px-8 mt-20 rounded-t-[60px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-3xl font-black tracking-tighter">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Zap size={24} fill="white" className="text-white" />
              </div>
              QUICKBITE
            </div>
            <p className="text-slate-400 leading-relaxed">Bringing the best flavors of Patna to your doorstep. Fast, reliable, and always delicious.</p>
            <div className="flex gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                  <Heart size={18} />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Team</li>
              <li className="hover:text-white cursor-pointer transition-colors">QuickBite One</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">For Restaurants</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Partner with us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Apps for you</li>
              <li className="hover:text-white cursor-pointer transition-colors">Business solutions</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-4">Subscribe to get the latest offers and news.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
              />
              <button className="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm">
          <div className="space-y-2 text-center md:text-left">
            <p>© 2026 QuickBite Technologies Ltd. All rights reserved.</p>
            <p className="text-xs opacity-50">sampel by <a href="https://www.buildmyceo.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">buildmyceo</a></p>
          </div>
          <div className="flex gap-8">
            <span>English (India)</span>
            <span className="flex items-center gap-2"><Globe size={14} /> Patna</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
