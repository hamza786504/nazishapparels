'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MessageCircle, Star } from 'lucide-react';

const subjects = [
  'Order Assistance',
  'Product Consultation',
  'Bespoke Appointment',
  'Press & Media',
  'General Inquiry',
];

const boutiques = [
  {
    city: 'Lahore Flagship',
    address: 'House No. 596-E, Askari X, Block E Askari X, Lahore, 54000, Pakistan',
    phone: '+92 344 3413824',
    hours: '11:00 AM – 09:30 PM (PKT)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDzm1_aRMBNQQjYzFrjUbquhJGaruDS0N0Zezr459hn8y0q3aG8jmqjv0AbisSz603t_0MkPsCJwIDZ_MV6ye2NpBSFsKtNIoATmSpzyYkqZkfotuRQfftbCfh6FsIRcXZCgUXVgWBP95sjyi85XPwnkKNEnSXxc9FvHNXGTvWjgPA5xC-D3zPLOCZLjGZIzyxgkM_fAtUt5-ix7rA37s6wruMX1uO5Le_FeGzpSkqw1pj4laM2RWhZIsSKfY8BdaqKz_OHgOGbiuQs',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Assistance',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setIsSubmitting(false);
      setSubmitStatus('success');
      setTimeout(() => {
        setSubmitStatus(null);
        setFormData({ name: '', email: '', subject: 'Order Assistance', message: '' });
      }, 3000);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  // Scroll reveal
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      el.classList.add(
        'transition-all',
        'duration-1000',
        'ease-out',
        'opacity-0',
        'translate-y-8'
      );
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white text-on-surface font-body-md w-full overflow-x-hidden">
      <style jsx global>{`
        .hero-gradient {
          background: linear-gradient(
            180deg,
            rgba(252, 249, 248, 0) 0%,
            rgba(252, 249, 248, 1) 100%
          );
        }
        .transition-soft {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <main>
        {/* Hero Section */}
        <header className="relative min-bg-white text-on-surface font-body-md-[60vh] md:min-h-[70vh] flex items-center justify-center">
          <Image
            alt="NazishApparels Concierge"
            className="object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfIKML1OXLUbGAoT3U5zg0Z2JDj4quhg7kkAXcTd9n4F1X_zFhKgcMn1dZhW6didVodIIOHeCTpww7l3SYgaOiuaTiq2sfxjolVidc2IalqujahETGX6nFrP1-xssgtfmSS2DbBXdJ1kJR59hRyqu024QRoUMPXxv4zeSCNBX_VbeO6BHfQgafFSwcr-oRZO12ThyrkTx8pqvB3Ri66y_YzzrB6cM30ujmTOTz9jL144ppr7Cq8aau3WFZrtYcafjYfq8ZkLldA3bK"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 text-center w-full ">
            <span className="font-label-md text-sm text-white uppercase tracking-[0.25em] block mb-6 drop-shadow-sm">
              Connect With Our Brand
            </span>
            <h1 className="font-display-lg font-bold text-3xl md:text-6xl text-white leading-[1.1] mb-8 drop-shadow-sm">
              Contact
            </h1>
            <p className="font-body-lg text-white text-sm max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Discover the distinguished service synonymous with NazishApparels. From personalized
              style consultations to dedicated order support, our concierge team is at your disposal.
            </p>
          </div>
        </header>

        {/* Contact Form + Details */}
        <section className="px-3 md:px-6 py-10 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-reveal">
            {/* Form */}
            <div className="lg:col-span-7 bg-white p-5 md:p-8 border border-secondary/10 shadow-sm">
              <h2 className="font-headline-md text-xl md:text-3xl text-black mb-6 font-bold">
                Contact Us
              </h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="font-label-md text-sm text-secondary mb-2 block" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 text-base placeholder:text-on-surface-variant/40 focus:outline-none focus:border-b-secondary transition-soft"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ms. Elena Varma"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <label className="font-label-md text-sm text-secondary mb-2 block" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 text-base placeholder:text-on-surface-variant/40 focus:outline-none focus:border-b-secondary transition-soft"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="relative group">
                  <label className="font-label-md text-sm text-secondary mb-2 block" htmlFor="subject">
                    Inquiry Type
                  </label>
                  <select
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 text-base text-on-surface-variant/70 focus:outline-none focus:border-b-secondary transition-soft"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative group">
                  <label className="font-label-md text-sm text-secondary mb-2 block" htmlFor="message">
                    Your Inquiry
                  </label>
                  <textarea
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 text-base placeholder:text-on-surface-variant/40 resize-none focus:outline-none focus:border-b-secondary transition-soft"
                    id="message"
                    name="message"
                    placeholder="Please share the details of your request."
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="pt-0">
                  <button
                    className="group relative overflow-hidden bg-black text-white px-12 py-3 font-label-md text-sm uppercase tracking-[0.2em] hover:scale-[1.02] transition-soft border border-secondary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <span className="relative z-10">
                      {isSubmitting
                        ? 'Submitting...'
                        : submitStatus === 'success'
                          ? 'Thank You for Your Inquiry'
                          : 'Contact'}
                    </span>
                    <div className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            </div>

            {/* Client Services + Map */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-secondary-container/10 p-5 md:p-10 border border-secondary/10">
                <h3 className="font-headline-sm text-xl md:text-2xl text-black mb-8">
                  Client Services
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <Phone className="text-black w-6 h-6 md:w-8 md:h-8" />
                    <div>
                      <p className="font-label-md text-sm md:text-base text-black">Telephone Inquiries</p>
                      <p className="text-on-surface-variant text-sm md:text-base mt-1">+92 344 3413824</p>
                      <p className="text-xs text-on-surface-variant/60 mt-1">
                        Daily, 11:00 AM – 9:30 PM (PKT)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <Mail className="text-black w-6 h-6 md:w-8 md:h-8" />
                    <div>
                      <p className="font-label-md text-sm md:text-base text-black">Email Correspondence</p>
                      <p className="text-on-surface-variant text-sm md:text-base mt-1">
                        nazishapparels@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <MessageCircle className="text-black w-6 h-6 md:w-8 md:h-8" />
                    <div>
                      <p className="font-label-md text-sm md:text-base text-black">WhatsApp Concierge</p>
                      <p className="text-on-surface-variant text-sm md:text-base mt-1">
                        Instant assistance available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            
            </div>
          </div>
        </section>

        {/* Our Ateliers */}
        <section className="bg-white pt-0 pb-10">
          <div className="px-2 md:px-6 max-w-[1440px] mx-auto">
            <div className="text-start mb-8 scroll-reveal">
              <h2 className="font-display-lg text-xl md:text-2xl text-black font-bold mb-4">
                Our Outlets
              </h2>
              <div className="h-px w-24 bg-black" />
            </div>
            <div className="flex justify-start">
              {boutiques.map((boutique, index) => (
                <div
                  key={boutique.city}
                  className="max-w-[400px] w-full group bg-white pt-2 ps-2 pe-2 pb-5 md:p-8 border border-secondary/5 hover:border-secondary/30 transition-soft scroll-reveal shadow-sm hover:shadow-lg text-center"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-56 mb-8 overflow-hidden rounded-md">
                    <Image
                      className="object-cover group-hover:scale-110 transition-soft duration-500"
                      alt={`${boutique.city} boutique storefront`}
                      src={boutique.image}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  <div className="px-3">
                    <h4 className="font-headline-sm text-2xl text-black mb-6">
                      {boutique.city}
                    </h4>
                    <div className="space-y-2 text-on-surface-variant text-sm md:text-base leading-relaxed">
                      {boutique.address}
                    </div>
                    <p className="font-semibold text-black mt-4 text-lg">
                      Tel: {boutique.phone}
                    </p>
                    <div className="pt-6 mt-6 border-t border-outline-variant/30">
                      <p className="text-xs uppercase tracking-widest text-secondary mb-1">
                        Operating Hours
                      </p>
                      <p className="text-on-surface-variant">{boutique.hours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bespoke CTA */}
        <section className="py-0 px-2 md:px-6 text-center scroll-reveal">
          <div className="max-w-3xl mx-auto">
            <Star className="text-secondary mx-auto w-12 h-12 mb-8" fill="currentColor" />
            <h3 className="font-display-lg text-2xl md:text-3xl text-black mb-6">
              Private Consultations
            </h3>
            <p className="text-on-surface-variant text-sm md:text-base mb-12 leading-relaxed">
              Envisioning a bespoke ensemble for a momentous occasion? Arrange a private consultation
              with our lead designers at a flagship atelier of your choosing.
            </p>
           
          </div>
        </section>
      </main>
    </div>
  );
}