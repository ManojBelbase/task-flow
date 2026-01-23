"use client";
import { useState } from "react";
import {
    useGetTasks,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
} from "@/hooks/useTasks";
import {
    Plus,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    Circle,
} from "lucide-react";
import TaskModal from "@/components/task/TaskModal";
import ViewTaskModal from "@/components/task/ViewTaskModal";
import ConfirmModal from "@/components/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import CustomSelect from "@/components/ui/CustomSelect";
import DataTable, { Column } from "@/components/ui/DataTable";

export default function TasksPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [date, setDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
        "create",
    );

    const { data, isLoading } = useGetTasks({
        page,
        limit: 10,
        status: status || undefined,
        search: search || undefined,
        date: date || undefined,
    });

    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();

    const handleCreate = (formData: any) => {
        createMutation.mutate(formData, {
            onSuccess: () => setIsModalOpen(false),
        });
    };

    const handleUpdate = (formData: any) => {
        updateMutation.mutate(
            { id: selectedTask.id, ...formData },
            {
                onSuccess: () => setIsModalOpen(false),
            },
        );
    };

    const handleDelete = () => {
        if (selectedTask) {
            deleteMutation.mutate(selectedTask.id, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedTask(null);
                },
            });
        }
    };

    const openCreateModal = () => {
        setSelectedTask(null);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const openEditModal = (task: any) => {
        setSelectedTask(task);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const openViewModal = (task: any) => {
        setSelectedTask(task);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const openDeleteModal = (task: any) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const columns: Column<any>[] = [
        {
            header: "Title",
            accessorKey: "title",
            cell: (task) => (
                <div>
                    <span className="font-medium text-gray-900 dark:text-white block truncate max-w-[200px]">
                        {task.title}
                    </span>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (task) => {
                switch (task.status) {
                    case "completed":
                        return (
                            <div className="flex items-center text-green-600">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Completed
                            </div>
                        );
                    case "in_progress":
                        return (
                            <div className="flex items-center text-amber-600">
                                <Clock className="w-4 h-4 mr-2" /> In Progress
                            </div>
                        );
                    default:
                        return (
                            <div className="flex items-center text-gray-500">
                                <Circle className="w-4 h-4 mr-2" /> Pending
                            </div>
                        );
                }
            },
        },
        {
            header: "Created At",
            accessorKey: "createdAt",
            cell: (task) => new Date(task.createdAt).toLocaleDateString(),
        },
    ];

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Your Tasks
                    </h2>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        Manage and track your project tasks efficiently
                    </p>
                </div>
                <Button
                    onClick={openCreateModal}
                    className="flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Task</span>
                </Button>
            </div>

            <div className="flex flex-col xl:flex-row gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className="flex-1 relative">
                    <Input
                        placeholder="Search tasks by title or description..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <div className="w-48">
                            <CustomSelect
                                options={[
                                    { label: "All Statuses", value: "" },
                                    { label: "To Do", value: "pending" },
                                    { label: "In Progress", value: "in_progress" },
                                    { label: "Completed", value: "completed" },
                                ]}
                                value={status}
                                onChange={(val) => {
                                    setStatus(val);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>
                    {/* <div className="w-full sm:w-auto">
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setPage(1);
                            }}
                            className="w-full sm:w-40"
                        />
                    </div> */}
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data?.data || []}
                isLoading={isLoading}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onView={openViewModal}
                pagination={{
                    currentPage: page,
                    totalPages: data?.meta?.totalPages || 1,
                    onPageChange: setPage,
                }}
            />

            {modalMode === "view" ? (
                <ViewTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={selectedTask}
                />
            ) : (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={selectedTask ? handleUpdate : handleCreate}
                    initialData={selectedTask}
                    title={modalMode === "create" ? "Create New Task" : "Edit Task"}
                />
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Task?"
                message="Are you sure you want to delete this task? This action cannot be undone."
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}