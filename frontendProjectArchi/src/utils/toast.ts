import toast, { Toaster } from 'react-hot-toast';

// Custom toast configurations
export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#10b981',
                color: '#fff',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '500',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
            },
        });
    },

    error: (message: string) => {
        toast.error(message, {
            duration: 5000,
            position: 'top-right',
            style: {
                background: '#ef4444',
                color: '#fff',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '500',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
            },
        });
    },

    loading: (message: string) => {
        return toast.loading(message, {
            position: 'top-right',
            style: {
                background: '#6366f1',
                color: '#fff',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '500',
            },
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                position: 'top-right',
                style: {
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: '500',
                },
            }
        );
    },
};

// Export the Toaster component to be used in App.tsx
export { Toaster };
