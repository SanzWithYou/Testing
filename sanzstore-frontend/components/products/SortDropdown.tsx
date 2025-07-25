
import React from 'react';

interface SortDropdownProps {
    onSortChange: (sortOrder: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
    return (
        <select
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto bg-slate-700/80 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700"
            defaultValue="latest"
        >
            <option value="latest">Sort by: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Seller Rating</option>
        </select>
    );
};

export default SortDropdown;
