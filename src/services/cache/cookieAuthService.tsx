import { useCookies } from 'react-cookie';
import { useCallback } from 'react';

export const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
    secure: false, // will set to true in production
    sameSite: 'lax' as const,
};

const AUTH_COOKIE_NAME = 'authToken';
const USER_COOKIE_NAME = 'userData';
const REFRESH_COOKIE_NAME = 'refreshToken';

export type UserData = {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
};

/**
 * Custom hook to manage authentication cookies.
 * @description This hook provides methods to set, remove, and
 * retrieve authentication tokens and user data from cookies.
 * It also includes a method to check if the user is authenticated
 * based on the presence of these cookies.
 */
export default function useCookieAuthService() {
    const [cookies, setCookie, removeCookie] = useCookies([AUTH_COOKIE_NAME, USER_COOKIE_NAME, REFRESH_COOKIE_NAME]);

    const setAuthCookie = useCallback(
        (token: string, userData: UserData, refreshToken?: string) => {
            setCookie(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
            setCookie(USER_COOKIE_NAME, userData, COOKIE_OPTIONS);

            if (refreshToken) {
                setCookie(REFRESH_COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
            }

            setTimeout(() => {
                const savedToken = cookies[AUTH_COOKIE_NAME];
                const savedUser = cookies[USER_COOKIE_NAME];
                const savedRefresh = cookies[REFRESH_COOKIE_NAME];
                console.log('Cookie verification:', {
                    tokenSet: !!savedToken,
                    userSet: !!savedUser,
                    refreshSet: !!savedRefresh,
                    tokenValue: savedToken?.substring(0, 20) + '...',
                    userEmail: savedUser?.email,
                });
            }, 100);
        },
        [setCookie, cookies],
    );

    const removeAuthCookie = useCallback(() => {
        removeCookie(AUTH_COOKIE_NAME, { path: '/' });
        removeCookie(USER_COOKIE_NAME, { path: '/' });
        removeCookie(REFRESH_COOKIE_NAME, { path: '/' });
    }, [removeCookie]);

    const getRefreshToken = useCallback(() => {
        return cookies[REFRESH_COOKIE_NAME];
    }, [cookies]);

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
        getRefreshToken,
        getUserData,
        isAuthenticated,
        authToken: cookies[AUTH_COOKIE_NAME],
        refreshToken: cookies[REFRESH_COOKIE_NAME],
        userData: cookies[USER_COOKIE_NAME],
    };
}
