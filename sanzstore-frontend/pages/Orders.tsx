

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { fetchUserOrders } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/formatter';
import { useToast } from '../contexts/ToastContext';
import { KeyRound, Copy, Eye, EyeOff, CheckCircle, AlertTriangle } from '../components/Icons';

const Orders: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();

    // State for credentials modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.title = 'My Orders – Sanz Store';
        const getOrders = async () => {
            if (!user) {
                setError("You must be logged in to view orders.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await fetchUserOrders(user.id);
                setOrders(data);
            } catch (err) {
                setError("Failed to fetch your orders.");
            } finally {
                setLoading(false);
            }
        };
        getOrders();
    }, [user]);

    const handleViewCredentials = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        setShowPassword(false);
    };

    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        addToast(`${fieldName} copied to clipboard!`, 'success');
    };

    const columns = [
        { header: 'Order ID', accessor: (item: Order) => <span className="font-mono text-slate-300">#{item.id.substring(0,8)}</span> },
        { header: 'Product Name', accessor: 'product_name' as keyof Order },
        { header: 'Date', accessor: (item: Order) => new Date(item.date).toLocaleDateString() },
        { header: 'Price', accessor: (item: Order) => <span className="font-semibold text-primary">{formatCurrency(item.price)}</span> },
        { 
            header: 'Status', 
            accessor: (item: Order) => {
                let colorClass = '';
                switch(item.status) {
                    case 'Completed':
                    case 'Paid':
                         colorClass = 'bg-green-500/10 text-green-400'; break;
                    case 'Pending': colorClass = 'bg-yellow-500/10 text-yellow-400'; break;
                    case 'Failed':
                    case 'Cancelled': colorClass = 'bg-red-500/10 text-red-400'; break;
                }
                return <span className={`px-2 py-1 text-xs font-bold rounded-full ${colorClass}`}>{item.status}</span>
            }
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">My Orders</h1>
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error} />}
            {!loading && !error && (
                <DataTable 
                    columns={columns} 
                    data={orders}
                    actions={(order) => (
                        (order.status === 'Paid' || order.status === 'Completed') && order.account_username && (
                             <button
                                onClick={() => handleViewCredentials(order)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-secondary/80 rounded-md hover:bg-secondary transition-colors"
                            >
                                <KeyRound className="w-4 h-4" />
                                Credentials
                            </button>
                        )
                    )}
                />
            )}

            {/* View Credentials Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Account Credentials">
                {selectedOrder && (
                    <div className="space-y-4">
                        <p className="text-slate-400 text-sm">
                            These are the credentials for the account you purchased: <span className="font-bold text-slate-300">{selectedOrder.product_name}</span>.
                            Please change the password immediately for your security.
                        </p>
                        
                        {/* Username */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 block">Username</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="text"
                                    readOnly
                                    value={selectedOrder.account_username}
                                    className="w-full p-2 bg-slate-700/50 rounded-lg text-white font-mono ring-1 ring-slate-700"
                                />
                                <button
                                    onClick={() => copyToClipboard(selectedOrder.account_username || '', 'Username')}
                                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                    title="Copy Username"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 block">Password</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    readOnly
                                    value={selectedOrder.account_password}
                                    className="w-full p-2 bg-slate-700/50 rounded-lg text-white font-mono ring-1 ring-slate-700"
                                />
                                 <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                    title={showPassword ? 'Hide Password' : 'Show Password'}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => copyToClipboard(selectedOrder.account_password || '', 'Password')}
                                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                                    title="Copy Password"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Email Verification Status */}
                        <div>
                           <div className="flex items-center gap-2 mt-2">
                               {selectedOrder.is_email_verified ? (
                                   <>
                                     <CheckCircle className="w-5 h-5 text-green-400" />
                                     <span className="text-sm text-green-400">Email is verified</span>
                                   </>
                               ) : (
                                   <>
                                     <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                     <span className="text-sm text-yellow-400">Email is not verified</span>
                                   </>
                               )}
                           </div>
                        </div>


                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-white bg-slate-600/80 rounded-lg hover:bg-slate-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;