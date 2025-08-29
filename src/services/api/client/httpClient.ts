import { profileCacheManager } from '@/utils/profileCacheManager';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { queryClient } from '@/providers/QueryProviders';

type CustomInternalAxiosRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

const API_BASE_URL = 'https://api.gostans.com/api/v1';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

apiClient.interceptors.request.use(
    (config) => {
        const token = getCookie('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomInternalAxiosRequestConfig;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/') &&
            getCookie('refreshToken')
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = getCookie('refreshToken');

                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token/`,
                    { refresh: refreshToken },
                    { headers: { 'Content-Type': 'application/json' } },
                );

                if (refreshResponse.data?.data?.token) {
                    const newToken = refreshResponse.data.data.token;
                    const newRefreshToken = refreshResponse.data.data.refresh;

                    document.cookie = `authToken=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
                    document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;

                    profileCacheManager.clearCache();
                    queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);

                ['authToken', 'userData', 'refreshToken'].forEach((name) => {
                    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
                });

                profileCacheManager.clearCache();

                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);

export { apiClient, API_BASE_URL };
