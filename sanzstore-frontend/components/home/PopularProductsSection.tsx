
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { fetchProducts } from '../../services/api';
import ProductCard from '../ProductCard';
import LoadingSpinner from '../LoadingSpinner';
import ErrorAlert from '../ErrorAlert';

const PopularProductsSection: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response.data.slice(0, 4)); // Show first 4
            } catch (err) {
                setError('Failed to load popular products.');
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    return (
        <section className="container mx-auto px-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white">Akun Terpopuler Minggu Ini</h2>
            <p className="text-center text-slate-400 mt-2 mb-12">Akun-akun pilihan yang paling banyak dicari oleh para gamer.</p>
            
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error} />}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} animationDelay={index * 100} />
                    ))}
                </div>
            )}

            <div className="text-center mt-12">
                <Link
                    to="/products"
                    className="inline-block bg-primary/80 text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary transition-colors duration-300"
                >
                    Lihat Semua Akun
                </Link>
            </div>
        </section>
    );
};

export default PopularProductsSection;
