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
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

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


const typeStyles: Record<ToastType, string> = {
    success: "bg-gray-800/90 border-b-4 border-green-500",
    error: "bg-gray-800/90 border-b-4 border-red-500",
    warning: "bg-gray-800/90 border-b-4 border-yellow-400",
    info: "bg-gray-800/90 border-b-4 border-blue-500",
};

const typeIcons: Record<ToastType, React.ReactElement> = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-4 items-center" aria-live="assertive">
        {toasts.map(toast => (
            <div
                key={toast.id}
                role="alert"
                aria-label="Close"
                className={`
                    relative w-full max-w-md px-6 py-4 rounded-xl shadow-1xl flex items-center
                    ${typeStyles[toast.type]}
                `}
            >
                <span className="mr-4 flex-shrink-0">{typeIcons[toast.type]}</span>
                <span className="text-white text-base flex-1 truncate pr-7">{toast.message}</span>
                <button
                    onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    className="absolute top-2 right-4 text-white/70 hover:text-white text-2xl leading-none cursor-pointer"
                    aria-label="Close"
                    style={{ lineHeight: 1 }}
                >
                    ×
                </button>
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