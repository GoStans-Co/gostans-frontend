import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

type PasswordComponentProps = {
    onBack: () => void;
    onContinue: (password: string, confirmPassword: string) => void;
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
    transition: all ${theme.transitions.fast} ease;

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
    font-family: ${theme.typography.fontFamily.display};
    font-weight: ${theme.typography.fontWeight.bold};
    font-size: ${theme.fontSizes.xl};
    margin: 0;
`;

const Description = styled.p`
    color: ${theme.colors.lightText};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.md};
    line-height: 1.6;
    text-align: left;
    margin: 0 0 ${theme.spacing.xs} 0;
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const PasswordRequirements = styled.div`
    background: ${theme.colors.lightBackground};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
    margin-top: ${theme.spacing.sm};
    justify-content: center;
    align-items: flex-start;
`;

const RequirementsTitle = styled.h4`
    color: ${theme.colors.text};
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    margin: 0 0 ${theme.spacing.sm} 0;
    text-align: left;
`;

const RequirementsList = styled.ul`
    margin: 0;
    padding-left: 0;
    list-style: none;
`;

const RequirementItem = styled.li<{ met: boolean }>`
    color: ${({ met }) => (met ? '#10B981' : theme.colors.lightText)};
    font-size: ${theme.fontSizes.sm};
    line-height: 1.5;
    margin-bottom: ${theme.spacing.xs};
    position: relative;
    padding-left: ${theme.spacing.lg};
    text-align: left;

    &:before {
        content: ${({ met }) => (met ? '"✓"' : '"○"')};
        position: absolute;
        left: 0;
        color: ${({ met }) => (met ? '#10B981' : theme.colors.lightText)};
    }
`;
const ErrorMessage = styled.div`
    color: ${theme.colors.accent};
    font-size: ${theme.fontSizes.sm};
    margin-top: ${theme.spacing.xs};
    text-align: center;
`;

export default function PasswordComponent({ onBack, onContinue, loading = false }: PasswordComponentProps) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const passwordRequirements = {
        minLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
    const doPasswordsMatch = password === confirmPassword && confirmPassword !== '';

    const handleContinue = () => {
        setError('');

        if (!password || !confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }

        if (!isPasswordValid) {
            setError('Password does not meet requirements');
            return;
        }

        if (!doPasswordsMatch) {
            setError('Passwords do not match');
            return;
        }

        onContinue(password, confirmPassword);
    };

    const canContinue = isPasswordValid && doPasswordsMatch && !loading;

    return (
        <Container>
            <Header>
                <BackButton onClick={onBack}>
                    <ArrowLeft />
                </BackButton>
                <Title>Create Password</Title>
            </Header>

            <Description>Create a strong password to secure your account</Description>

            <FormContainer>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    inputConfig={{ noBorder: true }}
                    endIcon={
                        showPassword ? (
                            <Eye
                                size={20}
                                onClick={() => setShowPassword(false)}
                                style={{
                                    cursor: 'pointer',
                                    color: theme.colors.lightText,
                                    strokeWidth: 2,
                                }}
                            />
                        ) : (
                            <EyeOff
                                size={20}
                                onClick={() => setShowPassword(true)}
                                style={{
                                    cursor: 'pointer',
                                    color: theme.colors.lightText,
                                    strokeWidth: 2,
                                }}
                            />
                        )
                    }
                />

                <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    inputConfig={{ noBorder: true }}
                    endIcon={
                        showConfirmPassword ? (
                            <Eye
                                size={20}
                                onClick={() => setShowConfirmPassword(false)}
                                style={{
                                    cursor: 'pointer',
                                    color: theme.colors.lightText,
                                    strokeWidth: 2,
                                }}
                            />
                        ) : (
                            <EyeOff
                                size={20}
                                onClick={() => setShowConfirmPassword(true)}
                                style={{
                                    cursor: 'pointer',
                                    color: theme.colors.lightText,
                                    strokeWidth: 2,
                                }}
                            />
                        )
                    }
                />

                {password && (
                    <PasswordRequirements>
                        <RequirementsTitle>Password Requirements</RequirementsTitle>
                        <RequirementsList>
                            <RequirementItem met={passwordRequirements.minLength}>
                                At least 8 characters
                            </RequirementItem>
                            <RequirementItem met={passwordRequirements.hasUpperCase}>
                                One uppercase letter
                            </RequirementItem>
                            <RequirementItem met={passwordRequirements.hasLowerCase}>
                                One lowercase letter
                            </RequirementItem>
                            <RequirementItem met={passwordRequirements.hasNumber}>One number</RequirementItem>
                            <RequirementItem met={passwordRequirements.hasSpecialChar}>
                                One special character
                            </RequirementItem>
                        </RequirementsList>
                    </PasswordRequirements>
                )}

                {confirmPassword && !doPasswordsMatch && <ErrorMessage>Passwords do not match</ErrorMessage>}

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleContinue}
                    disabled={!canContinue}
                    style={{ marginTop: theme.spacing.lg }}
                >
                    {loading ? 'Processing...' : 'Continue to Phone Verification'}
                </Button>
            </FormContainer>
        </Container>
    );
}
