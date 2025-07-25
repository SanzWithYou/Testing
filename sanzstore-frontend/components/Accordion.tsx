import React, { useState } from 'react';
import { ChevronDown } from './Icons';

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    startOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);

    return (
        <div className="border-b border-slate-700/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-5 text-left"
            >
                <span className="font-semibold text-lg text-slate-100">{title}</span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </button>
            <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="pb-5 text-slate-400">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
