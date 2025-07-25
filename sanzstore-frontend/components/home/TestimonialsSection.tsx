import React, { useState, useEffect } from 'react';
import { Testimonial } from '../../types';
import { fetchTestimonials } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';
import ErrorAlert from '../ErrorAlert';
import { Gamepad2 } from 'lucide-react';

interface TestimonialCardProps {
    testimonial: Testimonial;
    animationDelay: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, animationDelay }) => {
    return (
        <div 
            className="p-8 h-full bg-slate-800/20 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 flex flex-col animate-slide-up"
            style={{animationDelay: `${animationDelay}ms`}}
        >
            <p className="text-slate-300 leading-relaxed flex-grow">"{testimonial.comment}"</p>
            <div className="flex items-center mt-6 pt-6 border-t border-slate-700/50">
                <img src={testimonial.user_avatar_url} alt={testimonial.user_name} className="w-12 h-12 rounded-full object-cover bg-slate-700" />
                <div className="ml-4">
                    <p className="font-bold text-white">{testimonial.user_name}</p>
                    <p className="text-sm text-slate-400 flex items-center gap-1.5">
                        <Gamepad2 className="w-4 h-4 text-primary" />
                        Pembelian Akun {testimonial.game}
                    </p>
                </div>
            </div>
        </div>
    );
};

const TestimonialsSection: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTestimonials = async () => {
            try {
                const data = await fetchTestimonials();
                setTestimonials(data);
            } catch (err) {
                setError('Failed to load testimonials.');
            } finally {
                setLoading(false);
            }
        };
        getTestimonials();
    }, []);

    return (
        <section className="container mx-auto px-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white">Apa Kata Mereka?</h2>
            <p className="text-center text-slate-400 mt-2 mb-12">Pengalaman nyata dari para gamer yang telah bertransaksi di SANZ STORE.</p>
            
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error} />}

            {!loading && !error && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {testimonials.slice(0,4).map((testimonial, index) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} animationDelay={index * 150} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default TestimonialsSection;
