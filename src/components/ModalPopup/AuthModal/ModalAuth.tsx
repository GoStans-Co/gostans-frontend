import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { Eye, EyeOff } from 'lucide-react';
import Input from '@/components/Common/Input';
import Modal from '@/components/Modal';
import useCookieAuth from '@/services/cookieAuthService';
import SocialLogin from '@/components/ModalPopup/AuthModal/SocialLogin';
import { Mail, Lock, User, Phone } from 'lucide-react';

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
    // margin-top: -${theme.spacing.sm};
    // margin-bottom: ${theme.spacing.md};
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

const ErrorMessage = styled.div`
    color: red;
    font-size: ${theme.fontSizes.sm};
    margin-bottom: ${theme.spacing.md};
    text-align: center;
`;

export default function ModalAuth({ onClose, initialTab = 'login' }: ModalAuthProps) {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, signup } = useCookieAuth();

    useEffect(() => {
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    }, [activeTab]);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (activeTab === 'login') {
                if (!email && !phoneNumber) {
                    throw new Error('Email or phone number is required');
                }
                if (!password) {
                    throw new Error('Password is required');
                }
                await login(email || phoneNumber, password);
                /* close modal on successful login */
                onClose();
            } else {
                /* signup  logic*/
                if (!name) throw new Error('Name is required');
                if (!email) throw new Error('Email is required for signup');
                if (!password) throw new Error('Password is required');
                if (password !== confirmPassword) throw new Error('Passwords do not match');

                await signup(name, email, phoneNumber, password);
                onClose();
            }
        } catch (err) {
            console.error('Authentication error:', err);
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        setLoading(true);
        // i will implement the social login logic later
        console.log(`Authenticating with ${provider}`);

        // as of now mocking the successful login after a short delay
        setTimeout(() => {
            // then we call the  actual service
            // cookieAuthService.socialLogin(provider)
            setLoading(false);
            onClose();
        }, 1000);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="" width="480px" padding={theme.spacing.xl}>
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

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
                {activeTab === 'signup' && (
                    <InputField>
                        <Input
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={activeTab === 'signup'}
                            inputConfig={{ noBorder: true }}
                            icon={
                                <User
                                    size={10}
                                    style={{
                                        color: '#666',
                                        strokeWidth: 1.5,
                                    }}
                                />
                            }
                        />
                    </InputField>
                )}

                <InputField>
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={(activeTab === 'login' && !phoneNumber) || activeTab === 'signup'}
                        inputConfig={{ noBorder: true }}
                        icon={
                            <Mail
                                size={10}
                                style={{
                                    color: '#666',
                                    strokeWidth: 1.5,
                                }}
                            />
                        }
                    />
                </InputField>

                {activeTab === 'signup' && (
                    <InputField>
                        <Input
                            placeholder="Phone Number"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            inputConfig={{ noBorder: true }}
                            icon={
                                <Phone
                                    size={10}
                                    style={{
                                        color: '#666',
                                        strokeWidth: 1.5,
                                    }}
                                />
                            }
                        />
                    </InputField>
                )}

                <InputField>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        inputConfig={{ noBorder: true }}
                        icon={
                            <Lock
                                size={20}
                                style={{
                                    color: '#666',
                                    strokeWidth: 2,
                                }}
                            />
                        }
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
                </InputField>

                {activeTab === 'signup' && (
                    <InputField>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required={activeTab === 'signup'}
                            inputConfig={{ noBorder: true }}
                            icon={
                                <Lock
                                    size={20}
                                    style={{
                                        color: '#666',
                                        strokeWidth: 2,
                                    }}
                                />
                            }
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
                    </InputField>
                )}

                {activeTab === 'login' && <ForgotPasswordLink href="#">Forgot Password?</ForgotPasswordLink>}

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
        </Modal>
    );
}
