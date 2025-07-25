
import React from 'react';
import { AlertTriangle } from './Icons';

interface ErrorAlertProps {
    message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
    return (
        <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
            <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
                <div>
                    <p className="font-bold">Error</p>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
};

export default ErrorAlert;
