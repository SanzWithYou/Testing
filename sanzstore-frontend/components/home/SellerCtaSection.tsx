
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SellerCtaSection: React.FC = () => {
    const { user } = useAuth();

     const getSellLink = () => {
        if (!user) return "/login";
        if (user.roles.includes('seller')) return "/sell/my-products";
        if (user.application_status === 'pending' || user.application_status === 'rejected') return "/sell/status";
        return "/sell/apply";
    }

    return (
        <section className="container mx-auto px-4 animate-fade-in">
            <div className="relative p-10 md:p-16 bg-gradient-to-br from-primary/80 to-secondary/80 rounded-2xl shadow-2xl shadow-primary/30 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-10"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        Punya Akun untuk Dijual?
                    </h2>
                    <p className="max-w-xl mx-auto mt-3 text-slate-200 text-base md:text-lg">
                        Jadilah penjual terpercaya di SANZ STORE dan ubah akun game Anda menjadi penghasilan.
                    </p>
                    <div className="mt-8">
                         <Link
                            to={getSellLink()}
                            className="inline-block bg-white text-primary font-bold text-base px-10 py-3.5 rounded-lg hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Daftar Jadi Penjual
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellerCtaSection;