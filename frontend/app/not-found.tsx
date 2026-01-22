'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 transition-colors duration-200">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                        <FileQuestion className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">404 - Not Found</h1>
                <p className="text-gray-500 dark:text-zinc-400 mb-8">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link href="/">
                    <Button className="w-full">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    );
}
