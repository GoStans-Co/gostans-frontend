import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

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

// Request interceptor to add token
apiClient.interceptors.request.use(
    (config) => {
        const cookies = document.cookie.split(';').reduce(
            (acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                if (key && value) {
                    acc[key] = decodeURIComponent(value);
                }
                return acc;
            },
            {} as Record<string, string>,
        );

        const token = cookies['authToken'];
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomInternalAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token from cookies
                const cookies = document.cookie.split(';').reduce(
                    (acc, cookie) => {
                        const [key, value] = cookie.trim().split('=');
                        if (key && value) {
                            acc[key] = decodeURIComponent(value);
                        }
                        return acc;
                    },
                    {} as Record<string, string>,
                );

                const refreshToken = cookies['refreshToken'];

                if (refreshToken) {
                    // Attempt to refresh token
                    const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token/`, {
                        refresh: refreshToken,
                    });

                    if (refreshResponse.data?.data?.token) {
                        const newToken = refreshResponse.data.data.token;
                        const newRefreshToken = refreshResponse.data.data.refresh;

                        // Update cookies with new tokens
                        document.cookie = `authToken=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
                        document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;

                        // Retry original request with new token
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return apiClient(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear all auth cookies if refresh fails
                document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                // Optionally redirect to login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        // For any 401 that couldn't be handled, clear auth
        if (error.response?.status === 401) {
            document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        return Promise.reject(error);
    },
);

export { apiClient, API_BASE_URL };
