import { create } from 'zustand';


export const useAuthStore = create<AuthState>((set) => {
    const getInitialUser = () => {
        if (typeof window === 'undefined') return null;
        try {
            const userJson = localStorage.getItem('user');
            return userJson ? JSON.parse(userJson) : null;
        } catch (e) {
            return null;
        }
    };

    const getInitialToken = () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    };

    const getInitialRefreshToken = () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('refreshToken');
    };

    const token = getInitialToken();
    const user = getInitialUser();

    return {
        user,
        token,
        isAuthenticated: !!token,
        setAuth: (user, token) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, token, isAuthenticated: true });
        },
        logout: () => {
            console.log('🚪 Logic: Logging out from store...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false });
        },
    };
});
