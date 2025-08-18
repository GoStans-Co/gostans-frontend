import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApiServices } from '@/services/api';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: ${theme.colors.background};
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid ${theme.colors.border};
    border-top: 3px solid ${theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const LoadingText = styled.div`
    margin-top: ${theme.spacing.md};
    color: ${theme.colors.text};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.md};
`;

const ErrorText = styled.div`
    color: ${theme.colors.error};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.md};
    text-align: center;
    margin-top: ${theme.spacing.md};
`;

export default function OAuthRedirect() {
    const [searchParams] = useSearchParams();
    const { auth: authService } = useApiServices();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const error = searchParams.get('error');

                if (error) {
                    setError('Authentication was cancelled or failed');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                    return;
                }

                if (!code || state !== 'google_login') {
                    setError('Invalid OAuth callback parameters');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                    return;
                }

                const socialData = {
                    provider: 'google' as const,
                    id_token: code,
                };

                const result = await authService.socialLogin(socialData);

                if (result && result.statusCode === 200) {
                    window.location.href = '/';
                } else {
                    setError('Login failed. Please try again.');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 3000);
                }
            } catch (error) {
                console.error('OAuth callback failed:', error);
                setError('Authentication failed. Please try again.');
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } finally {
                setIsLoading(false);
            }
        };

        handleOAuthCallback();
    }, [searchParams, authService]);

    if (error) {
        return (
            <LoadingContainer>
                <ErrorText>{error}</ErrorText>
                <LoadingText>Redirecting...</LoadingText>
            </LoadingContainer>
        );
    }

    return (
        <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>{isLoading ? 'Processing your login...' : 'Redirecting...'}</LoadingText>
        </LoadingContainer>
    );
}
