'use client';
// components/Footer.jsx
import Link from 'next/link';
import { useState } from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import { useSiteSettings } from '../store/siteSettingsContext';
import { X, Send } from 'lucide-react';

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const settings = useSiteSettings();
    const logoSrc = settings?.logoUrl || '/logo.png';
    const storeName = settings?.storeName || 'NazishApparels';

    const handleWhatsAppSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const encodedMessage = encodeURIComponent(message.trim());
        window.open(`https://wa.me/+923124190029?text=${encodedMessage}`, '_blank');
        setMessage('');
        setIsOpen(false);
    };

    return (
        <>
            <footer className="mt-8 bg-white border-t border-secondary/30 pt-stack-lg pb-10">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row flex-wrap gap-gutter mb-20">
                    {/* First Column - 35% width on desktop */}
                    <div className="w-full md:w-[35%] lg:w-[35%]">
                        <Link
                            href="/"
                            className="text-headline-sm font-headline-sm text-primary mb-6 block uppercase tracking-widest"
                        >
                            <Image src={logoSrc} width="150" height="100" alt={storeName} />
                        </Link>
                        <p className="text-body-lg font-body-md text-on-surface-variant leading-relaxed">
                            Dedicated to the art of fine clothing, fusing age-old traditions of tailoring with modern, elegant design.
                        </p>
                    </div>

                    {/* Remaining columns take up remaining space */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                        {/* Collections Column */}
                        <div>
                            <h4 className="font-bold text-base text-primary mb-8 tracking-widest">
                                COLLECTIONS
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'New Arrivals', slug: 'new-arrivals' },
                                    { name: 'Lawn', slug: 'lawn' },
                                    { name: 'Chiffon', slug: 'chiffon' },
                                    { name: '2PC Collection', slug: '2pc-collection' },
                                    { name: '3PC Collection', slug: '3pc-collection' },
                                    { name: 'Unstitched', slug: 'unstitched' },
                                    { name: 'Stitched', slug: 'stitched' },
                                ].map((cat) => (
                                    <li key={cat.slug}>
                                        <Link
                                            href={`/collection/${cat.slug}`}
                                            className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Assistance Column */}
                        <div>
                            <h4 className="font-bold text-base text-primary mb-8 tracking-widest">
                                Quick Links
                            </h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                                    >
                                        About
                                    </Link>
                                </li>
                               
                            </ul>
                        </div>

                        {/* Connect Column */}
                        <div>
                            <h4 className="font-bold text-base  text-primary mb-8 tracking-widest">
                                CONNECT
                            </h4>
                            <div className="flex space-x-6">
                                {/* <Link
                                    href="#"
                                    className="text-secondary hover:text-primary transition-all duration-300 active:scale-95"
                                    aria-label="Facebook"
                                >
                                    <FaFacebook size={24} />
                                </Link> */}
                                <Link
                                    href="https://www.instagram.com/nazishapparels/"
                                    className="text-secondary hover:text-primary transition-all duration-300 active:scale-95"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram size={24} />
                                </Link>
                                {/* <Link
                                    href="#"
                                    className="text-secondary hover:text-primary transition-all duration-300 active:scale-95"
                                    aria-label="TikTok"
                                >
                                    <FaTiktok size={24} />
                                </Link> */}
                            </div>
                            <div className="mt-8">
                                <p className="text-label-sm font-label-sm text-on-surface-variant">
                                    Pakistan | Global Shipping
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center md:text-left">
                    <p className="text-label-sm font-label-sm text-on-tertiary-container">
                        &copy; 2024 {storeName}. Crafting Heritage with Contemporary Luxury.
                    </p>
                </div>
            </footer>

           
        </>
    );
}