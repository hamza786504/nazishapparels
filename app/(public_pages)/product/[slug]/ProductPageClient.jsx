'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../../store/cartContext';
import { useFavorites } from '../../../store/favoritesContext';
import ProductCard from '../../../_components/ProductCard';
import SizeChartModal from '../../../_components/SizeChartModal';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductPageClient({ initialProduct }) {
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [product] = useState(initialProduct);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Fetch related products
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product) return;
            try {
                const collectionId = product.collectionId?._id || product.collectionId;
                const query = collectionId
                    ? `collectionId=${collectionId}`
                    : `type=${product.productType}`;
                const res = await fetch(`/api/products?${query}&status=active`);
                const data = await res.json();
                if (data.success) {
                    const filtered = data.products
                        .filter(p => p._id !== product._id)
                        .slice(0, 4);
                    setRelatedProducts(filtered);
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };

        fetchRelatedProducts();
    }, [product]);

    // Images list
    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image || product.primaryImage || ''];

    // PRELOAD ALL IMAGES: Fixes the delayed image switching experience
    useEffect(() => {
        if (typeof window !== 'undefined') {
            images.forEach((src) => {
                const img = new window.Image();
                img.src = src;
            });
        }
    }, [images]);

    const [mainImage, setMainImage] = useState(images[0] || '');
    const [activeThumb, setActiveThumb] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
    const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'S');
    const [quantity, setQuantity] = useState(1);
    const [accordionOpen, setAccordionOpen] = useState(null);
    const [sizeChartOpen, setSizeChartOpen] = useState(false);
    const [isAddingToBag, setIsAddingToBag] = useState(false);
    const [bagAdded, setBagAdded] = useState(false);

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    // Review form state
    const [reviewForm, setReviewForm] = useState({
        customerName: '',
        customerEmail: '',
        rating: 0,
        hoverRating: 0,
        reviewText: '',
    });
    const [reviewImage, setReviewImage] = useState(null);
    const [reviewImagePreview, setReviewImagePreview] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSubmitMsg, setReviewSubmitMsg] = useState('');
    const fileInputRef = useRef(null);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            if (!product?._id) return;
            setReviewsLoading(true);
            try {
                const res = await fetch(`/api/reviews?productId=${product._id}`);
                const data = await res.json();
                if (data.success) {
                    setReviews(data.reviews);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchReviews();
    }, [product?._id]);

    // Carousel & Thumbnail Logic
    const handleThumbClick = (src, index) => {
        setMainImage(src);
        setActiveThumb(index);
    };

    const handlePrevImage = () => {
        const newIndex = (activeThumb - 1 + images.length) % images.length;
        setMainImage(images[newIndex]);
        setActiveThumb(newIndex);
    };

    const handleNextImage = () => {
        const newIndex = (activeThumb + 1) % images.length;
        setMainImage(images[newIndex]);
        setActiveThumb(newIndex);
    };

    // Updated to handle both numbers (specs) and strings (review form)
    const toggleAccordion = (target) => {
        setAccordionOpen(accordionOpen === target ? null : target);
    };

    const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
    const increaseQuantity = () => setQuantity(prev => Math.min(10, prev + 1));

    const handleAddToBag = () => {
        setIsAddingToBag(true);
        addToCart(product.slug, selectedSize, selectedColor, quantity, product);
        setTimeout(() => {
            setIsAddingToBag(false);
            setBagAdded(true);
            setTimeout(() => setBagAdded(false), 2000);
        }, 1000);
    };

    // Review form handlers...
    const handleReviewFormChange = (e) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setReviewImage(file);
        setReviewImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setReviewImage(null);
        setReviewImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewForm.customerName.trim()) return setReviewSubmitMsg('Please enter your name.');
        if (!reviewForm.customerEmail.trim()) return setReviewSubmitMsg('Please enter your email.');
        if (reviewForm.rating < 1) return setReviewSubmitMsg('Please select a star rating.');
        if (!reviewForm.reviewText.trim()) return setReviewSubmitMsg('Please write a review.');

        setSubmittingReview(true);
        setReviewSubmitMsg('');
        try {
            let imageUrl = '';

            if (reviewImage) {
                setUploadingImage(true);
                const fd = new FormData();
                fd.append('file', reviewImage);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
                const uploadData = await uploadRes.json();
                if (uploadData.success) imageUrl = uploadData.url;
                setUploadingImage(false);
            }

            const reviewPayload = {
                productId: product._id,
                customerName: reviewForm.customerName.trim(),
                customerEmail: reviewForm.customerEmail.trim(),
                rating: reviewForm.rating,
                reviewText: reviewForm.reviewText.trim(),
                image: imageUrl,
                status: 'pending',
            };

            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewPayload),
            });
            const data = await res.json();

            if (!res.ok || !data.success) throw new Error(data.error || 'Failed to submit review.');

            setReviewSubmitMsg('✓ Thank you! Your review has been submitted for approval.');
            setReviewForm({ customerName: '', customerEmail: '', rating: 0, hoverRating: 0, reviewText: '' });
            handleRemoveImage();
            setAccordionOpen(null);
        } catch (err) {
            setReviewSubmitMsg(`Error: ${err.message}`);
        } finally {
            setSubmittingReview(false);
        }
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;
    const [copied, setCopied] = useState(false);
    const favorited = isFavorite(product?._id);

    const handleFavoriteClick = () => {
        if (!product) return;
        toggleFavorite({
            id: product._id,
            _id: product._id,
            slug: product.slug,
            title: product.title,
            price: `PKR ${Number(product.price).toLocaleString()}`,
            priceNumeric: product.price,
            compareAtPrice: product.compareAtPrice,
            image: mainImage || images[0] || '',
            type: product.productType,
            sizes: product.sizes || [],
            colors: product.colors || [],
        });
    };

    const handleShare = async () => {
        if (typeof window === 'undefined') return;
        const shareData = {
            title: product.title,
            text: `Check out ${product.title} on Nazish Apparels`,
            url: window.location.href,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // Fallback to clipboard if share modal was dismissed or failed
            }
        }
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            } catch (err) {
                console.error('Failed to copy link', err);
            }
        }
    };

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg">

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-4 md:mb-6 overflow-hidden whitespace-nowrap">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <Link href={`/collection/${product.collectionId?.slug || 'all'}`} className="hover:text-primary transition-colors truncate max-w-[150px]">
                    {product.collectionId?.name || product.productType || 'Shop'}
                </Link>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-primary truncate max-w-[150px] md:max-w-[300px]">{product.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

                {/* Image Gallery Section */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row-reverse gap-4">
                        <div className="flex-1 relative max-h-[550px] aspect-[3/4] overflow-hidden group image-zoom">
                            <Image
                                height={580}
                                width={720}
                                src={mainImage}
                                alt="Main Product View"
                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                priority
                            />

                            {/* Carousel Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                                        aria-label="Previous image"
                                    >
                                        <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                                        aria-label="Next image"
                                    >
                                        <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
                                    </button>
                                </>
                            )}

                            <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span className="text-label-sm text-primary uppercase tracking-widest">New Arrival</span>
                            </div>
                        </div>
                        <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar md:w-20 shrink-0">
                            {images.map((thumb, idx) => (
                                thumb && (
                                    <button
                                        key={idx}
                                        className={`aspect-[3/4] w-20 md:w-full shrink-0 overflow-hidden bg-surface-container transition-all border-2 ${activeThumb === idx ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                                        onClick={() => handleThumbClick(thumb, idx)}
                                    >
                                        <Image height={100} width={100} src={thumb} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Reviews Section (Updated to match screenshot) */}
                    <section className="mt-stack-lg border-t border-secondary/30 pt-stack-md">
                        <div className="flex flex-col gap-6">
                            

                            {/* Write a Review Toggle Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => toggleAccordion('review-form')}
                                    className="text-sm font-medium underline underline-offset-4 text-secondary hover:text-black transition-colors cursor-pointer"
                                >
                                    {accordionOpen === 'review-form' ? 'Close Review Form' : 'Write a Review'}
                                </button>
                            </div>

                            {/* Write a Review Form (Hidden in Accordion) */}
                            <div className={`overflow-hidden transition-[max-height] duration-500 ease-out ${accordionOpen === 'review-form' ? 'max-h-[800px]' : 'max-h-0'}`}>
                                <form onSubmit={handleSubmitReview} className="p-4 md:p-6 flex flex-col gap-6 border border-outline-variant rounded-lg mb-6 bg-surface-container-low">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-label-sm text-primary uppercase">Your Name</label>
                                            <input className="w-full bg-transparent border border-outline-variant p-3 focus:border-black focus:ring-0 text-body-md" name="customerName" placeholder="Ayesha Khan" value={reviewForm.customerName} onChange={handleReviewFormChange} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-label-sm text-primary uppercase">Your Email</label>
                                            <input className="w-full bg-transparent border border-outline-variant p-3 focus:border-black focus:ring-0 text-body-md" name="customerEmail" type="email" placeholder="you@example.com" value={reviewForm.customerEmail} onChange={handleReviewFormChange} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-label-sm text-primary uppercase">Your Rating</label>
                                        <div className="flex gap-1 text-secondary">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} type="button" className="material-symbols-outlined text-2xl transition-transform hover:scale-110" style={{ fontVariationSettings: `'FILL' ${star <= (reviewForm.hoverRating || reviewForm.rating) ? 1 : 0}, 'wght' 300, 'GRAD' 0, 'opsz' 24` }} onMouseEnter={() => setReviewForm(p => ({ ...p, hoverRating: star }))} onMouseLeave={() => setReviewForm(p => ({ ...p, hoverRating: 0 }))} onClick={() => setReviewForm(p => ({ ...p, rating: star }))}>star</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-label-sm text-primary uppercase">Your Review</label>
                                        <textarea className="w-full bg-transparent border border-outline-variant p-4 focus:border-black focus:ring-0 text-body-md min-h-[120px]" name="reviewText" placeholder="Tell us about the fit, fabric, and feel..." value={reviewForm.reviewText} onChange={handleReviewFormChange} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-label-sm text-primary uppercase">Upload Photo (Optional)</label>
                                        {reviewImagePreview ? (
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-24 h-24 rounded overflow-hidden bg-surface-container flex-shrink-0"><Image src={reviewImagePreview} alt="Preview" className="object-cover" fill sizes="96px" unoptimized /></div>
                                                <button type="button" onClick={handleRemoveImage} className="flex items-center gap-1 text-label-sm text-error hover:underline"><span className="material-symbols-outlined text-sm">delete</span>Remove</button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center gap-2 hover:border-black transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                <span className="material-symbols-outlined text-on-surface-variant">add_a_photo</span>
                                                <span className="text-label-sm text-on-surface-variant">Click to upload a photo</span>
                                                <span className="text-[11px] text-on-surface-variant">PNG, JPG up to 5MB</span>
                                            </div>
                                        )}
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                                    </div>
                                    {reviewSubmitMsg && (<p className={`text-label-sm px-3 py-2 rounded ${reviewSubmitMsg.startsWith('✓') ? 'bg-secondary/10 text-secondary' : 'bg-error-container/20 text-error'}`}>{reviewSubmitMsg}</p>)}
                                    <button type="submit" disabled={submittingReview || uploadingImage} className="w-full md:w-auto px-12 py-4 bg-black text-white font-label-md uppercase tracking-widest hover:scale-[1.02] transition-all border border-black disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-full">
                                        {submittingReview ? (<><span className="material-symbols-outlined animate-spin">progress_activity</span>{uploadingImage ? 'Uploading photo...' : 'Submitting...'}</>) : ('Submit Review')}
                                    </button>
                                </form>
                            </div>

                            {/* 2-Column Review Grid */}
                            {reviewsLoading ? (
                                <div className="flex items-center gap-3 text-on-surface-variant py-4">
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    Loading reviews...
                                </div>
                            ) : reviews.length === 0 ? (
                                <p className="text-body-md text-on-surface-variant italic py-4">No ratings yet. Be the first to rate this product!</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="flex flex-col gap-2 p-4 border border-[#EBEBEB] bg-white rounded-lg">
                                            <div className="flex text-amber-500 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className="material-symbols-outlined text-sm">
                                                        {i < review.rating ? 'star' : 'star_outline'}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                                <span className="font-medium text-gray-700">{review.customerName || 'Anonymous'}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <p className="text-body-md text-gray-800 leading-relaxed">{review.reviewText}</p>
                                            {review.image && (
                                                <div className="mt-2">
                                                    <div className="relative w-20 h-20 rounded overflow-hidden bg-surface-container">
                                                        <Image src={review.image} alt="Customer photo" className="object-cover" fill sizes="80px" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Product Information Section */}
                <div className="lg:col-span-5 flex flex-col gap-6 fade-in">
                    <header className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                                {product.productType && <p className="text-label-md text-secondary uppercase tracking-[0.2em]">{product.productType}</p>}
                                
                                <h1 className="text-lg sm:text-headline-lg text-primary leading-tight">{product.title}</h1>
                            </div>
                            <div className="flex gap-2 relative">
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    title="Share Product"
                                    className="p-2 rounded-full border border-outline-variant hover:bg-surface-container-low transition-colors relative"
                                    aria-label="Share product"
                                >
                                    <span className="material-symbols-outlined text-lg">share</span>
                                    {copied && (
                                        <span className="absolute -bottom-8 right-0 bg-black text-white text-[10px] px-2.5 py-1 rounded shadow-md whitespace-nowrap z-20 animate-fade-in">
                                            Link copied!
                                        </span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFavoriteClick}
                                    title={favorited ? "Remove from wishlist" : "Add to wishlist"}
                                    className={`p-2 rounded-full border transition-colors ${favorited ? 'border-red-200 bg-red-50 text-red-500' : 'border-outline-variant hover:bg-surface-container-low text-gray-700'}`}
                                    aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}>
                                        {favorited ? 'favorite' : 'favorite_border'}
                                    </span>
                                </button>
                            </div>
                        </div>
                        <p className="text-headline-sm text-primary">{product.price} PKR</p>

                        {/* Star Rating & Reviews */}
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-amber-500">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <span key={s} className="material-symbols-outlined text-sm">
                                        {avgRating && s <= Math.round(parseFloat(avgRating)) ? 'star' : avgRating ? 'star_outline' : 'star'}
                                    </span>
                                ))}
                            </div>
                            <span className="text-label-sm text-on-surface-variant">
                                {reviews.length > 0 ? `${avgRating} | ${reviews.length} Reviews` : 'No reviews yet'}
                            </span>
                        </div>
                    </header>

                    {/* Instant Dispatch & Shipping Box */}
                    <div className="flex flex-col border border-outline-variant rounded-xl divide-y divide-outline-variant bg-surface-container-low">
                        <div className="p-4 flex items-center gap-3">
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Express</span>
                            <span className="text-label-md text-primary font-medium">Instant dispatch, no delays</span>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex flex-row gap-4 items-center justify-start text-label-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-base">local_shipping</span>
                                <span className="flex flex-col justify-start items-start gap-1">
                                    Est. shipping by {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    <span className="flex items-center text-gray-400">Express delivery · Pakistan</span>
                                </span>
                            </div>
                            <div className="flex flex-row gap-4 items-center justify-start text-label-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-base">sync_alt</span>
                                <span className="flex flex-col justify-start items-start gap-1">
                                    Easy 14 days return and refund
                                    <span className="text-gray-400">Return for a different size within 14 days.</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Color */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <span className="text-label-md text-primary uppercase">
                                    Select Color: <span className="font-normal text-on-surface-variant">Default Color</span>
                                </span>
                                <div className="flex gap-4">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-black ring-2 ring-offset-2 ring-transparent' : 'border-outline-variant hover:border-black'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setSelectedColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size - Updated to Pill/Capsule style */}
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-label-md text-primary uppercase">Size</span>
                                {/* Size Chart Uncommented */}
                                <button
                                    type="button"
                                    className="text-label-sm text-secondary underline underline-offset-4 uppercase bg-transparent border-none cursor-pointer"
                                    onClick={() => setSizeChartOpen(true)}
                                >
                                    Size Guide
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {(product.sizes || ['One Size']).map((size) => (
                                    <button
                                        key={size}
                                        className={`px-6 py-2.5 text-label-md font-medium transition-all rounded-full border ${selectedSize === size
                                            ? 'bg-black text-white border-black'
                                            : 'bg-transparent text-primary border-outline-variant hover:border-black hover:bg-surface-container-low'}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex flex-col gap-3">
                            <span className="text-label-md text-primary uppercase">Quantity</span>
                            <div className="flex items-center gap-0">
                                <button
                                    className="w-12 h-12 flex items-center justify-center border border-outline-variant hover:border-black hover:bg-surface-container-low transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-l-full"
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1}
                                    aria-label="Decrease quantity"
                                >
                                    <span className="material-symbols-outlined text-lg">remove</span>
                                </button>
                                <div className="w-16 h-12 flex items-center justify-center border-t border-b border-outline-variant bg-transparent">
                                    <span className="text-body-md text-primary font-medium">{quantity}</span>
                                </div>
                                <button
                                    className="w-12 h-12 flex items-center justify-center border border-outline-variant hover:border-black hover:bg-surface-container-low transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-r-full"
                                    onClick={increaseQuantity}
                                    disabled={quantity >= 10}
                                    aria-label="Increase quantity"
                                >
                                    <span className="material-symbols-outlined text-lg">add</span>
                                </button>
                            </div>
                        </div>

                        {/* CTA Buttons - Add to Bag & Buy Now */}
                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                className={`cursor-pointer w-full py-4 text-white font-label-md uppercase tracking-widest transition-all duration-300 flex justify-center items-center gap-2 rounded-full border border-black ${bagAdded ? 'bg-gray-800' : 'bg-black hover:bg-gray-800'}`}
                                onClick={handleAddToBag}
                                disabled={isAddingToBag}
                            >
                                {isAddingToBag ? (
                                    <>Adding...</>
                                ) : bagAdded ? (
                                    <>Added to Cart</>
                                ) : (
                                    <>Add To Bag (PKR {Number(product.price).toLocaleString()})</>
                                )}
                            </button>

                            <button className="cursor-pointer w-full py-4 bg-white text-black font-label-md uppercase tracking-widest rounded-full border border-black hover:bg-gray-50 transition-all">
                                Buy Now
                            </button>

                            
                        </div>

                        {/* Accordion Specs */}
                        <div className="flex flex-col border-t border-outline-variant mt-6">
                            {['Product Details', 'Care Instructions', 'Shipping'].map((label, idx) => {
                                if (idx === 0 && (!product.description || product.description.trim().length <= 1)) return null;
                                const content = [
                                    <div key="details" className="pb-6 text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                                        {product.description}
                                    </div>,
                                    <div key="care" className="pb-6 text-body-md text-on-surface-variant">
                                        Store in a cool, dry place. Dry clean only for heavily embroidered or delicate fabrics. Avoid direct sunlight to prevent color fading.
                                    </div>,
                                    <div key="shipping" className="pb-6 text-body-md text-on-surface-variant">
                                        Complimentary shipping on all domestic orders above PKR 10,000. Returns accepted within 7 days in original condition.
                                    </div>,
                                ];
                                return (
                                    <div key={idx} className="accordion-item border-b border-outline-variant">
                                        <button className="w-full py-6 flex justify-between items-center group" onClick={() => toggleAccordion(idx)}>
                                            <span className="font-label-md text-primary uppercase">{label}</span>
                                            <span className={`material-symbols-outlined transition-transform duration-300 ${accordionOpen === idx ? 'rotate-180' : ''}`}>expand_more</span>
                                        </button>
                                        <div className={`overflow-hidden transition-max-height duration-300 ease-out ${accordionOpen === idx ? 'max-h-96' : 'max-h-0'}`}>
                                            {content[idx]}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>



            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-stack-lg border-t border-secondary/30 pt-stack-md">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-headline-md text-headline-md text-primary">Complete the Look</h2>
                            <p className="text-body-md text-on-surface-variant">Elevate your ensemble with these essentials.</p>
                        </div>
                        <Link className="text-label-md text-secondary border-b border-secondary pb-1 hidden md:block" href={`/collection/${product.collectionId?.slug || 'all'}`}>View Collection</Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 gap-y-6">
                        {relatedProducts.map((item) => (
                            <ProductCard key={item._id} id={item._id} title={item.title} price={`PKR ${Number(item.price).toLocaleString()}`} priceNumeric={item.price} compareAtPrice={item.compareAtPrice} image={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=700&fit=crop'} slug={item.slug} type={item.productType} sizes={item.sizes} colors={item.colors} reviewAvg={item.reviewAvg || 0} reviewCount={item.approved_review_count || item.reviewCount || 0} />
                        ))}
                    </div>
                </section>
            )}

            <SizeChartModal isOpen={sizeChartOpen} onClose={() => setSizeChartOpen(false)} />
        </main>
    );
}