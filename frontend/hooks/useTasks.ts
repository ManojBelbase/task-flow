import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

export const useGetTasks = (params: { page: number; limit: number; status?: string; search?: string }) => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ["tasks", user?.id, params],
        queryFn: async () => {
            const { data } = await api.get("/tasks", { params });
            return data;
        },
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newTask: any) => {
            const { data } = await api.post("/tasks", newTask);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Task created successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create task");
        }
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updatedTask }: any) => {
            const { data } = await api.patch(`/tasks/${id}`, updatedTask);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Task updated successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update task");
        }
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/tasks/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            toast.success("Task deleted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete task");
        }
    });
};
