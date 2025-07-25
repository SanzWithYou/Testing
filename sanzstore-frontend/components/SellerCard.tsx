
import React from 'react';
import { SellerApplication } from '../types';
import { CheckCircle, XCircle } from './Icons';

interface SellerCardProps {
    application: SellerApplication;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isProcessing: boolean;
}

const SellerCard: React.FC<SellerCardProps> = ({ application, onApprove, onReject, isProcessing }) => {
    return (
        <div className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 ring-1 ring-white/10">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">{application.store_name}</h3>
                    <p className="text-sm text-slate-400">by {application.user_name} ({application.user_email})</p>
                    <p className="text-xs text-slate-500 mt-1">Submitted: {new Date(application.submitted_at).toLocaleDateString()}</p>
                </div>
                 <span className={`capitalize px-2 py-1 text-xs font-bold rounded-full bg-yellow-500/10 text-yellow-400`}>
                    {application.status}
                </span>
            </div>
            <p className="mt-4 text-slate-300 italic">"{application.description}"</p>
            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={() => onReject(application.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600/80 rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                    Reject
                </button>
                <button
                    onClick={() => onApprove(application.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600/80 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                    Approve
                </button>
            </div>
        </div>
    );
};

export default SellerCard;