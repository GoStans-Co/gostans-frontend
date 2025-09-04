import styled from 'styled-components';

export type TripStatus = 'all' | 'booked' | 'waiting' | 'complete' | 'cancelled';

type ThemeColors = {
    background: string;
    primary: string;
    success: string;
    warning: string;
    info: string;
    error: string;
    text: string;
};

type Theme = {
    colors: ThemeColors;
};

type TripStatusTabsProps = {
    activeStatus: TripStatus;
    onStatusChange: (status: TripStatus) => void;
};

const getTabColor = (tabType: TripStatus, isActive: boolean = false, theme: Theme): string => {
    if (!isActive) {
        return theme.colors.background;
    }

    const activeColors: Record<TripStatus, string> = {
        all: theme.colors.primary,
        booked: theme.colors.success,
        waiting: theme.colors.warning,
        complete: theme.colors.info,
        cancelled: theme.colors.error,
    };
    return activeColors[tabType];
};

const getTextColor = (isActive: boolean = false, theme: Theme): string => {
    if (!isActive) {
        return theme.colors.text;
    }

    return theme.colors.background;
};

const TabsContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    overflow-x: auto;
    padding: ${({ theme }) => `${theme.spacing.sm} 0 ${theme.spacing.md} 0`};
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.border} transparent;

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
    }

    &::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.colors.muted};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100%;
        justify-content: flex-start;
    }
`;

const Tab = styled.button<{ isActive: boolean; tabType: TripStatus }>`
    background-color: ${({ tabType, isActive, theme }) => getTabColor(tabType, isActive, theme)};
    color: ${({ isActive, theme }) => getTextColor(isActive, theme)};
    border: 1px solid ${({ theme, isActive }) => (isActive ? 'transparent' : theme.colors.border)};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    cursor: pointer;
    white-space: nowrap;
    transition: ${({ theme }) => theme.transitions.fast};

    box-shadow: ${({ isActive, theme }) => (isActive ? theme.shadows.sm : 'none')};

    &:hover {
        transform: translateY(-1px);
        box-shadow: ${({ theme }) => theme.shadows.md};
        ${({ isActive, theme }) =>
            !isActive &&
            `
            background-color: ${theme.colors.lightBackground};
            border-color: ${theme.colors.muted};
        `}
    }

    &:active {
        transform: translateY(0);
    }

    &:focus {
        outline: none;
        box-shadow: ${({ isActive, theme }) => (isActive ? theme.shadows.md : `0 0 0 2px ${theme.colors.primary}25`)};
    }
`;

/**
 * TripStatusTabs - Atom Component
 * @description A tab component to filter trips by their status.
 * @param {TripStatus} props.activeStatus - The currently active tab status.
 * @param {function} props.onStatusChange - Callback function to handle status changes.
 */
export default function TripStatusTabs({ activeStatus, onStatusChange }: TripStatusTabsProps) {
    const tabs: TripStatus[] = ['all', 'booked', 'waiting', 'complete', 'cancelled'];

    const tabLabels: Record<TripStatus, string> = {
        all: 'All',
        booked: 'Booked',
        waiting: 'Waiting',
        complete: 'Complete',
        cancelled: 'Cancelled',
    };

    return (
        <TabsContainer>
            {tabs.map((tab) => (
                <Tab key={tab} isActive={activeStatus === tab} tabType={tab} onClick={() => onStatusChange(tab)}>
                    {tabLabels[tab]}
                </Tab>
            ))}
        </TabsContainer>
    );
}
