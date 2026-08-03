import '../globals.css';
import { getSiteSettings } from '@/lib/getSiteSettings';
import { SiteSettingsProvider } from '../store/siteSettingsContext';
import { buildThemeCss, buildGoogleFontsHref } from '@/lib/theme';
import LayoutWrapper from '../_components/LayoutWrapper';
import RecentPurchasePopup from '../_components/RecentPurchasePopup';
import ScrollAnimations from '../_components/ScrollAnimations';
import CategorySidebar from '../_components/CategorySidebar';
import WhatsAppFloatingButton from '../_components/WhatsAppFloatingButton';

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
            <div className="flex flex-col overflow-hidden h-screen storefront-theme bg-white text-on-surface">
                <LayoutWrapper>
                    <RecentPurchasePopup />
                    <main className="h-full flex flex-col overflow-hidden">
                        <ScrollAnimations />

                        {/* Flex container that takes full height */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Sidebar - scrollable */}
                            <aside className="hidden lg:block w-60 flex-shrink-0 border-r border-secondary/10 overflow-y-auto h-full">
                                <CategorySidebar />
                            </aside>
                            {children}
                            <WhatsAppFloatingButton />
                        </div>
                    </main>
                </LayoutWrapper>
            </div>
        </SiteSettingsProvider>
    );
}