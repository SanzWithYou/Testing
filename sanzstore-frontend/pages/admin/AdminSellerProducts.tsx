
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { fetchAllAdminProducts, deleteProduct } from '../../services/api'; 
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { useToast } from '../../contexts/ToastContext';
import { Edit, Trash2 } from '../../components/Icons';
import { formatCurrency } from '../../utils/formatter';
import { Link } from 'react-router-dom';

const AdminSellerProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchAllAdminProducts();
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch seller products.');
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

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
        { header: 'ID', accessor: (item: Product) => <span title={item.id} className="font-mono">{item.id.substring(0, 8)}...</span> },
        { header: 'Name', accessor: 'name' as keyof Product },
        { header: 'Seller', accessor: 'seller_name' as keyof Product },
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
        <div>
             <h1 className="text-3xl font-bold text-white mb-6">All Seller Products</h1>
            <DataTable
                columns={columns}
                data={products}
                actions={(product) => (
                    <>
                        <Link to={`/admin/edit-product/${product.id}`} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full transition-colors">
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

export default AdminSellerProducts;
