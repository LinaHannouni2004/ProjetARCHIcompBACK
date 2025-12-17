import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}) => {
    const variantStyles = {
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-600 hover:bg-red-700',
        },
        warning: {
            icon: 'bg-yellow-100 text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700',
        },
        info: {
            icon: 'bg-blue-100 text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700',
        },
    };

    const handleConfirm = () => {
        onConfirm();
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 p-3 rounded-full ${variantStyles[variant].icon}`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>

                                    <div className="flex-1">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-bold text-gray-900 mb-2"
                                        >
                                            {title}
                                        </Dialog.Title>
                                        <Dialog.Description className="text-sm text-gray-600">
                                            {message}
                                        </Dialog.Description>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        disabled={isLoading}
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={onClose}
                                        disabled={isLoading}
                                    >
                                        {cancelText}
                                    </Button>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isLoading}
                                        className={`px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant].button}`}
                                    >
                                        {isLoading ? 'Processing...' : confirmText}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
