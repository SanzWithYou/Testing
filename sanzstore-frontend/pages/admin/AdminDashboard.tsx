
import React, { useState, useEffect } from 'react';
import { fetchAdminStats } from '../../services/api';
import { Users, ShoppingBag, History } from '../../components/Icons';
import LoadingSpinner from '../../components/LoadingSpinner';

const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-dark/50 backdrop-blur-sm p-6 rounded-xl shadow-lg ring-1 ring-white/10 flex items-center gap-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            <p className="text-3xl font-bold text-slate-100">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStats = async () => {
            try {
                const data = await fetchAdminStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        getStats();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={stats.users} icon={Users} />
                <StatCard title="Total Products" value={stats.products} icon={ShoppingBag} />
                <StatCard title="Total Transactions" value={stats.orders} icon={History} />
            </div>
            {/* Can add charts or recent activity here later */}
            <div className="bg-dark/50 backdrop-blur-sm p-6 rounded-xl shadow-lg ring-1 ring-white/10">
                 <h2 className="text-xl font-bold text-white">Welcome, Admin!</h2>
                 <p className="text-slate-400 mt-2">Here's a quick overview of your marketplace. Use the sidebar to manage products, users, and orders.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
