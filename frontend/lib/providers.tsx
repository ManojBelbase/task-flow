'use client';

import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <ThemeProvider>
                {children}
                <Toaster position="top-right" reverseOrder={false} />
            </ThemeProvider>
        </QueryProvider>
    );
}
