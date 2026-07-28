import '../globals.css';
import { getSiteSettings } from '@/lib/getSiteSettings';
import { SiteSettingsProvider } from '../store/siteSettingsContext';
import { buildThemeCss, buildGoogleFontsHref } from '@/lib/theme';
import LayoutWrapper from '../_components/LayoutWrapper';
import RecentPurchasePopup from '../_components/RecentPurchasePopup';

export const revalidate = 300;

export default async function PublicLayout({ children }) {
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

            {/* Main layout container - full viewport height */}
            <div className="flex flex-col h-screen storefront-theme bg-white text-on-surface">
                <LayoutWrapper>
                    <RecentPurchasePopup />
                    {children}
                </LayoutWrapper>
            </div>
        </SiteSettingsProvider>
    );
}