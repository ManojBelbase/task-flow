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
    const refreshToken = getInitialRefreshToken();
    const user = getInitialUser();

    return {
        user,
        token,
        refreshToken,
        isAuthenticated: !!token,
        setAuth: (user, token, refreshToken) => {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, token, refreshToken, isAuthenticated: true });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
        },
    };
});
