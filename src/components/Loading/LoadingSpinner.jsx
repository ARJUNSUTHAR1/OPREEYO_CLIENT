import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-12 w-12 border-3',
        lg: 'h-16 w-16 border-4',
    };

    const spinner = (
        <div className={`animate-spin rounded-full border-b-black border-t-transparent ${sizeClasses[size]}`} />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <div className="text-center">
                    {spinner}
                    <p className="mt-4 text-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-8">
            {spinner}
        </div>
    );
};

export default LoadingSpinner;
