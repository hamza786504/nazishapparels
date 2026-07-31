import { notFound } from 'next/navigation';
import client from '@/lib/sanityClient';
import { Mail, Phone } from 'lucide-react';
import ScrollAnimations from '@/app/_components/ScrollAnimations';
import CategorySidebar from '@/app/_components/CategorySidebar';

const POLICY_MAP = {
  privacy: { title: 'Privacy Policy', field: 'privacyPolicy' },
  shipping: { title: 'Shipping Policy', field: 'shippingPolicy' },
  contact: { title: 'Contact Information', field: 'contactInfoPolicy' },
  refund: { title: 'Refund Policy', field: 'refundPolicy' },
  terms: { title: 'Terms of Service', field: 'termsOfService' },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const policy = POLICY_MAP[slug];
  if (!policy) return { title: 'Policy Not Found' };
  return { title: policy.title };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const policyMeta = POLICY_MAP[slug];
  if (!policyMeta) notFound();

  const settings = await client.fetch(`*[_type == "siteSettings"][0]{
    policies,
    accountEmail,
    senderEmail,
    phoneNumber
  }`);

  const content = settings?.policies?.[policyMeta.field] || `No ${policyMeta.title.toLowerCase()} has been set yet.`;

  return (
    <main className="h-full overflow-hidden">
      <ScrollAnimations />

      {/* Flex container that takes full height */}
      <div className="flex h-full">
        {/* Sidebar - scrollable */}
        <aside className="hidden lg:block w-60 flex-shrink-0 border-r border-secondary/10 overflow-y-auto h-full">
          <CategorySidebar />
        </aside>

        <div className="px-2 py-3 md:p-10 overflow-y-auto min-h-[60vh]">
          <h1 className="text-3xl md:text-5xl font-headline-lg mb-10 text-center">{policyMeta.title}</h1>

          <div className="prose prose-on-surface max-w-none whitespace-pre-wrap font-body-md text-on-surface">
            {content}
          </div>

          {slug === 'contact' && (
            <div className="mt-12 bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant max-w-2xl mx-auto">
              <h2 className="text-2xl font-headline-md mb-6">Store Contact Information</h2>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                {(settings?.accountEmail || settings?.senderEmail) && (
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-on-surface-variant font-medium mb-1">Email Support</p>
                      <a href={`mailto:${settings.accountEmail || settings.senderEmail}`} className="text-primary hover:underline font-semibold text-lg">
                        {settings.accountEmail || settings.senderEmail}
                      </a>
                    </div>
                  </div>
                )}
                {settings?.phoneNumber && (
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full text-primary shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-on-surface-variant font-medium mb-1">Phone Support</p>
                      <a href={`tel:${settings.phoneNumber}`} className="text-primary hover:underline font-semibold text-lg">
                        {settings.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
