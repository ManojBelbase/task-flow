'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            setAuth(data.user, data.accessToken, data.refreshToken);
            toast.success('Account created successfully!');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 p-4">
            <div className="max-w-md w-full p-8 bg-white dark:bg-zinc-900 rounded-md shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mb-4">
                        <UserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
                    <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm text-center">Join TaskFlow to manage your tasks efficiently</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                    />
                    <Input
                        label="Email address"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                    />
                    <Input
                        label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        variant="primary"
                        isLoading={loading}
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600 dark:text-zinc-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
