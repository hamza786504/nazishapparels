import './globals.css';
import { EB_Garamond, Manrope, Jost } from 'next/font/google';
import { CartProvider } from './store/cartContext';
import { AuthProvider } from './store/authContext';
import { NavMenuProvider } from './store/navMenuContext';
import { FavoritesProvider } from './store/favoritesContext';
import { getHeaderMenuItems } from '@/lib/getHeaderMenu';
import { getSiteSettings } from '..//lib/getSiteSettings';
import { SiteSettingsProvider } from './store/siteSettingsContext';

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

// Revalidate periodically so header menu edits made in the admin panel
// show up without requiring a full rebuild/redeploy.
export const revalidate = 60;

export const metadata = {
    title: 'NazishApparels | Heritage Meets Luxury',
    description: 'Premium Eastern wear blending centuries-old traditions with modern silhouettes.',
    keywords: 'lawn, chiffon, 3pc, eastern wear, luxury fashion, Pakistan',
};

export default async function RootLayout({ children }) {
    const headerNavItems = await getHeaderMenuItems();
    const settings = await getSiteSettings();


    return (
        <html
            lang="en"
            className={`scroll-smooth ${ebGaramond.variable} ${manrope.variable} ${jost.variable}`}
            suppressHydrationWarning
        >
            <head>


            </head>
            <body className="bg-surface text-on-surface selection:bg-secondary-container selection:text-on-secondary-container">
                <SiteSettingsProvider  settings={settings}>
                    <AuthProvider>
                        <CartProvider>
                            <FavoritesProvider>
                                <NavMenuProvider items={headerNavItems}>
                                    {children}
                                </NavMenuProvider>
                            </FavoritesProvider>
                        </CartProvider>
                    </AuthProvider>
                </SiteSettingsProvider>
            </body>
        </html>
    );
}