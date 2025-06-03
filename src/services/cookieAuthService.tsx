import { useCookies } from 'react-cookie';
import { useCallback } from 'react';

export const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    secure: false, // for local machine dev purpose only
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

            setTimeout(() => {
                const savedToken = cookies[AUTH_COOKIE_NAME];
                const savedUser = cookies[USER_COOKIE_NAME];
                console.log('Cookie verification:', {
                    tokenSet: !!savedToken,
                    userSet: !!savedUser,
                    tokenValue: savedToken?.substring(0, 20) + '...',
                    userEmail: savedUser?.email,
                });
            }, 100);
        },
        [setCookie, cookies],
    );

    const removeAuthCookie = useCallback(() => {
        console.log('Removing auth cookies');
        removeCookie(AUTH_COOKIE_NAME, { path: '/' });
        removeCookie(USER_COOKIE_NAME, { path: '/' });
    }, [removeCookie]);

    const getAuthToken = useCallback(() => {
        const token = cookies[AUTH_COOKIE_NAME];
        return token;
    }, [cookies]);

    const getUserData = useCallback((): UserData | null => {
        const userData = cookies[USER_COOKIE_NAME];
        return userData || null;
    }, [cookies]);

    const isAuthenticated = useCallback(() => {
        const token = cookies[AUTH_COOKIE_NAME];
        const userData = cookies[USER_COOKIE_NAME];
        const authenticated = !!(token && userData);

        console.log('isAuthenticated check:', {
            hasToken: !!token,
            hasUserData: !!userData,
            authenticated,
            tokenLength: token?.length,
            userEmail: userData?.email,
        });

        return authenticated;
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
