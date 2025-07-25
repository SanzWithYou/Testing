
import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, X } from './Icons';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 4500);

        const closeTimer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(closeTimer);
        };
    }, [onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300);
    };

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
    const Icon = isSuccess ? CheckCircle : AlertTriangle;

    return (
        <div
            className={`flex items-center ${bgColor} text-white text-sm font-bold px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out ${
                isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            }`}
            role="alert"
        >
            <Icon className="w-5 h-5 mr-3" />
            <p className="flex-grow">{message}</p>
            <button onClick={handleClose} className="ml-4 p-1 rounded-full hover:bg-black/20 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;