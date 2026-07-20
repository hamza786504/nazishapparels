'use client'
// components/Testimonials.jsx
const testimonials = [
    {
        id: 1,
        quote:
            'The craftsmanship of the tilla work is unparalleled. It\'s not just a suit; it\'s a piece of art.',
        name: 'Amina R.',
        location: 'London, UK',
    },
    {
        id: 2,
        quote:
            'NazishApparels captures the essence of heritage with such modern grace. The fabric quality is exceptional.',
        name: 'Zahra K.',
        location: 'Dubai, UAE',
    },
    {
        id: 3,
        quote:
            'The attention to detail in the embroidery is breathtaking. Truly a luxury experience from order to delivery.',
        name: 'Mariam S.',
        location: 'Lahore, PK',
    },
];

export default function Testimonials() {
    return (
        <section className="py-stack-lg bg-surface">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                <div className="text-center mb-16">
                    <h2 className="text-xl md:text-2xl text-display-lg-mobile md:text-headline-md font-headline-md text-primary mb-4">
                        Voices of Elegance
                    </h2>
                    <p className="text-label-md font-label-md text-secondary tracking-widest uppercase">
                        Client Reflections
                    </p>
                </div>

                <div className="relative group">
                    <div id="testimonials-carousel" className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 scroll-smooth touch-pan-x carousel-container">
                        {testimonials.map((t) => (
                            <div
                                key={t.id}
                                className="flex-none w-[85%] md:w-[350px] lg:w-[400px] snap-center bg-surface-container-low p-10 flex flex-col items-center text-center space-y-6 border border-secondary/10 select-none"
                            >
                                <div className="flex text-secondary">
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="material-symbols-outlined">star</span>
                                    <span className="material-symbols-outlined">star</span>
                                </div>
                                <p className="text-body-lg font-headline-sm italic text-on-surface-variant leading-relaxed flex-grow">
                                    &quot;{t.quote}&quot;
                                </p>
                                <div className="pt-4 mt-auto">
                                    <p className="text-label-md font-label-md text-primary uppercase tracking-widest">
                                        {t.name}
                                    </p>
                                    <p className="text-label-sm font-label-sm text-on-tertiary-container mt-1">
                                        {t.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Navigation Arrows (Desktop) */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
                        <button
                            className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white shadow-md text-primary hover:bg-secondary hover:text-white transition-all rounded-full"
                            onClick={() => {
                                const el = document.getElementById('testimonials-carousel');
                                if (el) el.scrollBy({ left: -374, behavior: 'smooth' });
                            }}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button
                            className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-white shadow-md text-primary hover:bg-secondary hover:text-white transition-all rounded-full"
                            onClick={() => {
                                const el = document.getElementById('testimonials-carousel');
                                if (el) el.scrollBy({ left: 374, behavior: 'smooth' });
                            }}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}