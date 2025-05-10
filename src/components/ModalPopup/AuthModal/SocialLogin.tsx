import { FaGoogle, FaApple, FaFacebook, FaTelegram } from 'react-icons/fa';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

type SocialProvider = 'google' | 'apple' | 'facebook' | 'telegram';

interface SocialLoginProps {
    onSocialLogin: (provider: SocialProvider) => void;
}

const SocialLoginContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: ${theme.spacing.md};
    margin: ${theme.spacing.lg} 0;
`;

const SocialLoginButton = styled.button<{ provider: SocialProvider }>`
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

    /* provider-specific hover styles */
    &:hover {
        background: ${(props) => {
            switch (props.provider) {
                case 'google':
                    return '#f2f2f2';
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

    /* provider-specific icon colors */
    svg {
        width: 28px;
        height: 28px;
        color: ${(props) => {
            switch (props.provider) {
                case 'google':
                    return '#4285F4';
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

export default function SocialLogin({ onSocialLogin }: SocialLoginProps) {
    const handleSocialLogin = (provider: SocialProvider) => {
        console.log(`Logging in with ${provider}`);
        onSocialLogin(provider);
    };

    return (
        <SocialLoginContainer>
            <SocialLoginButton
                provider="google"
                onClick={() => handleSocialLogin('google')}
                aria-label="Sign in with Google"
            >
                <FaGoogle />
            </SocialLoginButton>

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
