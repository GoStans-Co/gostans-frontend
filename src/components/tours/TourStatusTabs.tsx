import styled from 'styled-components';

export type TripStatus = 'all' | 'booked' | 'waiting' | 'complete' | 'cancelled';

type TripStatusTabsProps = {
    activeStatus: TripStatus;
    onStatusChange: (status: TripStatus) => void;
};

const getTabColor = (tabType: TripStatus, isActive = false) => {
    const colors = {
        all: isActive ? '#0F2846' : '#E5F4FF',
        booked: isActive ? '#10B981' : '#D1FAE5',
        waiting: isActive ? '#F59E0B' : '#FEF3C7',
        complete: isActive ? '#3B82F6' : '#DBEAFE',
        cancelled: isActive ? '#EF4444' : '#FECACA',
    };
    return colors[tabType];
};

const getTextColor = (tabType: TripStatus, isActive = false) => {
    const colors = {
        all: isActive ? '#FFFFFF' : '#0F2846',
        booked: isActive ? '#FFFFFF' : '#047857',
        waiting: isActive ? '#FFFFFF' : '#92400E',
        complete: isActive ? '#FFFFFF' : '#1D4ED8',
        cancelled: isActive ? '#FFFFFF' : '#991B1B',
    };
    return colors[tabType];
};

const TabsContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    overflow-x: auto;
    padding-bottom: ${({ theme }) => theme.spacing.sm};
    scrollbar-width: none;
    padding-top: ${({ theme }) => theme.spacing.sm};

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100%;
        justify-content: flex-start;
    }
`;

const Tab = styled.button<{ isActive: boolean; tabType: TripStatus }>`
    background-color: ${({ tabType, isActive }) => getTabColor(tabType, isActive)};
    color: ${({ tabType, isActive }) => getTextColor(tabType, isActive)};
    border: none;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease-in-out;

    box-shadow: ${({ isActive }) => (isActive ? '0 2px 6px rgba(0, 0, 0, 0.1)' : 'none')};

    &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
    }

    &:active {
        transform: translateY(0);
    }
`;

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
