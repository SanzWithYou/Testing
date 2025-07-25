import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { fetchProductById, createOrder } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import InvoiceCard from '../components/InvoiceCard';
import { formatCurrency } from '../utils/formatter';

const Checkout: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [product, setProduct] = useState<Product | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Checkout – Sanz Store';
        const getProduct = async () => {
            if (!productId) {
                setError('Product ID is missing.');
                setLoading(false);
                return;
            }
            try {
                const data = await fetchProductById(productId);
                if (data && data.status === 'available') {
                    setProduct(data);
                } else {
                    setError('This product is not available for purchase.');
                }
            } catch (err) {
                setError('Failed to load product details for checkout.');
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [productId]);

    const handlePayment = async () => {
        if (!user || !product) return;
        setProcessing(true);
        try {
            await createOrder(product, user);
            addToast('Payment successful! Your order has been placed.', 'success');
            navigate('/orders');
        } catch (err: any) {
            addToast(`Payment failed: ${err.message}`, 'error');
            setProcessing(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;
    if (!product) return <ErrorAlert message="This product could not be found." />;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-white">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <InvoiceCard product={product} />
                </div>
                <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-white">Payment Method</h2>
                    <p className="text-slate-400 text-center text-sm">In a real app, a payment gateway like Midtrans or Xendit would be integrated here.</p>
                     <div className="space-y-3">
                        <label className="flex items-center p-4 rounded-lg bg-slate-700/50 ring-2 ring-primary cursor-pointer">
                            <input type="radio" name="payment" className="form-radio h-5 w-5 text-primary bg-slate-800 border-slate-600 focus:ring-primary" defaultChecked />
                            <span className="ml-4 text-white font-semibold">Simulated Payment</span>
                        </label>
                         <label className="flex items-center p-4 rounded-lg bg-slate-700/50 ring-1 ring-slate-700 cursor-not-allowed opacity-50">
                            <input type="radio" name="payment" className="form-radio h-5 w-5 text-primary bg-slate-800 border-slate-600" disabled/>
                            <span className="ml-4 text-slate-500 font-semibold">Credit Card (Disabled)</span>
                        </label>
                    </div>
                     <button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Processing...' : `Confirm & Pay ${formatCurrency(product.price)}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;