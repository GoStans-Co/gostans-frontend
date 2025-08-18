import { FaApple, FaFacebook, FaTelegram } from 'react-icons/fa';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

type SocialProvider = 'google' | 'apple' | 'facebook' | 'telegram';

type SocialLoginProps = {
    onSocialLogin: (provider: SocialProvider, credential?: string) => void;
};

const SocialLoginContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: ${theme.spacing.md};
    margin: ${theme.spacing.lg} 0;

    @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: ${theme.spacing.md};
        margin: ${theme.spacing.md} 0;
    }
`;

const SocialLoginButton = styled.button<{ provider: Exclude<SocialProvider, 'google'> }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 19px;
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    cursor: pointer;
    transition: ${theme.transitions.default};
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);

    &:hover {
        background: ${(props) => {
            switch (props.provider) {
                case 'apple':
                    return '#f2f2f2';
                case 'facebook':
                    return '#e7f0ff';
                case 'telegram':
                    return '#e7f4ff';
                default:
                    return theme.colors.lightBackground;
            }
        }};
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    svg {
        width: 28px;
        height: 28px;
        color: ${(props) => {
            switch (props.provider) {
                case 'apple':
                    return '#000000';
                case 'facebook':
                    return '#1877F2';
                case 'telegram':
                    return '#0088cc';
                default:
                    return 'inherit';
            }
        }};
    }
`;

const GoogleLoginWrapper = styled.div`
    position: relative;
    width: 56px;
    height: 56px;

    > div {
        opacity: 0;
        width: 56px !important;
        height: 56px !important;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        cursor: pointer;

        > div {
            width: 100% !important;
            height: 100% !important;

            iframe {
                width: 100% !important;
                height: 100% !important;
            }
        }
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 56px;
        height: 56px;
        border-radius: 19px;
        border: 1px solid ${theme.colors.border};
        background: ${theme.colors.background};
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
        transition: ${theme.transitions.default};
        z-index: 1;
        pointer-events: none;
    }

    &:hover::before {
        background: #fef7f7;
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }

    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 28px;
        height: 28px;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 1;
        pointer-events: none;
    }
`;

export default function SocialLogin({ onSocialLogin }: SocialLoginProps) {
    const handleSocialLogin = (provider: SocialProvider) => {
        onSocialLogin(provider);
    };

    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            onSocialLogin('google', credentialResponse.credential);
        } else {
            console.error('Google authentication failed: No credential received');
        }
    };

    const handleManualGoogleLogin = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = `${window.location.origin}`;

        const googleAuthUrl =
            `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${redirectUri}&` +
            `response_type=code&` +
            `scope=openid email profile&` +
            `state=google_login`;

        window.location.href = googleAuthUrl;
    };

    return (
        <SocialLoginContainer>
            <GoogleLoginWrapper>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                        console.error('Google auth failed, trying manual flow');
                        handleManualGoogleLogin();
                    }}
                    useOneTap={false}
                    type="icon"
                    theme="outline"
                    size="large"
                    shape="circle"
                    width={56}
                    auto_select={false}
                    cancel_on_tap_outside={false}
                    use_fedcm_for_prompt={false}
                />
            </GoogleLoginWrapper>

            <SocialLoginButton
                provider="apple"
                onClick={() => handleSocialLogin('apple')}
                aria-label="Sign in with Apple"
            >
                <FaApple />
            </SocialLoginButton>

            <SocialLoginButton
                provider="facebook"
                onClick={() => handleSocialLogin('facebook')}
                aria-label="Sign in with Facebook"
            >
                <FaFacebook />
            </SocialLoginButton>

            <SocialLoginButton
                provider="telegram"
                onClick={() => handleSocialLogin('telegram')}
                aria-label="Sign in with Telegram"
            >
                <FaTelegram />
            </SocialLoginButton>
        </SocialLoginContainer>
    );
}
