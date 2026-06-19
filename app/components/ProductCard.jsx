// components/ProductCard.jsx
export default function ProductCard({ title, price, image, type, sizes = [] }) {
    return (
        <div className="product-card group cursor-pointer">
            <div className="relative overflow-hidden aspect-[3/4] bg-surface-container-low">
                <img
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={image}
                />
                <button className="absolute bottom-0 left-0 w-full bg-primary text-white py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 font-label-md tracking-widest">
                    QUICK ADD
                </button>
            </div>
            <div className="mt-6 flex flex-col gap-1">
                {type && (
                    <p className="text-label-sm font-label-sm text-on-surface-variant/70 uppercase tracking-widest">
                        {type}
                    </p>
                )}
                <h4 className="text-body-lg font-body-lg text-primary font-medium">{title}</h4>
                <p className="text-headline-sm font-headline-sm text-secondary font-semibold mt-1">{price}</p>
                {sizes && sizes.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        {sizes.map((size) => (
                            <span key={size} className="text-[11px] font-label-sm font-bold text-on-surface-variant/80 border border-secondary/20 px-2 py-0.5 rounded-sm hover:border-secondary hover:text-secondary transition-colors">
                                {size}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}