

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { fetchUserOrders } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { Link } from 'react-router-dom';
import { Store } from '../components/Icons';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'My Dashboard – Sanz Store';
        const loadDashboardData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const userOrders = await fetchUserOrders(user.id);
                setOrders(userOrders);
            } catch (err) {
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user]);

    const renderSellerInfo = () => {
        if (!user) return null;

        if (user.roles.includes('seller')) {
            return (
                 <div className="p-6 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10">
                    <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2"><Store/>Seller Dashboard</h2>
                    <p className="text-slate-300 mb-4">Manage your products and view your sales.</p>
                    <div className="flex gap-4">
                        <Link to="/sell/my-products" className="bg-primary/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary transition-colors">My Products</Link>
                        <Link to="/sell/add-product" className="bg-secondary/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary transition-colors">Add New Product</Link>
                    </div>
                </div>
            )
        }

        switch (user.application_status) {
            case 'pending':
                return (
                     <div className="p-6 bg-yellow-500/10 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-yellow-400/20">
                        <h2 className="text-2xl font-bold mb-2 text-yellow-300">Seller Application Pending</h2>
                        <p className="text-yellow-400 mb-4">Your application to become a seller is currently under review. We'll notify you soon!</p>
                        <Link to="/sell/status" className="text-yellow-200 font-semibold hover:underline">Check Status</Link>
                    </div>
                )
            case 'none':
            case 'rejected':
                 return (
                     <div className="p-6 bg-primary/10 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-primary/20">
                        <h2 className="text-2xl font-bold mb-2 text-primary">Become a Seller!</h2>
                        <p className="text-slate-300 mb-4">Have game accounts you want to sell? Join our marketplace and start earning today.</p>
                        <Link to="/sell/apply" className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-3 rounded-lg hover:brightness-110">Apply Now</Link>
                    </div>
                )
            default:
                return null;
        }
    }
    
    const RoleBadge: React.FC<{role: string}> = ({role}) => {
        let colorClass = 'bg-slate-700 text-slate-300';
        if (role === 'admin') colorClass = 'bg-primary/20 text-primary';
        if (role === 'seller') colorClass = 'bg-green-500/20 text-green-400';
        return <span className={`capitalize font-semibold px-2 py-1 rounded-full text-xs ${colorClass}`}>{role}</span>
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;
    if (!user) return <ErrorAlert message="You must be logged in to view this page." />;

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Welcome, <span className="text-primary">{user.name}</span>!</h1>

            <div className="p-6 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10">
                <h2 className="text-2xl font-bold mb-4 text-white">Account Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <p className="text-slate-300"><strong>Email:</strong> {user.email}</p>
                    <div className="text-slate-300 flex items-center gap-2"><strong>Roles:</strong> <div className="flex gap-2">{user.roles.map(r => <RoleBadge key={r} role={r} />)}</div></div>
                    {user.roles.includes('seller') && <p className="text-slate-300"><strong>Store:</strong> {user.store_name}</p>}
                </div>
            </div>
            
            {renderSellerInfo()}
            
            <div className="p-6 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10">
                <h2 className="text-2xl font-bold mb-4 text-white">Recent Order Summary</h2>
                {orders.length > 0 ? (
                    <ul className="space-y-2">
                        {orders.slice(0, 5).map(order => (
                             <li key={order.id} className="flex justify-between items-center p-3 rounded-md hover:bg-slate-700/50">
                                <span className="text-white">{order.product_name}</span>
                                <span className={`text-sm font-bold px-2 py-1 rounded-full ${order.status === 'Completed' || order.status === 'Paid' ? 'bg-green-500/10 text-green-400' : order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {order.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-400">You have no recent orders.</p>
                )}
                 <Link to="/orders" className="text-primary hover:underline mt-4 inline-block">View all orders</Link>
            </div>
        </div>
    );
};

export default Dashboard;