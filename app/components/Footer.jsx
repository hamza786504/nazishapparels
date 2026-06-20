// components/Footer.jsx
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-surface-container border-t border-secondary/30 pt-stack-lg pb-10">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter mb-20">
                <div>
                    <Link
                        href="/"
                        className="text-headline-sm font-headline-sm text-primary mb-6 block uppercase tracking-widest"
                    >
                        Nazishapparels
                    </Link>
                    <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                        Dedicated to the art of luxury Eastern wear, blending centuries-old traditions
                        with modern silhouettes.
                    </p>
                </div>

                <div>
                    <h4 className="text-label-md font-label-md text-primary mb-8 tracking-widest">
                        COLLECTIONS
                    </h4>
                    <ul className="space-y-4">
                        <li>
                            <Link
                                href="/collection/new-arrival"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                New Arrival
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/collection/chiffon"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                Chiffon
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/collection/3pc"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                3 PC
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/collection/lawn"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                Lawn
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-label-md font-label-md text-primary mb-8 tracking-widest">
                        ASSISTANCE
                    </h4>
                    <ul className="space-y-4">
                        <li>
                            <Link
                                href="#"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                Our Story
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                Shipping Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                Returns
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                Size Guide
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="#"
                                className="text-on-surface-variant font-label-sm hover:text-secondary transition-all"
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-label-md font-label-md text-primary mb-8 tracking-widest">
                        CONNECT
                    </h4>
                    <div className="flex space-x-6">
                        <a
                            href="#"
                            className="text-secondary hover:text-primary transition-all duration-300 active:scale-95"
                            aria-label="Facebook"
                        >
                            <FaFacebook size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-secondary hover:text-primary transition-all duration-300 active:scale-95"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={24} />
                        </a>
                        <a
                            href="#"
                            className="text-secondary hover:text-primary transition-all duration-300 active:scale-95"
                            aria-label="TikTok"
                        >
                            <FaTiktok size={24} />
                        </a>
                    </div>
                    <div className="mt-8">
                        <p className="text-label-sm font-label-sm text-on-surface-variant">
                            Pakistan | Global Shipping
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center md:text-left">
                <p className="text-label-sm font-label-sm text-on-tertiary-container">
                    &copy; 2024 Nazishapparels. Crafting Heritage with Contemporary Luxury.
                </p>
            </div>
        </footer>
    );
}