import { getSiteSettings } from '@/lib/getSiteSettings';
import { buildThemeCss, buildGoogleFontsHref } from '@/lib/theme';
import { SiteSettingsProvider } from '../store/siteSettingsContext';
import AccountLayoutClient from './AccountLayoutClient';

/**
 * Layout for the customer (account) area.
 *
 * This is a server component so it can read the admin's saved theme + fonts
 * (same as the public and storefront layouts) and inject the runtime CSS
 * variables + Google Fonts link. Without this the account pages would fall back
 * to the default palette/fonts. The interactive chrome lives in
 * AccountLayoutClient (AuthGuard, Navbar, Sidebar, Footer, mobile drawer).
 */
export const revalidate = 300;

export default async function AccountLayout({ children }) {
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
            <AccountLayoutClient>{children}</AccountLayoutClient>
        </SiteSettingsProvider>
    );
}
