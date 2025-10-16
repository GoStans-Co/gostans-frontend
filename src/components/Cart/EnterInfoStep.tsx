import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from '@/components/common/Card';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import TripCard from '@/components/Card/TripCard';
import OrderSummary from '@/components/Payment/OrderSummary';
import { EnterInfoStepProps, Participant } from '@/services/api/cart';
import { useValidation } from '@/hooks/utils/useValidation';

const NAME_VALIDATION_REGEX = /^[a-zA-Z\s-]+$/;
const MIN_ID_LENGTH = 5;

const StepContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    padding-bottom: 3rem;
    max-width: 1200px;
    margin: 0 auto;

    ${({ theme }) => theme.responsive.laptop} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.lg};
    }

    ${({ theme }) => theme.responsive.mobile} {
        display: flex;
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.md};
        padding-bottom: ${({ theme }) => theme.spacing['2xl']};
        padding-left: ${({ theme }) => theme.spacing.sm};
        padding-right: ${({ theme }) => theme.spacing.sm};
    }
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    ${({ theme }) => theme.responsive.mobile} {
        gap: ${({ theme }) => theme.spacing.lg};
    }
`;

const ParticipantCard = styled(Card)`
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.border};

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const ParticipantHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    ${({ theme }) => theme.responsive.mobile} {
        // flex-direction: column;
        align-items: flex-start;
        gap: ${({ theme }) => theme.spacing.sm};
        margin-bottom: ${({ theme }) => theme.spacing.lg};

        h3 {
            margin: 0;
            font-size: ${({ theme }) => theme.fontSizes.lg};
            font-weight: 500;
        }

        button {
            align-self: flex-end;
        }
    }
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    ${({ theme }) => theme.responsive.mobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const FormRow = styled.div`
    display: flex;
    gap: 1rem;

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const DatePickerWrapper = styled.div<{ hasError?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 49%;

    ${({ theme }) => theme.responsive.mobile} {
        width: 100%;
        margin-top: ${({ theme }) => theme.spacing.md};
    }

    label {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text};
        text-align: left;
        margin-top: 0.6rem;

        ${({ theme }) => theme.responsive.mobile} {
            margin-top: 0;
        }
    }

    .ant-picker {
        width: 100%;
        height: 44px;
        border-radius: ${({ theme }) => theme.borderRadius.md};
        border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.accent : theme.colors.border)};

        ${({ theme }) => theme.responsive.mobile} {
            height: 48px;
            font-size: ${({ theme }) => theme.fontSizes.md};
        }

        &:hover {
            border-color: ${({ theme }) => theme.colors.primary};
        }

        &.ant-picker-focused {
            border-color: ${({ theme }) => theme.colors.primary};
            box-shadow: 0 0 0 2px rgba(15, 40, 70, 0.1);
        }
    }
`;

const ErrorMessage = styled.span`
    color: ${({ theme }) => theme.colors.accent};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    align-self: flex-start;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: space-between;

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: row;
        gap: ${({ theme }) => theme.spacing.md};
        width: 100%;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 0.65rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.md};
    background-color: white;
    transition: all ${({ theme }) => theme.transitions.default};
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    height: 48px;

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.fontSizes.md};
        height: 48px;
        width: 100%;
    }

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px rgba(31, 101, 160, 0.2);
    }

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: ${({ theme }) => theme.colors.lightBackground};
    }
`;

const SelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
    align-items: flex-start;
    width: 100%;

    label {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text};
        text-align: left;

        ${({ theme }) => theme.responsive.maxMobile} {
            font-size: ${({ theme }) => theme.fontSizes.xs};
        }
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 0.375rem;
        flex-direction: column;
        align-items: flex-start;
    }
`;

const WarningBox = styled.div`
    background-color: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 0.6rem;
    align-items: flex-start;
    display: flex;
    color: #92400e;
    font-size: ${({ theme }) => theme.fontSizes.sm};

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.fontSizes.xs};
        text-align: left;
        line-height: 1.1;
    }
