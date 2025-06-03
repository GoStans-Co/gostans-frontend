import { useFetch } from '@/hooks/useFetch';
import useCookieAuth from '@/services/cookieAuthService';
import { AuthResponse, LoginCredentials, SignUpData, SocialLoginData, SocialLoginResponse } from '@/types/auth';

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
    } = useFetch<SocialLoginResponse>();

    const { loading: logoutLoading, error: logoutError, execute: executeLogout, reset: resetLogout } = useFetch();

    /**
     * Login user with email/phone and password
     * @param credentials - Login credentials
     * @returns Promise<AuthResponse>
     */
    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        console.log('Starting login process...');

        try {
            const response = await executeLogin({
                url: '/auth/login/',
                method: 'POST',
                data: credentials,
            });

            console.log('Login API response received:', {
                hasResponse: !!response,
                hasToken: !!response?.token,
                hasUser: !!response?.user,
                tokenLength: response?.token?.length,
                userKeys: response?.user ? Object.keys(response.user) : [],
                userEmail: response?.user?.email,
            });

            if (response?.token && response?.user) {
                setAuthCookie(response.token, response.user);
            } else {
                console.error('Login response structure invalid:', {
                    response,
                    hasToken: !!response?.token,
                    hasUser: !!response?.user,
                });
                throw new Error('Invalid login response structure');
            }

            return response;
        } catch (error) {
            console.error('Login error details:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
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

            if (response.token && response.user) {
                setAuthCookie(response.token, response.user);
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
            console.log('Full social login response:', response);
            const apiResponse = response as unknown as SocialLoginResponse;
            const authData = apiResponse.data;

            if (authData && authData.access_token && authData.id) {
                console.log('Setting cookies with:', authData.access_token, authData);

                const userForCookie = {
                    id: authData.id,
                    email: authData.email,
                    name: authData.name,
                    phone: authData.phone,
                    avatar: authData.imageURL,
                };

                setAuthCookie(authData.access_token, userForCookie);

                return {
                    token: authData.access_token,
                    refresh: authData.refresh,
                    user: userForCookie,
                };
            } else {
                console.log('Auth data structure:', Object.keys(authData || {}));
                console.log('Missing access_token or user data:', authData);
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    /**
     * Logout user
     * @returns Promise<void>
     */
    const logout = async (): Promise<void> => {
        console.log('Starting logout process...');

        try {
            await executeLogout({
                url: '/auth/logout/',
                method: 'POST',
            });
            console.log('Logout API call successful');
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            removeAuthCookie();
            console.log('Logout process completed');
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
