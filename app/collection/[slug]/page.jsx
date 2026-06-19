'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';

// Mock product data with priceNumeric, fabric type, and sizes for filtering
const mockProducts = [
    {
        id: 1,
        title: 'Emerald Silk Organza',
        price: 'PKR 18,500',
        priceNumeric: 18500,
        type: 'Pure Silk Organza • 3 Piece',
        fabric: 'Organza',
        sizes: ['S', 'M', 'L'],
        badge: 'New',
        primaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGuvIATCRYdiSHr8pz9rI15ZgsYXb0xNptS1Tpt7MLz5IhmPRQ8ZnnnphjM0XQhDv0JjLrPuj1smXO5LUXkhXfaGCykKF4TC1tV-VmoQ1RawdJqMJ0wXEv51b14P2y3-rAXttR0sWc9gblewBQ_c6WC5zeULQE2qop251RKBb0N7ZTd4UzzB2_VCvet_gMbqluwGEk6PoO6x6DjA9BrKvH7zUz50eJ5je5nKNxEoL7-jPkYIwU7TToAn5tfOz2u9hXk1fukpQ8KRz',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuACEkE42PZyr-7_hhF67LzlvMN6x6r5ca18WjGzPZswkcPNE_zJFxxZuzG5RzEa0jstaMLK-9ZTojTBTSdK7T9Q2v8fugWYKhlc_LoJUpOy9kgNuL4d7HIBpp8Yqda2kkbZJMRx_rOFx5_-8RXWdXPUwd29LWZe_LnDG_ZaTHoPSnmJl3hB90sUEjritDfV1i799wMQAQnQYBA3-ipghFIzqVKUO9LgVcbsPPpZnghb89Z2tQYpe6gr22iph3sP_tZY39w97m1Jrty6',
    },
    {
        id: 2,
        title: 'Ivory Whisper Chiffon',
        price: 'PKR 22,900',
        priceNumeric: 22900,
        type: 'Premium Chiffon • 3 Piece',
        fabric: 'Chiffon',
        sizes: ['M', 'L', 'XL'],
        badge: null,
        primaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAk0iVyN-mJqdWuDMX-N55lGe-155pw9Td_5pn3BH2ZE5r2G5oLv_pBDMsia8qxiKmWEzaWr61ZWKUpjb6SVsWkU_mUP2Hxq8BhPiPKR1JNQnijpEx7x5TqXGZoGrDgL96UcI50KQkhzHukGoSCYEvXhv8NI0ePbfyikYcFlyOScmyH20ddxtcX2-h7TQPPr2l7gm9d99bq8BzDBTaFvmjSnkwXI_rNUbbhSMUrNNzrTYM1-kdepwt3l6qUZ7QMNR2aerHUT-AizE--',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCeuY4eA0xYpTjMTGl2AkZDweiwd_C6E1DZnEe1rsh6eOoC57PK6hsCM7rpvoiixzVz2HHNPlB-yY9aHJXySULzPu7rJejDsi10OVribx_gsg0Hfx68ydCIB793hfMB7_tqwq6uRveh6RM6zOgsh-5jYhjc19McDhK1QTvQNKgw0f0KPkuCLwpp4Tqtah2PuN1CrnTsWORD9gLd8QsS3rMq7AAL5OoskhnD0uKkrC3-0TOqIy2XL8lBqjm0B7v1TnLjj1_OzRH1718k',
    },
    {
        id: 3,
        title: 'Midnight Slate Lawn',
        price: 'PKR 14,500',
        priceNumeric: 14500,
        type: 'Egyptian Cotton Lawn • 2 Piece',
        fabric: 'Lawn',
        sizes: ['S', 'M', 'L'],
        badge: null,
        primaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCyLOHDBNpP7YCqdArthP3y-9RFMlF9VkY6q47kAoYefVCPoJTce2-diuJACKHFhQ9cbky8Frf1RpjrMUJQyWLIn8IhspwFniykFlcAPkpIthKUzlA6VDdtngwuVmm9jsnbSD_ZI052H3ZBXDPXg3uRtF-yi8R5a6RaTnGGRs05KYJck2HHWMMRclg2z71VWPGaNjSiQ9mvJNzqsRpV55RCd0zBnTmzQdSxyNTo978SW7jwc_g1eE6zr1jH8EMzHEVXareX_CU2zEZ5',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCHJhHoMXqeM4mNiYh6PsMdawYoFPgSWX_OxY9qOMBgUX0AcEV3pJMOpT4ObXfd3SC3_LvxwOjMmPotAgBcXFjsmewiiqjJ2sV37xEpga0Jyi6bznh4ExayMAnz7nIS1uWRyHo7nNovRfdJV0m_cFH95LoiHIDKUcIR7oL3d9Nfx9GmhXYTvn9Bqph_BIAlehAAmRgnnc54fO6hyd7BNd5nLyQNdU0WujSNbtiWvDoz1lBShPXNTVvw3Ea75ED0i_x65G3lQCB12gdr',
    },
    {
        id: 4,
        title: 'Terracotta Heritage Print',
        price: 'PKR 16,800',
        priceNumeric: 16800,
        type: 'Pure Lawn • 3 Piece',
        fabric: 'Lawn',
        sizes: ['S', 'L', 'XL'],
        badge: null,
        primaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDnb2dZxBt7xjNa1vRNJEbB6_n7Tv_9K80FVwQVCIWPdefmBgwfH54CiAA69_SOmghDihQejkuposQPnSVrHFFxI52bf3Lbm4pUHHlAAnWC_09PMDwcxgeLkHBaLlq_EiHBzc80-Y_JsjJ0JJU3q-LrunDM-lld7-jZZC_Xc7yEJSEfn8VLQBB6jF98ZEUvs2aJvaQwxuue-LVXMzIxLDWs9ZfwoEaxqwkR4TZ6V0EHQj4vz59txxtQOMnhce3xTm_dlxNevopnCrZA',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCikHo6s41OaXjLyuy6GwJoIzdwUPMp6yDnor1jgR8Ru4pnIMyV8GJobrf2u5tkPvdt9Qm7vt7RPNeKcB-qd4SGR5NS7_sMWe7mikoykMvqws_SA1iMdkHgOK1FPdI0q2Us0z6Yoi7XJmWLIhNmEDC7SDK0urerMnmq1nqDUYSA0oEpiG4AfpR-7XRbVNhdykFshxwcnU576mNcVPojJ07VCtObLakI_nULIktskXPcAXwJvHGW5fXEyNG9ZaWlHwFzqm-gp6Umd9mn',
    },
    {
        id: 5,
        title: 'Peach Pearl Ensemble',
        price: 'PKR 25,500',
        priceNumeric: 25500,
        type: 'Luxury Chiffon • 3 Piece',
        fabric: 'Chiffon',
        sizes: ['S', 'M', 'XL'],
        badge: null,
        primaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBaqaugS33mxRWqhX5e0UTaxlLw9WUgN9OuUYJdARxNHeTwHc6fIcjujUiruB08881Mlv4Zi_hFd4DajLieVzqMqKeoVVfwT3LESZKWvaLxmkTGfcLxi2giZsrnSeRfpYg_kUIGALF4RDtKEzgp-B2drvmZJNKYPfTneWOtXiEV4n1vllcFKHVyec5danLvvHfV86336Y1mQ4P3tIbsFtm6FbLZTJLEFvZ_aSgRiYEvUWz4FA3z-Sxq2aAr2kCKG9UrbF2JAWmF4cXQ',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCUaS9gTxcKp8H-g7SPpqBpU2b2NzioN0O_dzm5QCSy82J8XXI1SBV0ktsBKjIKzI743bHd7rHvySagyIFQOsnq8jYO80jQsZsCkGafmB9FAjRC5VdpBzQ9fkw6bPVielyHY4iG6BI7R89sNQW2AL1kNGZI63jmQL9MMb0IZP3epNhNHer6s1alz0XLZFkZPjG4IvXEreHzVyigXyhHRsMls2RxViCakQEc7874pCGnoDkBZrd1Fk8k7Zj_8JU1mD0peoDMCAdDeRgF',
    },
    {
        id: 6,
        title: 'Royal Azure Classic',
        price: 'PKR 15,200',
        priceNumeric: 15200,
        type: 'Fine Lawn • 3 Piece',
        fabric: 'Lawn',
        sizes: ['M', 'L'],
        badge: 'Sold Out',
        primaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBFp3RWSP3NJBjHuvMg3tUmCSM08Z1groD2o1dncXRpv-ZmYK285eaKgwNDHhgF9nZPE9ilnLf0GmrzO7H8ZmMdGH8ZkXt2EN3Hw2WgBEuIijyrYpcNKjfsa25mr701GHr3vvOt6XkYJGnvhDgypXBc-c3SVBpmgoYNghFiuTPMXmfheMU_LNttHDASSgS0MBw6hrr2aR7wp8s4Qrjw69zEIkSLrsPVVFNNIYmPbmu4bvMtQ5NqY6M3t3UMx0eV_i6XzKLVSMCKA2ov',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBTo8WzxXLKoG27vHCIkUbaQintdsVJ81MHKdcrfHjHDx_0TK-L8AMC4cZzxFezAWZEaBoQ_MTgccg74zvkOkBVp1f_SBtQsrNmgFGNuY706eLohib849U1DCbR3r0vf2JOtQ_fCdFQoaqE1zFdPdE7e7fqvEl0R32VIx94tp__[5YrwYVKF2qVcr-bK52TQDLTw-9korDj5I6bOrL8lz-WD0owfXzLNAGldZM4XvyYYfDePgQT4xYWcchMzWlyJwZmpC9ls4j91u12B',
    },
    {
        id: 7,
        title: 'Sage Textured Organza',
        price: 'PKR 19,800',
        priceNumeric: 19800,
        type: 'Silk Mix Organza • 3 Piece',
        fabric: 'Organza',
        sizes: ['S', 'M', 'L', 'XL'],
        badge: null,
        primaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDs3b3765YcQhpr9mm9L5v4X5XrX6og7N5Uz-oyV_VtPOh4KjMK_Iu_meqXmunNVMeBfKd3F37gDfbttyIq8v7jIfczC0yT4wP_7NowyfEsz8cp2REXWdmQzjy3yJOt3w3Mhebp0w2F6IJGp1_hyuz3RpTyqp646zOnacZG18JXD_-73gnkGrc87nhETe7OqEe18Ak2g76SgAuSPA28IXVAmgE0w7kvGBMqDSMN9a86LLC2wHUzvexHA3_K9e5hWxDbUoXPTs5zqRW_',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB5aiVR-ef6OYiP1mkDI4tIv81TjlgGyRuXX6hUUtH3_iYfEVvYZ4DIEfFzMU41tPZ4EYF0psoT-vBvCZvmVB-OT_szorI7sKcTGT9NaxoI4gvOK-DEK3sOVJeM0QYZUq4JkGYFv9HgHRRBZrsVtHujNo6Y4WjTIsWdllz74gVKKUwkHC3jr235F62iTjKSnuyGB02s7adhrKFEL9TZLdWjWIbGx7pmFVCFe3WI17KSAX8cYXhQpEL7US7xVvcvJAmwSP9Wz37zzlC5',
    },
    {
        id: 8,
        title: 'Blush Silver Glow',
        price: 'PKR 21,000',
        priceNumeric: 21000,
        type: 'Premium Lawn • 3 Piece',
        fabric: 'Lawn',
        sizes: ['S', 'M', 'L'],
        badge: null,
        primaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB_DbvP7_EHNRV0FQ6blKJrgG9SV-K0DtCVg8z1J2se4yqgXN20nAAOu2o7mYgLL0QM0sRKic8YxDCh3eRcZt2xtfVR4G83rNYBzfbe9QgV8Iu86xzZOXgUF99DSLwZmj4IHVv9DsGpCNnHE4dZffKBu_qeZJtoNkHqMy-vlcOblk25zJFAOX0rM5G84Rsbemos3jtqAXDzUZCqtf_OMm60wc3Cdebmbk54wEAxC7WSOZYCWkL7zWY-oRwLnBIEqb9FjD5Xw7-dYrhX',
        secondaryImage:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDaxl5u3hiELsutAT66gaLj6mFElJ1CjMIpoLir_6p_AJrPgy5d5iVH0Vb4BQdGnMBEU2DjjGgWZm5G7oZ2R0bom7DtrSfu1gN3HCUlpK181n9NwNvpK1y-FZulnm-Zdp2LpGSIi0RNc9DSyv6JlozN_Tg0cZdv4Nd6uiXTe_0bRRJHE68zBwgVUs2STDC_mcTBl5AtfoEz0iEDZq0CzI6YvXt4fTG5bIO1AR7JcajUUyl0bIRmbAeoLuCGI-NZFBb8M-LoelGfjELz',
    },
];

