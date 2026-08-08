import { getSiteSettings } from '@/lib/getSiteSettings';
import { buildThemeCss, buildGoogleFontsHref } from '@/lib/theme';
import { SiteSettingsProvider } from '../store/siteSettingsContext';

// Layout for the (auth) route group.
//
// Only login and register live here now, and they intentionally render WITHOUT
// the site Navbar or the account Sidebar (they are standalone auth screens).
// Customer account pages were moved to the (account) group, which provides the
// Navbar + reusable Sidebar chrome via its own layout. This server layout injects
// the admin's saved theme + fonts so the standalone auth screens match the store.
export const revalidate = 300;

export default async function AuthLayout({ children }) {
    const settings = await getSiteSettings();
    const themeCss = buildThemeCss(settings.theme, settings.typography);
    const fontHref = buildGoogleFontsHref(settings.typography);

    return (
        <SiteSettingsProvider settings={settings}>
            {themeCss && (
                <style
                    id="storefront-theme"
                    dangerouslySetInnerHTML={{ __html: themeCss }}
                />
            )}
            {fontHref && (
                <link rel="stylesheet" href={fontHref} precedence="theme-fonts" />
            )}
            {children}
        </SiteSettingsProvider>
    );
}
