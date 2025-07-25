
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Eye, Star, Heart } from './Icons';
import { formatCurrency } from '../utils/formatter';

interface ProductCardProps {
    product: Product;
    animationDelay?: number;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                />
            ))}
            <span className="text-xs text-slate-400 ml-1.5">({rating.toFixed(1)})</span>
        </div>
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, animationDelay = 0 }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    return (
        <div 
            className="group animate-zoom-in bg-slate-800/20 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 hover:ring-primary/50 transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30"
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            <div className="relative overflow-hidden">
                <Link to={`/product/${product.id}`}>
                    <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </Link>
                <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{product.category}</span>
                 <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-3 right-3 p-2 bg-slate-900/50 rounded-full text-white hover:text-red-500 transition-colors"
                    aria-label="Add to wishlist"
                >
                    <Heart className={`w-5 h-5 transition-all ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-300'}`} />
                </button>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-xs text-slate-400">{product.sub_category}</p>
                
                <div className="flex items-center justify-between mt-2 text-sm text-slate-400">
                     <p>
                        By <span className="font-semibold text-slate-300 hover:underline">{product.seller_name}</span>
                    </p>
                    <StarRating rating={product.seller_rating} />
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex-grow flex flex-col justify-end">
                    <p className="text-2xl font-black text-primary mb-4">
                        {formatCurrency(product.price)}
                    </p>

                    <Link
                        to={`/product/${product.id}`}
                        className="w-full bg-primary/80 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 ring-1 ring-primary/50 hover:bg-primary focus:outline-none transition-all duration-300 ease-in-out"
                    >
                        <Eye className="w-5 h-5" />
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;