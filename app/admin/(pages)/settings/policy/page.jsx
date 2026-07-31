'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Phone, 
  RefreshCw, 
  FileText, 
  Check, 
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Button from '../../../../_components/Admin/Button';

const DEFAULT_POLICIES = {
  privacyPolicy: '',
  shippingPolicy: '',
  contactInfoPolicy: '',
  refundPolicy: '',
  termsOfService: '',
};

const POLICY_ITEMS = [
  { id: 'privacyPolicy', title: 'Privacy Policy', icon: ShieldCheck, description: 'Explain how you collect, use, and share customer data.' },
  { id: 'shippingPolicy', title: 'Shipping Policy', icon: Truck, description: 'Set expectations for delivery times, methods, and costs.' },
  { id: 'contactInfoPolicy', title: 'Contact Information', icon: Phone, description: 'Provide ways for customers to reach you (phone and email will automatically display here on the storefront).' },
  { id: 'refundPolicy', title: 'Refund Policy', icon: RefreshCw, description: 'Outline rules for returns, refunds, and exchanges.' },
  { id: 'termsOfService', title: 'Terms of Service', icon: FileText, description: 'Establish the rules and guidelines for using your store.' },
];

export default function PolicySettingsPage() {
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings/general', { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.settings?.policies) {
          setPolicies({ ...DEFAULT_POLICIES, ...data.settings.policies });
        }
      } catch (err) {
        console.error('Error loading policy settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/settings/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ policies }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } else {
        alert('Failed to save: ' + data.error);
        setSaveStatus('idle');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
      setSaveStatus('idle');
    }
  };

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleChange = (id, value) => {
    setPolicies(prev => ({ ...prev, [id]: value }));
  };

  return (
    <main className="p-0 md:p-8 min-h-screen">
      <div className="max-w-[900px] mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Policies</h2>
            <p className="text-body-md text-on-surface-variant mt-1">
              Create and manage your store policies. These will be displayed on your storefront.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || isLoading}
            icon={
              saveStatus === 'saving'
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : saveStatus === 'saved'
                ? <Check className="w-4 h-4" />
                : null
            }
          >
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-on-surface-variant py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading policies…</span>
          </div>
        ) : (
          <div className="space-y-4">
            {POLICY_ITEMS.map((item) => {
              const Icon = item.icon;
              const isOpen = openAccordion === item.id;

              return (
                <div key={item.id} className="bg-white border border-[#E1E3E5] rounded-lg overflow-hidden transition-all shadow-sm hover:shadow-md">
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Icon className="text-primary w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md">{item.title}</h3>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">{item.description}</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4 text-on-surface-variant">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 md:px-6 pb-6 pt-2 border-t border-[#E1E3E5]">
                      <label className="block text-sm font-medium text-on-surface mb-2">
                        {item.title} Content
                      </label>
                      <textarea
                        className="w-full px-4 py-3 text-body-md border border-[#C9CCCF] rounded focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-y min-h-[200px]"
                        placeholder={`Enter your ${item.title.toLowerCase()} here...`}
                        value={policies[item.id] || ''}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                      />
                      {item.id === 'contactInfoPolicy' && (
                        <p className="text-body-sm text-on-surface-variant mt-2 italic bg-primary/5 p-3 rounded border border-primary/10">
                          Note: Your store's phone number and email address from the General Settings will be automatically appended to this contact policy on the storefront.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
