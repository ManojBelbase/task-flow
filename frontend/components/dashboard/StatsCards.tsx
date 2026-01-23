import { LayoutDashboard, CheckCircle2, Circle, Clock } from 'lucide-react';

interface StatsCardsProps {
    stats: any;
    isLoading: boolean;
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm animate-pulse h-32" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-indigo-100 dark:hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Total Tasks</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalTasks || 0}</h3>
                    </div>
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-green-100 dark:hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Completed</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.tasksByStatus?.completed || 0}</h3>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-amber-100 dark:hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">In Progress</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.tasksByStatus?.in_progress || 0}</h3>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:border-gray-100 dark:hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Pending</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.tasksByStatus?.pending || 0}</h3>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                        <Circle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
