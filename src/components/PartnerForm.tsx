import { theme } from '@/styles/theme';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import partnerImage from '@/assets/uzb2.jpg';
import { useRecoilValue } from 'recoil';
import { countriesWithCitiesAtom } from '@/atoms/countryWithCities';

type PartnerFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    about: string;
    password: string;
    confirmPassword: string;
};

type PartnerFormProps = {
    onClose?: () => void;
    onSubmit: (data: Omit<PartnerFormData, 'confirmPassword'>) => Promise<void>;
    loading?: boolean;
};

const FormWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.lg};
    max-width: 1200px;
    width: 100%;
    margin: 0 70px;

    ${theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
    }
`;

const ImageSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing['2xl']};
    position: relative;
    overflow: hidden;

    ${theme.responsive.maxMobile} {
        display: none;
    }
`;

const PartnerImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${theme.borderRadius.lg};
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
`;

const FormContainer = styled.div`
    background: ${theme.colors.background};
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.xl};
    width: 100%;
    box-shadow: ${theme.shadows.xl};

    ${theme.responsive.mobile} {
        padding: ${theme.spacing.md};
        margin-bottom: ${theme.spacing['2xl']};
    }
`;

const FormTitle = styled.h2`
    font-size: ${theme.fontSizes['2xl']};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.text};
    margin-bottom: ${theme.spacing.sm};
    text-align: left;
`;

const FormSubtitle = styled.p`
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.secondary};
    text-align: left;
    margin-bottom: ${theme.spacing.xl};
    border-bottom: 0.5px solid ${theme.colors.border};
    padding-bottom: ${theme.spacing.lg};

    ${theme.responsive.maxMobile} {
        margin-bottom: ${theme.spacing.md};
        border-bottom: 0.5px solid ${theme.colors.border};
        padding-bottom: ${theme.spacing.md};
    }
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.lg};

    ${theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
    }
`;

const FullWidthField = styled.div`
    grid-column: 1 / -1;
`;

const Label = styled.label`
    display: block;
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text};
    margin-bottom: ${theme.spacing.xs};
    text-align: left;
`;

const Select = styled.select`
    width: 100%;
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.fontSizes.sm};
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    transition: ${theme.transitions.default};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px ${theme.colors.primary}20;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.fontSizes.sm};
    font-family: inherit;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    resize: vertical;
    transition: ${theme.transitions.default};

    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 3px ${theme.colors.primary}20;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ButtonGroup = styled.div<{ isFirstStep: boolean }>`
    display: flex;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
    justify-content: space-between;
    align-items: center;

    ${({ isFirstStep }) =>
        isFirstStep
            ? css`
                  margin-top: ${theme.spacing['4xl']};
              `
            : css`
                  margin-top: ${theme.spacing.xl};
              `}
`;

const ErrorText = styled.span`
    display: block;
    color: ${theme.colors.error};
    font-size: ${theme.fontSizes.sm};
    margin-top: ${theme.spacing.xs};
    text-align: left;
`;

/**
 * PartnerForm - UI Component
 * @description This component renders the partner registration form and
 * will handle form validation flow as well.
 * @param onClose - Function to close the form
 * @param onSubmit - Function to submit the form
 * @param loading - Boolean indicating if the form is in a loading state
 */
