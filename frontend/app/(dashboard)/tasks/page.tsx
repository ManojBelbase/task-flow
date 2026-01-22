'use client';

import { useState } from 'react';
import { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Plus, Search, Filter, Pencil, Trash2, ChevronLeft, ChevronRight, CheckCircle2, Clock, Circle } from 'lucide-react';
import TaskModal from '@/components/TaskModal';
import ConfirmModal from '@/components/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import CustomSelect from '@/components/ui/CustomSelect';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function TasksPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const { data, isLoading } = useGetTasks({
        page,
        limit: 10,
        status: status || undefined,
        search: search || undefined
    });

    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();

    const handleCreate = (formData: any) => {
        const mappedData = {
            ...formData,
            status: formData.status === 'TODO' ? 'pending' : formData.status.toLowerCase().replace(' ', '_')
        };
        createMutation.mutate(mappedData, {
            onSuccess: () => setIsModalOpen(false)
        });
    };

    const handleUpdate = (formData: any) => {
        const mappedData = {
            ...formData,
            status: formData.status === 'TODO' ? 'pending' : formData.status.toLowerCase().replace(' ', '_')
        };
        updateMutation.mutate({ id: selectedTask.id, ...mappedData }, {
            onSuccess: () => setIsModalOpen(false)
        });
    };

    const handleDelete = () => {
        if (selectedTask) {
            deleteMutation.mutate(selectedTask.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedTask(null);
                }
            });
        }
    };

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
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Tasks</h2>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">Manage and track your project tasks efficiently</p>
                </div>
                <Button
                    onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
                    className="flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Task</span>
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className="flex-1 relative">
                    <Input
                        placeholder="Search tasks by title or description..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <div className="w-48">
                        <CustomSelect
                            options={[
                                { label: 'All Statuses', value: '' },
                                { label: 'To Do', value: 'pending' },
                                { label: 'In Progress', value: 'in_progress' },
                                { label: 'Completed', value: 'completed' },
                            ]}
                            value={status}
                            onChange={(val) => {
                                setStatus(val);
                                setPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-xl" />)
                ) : data?.data.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
                        <p className="text-gray-500 dark:text-zinc-500 italic">No tasks found matching your criteria.</p>
                    </div>
                ) : (
                    data?.data.map((task: any) => (
                        <div key={task.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all gap-4">
                            <div className="flex items-start space-x-4 flex-1 min-w-0">
                                <div className="mt-1 shrink-0">{getStatusIcon(task.status)}</div>
                                <div className="space-y-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{task.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">{task.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:ml-4 shrink-0">
                                <div className="sm:hidden">
                                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", statusColors[task.status])}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
                                        className="h-9 w-9 p-0"
                                        title="Edit Task"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => { setSelectedTask(task); setIsDeleteModalOpen(true); }}
                                        className="h-9 w-9 p-0"
                                        title="Delete Task"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="hidden sm:block min-w-[100px] text-right">
                                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", statusColors[task.status])}>
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {data?.meta && data.meta.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-8">
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                        Page {page} of {data.meta.totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={page === data.meta.totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={selectedTask ? handleUpdate : handleCreate}
                initialData={selectedTask}
                title={selectedTask ? 'Edit Task' : 'Create New Task'}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Task?"
                message="Are you sure you want to delete this task? This action cannot be undone."
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
