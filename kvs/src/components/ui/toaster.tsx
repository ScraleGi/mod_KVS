'use client';

import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    ReactNode,
} from 'react';

import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number,
    message: string,
    type: ToastType
}

interface ToasterContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const useToaster = () => {
    const ctx = useContext(ToasterContext);
    if(!ctx) throw new Error('useToaster must be used within ToasterProvider');
    return ctx
}

const typeClasses: Record<ToastType, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-yellow-500 text-black',
};

export const ToasterProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timeouts = useRef<number[]>([]);
    const [isClient, setIsClient] = useState(false);

    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => {
            const next = [...prev, { id, message, type }];
            return next.length > 5 ? next.slice(1) : next;
        });

        const timeoutId = window.setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
        timeouts.current.push(timeoutId);
    };

    useEffect(() => {
        setIsClient(true);
        const timeoutsSnapshot = [...timeouts.current];
        return () => {
            timeoutsSnapshot.forEach(clearTimeout);
        };
    }, []);

    const toasterPortal = (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center" aria-live="assertive">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    role="alert"
                    className={`
                        px-4 py-2 rounded shadow-lg text-white transition-all
                        animate-slide-in
                        ${typeClasses[toast.type]}
                    `}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );

    return (
        <ToasterContext.Provider value={{ showToast }}>
            {children}
            {isClient && createPortal(toasterPortal, document.body)}
        </ToasterContext.Provider>
    );
};