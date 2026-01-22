'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, LogOut, CheckSquare, LayoutDashboard, ListTodo, Users } from 'lucide-react';
import { Button } from './ui/Button';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 transition-colors duration-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <CheckSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">TaskFlow</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/dashboard" className="flex items-center space-x-1 text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link href="/tasks" className="flex items-center space-x-1 text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                <ListTodo className="w-4 h-4" />
                                <span>Tasks</span>
                            </Link>
                            {user?.role?.toUpperCase() === 'ADMIN' && (
                                <Link href="/users" className="flex items-center space-x-1 text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    <Users className="w-4 h-4" />
                                    <span>Users</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleTheme}
                            className="p-2"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </Button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-800 mx-2" />

                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</span>
                                <span className="text-xs text-gray-500 dark:text-zinc-400 capitalize">{user?.role}</span>
                            </div>

                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleLogout}
                                className="flex items-center space-x-1"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