export default function PartnerForm({ onClose, onSubmit, loading = false }: PartnerFormProps) {
    const countriesWithCities = useRecoilValue(countriesWithCitiesAtom);

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<PartnerFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        about: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (field: keyof PartnerFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateStep1 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.country) {
            newErrors.country = 'Country is required';
        }
        if (!formData.city) {
            newErrors.city = 'City is required';
        }
        if (!formData.about.trim()) {
            newErrors.about = 'Please tell us about your business';
        } else if (formData.about.trim().length < 50) {
            newErrors.about = 'Please provide at least 50 characters about your business';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (currentStep === 1) {
            handleNext();
            return;
        }

        if (!validateStep2()) {
            return;
        }

        const { confirmPassword, ...submitData } = formData;
        await onSubmit({
            ...submitData,
            country: submitData.country,
            city: submitData.city,
        });
    };

    const countryOptions = [
        { value: '', label: 'Select Country' },
        ...(countriesWithCities.data?.map((c) => ({
            value: String(c.id),
            label: c.name,
        })) || []),
    ];

    const cityOptions = [
        { value: '', label: 'Select City' },
        ...(countriesWithCities.data
            ?.find((c) => String(c.id) === formData.country)
            ?.cities.map((ct) => ({
                value: String(ct.id),
                label: ct.name,
            })) || []),
    ];

    return (
        <FormWrapper>
            <FormContainer>
                <FormTitle>Become a Partner</FormTitle>
                <FormSubtitle>Join our network and grow your business with us</FormSubtitle>

                <form onSubmit={handleSubmit}>
                    {currentStep === 1 ? (
                        <>
                            <FormGrid>
                                <Input
                                    aria-label="Enter your first name"
                                    inputConfig={{ variant: 'outlined', size: 'sm' }}
                                    label="First Name"
                                    placeholder="Boltavoy"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    error={errors.firstName}
                                    required
                                    disabled={loading}
                                />

                                <Input
                                    aria-label="Enter your last name"
                                    label="Last Name"
                                    placeholder="Teshaboyev"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                    error={errors.lastName}
                                    inputConfig={{ variant: 'outlined', size: 'sm' }}
                                    required
                                    disabled={loading}
                                />

                                <FullWidthField>
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="boltavoy@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        error={errors.email}
                                        inputConfig={{ variant: 'outlined', size: 'sm' }}
                                        required
                                        disabled={loading}
                                    />
                                </FullWidthField>

                                <FullWidthField>
                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+821012345678"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        error={errors.phone}
                                        inputConfig={{ variant: 'outlined', size: 'sm' }}
                                        required
                                        disabled={loading}
                                    />
                                </FullWidthField>
                            </FormGrid>
                            <ButtonGroup isFirstStep={currentStep === 1}>
                                {onClose && (
                                    <Button size="sm" variant="text" type="button" onClick={onClose} disabled={loading}>
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    variant="light"
                                    size="sm"
                                    type="submit"
                                    disabled={loading}
                                    style={{ marginLeft: theme.spacing.md }}
                                >
                                    {loading ? 'Processing...' : 'Next Step'}
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            <FormGrid>
                                <div>
                                    <Label htmlFor="country">Country *</Label>
                                    <Select
                                        aria-label="Select your country"
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) => handleChange('country', e.target.value)}
                                        disabled={loading}
                                        required
                                    >
                                        {countryOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                    {errors.country && <ErrorText>{errors.country}</ErrorText>}
                                </div>

                                <div>
                                    <Label htmlFor="city">City *</Label>
                                    <Select
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        disabled={loading}
                                        required
                                    >
                                        {cityOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                    {errors.city && <ErrorText>{errors.city}</ErrorText>}
                                </div>

                                <FullWidthField>
                                    <Label htmlFor="about">About Your Business *</Label>
                                    <TextArea
                                        id="about"
                                        placeholder="Tell us about your business, services you offer, and why you want to partner with us..."
                                        value={formData.about}
                                        onChange={(e) => handleChange('about', e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    {errors.about && <ErrorText>{errors.about}</ErrorText>}
                                </FullWidthField>

                                <FullWidthField>
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        error={errors.password}
                                        inputConfig={{ variant: 'outlined', size: 'sm' }}
                                        required
                                        disabled={loading}
                                    />
                                </FullWidthField>

                                <FullWidthField>
                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                        error={errors.confirmPassword}
                                        inputConfig={{ variant: 'outlined', size: 'sm' }}
                                        required
                                        disabled={loading}
                                    />
                                </FullWidthField>
                            </FormGrid>
                            <ButtonGroup isFirstStep={false}>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                    onClick={handleBack}
                                    disabled={loading}
                                >
                                    Back
                                </Button>
                                <Button size="sm" type="submit" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            </ButtonGroup>
                        </>
                    )}
                </form>
            </FormContainer>
            <ImageSection>
                <PartnerImage src={partnerImage} alt="Become a Partner" />
            </ImageSection>
        </FormWrapper>
    );
}
