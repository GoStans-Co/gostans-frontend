import { useCookies } from 'react-cookie';
import axios from 'axios';

export type User = {
    id: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
};

export const useCookieAuth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['auth_token', 'auth_user']);

    // we get the user from cookie
    const user: User | null = cookies.auth_user ? JSON.parse(cookies.auth_user) : null;
    const isAuthenticated = !!cookies.auth_token;

    const login = async (emailOrPhone: string) => {
        try {
            //later we will change it
            const mockResponse = {
                data: {
                    token: 'mock-token-123',
                    user: {
                        id: '1',
                        name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'User',
                        email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
                        phoneNumber: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
                    },
                },
            };

            const { token, user } = mockResponse.data;
            setCookie('auth_token', token, { path: '/', maxAge: 86400 }); // 24 hours
            setCookie('auth_user', JSON.stringify(user), { path: '/', maxAge: 86400 });

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return user;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (name: string, email: string, phoneNumber: string) => {
        try {
            const mockResponse = {
                data: {
                    token: 'mock-token-123',
                    user: {
                        id: '1',
                        name,
                        email,
                        phoneNumber,
                    },
                },
            };

            const { token, user } = mockResponse.data;
            setCookie('auth_token', token, { path: '/', maxAge: 86400 }); // 24 hours
            setCookie('auth_user', JSON.stringify(user), { path: '/', maxAge: 86400 });

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return user;
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    const logout = () => {
        removeCookie('auth_token', { path: '/' });
        removeCookie('auth_user', { path: '/' });
        delete axios.defaults.headers.common['Authorization'];
    };

    // we initialize the axios header if token exists
    if (cookies.auth_token && !axios.defaults.headers.common['Authorization']) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${cookies.auth_token}`;
    }

    return {
        isAuthenticated,
        user,
        login,
        signup,
        logout,
    };
};

export default useCookieAuth;
