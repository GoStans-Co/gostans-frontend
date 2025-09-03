import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Input from '@/components/common/Input';
import { useValidation } from '@/hooks/utils/useValidation';
import { COUNTRY_CODES } from '@/constants/countryCodes';

type LeadGuestFormProps = {
    onSubmit: (data: any) => void;
    onValidationReady?: (validateFn: () => boolean, allFieldsFilled: boolean) => void;
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
    font-size: ${({ theme }) => theme.fontSizes.sm};
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
    padding: 0 ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.md};
    min-width: 100px;
    height: 40px;
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

export default function GuestForm({ onSubmit, onValidationReady }: LeadGuestFormProps) {
    const submissionTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { billingInfo, errors, handleBillingChange, validateAllFields } = useValidation('billing');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+82');
    const [hasInteracted, setHasInteracted] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const checkAllFieldsFilled = () => {
        return !!(
            billingInfo.firstName &&
            billingInfo.lastName &&
            billingInfo.email &&
            billingInfo.phone &&
            billingInfo.address &&
            billingInfo.city &&
            billingInfo.state &&
            billingInfo.postalCode &&
            billingInfo.country.length >= 2
        );
    };

    useEffect(() => {
        if (submissionTimerRef.current) {
            clearTimeout(submissionTimerRef.current);
        }

        const allFieldsFilled = checkAllFieldsFilled();

        /* here we only submit after a delay to ensure user has finished typing */
        if (allFieldsFilled && hasInteracted && !hasSubmitted) {
            submissionTimerRef.current = setTimeout(() => {
                const completeFormData = {
                    billingInfo: {
                        ...billingInfo,
                        phone: `${selectedCountryCode}${billingInfo.phone}`,
                    },
                };
                onSubmit(completeFormData);
                setHasSubmitted(true);
            }, 500);
        }

        if (!allFieldsFilled && hasSubmitted) {
            setHasSubmitted(false);
        }

        return () => {
            if (submissionTimerRef.current) {
                clearTimeout(submissionTimerRef.current);
            }
        };
    }, [billingInfo, hasInteracted, selectedCountryCode, onSubmit, hasSubmitted]);

    useEffect(() => {
        if (onValidationReady) {
            onValidationReady(() => {
                return validateAllFields();
            }, checkAllFieldsFilled());
        }
    }, [onValidationReady, validateAllFields]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateAllFields()) {
            const completeFormData = {
                billingInfo: {
                    ...billingInfo,
                    phone: `${selectedCountryCode}${billingInfo.phone}`,
                },
            };
            onSubmit(completeFormData);
        }
    };

    return (
        <FormContainer>
            <FormHeader>
                <FormTitle>Billing Information</FormTitle>
                <FormSubtitle>Required for payment processing</FormSubtitle>
            </FormHeader>

            <form onSubmit={handleSubmit}>
                <FormGrid>
                    <div>
                        <Input
                            label="First Name"
                            placeholder="John"
                            value={billingInfo.firstName}
                            onChange={(e) => {
                                if (!hasInteracted) setHasInteracted(true);
                                handleBillingChange('firstName', e.target.value);
                            }}
                            error={hasInteracted ? errors.firstName : undefined}
                            inputConfig={{ variant: 'outlined', size: 'sm' }}
                        />
                    </div>

                    <div>
                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            value={billingInfo.lastName}
                            onChange={(e) => {
                                if (!hasInteracted) setHasInteracted(true);
                                handleBillingChange('lastName', e.target.value);
                            }}
                            error={hasInteracted ? errors.lastName : undefined}
                            inputConfig={{ variant: 'outlined', size: 'sm' }}
                        />
                    </div>

                    <div>
                        <Input
                            label="Email address"
                            placeholder="john@example.com"
                            type="email"
                            value={billingInfo.email}
                            onChange={(e) => {
                                if (!hasInteracted) setHasInteracted(true);
                                handleBillingChange('email', e.target.value);
                            }}
                            error={hasInteracted ? errors.email : undefined}
                            inputConfig={{ variant: 'outlined', size: 'sm' }}
                        />
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
                                    value={billingInfo.phone}
                                    onChange={(e) => {
                                        if (!hasInteracted) setHasInteracted(true);
                                        handleBillingChange('phone', e.target.value);
                                    }}
                                    error={hasInteracted ? errors.phone : undefined}
                                    inputConfig={{ variant: 'outlined', size: 'sm' }}
                                />
                            </PhoneInputWrapper>
                        </PhoneInputContainer>
                    </div>

                    <FullWidthContainer>
                        <Input
                            label="Address"
                            placeholder="123 Main St"
                            value={billingInfo.address}
                            onChange={(e) => {
                                if (!hasInteracted) setHasInteracted(true);
                                handleBillingChange('address', e.target.value);
                            }}
                            error={hasInteracted ? errors.address : undefined}
                            inputConfig={{ variant: 'outlined', size: 'sm' }}
                        />
                    </FullWidthContainer>

                    <div>
                        <Input
                            label="City"
                            placeholder="New York"
                            value={billingInfo.city}
                            onChange={(e) => {
                                if (!hasInteracted) setHasInteracted(true);
                                handleBillingChange('city', e.target.value);
                            }}
                            error={hasInteracted ? errors.city : undefined}
                            inputConfig={{ variant: 'outlined', size: 'sm' }}
                        />
                    </div>

                    <div>
                        <Input
                            label="State"
                            placeholder="NY"
                            value={billingInfo.state}
                            onChange={(e) => {
                                if (!hasInteracted) setHasInteracted(true);
                                handleBillingChange('state', e.target.value);
                            }}
                            error={hasInteracted ? errors.state : undefined}
                            inputConfig={{ variant: 'outlined', size: 'sm' }}
                        />
                    </div>

                    <div>
                        <Input
                            label="Postal Code"
                            placeholder="10001"
                            value={billingInfo.postalCode}
                            onChange={(e) => {
                                if (!hasInteracted) setHasInteracted(true);
                                handleBillingChange('postalCode', e.target.value);
                            }}
                            error={hasInteracted ? errors.postalCode : undefined}
                            inputConfig={{ variant: 'outlined', size: 'sm' }}
                        />
                    </div>

                    <div>
                        <Input
                            label="Country"
                            placeholder="US"
                            value={billingInfo.country}
                            onChange={(e) => {
                                if (!hasInteracted) setHasInteracted(true);
                                handleBillingChange('country', e.target.value);
                            }}
                            error={hasInteracted ? errors.country : undefined}
                            inputConfig={{ variant: 'outlined', size: 'sm' }}
                        />
                    </div>
                </FormGrid>
            </form>
        </FormContainer>
    );
}
