'use client';

import { Shield, User, Mail, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn exists
import { useAuthStore } from '@/store/useAuthStore';

interface RecentUsersProps {
    users: any[];
    isLoading: boolean;
}

export default function RecentUsers({ users, isLoading }: RecentUsersProps) {
    const { user: currentUser } = useAuthStore();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col h-[400px]">
                <div className="h-6 w-32 bg-gray-100 dark:bg-zinc-800 rounded mb-6 animate-pulse" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 dark:bg-zinc-800 animate-pulse rounded-lg" />)}
                </div>
            </div>
        );
    }

    const safeUsers = users || [];

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-md border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users Joined</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar hide-scrollbar">
                {safeUsers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <UsersIconPlaceholder className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-2" />
                        <p className="text-gray-400 dark:text-zinc-600 italic">No recent users found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {safeUsers.map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="shrink-0 p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
                                        <User className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
                                        <div className="flex items-center text-xs text-gray-400 gap-1.5 truncate">
                                            <Mail className="w-3 h-3" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        user.role === 'admin'
                                            ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                                            : "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    )}>
                                        {user.role}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function UsersIconPlaceholder(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
