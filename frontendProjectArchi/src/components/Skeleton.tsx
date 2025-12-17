import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height,
    count = 1,
}) => {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const style = {
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || (variant === 'text' ? '1rem' : '100%'),
    };

    const skeletons = Array.from({ length: count }, (_, index) => (
        <motion.div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
        />
    ));

    return count > 1 ? (
        <div className="space-y-3">{skeletons}</div>
    ) : (
        <>{skeletons}</>
    );
};

// Preset skeleton components for common use cases
export const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-start justify-between">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex space-x-2">
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
            </div>
        </div>
        <Skeleton width="70%" height={24} />
        <Skeleton width="50%" height={16} />
        <div className="flex justify-between items-center pt-2">
            <Skeleton width={80} height={24} />
            <Skeleton width={60} height={16} />
        </div>
    </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
            <Skeleton width="30%" height={20} />
        </div>
        <div className="divide-y divide-gray-100">
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className="p-4 flex items-center space-x-4">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1 space-y-2">
                        <Skeleton width="40%" />
                        <Skeleton width="60%" />
                    </div>
                    <Skeleton width={100} height={32} />
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonStat: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <Skeleton variant="rectangular" width={64} height={64} />
        <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={32} />
        </div>
    </div>
);
