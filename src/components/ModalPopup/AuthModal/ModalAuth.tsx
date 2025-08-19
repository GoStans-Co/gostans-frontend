import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/common/Input';
import Modal from '@/components/Modal';
import SocialLogin from '@/components/ModalPopup/AuthModal/SocialLogin';
import PhoneVerification from '@/components/ModalPopup/AuthModal/PhoneVerification';
import { message } from 'antd';
import PasswordComponent from '@/components/ModalPopup/AuthModal/PasswordComponent';
import { LoginCredentials, SignUpData } from '@/services/api/auth';
import { useApiServices } from '@/services/api';
import { useStatusHandler } from '@/hooks/api/useStatusHandler';
import useCookieAuthService from '@/services/cache/cookieAuthService';
import TelegramVerification from '@/components/ModalPopup/AuthModal/TelegramOtpVerify';
import ForgotPassword from '@/components/Password/ForgotPassword';

enum SignupStage {
    FORM = 'form',
    PASSWORD = 'password',
    PHONE_VERIFICATION = 'phone_verification',
    COMPLETE = 'complete',
}

type ModalAuthProps = {
    onClose: () => void;
    initialTab?: 'login' | 'signup';
};

const AuthContentHeader = styled.div`
    text-align: center;
    margin-bottom: ${theme.spacing.xl};
`;

const AuthTitle = styled.h2`
    color: ${theme.colors.primary};
    font-family: ${theme.typography.fontFamily.display};
    font-weight: ${theme.typography.fontWeight.bold};
    font-size: ${theme.fontSizes.xl};
    margin: 0;
    margin-bottom: ${theme.spacing.md};
`;

const TabContainer = styled.div`
    display: flex;
    margin-bottom: ${theme.spacing['2xl']};
    border-radius: ${theme.borderRadius.md};
    overflow: hidden;
    background: ${theme.colors.lightBackground};
    border: 1px solid ${theme.colors.border};
`;

const Tab = styled.button<{ active: boolean }>`
    flex: 1;
    padding: 0.8rem;
    background: ${({ active }) => (active ? theme.colors.background : 'transparent')};
    color: ${({ active }) => (active ? theme.colors.primary : theme.colors.lightText)};
    font-weight: ${({ active }) => (active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium)};
    border: none;
    cursor: pointer;
    transition: ${theme.transitions.default};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.md};

    &:hover {
        background: ${({ active }) => !active && theme.colors.grayBackground};
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
`;

const InputField = styled.div`
    // margin-bottom: ${theme.spacing.md};
`;

const ForgotPasswordLink = styled.a`
    color: ${theme.colors.secondary};
    text-align: right;
    font-size: ${theme.fontSizes.sm};
    text-decoration: none;
    cursor: pointer;
    font-family: ${theme.typography.fontFamily.body};
    display: block;

    &:hover {
        text-decoration: underline;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: ${theme.spacing.md};
    background: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.md};
    font-weight: ${theme.typography.fontWeight.bold};
    cursor: pointer;
    transition: ${theme.transitions.default};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.md};

    &:hover {
        background: ${theme.colors.secondary};
    }

    &:disabled {
        background: ${theme.colors.lightText};
        cursor: not-allowed;
    }
`;

const OrDivider = styled.div`
    display: flex;
    align-items: center;
    margin: ${theme.spacing.lg} 0;
    color: ${theme.colors.lightText};
    font-size: ${theme.fontSizes.sm};

    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid ${theme.colors.border};
    }

    span {
        margin: 0 ${theme.spacing.md};
    }
`;

