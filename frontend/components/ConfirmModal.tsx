'use client';

import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    isLoading
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden transform animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    </div>
                    <p className="text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed">
                        {message}
                    </p>
                    <div className="flex space-x-3">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={onConfirm}
                            className="flex-1"
                            isLoading={isLoading}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
