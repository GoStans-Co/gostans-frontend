import { useState, useEffect, useCallback } from 'react';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiClient } from '@/services/apiClient';

export type UseFetchState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
};

export type UseFetchOptions = AxiosRequestConfig & {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
};

export type UseFetchReturn<T> = UseFetchState<T> & {
    execute: (config?: AxiosRequestConfig) => Promise<T>;
    reset: () => void;
};

/**
 * Custom hook for making HTTP requests with axios
 * @param url - The API endpoint URL
 * @param options - Configuration options for the request
 * @returns Object containing data, loading state, error, and execute function
 */
export function useFetch<T = any>(url?: string, options: UseFetchOptions = {}): UseFetchReturn<T> {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const { immediate = false, onSuccess, onError, ...axiosConfig } = options;

    const execute = useCallback(
        async (config?: AxiosRequestConfig): Promise<T> => {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const requestConfig: AxiosRequestConfig = {
                    url: url || config?.url,
                    ...axiosConfig,
                    ...config,
                };

                const response: AxiosResponse<T> = await apiClient(requestConfig);

                setState({
                    data: response.data,
                    loading: false,
                    error: null,
                });

                onSuccess?.(response.data);
                return response.data;
            } catch (err) {
                const error = err as AxiosError;
                const errorMessage =
                    (error.response?.data as { message?: string })?.message ||
                    error.message ||
                    'An unexpected error occurred';

                setState({
                    data: null,
                    loading: false,
                    error: errorMessage,
                });

                onError?.(errorMessage);
                throw error;
            }
        },
        [url, axiosConfig, onSuccess, onError],
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    }, []);

    useEffect(() => {
        if (immediate && url) {
            execute();
        }
    }, [immediate, url, execute]);

    return {
        ...state,
        execute,
        reset,
    };
}

// import { useState, useEffect, useCallback } from 'react';
// import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// const API_BASE_URL = 'http://18.219.66.105:8000/api';

// const apiClient = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// apiClient.interceptors.request.use(
//     (config) => {
//         const cookies = document.cookie.split(';').reduce(
//             (acc, cookie) => {
//                 const [key, value] = cookie.trim().split('=');
//                 acc[key] = value;
//                 return acc;
//             },
//             {} as Record<string, string>,
//         );

//         const token = cookies['authToken'];
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error),
// );

// apiClient.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//             document.cookie = 'userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//         }
//         return Promise.reject(error);
//     },
// );

// export interface UseFetchState<T> {
//     data: T | null;
//     loading: boolean;
//     error: string | null;
// }

// export interface UseFetchOptions extends AxiosRequestConfig {
//     immediate?: boolean;
//     onSuccess?: (data: any) => void;
//     onError?: (error: string) => void;
// }

// export interface UseFetchReturn<T> extends UseFetchState<T> {
//     execute: (config?: AxiosRequestConfig) => Promise<T>;
//     reset: () => void;
// }

// /**
//  * Custom hook for making HTTP requests with axios
//  * @param url - The API endpoint URL
//  * @param options - Configuration options for the request
//  * @returns Object containing data, loading state, error, and execute function
//  */
// export function useFetch<T = any>(url?: string, options: UseFetchOptions = {}): UseFetchReturn<T> {
//     const [state, setState] = useState<UseFetchState<T>>({
//         data: null,
//         loading: false,
//         error: null,
//     });

//     const { immediate = false, onSuccess, onError, ...axiosConfig } = options;

//     const execute = useCallback(
//         async (config?: AxiosRequestConfig): Promise<T> => {
//             setState((prev) => ({ ...prev, loading: true, error: null }));

//             try {
//                 const requestConfig: AxiosRequestConfig = {
//                     url: url || config?.url,
//                     ...axiosConfig,
//                     ...config,
//                 };

//                 const response: AxiosResponse<T> = await apiClient(requestConfig);

//                 setState({
//                     data: response.data,
//                     loading: false,
//                     error: null,
//                 });

//                 onSuccess?.(response.data);
//                 return response.data;
//             } catch (err) {
//                 const error = err as AxiosError;
//                 const errorMessage =
//                     (error.response?.data as { message?: string })?.message ||
//                     error.message ||
//                     'An unexpected error occurred';

//                 setState({
//                     data: null,
//                     loading: false,
//                     error: errorMessage,
//                 });

//                 onError?.(errorMessage);
//                 throw error;
//             }
//         },
//         [url, axiosConfig, onSuccess, onError],
//     );

//     const reset = useCallback(() => {
//         setState({
//             data: null,
//             loading: false,
//             error: null,
//         });
//     }, []);

//     useEffect(() => {
//         if (immediate && url) {
//             execute();
//         }
//     }, [immediate, url, execute]);

//     return {
//         ...state,
//         execute,
//         reset,
//     };
// }

// export { apiClient as axiosInstance, API_BASE_URL as apiBaseUrl };
