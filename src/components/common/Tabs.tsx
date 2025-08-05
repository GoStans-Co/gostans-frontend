import { theme } from '@/styles/theme';
import styled from 'styled-components';

export type TabItem = {
    id: string;
    label: string;
    count?: number;
};

type TabContainerProps = {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
    variant?: 'default' | 'centered' | 'compact';
};

const Container = styled.div<{ variant?: string }>`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ variant }) => (variant === 'compact' ? '0' : theme.spacing['2xl'])};
    max-width: ${({ variant }) => (variant === 'centered' ? '1200px' : 'none')};
    margin-left: ${({ variant }) => (variant === 'centered' ? 'auto' : 'initial')};
    margin-right: ${({ variant }) => (variant === 'centered' ? 'auto' : 'initial')};
    overflow-x: auto;
    align-items: center;
    justify-content: flex-start;
    padding: 0;
    min-width: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.sm};
        justify-content: flex-start;
        margin-bottom: 2rem;
    }

    &::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none;
`;

const Tab = styled.button<{ active: boolean }>`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    white-space: nowrap;
    border: none;
    background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.lightBackground)};
    color: ${({ active, theme }) => (active ? theme.colors.background : theme.colors.text)};
    transition: all ${({ theme }) => theme.transitions.default};
    cursor: pointer;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }

    &:hover {
        background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.border)};
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:active {
        outline: none;
        border: none;
    }
`;

export default function Tabs({ tabs, activeTab, onTabChange, className, variant = 'default' }: TabContainerProps) {
    return (
        <Container variant={variant} className={className}>
            {tabs.map((tab) => (
                <Tab key={tab.id} active={activeTab === tab.id} onClick={() => onTabChange(tab.id)}>
                    {tab.label}
                    {tab.count !== undefined && ` ${tab.count}`}
                </Tab>
            ))}
        </Container>
    );
}
