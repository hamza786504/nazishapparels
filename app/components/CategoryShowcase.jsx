// components/CategoryShowcase.jsx
'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

const products = [
    {
        id: 1,
        title: 'Floral Embroidered Lawn',
        price: 'PKR 18,500',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLsR_Qq718unGxbzbWwzu0ngSb4vYKlU5qYW28xQPUwy2caNWkMyAwIRe2UO4CViOs2WDWUDkeRLy9na51IsV0Mo74Y5yZ_qxqtRBJuzJysKGcTgk5K5BKtAFREKZBMHUYPdujla35vbPTGGQRuOprnfOfR7UDlSAGc9zzqc2ishx0RA99jabrJQLmxoChzwykvSXx-AwMELnUao0OQ_KRJfYw9a55GXnKpnH39O3_MBHinRV93gMv9tcy6u',
    },
    {
        id: 2,
        title: 'Tilla Work Chiffon',
        price: 'PKR 22,900',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLuQ8KyrOqI0WYcseAvAsaDrcYBov9OE2mv8VoEPUFFuma0zwHK8a_sCCyHEXCZDiwtdOEe3JgegOXOm3dkLRJAEhHIEVW1VNewCvpUTnNBWZb_iOC_VNwDIjmAXESV8VrLs1SCdADKMSv505PXc2cksUOSK0yuUknybb2xMsAW0H5qKpfwikGpTsNv5QCQ9IpgiZVwNms4j785eMUdH2Yt9-H1RKiz9VuN3YIFqJ0NHonN8ZpWHfxqhfJBC',
    },
    {
        id: 3,
        title: 'Luxury Embroidered 3pc',
        price: 'PKR 26,500',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLv1WgGOfm_kIRD-4kSfDtNio10pYctglt_Az42GQVOqb5TipMYq5V8c39Z_Egt4ybWt2gf1ED5OO8gl8bgnpZkUM8HfMLQr9V25sT6rsXXwpvYKV4oe2cO0boEexA8Ec57eqIzM52GXcjlqSWoxIcjzdfz-MinHH9SkfySanU6i9Xb09ZgksHSNkFDOVTNP_u4YOnncJ7xt2vI07qfy9M8g60-xvAT8ao-5HYXXdVJOMAcOIAlSumI_rl8C',
    },
    {
        id: 4,
        title: 'Sequin Chiffon Dupatta',
        price: 'PKR 12,800',
        image:
            'https://lh3.googleusercontent.com/aida/AP1WRLtgLWNS3vbmvau9VUOYCdMXh0YxmXIqio03aA274LwseiYiSGZZncGd9KZc1IGSGwKFNBxelS1fuxaXNi0x0_HEYLSYLss4FGfuFo3g648Dp2bX_RaAs7rnXh0Hc4-Odb-mpF2PV_Z40fDJp1rnxEaYW4jX9lbO-0GqmRRWCsLpQLuK-oHdjCeMFgj7W_GSODLhywZf9OC-_vRZuZrClJU0JLKUw7HhKJKc3Y2TuGEUINkib0GZCb2jyo-P',
    },
];

const tabs = ['Lawn', 'Chiffon', '3pc', 'Accessories'];

export default function CategoryShowcase() {
    const [activeTab, setActiveTab] = useState('Lawn');

    return (
        <section className="py-stack-lg bg-surface-bright">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                <div className="text-center mb-16">
                    <h2 className="text-display-lg-mobile md:text-headline-md font-headline-md text-primary mb-4">
                        Our Collections
                    </h2>
                    <p className="text-label-md font-label-md text-secondary tracking-widest uppercase">
                        Timeless Elegance in Every Thread
                    </p>
                </div>

                {/* Collection Tabs */}
                <div className="flex flex-wrap justify-center gap-8 mb-12 border-b border-secondary/20 pb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`text-label-md font-label-md transition-all ${
                                activeTab === tab
                                    ? 'text-primary border-b-2 border-secondary pb-2'
                                    : 'text-on-surface-variant hover:text-secondary'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 gap-y-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            title={product.title}
                            price={product.price}
                            image={product.image}
                        />
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <button className="border border-primary text-primary px-12 py-4 font-label-md uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300">
                        SEE MORE
                    </button>
                </div>
            </div>
        </section>
    );
}