const SignupPrompt = styled.div`
    text-align: center;
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.lightText};
    margin-top: ${theme.spacing.lg};
    font-family: ${theme.typography.fontFamily.body};

    a {
        color: ${theme.colors.secondary};
        font-weight: ${theme.typography.fontWeight.bold};
        text-decoration: none;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export default function ModalAuth({ onClose, initialTab = 'login' }: ModalAuthProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const emailCheckTimer = useRef<NodeJS.Timeout | null>(null);

    const { auth: authService, cart } = useApiServices();
    const statusHandler = useStatusHandler();
    const { handleAsyncOperation, execute } = useStatusHandler(messageApi);

    const { isAuthenticated } = useCookieAuthService();

    const [debouncedEmail, setDebouncedEmail] = useState('');
    const [emailValidMessage, setEmailValidMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [signupStage, setSignupStage] = useState<SignupStage>(SignupStage.FORM);
    const [isLoading, setIsLoading] = useState(false);
    const [telegramStage, setTelegramStage] = useState(false);
    const [telegramLoading, setTelegramLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [shouldCheckEmail, setShouldCheckEmail] = useState(false);

    useEffect(() => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setSuccess('');
        setEmailValidMessage('');
    }, [activeTab]);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        if (isAuthenticated()) {
            const timer = setTimeout(() => {
                onClose();
                window.location.href = '/';
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, onClose]);

    useEffect(() => {
        const checkEmail = async () => {
            if (activeTab !== 'signup' || !debouncedEmail || !shouldCheckEmail) return;

            const exists = await authService.checkEmailExists(debouncedEmail);
            console.log('Email check result:', exists);

            if (exists) {
                messageApi.error('Email already exists');
                setEmailValidMessage('Email already exists');
            } else {
                setEmailValidMessage('Email is available to sign up');
            }

            setShouldCheckEmail(false);
        };

        checkEmail();
    }, [debouncedEmail, activeTab, shouldCheckEmail]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess('');

        try {
            if (activeTab === 'login') {
                if (!email && !phoneNumber) {
                    throw new Error('Email or phone number is required');
                }
                if (!password) {
                    throw new Error('Password is required');
                }

                const credentials: LoginCredentials = {
                    email_or_phone: email || phoneNumber,
                    password,
                };

                const { data, error } = await handleAsyncOperation(() => authService.login(credentials), {
                    loadingMessage: 'Logging in...',
                    showSuccess: false,
                    showError: false,
                    onSuccess: () => {},
                });

                if (error) {
                    statusHandler.showMessage('error', error.message, 4);
                    return;
                }

                if (data?.success) {
                    statusHandler.showMessage('success', 'Login successful!');
                    /* then we  sync cart and redirect to home */
                    await cart.syncCartOnLogin();
                    setTimeout(() => {
                        onClose();
                        window.location.href = '/';
                    }, 500);
                } else {
                    const errorMessage = data?.error || 'Login failed. Please check your credentials.';
                    statusHandler.showMessage('error', errorMessage, 4);
                }
            } else {
                /* for signup only, we validate name and email, then go to password step */
                if (!name) throw new Error('Name is required');
                if (!email) throw new Error('Email is required for signup');

                setSignupStage(SignupStage.PASSWORD);
            }
        } catch (err) {
            statusHandler.showMessage('error', err instanceof Error ? err.message : 'An error occurred', 4);
        }
    };

    const handleSocialLogin = async (provider: string) => {
        if (provider === 'telegram') {
            setTelegramStage(true);
            return;
        }

        if (provider === 'google' || provider === 'facebook' || provider === 'apple') {
            const clientIds = {
                google: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                facebook: import.meta.env.VITE_FACEBOOK_APP_ID,
                apple: import.meta.env.VITE_APPLE_CLIENT_ID,
            };

            const clientId = clientIds[provider as keyof typeof clientIds];
            if (!clientId) {
                messageApi.error(`${provider} Client ID not configured`);
                return;
            }

            const redirectUri =
                window.location.hostname === 'localhost'
                    ? 'http://localhost:5173/oauth2/redirect'
                    : 'https://gostans.com/oauth2/redirect';

            let authUrl = '';

            if (provider === 'google') {
                const params = new URLSearchParams({
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    response_type: 'code',
                    scope: 'openid email profile',
                    state: `${provider}_login`,
                    access_type: 'online',
                    prompt: 'select_account',
                });
                authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
            } else if (provider === 'facebook') {
                const params = new URLSearchParams({
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    response_type: 'code',
                    scope: 'email,public_profile',
                    state: `${provider}_login`,
                });
                authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
            } else if (provider === 'apple') {
                const params = new URLSearchParams({
                    client_id: clientId,
                    redirect_uri: redirectUri,
                    response_type: 'code',
                    scope: 'name email',
                    state: `${provider}_login`,
                    response_mode: 'form_post',
                });
                authUrl = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
            }

            if (authUrl) {
                window.location.href = authUrl;
            }
            return;
        }

        setIsLoading(true);
        const key = `${provider}-loading`;
        messageApi.open({
            key,
            type: 'loading',
            content: `Logging in with ${provider}...`,
            duration: 0,
        });

        try {
            setSuccess('');
        } catch (err) {
            messageApi.open({
                key,
                type: 'error',
                content: `Login with ${provider} failed. Try again.`,
                duration: 2,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTelegramOtpSubmit = async (otpCode: string) => {
        if (!otpCode) {
            messageApi.error('OTP code is required');
            return;
        }
        const key = 'telegram-otp-loading';
        messageApi.open({
            key,
            type: 'loading',
            content: 'Verifying Telegram OTP...',
            duration: 0,
        });

        if (otpCode.length !== 6) return;

        const otpCodeValue = otpCode.toString();

        try {
            setTelegramLoading(true);
            const res = await authService.verifyTelegramOtp(otpCodeValue);
            if (res?.data?.accessToken) {
                messageApi.success({
                    content: 'Telegram login  is successful!',
                    duration: 3,
                });
                setTimeout(() => {
                    onClose();
                    window.location.href = '/';
                }, 3000);
            } else {
                messageApi.open({
                    key,
                    type: 'error',
                    content: 'Invalid OTP. Please try again.',
                    duration: 2,
                });
            }
        } catch (error) {
            console.error('Telegram OTP verification failed', error);
            messageApi.open({
                key,
                type: 'error',
                content: 'Verification failed. Please try again.',
                duration: 2,
            });
        } finally {
            setTelegramLoading(false);
        }
    };

    const handlePasswordComplete = (password: string, confirmPassword: string) => {
        setPassword(password);
        setConfirmPassword(confirmPassword);
        setSignupStage(SignupStage.PHONE_VERIFICATION);
    };

    const handlePhoneVerificationComplete = async (verifiedPhoneNumber: string) => {
        setPhoneNumber(verifiedPhoneNumber);
        setSignupStage(SignupStage.COMPLETE);

        messageApi.success({
            content: 'Phone verified! Press signup to complete registration.',
            duration: 5,
        });
    };

    const handleForgotPasswordClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowForgotPassword(true);
        setForgotPasswordStep('email');
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setActiveTab('login');
        setForgotPasswordStep('email');
        setForgotPasswordEmail('');
    };

    const handleForgotPasswordEmailSubmit = async (email: string) => {
        const result = await execute(() => authService.forgotPassword(email), {
            loading: 'Sending OTP...',
            success: 'OTP sent to your email',
            error: 'Failed to send OTP. Please check your email and try again.',
        });

        if (result) {
            setForgotPasswordStep('otp');
        }
    };
    const handleForgotPasswordOtpSubmit = async (email: string, otp: string) => {
        const result = await execute(() => authService.verifyOtpEmail(email, otp), {
            loading: 'Verifying OTP...',
            success: 'OTP verified successfully',
            error: 'Invalid or expired OTP. Please try again.',
        });

        if (result) {
            setForgotPasswordStep('reset');
        }
    };

    const handleForgotPasswordReset = async (email: string, newPassword: string) => {
        if (newPassword.length < 6) {
            messageApi.error('Password must be at least 6 characters');
            return;
        }

        const result = await execute(() => authService.resetPassword(email, newPassword), {
            loading: 'Resetting password...',
            success: 'Password reset successfully',
            error: 'Failed to reset password. Please try again.',
        });

        if (result) {
            setTimeout(() => {
                handleBackToLogin();
            }, 2000);
        }
    };

    const handleResendOtp = async (email: string) => {
        setResendDisabled(true);

        const result = await execute(() => authService.resendOtp(email), {
            loading: 'Resending OTP...',
            success: 'OTP resent successfully',
            error: 'Failed to resend OTP. Please try again.',
        });

        if (!result) {
            setResendDisabled(false);
        } else {
            setTimeout(() => setResendDisabled(false), 60000);
        }
    };

    const handleFinalSignup = async () => {
        setIsLoading(true);
        try {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            const signupData: SignUpData = {
                name,
                email,
                phone: phoneNumber,
                password,
            };

            const result = await authService.signUp(signupData);

            if (result) {
                messageApi.success({
                    content: 'Account created successfully!',
                    duration: 3,
                });
                setTimeout(() => {
                    onClose();
                    window.location.href = '/';
                }, 1000);
            }
        } catch (err) {
            messageApi.error({
                content: err instanceof Error ? err.message : 'Failed to create account',
                duration: 4,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setEmailValidMessage('');
        setShouldCheckEmail(false);

        if (activeTab !== 'signup') return;

        if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current);

        emailCheckTimer.current = setTimeout(() => {
            const validEmailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org|edu)$/i;

            if (validEmailPattern.test(value)) {
                setDebouncedEmail(value);
                setShouldCheckEmail(true);
            } else {
                setEmailValidMessage('');
                setDebouncedEmail('');
            }
        }, 500);
    };

    const forgotPasswordProps = {
        onClose,
        onBackToLogin: handleBackToLogin,
        onEmailSubmit: handleForgotPasswordEmailSubmit,
        onOtpSubmit: handleForgotPasswordOtpSubmit,
        onPasswordReset: handleForgotPasswordReset,
        onResendOtp: handleResendOtp,
        isLoading,
        step: forgotPasswordStep,
        setStep: setForgotPasswordStep,
        email: forgotPasswordEmail,
        setEmail: setForgotPasswordEmail,
        resendDisabled,
    };

    const isSignupContinueDisabled =
        activeTab === 'signup' &&
        signupStage === SignupStage.FORM &&
        (name.trim().length < 6 || emailValidMessage !== 'Email is available to sign up');

    return (
        <>
            {contextHolder}
            <Modal isOpen={true} onClose={onClose} title="" width="450px" padding={theme.spacing.xl}>
                {success && <div style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{success}</div>}
                {showForgotPassword ? (
                    <ForgotPassword {...forgotPasswordProps} />
                ) : telegramStage ? (
                    <TelegramVerification
                        loading={telegramLoading}
                        onSubmit={handleTelegramOtpSubmit}
                        onBack={() => setTelegramStage(false)}
                        onSuccess={() => {
                            setTelegramStage(false);
                        }}
                    />
                ) : signupStage === SignupStage.PHONE_VERIFICATION ? (
                    <PhoneVerification
                        onBack={() => setSignupStage(SignupStage.PASSWORD)}
                        onComplete={handlePhoneVerificationComplete}
                        loading={isLoading}
                    />
                ) : signupStage === SignupStage.PASSWORD ? (
                    <PasswordComponent
                        onBack={() => setSignupStage(SignupStage.FORM)}
                        onContinue={handlePasswordComplete}
                        loading={isLoading}
                    />
                ) : (
                    <>
                        <AuthContentHeader>
                            <AuthTitle>Login or Sign Up</AuthTitle>
                            <TabContainer>
                                <Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
                                    Login
                                </Tab>
                                <Tab active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
                                    Sign Up
                                </Tab>
                            </TabContainer>
                        </AuthContentHeader>

                        <Form onSubmit={handleSubmit}>
                            {activeTab === 'signup' && (
                                <Input
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={activeTab === 'signup'}
                                    inputConfig={{ noBorder: true }}
                                />
                            )}
                            <InputField>
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    required={(activeTab === 'login' && !phoneNumber) || activeTab === 'signup'}
                                    inputConfig={{ noBorder: true }}
                                />
                                {emailValidMessage && (
                                    <div
                                        style={{
                                            fontSize: '0.7rem',
                                            marginTop: '0.25rem',
                                            textAlign: 'left',
                                            color: emailValidMessage.toLowerCase().includes('available')
                                                ? 'green'
                                                : 'red',
                                        }}
                                    >
                                        {emailValidMessage}
                                    </div>
                                )}
                            </InputField>

                            {activeTab === 'login' && (
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    inputConfig={{ noBorder: true }}
                                    endIcon={
                                        showPassword ? (
                                            <Eye
                                                size={20}
                                                onClick={() => setShowPassword(false)}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: '#666',
                                                    strokeWidth: 2,
                                                }}
                                            />
                                        ) : (
                                            <EyeOff
                                                size={20}
                                                onClick={() => setShowPassword(true)}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: '#666',
                                                    strokeWidth: 2,
                                                }}
                                            />
                                        )
                                    }
                                />
                            )}

                            {activeTab === 'login' && (
                                <ForgotPasswordLink href="#" onClick={handleForgotPasswordClick}>
                                    Forgot Password?
                                </ForgotPasswordLink>
                            )}

                            <SubmitButton
                                type={
                                    activeTab === 'signup' && signupStage === SignupStage.COMPLETE ? 'button' : 'submit'
                                }
                                disabled={isLoading || isSignupContinueDisabled}
                                onClick={
                                    activeTab === 'signup' && signupStage === SignupStage.COMPLETE
                                        ? handleFinalSignup
                                        : undefined
                                }
                            >
                                {isLoading
                                    ? activeTab === 'login'
                                        ? 'Logging in...'
                                        : signupStage === SignupStage.COMPLETE
                                          ? 'Creating Account...'
                                          : 'Processing...'
                                    : activeTab === 'login'
                                      ? 'Login'
                                      : signupStage === SignupStage.COMPLETE
                                        ? 'Complete Signup'
                                        : 'Continue'}
                            </SubmitButton>
                        </Form>
                        <OrDivider>
                            <span>OR</span>
                        </OrDivider>

                        <SocialLogin onSocialLogin={handleSocialLogin} />

                        {activeTab === 'login' ? (
                            <SignupPrompt>
                                Not registered yet? <a onClick={() => setActiveTab('signup')}>Sign up here</a>
                            </SignupPrompt>
                        ) : (
                            <SignupPrompt>
                                Already have an account? <a onClick={() => setActiveTab('login')}>Login here</a>
                            </SignupPrompt>
                        )}
                    </>
                )}
            </Modal>
        </>
    );
}
