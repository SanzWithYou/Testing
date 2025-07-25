
import React, { useState, useEffect } from 'react';
import { SellerApplication } from '../../types';
import { fetchAllSellerApplications, manageSellerApplication } from '../../services/api';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, Eye, X, Mail, Phone, Wallet, Gamepad2, Link as LinkIcon, Download } from '../../components/Icons'; 
import Modal from '../../components/Modal';

const DetailItem: React.FC<{ icon: React.ElementType, label: string, value?: string | string[] | null }> = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                {Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {value.map(item => <span key={item} className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">{item}</span>)}
                    </div>
                ) : (
                    <p className="text-white font-semibold">{value}</p>
                )}
            </div>
        </div>
    );
};


const AdminSellers: React.FC = () => {
    const [applications, setApplications] = useState<SellerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const { addToast } = useToast();
    const { refreshUser } = useAuth();

    // State for modals
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<SellerApplication | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const getApplications = async () => {
        try {
            const data = await fetchAllSellerApplications();
            setApplications(data);
        } catch (err: any) {
            setError(`Failed to fetch seller applications: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getApplications();
    }, []);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await manageSellerApplication(id, 'approved');
            addToast(`Application has been approved.`, 'success');
            await getApplications();
            await refreshUser();
        } catch (err: any) {
            addToast(`Failed to approve application: ${err.message}`, 'error');
        } finally {
            setProcessingId(null);
        }
    };
    
    const openRejectModal = (app: SellerApplication) => {
        setSelectedApp(app);
        setIsRejectModalOpen(true);
        setRejectionReason('');
    };
    
    const openDetailsModal = (app: SellerApplication) => {
        setSelectedApp(app);
        setIsDetailsModalOpen(true);
    };

    const handleReject = async () => {
        if (!selectedApp) return;
        setProcessingId(selectedApp.id);
        setIsRejectModalOpen(false);
        try {
            await manageSellerApplication(selectedApp.id, 'rejected', rejectionReason);
            addToast(`Application has been rejected.`, 'success');
            await getApplications();
            await refreshUser();
        } catch(err: any) {
            addToast(`Failed to reject application: ${err.message}`, 'error');
        } finally {
            setProcessingId(null);
            setSelectedApp(null);
        }
    };
    
    const columns = [
        { header: 'Store Name', accessor: 'store_name' as keyof SellerApplication },
        { header: 'Applicant', accessor: 'user_name' as keyof SellerApplication },
        { header: 'Submitted', accessor: (item: SellerApplication) => new Date(item.submitted_at).toLocaleDateString() },
        { 
            header: 'Status', 
            accessor: (item: SellerApplication) => {
                 let colorClass = '';
                 if (item.status === 'approved') colorClass = 'bg-green-500/10 text-green-400';
                 else if (item.status === 'rejected') colorClass = 'bg-red-500/10 text-red-400';
                 else colorClass = 'bg-yellow-500/10 text-yellow-400';
                 return <span className={`capitalize px-2 py-1 text-xs font-bold rounded-full ${colorClass}`}>{item.status}</span>
            }
        },
    ];

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    const pendingApplications = applications.filter(a => a.status === 'pending');
    const reviewedApplications = applications.filter(a => a.status !== 'pending');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Pending Seller Applications</h1>
             {pendingApplications.length > 0 ? (
                 <DataTable
                    columns={columns.filter(c => c.header !== 'Status')}
                    data={pendingApplications}
                    actions={(app) => (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => openDetailsModal(app)}
                                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                                title="View Details"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                             <button 
                                onClick={() => handleApprove(app.id)} 
                                className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
                                disabled={processingId === app.id}
                                title="Approve"
                             >
                                <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => openRejectModal(app)} 
                                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
                                disabled={processingId === app.id}
                                title="Reject"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                />
             ) : (
                <div className="bg-dark/50 p-6 rounded-xl text-center text-slate-400">No pending applications.</div>
             )}


            <h1 className="text-3xl font-bold text-white mt-12">Reviewed Applications</h1>
             <DataTable
                columns={columns}
                data={reviewedApplications}
                 actions={(app) => (
                    <button 
                        onClick={() => openDetailsModal(app)}
                        className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                 )}
            />

            {/* View Details Modal */}
            <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title={`Details for "${selectedApp?.store_name}"`}>
                {selectedApp && (
                     <div className="space-y-4">
                        <p className="text-slate-300 italic">"{selectedApp.description}"</p>
                        <div className="space-y-3 pt-4 border-t border-slate-700">
                             <DetailItem icon={Mail} label="Contact Email" value={selectedApp.contact_email} />
                             <DetailItem icon={Phone} label="Contact Phone" value={selectedApp.contact_phone} />
                             <DetailItem icon={LinkIcon} label="Social Media" value={selectedApp.social_link} />
                             <DetailItem icon={Gamepad2} label="Game Types" value={selectedApp.game_types} />
                             <DetailItem icon={Wallet} label="Payment Methods" value={selectedApp.payment_methods} />
                             {selectedApp.id_document_url && (
                                <a href={selectedApp.id_document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline">
                                    <Download className="w-4 h-4" /> View ID Document
                                </a>
                             )}
                             {selectedApp.status === 'rejected' && selectedApp.rejection_reason && (
                                <div className="p-3 bg-red-900/40 rounded-md text-red-300">
                                    <p className="font-bold">Rejection Reason:</p> 
                                    <p className="italic">{selectedApp.rejection_reason}</p>
                                </div>
                             )}
                        </div>
                     </div>
                )}
            </Modal>

            {/* Rejection Modal */}
            <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title={`Reject Application for "${selectedApp?.store_name}"`}>
                <div className="space-y-4">
                    <label htmlFor="rejectionReason" className="text-sm font-bold text-slate-300 block">Reason for Rejection (Optional)</label>
                    <textarea 
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4} 
                        className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" 
                        placeholder="e.g., Application incomplete, suspicious activity..."
                    />
                     <div className="flex justify-end gap-3 pt-4">
                        <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-white bg-slate-600/80 rounded-lg hover:bg-slate-600">
                            Cancel
                        </button>
                         <button onClick={handleReject} className="px-4 py-2 text-sm font-semibold text-white bg-red-600/80 rounded-lg hover:bg-red-600">
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminSellers;