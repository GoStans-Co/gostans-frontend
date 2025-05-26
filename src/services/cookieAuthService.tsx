import { useCookies } from 'react-cookie';
import { useCallback } from 'react';

export const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
};

const AUTH_COOKIE_NAME = 'authToken';
const USER_COOKIE_NAME = 'userData';

export type UserData = {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
};

/**
 * Custom hook for managing authentication with cookies
 * @returns Object containing cookie auth functions
 */
export default function useCookieAuth() {
    const [cookies, setCookie, removeCookie] = useCookies([AUTH_COOKIE_NAME, USER_COOKIE_NAME]);

    const setAuthCookie = useCallback(
        (token: string, userData: UserData) => {
            setCookie(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
            setCookie(USER_COOKIE_NAME, userData, COOKIE_OPTIONS);
        },
        [setCookie],
    );

    const removeAuthCookie = useCallback(() => {
        removeCookie(AUTH_COOKIE_NAME, { path: '/' });
        removeCookie(USER_COOKIE_NAME, { path: '/' });
    }, [removeCookie]);

    const getAuthToken = useCallback(() => {
        return cookies[AUTH_COOKIE_NAME];
    }, [cookies]);

    const getUserData = useCallback((): UserData | null => {
        return cookies[USER_COOKIE_NAME] || null;
    }, [cookies]);

    const isAuthenticated = useCallback(() => {
        return !!cookies[AUTH_COOKIE_NAME];
    }, [cookies]);

    return {
        setAuthCookie,
        removeAuthCookie,
        getAuthToken,
        getUserData,
        isAuthenticated,
        authToken: cookies[AUTH_COOKIE_NAME],
        userData: cookies[USER_COOKIE_NAME],
    };
}
