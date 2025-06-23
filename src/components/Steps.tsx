import { CheckCircle2 } from 'lucide-react';
import styled from 'styled-components';

type CheckoutStep = 'cart' | 'checkout' | 'payment' | 'confirmation';

const StepItem = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;

    &:last-child {
        flex: 0;
    }
    padding-bottom: 3rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        width: 100%;
        padding-bottom: 1rem;
    }
`;

const StepContent = styled.div`
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.75rem;
    width: max-content;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        position: static;
        transform: none;
        margin-top: 0.5rem;
        text-align: center;
    }
`;

const StepWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const StepsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    max-width: 900px;
    margin: 0 auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: 1rem 0.5rem;
        flex-direction: column;
        gap: 1rem;
    }
`;

const StepCircle = styled.div<{ status: 'completed' | 'active' | 'pending' }>`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 12px;
    flex-shrink: 0;
    transition: all 0.3s ease;

    ${({ status, theme }) => {
        switch (status) {
            case 'completed':
                return `
                    background-color: ${theme.colors.primary};
                    color: white;
                    border: 2px solid ${theme.colors.primary};
                `;
            case 'active':
                return `
                    background-color: ${theme.colors.primary};
                    color: white;
                    border: 2px solid ${theme.colors.primary};
                    box-shadow: 0 0 0 4px rgba(15, 40, 70, 0.1);
                `;
            case 'pending':
                return `
                    background-color: ${theme.colors.border};
                    color: ${theme.colors.lightText};
                    border: 2px solid ${theme.colors.border};
                `;
        }
    }}
`;

const StepLine = styled.div<{ completed: boolean }>`
    flex: 1;
    height: 2px;
    margin: 0 1rem;
    background-color: ${({ completed, theme }) => (completed ? theme.colors.primary : theme.colors.border)};
    transition: background-color 0.3s ease;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: none;
    }
`;

const StepTitle = styled.div<{ active: boolean }>`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ active }) => (active ? '600' : '400')};
    color: ${({ active, theme }) => (active ? theme.colors.text : theme.colors.lightText)};
    white-space: nowrap;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        white-space: normal;
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const StepDescription = styled.div`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin-top: 2px;
    white-space: nowrap;
`;

const CheckIconElement = () => <CheckCircle2 size={24} style={{ color: 'white' }} aria-label="Step completed" />;

type CustomStepsProps = {
    current: number;
    steps: Array<{
        title: string;
        description?: string;
    }>;
};

export default function CustomSteps({ current, steps }: CustomStepsProps) {
    return (
        <StepsContainer>
            {steps.map((step, index) => {
                const status = index < current ? 'completed' : index === current ? 'active' : 'pending';
                const isLast = index === steps.length - 1;

                return (
                    <StepItem key={index}>
                        <StepWrapper>
                            <StepCircle status={status}>
                                {status === 'completed' ? <CheckIconElement /> : index + 1}
                            </StepCircle>
                            <StepContent>
                                <StepTitle active={status === 'active' || status === 'completed'}>
                                    {step.title}
                                </StepTitle>
                                {step.description && <StepDescription>{step.description}</StepDescription>}
                            </StepContent>
                        </StepWrapper>
                        {!isLast && <StepLine completed={status === 'completed'} />}
                    </StepItem>
                );
            })}
        </StepsContainer>
    );
}

export const StepsWrapper = ({
    currentStep,
    showConfirmation = false,
}: {
    currentStep: CheckoutStep;
    showConfirmation?: boolean;
}) => {
    const steps = [{ title: 'Choose booking' }, { title: 'Enter Info' }, { title: 'Payment' }];

    if (showConfirmation) {
        steps.push({ title: 'Confirmation' });
    }

    const getStepIndex = (step: CheckoutStep): number => {
        switch (step) {
            case 'cart':
                return 0;
            case 'checkout':
                return 1;
            case 'payment':
                return 2;
            case 'confirmation':
                return 3;
            default:
                return 0;
        }
    };

    const current = showConfirmation ? 3 : getStepIndex(currentStep);

    return <CustomSteps current={current} steps={steps} />;
};
