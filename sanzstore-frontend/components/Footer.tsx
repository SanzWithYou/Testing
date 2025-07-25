import React from 'react';
import { Gamepad2, Github, Twitter, Facebook } from './Icons';

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-dark/50 backdrop-blur-sm border-t border-slate-200/10 mt-16 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-30 animate-aurora"></div>
            <div className="container mx-auto py-8 px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="h-7 w-7 text-primary" />
                        <span className="text-xl font-bold text-slate-200">Sanz Store</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} Sanz Store. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                            <Facebook className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;