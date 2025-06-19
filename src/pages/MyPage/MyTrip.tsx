import { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/Common/Button';
import { tours } from '@/data/mockData';
import { Box } from 'lucide-react';
import TripCard from '@/components/Card/TripCard';

type TripStatus = 'all' | 'booked' | 'waiting' | 'complete' | 'cancelled';

const TripsContainer = styled.div`
    width: 100%;
    max-width: 720px;
    padding: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    text-align: left;
`;

const FilterTabs = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    overflow-x: auto;
    padding-bottom: ${({ theme }) => theme.spacing.sm};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        justify-content: flex-start;
    }
`;

const FilterTab = styled.button<{ isActive: boolean }>`
    background-color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : 'white')};
    color: ${({ isActive, theme }) => (isActive ? 'white' : theme.colors.text)};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: 500;
    white-space: nowrap;

    &:hover {
        background-color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.lightBackground)};
    }
`;

const TripsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ theme }) => theme.spacing['3xl']};
    background-color: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    text-align: center;
`;

const EmptyIcon = styled.div`
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.lightText};
`;

const EmptyTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
`;

const EmptyText = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export default function TripsPage() {
    const [activeTab, setActiveTab] = useState<TripStatus>('all');
    const [showEmptyState, setShowEmptyState] = useState(false);

    const filteredTrips = tours.filter((trip) => (activeTab === 'all' ? true : trip.status === activeTab));

    const getTripActions = (status: TripStatus) => {
        switch (status) {
            case 'waiting':
                return (
                    <>
                        <Button variant="outline" size="mini">
                            Cancel
                        </Button>
                        <Button variant="primary" size="mini">
                            Go to payment
                        </Button>
                    </>
                );
            case 'complete':
                return (
                    <Button variant="outline" size="mini">
                        Delete
                    </Button>
                );
            case 'cancelled':
                return (
                    <>
                        <Button variant="outline" size="mini">
                            Delete
                        </Button>
                        <Button variant="primary" size="mini">
                            Book again
                        </Button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <TripsContainer>
            <PageTitle>Trips</PageTitle>

            {showEmptyState ? (
                <EmptyState>
                    <EmptyIcon>
                        <Box size={64} />
                    </EmptyIcon>
                    <EmptyTitle>Nothing booked yet!</EmptyTitle>
                    <EmptyText>
                        You haven't booked any trips yet. Start exploring and book your first adventure!
                    </EmptyText>
                    <Button variant="primary">Explore and book!</Button>
                </EmptyState>
            ) : (
                <>
                    <FilterTabs>
                        <FilterTab isActive={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                            All
                        </FilterTab>
                        <FilterTab isActive={activeTab === 'booked'} onClick={() => setActiveTab('booked')}>
                            Booked
                        </FilterTab>
                        <FilterTab isActive={activeTab === 'waiting'} onClick={() => setActiveTab('waiting')}>
                            Waiting
                        </FilterTab>
                        <FilterTab isActive={activeTab === 'complete'} onClick={() => setActiveTab('complete')}>
                            Complete
                        </FilterTab>
                        <FilterTab isActive={activeTab === 'cancelled'} onClick={() => setActiveTab('cancelled')}>
                            Cancelled
                        </FilterTab>
                    </FilterTabs>
                    <TripsList>
                        {filteredTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                id={trip.id}
                                image={trip.image}
                                title={trip.title}
                                subtitle={trip.dayInfo || 'One Day Tour'}
                                date={trip.date}
                                price={trip.price}
                                status={trip.status}
                                actions={getTripActions(trip.status)}
                            />
                        ))}
                    </TripsList>
                </>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button
                    variant="outline"
                    onClick={() => setShowEmptyState(!showEmptyState)}
                    style={{ marginTop: '20px' }}
                >
                    Toggle Empty State (Demo)
                </Button>
            </div>
        </TripsContainer>
    );
}
