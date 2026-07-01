import './globals.css';
import { EB_Garamond, Manrope, Jost } from 'next/font/google';
import { CartProvider } from './store/cartContext';

const ebGaramond = EB_Garamond({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-eb-garamond',
    display: 'swap',
});

const manrope = Manrope({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    variable: '--font-manrope',
    display: 'swap',
});

const jost = Jost({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-jost',
    display: 'swap',
});

export const metadata = {
    title: 'Nazishapparels | Heritage Meets Luxury',
    description: 'Premium Eastern wear blending centuries-old traditions with modern silhouettes.',
    keywords: 'lawn, chiffon, 3pc, eastern wear, luxury fashion, Pakistan',
};

export default function RootLayout({ children }) {

    return (
        <html
            lang="en"
            className={`scroll-smooth ${ebGaramond.variable} ${manrope.variable} ${jost.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                />
            </head>
            <body className="bg-surface text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
                <CartProvider>
                    {children}
                </CartProvider>
            </body>
        </html>
    );
}