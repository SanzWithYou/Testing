
import React from 'react';
import { CheckCircle } from '../Icons';

interface ApplicationStepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, name: 'Store Info' },
    { id: 2, name: 'Contact & Payouts' },
    { id: 3, name: 'Verification' },
];

const ApplicationStepper: React.FC<ApplicationStepperProps> = ({ currentStep }) => {
    return (
        <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                        {step.id < currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-primary" />
                                </div>
                                <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                                    <CheckCircle className="w-5 h-5 text-white" aria-hidden="true" />
                                </div>
                                <span className="absolute top-10 -left-2 text-xs text-slate-300">{step.name}</span>
                            </>
                        ) : step.id === currentStep ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-slate-700" />
                                </div>
                                <div className="relative w-8 h-8 flex items-center justify-center bg-dark ring-4 ring-primary rounded-full">
                                    <span className="text-primary">{step.id}</span>
                                </div>
                                 <span className="absolute top-10 -left-2 text-xs text-primary font-bold">{step.name}</span>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-slate-700" />
                                </div>
                                <div className="relative w-8 h-8 flex items-center justify-center bg-slate-800 ring-2 ring-slate-700 rounded-full">
                                     <span className="text-slate-400">{step.id}</span>
                                </div>
                                <span className="absolute top-10 -left-2 text-xs text-slate-500">{step.name}</span>
                            </>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default ApplicationStepper;
