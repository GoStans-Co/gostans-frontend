import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'https://api.gostans.com/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const cookies = document.cookie.split(';').reduce(
            (acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
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

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
        return Promise.reject(error);
    },
);

export { apiClient, API_BASE_URL };
