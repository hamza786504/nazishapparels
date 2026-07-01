// components/ProductCard.jsx
import Link from "next/link"
import Image from "next/image"

export default function ProductCard({ title, price, image, type, sizes = [], slug = "" }) {

    // logging the props to verify they are being passed correctly
    console.log("ProductCard props:", { title, price, image, type, sizes, slug });
    
    // Custom loader for Cloudinary images
    const cloudinaryLoader = ({ src, width, quality }) => {
        // If it's already a full URL
        if (src.startsWith('http')) {
            return src;
        }
        // If it's a Cloudinary public ID
        return `https://res.cloudinary.com/dm430jren/image/upload/w_${width},q_${quality || 75}/${src}`;
    };

    return (
        <div className="overflow-hidden product-card group cursor-pointer block">
            <Link 
                href={`/product/${slug}`} 
                className="relative overflow-hidden block bg-surface-container-low"
                style={{ aspectRatio: '3/4' }}
            >
                <Image
                    loader={cloudinaryLoader}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={image}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized={image.startsWith('http')}
                />
                <div className="absolute bottom-0 left-0 w-full bg-primary text-white py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 font-label-md tracking-widest text-center text-sm">
                    QUICK ADD
                </div>
            </Link>
            <div className="mt-4 flex flex-col gap-1">
                {type && (
                    <p className="text-label-sm font-label-sm text-on-surface-variant/70 uppercase tracking-widest">
                        {type}
                    </p>
                )}
                <Link 
                    href={`/product/${slug}`} 
                    className="text-body-lg font-body-lg text-primary font-medium group-hover:text-secondary transition-colors line-clamp-2"
                >
                    {title}
                </Link>
                <p className="text-headline-sm font-headline-sm text-secondary font-semibold mt-1">
                    {price}
                </p>
                {sizes && sizes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {sizes.map((size) => (
                            <span 
                                key={size} 
                                className="text-[10px] font-label-sm font-bold text-on-surface-variant/80 border border-secondary/20 px-2 py-0.5 rounded-sm hover:border-secondary hover:text-secondary transition-colors"
                            >
                                {size}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}