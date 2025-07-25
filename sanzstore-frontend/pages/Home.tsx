
import React from 'react';

import HeroSection from '../components/home/HeroSection';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturesSection from '../components/home/FeaturesSection';
import PopularProductsSection from '../components/home/PopularProductsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import SellerCtaSection from '../components/home/SellerCtaSection';
import FaqSection from '../components/home/FaqSection';


const Home: React.FC = () => {

    React.useEffect(() => {
        document.title = 'Sanz Store – Digital Game Account Marketplace';
    }, []);

    return (
        <div className="space-y-24 md:space-y-32 lg:space-y-40 overflow-hidden">
            <HeroSection />
            <CategoriesSection />
            <FeaturesSection />
            <PopularProductsSection />
            <TestimonialsSection />
            <SellerCtaSection />
            <FaqSection />
        </div>
    );
};

export default Home;