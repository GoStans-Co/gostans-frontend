import { useFetch, UseFetchOptions, UseFetchReturn } from '@/hooks/api/useFetch';
import { ApiResponse } from '@/types/common/fetch';

/**
 * Type-safe wrapper around useFetch that properly handles API responses
 * @param {string} [url] - The API endpoint URL
 * @param {UseFetchOptions<ApiResponse<T>>} [options] - Configuration options
 * @returns {UseFetchReturn<ApiResponse<T>>} Typed fetch hook return
 */
export function useTypedFetch<T = unknown>(
    url?: string,
    options: UseFetchOptions<ApiResponse<T>> = {},
): UseFetchReturn<ApiResponse<T>> {
    return useFetch<ApiResponse<T>>(url, options);
}

/**
 * Type-safe execute function that handles API responses with proper typing
 * @param {Function} fetchFn - The fetch function from useFetch
 * @param {any} config - Request configuration
 * @returns {Promise<ApiResponse<T>>} Properly typed API response
 */
export async function executeTypedRequest<T>(
    fetchFn: (config: any) => Promise<unknown>,
    config: any,
): Promise<ApiResponse<T>> {
    const response = await fetchFn(config);
    return response as ApiResponse<T>;
}

/**
 * Safely extracts data from API response with type assertion
 * @param {unknown} response - Raw response from API
 * @returns {T} Typed data
 */
export function extractApiData<T>(response: unknown, defaultValue?: T): T {
    if (response && typeof response === 'object' && response !== null && 'data' in response) {
        const apiResponse = response as ApiResponse<T>;
        return apiResponse.data;
    }

    if (response) {
        return response as T;
    }

    if (defaultValue !== undefined) {
        return defaultValue;
    }

    /* for null/undefined response, return a type-safe empty object */
    return {} as T;
}

/**
 * Safely extracts status code from API response
 * @param {unknown} response - Raw response from API
 * @returns {number} Status code
 */
export function extractStatusCode(response: unknown): number {
    if (!response) {
        return 200;
    }

    const apiResponse = response as ApiResponse<unknown>;
    return apiResponse.statusCode || 200;
}

/**
 * Safely extracts message from API response
 * @param {unknown} response - Raw response from API
 * @param {string} fallback - Fallback message
 * @returns {string} Message
 */
export function extractMessage(response: unknown, fallback: string = 'Success'): string {
    if (!response) {
        return fallback;
    }

    const apiResponse = response as ApiResponse<unknown>;
    return apiResponse.message || fallback;
}
