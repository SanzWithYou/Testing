
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, History, Gamepad2, Store, MessageSquare, CheckSquare, ArrowLeft } from '../components/Icons';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: ShoppingBag },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Orders', path: '/admin/orders', icon: History },
        { name: 'Seller Apps', path: '/admin/sellers', icon: CheckSquare },
        { name: 'Seller Products', path: '/admin/seller-products', icon: Store },
        { name: 'Live Chats', path: '/admin/chat', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-dark flex-shrink-0 border-r border-slate-200 dark:border-slate-800">
                <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
                    <NavLink to="/" className="flex items-center gap-2 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        <Gamepad2 className="w-7 h-7 text-primary" />
                        <span>Sanz Store</span>
                    </NavLink>
                </div>
                <nav className="p-4">
                    <ul>
                        {menuItems.map(item => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 my-1 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-primary/10 text-primary font-semibold'
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                        }`
                                    }
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white dark:bg-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
                    <h1 className="text-xl font-bold">
                        {menuItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Admin Panel'}
                    </h1>
                     <NavLink to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Homepage
                    </NavLink>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;