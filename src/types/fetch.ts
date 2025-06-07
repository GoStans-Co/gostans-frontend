export type ApiResponse<T = any> = {
    data: T;
    statusCode: number;
    message: string;
    error?: string;
    errors?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type ApiError = {
    statusCode: number;
    message: string;
    error?: string;
    errors?: Record<string, string[]>;
};

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type FetchOptions = {
    endpoint: string;
    method: FetchMethod;
    params?: Record<string, string>;
    body?: any;
    headers?: Record<string, string>;
};
