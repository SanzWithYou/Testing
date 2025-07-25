
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../services/api';

import FilterSidebar from '../components/products/FilterSidebar';
import ProductGrid from '../components/products/ProductGrid';
import SearchBar from '../components/products/SearchBar';
import SortDropdown from '../components/products/SortDropdown';
import Pagination from '../components/products/Pagination';
import { SlidersHorizontal } from '../components/Icons';

const PRODUCTS_PER_PAGE = 8;

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalProducts, setTotalProducts] = useState(0);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [filters, setFilters] = useState({
        categories: [] as string[],
        priceRange: [0, 5000000] as [number, number],
        minRating: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);

    const getProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchProducts(
                { ...filters, searchTerm },
                sortOrder,
                currentPage,
                PRODUCTS_PER_PAGE
            );
            setProducts(data.data);
            setTotalProducts(data.total);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters, searchTerm, sortOrder, currentPage]);

    useEffect(() => {
        document.title = 'All Products – Sanz Store';
        getProducts();
    }, [getProducts]);

    const handleApplyFilters = (newFilters: typeof filters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page on new filter
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };
    
    const handleSortChange = (newSort: string) => {
        setSortOrder(newSort);
        setCurrentPage(1);
    }
    
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold tracking-tight text-white">Explore Our Marketplace</h1>
                <p className="text-slate-400 mt-2">Find the perfect account to elevate your gameplay.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* --- Filters --- */}
                <FilterSidebar 
                    onApplyFilters={handleApplyFilters} 
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                />

                {/* --- Main Content --- */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div className="w-full sm:w-auto flex-grow">
                             <SearchBar onSearch={handleSearch} />
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <button 
                                className="lg:hidden flex items-center gap-2 bg-slate-700/80 px-4 py-2 rounded-lg text-white"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <SlidersHorizontal className="w-5 h-5"/>
                                <span>Filter</span>
                            </button>
                           <SortDropdown onSortChange={handleSortChange} />
                        </div>
                    </div>

                    {error && <p className="text-red-400">{error}</p>}
                    
                    <ProductGrid products={products} loading={loading} />
                    
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={totalProducts}
                        itemsPerPage={PRODUCTS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Products;
