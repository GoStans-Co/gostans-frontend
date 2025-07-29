import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Button from '@/components/Common/Button';

type Props = {
    loading?: boolean;
    onBack: () => void;
    onSuccess: () => void;
    onSubmit: (code: string) => void;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.md};
    width: 100%;

    @media (max-width: 768px) {
        gap: ${theme.spacing.sm};
    }
`;

const Title = styled.h2`
    font-size: ${theme.fontSizes['2xl']};
    color: ${theme.colors.primary};
    font-family: ${theme.typography.fontFamily.display};
    font-weight: ${theme.typography.fontWeight.bold};
    text-align: center;

    @media (max-width: 768px) {
        font-size: ${theme.fontSizes.xl};
    }
`;

const Description = styled.p`
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.text};
    text-align: center;
    margin: 0;

    a {
        color: ${theme.colors.primary};
        font-weight: ${theme.typography.fontWeight.medium};
    }

    @media (max-width: 768px) {
        font-size: ${theme.fontSizes.sm};
    }
`;

const CodeInputs = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};

    @media (max-width: 768px) {
        gap: ${theme.spacing.xs};
    }
`;

const CodeBox = styled.input`
    width: 57px;
    height: 57px;
    font-size: ${theme.fontSizes.xl};
    text-align: center;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    background: ${theme.colors.background};

    &:focus {
        border-color: ${theme.colors.primary};
        outline: none;
    }

    @media (max-width: 768px) {
        width: 44px;
        height: 44px;
        font-size: ${theme.fontSizes.lg};
    }
`;

const TimerWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 2rem;
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.lightText};

    button {
        padding: 0;
    }

    @media (max-width: 768px) {
        font-size: ${theme.fontSizes.xs};
    }
`;

const LinkItem = styled.a`
    color: ${theme.colors.warning};
    font-weight: ${theme.typography.fontWeight.medium};
    transition: color ${theme.transitions.default};
    highlight: none;
    position: relative;

    &:hover {
        color: ${theme.colors.success};
    }

    &:focus {
        outline: none;
        box-shadow: 0 0 0 1px ${theme.colors.error};
        text-decoration: underline;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${theme.colors.primary}40;
    }
`;

export default function TelegramVerification({ onSubmit, loading = false }: Props) {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [timer, setTimer] = useState(120);

    useEffect(() => {
        if (timer <= 0) return;
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timer]);

    const handleResendCode = () => {
        setTimer(120);
    };

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerifyClick = () => {
        const code = otp.join('');
        if (code.length === otp.length) {
            onSubmit(code);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length && i < newOtp.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
        }
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const isButtonDisabled = otp.join('').length !== otp.length || loading;

    return (
        <Container>
            <Title>Verify Telegram OTP</Title>
            <Description>
                Click&nbsp;
                <LinkItem href="https://t.me/GoStans_bot" target="_blank" rel="noopener noreferrer">
                    telegram bot
                </LinkItem>
                &nbsp;to get your OTP code and enter it below to verify your account.
            </Description>
            <CodeInputs>
                {otp.map((digit, idx) => (
                    <CodeBox
                        key={idx}
                        id={`otp-${idx}`}
                        type="tel"
                        maxLength={1}
                        value={digit}
                        onPaste={handlePaste}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        disabled={loading}
                    />
                ))}
            </CodeInputs>
            <TimerWrapper>
                {timer > 0 ? (
                    <span>
                        Request new code in <strong>{formatTime(timer)}</strong>
                    </span>
                ) : (
                    <Button variant="text" size="sm" onClick={handleResendCode}>
                        Resend Code
                    </Button>
                )}
            </TimerWrapper>
            <Button onClick={handleVerifyClick} disabled={isButtonDisabled} fullWidth variant="primary" size="lg">
                {loading ? 'Verifying...' : 'Verify your OTP'}
            </Button>
        </Container>
    );
}
