import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { apiClient } from '@/services/api/client/httpClient';

type ApiErrorResponse = {
    detail?: string;
    message?: string;
    error?: string;
    [key: string]: unknown;
};

class EnhancedError extends Error {
    detail?: string;
    skipGlobalErrorHandler?: boolean;

    constructor(message: string) {
        super(message);
        this.name = 'EnhancedError';
    }
}

type UseFetchState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
};

export type UseFetchOptions<T = unknown> = Omit<AxiosRequestConfig, 'url'> & {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    skipGlobalErrorHandler?: boolean;
};

export type ExecuteConfig = Omit<AxiosRequestConfig, 'baseURL' | 'timeout'> & {
    skipGlobalErrorHandler?: boolean;
};

export type UseFetchReturn<T> = UseFetchState<T> & {
    execute: (config?: ExecuteConfig) => Promise<T>;
    reset: () => void;
};

/**
 * Custom hook for making HTTP requests with axios
 * @param {string} [url] - The API endpoint URL
 * @param {UseFetchOptions<T>} [options] - Configuration options for the request
 * @returns {UseFetchReturn<T>} Object containing data, loading state, error, and execute function
 */
export function useFetch<T = unknown>(url?: string, options: UseFetchOptions<T> = {}): UseFetchReturn<T> {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const { immediate = false, onSuccess, onError, skipGlobalErrorHandler, ...axiosConfig } = options;
    const onSuccessRef = useRef<((data: T) => void) | undefined>(onSuccess);
    const onErrorRef = useRef<((error: string) => void) | undefined>(onError);
    const axiosConfigRef = useRef<Omit<AxiosRequestConfig, 'url'>>(axiosConfig);

    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    axiosConfigRef.current = axiosConfig;

    const execute = useCallback(
        async (config?: ExecuteConfig): Promise<T> => {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const { skipGlobalErrorHandler, ...restConfig } = config || {};

                const requestConfig: AxiosRequestConfig = {
                    url: url || restConfig?.url,
                    ...axiosConfigRef.current,
                    ...restConfig,
                };

                const response: AxiosResponse<T> = await apiClient(requestConfig);

                setState({
                    data: response.data,
                    loading: false,
                    error: null,
                });

                onSuccessRef.current?.(response.data);
                return response.data;
            } catch (err: unknown) {
                let errorMessage = 'An unexpected error occurred';

                if (err instanceof AxiosError) {
                    if (err.response?.data) {
                        const responseData = err.response.data as ApiErrorResponse;
                        errorMessage =
                            responseData?.detail ||
                            responseData?.message ||
                            responseData?.error ||
                            (typeof responseData === 'string' ? responseData : 'Server error occurred');
                    } else if (err.message) {
                        errorMessage = err.message;
                    }
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }

                setState({
                    data: null,
                    loading: false,
                    error: errorMessage,
                });

                /**
                 * we only call onError if not skipping global error handler
                 */
                if (!config?.skipGlobalErrorHandler) {
                    onErrorRef.current?.(errorMessage);
                }

                const enhancedError = new EnhancedError(errorMessage);
                enhancedError.detail = errorMessage;
                enhancedError.skipGlobalErrorHandler = config?.skipGlobalErrorHandler || false;
                throw enhancedError;
            }
        },
        [url],
    );

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    }, []);

    const immediateCalledRef = useRef<boolean>(false);

    useEffect(() => {
        if (immediate && url && !immediateCalledRef.current) {
            immediateCalledRef.current = true;
            execute();
        }

        if (url) {
            immediateCalledRef.current = false;
        }
    }, [immediate, url, execute]);

    return {
        ...state,
        execute,
        reset,
    };
}
