
import React, { useState, useEffect } from 'react';
import { X, Star, SlidersHorizontal } from '../Icons';
import Accordion from '../Accordion';
import { formatCurrency } from '../../utils/formatter';

interface FilterSidebarProps {
    onApplyFilters: (filters: { categories: string[], priceRange: [number, number], minRating: number }) => void;
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = ['FPS', 'RPG', 'MOBA', 'Battle Royale', 'Mobile', 'Platform', 'Top Up'];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onApplyFilters, isOpen, onClose }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
    const [minRating, setMinRating] = useState<number>(0);
    
    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleApply = () => {
        onApplyFilters({ categories: selectedCategories, priceRange, minRating });
        onClose();
    };

    const handleReset = () => {
        setSelectedCategories([]);
        setPriceRange([0, 5000000]);
        setMinRating(0);
        onApplyFilters({ categories: [], priceRange: [0, 5000000], minRating: 0 });
        onClose();
    };
    
    const SidebarContent = () => (
         <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-6 h-6 text-primary"/>
                    Filters
                </h2>
                <button onClick={onClose} className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-white">
                    <X className="w-5 h-5"/>
                </button>
            </div>
            
            <Accordion title="Category" startOpen>
                <div className="space-y-2">
                    {CATEGORIES.map(category => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="h-5 w-5 rounded bg-slate-700/50 border-slate-600 text-primary focus:ring-primary"
                            />
                            <span className="text-slate-300">{category}</span>
                        </label>
                    ))}
                </div>
            </Accordion>
            
            <Accordion title="Price Range" startOpen>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-300">
                        <span>{formatCurrency(priceRange[0])}</span>
                        <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                     <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="100000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg accent-primary"
                    />
                </div>
            </Accordion>

            <Accordion title="Seller Rating" startOpen>
                <div className="flex justify-around">
                    {[1, 2, 3, 4, 5].map(rating => (
                        <button key={rating} onClick={() => setMinRating(rating)}
                            className={`flex items-center gap-1 p-2 rounded-lg text-sm transition-colors ${minRating === rating ? 'bg-primary/20 text-primary' : 'hover:bg-slate-700'}`}
                        >
                            {rating} <Star className="w-4 h-4 text-yellow-400"/>
                        </button>
                    ))}
                </div>
            </Accordion>
            
            <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button onClick={handleReset} className="flex-1 py-2 px-4 bg-slate-600/50 text-white font-semibold rounded-lg hover:bg-slate-600">Reset</button>
                <button onClick={handleApply} className="flex-1 py-2 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Apply</button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-24 bg-dark/50 backdrop-blur-sm rounded-xl ring-1 ring-white/10">
                    <SidebarContent />
                </div>
            </aside>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'bg-black/60' : 'pointer-events-none'}`} onClick={onClose}>
                <div 
                    className={`fixed top-0 left-0 h-full w-80 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                     <div className="bg-dark/50 backdrop-blur-sm h-full overflow-y-auto">
                        <SidebarContent />
                     </div>
                </div>
            </div>
        </>
    );
};

export default FilterSidebar;
