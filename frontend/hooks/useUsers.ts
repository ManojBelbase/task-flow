import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export const useAdminUsers = () => {
    const { user: currentUser } = useAuthStore();

    const {
        data: users,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['admin-users', currentUser?.id],
        queryFn: async () => {
            const { data } = await api.get('/users');
            return data;
        },
        enabled: !!currentUser?.id, // 🔴 important
        retry: false,
    });

    return {
        users,
        isLoading,
        error,
        refetch,
        currentUser,
    };
};
