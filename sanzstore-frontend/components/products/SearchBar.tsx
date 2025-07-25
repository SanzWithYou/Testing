
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [term, setTerm] = useState('');

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            onSearch(term);
        }, 500); // 500ms debounce

        return () => clearTimeout(debounceTimer);
    }, [term, onSearch]);

    return (
        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"/>
            <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for accounts, items or sellers..."
                className="w-full bg-slate-700/80 rounded-lg pl-12 pr-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary ring-1 ring-slate-700"
            />
        </div>
    );
};

export default SearchBar;
