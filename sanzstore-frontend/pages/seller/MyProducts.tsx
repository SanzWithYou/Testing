
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Product } from '../../types';
import { fetchSellerProducts, deleteProduct } from '../../services/api';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { useToast } from '../../contexts/ToastContext';
import { Edit, Trash2 } from '../../components/Icons';
import { formatCurrency } from '../../utils/formatter';
import { Link } from 'react-router-dom';

const SellerProducts: React.FC = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    const getProducts = async () => {
        if (!user) {
            setError("You must be logged in.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await fetchSellerProducts(user.id);
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch your products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'My Products – Sanz Store';
        getProducts();
    }, [user]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
             try {
                await deleteProduct(id);
                setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
                addToast('Product deleted successfully.', 'success');
             } catch (err: any) {
                addToast(`Failed to delete product: ${err.message}`, 'error');
             }
        }
    };
    
    const columns = [
        { header: 'Name', accessor: 'name' as keyof Product },
        { header: 'Category', accessor: 'category' as keyof Product },
        { header: 'Price', accessor: (item: Product) => formatCurrency(item.price) },
         { 
            header: 'Status', 
            accessor: (item: Product) => {
                const isAvailable = item.status === 'available';
                return <span className={`capitalize px-2 py-1 text-xs font-bold rounded-full ${isAvailable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{item.status}</span>
            }
        },
    ];

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white">My Products</h1>
                <Link to="/sell/add-product" className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:brightness-110 transition-all">
                    + Add Product
                </Link>
            </div>
             <DataTable
                columns={columns}
                data={products}
                actions={(product) => (
                    <>
                        <Link to={`/sell/edit-product/${product.id}`} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            />
        </div>
    );
};

export default SellerProducts;
