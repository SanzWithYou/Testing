
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { generateDescription } from '../../services/geminiService';
import { addProduct } from '../../services/api';
import { Wand2 } from '../../components/Icons';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';

const AddProduct: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    // Form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [accountUsername, setAccountUsername] = useState('');
    const [accountPassword, setAccountPassword] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    React.useEffect(() => {
        document.title = 'Add New Product – Sanz Store';
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateDescription = async () => {
        if (!name) {
            addToast('Please enter a game/account name first.', 'error');
            return;
        }
        setAiLoading(true);
        try {
            const aiDescription = await generateDescription(name);
            setDescription(aiDescription);
            addToast('AI description generated!', 'success');
        } catch (error) {
            addToast('Failed to generate description.', 'error');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        if (!user || !user.roles.includes('seller')) {
            addToast('You must be a seller to list products.', 'error');
            return;
        }
        if (!imageFile) {
            addToast('Please upload an image for the product.', 'error');
            return;
        }
        setLoading(true);

        const productData: Omit<Product, 'id' | 'created_at' | 'image_url' | 'seller_id' | 'seller_name' | 'status' | 'sub_category' | 'seller_rating'> = {
            name,
            category,
            price: parseFloat(price),
            description,
            account_username: accountUsername,
            account_password: accountPassword,
            is_email_verified: isEmailVerified,
        };

        try {
            await addProduct(productData, imageFile, user);
            addToast('Your account has been listed for sale!', 'success');
            navigate('/sell/my-products');
        } catch(error: any) {
            addToast(error.message || 'Failed to list product.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-white">List a New Account for Sale</h1>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in">
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-bold text-slate-300 block">Account/Game Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" placeholder="e.g., Valorant Champions Bundle" required />
                    </div>
                     <div>
                        <label htmlFor="category" className="text-sm font-bold text-slate-300 block">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" required>
                            <option value="" disabled>Select a category</option>
                            <option value="FPS">FPS</option>
                            <option value="RPG">RPG</option>
                            <option value="MOBA">MOBA</option>
                            <option value="Battle Royale">Battle Royale</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Platform">Platform</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="text-sm font-bold text-slate-300 block">Description</label>
                    <div className="relative">
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" placeholder="Describe the key features of the account..." required></textarea>
                        <button type="button" onClick={handleGenerateDescription} disabled={aiLoading} className="absolute top-4 right-3 bg-secondary text-white p-2 rounded-full hover:bg-secondary/90 transition-all duration-200 disabled:bg-secondary/50 transform hover:scale-110">
                            {aiLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Wand2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="border-t border-slate-700 pt-6 space-y-6">
                     <h3 className="text-lg font-bold text-white">Account Credentials & Details</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                          <div>
                              <label htmlFor="accountUsername" className="text-sm font-bold text-slate-300 block">Account Username</label>
                              <input id="accountUsername" type="text" value={accountUsername} onChange={(e) => setAccountUsername(e.target.value)} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" placeholder="Account login username" required />
                          </div>
                          <div>
                              <label htmlFor="accountPassword" className="text-sm font-bold text-slate-300 block">Account Password</label>
                              <input id="accountPassword" type="password" value={accountPassword} onChange={(e) => setAccountPassword(e.target.value)} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" placeholder="••••••••" required />
                          </div>
                     </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="text-sm font-bold text-slate-300 block">Price (IDR)</label>
                            <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" placeholder="e.g., 1500000" required />
                        </div>
                        <div className="flex items-center pt-6">
                           <input 
                             id="isEmailVerified" 
                             type="checkbox" 
                             checked={isEmailVerified} 
                             onChange={(e) => setIsEmailVerified(e.target.checked)}
                             className="h-5 w-5 rounded bg-slate-700/50 border-slate-600 text-primary focus:ring-primary"
                           />
                           <label htmlFor="isEmailVerified" className="ml-3 text-sm font-medium text-slate-300">Email is Verified</label>
                        </div>
                     </div>
                </div>

                <div>
                    <label htmlFor="image" className="text-sm font-bold text-slate-300 block">Product Image</label>
                    <div className="mt-2 flex items-center gap-4">
                        {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />}
                        <input id="image" type="file" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required />
                    </div>
                </div>
                <button type="submit" disabled={loading || aiLoading} className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Listing Account...' : 'List for Sale'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
