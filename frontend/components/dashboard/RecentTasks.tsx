'use client';

import { useState } from 'react';
import { useGetTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RecentTasks() {
    const [page, setPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const { data: tasksData, isLoading: isTasksLoading } = useGetTasks({
        page,
        limit: 5,
        date: selectedDate || undefined
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'in_progress': return <Clock className="w-4 h-4 text-amber-500" />;
            default: return <Circle className="w-4 h-4 text-gray-400" />;
        }
    };

    const statusColors: any = {
        pending: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300',
        in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
        completed: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col h-[400px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between  mb-6 gap-2">
                <h3 className="text-lg w-full font-semibold text-gray-900 dark:text-white">Recent Tasks</h3>
                {/* <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setPage(1);
                    }}
                    className="w-full sm:w-auto h-8 text-xs py-1 rounded-sm"
                /> */}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar hide-scrollbar">
                {isTasksLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 dark:bg-zinc-800 animate-pulse rounded-lg" />)}
                    </div>
                ) : tasksData?.data.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <p className="text-gray-400 dark:text-zinc-600 italic mb-2">No tasks found</p>
                        {selectedDate && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedDate('')}
                                className="text-indigo-500 h-auto p-0 text-xs hover:bg-transparent hover:underline"
                            >
                                Clear date filter
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasksData?.data.map((task: any) => (
                            <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="shrink-0">
                                        {getStatusIcon(task.status)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{task.title}</p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ml-2", statusColors[task.status])}>
                                    {task.status === 'pending' ? 'Todo' : task.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-zinc-800 flex justify-between items-center">
                <Link href="/tasks" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center group">
                    View all tasks
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                {tasksData?.meta && tasksData.meta.totalPages > 1 && (
                    <div className="flex gap-1">
                        <Button
                            variant="secondary"

                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="h-6 w-6 p-0"
                        >
                            &lt;
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={page === tasksData.meta.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="h-6 w-6 p-0"
                        >
                            &gt;
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
