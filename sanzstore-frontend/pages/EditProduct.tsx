
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './../contexts/AuthContext';
import { useToast } from './../contexts/ToastContext';
import { generateDescription } from './../services/geminiService';
import { fetchProductById, updateProduct } from './../services/api';
import { Wand2 } from './../components/Icons';
import { Product } from './../types';
import LoadingSpinner from './../components/LoadingSpinner';
import ErrorAlert from './../components/ErrorAlert';

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    // Form state
    const [productData, setProductData] = useState<Partial<Product>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Edit Product – Sanz Store';
        const getProduct = async () => {
            if (!id) {
                setError("Product ID not found.");
                setLoading(false);
                return;
            }
            try {
                const data = await fetchProductById(id);
                if (data) {
                    setProductData(data);
                    setImagePreview(data.image_url);
                } else {
                    setError("Product not found.");
                }
            } catch (err: any) {
                setError(`Failed to fetch product: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             const { checked } = e.target as HTMLInputElement;
             setProductData(prev => ({ ...prev, [name]: checked }));
        } else {
             setProductData(prev => ({ ...prev, [name]: value }));
        }
    };
    
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
        if (!productData.name) {
            addToast('Please enter a game/account name first.', 'error');
            return;
        }
        setAiLoading(true);
        try {
            const aiDescription = await generateDescription(productData.name);
            setProductData(prev => ({ ...prev, description: aiDescription }));
            addToast('AI description generated!', 'success');
        } catch (error) {
            addToast('Failed to generate description.', 'error');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        
        setUpdating(true);
        try {
            const dataToUpdate: Partial<Product> = { ...productData };
            // These fields are not editable or are derived
            delete dataToUpdate.id;
            delete dataToUpdate.seller_id;
            delete dataToUpdate.seller_name;
            delete dataToUpdate.created_at;
            delete dataToUpdate.image_url;

            await updateProduct(id, dataToUpdate, imageFile);
            addToast('Product updated successfully!', 'success');
            navigate(-1); // Go back to the previous page (MyProducts or AdminProducts)
        } catch (error: any) {
            addToast(error.message || 'Failed to update product.', 'error');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight text-white">Edit Product</h1>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-slate-800/30 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-white/10 animate-fade-in">
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-bold text-slate-300 block">Account/Game Name</label>
                        <input id="name" name="name" type="text" value={productData.name || ''} onChange={handleInputChange} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" required />
                    </div>
                     <div>
                        <label htmlFor="category" className="text-sm font-bold text-slate-300 block">Category</label>
                        <select id="category" name="category" value={productData.category || ''} onChange={handleInputChange} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" required>
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
                        <textarea id="description" name="description" value={productData.description || ''} onChange={handleInputChange} rows={5} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" required></textarea>
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
                              <input id="accountUsername" name="account_username" type="text" value={productData.account_username || ''} onChange={handleInputChange} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" required />
                          </div>
                          <div>
                              <label htmlFor="accountPassword" className="text-sm font-bold text-slate-300 block">Account Password</label>
                              <input id="accountPassword" name="account_password" type="password" value={productData.account_password || ''} onChange={handleInputChange} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" required />
                          </div>
                     </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="text-sm font-bold text-slate-300 block">Price (IDR)</label>
                            <input id="price" name="price" type="number" value={productData.price || ''} onChange={handleInputChange} className="w-full mt-2 p-3 bg-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700" required />
                        </div>
                        <div className="flex items-center pt-6">
                           <input 
                             id="isEmailVerified"
                             name="is_email_verified"
                             type="checkbox" 
                             checked={productData.is_email_verified || false} 
                             onChange={handleInputChange}
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
                        <input id="image" type="file" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </div>
                     <p className="text-xs text-slate-400 mt-2">Leave empty to keep the current image.</p>
                </div>
                <button type="submit" disabled={updating || aiLoading} className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {updating ? 'Updating Product...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
