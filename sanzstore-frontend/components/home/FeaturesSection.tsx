import React from 'react';
import { ShieldCheck, Wallet, MessageSquare, BadgeCheck } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: 'Escrow System Aman',
        description: 'Dana Anda ditahan dengan aman oleh sistem kami sampai transaksi selesai dan akun terverifikasi oleh Anda.',
    },
    {
        icon: Wallet,
        title: 'Dompet Digital Terintegrasi',
        description: 'Lakukan penarikan dan deposit dengan mudah melalui dompet SANZ STORE yang cepat dan andal.',
    },
    {
        icon: MessageSquare,
        title: 'Chat Langsung ke Penjual',
        description: 'Negosiasi dan tanyakan detail akun langsung dengan penjual melalui fitur chat terenkripsi kami.',
    },
    {
        icon: BadgeCheck,
        title: 'Verifikasi Keamanan Akun',
        description: 'Setiap akun melewati proses verifikasi untuk memastikan tidak ada masalah kepemilikan atau binding.',
    }
];

const FeaturesSection: React.FC = () => {
    return (
        <section className="container mx-auto px-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white">Kenapa Memilih SANZ STORE?</h2>
            <p className="text-center text-slate-400 mt-2 mb-12">Kami menyediakan platform yang tidak hanya cepat, tapi juga super aman.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <div 
                        key={feature.title} 
                        className="p-8 bg-slate-800/20 backdrop-blur-md rounded-xl ring-1 ring-white/10 animate-slide-up text-center"
                        style={{animationDelay: `${index * 150}ms`}}
                    >
                        <div className="inline-block p-4 bg-primary/10 text-primary rounded-full mb-4">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
