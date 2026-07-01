// app/_components/Admin/Header.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Store,
  User,
  Menu,
  X,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Plus,
} from 'lucide-react';
import { isAdminAuthenticated, decodeAdminToken } from '@/lib/auth';

function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Mock product data for search
  const mockProducts = [
    { id: 1, name: 'Handmade Ceramic Vase', price: '$45.00', category: 'Home Decor', image: '/api/placeholder/40/40' },
    { id: 2, name: 'Organic Cotton T-Shirt', price: '$29.99', category: 'Apparel', image: '/api/placeholder/40/40' },
    { id: 3, name: 'Bamboo Cutting Board', price: '$34.50', category: 'Kitchen', image: '/api/placeholder/40/40' },
    { id: 4, name: 'Leather Wallet', price: '$59.00', category: 'Accessories', image: '/api/placeholder/40/40' },
    { id: 5, name: 'Scented Candle Set', price: '$24.99', category: 'Home Decor', image: '/api/placeholder/40/40' },
    { id: 6, name: 'Wooden Phone Stand', price: '$19.99', category: 'Electronics', image: '/api/placeholder/40/40' },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New order #1001', time: '5 minutes ago', read: false },
    { id: 2, title: 'Low stock alert: Ceramic Vase', time: '1 hour ago', read: false },
    { id: 3, title: 'Customer review: ⭐⭐⭐⭐⭐', time: '3 hours ago', read: true },
    { id: 4, title: 'Payment received for order #998', time: '5 hours ago', read: true },
  ];

  // Check auth status on load
  useEffect(() => {
    const checkAuth = () => {
      setLoadingAuth(true);
      if (typeof window !== 'undefined') {
        const isAuthenticated = isAdminAuthenticated();
        if (isAuthenticated) {
          const decoded = decodeAdminToken();
          if (decoded) {
            setAdminData({
              id: decoded.id,
              email: decoded.email,
              username: decoded.username,
              role: decoded.role,
            });
          }
        }
      }
      setLoadingAuth(false);
    };

    checkAuth();
  }, []);

  // Search functionality
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        // Simulate API call
        const filtered = mockProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setShowSearchResults(true);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSearchResults(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page
        router.push('/admin/login');
        router.refresh();
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* TopNavBar */}
      <header className="fixed top-0 right-0 left-0 lg:left-60 h-16 bg-surface border-b border-outline-variant shadow-sm z-40 flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo - Mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <span className="text-headline-md font-headline-md font-extrabold text-primary truncate">
              Shop
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex relative flex-1 max-w-[300px]" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-9 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-on-surface-variant/60"
                  placeholder="Search..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  aria-label="Search"
                  disabled={loadingAuth}
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                      Products ({searchResults.length})
                    </div>
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full px-4 py-2 hover:bg-surface-container-high transition-colors flex items-center gap-3 text-left"
                      >
                        <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-on-surface-variant" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-md font-medium truncate">{product.name}</p>
                          <p className="text-body-sm text-on-surface-variant truncate">
                            {product.category} • {product.price}
                          </p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-on-surface-variant rotate-[-90deg] flex-shrink-0" />
                      </button>
                    ))}
                    <div className="border-t border-outline-variant px-4 py-3">
                      <button
                        onClick={handleSearch}
                        className="w-full text-center text-primary text-body-sm font-medium hover:underline flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3" />
                    <p className="text-body-md font-medium text-on-surface">No products found</p>
                    <p className="text-body-sm text-on-surface-variant mt-1">
                      Try adjusting your search terms
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button - Mobile */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Search"
            onClick={() => {
              // Focus search input on mobile (you might want to open a search modal)
              const searchInput = document.querySelector('input[placeholder*="Search"]');
              if (searchInput) searchInput.focus();
            }}
          >
            <Search className="w-5 h-5 text-on-surface-variant" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg hover:bg-surface-container transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-on-surface-variant" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-headline-md text-headline-md">Notifications</h3>
                  <button className="text-body-sm text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-surface-container-high transition-colors cursor-pointer ${!notification.read ? 'bg-primary-container/5' : ''}`}
                    >
                      <p className="text-body-md font-medium">{notification.title}</p>
                      <p className="text-body-sm text-on-surface-variant">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-outline-variant text-center">
                  <button className="text-body-sm text-primary hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Store Selector */}
          <Link target='_blank' href="/" className="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary">
            <Store className="w-5 h-5" />
            <span className="text-body-sm font-medium hidden md:inline">My Store</span>
          </Link>

          {/* Profile or Login */}
          {loadingAuth ? (
            <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                <User className="w-4 h-4" />
              </div>
            </div>
          ) : !adminData ? (
            // Show login button when not authenticated
            <Link
              href="/admin/login"
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container transition-colors"
            >
              <User className="w-4 h-4 text-on-surface-variant" />
              <span className="text-body-sm font-medium text-on-surface-variant">Login</span>
            </Link>
          ) : (
            // Show profile dropdown when authenticated
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container transition-colors"
                aria-label="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className="w-4 h-4 text-on-surface-variant hidden md:block" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-outline-variant">
                    <p className="font-body-md font-bold text-on-surface">{adminData?.username || 'Admin'}</p>
                    <p className="text-body-sm text-on-surface-variant">{adminData?.role || 'Admin'}</p>
                    <p className="text-body-sm text-on-surface-variant truncate">{adminData?.email || ''}</p>
                  </div>
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2.5 hover:bg-surface-container-high transition-colors flex items-center gap-3 text-left"
                    >
                      <User className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-body-md">My Profile</span>
                    </button>
                    <button
                      className="w-full px-4 py-2.5 hover:bg-surface-container-high transition-colors flex items-center gap-3 text-left"
                    >
                      <ShoppingBag className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-body-md">Orders</span>
                    </button>
                    <button
                      className="w-full px-4 py-2.5 hover:bg-surface-container-high transition-colors flex items-center gap-3 text-left"
                    >
                      <Settings className="w-4 h-4 text-on-surface-variant" />
                      <span className="text-body-md">Settings</span>
                    </button>
                  </div>
                  <div className="border-t border-outline-variant py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 hover:bg-surface-container-high transition-colors flex items-center gap-3 text-left text-error"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-body-md">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-surface border-r border-outline-variant z-40 lg:hidden animate-slide-in">
            <div className="p-4 border-b border-outline-variant">
              <div className="flex items-center justify-between">
                <h1 className="text-headline-md font-headline-md text-primary">Shop Admin</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-container transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-1">Merchant Portal</p>
            </div>
            <nav className="p-4 space-y-1">
              {(
                adminData
                  ? [
                    { icon: <Package className="w-5 h-5" />, label: 'Dashboard', to: '/admin' },
                    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders', to: '/admin/orders' },
                    { icon: <Users className="w-5 h-5" />, label: 'Customers', to: '/admin/customers' },
                    { icon: <Settings className="w-5 h-5" />, label: 'Settings', to: '/admin/settings' },
                  ]
                  : [
                    { icon: <User className="w-5 h-5" />, label: 'Login', to: '/admin/login' },
                  ]
              ).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="text-body-md">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-variant">
              {adminData ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-body-md">Logout</span>
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  className="w-full flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary-container/10 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-body-md">Login</span>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Header;