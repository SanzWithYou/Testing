import React from 'react';
import { Link } from 'react-router-dom';

const RobloxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M11.972 11.971L36.028 36.029" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 4L9.858 9.858a2 2 0 00-1.023 2.172l3.485 14.112a2 2 0 002.172 1.023L28.604 30.65l7.538-7.539a2 2 0 00.586-1.414L40.142 7.586A2 2 0 0038.414 4H24z" fill="currentColor"/>
    </svg>
);

const MLIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M24 4L4 14l20 10L44 14 24 4z" fill="currentColor" opacity="0.6"/>
        <path d="M4 24l20 10 20-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 14v10l20 10v-10L4 14z" fill="currentColor"/>
        <path d="M44 14v10L24 34v-10l20-10z" fill="currentColor" opacity="0.8"/>
    </svg>
);

const FFIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M24 30c6.627 0 12-5.373 12-12s-5.373-12-12-12-12 5.373-12 12 5.373 12 12 12z" fill="currentColor"/>
        <path d="M24 30c-5.523 0-10 4.477-10 10h20c0-5.523-4.477-10-10-10z" fill="currentColor" opacity="0.6"/>
        <path d="M28 15l-8 6 8 6V15z" fill="white"/>
    </svg>
);


const categories = [
    { name: 'Roblox', icon: RobloxIcon, color: 'text-red-500', shadow: 'hover:shadow-red-500/30', link: '/products?category=roblox' },
    { name: 'Mobile Legends', icon: MLIcon, color: 'text-blue-500', shadow: 'hover:shadow-blue-500/30', link: '/products?category=mlbb' },
    { name: 'Free Fire', icon: FFIcon, color: 'text-orange-500', shadow: 'hover:shadow-orange-500/30', link: '/products?category=ff' },
];

const CategoriesSection: React.FC = () => {
    return (
        <section className="container mx-auto px-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white">Pilih Game Populer</h2>
             <p className="text-center text-slate-400 mt-2 mb-12">Temukan akun impianmu dari game terpanas saat ini.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((cat, index) => (
                    <Link
                        to={cat.link}
                        key={cat.name}
                        className={`group relative p-8 bg-slate-800/20 backdrop-blur-md rounded-xl shadow-lg ring-1 ring-white/10 ${cat.shadow} transition-all duration-300 ease-in-out transform hover:-translate-y-2 overflow-hidden animate-slide-up`}
                        style={{animationDelay: `${index * 150}ms`}}
                    >
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className={`p-4 rounded-full bg-slate-900/50 mb-4 transition-all duration-300 group-hover:scale-110 ${cat.color}`}>
                                <cat.icon />
                            </div>
                            <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                            <p className="text-slate-400 mt-1">Jelajahi Akun</p>
                        </div>
                         {/* Glow effect */}
                        <div className={`absolute -inset-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${cat.color} blur-xl`}></div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;
