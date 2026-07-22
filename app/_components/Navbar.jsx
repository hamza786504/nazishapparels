// components/Navbar.jsx
'use client';
import Image from 'next/image';
import CartDrawer from './CartDrawer';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../store/cartContext';
import { useAuth } from '../store/authContext';
import { useNavMenu } from '../store/navMenuContext';
import { useSiteSettings } from '../store/siteSettingsContext';
import { useFavorites } from '../store/favoritesContext';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  User,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Search,
  MapPin,
  Tag,
  Package,
  FileText,
  Heart,
} from 'lucide-react';

// ── Recursive desktop sub-menu item ──────────────────────────────────────────
function DesktopSubMenuItem({ item, depth }) {
  const hasChildren = item.children && item.children.length > 0;
  const indent = 16 + depth * 20;
  return (
    <div>
      <Link
        href={item.url}
        className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors"
        style={{ paddingLeft: `${indent}px` }}
      >
        {item.title}
      </Link>
      {hasChildren && (
        <div className="border-l-2 border-secondary/20 ml-6">
          {item.children.map((child) => (
            <DesktopSubMenuItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Recursive mobile nav item ─────────────────────────────────────────────────
function MobileNavItem({ item, depth, onClose }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const indent = depth * 16;
  return (
    <div>
      <div className="flex items-center justify-between py-2.5 border-b border-secondary/10"
        style={{ paddingLeft: `${indent}px` }}>
        <Link
          href={item.url}
          onClick={onClose}
          className="font-label-md hover:text-secondary transition-colors uppercase tracking-wider"
          style={{ fontSize: depth > 0 ? '13px' : undefined, color: depth > 0 ? 'var(--color-on-surface-variant)' : undefined }}
        >
          {item.title}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setOpen(!open)}
            className="text-secondary/70 hover:text-secondary bg-transparent border-none flex items-center justify-center cursor-pointer p-1"
          >
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hasChildren && (
        <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-1">
            {item.children.map((child) => (
              <MobileNavItem key={child.id} item={child} depth={depth + 1} onClose={onClose} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Category icon helper ──────────────────────────────────────────────────────
function getResultIcon(type) {
  switch (type) {
    case 'product':    return <Package className="w-3.5 h-3.5 text-secondary" />;
    case 'collection': return <Tag     className="w-3.5 h-3.5 text-emerald-500" />;
    default:           return <FileText className="w-3.5 h-3.5 text-gray-400" />;
  }
}

// ── Category Dropdown Logic ──────────────────────────────────────────────────
function CategoryDropdown({ navItems, selectedCategory, onSelect, alignRight }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const displayLabel = selectedCategory?.title || 'All';

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-gray-600 py-2 px-2 hover:text-secondary transition-colors bg-transparent"
      >
        <span className="truncate font-medium">{displayLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute ${alignRight ? 'right-0' : 'left-0'} top-full mt-2 w-52 bg-white border border-gray-200 shadow-xl rounded-md py-1 z-50 max-h-72 overflow-y-auto`}>
          {/* All option */}
          <button
            type="button"
            onClick={() => { onSelect(null); setOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${!selectedCategory ? 'text-secondary font-medium' : 'text-gray-700'}`}
          >
            All Categories
            {!selectedCategory && <span className="text-secondary text-xs">✓</span>}
          </button>

          {/* Divider */}
          {navItems.length > 0 && <div className="border-t border-gray-100 my-1" />}

          {/* Dynamic nav items from admin */}
          {navItems.map((item) => (
            <button
              key={item.id || item.title}
              type="button"
              onClick={() => { onSelect(item); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedCategory?.title === item.title ? 'text-secondary font-medium' : 'text-gray-700'}`}
            >
              <span className="truncate">{item.title}</span>
              {selectedCategory?.title === item.title && <span className="text-secondary text-xs flex-shrink-0">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Desktop Search Box ──────────────────────────────────────────────────────
function SearchBox({ navItems }) {
  const router = useRouter();
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const inputRef   = useRef(null);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Close suggestion panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced typeahead
  const fetchSuggestions = useCallback((q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/menus/search?q=${encodeURIComponent(q.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.results || []);
          setShowSuggestions(true);
        }
      } catch {} finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const doSearch = useCallback((q) => {
    const trimmed = (q || query).trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    const categorySlug = selectedCategory?.url ? selectedCategory.url.replace('/collection/', '') : '';
    const params = new URLSearchParams({ q: trimmed });
    if (categorySlug) params.set('category', categorySlug);
    router.push(`/search?${params.toString()}`);
  }, [query, selectedCategory, router]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  const handleSuggestionClick = (result) => {
    setShowSuggestions(false);
    setQuery(result.label);
    router.push(result.url);
  };

  return (
    <div ref={wrapperRef} className="flex-1 hidden md:flex items-center relative">
      <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-lg hover:border-secondary focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary/30 transition-all px-2 max-w-[400px] mx-4">
        {/* Category Dropdown */}
        <CategoryDropdown
          navItems={navItems}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          placeholder={selectedCategory ? `Search in ${selectedCategory.title}…` : 'Search products...'}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 py-2.5 placeholder:text-gray-400"
          autoComplete="off"
        />

        {/* Search Icon */}
        <button type="button" onClick={() => doSearch()} className="p-1.5 rounded-md hover:bg-secondary/10 transition-colors flex-shrink-0">
          {loading ? (
            <span className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            <Search className="w-4 h-4 text-gray-500 hover:text-secondary transition-colors" />
          )}
        </button>
      </div>

      {/* Typeahead Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-200 shadow-2xl rounded-lg z-50 overflow-hidden max-w-2xl">
          {suggestions.map((result) => (
            <button key={result.id} type="button" onClick={() => handleSuggestionClick(result)} className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none group">
              <span className="flex-shrink-0">{getResultIcon(result.type)}</span>
              <span className="text-sm text-gray-700 group-hover:text-secondary transition-colors truncate flex-1">{result.label}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider flex-shrink-0">{result.type}</span>
            </button>
          ))}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <button type="button" onClick={() => doSearch()} className="text-xs text-secondary hover:underline">
              See all results for &ldquo;{query}&rdquo; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mobile Search Bar ────────────────────────────────────────────────────────
function MobileSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const doSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="flex items-center bg-[#F5F5F5] rounded-lg px-4 py-2.5 gap-3 mt-2 transition-colors focus-within:bg-white focus-within:ring-1 focus-within:ring-secondary">
      <Search className="w-5 h-5 text-gray-700 flex-shrink-0" strokeWidth={2} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && doSearch()}
        placeholder="Search for products, brands and categories"
        className="flex-1 bg-transparent outline-none text-[15px] text-gray-800 placeholder:text-gray-500"
      />
    </div>
  );
}

// ── Mobile Horizontal Categories ─────────────────────────────────────────────
function MobileHorizontalCategories({ navItems }) {
  const pathname = usePathname();
  return (
   <div className="md:hidden w-full overflow-x-auto whitespace-nowrap scrollbar-hide pt-3 px-0 flex items-center gap-6 no-scrollbar">
      {/* "All" Link */}
      <Link 
        href="/search" 
        className={`text-[15px] transition-colors pb-1 border-b-2 ${
          pathname === '/search' 
            ? 'text-gray-900 border-black font-medium' 
            : 'text-gray-600 border-transparent hover:text-secondary'
        }`}
      >
        All
      </Link>

      {/* Dynamic Nav Links */}
      {navItems.map((item) => {
        const isActive = pathname === item.url || (pathname.startsWith(item.url) && item.url !== '/');

        return (
          <Link 
            key={item.id} 
            href={item.url} 
            className={`text-[15px] transition-colors pb-1 border-b-2 ${
              isActive 
                ? 'text-gray-900 border-black font-medium' 
                : 'text-gray-600 border-transparent hover:text-secondary'
            }`}
          >
            {item.title}
          </Link>
        );
      })}
      
      <div className="w-4 flex-shrink-0"></div>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated, customer, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen]       = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try { await logout(); } catch {}
    router.push('/login');
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [userMenuOpen]);

  const navItems = useNavMenu();        
  const settings = useSiteSettings();
  const logoSrc = settings?.logoUrl || '/logo.png';
  const storeName = settings?.storeName || 'NazishApparels';

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      {/* 1. Announcement Bar */}
      <div className="w-full bg-[#111111] text-white text-[11px] sm:text-[13px] font-medium py-2 text-center px-4 tracking-wide">
        Get Free Delivery on 10,000PKR above Shopping
      </div>

      <header className="bg-white docked w-full top-0 z-50 border-b border-gray-200 transition-transform duration-300">
        <div className="flex flex-col max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 md:py-3">
          
          {/* Row 1: Logo & Right Actions */}
          <div className="flex justify-between items-center w-full gap-2">
            
            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="block">
                <Image src={logoSrc} width="160" height="90" alt={storeName} className="h-14 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Search Bar (Visible MD+) */}
            <SearchBox navItems={navItems} />

            {/* Actions (User, Cart, Hamburger) */}
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
              
              {/* Mobile Location Pin (Only visual, no currency) */}
              <div className="flex md:hidden items-center gap-1.5 cursor-pointer text-sm">
                <div className="bg-[#0c7f3a] text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 h-3 fill-current" />
                </div>
              </div>

              {/* User account */}
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) router.push('/login');
                    else setUserMenuOpen((open) => !open);
                  }}
                  className="text-gray-800 hover:text-secondary transition-colors duration-300 active:scale-95 flex items-center justify-center p-1"
                >
                  <User className="w-5 h-5" />
                </button>

                {isAuthenticated && userMenuOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl z-50 rounded-sm py-2">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{customer?.name || 'My Account'}</p>
                      <p className="text-[11px] text-gray-500 truncate">{customer?.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-secondary">Dashboard</Link>
                    <Link href="/profile"   onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-secondary">Profile</Link>
                    <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>

              {/* Favorites / Wishlist */}
              <Link
                href="/favorites"
                aria-label="Wishlist"
                className="relative text-gray-800 hover:text-red-500 transition-colors duration-300 flex items-center justify-center p-1"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {favoritesCount > 9 ? '9+' : favoritesCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-gray-800 hover:text-secondary transition-colors duration-300 active:scale-95 relative flex items-center justify-center p-1"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              </button>

              {/* Hamburger — Mobile */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-gray-800 hover:text-secondary focus:outline-none flex items-center justify-center p-1"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Row 2: Mobile Search Bar (Only visible < md) */}
          <div className="md:hidden block w-full mt-1">
            <MobileSearchBar />
          </div>

          {/* Row 3: Mobile Horizontal Categories (Only visible < md) */}
          <MobileHorizontalCategories navItems={navItems} />

        </div>
      </header>

      {/* ── Mobile Drawer Overlay ──────────────────────────────────────────── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      <div className={`fixed top-0 left-0 bottom-0 z-50 w-[80%] max-w-[360px] bg-white shadow-2xl p-6 transition-transform duration-300 ease-in-out transform md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <span className="text-gray-800 uppercase tracking-wider font-bold text-lg">{storeName}</span>
          <button onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-secondary p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col space-y-1 mt-2">
          {navItems.map((item) => (
            <MobileNavItem key={item.id} item={item} depth={0} onClose={() => setMenuOpen(false)} />
          ))}
        </nav>
      </div>
    </>
  );
}