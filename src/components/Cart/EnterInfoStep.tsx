import { useState } from 'react';
import styled from 'styled-components';
import Card from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { EnterInfoStepProps, Participant } from '@/types/cart';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import TripCard from '@/components/Card/TripCard';

const StepContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
    padding-bottom: 3rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const SidebarCard = styled(Card)`
    background-color: white;
    position: sticky;
    top: 2rem;
    height: fit-content;
`;

const ParticipantCard = styled(Card)`
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ParticipantHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const FormRow = styled.div`
    display: flex;
    gap: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

const DatePickerWrapper = styled.div<{ hasError?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 49%;

    label {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text};
        text-align: left;
        margin-top: 0.6rem;
    }

    .ant-picker {
        width: 100%;
        height: 44px;
        border-radius: ${({ theme }) => theme.borderRadius.md};
        border: 1px solid ${({ hasError, theme }) => (hasError ? theme.colors.accent : theme.colors.border)};

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

const AddParticipantButton = styled(Button)`
    align-self: flex-start;
    margin-top: 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: space-between;
`;

const SidebarContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const OrderSummary = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const SummaryItem = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
`;

const TotalSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    padding: 1rem 0;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Select = styled.select`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    background-color: white;
    transition: border-color 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
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
    }
`;

const WarningBox = styled.div`
    background-color: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 1rem;
    align-items: left;
    display: flex;
    color: #92400e;
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export default function EnterInfoStep({ cartItems, formData, onNext, onBack }: EnterInfoStepProps) {
    const [participants, setParticipants] = useState<Participant[]>(
        formData.participants.length > 0
            ? formData.participants
            : [
                  {
                      id: '1',
                      firstName: '',
                      lastName: '',
                      idType: 'passport',
                      idNumber: '',
                      dateOfBirth: '',
                  },
              ],
    );

    const [validationErrors, setValidationErrors] = useState<{ [participantId: string]: { [field: string]: string } }>(
        {},
    );

    const addParticipant = () => {
        const newParticipant: Participant = {
            id: Date.now().toString(),
            firstName: '',
            lastName: '',
            idType: 'passport',
            idNumber: '',
            dateOfBirth: '',
        };
        setParticipants([...participants, newParticipant]);
    };

    const clearError = (participantId: string, field: string) => {
        setValidationErrors((prev) => ({
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

        setValidationErrors(allErrors);

        if (!hasErrors) {
            onNext({ participants });
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.tourData.price) * item.quantity, 0);

    const validateParticipant = (participant: Participant) => {
        const errors: { [field: string]: string } = {};

        if (!participant.firstName.trim()) {
            errors.firstName = 'First name is required';
        }
        if (!participant.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }
        if (!participant.idNumber.trim()) {
            errors.idNumber = 'ID number is required';
        }
        if (!participant.dateOfBirth) {
            errors.dateOfBirth = 'Date of birth is required';
        }

        return errors;
    };

    return (
        <StepContainer>
            <MainContent>
                <TripCard
                    id={cartItems[0]?.tourId || '1'}
                    image={cartItems[0]?.tourData.mainImage || '/api/placeholder/80/80'}
                    title={cartItems[0]?.tourData.title || 'Samarkand city Tour (Individual)'}
                    subtitle={cartItems[0]?.tourData.tourType || 'One day trip'}
                    date={cartItems[0]?.selectedDate || '17 Apr 2025'}
                    price={subtotal}
                    variant="compact"
                    imageSize="small"
                    titleSize="large"
                    showQuantityControls={false}
                />
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
                                    if (validationErrors[participant.id]?.firstName) {
                                        clearError(participant.id, 'firstName');
                                    }
                                }}
                                placeholder="Enter first name"
                                error={validationErrors[participant.id]?.firstName}
                            />
                            <Input
                                label="Last Name *"
                                value={participant.lastName}
                                onChange={(e) => {
                                    updateParticipant(participant.id, 'lastName', e.target.value);
                                    if (validationErrors[participant.id]?.lastName) {
                                        clearError(participant.id, 'lastName');
                                    }
                                }}
                                placeholder="Enter last name"
                                error={validationErrors[participant.id]?.lastName}
                            />
                        </FormGrid>

                        <FormRow style={{ marginTop: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
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

                            <div style={{ flex: 1 }}>
                                <Input
                                    label="ID Number *"
                                    value={participant.idNumber}
                                    onChange={(e) => {
                                        updateParticipant(participant.id, 'idNumber', e.target.value);
                                        if (validationErrors[participant.id]?.idNumber) {
                                            clearError(participant.id, 'idNumber');
                                        }
                                    }}
                                    placeholder="Enter ID number"
                                    error={validationErrors[participant.id]?.idNumber}
                                />
                            </div>
                        </FormRow>

                        <DatePickerWrapper hasError={!!validationErrors[participant.id]?.dateOfBirth}>
                            <label>Date of Birth *</label>
                            <DatePicker
                                value={participant.dateOfBirth ? dayjs(participant.dateOfBirth) : null}
                                onChange={(date) => {
                                    updateParticipant(
                                        participant.id,
                                        'dateOfBirth',
                                        date ? date.format('YYYY-MM-DD') : '',
                                    );
                                    if (validationErrors[participant.id]?.dateOfBirth) {
                                        clearError(participant.id, 'dateOfBirth');
                                    }
                                }}
                                format="MM/DD/YYYY"
                                placeholder="mm/dd/yyyy"
                                style={{ width: '100%' }}
                            />
                            {validationErrors[participant.id]?.dateOfBirth && (
                                <ErrorMessage>{validationErrors[participant.id].dateOfBirth}</ErrorMessage>
                            )}
                        </DatePickerWrapper>
                    </ParticipantCard>
                ))}

                <AddParticipantButton variant="outline" onClick={addParticipant}>
                    + Add another participant
                </AddParticipantButton>

                <WarningBox>
                    Once your info is submitted, it cannot be changed. Please double-check before proceeding.
                </WarningBox>

                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Your booking will be submitted once you go to payment. You can choose your payment method in the
                    next step.
                </p>

                <ButtonGroup>
                    <Button variant="outline" onClick={onBack}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleNext}>
                        Continue to Payment
                    </Button>
                </ButtonGroup>
            </MainContent>

            <SidebarCard>
                <SidebarContent>
                    <h3
                        style={{
                            margin: '0 0 1rem 0',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            alignSelf: 'flex-start',
                            display: 'flex',
                        }}
                    >
                        Order Summary
                    </h3>

                    <OrderSummary>
                        {cartItems.map((item) => (
                            <SummaryItem key={item.tourData.id}>
                                <span>
                                    {item.tourData.title} x{item.quantity}
                                </span>
                                <span>${(Number(item.tourData.price) * item.quantity).toFixed(2)}</span>
                            </SummaryItem>
                        ))}
                    </OrderSummary>

                    <TotalSection>
                        <span>Total:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </TotalSection>
                </SidebarContent>
            </SidebarCard>
        </StepContainer>
    );
}
