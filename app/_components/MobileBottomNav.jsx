'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  Grid2x2,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react';
import { useCart } from '../store/cartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartItems } = useCart();
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    {
      label: 'Home',
      icon: House,
      href: '/',
    },
    {
      label: 'Categories',
      icon: Grid2x2,
      href: '/categories',
    },
    {
      label: 'Cart',
      icon: ShoppingBag,
      href: '/cart',
      badge: cartCount,
    },
    {
      label: 'New In',
      icon: Sparkles,
      href: '/new-arrivals',
    },
    {
      label: 'Account',
      icon: User,
      href: '/account',
    },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-[65px] px-2 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 group relative ${
                isActive 
                  ? 'text-secondary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-secondary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-0.5 tracking-wide ${
                isActive ? 'font-semibold' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}