`;

/**
 * Enter Information Step  - Organism Component
 * @description Collects participant information for the cart items.
 * @param props - Props for the component
 * @returns JSX.Element
 */
export default function EnterInfoStep({
    cartItems,
    formData,
    guestCounts,
    calculateTotal,
    onNext,
    onBack,
}: EnterInfoStepProps) {
    const [participants, setParticipants] = useState<Participant[]>(
        formData.participants.length > 0
            ? formData.participants
            : [{ id: '1', firstName: '', lastName: '', idType: 'passport', idNumber: '', dateOfBirth: '' }],
    );

    const { resetErrors } = useValidation('billing');
    const [participantErrors, setParticipantErrors] = useState<{
        [participantId: string]: { [field: string]: string };
    }>({});

    useEffect(() => {
        if (guestCounts && formData.participants.length === 0) {
            let totalPeople = 0;
            Object.values(guestCounts).forEach((counts) => {
                totalPeople += counts.adults + counts.children;
            });

            if (totalPeople > participants.length) {
                const newParticipants = [];
                for (let i = 0; i < totalPeople; i++) {
                    newParticipants.push({
                        id: (i + 1).toString(),
                        firstName: '',
                        lastName: '',
                        idType: 'passport',
                        idNumber: '',
                        dateOfBirth: '',
                    });
                }
                setParticipants(newParticipants);
            }
        }
    }, [guestCounts]);

    const validateName = (name: string, fieldName: string): string => {
        if (!name.trim()) {
            return `${fieldName} is required`;
        }
        if (!NAME_VALIDATION_REGEX.test(name.trim())) {
            return `Please enter a valid ${fieldName.toLowerCase()} (letters, spaces, and hyphens only)`;
        }
        return '';
    };

    const clearError = (participantId: string, field: string) => {
        setParticipantErrors((prev) => ({
            ...prev,
            [participantId]: {
                ...prev[participantId],
                [field]: '',
            },
        }));
    };

    const updateParticipant = (id: string, field: keyof Participant, value: string) => {
        setParticipants((prev) =>
            prev.map((participant) => (participant.id === id ? { ...participant, [field]: value } : participant)),
        );

        if (participantErrors[id]?.[field]) {
            setParticipantErrors((prev) => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    [field]: '',
                },
            }));
        }
    };

    const removeParticipant = (id: string) => {
        if (participants.length > 1) {
            setParticipants((prev) => prev.filter((p) => p.id !== id));
        }
    };
    const handleNext = () => {
        const allErrors: { [participantId: string]: { [field: string]: string } } = {};
        let hasErrors = false;

        participants.forEach((participant) => {
            const errors = validateParticipant(participant);
            if (Object.keys(errors).length > 0) {
                allErrors[participant.id] = errors;
                hasErrors = true;
            }
        });

        setParticipantErrors(allErrors);

        if (!hasErrors) {
            resetErrors();
            onNext({ participants });
        }
    };

    const total = calculateTotal();

    const validateParticipant = (participant: Participant) => {
        const errors: { [field: string]: string } = {};

        const firstNameError = validateName(participant.firstName, 'First name');
        if (firstNameError) errors.firstName = firstNameError;

        const lastNameError = validateName(participant.lastName, 'Last name');
        if (lastNameError) errors.lastName = lastNameError;

        if (!participant.idNumber.trim() || participant.idNumber.trim().length < MIN_ID_LENGTH) {
            errors.idNumber = `ID number must be at least ${MIN_ID_LENGTH} characters`;
        }

        if (!participant.dateOfBirth) {
            errors.dateOfBirth = 'Date of birth is required';
        } else {
            const dob = new Date(participant.dateOfBirth);
            const today = new Date();
            if (dob >= today) {
                errors.dateOfBirth = 'Date of birth must be in the past';
            }
        }

        return errors;
    };

    return (
        <StepContainer>
            <MainContent>
                <Link to={`/searchTrips/${cartItems[0]?.tourId || '1'}`}>
                    <TripCard
                        id={cartItems[0]?.tourId || '1'}
                        image={cartItems[0]?.tourData.mainImage || '/api/placeholder/80/80'}
                        title={cartItems[0]?.tourData.title || 'Samarkand city Tour (Individual)'}
                        subtitle={String(cartItems[0]?.tourData.tourType || 'One day trip')}
                        date={cartItems[0]?.selectedDate || '17 Apr 2025'}
                        price={total}
                        variant="compact"
                        imageSize="small"
                        titleSize="large"
                        showQuantityControls={false}
                    />
                </Link>
                {participants.map((participant, index) => (
                    <ParticipantCard key={participant.id}>
                        <ParticipantHeader>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>
                                Participant {index + 1}
                            </h3>
                            {participants.length > 1 && (
                                <Button variant="text" size="sm" onClick={() => removeParticipant(participant.id)}>
                                    Remove
                                </Button>
                            )}
                        </ParticipantHeader>

                        <FormGrid>
                            <Input
                                label="First Name *"
                                value={participant.firstName}
                                onChange={(e) => {
                                    updateParticipant(participant.id, 'firstName', e.target.value);
                                    if (participantErrors[participant.id]?.firstName) {
                                        clearError(participant.id, 'firstName');
                                    }
                                }}
                                placeholder="Enter first name"
                                error={participantErrors[participant.id]?.firstName}
                            />
                            <Input
                                label="Last Name *"
                                value={participant.lastName}
                                onChange={(e) => {
                                    updateParticipant(participant.id, 'lastName', e.target.value);
                                    if (participantErrors[participant.id]?.lastName) {
                                        clearError(participant.id, 'lastName');
                                    }
                                }}
                                placeholder="Enter last name"
                                error={participantErrors[participant.id]?.lastName}
                            />
                        </FormGrid>
                        <FormRow style={{ marginTop: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, width: '100%' }}>
                                <SelectWrapper>
                                    <label>ID Type *</label>
                                    <Select
                                        value={participant.idType}
                                        onChange={(e) => updateParticipant(participant.id, 'idType', e.target.value)}
                                    >
                                        <option value="passport">Passport</option>
                                        <option value="license">Driver's License</option>
                                        <option value="national-id">National ID</option>
                                    </Select>
                                </SelectWrapper>
                            </div>

                            <div style={{ flex: 1, width: '100%' }}>
                                <Input
                                    label="ID Number *"
                                    value={participant.idNumber}
                                    onChange={(e) => {
                                        updateParticipant(participant.id, 'idNumber', e.target.value);
                                        if (participantErrors[participant.id]?.idNumber) {
                                            clearError(participant.id, 'idNumber');
                                        }
                                    }}
                                    placeholder="Enter ID number"
                                    error={participantErrors[participant.id]?.idNumber}
                                />
                            </div>
                        </FormRow>

                        <DatePickerWrapper hasError={!!participantErrors[participant.id]?.dateOfBirth}>
                            <label>Date of Birth *</label>
                            <DatePicker
                                value={participant.dateOfBirth ? dayjs(participant.dateOfBirth) : null}
                                onChange={(date) => {
                                    updateParticipant(
                                        participant.id,
                                        'dateOfBirth',
                                        date ? date.format('YYYY-MM-DD') : '',
                                    );
                                    if (participantErrors[participant.id]?.dateOfBirth) {
                                        clearError(participant.id, 'dateOfBirth');
                                    }
                                }}
                                format="MM/DD/YYYY"
                                placeholder="mm/dd/yyyy"
                                style={{ width: '100%' }}
                            />
                            {participantErrors[participant.id]?.dateOfBirth && (
                                <ErrorMessage>{participantErrors[participant.id].dateOfBirth}</ErrorMessage>
                            )}
                        </DatePickerWrapper>
                    </ParticipantCard>
                ))}
                <WarningBox>
                    Once your info is submitted, it cannot be changed. Please double-check before proceeding.
                </WarningBox>

                <ButtonGroup>
                    <Button variant="outline" onClick={onBack} size="md">
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleNext} size="md">
                        Continue to Payment
                    </Button>
                </ButtonGroup>
            </MainContent>
            <OrderSummary cartItems={cartItems} total={total} showButton={false} />
        </StepContainer>
    );
}
