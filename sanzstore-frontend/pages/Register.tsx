// 📁 sanzstore-frontend/src/components/auth/Register.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { signUp as apiSignUp } from '../services/api';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // --- PERBAIKAN: Ubah nama state ini ---
    const [passwordConfirmation, setPasswordConfirmation] = useState(''); // sebelumnya confirmPassword
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    React.useEffect(() => {
        document.title = 'Register – Sanz Store';
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // --- PERBAIKAN: Gunakan nama state yang baru untuk validasi frontend ---
        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            // --- PERBAIKAN: Kirimkan dengan nama field yang Laravel harapkan ---
            await apiSignUp({ 
                name, 
                email, 
                password, 
                password_confirmation: passwordConfirmation // <--- KUNCI PENTING DI SINI
            });
            addToast('Registration successful! Please check your email for verification before logging in.', 'success');
            navigate('/login');
        } catch (err: any) {
             // Improved error handling for Laravel validation
            let errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
            
            // Handle specific validation errors if they exist
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0] as string[];
                errorMessage = firstError[0];
            }

            setError(errorMessage);
            addToast(`Registration failed: ${errorMessage}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-white">Create a New Account</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="name" className="text-sm font-bold text-slate-300 block">Full Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" placeholder="John Doe" required />
                    </div>
                    <div>
                        <label htmlFor="email-register" className="text-sm font-bold text-slate-300 block">Email Address</label>
                        <input id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label htmlFor="password-register" className="text-sm font-bold text-slate-300 block">Password</label>
                        <input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" placeholder="••••••••" required />
                    </div>
                    <div>
                        {/* --- PERBAIKAN: Ubah htmlFor pada label dan id pada input --- */}
                        <label htmlFor="password_confirmation" className="text-sm font-bold text-slate-300 block">Confirm Password</label>
                        <input 
                            id="password_confirmation" // <--- UBAH INI
                            type="password" 
                            value={passwordConfirmation} // <--- GUNAKAN NAMA STATE YANG BARU
                            onChange={(e) => setPasswordConfirmation(e.target.value)} // <--- GUNAKAN NAMA STATE YANG BARU
                            className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" 
                            placeholder="••••••••" 
                            required 
                        />
                    </div>
                    <div>
                        <button type="submit" disabled={loading} className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;