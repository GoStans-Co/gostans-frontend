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
                    (error.response?.data as { detail?: string })?.detail ||
                    (error.response?.data as { message?: string })?.message ||
                    error.message ||
                    'An unexpected error occurred';

                setState({
                    data: null,
                    loading: false,
                    error: errorMessage,
                });

                onError?.(errorMessage);

                const enhancedError = new Error(errorMessage);
                (enhancedError as any).detail = errorMessage;
                throw enhancedError;
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
