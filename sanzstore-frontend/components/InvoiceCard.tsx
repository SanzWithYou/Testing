
import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatter';

interface InvoiceCardProps {
    product: Product;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ product }) => {
    return (
        <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">Order Summary</h2>
            
            <div className="flex items-center gap-4">
                <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                <div>
                    <h3 className="font-bold text-lg text-white">{product.name}</h3>
                    <p className="text-sm text-slate-400">Sold by {product.seller_name}</p>
                </div>
            </div>

            <div className="border-t border-b border-slate-700 py-4 space-y-2">
                <div className="flex justify-between">
                    <span className="text-slate-400">Price:</span>
                    <span className="text-white font-semibold">{formatCurrency(product.price)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-slate-400">Service Fee:</span>
                    <span className="text-white font-semibold">{formatCurrency(0)}</span>
                </div>
            </div>

            <div className="flex justify-between items-center">
                 <span className="text-xl font-bold text-white">Total:</span>
                 <span className="text-3xl font-extrabold text-primary">{formatCurrency(product.price)}</span>
            </div>
        </div>
    );
};

export default InvoiceCard;
