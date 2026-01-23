'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');
    const isPublicPage = pathname === '/';



    if (!mounted) {
        return null;
    }

    if (isAuthPage || isPublicPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
