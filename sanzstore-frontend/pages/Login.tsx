import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const { login } = useAuth();

    useEffect(() => {
        document.title = 'Login – Sanz Store';
    }, []);

   // ... (tetap sama di atas)

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
        setError('Please fill in all fields.');
        return;
    }
    setLoading(true);

    try {
        await login({ email, password });
        addToast(`Login successful! Welcome back.`, 'success');

    } catch (err: any) {
        const message = err.response?.data?.message || 'Invalid email or password.';
        let fullError = message;

        if (err.response?.data?.errors) {
            const firstError = Object.values(err.response.data.errors)[0] as string[];
            fullError = firstError[0];
        }

        setError(fullError);
        addToast(`Login failed: ${fullError}`, 'error');
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in">
                <h2 className="text-3xl font-bold text-center text-white">Login to Your Account</h2>
                <p className="text-center text-slate-400 text-sm">Use admin@sanz.com, seller@sanz.com, or user@sanz.com with password `password`.</p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-slate-300 block">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-slate-300 block">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;