
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { applyToBeSeller } from '../../services/api';
import { SellerApplication } from '../../types';

import ApplicationStepper from '../../components/seller/ApplicationStepper';
import UploadCard from '../../components/seller/UploadCard';
import { Mail, Phone, Wallet, Store, Gamepad2, Link as LinkIcon, ShieldCheck } from '../../components/Icons';

const GAME_TYPES = ['MOBA', 'FPS', 'RPG', 'Battle Royale', 'Platform', 'Top Up'];
const PAYMENT_METHODS = ['Dana', 'OVO', 'GoPay', 'Bank Transfer', 'PayPal'];

const ApplyForSeller: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [formData, setFormData] = useState<Partial<Omit<SellerApplication, 'id' | 'user_id' | 'user_name' | 'user_email' | 'status' | 'submitted_at'>>>({
        store_name: '',
        description: '',
        game_types: [],
        contact_email: user?.email || '',
        contact_phone: '',
        social_link: '',
        payment_methods: [],
        id_document_url: ''
    });

    const [idDocumentFile, setIdDocumentFile] = useState<File | null>(null);
    const [termsAgreed, setTermsAgreed] = useState(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleCheckboxChange = (group: 'game_types' | 'payment_methods', value: string) => {
        setFormData(prev => {
            const currentValues = prev[group] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value)
                : [...currentValues, value];
            return { ...prev, [group]: newValues };
        });
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        if (step === 1) {
            if (!formData.store_name) newErrors.store_name = 'Store name is required.';
            if (!formData.description || formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters long.';
            if (!formData.game_types || formData.game_types.length === 0) newErrors.game_types = 'Select at least one game type.';
        }
        if (step === 2) {
             if (!formData.contact_email) newErrors.contact_email = 'Contact email is required.';
             else if (!/^\S+@\S+\.\S+$/.test(formData.contact_email)) newErrors.contact_email = 'Invalid email format.';
             if (!formData.contact_phone) newErrors.contact_phone = 'WhatsApp number is required.';
             if (!formData.payment_methods || formData.payment_methods.length === 0) newErrors.payment_methods = 'Select at least one payment method.';
        }
        if (step === 3) {
            if (!termsAgreed) newErrors.terms = 'You must agree to the terms and conditions.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };
    const prevStep = () => setCurrentStep(prev => prev - 1);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(3)) return;
        if (!user) {
            addToast('You must be logged in to apply.', 'error');
            return;
        }

        setLoading(true);
        try {
            // Here you would upload the idDocumentFile to your storage and get the URL
            // For mock, we'll just pretend it's uploaded.
            const applicationData = { ...formData };
            if (idDocumentFile) {
                // In a real app: const url = await uploadFile(idDocumentFile);
                applicationData.id_document_url = 'path/to/mock_document.jpg';
            }
            
            await applyToBeSeller(applicationData, user);
            addToast('Application submitted successfully! Please wait for admin review.', 'success');
            await refreshUser();
            navigate('/sell/status');
        } catch (error: any) {
            setErrors({ general: error.message });
            addToast(`Failed to submit application: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch(currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Store className="mx-auto w-10 h-10 mb-2 text-primary"/>
                            <h3 className="text-xl font-bold text-white">Store Information</h3>
                            <p className="text-slate-400 text-sm">Create a unique identity for your shop.</p>
                        </div>
                        <div>
                            <label htmlFor="store_name" className="text-sm font-bold text-slate-300 block">Store Name</label>
                            <input id="store_name" name="store_name" type="text" value={formData.store_name} onChange={handleInputChange} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white" placeholder="e.g., Pro Gamer Accounts" />
                            {errors.store_name && <p className="text-red-400 text-xs mt-1">{errors.store_name}</p>}
                        </div>
                        <div>
                            <label htmlFor="description" className="text-sm font-bold text-slate-300 block">Store Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white" placeholder="Tell buyers what makes your store special..."></textarea>
                            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div>
                             <label className="text-sm font-bold text-slate-300 block mb-2">Main Product Types</label>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {GAME_TYPES.map(game => (
                                    <label key={game} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${formData.game_types?.includes(game) ? 'bg-primary/20 ring-2 ring-primary' : 'bg-slate-700/50 hover:bg-slate-700'}`}>
                                        <input type="checkbox" checked={formData.game_types?.includes(game)} onChange={() => handleCheckboxChange('game_types', game)} className="hidden" />
                                        <Gamepad2 className="w-4 h-4"/> <span className="text-sm font-semibold">{game}</span>
                                    </label>
                                ))}
                             </div>
                             {errors.game_types && <p className="text-red-400 text-xs mt-1">{errors.game_types}</p>}
                        </div>
                    </div>
                );
            case 2:
                 return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <Wallet className="mx-auto w-10 h-10 mb-2 text-primary"/>
                            <h3 className="text-xl font-bold text-white">Contact & Payouts</h3>
                            <p className="text-slate-400 text-sm">How we can reach you and how you get paid.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="contact_email" className="text-sm font-bold text-slate-300 block">Contact Email</label>
                                <div className="relative mt-2">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                                    <input id="contact_email" name="contact_email" type="email" value={formData.contact_email} onChange={handleInputChange} className="w-full p-3 pl-10 bg-slate-700/50 rounded-lg text-white"/>
                                </div>
                                {errors.contact_email && <p className="text-red-400 text-xs mt-1">{errors.contact_email}</p>}
                            </div>
                            <div>
                                <label htmlFor="contact_phone" className="text-sm font-bold text-slate-300 block">WhatsApp Number</label>
                                 <div className="relative mt-2">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                                    <input id="contact_phone" name="contact_phone" type="tel" value={formData.contact_phone} onChange={handleInputChange} className="w-full p-3 pl-10 bg-slate-700/50 rounded-lg text-white" placeholder="e.g., 08123456789"/>
                                </div>
                                {errors.contact_phone && <p className="text-red-400 text-xs mt-1">{errors.contact_phone}</p>}
                            </div>
                        </div>
                        <div>
                             <label htmlFor="social_link" className="text-sm font-bold text-slate-300 block">Social Media / Channel Link (Optional)</label>
                             <div className="relative mt-2">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/>
                                <input id="social_link" name="social_link" type="url" value={formData.social_link} onChange={handleInputChange} className="w-full p-3 pl-10 bg-slate-700/50 rounded-lg text-white" placeholder="youtube.com/yourchannel"/>
                            </div>
                        </div>
                         <div>
                             <label className="text-sm font-bold text-slate-300 block mb-2">Available Payment Methods</label>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {PAYMENT_METHODS.map(method => (
                                    <label key={method} className={`flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all ${formData.payment_methods?.includes(method) ? 'bg-primary/20 ring-2 ring-primary' : 'bg-slate-700/50 hover:bg-slate-700'}`}>
                                        <input type="checkbox" checked={formData.payment_methods?.includes(method)} onChange={() => handleCheckboxChange('payment_methods', method)} className="hidden" />
                                        <span className="text-sm font-semibold">{method}</span>
                                    </label>
                                ))}
                             </div>
                             {errors.payment_methods && <p className="text-red-400 text-xs mt-1">{errors.payment_methods}</p>}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <ShieldCheck className="mx-auto w-10 h-10 mb-2 text-primary"/>
                            <h3 className="text-xl font-bold text-white">Verification & Submit</h3>
                            <p className="text-slate-400 text-sm">One final step to ensure a secure marketplace.</p>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-300 block mb-2">ID Verification (Optional)</label>
                            <UploadCard onFileSelect={setIdDocumentFile} />
                            <p className="text-xs text-slate-500 mt-2">Uploading a valid ID (KTP) is recommended to increase trust and speed up the approval process.</p>
                        </div>
                        <div className="border-t border-slate-700 pt-6 space-y-4">
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="h-5 w-5 mt-0.5 rounded flex-shrink-0 bg-slate-700/50 border-slate-600 text-primary focus:ring-primary" />
                                <span className="text-slate-300 text-sm">I declare that all data provided is correct and I agree to abide by the <a href="#" className="text-primary hover:underline">Terms & Conditions</a> of Sanz Store.</span>
                            </label>
                            {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms}</p>}
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-4xl font-extrabold mb-4 text-center tracking-tight text-white">Become a Seller</h1>
            <p className="text-center text-slate-400 mb-8 -mt-2">Join our marketplace and start earning from your game accounts.</p>
            
            <ApplicationStepper currentStep={currentStep} />
            
            <form onSubmit={handleSubmit} className="mt-8 p-8 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10">
                
                {renderStep()}

                {errors.general && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md mt-4">{errors.general}</p>}
                
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
                    <button type="button" onClick={prevStep} disabled={currentStep === 1} className="px-6 py-2 text-sm font-semibold text-white bg-slate-600/80 rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        Back
                    </button>
                    {currentStep < 3 ? (
                         <button type="button" onClick={nextStep} className="px-6 py-2 text-sm font-semibold text-white bg-primary/80 rounded-lg hover:bg-primary">
                            Next Step
                        </button>
                    ) : (
                         <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ApplyForSeller;