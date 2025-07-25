

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchSellerApplication } from '../../services/api';
import { SellerApplication } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { Link } from 'react-router-dom';

const SellerStatus: React.FC = () => {
    const { user } = useAuth();
    const [application, setApplication] = useState<SellerApplication | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        document.title = 'Seller Application Status – Sanz Store';
        const getStatus = async () => {
            if (!user) {
                 setError("You must be logged in to view this page.");
                 setLoading(false);
                 return;
            }
             try {
                 const data = await fetchSellerApplication(user.id);
                 setApplication(data);
             } catch (err) {
                 setError("Could not retrieve application status.");
             } finally {
                 setLoading(false);
             }
         };
         getStatus();
     }, [user]);

    const renderStatus = () => {
        if (loading) return <LoadingSpinner />;
        if (error) return <ErrorAlert message={error} />;
        
        // Use the context user status first for immediate feedback after approval
        const status = user?.roles.includes('seller') ? 'approved' : application?.status;
        
        if (!application && !user?.roles.includes('seller')) {
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">No Application Found</h2>
                    <p className="text-slate-400 mt-2">It looks like you haven't applied to be a seller yet.</p>
                    <Link to="/sell/apply" className="mt-6 inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-3 rounded-lg hover:brightness-110">
                        Apply Now
                    </Link>
                </div>
            );
        }

        switch (status) {
            case 'pending':
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-yellow-300">Application Pending</h2>
                        <p className="text-slate-300 mt-2">Your application to open "{application?.store_name}" is under review.</p>
                        <p className="text-slate-400 mt-1">We'll notify you via email once a decision has been made.</p>
                    </div>
                );
            case 'approved':
                return (
                     <div className="text-center">
                        <h2 className="text-3xl font-bold text-green-400">Congratulations! You're a Seller!</h2>
                        <p className="text-slate-300 mt-2">Your application for "{application?.store_name || user?.store_name}" has been approved.</p>
                        <p className="text-slate-400 mt-1">You can now start listing your products for sale.</p>
                        <Link to="/sell/add-product" className="mt-6 inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-6 py-3 rounded-lg hover:brightness-110">
                            List Your First Product
                        </Link>
                    </div>
                );
            case 'rejected':
                return (
                     <div className="text-center">
                        <h2 className="text-3xl font-bold text-red-400">Application Update</h2>
                        <p className="text-slate-300 mt-2">Unfortunately, your application for "{application?.store_name}" was not approved at this time.</p>
                        {application?.rejection_reason && <p className="mt-4 p-3 bg-red-900/40 rounded-md text-red-300">Reason: <span className="italic">{application.rejection_reason}</span></p>}
                         <Link to="/dashboard" className="mt-6 inline-block bg-slate-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-600">
                            Back to Dashboard
                        </Link>
                    </div>
                );
            default:
                 return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">No Application Found</h2>
                        <p className="text-slate-400 mt-2">It looks like you haven't applied to be a seller yet.</p>
                        <Link to="/sell/apply" className="mt-6 inline-block bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-3 rounded-lg hover:brightness-110">
                            Apply Now
                        </Link>
                    </div>
                 );
        }
    };

    return (
         <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-white">Application Status</h1>
            <div className="p-8 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in">
                {renderStatus()}
            </div>
        </div>
    )
};

export default SellerStatus;