import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
    // Shared helper for initialization to avoid client/server mismatch issues during first render
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false });
        },
    };
});
