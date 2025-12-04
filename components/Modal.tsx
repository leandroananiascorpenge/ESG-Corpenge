
import React from 'react';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    size?: 'default' | 'maximized';
}

export const Modal: React.FC<ModalProps> = ({ onClose, children, title, size = 'default' }) => {
    
    const sizeClasses = {
        default: 'w-full max-w-md m-4 p-6',
        maximized: 'w-full max-w-7xl m-4 p-6 h-full sm:h-auto sm:max-h-[90vh] flex flex-col',
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-lg shadow-xl relative ${sizeClasses[size]}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-shrink-0 flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
