import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import useApiServices from '@/services';
import { message } from 'antd';
import { COUNTRY_CODES } from '@/constants/countryCodes';

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

const CodeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
`;

const CodeInputs = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 40px;
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

const CountryCodeSelector = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    cursor: pointer;
    background: white;
    min-width: 100px;
    position: relative;

    &:hover {
        border-color: #007bff;
    }
`;

const CountryDropdown = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CountryOption = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    cursor: pointer;

    &:hover {
        background: #f8f9fa;
    }

    span:last-child {
        font-size: 12px;
        color: #666;
        flex: 1;
    }
`;

export default function PhoneVerification({ onBack, onComplete }: PhoneVerificationProps) {
    const [step, setStep] = useState<VerificationStep>(VerificationStep.PHONE_INPUT);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [selectedCountryCode, setSelectedCountryCode] = useState('+82');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const {
        auth: { sendOtp, verifyOtp },
    } = useApiServices();

    const handleSendCode = async () => {
        if (!phoneNumber.trim()) return;

        setIsSubmitting(true);
        try {
            const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;
            console.log('Sending verification code to:', fullPhoneNumber);

            const response = await sendOtp(fullPhoneNumber);
            console.log('Response received:', response);

            if (response.statusCode !== 200) {
                throw new Error(response.message || 'Failed to send verification code');
            }

            /**
             * hozirchalik shuyerda alert orqali ko'rsatamiz,
             * keyinchalik sms servis orqali yuboramiz
             */
            if (response.data?.otp) {
                messageApi.info({
                    content: `Verification code: ${response.data.otp}`,
                    duration: 10,
                });
            }

            setPhoneNumber(phoneNumber);
            setVerificationCode(['', '', '', '']);
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
        } catch (error: any) {
            console.error('Failed to send code:', error);
            messageApi.error({
                content: error.message || 'Failed to send verification code',
                duration: 4,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        if (value && index < 3) {
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
        if (code.length !== 4) return;

        setIsSubmitting(true);
        try {
            const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;
            console.log('Verifying code:', code, 'for phone:', fullPhoneNumber);

            const response = await verifyOtp(fullPhoneNumber, code);
            console.log('Verify response:', response);

            if (response.statusCode !== 200 || !response.data?.success) {
                throw new Error(response.message || 'Invalid verification code');
            }

            messageApi.success({
                content: 'Phone number verified successfully!',
                duration: 2,
            });

            onComplete(fullPhoneNumber);
        } catch (error: any) {
            console.error('Failed to verify code:', error);
            messageApi.error({
                content: error.message || 'Invalid verification code. Please try again.',
                duration: 4,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isCodeComplete = verificationCode.every((digit) => digit !== '');

    return (
        <>
            {contextHolder}
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
                            <CountryCodeSelector
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                style={{ position: 'relative' }}
                            >
                                <span>{COUNTRY_CODES.find((c) => c.code === selectedCountryCode)?.flag}</span>
                                <span>{selectedCountryCode}</span>
                                <ChevronDown size={16} />

                                {showCountryDropdown && (
                                    <CountryDropdown>
                                        {COUNTRY_CODES.map((country) => (
                                            <CountryOption
                                                key={country.code}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCountryCode(country.code);
                                                    setShowCountryDropdown(false);
                                                }}
                                            >
                                                <span>{country.flag}</span>
                                                <span>{country.code}</span>
                                                <span>{country.country}</span>
                                            </CountryOption>
                                        ))}
                                    </CountryDropdown>
                                )}
                            </CountryCodeSelector>

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
                        <Description>
                            Enter the 4-digit code sent to {selectedCountryCode}
                            {phoneNumber}
                        </Description>

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
                                    onClick={handleSendCode}
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
        </>
    );
}
