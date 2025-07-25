

import React, { useState, Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Gamepad2, Menu, X, LayoutDashboard, LogOut, ChevronDown, UserCircle, Store, ShoppingBag, MessageSquare, PlusCircle } from './Icons';

// A simple dropdown component for the user menu
const Dropdown: React.FC<{ button: React.ReactNode, children: React.ReactNode }> = ({ button, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative" onMouseLeave={() => setIsOpen(false)}>
            <button onMouseEnter={() => setIsOpen(true)} className="flex items-center">
                {button}
            </button>
            {isOpen && (
                <div
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-slate-800/90 backdrop-blur-md shadow-lg ring-1 ring-white/10 focus:outline-none animate-fade-in"
                    style={{ animationDuration: '0.2s' }}
                >
                    <div className="py-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};


const Navbar: React.FC = () => {
    const [isMobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const commonLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
    ];

    const getRoleSpecificLinks = (isMobile: boolean) => {
        const linkClass = isMobile
            ? "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200"
            : "block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-primary/20 hover:text-white flex items-center gap-3 transition-colors duration-200";

        if (!user) return [];

        let links = [
            { name: 'My Dashboard', path: '/dashboard', icon: UserCircle },
            { name: 'My Orders', path: '/orders', icon: ShoppingBag },
            { name: 'My Chats', path: '/chat', icon: MessageSquare },
        ];

        if (user.roles.includes('seller')) {
            links.push(
                ...[
                    { name: 'Seller: My Products', path: '/sell/my-products', icon: Store },
                    { name: 'Seller: Add Product', path: '/sell/add-product', icon: PlusCircle }
                ]
            );
        } else if (user.application_status === 'none' || user.application_status === 'rejected') {
            links.push({ name: 'Become a Seller', path: '/sell/apply', icon: Store });
        } else if (user.application_status === 'pending') {
             links.push({ name: 'Seller Application', path: '/sell/status', icon: Store });
        }
        
        return links.map(link => (
             <NavLink key={link.path} to={link.path} className={linkClass}>
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
            </NavLink>
        ));
    }


    const NavLinks: React.FC<{isMobile?: boolean}> = ({ isMobile = false }) => {
        const linkClass = "px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:text-white transition-colors";
        const activeLinkClass = "text-primary";

        return (
            <>
                {commonLinks.map(link => (
                    <NavLink key={link.name} to={link.path} className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`} end>
                        {link.name}
                    </NavLink>
                ))}
            </>
        );
    };


    return (
        <nav className="bg-dark/70 backdrop-blur-md shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 text-white text-xl font-bold">
                        <Gamepad2 className="h-8 w-8 text-primary"/>
                        <span className="font-black">Sanz Store</span>
                    </NavLink>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLinks />
                        {user ? (
                            <Dropdown button={
                                <span className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                                    {user.name}
                                    <ChevronDown className="w-4 h-4" />
                                </span>
                            }>
                                {getRoleSpecificLinks(false)}
                                <hr className="border-slate-700 my-1"/>
                                {user.roles.includes('admin') && (
                                     <NavLink to="/admin" className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-primary/20 hover:text-white flex items-center gap-3 transition-colors duration-200">
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span>Admin Panel</span>
                                     </NavLink>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-red-500/30 hover:text-white flex items-center gap-3 transition-colors duration-200">
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </Dropdown>
                        ) : (
                            <>
                                <NavLink to="/login" className="px-3 py-2 rounded-md text-sm font-semibold text-slate-300 hover:text-white transition-colors">Login</NavLink>
                                <NavLink to="/register" className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition-all">
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setMobileOpen(!isMobileOpen)}
                            type="button"
                            className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                       {commonLinks.map(link => (
                            <NavLink key={link.path} to={link.path} end className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200 ${isActive ? 'bg-slate-900 !text-white' : ''}`}>
                                {link.name}
                            </NavLink>
                       ))}
                    </div>
                    {user ? (
                        <div className="pt-4 pb-3 border-t border-slate-700">
                           <div className="flex items-center px-5 mb-3">
                                <div className="ml-3">
                                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                    <div className="text-sm font-medium leading-none text-slate-400">{user.email}</div>
                                </div>
                            </div>
                            <div className="px-2 space-y-1">
                                {getRoleSpecificLinks(true)}
                                <hr className="border-slate-700 my-1"/>
                                {user.roles.includes('admin') && (
                                     <NavLink to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200">
                                        <LayoutDashboard className="w-5 h-5" /> Admin Panel
                                     </NavLink>
                                )}
                                <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-red-500/30 transition-colors duration-200">
                                  <LogOut className="h-5 w-5" />  Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
                            <NavLink to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors duration-200">Login</NavLink>
                            <NavLink to="/register" className="block w-full text-left mt-2 px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-primary to-secondary">
                                Register
                            </NavLink>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;