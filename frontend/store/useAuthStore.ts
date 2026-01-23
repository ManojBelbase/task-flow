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



    const token = getInitialToken();
    const user = getInitialUser();

    return {
        user,
        token,
        isAuthenticated: !!token,
        setAuth: (user: User, token: string, refreshToken?: string) => {
            localStorage.setItem('token', token);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, token, isAuthenticated: true });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false });
        },
    };
});
