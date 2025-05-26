import { useFetch } from '@/hooks/useFetch';
import useCookieAuth from '@/services/cookieAuthService';
import { AuthResponse, LoginCredentials, SignUpData, SocialLoginData } from '@/types/auth';

/**
 * Custom hook for authentication operations
 * @returns Object containing authentication functions and states
 */
export function useAuthenticateUser() {
    const { setAuthCookie, removeAuthCookie } = useCookieAuth();
    const {
        data: loginData,
        loading: loginLoading,
        error: loginError,
        execute: executeLogin,
        reset: resetLogin,
    } = useFetch<AuthResponse>();

    const {
        data: signupData,
        loading: signupLoading,
        error: signupError,
        execute: executeSignup,
        reset: resetSignup,
    } = useFetch<AuthResponse>();

    const {
        data: socialLoginData,
        loading: socialLoginLoading,
        error: socialLoginError,
        execute: executeSocialLogin,
        reset: resetSocialLogin,
    } = useFetch<AuthResponse>();

    const { loading: logoutLoading, error: logoutError, execute: executeLogout, reset: resetLogout } = useFetch();

    /**
     * Login user with email/phone and password
     * @param credentials - Login credentials
     * @returns Promise<AuthResponse>
     */
    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await executeLogin({
                url: '/auth/login/',
                method: 'POST',
                data: credentials,
            });

            if (response.access && response.user) {
                setAuthCookie(response.access, response.user);
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Sign up new user
     * @param userData - User registration data
     * @returns Promise<AuthResponse>
     */
    const signUp = async (userData: SignUpData): Promise<AuthResponse> => {
        try {
            const response = await executeSignup({
                url: '/auth/sign-up/',
                method: 'POST',
                data: userData,
            });

            if (response.access && response.user) {
                setAuthCookie(response.access, response.user);
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Social login (Google, Facebook, etc.)
     * @param socialData - Social login data
     * @returns Promise<AuthResponse>
     */
    const socialLogin = async (socialData: SocialLoginData): Promise<AuthResponse> => {
        try {
            const url = socialData.provider === 'google' ? '/auth/google/' : `/auth/${socialData.provider}/`;

            const response = await executeSocialLogin({
                url: url,
                method: 'POST',
                data: { id_token: socialData.id_token },
            });

            if (response.access && response.user) {
                setAuthCookie(response.access, response.user);
            }

            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Logout user
     * @returns Promise<void>
     */
    const logout = async (): Promise<void> => {
        try {
            await executeLogout({
                url: '/auth/logout/',
                method: 'POST',
            });

            removeAuthCookie();
        } catch (error) {
            removeAuthCookie();
            throw error;
        }
    };

    /**
     * Reset password
     * @param email - User email
     * @returns Promise<void>
     */
    const forgotPassword = async (email: string): Promise<void> => {
        try {
            await executeLogout({
                url: '/auth/forgot-password/',
                method: 'POST',
                data: { email },
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * Reset all authentication states
     */
    const resetAll = () => {
        resetLogin();
        resetSignup();
        resetSocialLogin();
        resetLogout();
    };

    return {
        login,
        loginData,
        loginLoading,
        loginError,
        resetLogin,

        signUp,
        signupData,
        signupLoading,
        signupError,
        resetSignup,

        socialLogin,
        socialLoginData,
        socialLoginLoading,
        socialLoginError,
        resetSocialLogin,

        logout,
        logoutLoading,
        logoutError,

        resetLogout,
        forgotPassword,
        resetAll,
    };
}
