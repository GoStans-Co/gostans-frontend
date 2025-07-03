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
import useApiServices from '@/services';
import PasswordComponent from '@/components/ModalPopup/AuthModal/PasswordComponent';

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

    const [messageApi, contextHolder] = message.useMessage();
    const { auth: authService } = useApiServices();

    const { isAuthenticated } = useCookieAuth();

    useEffect(() => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setSuccess('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');
        setIsLoading(true);

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

                const result = await authService.login(credentials);

                if (result) {
                    setTimeout(() => {
                        onClose();
                        window.location.href = '/';
                    }, 500);
                }
                messageApi.success({
                    content: 'You successfully logged in!',
                    style: { marginTop: '1vh' },
                    duration: 8,
                });
            } else {
                /* for signup only, we validate name and email, then go to password step */
                if (!name) throw new Error('Name is required');
                if (!email) throw new Error('Email is required for signup');

                setSignupStage(SignupStage.PASSWORD);
            }
        } catch (err) {
            messageApi.error({
                content: err instanceof Error ? err.message : 'An error occurred',
                duration: 4,
            });
        } finally {
            setIsLoading(false);
        }
    };
    const handleSocialLogin = async (provider: string, credential?: string) => {
        setIsLoading(true);
        try {
            setSuccess('');
            if (!credential) return;

            const socialData: SocialLoginData = {
                provider: provider as 'google' | 'facebook' | 'twitter',
                id_token: credential,
            };

            const result = await authService.socialLogin(socialData);

            if (result) {
                messageApi.success({
                    content: `Login with ${provider} is successful!`,
                    duration: 3,
                });
            }
        } catch (err) {
            console.error('Social login error:', err);
        } finally {
            setIsLoading(false);
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

    return (
        <>
            {contextHolder}
            <Modal isOpen={true} onClose={onClose} title="" width="450px" padding={theme.spacing.xl}>
                {success && <div style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{success}</div>}
                {signupStage === SignupStage.PHONE_VERIFICATION ? (
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
                                    onChange={(e) => setEmail(e.target.value)}
                                    required={(activeTab === 'login' && !phoneNumber) || activeTab === 'signup'}
                                    inputConfig={{ noBorder: true }}
                                />
                            </InputField>

                            {/* Only show password field for login */}
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
                                <ForgotPasswordLink href="#">Forgot Password?</ForgotPasswordLink>
                            )}

                            <SubmitButton
                                type={
                                    activeTab === 'signup' && signupStage === SignupStage.COMPLETE ? 'button' : 'submit'
                                }
                                disabled={isLoading}
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
