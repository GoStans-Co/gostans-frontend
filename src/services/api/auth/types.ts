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
    accessToken: string;
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

export type RefreshTokenRequest = {
    refresh: string;
};

export type RefreshTokenResponse = {
    token: string;
    refresh: string;
};

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };
