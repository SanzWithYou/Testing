import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-dark bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-[#0f172a]">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in" style={{ animationDuration: '0.4s' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default BaseLayout;