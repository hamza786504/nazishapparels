// components/Navbar.jsx
'use client';
import Image from 'next/image';
import CartDrawer from './CartDrawer';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../store/cartContext';
import { 
  Menu, 
  X, 
  User, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export default function Navbar() {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const toggleSubmenu = (menu) => {
        setActiveSubmenu(activeSubmenu === menu ? null : menu);
    };

    return (
        <>
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
            />

            <header className="bg-white docked w-full top-0 sticky z-50 border-b border-secondary/30 transition-transform duration-300">
                <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-5 md:py-6">

                    {/* Brand Logo & Hamburger (Mobile Left) */}
                    <div className="flex items-center space-x-4">
                       

                        {/* Brand Logo */}
                        <Link
                            href="/"
                            className=""
                        >
                            <Image src="/logos/1.png" width="120" height="80" alt="logo" />
                        </Link>
                    </div>

                    {/* Navigation Links (Desktop Middle) */}
                    <nav className="hidden md:flex space-x-8 lg:space-x-10 items-center">
                        <div className="relative group py-2">
                            <Link
                                href="/"
                                className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline flex items-center gap-1"
                            >
                                Home
                            </Link>
                        </div>
                        {/* <div className="relative group py-2">
                            
                            <Link
                                href="/collection/lawn"
                                className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline flex items-center gap-1"
                            >
                                Lawn
                                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                            </Link>
                            <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-secondary/20 shadow-lg py-2 hidden group-hover:block transition-all duration-300 z-50">
                                <Link href="/collection/lawn" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Shop All Lawn
                                </Link>
                                <Link href="/collection/lawn?fabric=Lawn" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Premium Unstitched
                                </Link>
                                <Link href="/collection/lawn" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Summer Essentials
                                </Link>
                            </div>
                        </div>

                        <div className="relative group py-2">
                            <Link
                                href="/collection/chiffon"
                                className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline flex items-center gap-1"
                            >
                                Chiffon
                                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                            </Link>
                            <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-secondary/20 shadow-lg py-2 hidden group-hover:block transition-all duration-300 z-50">
                                <Link href="/collection/chiffon" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Shop All Chiffon
                                </Link>
                                <Link href="/collection/chiffon?fabric=Chiffon" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Luxury Festive
                                </Link>
                                <Link href="/collection/chiffon?fabric=Chiffon" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Silk Mix Series
                                </Link>
                            </div>
                        </div>

                        <div className="relative group py-2">
                            <Link
                                href="/collection/3pc"
                                className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline flex items-center gap-1"
                            >
                                3pc
                                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                            </Link>
                            <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-secondary/20 shadow-lg py-2 hidden group-hover:block transition-all duration-300 z-50">
                                <Link href="/collection/3pc" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Shop All 3pc
                                </Link>
                                <Link href="/collection/3pc" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Luxury Unstitched
                                </Link>
                                <Link href="/collection/3pc" className="block px-4 py-2 font-label-md text-on-surface-variant hover:bg-secondary/10 hover:text-secondary transition-colors">
                                    Printed Classics
                                </Link>
                            </div>
                        </div> */}

                        {/* Grocery */}
                        <Link
                            href="/collection/grocery"
                            className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline py-2"
                        >
                            Grocery
                        </Link>

                        <Link
                            href="/collection/new-arrivals"
                            className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline py-2"
                        >
                            New Arrivals
                        </Link>
                        <Link
                            href="/about"
                            className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline py-2"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline py-2"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Actions (Right Side) */}
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <Link 
                            href={"/login"} 
                            className="text-primary hover:text-secondary transition-colors duration-300 active:scale-95 duration-150 ease-in-out flex items-center justify-center"
                        >
                            <User className="w-5 h-5 md:w-5 md:h-5" />
                        </Link>
                        <button 
                            onClick={() => setIsCartOpen(true)} 
                            className="text-primary hover:text-secondary transition-colors duration-300 active:scale-95 duration-150 ease-in-out relative flex items-center justify-center"
                        >
                            <ShoppingBag className="w-5 h-5 md:w-5 md:h-5" />
                            <span className="absolute -top-2 -right-1 bg-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        </button>
                         {/* Hamburger Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden text-primary hover:text-secondary focus:outline-none flex items-center justify-center"
                            aria-label="Toggle Menu"
                        >
                            {menuOpen ? (
                                <X className="w-7 h-7" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Mobile Drawer Sidebar */}
            <div className={`fixed top-0 left-0 bottom-0 z-50 w-[80%] max-w-[360px] bg-surface shadow-2xl p-6 transition-transform duration-300 ease-in-out transform md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between border-b border-secondary/20 pb-4 mb-6">
                    <span className="text-primary uppercase tracking-wider font-bold" style={{fontSize: "16px"}}>Nazish Apparels </span>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-primary hover:text-secondary focus:outline-none flex items-center justify-center"
                        aria-label="Close Menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col space-y-4">
                    {/* Home link */}
                    <div className="py-2 border-b border-secondary/10">
                        <Link
                            href="/"
                            onClick={() => setMenuOpen(false)}
                            className="text-on-surface font-label-md hover:text-secondary transition-colors uppercase tracking-wider block"
                        >
                            Home
                        </Link>
                    </div>

                    {/* <div className="flex flex-col">
                        <div className="flex items-center justify-between py-2 border-b border-secondary/10">
                            <Link
                                href="/collection/lawn"
                                onClick={() => setMenuOpen(false)}
                                className="text-on-surface font-label-md hover:text-secondary transition-colors uppercase tracking-wider"
                            >
                                Lawn
                            </Link>
                            <button
                                onClick={() => toggleSubmenu('lawn')}
                                className="text-secondary/70 hover:text-secondary bg-transparent border-none flex items-center justify-center cursor-pointer"
                            >
                                {activeSubmenu === 'lawn' ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <div className={`pl-4 flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${activeSubmenu === 'lawn' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <Link href="/collection/lawn" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Shop All Lawn
                            </Link>
                            <Link href="/collection/lawn?fabric=Lawn" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Premium Unstitched
                            </Link>
                            <Link href="/collection/lawn" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Summer Essentials
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center justify-between py-2 border-b border-secondary/10">
                            <Link
                                href="/collection/chiffon"
                                onClick={() => setMenuOpen(false)}
                                className="text-on-surface font-label-md hover:text-secondary transition-colors uppercase tracking-wider"
                            >
                                Chiffon
                            </Link>
                            <button
                                onClick={() => toggleSubmenu('chiffon')}
                                className="text-secondary/70 hover:text-secondary bg-transparent border-none flex items-center justify-center cursor-pointer"
                            >
                                {activeSubmenu === 'chiffon' ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <div className={`pl-4 flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${activeSubmenu === 'chiffon' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <Link href="/collection/chiffon" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Shop All Chiffon
                            </Link>
                            <Link href="/collection/chiffon?fabric=Chiffon" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Luxury Festive
                            </Link>
                            <Link href="/collection/chiffon?fabric=Chiffon" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Silk Mix Series
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center justify-between py-2 border-b border-secondary/10">
                            <Link
                                href="/collection/3pc"
                                onClick={() => setMenuOpen(false)}
                                className="text-on-surface font-label-md hover:text-secondary transition-colors uppercase tracking-wider"
                            >
                                3pc
                            </Link>
                            <button
                                onClick={() => toggleSubmenu('3pc')}
                                className="text-secondary/70 hover:text-secondary bg-transparent border-none flex items-center justify-center cursor-pointer"
                            >
                                {activeSubmenu === '3pc' ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <div className={`pl-4 flex flex-col space-y-2 overflow-hidden transition-all duration-300 ${activeSubmenu === '3pc' ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                            <Link href="/collection/3pc" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Shop All 3pc
                            </Link>
                            <Link href="/collection/3pc" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Luxury Unstitched
                            </Link>
                            <Link href="/collection/3pc" onClick={() => setMenuOpen(false)} className="text-on-surface-variant font-label-md hover:text-secondary py-1 transition-colors">
                                Printed Classics
                            </Link>
                        </div>
                    </div> */}

                    {/* Grocery link */}
                    <div className="py-2 border-b border-secondary/10">
                        <Link
                            href="/collection/grocery"
                            onClick={() => setMenuOpen(false)}
                            className="text-on-surface font-label-md hover:text-secondary transition-colors uppercase tracking-wider block"
                        >
                            Grocery
                        </Link>
                    </div>

                    {/* New Arrivals link */}
                    <div className="py-2 border-b border-secondary/10">
                        <Link
                            href="/collection/new-arrivals"
                            onClick={() => setMenuOpen(false)}
                            className="text-on-surface font-label-md hover:text-secondary transition-colors uppercase tracking-wider block"
                        >
                            New Arrivals
                        </Link>
                    </div>

                    {/* About link */}
                    <div className="py-2 border-b border-secondary/10">
                        <Link
                            href="/about"
                            onClick={() => setMenuOpen(false)}
                            className="text-on-surface font-label-md hover:text-secondary transition-colors uppercase tracking-wider block"
                        >
                            About
                        </Link>
                    </div>

                    {/* Contact link */}
                    <div className="py-2 border-b border-secondary/10">
                        <Link
                            href="/contact"
                            onClick={() => setMenuOpen(false)}
                            className="text-on-surface font-label-md hover:text-secondary transition-colors uppercase tracking-wider block"
                        >
                            Contact
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
}