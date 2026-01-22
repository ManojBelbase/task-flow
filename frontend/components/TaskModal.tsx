'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import CustomSelect from './ui/CustomSelect';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    title: string;
}

export default function TaskModal({ isOpen, onClose, onSubmit, initialData, title }: TaskModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'TODO',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'TODO',
            });
        } else {
            setFormData({ title: '', description: '', status: 'TODO' });
        }
        setIsLoading(false);
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const statusOptions = [
        { label: 'To Do', value: 'TODO' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
    ];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-md shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-gray-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <Input
                        label="Title"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Finish the Q1 project presentation"
                        className="text-lg font-medium"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                            <CustomSelect
                                label="Status"
                                options={statusOptions}
                                value={formData.status}
                                onChange={(val) => setFormData({ ...formData, status: val })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Description</label>
                        <textarea
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-white min-h-[180px] resize-none text-sm leading-relaxed"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add comprehensive details about this task..."
                        />
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-gray-50 dark:border-zinc-800">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="px-8"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            isLoading={isLoading}
                        >
                            {isLoading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Task' : 'Create Task')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
