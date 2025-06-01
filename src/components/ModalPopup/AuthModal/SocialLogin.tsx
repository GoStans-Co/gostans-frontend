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
    width: 56px;
    height: 56px;
    position: relative;

    & > div {
        width: 56px !important;
        height: 56px !important;
        border-radius: 19px !important;
        overflow: hidden;
    }

    & iframe {
        width: 56px !important;
        height: 56px !important;
        border-radius: 19px !important;
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
        pointer-events: none;
        z-index: 1;
    }

    &::after {
        content: 'G';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Product Sans', sans-serif;
        font-size: 25px;
        font-weight: 800;
        color: #4285f4;
        pointer-events: none;
        z-index: 2;
    }

    &:hover::before {
        background: #f2f2f2;
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

export default function SocialLogin({ onSocialLogin }: SocialLoginProps) {
    const handleSocialLogin = (provider: SocialProvider) => {
        console.log(`Logging in with ${provider}`);
        onSocialLogin(provider);
    };

    const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            console.log('Google authentication successful:', credentialResponse);
            onSocialLogin('google', credentialResponse.credential);
        } else {
            console.error('Google authentication failed: No credential received');
        }
    };

    const handleGoogleError = () => {
        console.error('Google authentication failed');
    };

    return (
        <SocialLoginContainer>
            <GoogleLoginWrapper>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    type="icon"
                    theme="outline"
                    size="medium"
                    shape="circle"
                    width="56"
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
