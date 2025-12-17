import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mb-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full"
            >
                <Icon className="w-16 h-16 text-indigo-400" strokeWidth={1.5} />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-gray-900 mb-2 text-center"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-center max-w-md mb-6"
            >
                {description}
            </motion.p>

            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button onClick={action.onClick} icon={action.icon}>
                        {action.label}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
};
