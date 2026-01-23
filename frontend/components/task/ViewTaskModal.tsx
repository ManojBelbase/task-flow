'use client';

import { X, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ViewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
}

export default function ViewTaskModal({ isOpen, onClose, task }: ViewTaskModalProps) {
    if (!isOpen || !task) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'in_progress': return <Clock className="w-5 h-5 text-amber-500" />;
            default: return <Circle className="w-5 h-5 text-gray-400" />;
        }
    };

    const statusColors: any = {
        pending: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300',
        in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
        completed: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-zinc-800">
                    <div className="pr-8">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", statusColors[task.status])}>
                                {getStatusIcon(task.status)}
                                <span>{task.status.replace('_', ' ')}</span>
                            </div>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{task.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-gray-400 shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="prose dark:prose-invert max-w-none">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-3">Description</h4>
                        <p className="text-gray-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed text-base">
                            {task.description || <span className="italic text-gray-400">No description provided.</span>}
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 mt-auto">
                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            onClick={onClose}
                            className="px-6"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
