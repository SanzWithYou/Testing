
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { fetchProductById } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { Store } from '../components/Icons';
import { formatCurrency } from '../utils/formatter';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const getProduct = async () => {
            if (!id) {
                setError('Product ID is missing.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await fetchProductById(id);
                setProduct(data);
                if (data) {
                    document.title = `${data.name} – Sanz Store`;
                } else {
                    document.title = `Product Not Found – Sanz Store`;
                }
            } catch (err) {
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;
    if (!product) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <h1 className="text-4xl font-bold text-white">Product Not Found</h1>
                <p className="mt-4 text-slate-400">The product you are looking for does not exist or has been sold.</p>
                <Link to="/products" className="mt-6 inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-3 rounded-lg hover:brightness-110">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 p-6 md:p-8 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                <div className="animate-zoom-in">
                    <img src={product.image_url} alt={product.name} className="w-full h-auto rounded-lg object-cover shadow-lg" />
                </div>
                <div className="flex flex-col animate-slide-up" style={{animationDelay: '0.2s'}}>
                    <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full self-start">{product.category}</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold mt-4 text-white">{product.name}</h1>
                    
                    <div className="flex items-center gap-2 mt-2 text-slate-400">
                        <Store className="w-4 h-4" />
                        <span>Sold by <span className="font-semibold text-slate-300">{product.seller_name}</span></span>
                    </div>

                    <p className="text-4xl font-black text-primary mt-4">{formatCurrency(product.price)}</p>

                    <div className="mt-6 border-t border-slate-700 pt-6">
                        <h2 className="text-xl font-bold mb-2 text-white">Description</h2>
                        <p className="text-slate-300 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="mt-auto pt-6">
                        {product.status === 'available' ? (
                             <Link 
                                to={`/checkout/${product.id}`}
                                className="w-full text-center block bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-6 rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/80 dark:focus:ring-offset-slate-900"
                            >
                                Go to Checkout
                            </Link>
                        ) : (
                             <div className="w-full text-center bg-red-500/20 text-red-300 font-bold py-4 px-6 rounded-lg">
                                This account has been sold.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
