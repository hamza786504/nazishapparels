'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  const [revealedElements, setRevealedElements] = useState(new Set());
  const revealRefs = useRef([]);
  const [navShadow, setNavShadow] = useState(false);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setRevealedElements((prev) =>
            new Set([...prev, entry.target.dataset.revealId])
          );
        }
      });
    }, observerOptions);

    const refs = revealRefs.current;
    refs.forEach((el) => el && observer.observe(el));

    return () => refs.forEach((el) => el && observer.unobserve(el));
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavShadow(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRevealed = (id) => revealedElements.has(id);

  const milestones = [
    {
      year: '1994',
      title: 'The Founding Atelier',
      description:
        'Established as an exclusive bridal atelier in Lahore, dedicated to crafting hand‑embroidered trousseaus for a discerning, invitation‑only clientele.',
    },
    {
      year: '2008',
      title: 'Prêt‑à‑Porter Debut',
      description:
        'Introduced our first ready‑to‑wear collection, artfully merging heritage craftsmanship with the dynamic rhythm of the modern Pakistani woman.',
    },
    {
      year: '2024',
      title: 'A Global Legacy',
      description:
        'Today, NazishApparels stands as an international emblem of luxury, delivering to over twenty countries while upholding the philosophy of ‘Heritage in every thread’.',
    },
  ];

  const artisans = [
    {
      name: 'Master Ashraf',
      role: 'Head of Tailoring, 22 Years',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmxahtebSjWKWjAcjSEW4mbLzGPUpl7OqZkAsUuKso5s-1QspQWiHYuVnpVrMMg4W1tKXKonConALrzpdzpNj9t8T3xhcR0-nvpb9Gh-aomyqtIVHZa1xZKUiRqoMrtfeLbUW3d3SY7UpZKvZkd4v0skuf2D62b2WiW28xuQ7VNS2AUwWfNSrwAiQWTx74D6MgkxeOWQ195NJrrukwXAPe7ymGQ8IVo1iBfRl3bmIme_ciTxFTzXyzjjakvuPIQBYWSAw6mSDXHyjH',
    },
    {
      name: 'Sarah Khan',
      role: 'Creative Design Lead',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBea3GXCb2E0S_7Xu4UO8IsHuFLMGyGef4rcjULfCyQ9jMiavd3mNrJh9WYawlFwksnwqHyVHkxLtLf0MxgsCoNr7tQ0fQl2ymCb__q-B1euj5_XxeEvZutjJrupq55kYWmt8UlbOhoTvlC8Gs7UfTQk6RSgoeKojoZnOZXt26aEQ71XN73tZRU-mMYotv60OcS44AoFfT0N48RHF2Q_PatsiwsWB8uYABB-1Xf7mijYZyoZlH6XCYS0x2Sz5kM_vcZ0S1-K2qJD54X',
    },
    {
      name: 'Bee Gul',
      role: 'Master of Hand‑Embroidery',
      image:
        'https://lh3.googleusercontent.com/aida/AP1WRLvtnZr6nIx1_yM4HAGsIDVg-kdLkZfO8rxfH9i4FI_zjqvOJUhRCGxmbb_oE2zW3lSccmRk56CEw6RVj4SE6zFvAiCfL3ZlLQDieHCOCgyKyu14rGmxkhmBHVnc5r2cpgD42Ajg21pnZgJV99Tc54XlnTpUlR8wOyfrEb_6sUillmLld63WSHK-sYqxNmUO6ukr1IOFOjEULxVwrzZzV7UgkWTe1uVRPxzhAumQU8I0UgA9oN6drkSUYwJy',
    },
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md overflow-x-hidden">
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .reveal-animation {
          opacity: 0;
          transform: translateY(24px);
          transition: all 0.7s cubic-bezier(0.2, 0.9, 0.3, 1);
        }
        .reveal-animation.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .editorial-line {
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(119, 90, 25, 0.25),
            transparent
          );
        }
      `}</style>

      {/* Hero */}
      <header className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            alt="NazishApparels Heritage"
            className="object-cover"
            src="/about.JPG"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-16 w-full">
          <div className="max-w-2xl">
            <span className="font-label-md text-white text-sm md:text-base text-secondary uppercase tracking-[0.25em] block mb-6">
              Established 1994
            </span>
            <h1 className="font-display-lg text-5xl md:text-7xl lg:text-8xl text-primary leading-[1.1] mb-8">
              The Art of <br />
              <span className="italic text-secondary-fixed">Timeless Heritage</span>
            </h1>
            <p className="font-body-lg text-white text-lg md:text-xl text-on-surface-variant leading-relaxed">
              NazishApparels transcends the boundaries of a fashion house; it is a guardian of
              centuries‑old Eastern traditions, seamlessly woven into the silhouette of the
              contemporary woman.
            </p>
          </div>
        </div>
      </header>

      {/* Our Heritage */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="editorial-line mb-16" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4 self-center">
              <h2 className="font-headline-md text-3xl md:text-4xl text-primary mb-6">
                Our Heritage
              </h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed text-base md:text-lg">
                Our narrative originates deep within artisanal ateliers, where the cadence of the loom
                and the precision of the needle echo generations of mastery. Each fabric we select and
                every stitch we place pays tribute to the virtuosos of Eastern craftsmanship.
              </p>
              <div className="flex items-center gap-3 text-secondary font-label-md">
                <span className="material-symbols-outlined">auto_awesome</span>
                <span className="uppercase tracking-widest text-sm">Pure Fabrics & Hand‑Work</span>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-2 gap-4 md:gap-6">
              <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden mt-12 md:mt-0 shadow-sm">
                <Image
                  alt="Luxury Eastern suit detail"
                  className="object-cover"
                  src="https://lh3.googleusercontent.com/aida/AP1WRLvgDjwCVEdNUtgZy0gaw26nnP9z6-XUSdHHGRd4LKJzYMq-7iJNEMPa5rVTN-lVx1c0H6nn2Ms1TQQuAo35oMzQ77NINcSqNndldmHDz_ejlwrT9FBGC98RbxqKh2bDCGU8h1sqHHz6wuKvJCJiVoP5-RJ2IzwhdgJXNkNijxJ2zn5qiIdN7D2prnZYRE6h422Db_Fr-0Nc03wS0VU8X569HGEqUSIn3T8Bp3Vcb59DyZ_EsLu9vdr7OYfT"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
              <div className="relative aspect-[3/4] bg-surface-container overflow-hidden shadow-sm">
                <Image
                  alt="Close-up of artisan craftsmanship"
                  className="object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQElh5LImfqG-IjqxuarhZRFTWxpvmFSxOWs0112PlpUo6Aw6TDpqs1_ZlN33P1idsW3OcKpvkqX_vUsfTZ89RLQ0weJJlGIxhoaHizfxtVhMtaug3qZO1sC3DEYOpkaCiheXX0RdS661EZ57csWyxQGuL_ys_jPrtFO_rJrX0OJBsQq4hca8XpAEh0XfXJsk0WXLSVHzGhc4O3_HTXs6dxlScEEVZvY4U6OJGE45s0yHBx4uDNFDiC37--3xzWVxZaMkeKKZwE97W"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey */}
      <section className="py-24 md:py-32 bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="text-center mb-20">
            <h2 className="font-headline-md text-3xl md:text-4xl text-primary">
              The Journey
            </h2>
            <div className="w-20 h-px bg-secondary mx-auto mt-5" />
          </div>
          <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                ref={(el) => (revealRefs.current[index] = el)}
                data-reveal-id={`milestone-${index}`}
                className={`reveal-animation flex flex-col md:flex-row gap-6 md:gap-10 items-start ${
                  isRevealed(`milestone-${index}`) ? 'revealed' : ''
                }`}
              >
                <div className="font-display-lg text-5xl md:text-6xl text-secondary-fixed-dim shrink-0 leading-none">
                  {milestone.year}
                </div>
                <div className="pt-1">
                  <h3 className="font-headline-sm text-2xl md:text-3xl mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Souls Behind the Silk */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mb-16">
            <h2 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-primary leading-tight">
              The Souls <br />
              Behind the Silk
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg">
              Our excellence is the shared breath of over two hundred artisans, weavers, and
              designers who regard each garment as a canvas of living history.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {artisans.map((artisan, index) => (
              <div
                key={artisan.name}
                className={`group cursor-default ${index === 1 ? 'lg:mt-12' : ''}`}
              >
                <div className="aspect-[3/4] bg-surface-variant overflow-hidden mb-5 relative shadow-sm">
                  <Image
                    alt={`Portrait of ${artisan.name}`}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    src={artisan.image}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h4 className="font-label-md text-lg text-primary tracking-wide">
                  {artisan.name}
                </h4>
                <p className="text-sm text-on-surface-variant mt-1 uppercase tracking-wider">
                  {artisan.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Atelier */}
      <section className="py-24 md:py-32 bg-primary text-on-primary">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 text-center">
          <h2 className="font-display-lg text-4xl md:text-5xl lg:text-6xl mb-8">
            Our Flagship Atelier
          </h2>
          <div className="h-px w-24 bg-secondary mx-auto mb-14" />
          <div className="flex justify-center">
            <div className="max-w-[600px] w-full bg-on-primary/5 p-8 md:p-12 border border-on-primary/10 rounded-sm backdrop-blur-sm">
              <h3 className="font-headline-md text-3xl text-secondary-fixed mb-6">
                Lahore, Pakistan
              </h3>
              <p className="text-on-primary/80 font-label-md tracking-[0.2em] uppercase leading-loose text-sm">
                House No. 596‑E<br />
                Askari X<br />
                Lahore, 54000
              </p>
              <p className="text-on-primary/90 mt-6 leading-relaxed text-base md:text-lg">
                The original residence of NazishApparels, now home to our private bridal lounge and
                heritage archive. An invitation to experience bespoke luxury at its finest.
              </p>
              <div className="pt-8">
                <Link
                  className="inline-block border border-secondary-fixed text-secondary-fixed px-10 py-4 font-label-md uppercase tracking-[0.2em] text-sm hover:bg-secondary-fixed hover:text-primary transition-all duration-300"
                  href="/contact"
                >
                  Request an Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}