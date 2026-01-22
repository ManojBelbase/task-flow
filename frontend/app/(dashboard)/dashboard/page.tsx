'use client';

import { LayoutDashboard, CheckCircle2, Circle, Clock, BarChart3, ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { stats, isLoading } = useDashboard();

    if (isLoading) {
        return <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-zinc-800 rounded-md" />
                ))}
            </div>
        </div>;
    }

    const statCards = [
        { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { label: 'Completed', value: stats?.tasksByStatus?.completed || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'In Progress', value: stats?.tasksByStatus?.in_progress || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Pending', value: stats?.tasksByStatus?.pending || 0, icon: Circle, color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-zinc-800' },
    ];

    if (user?.role?.toUpperCase() === 'ADMIN') {
        statCards.unshift({
            label: 'Total Users',
            value: stats?.userStats?.totalUsers || 0,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        });
    }

    const maxProgress = Math.max(...(stats?.productivityTrend?.map((t: any) => t.count) || [1]));

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-md ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {user?.role?.toUpperCase() === 'ADMIN' && (

                <div className="bg-white dark:bg-zinc-900 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h3>
                        <Link href="/users" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 text-sm">
                                {stats?.userStats?.recentUsers?.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                                                <span className="text-[10px] text-gray-400 dark:text-zinc-500">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-[10px] text-gray-400 dark:text-zinc-500">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Productivity Trend (Last 7 Days)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {stats?.productivityTrend?.length > 0 ? (
                            stats.productivityTrend.map((day: any, i: number) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-indigo-500 dark:bg-indigo-600 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-400"
                                        style={{ height: `${(day.count / maxProgress) * 100}%`, minHeight: '4px' }}
                                    />
                                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 transform -rotate-45 mt-2">
                                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-md">
                                <p className="text-gray-400 dark:text-zinc-600 italic">Start creating tasks to see your trend!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h3>
                        <Link href="/tasks" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentTasks?.length > 0 ? (
                            stats.recentTasks.map((task: any) => (
                                <div key={task.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                    {task.status === 'completed' ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                    ) : task.status === 'in_progress' ? (
                                        <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-zinc-500">
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 dark:text-zinc-500 italic text-center py-10">No recent tasks</p>
                        )}
                    </div>
                </div>
            </div>
            {user?.role?.toUpperCase() === 'ADMIN' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User Distribution by Role</h3>
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                                {Object.entries(stats?.userStats?.roles || {}).map(([role, count]: [string, any]) => (
                                    <div key={role} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-md border border-gray-100 dark:border-zinc-800">
                                        <p className="text-xs text-gray-500 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1">{role}</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="w-full sm:w-64 h-3 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden flex">
                                {Object.entries(stats?.userStats?.roles || {}).map(([role, count]: [string, any], idx) => {
                                    const percentage = ((count as number) / stats.userStats.totalUsers) * 100;
                                    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'];
                                    return (
                                        <div
                                            key={role}
                                            className={colors[idx % colors.length]}
                                            style={{ width: `${percentage}%` }}
                                            title={`${role}: ${count}`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>


                </div>
            )}

        </div>
    );
}
