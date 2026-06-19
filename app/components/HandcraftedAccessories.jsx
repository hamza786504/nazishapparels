// components/HandcraftedAccessories.jsx
import ProductCard from './ProductCard';

const accessories = [
    {
        id: 1,
        title: 'Zardozi Velvet Clutch',
        price: 'PKR 12,500',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAn1P_jTgkKdPSycO7lQ5flW1FC9nezc0VY-hcl7BnNvMgpAYRZmV1GW3ld_c13pI6j-ZGGayITP6eQXnwaJMCqWhka5FgPiE6hP0T0S9PlwPtSDh40FRsDsyZ9xyv02V25fazT2DThl4Fd4xQ6NvZ-PP7rG-PnRClSsxZRC2gTF-OH-kER_QSgyLio9cyVIFV_VeMGVR9Vc5yog_8bz8HiD0CcYE_thm4uqq1K2BKoBhoZYJX8CijDKg',
    },
    {
        id: 2,
        title: 'Pearl Embellished Potli',
        price: 'PKR 8,900',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAmoqfABlYeWgPkRnIS0F86N417VFTejZ5lf2L6BFY2LN_1onvSipFozD2nYe9OAxwj4jHZxgTngZLPL86cT1IsK3tDKS3shiVrxiF4q9uxvJuTIdlTSksAj3S-m47smJVhJSyreJCJbT9Ct_ZAp1Khyufiw496fXuKAPQ7MEzt8dE4JN2VXP5a68EwuFPdszEJZyBQrrRXeYMeJ7dxfgjAa1IeatOaPUICBcYRY8lq9s84YQIBJSV4tA',
    },
    {
        id: 3,
        title: 'Royal Heritage Pouch',
        price: 'PKR 10,200',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCANxs2JX-GxtOq25ENcHJ47mpcmyuKehS9VuA7lNj8H35ZyJU_niBTgIUxTStdQ2qSdRVX3re7DMup_HzitASshc7zhB5_DkAvQKviNJJ1M0OWlEO3Og9HYvDeW-FZxPuUa0DrMd5ZvbemXi8ta_KD1GdVBfrA939RpWd9ZF6DjO8uMUkMoLgqiA2jnvGxsm6EUO7vgXOmGR0N-8OIVfCZkvmN41au3TDYqaxP7ViBL68AajyxmQnuvw',
    },
    {
        id: 4,
        title: 'Embroidered Silk Clutch',
        price: 'PKR 14,800',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLteJ3n7e1fH8Kk6SMGizfseH7dhfQ3qJ13sY5IfIaGbHcoIcAKTZ0kT1TLNUOwmuhsxdEYIbjVC5S2Biohme_Arte7dYux7IZ-RwCZWsfkdfPQSaZEWzZv_s6DsqDYYCICi17ldqFRSE-tWFYIlvP9KogvbZ65-pxTN1aKgrvoSiWsvG3Tw1bMx4gk__dxhkv8ZMAofbrVAfLuRIX8PH_nf9hocUnGvIloetULQROjal0j5TZWwZZa7WoU',
    },
    {
        id: 5,
        title: 'Traditional Zardozi Clutch',
        price: 'PKR 11,200',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLvXdPx2L7RncyWsOaAFfWk198hKORFU-Me8oUZNhN6gYvjaANMPygPb6pNtf9kRxdn9PELQRVvhChCkJq_WOYkWnfg4oMdffOzzvpFbtqCkaavSeMYdH-txnbOBkYLe8vRmqL82R012LfZ-qfGbUeNGsSCBgsOlKPEyRH2uW8Igxon_2gCcCrgaWC5G7kiRZxQXvknpAWmf2UBy2g2FUKIJbZR1BvfhmPYKkIeS5DJNxpwUlV9vdlaC4S_2',
    },
    {
        id: 6,
        title: 'Gold Tassel Potli',
        price: 'PKR 9,500',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLsmn156TZS9metIZ65BIcSQju0lfRfnZ9E7ZqEuOAOdEQ3hxnj0AB9nTVijnlgpEHDxp2V7atAC4JZijyDpXgaZ5tEZV1mwiSvse9YKCSBebC2qEKKPww85Wk3eYGDO4ijHxZoKHFJPGH68owTYT3yMv2bZixbTrP1k5OjXeh0pSyMFpIje_GM0nFgbJPCiyB0NBuSPy1JQd791NNEPpMQ9Uw-rCVmbmj5JnY9gbLSu4OClROqG77R99X4',
    },
    {
        id: 7,
        title: 'Velvet Heritage Clutch',
        price: 'PKR 13,900',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLteJ3n7e1fH8Kk6SMGizfseH7dhfQ3qJ13sY5IfIaGbHcoIcAKTZ0kT1TLNUOwmuhsxdEYIbjVC5S2Biohme_Arte7dYux7IZ-RwCZWsfkdfPQSaZEWzZv_s6DsqDYYCICi17ldqFRSE-tWFYIlvP9KogvbZ65-pxTN1aKgrvoSiWsvG3Tw1bMx4gk__dxhkv8ZMAofbrVAfLuRIX8PH_nf9hocUnGvIloetULQROjal0j5TZWwZZa7WoU',
    },
    {
        id: 8,
        title: 'Pearl Artisan Pouch',
        price: 'PKR 10,800',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLvXdPx2L7RncyWsOaAFfWk198hKORFU-Me8oUZNhN6gYvjaANMPygPb6pNtf9kRxdn9PELQRVvhChCkJq_WOYkWnfg4oMdffOzzvpFbtqCkaavSeMYdH-txnbOBkYLe8vRmqL82R012LfZ-qfGbUeNGsSCBgsOlKPEyRH2uW8Igxon_2gCcCrgaWC5G7kiRZxQXvknpAWmf2UBy2g2FUKIJbZR1BvfhmPYKkIeS5DJNxpwUlV9vdlaC4S_2',
    },
];

export default function HandcraftedAccessories() {
    return (
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h2 className="text-headline-md font-headline-md">Handcrafted Accessories</h2>
                    <p className="text-label-md font-label-md text-on-surface-variant tracking-widest uppercase mt-2">
                        THE ART OF THE BAG
                    </p>
                </div>
                <a
                    className="hidden md:block text-label-md font-label-md text-secondary hover:underline underline-offset-8"
                    href="#"
                >
                    VIEW COLLECTION
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                {accessories.map((item) => (
                    <ProductCard
                        key={item.id}
                        title={item.title}
                        price={item.price}
                        image={item.image}
                    />
                ))}
            </div>

            <div className="mt-16 flex justify-center">
                <button className="border border-primary text-primary px-12 py-4 font-label-md uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300">
                    SHOW MORE
                </button>
            </div>
        </section>
    );
}