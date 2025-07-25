
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection: React.FC = () => {
    const { user } = useAuth();
    
    const getSellLink = () => {
        if (!user) return "/login";
        if (user.roles.includes('seller')) return "/sell/my-products";
        if (user.application_status === 'pending' || user.application_status === 'rejected') return "/sell/status";
        return "/sell/apply";
    }

    return (
        <section className="relative text-center py-24 md:py-40 px-4 -mx-4 -mt-8 overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-20"
                poster="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-space-travel-in-a-seamless-loop-42953-large.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay and Glow Effect */}
            <div className="absolute inset-0 bg-dark/60 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/20 z-10"></div>
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/30 via-secondary/30 to-neon-pink/30 opacity-40 animate-aurora blur-3xl z-10"></div>

            <div className="relative z-20 animate-fade-in space-y-5">
                <h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white animate-slide-up"
                    style={{textShadow: '0 4px 20px rgba(0,0,0,0.5)'}}
                >
                    Jual Beli Akun Game Favoritmu
                    <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-neon-blue">Aman & Cepat</span>
                </h1>
                <p 
                    className="max-w-2xl mx-auto text-base md:text-lg text-slate-300 animate-slide-up" 
                    style={{animationDelay: '0.2s'}}
                >
                    Jelajahi ribuan akun game terverifikasi dari Roblox, Mobile Legends, hingga Free Fire di marketplace paling terpercaya.
                </p>
                <div 
                    className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up" 
                    style={{animationDelay: '0.4s'}}
                >
                    <Link
                        to="/products"
                        className="w-full sm:w-auto inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold text-base px-8 py-3.5 rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105"
                    >
                        Jelajahi Akun
                    </Link>
                    <Link
                        to={getSellLink()}
                        className="w-full sm:w-auto inline-block bg-slate-700/50 text-white font-bold text-base px-8 py-3.5 rounded-lg ring-1 ring-slate-600 hover:bg-slate-700/80 transition-all duration-300 transform hover:scale-105"
                    >
                        Mulai Jual
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;