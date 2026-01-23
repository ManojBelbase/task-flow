'use client';

import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useGetDashboardStats } from '@/hooks/useDashboard';
import { useCreateTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import TaskModal from '@/components/task/TaskModal';
import toast from 'react-hot-toast';
import StatsCards from '@/components/dashboard/StatsCards';
import TaskDistributionChart from '@/components/dashboard/TaskDistributionChart';
import RecentTasks from '@/components/dashboard/RecentTasks';
import RecentUsers from '@/components/dashboard/RecentUsers';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { stats, isLoading } = useGetDashboardStats();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const createTaskMutation = useCreateTask();

    const handleCreate = async (taskData: any) => {
        try {
            await createTaskMutation.mutateAsync(taskData);
            toast.success('Task created successfully!');
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to create task');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Hello, {user?.name.split(' ')[0]}
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 mt-1">
                        Here's what's happening with your projects today
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5 mr-1.5" />
                        Quick Task
                    </Button>
                </div>
            </div>

            <StatsCards stats={stats} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <TaskDistributionChart stats={stats} isLoading={isLoading} />

                <RecentTasks />

                {user?.role === 'admin' && (
                    <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-1 gap-4">
                        <RecentUsers users={stats?.userStats?.recentUsers} isLoading={isLoading} />
                    </div>
                )}
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreate}
                title="Create New Task"
            />
        </div>
    );
}
