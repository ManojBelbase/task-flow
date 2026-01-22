'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Users, Mail, Shield, Calendar, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
    const { user: currentUser } = useAuthStore();
    const { data: users, isLoading, error, refetch } = useQuery({
        queryKey: ['admin-users', currentUser?.id],
        queryFn: async () => {
            const { data } = await api.get('/users');
            return data;
        },
        retry: false,
    });

    const [isDeleting, setIsDeleting] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    const handleDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/users/${userToDelete.id}`);
            toast.success('User deleted successfully');
            refetch();
            setUserToDelete(null);
        } catch (error) {
            toast.error('Failed to delete user');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm text-gray-500 dark:text-zinc-400">Loading users...</p>
            </div>
        );
    }

    if (error) {
        const isForbidden = (error as any)?.response?.status === 403;
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center max-w-md mx-auto">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isForbidden ? 'Access Denied' : 'Failed to Load Users'}
                    </h3>
                    <p className="text-gray-500 dark:text-zinc-400">
                        {isForbidden
                            ? "You don't have permission to view this page. Please make sure you are logged in as an administrator."
                            : "There was an error fetching the user list. Please try again later."}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button onClick={() => refetch()} variant="secondary">Try Again</Button>
                    <Link href="/dashboard">
                        <Button variant="ghost">Return to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800/50 px-3 py-1 rounded-full border border-gray-100 dark:border-zinc-800">
                    Total: <span className="font-bold text-indigo-600 dark:text-indigo-400">{users?.length || 0}</span>
                </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-md border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                            <tr>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 text-sm">
                            {users?.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 dark:text-white capitalize">{user.name || 'N/A'}</span>
                                            <span className="flex items-center text-xs text-gray-500 dark:text-zinc-400 mt-1">
                                                <Mail className="w-3 h-3 mr-1" /> {user.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-tight ${user.role?.toUpperCase() === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}>
                                            <Shield className="w-3 h-3 mr-1" /> {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                                        <span className="flex items-center text-xs">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" /> {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {currentUser?.id !== user.id && (
                                            <button
                                                onClick={() => setUserToDelete(user)}
                                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all group"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users?.length === 0 && (
                        <div className="py-20 text-center text-gray-400 dark:text-zinc-500 italic">
                            No other users found.
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete ${userToDelete?.name || userToDelete?.email}? This action cannot be undone.`}
                isLoading={isDeleting}
            />
        </div>
    );
}