export default function CollectionPage() {
    const params = useParams();
    const slug = params.slug;

    const [sortBy, setSortBy] = useState('Featured');
    
    // Filtering States
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('All');

    // Filter collection products by slug
    const collectionProducts = useMemo(() => {
        if (!slug) return mockProducts;
        const normalizedSlug = slug.toLowerCase();
        if (normalizedSlug === 'lawn') {
            return mockProducts.filter((p) => p.fabric === 'Lawn');
        }
        if (normalizedSlug === 'chiffon') {
            return mockProducts.filter((p) => p.fabric === 'Chiffon');
        }
        if (normalizedSlug === 'organza') {
            return mockProducts.filter((p) => p.fabric === 'Organza');
        }
        return mockProducts;
    }, [slug]);

    // Handle filter toggles
    const toggleFabric = (fabric) => {
        setSelectedFabrics((prev) =>
            prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
        );
    };

    const toggleSize = (size) => {
        setSelectedSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    // Calculate active filters count
    const activeFiltersCount =
        selectedFabrics.length +
        selectedSizes.length +
        (selectedPriceRange !== 'All' ? 1 : 0);

    // Apply filtering logic
    const filteredProducts = collectionProducts.filter((product) => {
        // Fabric/Variant filter
        if (selectedFabrics.length > 0 && !selectedFabrics.includes(product.fabric)) {
            return false;
        }

        // Size filter
        if (
            selectedSizes.length > 0 &&
            !product.sizes.some((size) => selectedSizes.includes(size))
        ) {
            return false;
        }

        // Price range filter
        if (selectedPriceRange !== 'All') {
            const price = product.priceNumeric;
            if (selectedPriceRange === 'Under 16k' && price >= 16000) return false;
            if (selectedPriceRange === '16k-22k' && (price < 16000 || price > 22000)) return false;
            if (selectedPriceRange === 'Over 22k' && price <= 22000) return false;
        }

        return true;
    });

    // Apply sorting logic
    const sortedProducts = [...filteredProducts];
    if (sortBy === 'Price: Low to High') {
        sortedProducts.sort((a, b) => a.priceNumeric - b.priceNumeric);
    } else if (sortBy === 'Price: High to Low') {
        sortedProducts.sort((a, b) => b.priceNumeric - a.priceNumeric);
    } else if (sortBy === 'Newest') {
        sortedProducts.sort((a, b) => b.id - a.id);
    }

    return (
        <>
            {/* Collection Header */}
            <header className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Collection Header Background"
                        className="w-full h-full object-cover opacity-30 grayscale-[20%]"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg0YtbfPu0BLg_QDj8oN1HUo3GwLTnHmhOl9DwaiRpHXZW_HcrozwpjdSNavSQXCvCJH1h2Q6CBjhi1dwTgiwgFE8RUQ0YqJvaSaw3OcU1MXPxw1G5pYWcG2KKl15fAncZvR19aeTgU9d2OTyUm5MhmTBq9pmBt1ZgIOf7siIAsiyaKLUgdAHqcqICxlAgazZKDmipXP-LpAtXEKHF9sV-FC0-UMhFfDjsfd4raaVaHwYt7_KatUVijnauUXLhtGGiUGrG_jqhxxrg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/80" />
                </div>
                <div className="relative z-10 text-center px-margin-mobile">
                    <h1 className="font-display-lg text-display-lg text-primary mb-2 capitalize">
                        {slug ? slug.replace(/-/g, ' ') : 'Collection'}
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
                        Discover our latest curation of exquisite Eastern attire, where traditional craftsmanship meets modern silhouettes.
                    </p>
                </div>
            </header>

            {/* Filter & Sort Bar */}
            <section className="sticky top-[88px] z-40 bg-surface/95 backdrop-blur-md border-b border-secondary/10">
                <div className="max-w-container-max mx-auto px-margin-desktop py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-8">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 cursor-pointer group bg-transparent border-none outline-none"
                        >
                            <span className={`material-symbols-outlined transition-colors ${showFilters ? 'text-secondary' : 'text-on-surface-variant group-hover:text-secondary'}`}>
                                tune
                            </span>
                            <span className={`font-label-md text-label-md uppercase tracking-widest transition-colors ${showFilters ? 'text-secondary font-bold' : 'text-on-surface-variant group-hover:text-secondary'}`}>
                                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                            </span>
                        </button>
                        <div className="hidden lg:flex items-center space-x-6">
                            <button onClick={() => { setShowFilters(true); }} className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors">
                                Fabric
                            </button>
                            <button onClick={() => { setShowFilters(true); }} className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors">
                                Size
                            </button>
                            <button onClick={() => { setShowFilters(true); }} className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors">
                                Price
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="font-label-md text-label-md text-on-surface-variant/60 uppercase">
                            Sort By:
                        </span>
                        <select
                            className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-primary cursor-pointer pr-8"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option>Featured</option>
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                        <div className="h-6 w-[1px] bg-secondary/20" />
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                            Showing {sortedProducts.length} of {mockProducts.length} Products
                        </p>
                    </div>
                </div>
            </section>

            {/* Collapsible Filters Dashboard */}
            {showFilters && (
                <section className="bg-surface-container-low border-b border-secondary/10 px-margin-desktop py-8 transition-all duration-300">
                    <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Fabric / Variant Filter */}
                        <div>
                            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4">Fabric / Variant</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Lawn', 'Chiffon', 'Organza'].map((fabric) => {
                                    const isSelected = selectedFabrics.includes(fabric);
                                    return (
                                        <button
                                            key={fabric}
                                            onClick={() => toggleFabric(fabric)}
                                            className={`px-4 py-2 text-label-sm font-label-sm border rounded-sm transition-all ${
                                                isSelected
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-secondary/20 text-on-surface-variant hover:border-secondary'
                                            }`}
                                        >
                                            {fabric}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {['S', 'M', 'L', 'XL'].map((size) => {
                                    const isSelected = selectedSizes.includes(size);
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`w-10 h-10 flex items-center justify-center text-label-sm font-label-sm border rounded-sm transition-all ${
                                                isSelected
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-secondary/20 text-on-surface-variant hover:border-secondary'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-4">Price Range</h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: 'All Prices', value: 'All' },
                                    { label: 'Under PKR 16,000', value: 'Under 16k' },
                                    { label: 'PKR 16,000 - 22,000', value: '16k-22k' },
                                    { label: 'Over PKR 22,000', value: 'Over 22k' },
                                ].map((range) => {
                                    const isSelected = selectedPriceRange === range.value;
                                    return (
                                        <button
                                            key={range.value}
                                            onClick={() => setSelectedPriceRange(range.value)}
                                            className={`px-4 py-2 text-label-sm font-label-sm border rounded-sm transition-all ${
                                                isSelected
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'border-secondary/20 text-on-surface-variant hover:border-secondary'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Active Filters & Reset */}
                    {activeFiltersCount > 0 && (
                        <div className="max-w-container-max mx-auto mt-8 pt-6 border-t border-secondary/10 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-label-sm font-label-sm text-on-surface-variant/60 mr-2">Active Filters:</span>
                                {selectedFabrics.map((fabric) => (
                                    <span key={fabric} className="inline-flex items-center gap-1.5 bg-white px-3 py-1 text-label-sm font-medium border border-secondary/15 rounded-sm">
                                        {fabric}
                                        <button onClick={() => toggleFabric(fabric)} className="hover:text-error transition-colors font-bold text-[11px] leading-none ml-1">✕</button>
                                    </span>
                                ))}
                                {selectedSizes.map((size) => (
                                    <span key={size} className="inline-flex items-center gap-1.5 bg-white px-3 py-1 text-label-sm font-medium border border-secondary/15 rounded-sm">
                                        Size: {size}
                                        <button onClick={() => toggleSize(size)} className="hover:text-error transition-colors font-bold text-[11px] leading-none ml-1">✕</button>
                                    </span>
                                ))}
                                {selectedPriceRange !== 'All' && (
                                    <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1 text-label-sm font-medium border border-secondary/15 rounded-sm">
                                        {selectedPriceRange === 'Under 16k' ? 'Under 16k' : selectedPriceRange === '16k-22k' ? '16k - 22k' : 'Over 22k'}
                                        <button onClick={() => setSelectedPriceRange('All')} className="hover:text-error transition-colors font-bold text-[11px] leading-none ml-1">✕</button>
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedFabrics([]);
                                    setSelectedSizes([]);
                                    setSelectedPriceRange('All');
                                }}
                                className="text-label-md font-label-md text-secondary hover:underline bg-transparent border-none cursor-pointer"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Product Grid */}
            <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
                {sortedProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-outline text-5xl mb-4">
                            info
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-primary mb-2">No Products Found</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto mb-6">
                            No products match your selected filters. Try removing some filters to see all available items.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedFabrics([]);
                                setSelectedSizes([]);
                                setSelectedPriceRange('All');
                            }}
                            className="bg-primary text-white font-label-md px-8 py-3 uppercase tracking-wider hover:bg-primary-container transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-gutter gap-y-stack-md animate-fade-in-up">
                        {sortedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                title={product.title}
                                price={product.price}
                                image={product.primaryImage}
                                type={product.type}
                                sizes={product.sizes}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {sortedProducts.length > 0 && (
                    <nav className="flex justify-center items-center mt-stack-lg space-x-2">
                        <button className="w-10 h-10 flex items-center justify-center border border-secondary/20 text-on-surface-variant hover:border-secondary hover:text-secondary transition-all">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-secondary text-white font-label-md">1</button>
                        <button className="w-10 h-10 flex items-center justify-center border border-secondary/20 text-on-surface-variant hover:border-secondary hover:text-secondary transition-all font-label-md">
                            2
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center border border-secondary/20 text-on-surface-variant hover:border-secondary hover:text-secondary transition-all font-label-md">
                            3
                        </button>
                        <span className="px-2 text-on-surface-variant">...</span>
                        <button className="w-10 h-10 flex items-center justify-center border border-secondary/20 text-on-surface-variant hover:border-secondary hover:text-secondary transition-all font-label-md">
                            12
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center border border-secondary/20 text-on-surface-variant hover:border-secondary hover:text-secondary transition-all">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </nav>
                )}
            </main>
        </>
    );
}