
import React, { useState, useEffect, useMemo } from 'react';
import { Order } from '../../types';
import { fetchAllOrders, updateOrderStatus } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatter';
import { DollarSign, History, Clock, Search, X, User, ShoppingBag, CreditCard, ChevronLeft, ChevronRight, Check, Send } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType, color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-dark/50 backdrop-blur-sm p-6 rounded-xl shadow-lg ring-1 ring-white/10 flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}/10 ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-100">{value}</p>
        </div>
    </div>
);

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statusStyles: { [key in Order['status']]: string } = {
        Pending: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
        Paid: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
        Completed: 'bg-green-500/10 text-green-400 ring-green-500/20',
        Cancelled: 'bg-red-500/10 text-red-400 ring-red-500/20',
        Failed: 'bg-red-800/20 text-red-500 ring-red-800/30'
    };
    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ring-1 ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const OrderDetailPanel: React.FC<{ order: Order | null; onClose: () => void; onStatusChange: (id: string, status: Order['status']) => Promise<void> }> = ({ order, onClose, onStatusChange }) => {
    const [newStatus, setNewStatus] = useState<Order['status']>('Pending');

    useEffect(() => {
        if(order) {
            setNewStatus(order.status);
        }
    }, [order]);
    
    if (!order) return null;
    
    return (
        <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-slate-900/80 backdrop-blur-lg shadow-2xl z-40 transform transition-transform duration-500 ease-in-out ${order ? 'translate-x-0' : 'translate-x-full'}`}>
             <div className="flex flex-col h-full">
                <header className="p-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Order Details</h2>
                        <p className="text-sm text-slate-400 font-mono">#{order.id.substring(0,8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </header>
                
                <main className="flex-1 p-6 overflow-y-auto space-y-6">
                    {/* Customer & Seller Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-slate-300 flex items-center gap-2"><User className="w-4 h-4"/>Buyer</h3>
                            <p className="text-white">{order.user_name}</p>
                            <p className="text-xs text-slate-400 font-mono">{order.user_id}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-slate-300 flex items-center gap-2"><User className="w-4 h-4"/>Seller</h3>
                            <p className="text-white">{order.seller_id}</p>
                            <p className="text-xs text-slate-400 font-mono">{order.seller_id}</p>
                        </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                         <h3 className="font-semibold text-slate-300 flex items-center gap-2 mb-2"><ShoppingBag className="w-4 h-4"/>Product</h3>
                         <div className="flex items-center gap-4">
                             <img src={order.product_id} alt={order.product_name} className="w-16 h-16 rounded-md object-cover bg-slate-700"/>
                             <div>
                                <p className="text-white font-bold">{order.product_name}</p>
                                <p className="text-lg font-semibold text-primary">{formatCurrency(order.price)}</p>
                             </div>
                         </div>
                    </div>

                    {/* Payment Info */}
                     <div className="bg-slate-800/50 p-4 rounded-lg">
                         <h3 className="font-semibold text-slate-300 flex items-center gap-2 mb-2"><CreditCard className="w-4 h-4"/>Payment</h3>
                         <p className="text-white">Paid via <span className="font-semibold">{order.payment_method}</span></p>
                         <p className="text-xs text-slate-400">on {new Date(order.date).toLocaleString()}</p>
                    </div>

                    {/* Activity Log */}
                    <div>
                        <h3 className="font-semibold text-slate-300 mb-2">Activity Log</h3>
                        <ul className="space-y-3">
                            {order.activity_log.map((log, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                                        <Check className="w-3 h-3 text-slate-400"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-200">{log.activity}</p>
                                        <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </main>

                <footer className="p-4 border-t border-slate-800 space-y-4 flex-shrink-0">
                    <div>
                        <label className="text-sm font-semibold text-white">Update Status</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                            className="w-full mt-2 p-2 bg-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Failed">Failed</option>
                        </select>
                         <button
                            onClick={() => onStatusChange(order.id, newStatus)}
                            className="w-full mt-2 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Save Status
                        </button>
                    </div>
                     <div className="flex gap-2">
                          <button className="flex-1 py-2 text-sm text-white bg-slate-600/50 rounded-lg hover:bg-slate-600/80 transition-colors flex items-center justify-center gap-2">
                             <Send className="w-4 h-4" /> Resend Notification
                          </button>
                          <button className="flex-1 py-2 text-sm text-white bg-red-600/50 rounded-lg hover:bg-red-600/80 transition-colors">
                             Refund
                          </button>
                     </div>
                </footer>
             </div>
        </div>
    );
};

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();
    
    // State for filtering and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    // State for detail panel
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const getOrders = async () => {
        try {
            setLoading(true);
            const data = await fetchAllOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to fetch orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            addToast(`Order status updated successfully.`, 'success');
            // Optimistically update the local state for responsiveness
            setOrders(prev => prev.map(o => o.id === orderId ? {...o, status: newStatus} : o));
            if(selectedOrder?.id === orderId) {
                const updatedOrder = await fetchAllOrders().then(all => all.find(o => o.id === orderId));
                setSelectedOrder(updatedOrder || null);
            }
            await getOrders(); // re-fetch to ensure consistency with backend
        } catch(e: any) {
            addToast(`Failed to update status: ${e.message}`, 'error');
        }
    };

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => statusFilter === 'all' || order.status === statusFilter)
            .filter(order => 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                order.user_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [orders, statusFilter, searchTerm]);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

    const summaryStats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const salesToday = orders
            .filter(o => o.status === 'Completed' && o.date.startsWith(today))
            .reduce((sum, o) => sum + o.price, 0);
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        const totalSales = orders
            .filter(o => o.status === 'Completed' || o.status === 'Paid')
            .reduce((sum, o) => sum + o.price, 0);

        return { salesToday, pendingOrders, totalSales };
    }, [orders]);


    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <div className="space-y-6">
            {/* Summary Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Sales" value={formatCurrency(summaryStats.totalSales)} icon={DollarSign} color="text-green-400 bg-green-500" />
                <StatCard title="Sales Today" value={formatCurrency(summaryStats.salesToday)} icon={Clock} color="text-blue-400 bg-blue-500" />
                <StatCard title="Orders Pending" value={summaryStats.pendingOrders} icon={History} color="text-yellow-400 bg-yellow-500"/>
            </div>

            {/* Main Table Area */}
            <div className="bg-dark/50 backdrop-blur-sm shadow-lg rounded-xl ring-1 ring-white/10 overflow-hidden">
                {/* Filters */}
                <div className="p-4 flex flex-col md:flex-row gap-4 border-b border-slate-800">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                        <input
                            type="text"
                            placeholder="Search by Order ID or Buyer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/60 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
                        className="bg-slate-800/60 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>

                 {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-800/60">
                            <tr>
                                <th className="px-6 py-4">Order</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map(order => (
                                <tr key={order.id} onClick={() => setSelectedOrder(order)} className="border-b border-slate-800 hover:bg-slate-500/10 transition-colors duration-200 cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-white">#{order.id.substring(0, 8)}</div>
                                        <div className="text-xs">{new Date(order.date).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-white">{order.user_name}</td>
                                    <td className="px-6 py-4 text-white">{order.product_name}</td>
                                    <td className="px-6 py-4 font-semibold text-primary">{formatCurrency(order.price)}</td>
                                    <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex justify-between items-center text-sm">
                    <span className="text-slate-400">
                        Showing {paginatedOrders.length} of {filteredOrders.length} orders
                    </span>
                    <div className="flex items-center gap-2">
                         <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-slate-700 disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-white font-semibold">{currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-slate-700 disabled:opacity-50">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={handleStatusChange} />
        </div>
    );
};

export default AdminOrders;
