// components/FeaturedProducts.jsx
import ProductCard from './ProductCard';

const products = [
    {
        id: 1,
        title: 'Serene Pearl Silk Suit',
        price: 'PKR 24,500',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBYsZAwrIwJz_MQlReSqxcGYaX9eYmILHnJ5_pJUw2av-v2S0e2sYQsWMi571Mm-pOn9WCLGQjBUfwaDPBcOG-dGY8OAkmU8EZp_VV_wRjovU9V7z6O3RqKdm4O0-QymRMSu8l4gyeg1Fpn0RwCi9IFCgenAGnQ-DvXUSNXR6xfPM6XsOWEAVjKgBBG5vPdE-MNpqb90wLGXm7JXjMGeWgj0LjaBzyM0NUj9aqofVJC3F7Wbw5TqnzZh6_PDYGKBGT-S0GOMFGv1iHU',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAobUkMhm1wzf3JUlQ-y42pg9M03w6cfTgFvsQ5NIM1f7RvnFtdu8Qjcq3b2NfOMca8P9DYX4Uh6O5PwPNkcI9YqJlWsdJHlmTgbeLHlhKse6sd7AT4q5vilwYIiJWkYH8rETscTJjACP7ubwWjjGZxr9wJnxnENc5xYhsnMz5YAmTeonNjN2DJ1aiNBmGMwhopRTU7iZnuVjDMMePJSK_dMm_b2Xfues01tGkfOFMKG9cn0PBonkoA92ZprQgA4xA6G2ApKAO0qbMT',
    },
    {
        id: 2,
        title: 'Midnight Charcoal 3pc',
        price: 'PKR 28,900',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDHLy-2BWX6NsR8nYBNQa9h_jMmGrDF_OM31IFC5jQSgc2t5cbqTxyGqNrZtz8KO0YTM9n0FhT4Wc_7RvIH2c2vbHrhYAA_uR-utp6PVvO0d4butqh7we5WrPzHD4j1-GSOHKKSwkLNyRmI_2aCUEce2WRwaQ0A9W_ERHKmRQO4f8Waj2yBHLCHP5GIWpkbJ9mTJMGIm3VDgpK0D2etr419aXB16An3OykjaZz_PhBdxHdoec117sy68SRbYMVtq_Lav7ZMxLGa7_Qu',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuD3pskjI9npGiYWOZddcDC0DzTw_L26w4z1SgI4WRSf2ayg7wk7W-2Y3Rz3o_TsIqaX2SC4bUNL9bB_ECYRMT727-Om8q-IezcLnxYPRoPxfPe3lfzsOKbCy6hscWE1zaD87ffsKt4hL277EVwqVRdL_ImkWjJswReg1Rx6gBGh3LgveUOZNlk-tG-G1O0lRkqeJdRlOf2WiHTAGTXVLB1S51pe2sS1hFnRCo7NaeOmCx38jusVwd6hc5AIPpWRU9q_Pzc9iZVPY1ay',
    },
    {
        id: 3,
        title: 'Golden Rust Chiffon',
        price: 'PKR 22,000',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDkYwiqfvEfxZZktDgxW6EYDKG4Jmn2R_MjXZX_zi3bmYOeb6FNH3efAH__1NXvNvq4jt4WJZGQ1uJ7kP4uChN2RzG-JC4XJ3JX8wic-QJgOJlJkaKX1YjiSlvpRbtuhFkZ8-RjTPcnQnBqC8tHzGxK2dKWOIIbD6OUS8eQbWBg-J4wMFfRTyJN-mnL_60RNxJlXod6gMmD0uK5zpPvGimTo1IPdH1uqzEWY9dAr-NAjvm_PMJOf5nUTVtGQ2je1rA2lkiUthYgjftQ',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCRebo7i5sg0evKTpVFMU9QhPsMtes1mJuG-0H3-YZOhLzRxGkVxaBSuO80R-FyRBVYLqBh1xS6qzQwSLbQR8vn6bVQW8s_FRoeyhEYVG-upmDC07DkwQCi6dWJo7XWN9DfpgWhBd3bVDFmVFH4MbM-Y2cKGDf0WdEqx-fmqqzb5039HklWBDQPVwA_L50g3r3eoO0GR0frzvNrhVhRIDaGwi7LpVaNuMpM82xFtX5bA2oyRKoH6zx-ZImpK2ne3oUkABAAdRHwVj45',
    },
    {
        id: 4,
        title: 'Emerald Silk Organza',
        price: 'PKR 18,500',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBF0uGhBqFeiTpot2ewCnoSmQbYCMJCwqsJQxuDYkdu86KQBGstYFXuh3nUBKpe5NK7X_Soi60pirdc1ucUnsZMOFICCM92sWAI3C6hva160neSqlcXeoXXK0X-IhrfJ7YzbA3dkUr3GLsQn2Oa5a2qv07j5cvjLoTSvJiwifBhVnOr4pGpEVU4Shrq5Jq6VkvdV1t9kLE2rQ-i2B-Uk6eynS2d4B1WxE0SRVLN2V8eQ5s1SiA6hTvJWumVrvE22neyQHwMdafWUIcv',
    },
    {
        id: 5,
        title: 'Ivory Whisper Chiffon',
        price: 'PKR 22,900',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAwHhdg66Yq_NMjsR6kN6j8AfUsr_XOMnrg83jzZk6f72hed8JY1f-vLfZQAg6gjt7hT9L9YPeSOJcOIiMd8Kegz2k9TkwgtqPCUsQgUeEF8JkMM3r6ZMMRg_zxDC-_pmgci6s4U-Ycj7ggYcMUbacTTCGJyN9z1_2G2aWxS2JpDglOKM41vEYTramXOIKpkTVhWbvIuegw1kk3V3C9wjCz34fICWnUedCS-K-TMebrNsJXKTWlhh2X1RPt4_lpZ85_h8iofyk8mADG',
    },
    {
        id: 6,
        title: 'Midnight Slate Lawn',
        price: 'PKR 14,500',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCq7uFdoJG2NPDDZ1W_wAIQzAvdMC-iUt0gKhypef8UPIDSI8nwLgAixDrthJn_CtwtNhmFs65_w3cKx-B7P3FFZ72UjzOocFWhRIgLe3kDEkBTrJBvr923MfOsXlpWRzBewDFU3u-YFnkce0TADI7Xb_bd7wzf0H0gBqxNcs_2AzekAvFWt3kkVdTC4JztBvZJaNsQ9x5J40TZr1Oxq6HaRFwA50JP3zHIeZ7hNtsCMB1cpcOH7F4XvURv7sBbU-lS5JnITbu87j5w',
    },
    {
        id: 7,
        title: 'Terracotta Heritage Print',
        price: 'PKR 16,800',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB6MfXvsUosY1YenDmH9IzzXQPOBhoUXEaORvnbuDTjrMQQbWTuoHkGK7WvwVE4qjdiy8FL2CGtpyDH2OA7UcKhjMOpRO96ZJtiRRiI7JybO1KnM-fLkfhQgrkFpWFNYEwOrFngxWWuZfEdZe49tV0cZ8A8MZQRMGyEDTboLf-ZFaFlq4j_V9iv_DgFQqjPxArG9sWoVm3LivPVTdJ-OX6nlWxTQx_8ZJ8Z7J_vr124KGqbQzsLvw9LZyg8mLJzRmt6K19C-3ZPv9-2',
    },
    {
        id: 8,
        title: 'Blush Silver Glow',
        price: 'PKR 21,000',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDB5_nbeSUuvzHimPlmt_cFINZO84DWow_zEg7MJm_BQQbTjjhy7F03EhL-7bgSuwtjSfSSHsDxZEHRFb-Xaotz6gxraZtv0D4M9Q1F4MvDi2IbE1V-hZxQqbdA7JRa0yWCYwseh3Nfp7kFBh15ZQcEHjwmK6rHSKnDBPHYErlBzTUaVMno9cPvZfsCNtBW0K1LlglV2797B7u8cmb7nEScTag_M8BuWtRSmxM7DVfuqT7V2Plwk2_h5b5vCr7EMfbl-k66ai8j8LYR',
    },
];

export default function FeaturedProducts() {
    return (
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h2 className="text-headline-md font-headline-md">Curated Favorites</h2>
                    <p className="text-label-md font-label-md text-on-surface-variant tracking-widest uppercase mt-2">
                        Season&apos;s Most Desired
                    </p>
                </div>
                <a
                    className="hidden md:block text-label-md font-label-md text-secondary hover:underline underline-offset-8"
                    href="#"
                >
                    VIEW ALL PRODUCTS
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
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
                    SHOW MORE
                </button>
            </div>
        </section>
    );
}