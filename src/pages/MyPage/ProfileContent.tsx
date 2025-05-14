import React, { useState } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, Edit2 } from 'lucide-react';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

type ProfileContentProps = {
    userData: {
        name: string;
        email: string;
        phone: string;
    };
};

const ProfileContentContainer = styled.div`
    flex: 1;
    padding: ${({ theme }) => theme.spacing['2xl']};
    background-color: ${({ theme }) => theme.colors.grayBackground};
    min-height: 100vh;
`;

const Card = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SectionTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 600;
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.primary};
`;

const FieldsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr 1fr;
    }
`;

const PasswordHint = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonContainer = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xl};
`;

export default function ProfileContent({ userData }: ProfileContentProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);

        if (!e.target.value && !confirmPassword) {
            setPasswordError('');
        } else if (e.target.value && confirmPassword && e.target.value !== confirmPassword) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);

        if (password && e.target.value && password !== e.target.value) {
            setPasswordError('Passwords do not match');
        } else {
            setPasswordError('');
        }
    };

    const handleContinue = () => {
        if (!password || !confirmPassword) {
            setPasswordError('Both password fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        if (password.length < 6 || password.length > 20) {
            setPasswordError('Password must be between 6-20 characters');
            return;
        }

        alert('Password updated successfully!');
    };

    return (
        <ProfileContentContainer>
            <Card>
                <SectionTitle>Personal info</SectionTitle>
                <FieldsGrid>
                    <Input
                        label="Name"
                        value={userData.name}
                        readOnly
                        inputConfig={{
                            variant: 'outlined',
                            size: 'md',
                        }}
                        endIcon={<Edit2 size={16} />}
                    />

                    <Input
                        label="Email"
                        value={userData.email}
                        readOnly
                        inputConfig={{
                            variant: 'outlined',
                            size: 'md',
                        }}
                        endIcon={<Edit2 size={16} />}
                    />

                    <Input
                        label="Phone number"
                        value={userData.phone}
                        readOnly
                        inputConfig={{
                            variant: 'outlined',
                            size: 'md',
                        }}
                        endIcon={<Edit2 size={16} />}
                    />
                </FieldsGrid>
            </Card>

            <Card>
                <SectionTitle>Change password</SectionTitle>
                <PasswordHint>Create a strong password to keep your account secure</PasswordHint>
                <PasswordHint>Set password(6-20 character)</PasswordHint>

                <FieldsGrid>
                    <Input
                        label=""
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Please enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                        inputConfig={{
                            variant: 'outlined',
                            size: 'md',
                        }}
                        endIcon={
                            showPassword ? (
                                <EyeOff size={16} onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                            ) : (
                                <Eye size={16} onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                            )
                        }
                    />

                    <Input
                        label=""
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        error={passwordError}
                        inputConfig={{
                            variant: 'outlined',
                            size: 'md',
                        }}
                        endIcon={
                            showConfirmPassword ? (
                                <EyeOff
                                    size={16}
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{ cursor: 'pointer' }}
                                />
                            ) : (
                                <Eye
                                    size={16}
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{ cursor: 'pointer' }}
                                />
                            )
                        }
                    />
                </FieldsGrid>

                <ButtonContainer>
                    <Button variant="primary" size="md" onClick={handleContinue} style={{ maxWidth: '200px' }}>
                        Continue
                    </Button>
                </ButtonContainer>
            </Card>
        </ProfileContentContainer>
    );
}
