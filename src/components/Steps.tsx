import { CheckCircle2 } from 'lucide-react';
import styled from 'styled-components';

type CheckoutStep = 'cart' | 'checkout' | 'payment' | 'confirmation';

type CustomStepsProps = {
    current: number;
    steps: Array<{
        title: string;
        description?: string;
    }>;
};

const StepItem = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    position: relative;

    &:last-child {
        flex: 0;
    }
    padding-bottom: 3rem;

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: row;
        align-items: center;
        padding-bottom: ${({ theme }) => theme.spacing.xs};
        flex: 1;

        &:last-child {
            flex: 0;
        }
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

    ${({ theme }) => theme.responsive.mobile} {
        display: none;
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

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
        flex-direction: row;
        gap: 0;
        justify-content: space-between;
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

    ${({ theme }) => theme.responsive.mobile} {
        width: 24px;
        height: 24px;
        font-size: 10px;
    }

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

    ${({ theme }) => theme.responsive.mobile} {
        margin: 0 ${({ theme }) => theme.spacing.sm};
        height: 2px;
        flex: 1;
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

const CheckIconElement = () => <CheckCircle2 size={16} style={{ color: 'white' }} aria-label="Step completed" />;

/**
 * Render a horizontal stepper that visualizes step titles, optional descriptions, and completion state based on the current index.
 *
 * @param current - Zero-based index of the active step; steps with an index lower than this are treated as completed.
 * @param steps - Array of step objects each containing `title` and an optional `description` to display for that step.
 * @returns A JSX element representing the steps progress UI with circles, titles, optional descriptions, and connector lines.
 */
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
    const steps = [
        { title: 'Choose booking' },
        { title: 'Enter Info' },
        { title: 'Payment' },
        { title: 'Confirmation' },
    ];

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