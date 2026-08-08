'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Cache-busting: bump these when the banner files change so browsers and the
// Next.js image optimizer never serve a stale image.
const slides = [
  {
    id: 0,
    image: '/banner.png?v=2',
    href: '/collection/new-arrivals',
  },
  {
    id: 1,
    image: '/banner-2.png?v=2',
    href: '/collection/new-arrivals',
  },
];

const SWIPE_THRESHOLD = 48;

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchDragging = useRef(false);

  const isCarousel = slides.length > 1;

  const goToSlide = useCallback((index) => {
    setCurrentSlide(((index % slides.length) + slides.length) % slides.length);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Autoplay timer, reset whenever the slide changes (manual swipe or auto).
  useEffect(() => {
    if (!isCarousel) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide, isCarousel]);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchDragging.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!touchDragging.current || touchStartX.current === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    touchDragging.current = false;

    // Only treat as a swipe when the horizontal movement clearly dominates,
    // so vertical page-scrolling isn't hijacked.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) nextSlide();
    else prevSlide();
  };

  return (
    <div className="md:p-4 pb-0">
      <div
        id="controls-carousel md:rounded-2xl overflow-hidden"
        style={{ position: 'relative', width: '100%' }}
        data-carousel="static"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Carousel wrapper – aspect-ratio handles height */}
        <div
          className="hero-banner md:rounded-2xl overflow-hidden"
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {slides.map((slide, index) => (
            <Link
              key={slide.id}
              href={slide.href}
              aria-label="Shop New Arrivals"
              style={{
                position: 'absolute',
                inset: 0,
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: index === currentSlide ? 1 : 0,
                pointerEvents: index === currentSlide ? 'auto' : 'none',
                display: 'block',
              }}
              aria-hidden={index !== currentSlide}
              tabIndex={index === currentSlide ? 0 : -1}
            >
              <Image
                src={slide.image}
                alt={slide.title || 'Hero Banner'}
                fill
                priority
                sizes="100vw"
                style={{
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Text content */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  maxWidth: '900px',
                  margin: '0 auto',
                  padding: '0 2rem',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                    display: 'block',
                  }}
                >
                  {slide.tag}
                </span>
                <h2
                  style={{
                    color: '#ffffff',
                    fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
                    fontWeight: 700,
                    lineHeight: 1.15,
                    marginBottom: '1rem',
                    fontFamily: 'var(--font-eb-garamond), serif',
                  }}
                >
                  {slide.title}
                </h2>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.88)',
                    fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
                    maxWidth: '32rem',
                    lineHeight: 1.6,
                  }}
                >
                  {slide.description}
                </p>
              </div>
            </Link>
          ))}

          {/* Slide indicators */}
          {isCarousel && (
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.625rem',
                zIndex: 20,
              }}
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-current={index === currentSlide ? 'true' : 'false'}
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  style={{
                    width: index === currentSlide ? '1.75rem' : '0.625rem',
                    height: '0.625rem',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      index === currentSlide
                        ? '#ffffff'
                        : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Previous button */}
        {isCarousel && (
          <button
          className='px-0'
            type="button"
            aria-label="Previous slide"
            onClick={prevSlide}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 20,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <ChevronButton dir="left" />
          </button>
        )}

        {/* Next button */}
        {isCarousel && (
          <button
            type="button"
            className='px-0'
            aria-label="Next slide"
            onClick={nextSlide}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 20,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <ChevronButton dir="right" />
          </button>
        )}

        {/* Responsive aspect ratios */}
        <style jsx>{`
        .hero-banner {
          /* Matches the banner images' natural ~2:1 ratio so the whole
             image fits within the viewable area without cropping. */
          aspect-ratio: 2 / 1;
          background: #f6f4ef;
        }
      `}</style>
      </div>
    </div>
  );
}

function ChevronButton({ dir }) {
  return (
    <span
      className="w-10 h-10 flex items-center justify-center bg-black/25 text-white backdrop-blur-sm transition-transform hover:bg-black/40"
      style={{ pointerEvents: 'none' }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === 'left' ? (
          <path d="m15 18-6-6 6-6" />
        ) : (
          <path d="m9 18 6-6-6-6" />
        )}
      </svg>
    </span>
  );
}
