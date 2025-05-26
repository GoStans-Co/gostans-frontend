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
    access: string;
    refresh: string;
    user: {
        id: string;
        email: string;
        name: string;
        phone?: string;
    };
};

export type SocialLoginData = {
    provider: 'google' | 'facebook' | 'twitter';
    id_token: string;
};
