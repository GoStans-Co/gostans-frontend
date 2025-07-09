import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Input from '@/components/Common/Input';
import { useValidation } from '@/hooks/useValidation';
import { COUNTRY_CODES } from '@/constants/countryCodes';

type LeadGuestFormProps = {
    onSubmit: (data: any) => void;
    onValidationReady?: (validateFn: () => boolean) => void;
};

const FormContainer = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormHeader = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormTitle = styled.h2`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
    text-align: left;
`;

const FormSubtitle = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    margin-top: ${({ theme }) => theme.spacing.xs};
    text-align: left;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const PhoneInputContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    flex: 1;
`;

const CountrySelect = styled.select`
    padding: 0 ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.md};
    min-width: 100px;
    height: 48px;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px rgba(31, 101, 160, 0.2);
        padding: 0 ${({ theme }) => theme.spacing.md};
    }
`;

const PhoneInputWrapper = styled.div`
    flex: 1;
`;

const FullWidthContainer = styled.div`
    grid-column: 1 / -1;
`;

const HelpText = styled.p`
    font-size: 0.7rem;
    color: #666;
    margin: 0.3rem 0 0 0;
    text-align: left;
`;

export default function GuestForm({ onSubmit, onValidationReady }: LeadGuestFormProps) {
    const { leadGuestData, errors, handleLeadGuestChange, validateAllFields } = useValidation('leadGuest');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+39');

    useEffect(() => {
        if (onValidationReady) {
            onValidationReady(validateAllFields);
        }
    }, [onValidationReady, validateAllFields]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateAllFields()) {
            const completeFormData = {
                phoneNumber: `${selectedCountryCode}${leadGuestData.phoneNumber}`,
            };
            onSubmit(completeFormData);
        }
    };

    return (
        <FormContainer>
            <FormHeader>
                <FormTitle>Main Guest</FormTitle>
                <FormSubtitle>Enter the main guest details below for confirmation.</FormSubtitle>
            </FormHeader>

            <form onSubmit={handleSubmit}>
                <FormGrid>
                    <div>
                        <Input
                            label="Full name"
                            placeholder="Enter full name"
                            value={leadGuestData.fullName}
                            onChange={(e) => handleLeadGuestChange('fullName', e.target.value)}
                            error={errors.fullName}
                            inputConfig={{ variant: 'outlined', size: 'md' }}
                        />
                        {!errors.fullName && <HelpText>Must match ID</HelpText>}
                    </div>

                    <div>
                        <Input
                            label="Email address"
                            placeholder="Enter email address"
                            type="email"
                            value={leadGuestData.email}
                            onChange={(e) => handleLeadGuestChange('email', e.target.value)}
                            error={errors.email}
                            inputConfig={{ variant: 'outlined', size: 'md' }}
                        />
                        {!errors.email && <HelpText>We'll send your tickets here</HelpText>}
                    </div>

                    <div>
                        <Input
                            label="Confirm email address"
                            placeholder="Confirm email address"
                            type="email"
                            value={leadGuestData.confirmEmail}
                            onChange={(e) => handleLeadGuestChange('confirmEmail', e.target.value)}
                            error={errors.confirmEmail}
                            inputConfig={{ variant: 'outlined', size: 'md' }}
                        />
                        {!errors.confirmEmail && <HelpText>Just to ensure we've got this right</HelpText>}
                    </div>

                    <div>
                        <label
                            style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#374151',
                                textAlign: 'left',
                            }}
                        >
                            Phone number
                        </label>
                        <PhoneInputContainer>
                            <CountrySelect
                                value={selectedCountryCode}
                                onChange={(e) => setSelectedCountryCode(e.target.value)}
                            >
                                {COUNTRY_CODES.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.flag} {country.code}
                                    </option>
                                ))}
                            </CountrySelect>
                            <PhoneInputWrapper>
                                <Input
                                    placeholder="Enter phone number"
                                    value={leadGuestData.phoneNumber}
                                    onChange={(e) => handleLeadGuestChange('phoneNumber', e.target.value)}
                                    error={errors.phoneNumber}
                                    inputConfig={{ variant: 'outlined', size: 'md' }}
                                />
                            </PhoneInputWrapper>
                        </PhoneInputContainer>
                        {!errors.phoneNumber && (
                            <HelpText>We may reach out for booking updates here over SMS/WhatsApp</HelpText>
                        )}
                    </div>

                    <FullWidthContainer>
                        <Input
                            label="Date of birth"
                            placeholder="DD/MM/YYYY"
                            value={leadGuestData.dateOfBirth}
                            onChange={(e) => handleLeadGuestChange('dateOfBirth', e.target.value)}
                            error={errors.dateOfBirth}
                            inputConfig={{ variant: 'outlined', size: 'md' }}
                        />
                        {!errors.dateOfBirth && <HelpText>Please use DD/MM/YYYY format only</HelpText>}
                    </FullWidthContainer>
                </FormGrid>
            </form>
        </FormContainer>
    );
}
