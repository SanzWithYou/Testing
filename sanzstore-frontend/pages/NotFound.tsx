import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    React.useEffect(() => {
        document.title = '404 Not Found – Sanz Store';
    }, []);
    return (
        <div className="text-center py-20 animate-fade-in">
            <h1 className="text-8xl font-black text-primary">404</h1>
            <h2 className="text-4xl font-bold mt-4 text-white">Page Not Found</h2>
            <p className="mt-4 text-slate-400">
                Sorry, the page you are looking for could not be found.
            </p>
            <Link
                to="/"
                className="mt-8 inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold px-8 py-3 rounded-lg hover:brightness-110 transition-transform transform hover:scale-105"
            >
                Return to Homepage
            </Link>
        </div>
    );
};

export default NotFound;