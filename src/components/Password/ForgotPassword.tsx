import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaArrowLeft, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '@/components/Common/Button';

type ForgotPasswordStep = 'email' | 'otp' | 'reset';

interface ForgotPasswordProps {
    onClose: () => void;
    onBackToLogin: () => void;
    onEmailSubmit: (email: string) => void;
    onOtpSubmit: (email: string, otp: string) => void;
    onPasswordReset: (email: string, newPassword: string) => void;
    onResendOtp: (email: string) => void;
    isLoading: boolean;
    step: ForgotPasswordStep;
    setStep: (step: ForgotPasswordStep) => void;
    email: string;
    setEmail: (email: string) => void;
    resendDisabled: boolean;
}

const Container = styled.div`
    max-width: 400px;
    width: 100%;
`;

const Header = styled.div`
    text-align: left;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin: 0;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const InputGroup = styled.div`
    position: relative;
`;

const InputIcon = styled.div`
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.lightText};
    z-index: 1;
`;

const Input = styled.input`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md}
        3rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.md};
    transition: ${({ theme }) => theme.transitions.default};
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(15, 40, 70, 0.1);
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.lightText};
    }
`;

const PasswordInputWrapper = styled.div`
    position: relative;
`;

const PasswordToggle = styled.button`
    position: absolute;
    right: ${({ theme }) => theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.lightText};
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const OtpContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 0.7rem;
    justify-content: center;
    max-width: 100%;
    overflow: hidden;
    flex-wrap: wrap;
`;

const OtpInput = styled.input`
    width: 55px;
    height: 55px;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    border: 2px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: ${({ theme }) => theme.transitions.default};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
        background: ${({ theme }) => theme.colors.lightBackground};
        opacity: 0.6;
    }
`;
const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    cursor: pointer;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding: 0;

    &:hover {
        text-decoration: underline;
    }
`;

const ResendButton = styled.button`
    background: none;
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    cursor: pointer;
    text-align: center;
    padding: ${({ theme }) => theme.spacing.sm};
    transition: color ${({ theme }) => theme.transitions.default};
    border: none;
    outline: none;

    &:hover {
        color: ${({ theme }) => theme.colors.secondary};
        text-decoration: underline;
    }

    &:disabled {
        color: ${({ theme }) => theme.colors.lightText};
        cursor: not-allowed;
        text-decoration: none;

        &:hover {
            color: ${({ theme }) => theme.colors.lightText};
            text-decoration: none;
        }
    }
`;

export default function ForgotPassword({
    onBackToLogin,
    onEmailSubmit,
    onOtpSubmit,
    onPasswordReset,
    onResendOtp,
    isLoading,
    step,
    setStep,
    email,
    setEmail,
    resendDisabled,
}: ForgotPasswordProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        onEmailSubmit(email);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) return;
        onOtpSubmit(email, otpString);
    };

    const handlePasswordReset = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) return;
        onPasswordReset(email, newPassword);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();

        if (/^\d+$/.test(pastedData)) {
            const pastedChars = pastedData.split('').slice(0, 6);

            const newOtp = [...otp];
            pastedChars.forEach((char, index) => {
                if (index < 6) {
                    newOtp[index] = char;
                }
            });

            setOtp(newOtp);

            const lastIndex = Math.min(pastedChars.length, 5);
            setTimeout(() => {
                const inputToFocus = document.getElementById(`otp-${lastIndex}`);
                inputToFocus?.focus();
            }, 0);
        }
    };

    const renderEmailStep = () => (
        <>
            <BackButton onClick={onBackToLogin}>
                <FaArrowLeft />
                Back to Login
            </BackButton>
            <Header>
                <Title>Forgot Password</Title>
                <Subtitle>Enter your email address and we'll send you an OTP to reset your password</Subtitle>
            </Header>
            <Form onSubmit={handleEmailSubmit}>
                <InputGroup>
                    <InputIcon>
                        <FaEnvelope />
                    </InputIcon>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </InputGroup>
                <Button type="submit" variant="primary" disabled={isLoading} size="lg" fullWidth>
                    {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
            </Form>
        </>
    );

    const renderOtpStep = () => (
        <>
            <BackButton onClick={() => setStep('email')}>
                <FaArrowLeft />
                Back
            </BackButton>
            <Header>
                <Title>Verify OTP</Title>
                <Subtitle>Enter the 6-digit code sent to {email}</Subtitle>
            </Header>
            <Form onSubmit={handleOtpSubmit}>
                <OtpContainer>
                    {otp.map((digit, index) => (
                        <OtpInput
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !digit && index > 0) {
                                    const prevInput = document.getElementById(`otp-${index - 1}`);
                                    prevInput?.focus();
                                }
                            }}
                            onPaste={(e) => index === 0 && handlePaste(e)}
                            disabled={isLoading}
                        />
                    ))}
                </OtpContainer>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <ResendButton type="button" onClick={() => onResendOtp(email)} disabled={resendDisabled}>
                        {resendDisabled ? 'Resend OTP (60s)' : 'Resend OTP'}
                    </ResendButton>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading || otp.join('').length !== 6}
                        size="lg"
                        fullWidth
                    >
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                </div>
            </Form>
        </>
    );

    const renderResetStep = () => (
        <>
            <BackButton onClick={() => setStep('otp')}>
                <FaArrowLeft />
                Back
            </BackButton>
            <Header>
                <Title>Reset Password</Title>
                <Subtitle>Enter your new password</Subtitle>
            </Header>
            <Form onSubmit={handlePasswordReset}>
                <InputGroup>
                    <InputIcon>
                        <FaKey />
                    </InputIcon>
                    <PasswordInputWrapper>
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter new password (min 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </PasswordToggle>
                    </PasswordInputWrapper>
                </InputGroup>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading || newPassword.length < 6}
                    size="lg"
                    fullWidth
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
            </Form>
        </>
    );

    return (
        <Container>
            {step === 'email' && renderEmailStep()}
            {step === 'otp' && renderOtpStep()}
            {step === 'reset' && renderResetStep()}
        </Container>
    );
}
