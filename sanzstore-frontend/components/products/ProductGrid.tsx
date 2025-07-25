
import React from 'react';
import { Product } from '../../types';
import ProductCard from '../ProductCard';

const SkeletonCard: React.FC = () => (
    <div className="animate-pulse bg-slate-800/20 backdrop-blur-md rounded-xl p-4 ring-1 ring-white/10">
        <div className="h-48 bg-slate-700/50 rounded-lg"></div>
        <div className="mt-4 h-6 w-3/4 bg-slate-700/50 rounded"></div>
        <div className="mt-2 h-4 w-1/2 bg-slate-700/50 rounded"></div>
        <div className="mt-4 h-10 w-full bg-slate-700/50 rounded-lg"></div>
    </div>
);

interface ProductGridProps {
    products: Product[];
    loading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
        );
    }
    
    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-dark/50 rounded-xl">
                <h3 className="text-2xl font-bold text-white">No Products Found</h3>
                <p className="text-slate-400 mt-2">Try adjusting your search or filter criteria.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} animationDelay={index * 50} />
            ))}
        </div>
    );
};

export default ProductGrid;
