import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardStats = () => {
    const { user } = useAuthStore();
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats', user?.id],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/stats');
            return data;
        },
    });
    return { stats, isLoading };
}