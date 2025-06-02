import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import { ArrowLeft } from 'lucide-react';

enum VerificationStep {
    PHONE_INPUT = 'phone_input',
    CODE_INPUT = 'code_input',
}

type PhoneVerificationProps = {
    onBack: () => void;
    onComplete: (phoneNumber: string) => void;
    loading?: boolean;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: ${theme.colors.lightBackground};
    border-radius: 50%;
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
        background: ${theme.colors.border};
    }

    svg {
        width: 16px;
        height: 16px;
        color: ${theme.colors.text};
    }
`;

const Title = styled.h3`
    color: ${theme.colors.text};
    font-family: ${theme.typography.fontFamily.body};
    font-weight: ${theme.typography.fontWeight.bold};
    font-size: ${theme.fontSizes.xl};
    margin: 0;
`;

const Description = styled.p`
    align-items: center;
    display: flex;
    flex-direction: flex-start;
    color: ${theme.colors.lightText};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.lg};
    text-align: center;
    margin-left: 0;
`;

const PhoneInputContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
`;

const CountryCode = styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${theme.spacing.md};
    background: ${theme.colors.lightBackground};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.text};
    min-width: 80px;
    justify-content: center;
`;

const CodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
`;

const CodeInputs = styled.div`
    display: flex;
    gap: ${theme.spacing.xs};
    justify-content: center;
    max-width: 100%;
    overflow: hidden;
    flex-wrap: wrap;
`;

const CodeInput = styled.input`
    width: 60px;
    height: 60px;
    text-align: center;
    border: 2px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.lg};
    font-size: ${theme.fontSizes.xl};
    font-weight: ${theme.typography.fontWeight.bold};
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    transition: ${theme.transitions.default};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }

    &:disabled {
        background: ${theme.colors.lightBackground};
        opacity: 0.6;
    }
`;

const ResendButton = styled(Button)`
    &:hover {
        color: ${theme.colors.secondary};
    }

    &:disabled {
        color: ${theme.colors.lightText};
        cursor: not-allowed;
        text-decoration: none;
    }
`;

export default function PhoneVerification({ onBack, onComplete }: PhoneVerificationProps) {
    const [step, setStep] = useState<VerificationStep>(VerificationStep.PHONE_INPUT);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);

    const handleSendCode = async () => {
        if (!phoneNumber.trim()) return;

        setIsSubmitting(true);
        try {
            console.log('Sending verification code to:', phoneNumber);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            setStep(VerificationStep.CODE_INPUT);
            setResendCooldown(30);

            const interval = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Failed to send code:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        if (value && index < 5) {
            const nextInput = document.getElementById(`code-input-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            const prevInput = document.getElementById(`code-input-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerifyCode = async () => {
        const code = verificationCode.join('');
        if (code.length !== 6) return;

        setIsSubmitting(true);
        try {
            console.log('Verifying code:', code, 'for phone:', phoneNumber);
            // simulation uchun
            await new Promise((resolve) => setTimeout(resolve, 1000));

            onComplete(phoneNumber);
        } catch (error) {
            console.error('Failed to verify code:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        try {
            console.log('Resending code to:', phoneNumber);

            setResendCooldown(30);
            const interval = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error('Failed to resend code:', error);
        }
    };

    const isCodeComplete = verificationCode.every((digit) => digit !== '');

    return (
        <Container>
            <Header>
                <BackButton onClick={onBack}>
                    <ArrowLeft />
                </BackButton>
                <Title>
                    {step === VerificationStep.PHONE_INPUT ? 'Phone Verification' : 'Enter Verification Code'}
                </Title>
            </Header>

            {step === VerificationStep.PHONE_INPUT ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
                    <Description>We'll send you a verification code to confirm your phone number</Description>

                    <PhoneInputContainer>
                        <CountryCode>+82</CountryCode>
                        <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            inputConfig={{ noBorder: false }}
                            style={{ flex: 1 }}
                        />
                    </PhoneInputContainer>

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleSendCode}
                        disabled={!phoneNumber.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    <Description>Enter the 6-digit code sent to {phoneNumber}</Description>

                    <CodeContainer>
                        <CodeInputs>
                            {verificationCode.map((digit, index) => (
                                <CodeInput
                                    key={index}
                                    id={`code-input-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    disabled={isSubmitting}
                                />
                            ))}
                        </CodeInputs>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: theme.spacing.lg,
                                gap: theme.spacing.md,
                                flexWrap: 'wrap',
                            }}
                        >
                            <ResendButton
                                variant="outline"
                                size="lg"
                                onClick={handleResendCode}
                                disabled={resendCooldown > 0}
                                style={{ flex: 1 }}
                            >
                                {resendCooldown > 0 ? `Resend: ${resendCooldown}s` : 'Resend'}
                            </ResendButton>

                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleVerifyCode}
                                disabled={!isCodeComplete || isSubmitting}
                                style={{ flex: 1 }}
                            >
                                {isSubmitting ? 'Verifying...' : 'Verification'}
                            </Button>
                        </div>
                    </CodeContainer>
                </div>
            )}
        </Container>
    );
}
