import { useState } from 'react';
import styled from 'styled-components';
import Card from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { EnterInfoStepProps, Participant } from '@/types/cart';

const StepContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;

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

const AddParticipantButton = styled(Button)`
    align-self: flex-start;
    margin-top: 1rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
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

    label {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        font-weight: 500;
        color: ${({ theme }) => theme.colors.text};
    }
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
        const isValid = participants.every((p) => p.firstName && p.lastName && p.idNumber && p.dateOfBirth);

        if (isValid) {
            onNext({ participants });
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <StepContainer>
            <MainContent>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Enter participant information</h2>

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
                                onChange={(e) => updateParticipant(participant.id, 'firstName', e.target.value)}
                                placeholder="Enter first name"
                            />
                            <Input
                                label="Last Name *"
                                value={participant.lastName}
                                onChange={(e) => updateParticipant(participant.id, 'lastName', e.target.value)}
                                placeholder="Enter last name"
                            />
                        </FormGrid>

                        <FormRow style={{ marginTop: '1rem' }}>
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
                            <Input
                                label="ID Number *"
                                value={participant.idNumber}
                                onChange={(e) => updateParticipant(participant.id, 'idNumber', e.target.value)}
                                placeholder="Enter ID number"
                            />
                        </FormRow>

                        <Input
                            label="Date of Birth *"
                            type="date"
                            value={participant.dateOfBirth}
                            onChange={(e) => updateParticipant(participant.id, 'dateOfBirth', e.target.value)}
                            style={{ marginTop: '1rem' }}
                        />
                    </ParticipantCard>
                ))}

                <AddParticipantButton variant="outline" onClick={addParticipant}>
                    + Add another participant
                </AddParticipantButton>

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
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Order Summary</h3>

                    <OrderSummary>
                        {cartItems.map((item) => (
                            <SummaryItem key={item.id}>
                                <span>
                                    {item.name} x{item.quantity}
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
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
