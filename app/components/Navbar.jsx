// components/Navbar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [cartCount] = useState(0);

    return (
        <header className="bg-surface docked w-full top-0 sticky z-50 border-b border-secondary/30">
            <div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6">
                {/* Brand Logo */}
                <div className="flex-shrink-0">
                    <Link
                        href="/"
                        className="text-headline-md font-headline-md text-primary uppercase tracking-widest"
                    >
                        Nazishapparels
                    </Link>
                </div>

                {/* Navigation Links (Desktop) */}
                <nav className="hidden md:flex space-x-10">
                    <Link
                        href="/collection/lawn"
                        className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline"
                    >
                        Lawn
                    </Link>
                    <Link
                        href="/collection/chiffon"
                        className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline"
                    >
                        Chiffon
                    </Link>
                    <Link
                        href="/collection/3pc"
                        className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline"
                    >
                        3pc
                    </Link>
                    <Link
                        href="/collection/new-arrivals"
                        className="text-on-surface-variant font-label-md hover:text-secondary transition-colors duration-300 nav-link-underline"
                    >
                        New Arrivals
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-6">
                    <button className="text-primary hover:text-secondary transition-colors duration-300 active:scale-95 duration-150 ease-in-out">
                        <span className="material-symbols-outlined">person</span>
                    </button>
                    <button className="text-primary hover:text-secondary transition-colors duration-300 active:scale-95 duration-150 ease-in-out relative">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}