import React from 'react';
import { Button } from '@/components/ui/Button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { cn } from '@/lib/utils';

export interface Column<T> {
    header: string;
    accessorKey: keyof T | 'actions';
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    className?: string;
}

export default function DataTable<T extends { id: string | number }>({
    columns,
    data,
    isLoading,
    onView,
    onEdit,
    onDelete,
    pagination,
    className
}: DataTableProps<T>) {
    const hasActions = onView || onEdit || onDelete;

    if (isLoading) {
        return (
            <div className={cn("w-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden", className)}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={idx} className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-20 animate-pulse" />
                                    </th>
                                ))}
                                {hasActions && (
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-right">
                                        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-16 ml-auto animate-pulse" />
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i}>
                                    {columns.map((col, idx) => (
                                        <td key={idx} className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-3/4 animate-pulse" />
                                        </td>
                                    ))}
                                    {hasActions && (
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                                                <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                                                <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("w-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden", className)}>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={cn("px-6 py-4 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap", col.className)}>
                                    {col.header}
                                </th>
                            ))}
                            {hasActions && (
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500 dark:text-zinc-500 italic">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            data.map((item, rowIdx) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                            {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                                        </td>
                                    ))}
                                    {hasActions && (
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end space-x-2">
                                                {onView && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onView(item)}
                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(item)}
                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDelete(item)}
                                                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {pagination && (
                <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.onPageChange}
                    />
                </div>
            )}
        </div>
    );
}
