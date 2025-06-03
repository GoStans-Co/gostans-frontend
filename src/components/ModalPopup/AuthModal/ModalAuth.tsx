import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/Common/Input';
import Modal from '@/components/Modal';
import useCookieAuth from '@/services/cookieAuthService';
import SocialLogin from '@/components/ModalPopup/AuthModal/SocialLogin';
import { LoginCredentials, SignUpData, SocialLoginData } from '@/types/auth';
import PhoneVerification from '@/components/ModalPopup/AuthModal/PhoneVerification';
import { message } from 'antd';
import { useAuthenticateUser } from '@/services/api/authenticateUser';

enum SignupStage {
    FORM = 'form',
    PHONE_VERIFICATION = 'phone_verification',
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
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const [signupStage, setSignupStage] = useState<SignupStage>(SignupStage.FORM);

    const [messageApi, contextHolder] = message.useMessage();

    const { login, loginLoading, signUp, signupLoading, socialLogin, socialLoginLoading, resetAll } =
        useAuthenticateUser();

    const { isAuthenticated } = useCookieAuth();

    const loading = loginLoading || signupLoading || socialLoginLoading;

    useEffect(() => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setSuccess('');
        resetAll();
    }, [activeTab]);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        if (isAuthenticated()) {
            setSuccess('Login successful!');
            const timer = setTimeout(() => {
                onClose();
                window.location.href = '/mypage';
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
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

                const result = await login(credentials);

                if (result) {
                    setSuccess('Login successful!');
                    setTimeout(() => {
                        onClose();
                        window.location.href = '/mypage';
                    }, 500);
                }
            } else {
                if (!name) throw new Error('Name is required');
                if (!email) throw new Error('Email is required for signup');
                if (!password) throw new Error('Password is required');
                if (password !== confirmPassword) throw new Error('Passwords do not match');

                setSignupStage(SignupStage.PHONE_VERIFICATION);

                const signupData: SignUpData = {
                    name,
                    email,
                    phone: phoneNumber,
                    password,
                };

                const result = await signUp(signupData);

                if (result) {
                    setSuccess('Account created successfully!');
                    setTimeout(() => {
                        onClose();
                        window.location.href = '/mypage';
                    }, 1000);
                }
            }
        } catch (err) {
            messageApi.error({
                content: err instanceof Error ? err.message : 'An error occurred',
                duration: 4,
            });
        }
    };

    const handleSocialLogin = async (provider: string, credential?: string) => {
        try {
            setSuccess('');
            if (!credential) return;

            const socialData: SocialLoginData = {
                provider: provider as 'google' | 'facebook' | 'twitter',
                id_token: credential,
            };

            const result = await socialLogin(socialData);

            if (result) {
                setSuccess(`${provider} login successful!`);
            }
        } catch (err) {
            console.error('Social login error:', err);
        }
    };

    const handlePhoneVerificationComplete = async (verifiedPhoneNumber: string) => {
        try {
            const signupData: SignUpData = {
                name,
                email,
                phone: verifiedPhoneNumber,
                password,
            };

            const result = await signUp(signupData);

            if (result) {
                setSuccess('Account created successfully!');
                setTimeout(() => {
                    onClose();
                }, 1000);
            }
        } catch (err) {
            console.error('Signup error:', err);
            setSignupStage(SignupStage.FORM);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal isOpen={true} onClose={onClose} title="" width="450px" padding={theme.spacing.xl}>
                {signupStage === SignupStage.PHONE_VERIFICATION ? (
                    <PhoneVerification
                        onBack={() => setSignupStage(SignupStage.FORM)}
                        onComplete={handlePhoneVerificationComplete}
                        loading={signupLoading}
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
                                    onChange={(e) => setEmail(e.target.value)}
                                    required={(activeTab === 'login' && !phoneNumber) || activeTab === 'signup'}
                                    inputConfig={{ noBorder: true }}
                                />
                            </InputField>{' '}
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
                            {activeTab === 'signup' && (
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required={activeTab === 'signup'}
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
                                <ForgotPasswordLink href="#">Forgot Password?</ForgotPasswordLink>
                            )}
                            <SubmitButton type="submit" disabled={loading}>
                                {loading
                                    ? activeTab === 'login'
                                        ? 'Logging in...'
                                        : 'Signing up...'
                                    : activeTab === 'login'
                                      ? 'Login'
                                      : 'Sign Up'}
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
