export type LoginCredentials = {
    email_or_phone: string;
    password: string;
};

export type SignUpData = {
    email: string;
    phone: string;
    name: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    refresh: string;
    ip_address?: string;
    user: {
        id: string;
        email: string;
        name: string;
        phone: string;
    };
};

export type ApiResponse<T> = {
    message: string;
    data: T;
    statusCode: number;
};

export type SocialAuthResponse = {
    id: string;
    email: string;
    name: string;
    phone: string;
    refresh: string;
    access_token: string;
    imageURL: string;
    oauthProvider: string;
    oauthId: string;
    providerId: string;
};

export type SocialLoginResponse = ApiResponse<SocialAuthResponse>;

export type SocialLoginData = {
    provider: 'google' | 'facebook' | 'twitter';
    id_token: string;
};
