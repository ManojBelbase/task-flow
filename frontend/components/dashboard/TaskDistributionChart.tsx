
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TaskDistributionChartProps {
    stats: any;
    isLoading: boolean;
}

export default function TaskDistributionChart({ stats, isLoading }: TaskDistributionChartProps) {
    if (isLoading) {
        return (
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col h-[400px]">
                <div className="h-6 w-48 bg-gray-100 dark:bg-zinc-800 rounded mb-6 animate-pulse" />
                <div className="flex-1 bg-gray-50 dark:bg-zinc-800/50 rounded-full animate-pulse mx-auto w-64 h-64" />
            </div>
        );
    }

    return (
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Task Status Distribution</h3>
            <div className="flex-1 w-full min-h-0">
                {stats?.tasksByStatus ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Completed', value: stats.tasksByStatus.completed || 0, color: '#22c55e' },
                                    { name: 'In Progress', value: stats.tasksByStatus.in_progress || 0, color: '#f59e0b' },
                                    { name: 'Pending', value: stats.tasksByStatus.pending || 0, color: '#9ca3af' },
                                ].filter(item => item.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {[
                                    { name: 'Completed', value: stats.tasksByStatus.completed || 0, color: '#22c55e' },
                                    { name: 'In Progress', value: stats.tasksByStatus.in_progress || 0, color: '#f59e0b' },
                                    { name: 'Pending', value: stats.tasksByStatus.pending || 0, color: '#9ca3af' },
                                ].filter(item => item.value > 0).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgb(24 24 27)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-md">
                        <p className="text-gray-400 dark:text-zinc-600 italic">No task data available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
