import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = ''
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center space-x-4 ${className}`}>
            <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );
}
