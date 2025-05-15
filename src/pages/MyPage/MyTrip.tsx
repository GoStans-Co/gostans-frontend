import { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/Common/Button';
import { tours } from '@/data/mockData';
import { Box } from 'lucide-react';

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

const TripCard = styled.div`
    display: flex;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: white;
    overflow: hidden;
    padding: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

const TripImage = styled.div<{ imageUrl: string }>`
    width: 90px;
    min-width: 90px;
    height: 90px;
    background-image: url(${(props) => props.imageUrl});
    background-size: cover;
    background-position: center;
    border-radius: ${({ theme }) => theme.borderRadius.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 90px;
        height: 90px;
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const TripInfo = styled.div`
    padding-left: ${({ theme }) => theme.spacing.lg};
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Separates top info from bottom buttons */
    min-height: 90px; /* Match image height */
`;

const TripHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.sm};
    }
`;

const TripTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-weight: 600;
`;

const TripDate = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin: 0;
    line-height: 1.3;
`;

const TripPrice = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    margin-left: ${({ theme }) => theme.spacing.md};
    white-space: nowrap;
`;

const StatusPill = styled.div<{ status: string }>`
    margin-top: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: inline-block;
    font-weight: 500;

    ${({ status, theme }) => {
        switch (status) {
            case 'awaiting':
                return `
                    background-color: #FFF4DE;
                    color: #FFB82E;
                `;
            case 'booked':
                return `
                    background-color: #E6F7E6;
                    color: #28A745;
                `;
            case 'all':
                return `
                    background-color: #E6F4FF;
                    color: #0D7BFF;
                `;
            default:
                return `
                    background-color: ${theme.colors.lightBackground};
                    color: ${theme.colors.text};
                `;
        }
    }}
`;

const TripActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: auto;
    padding-top: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        justify-content: flex-end;
    }
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
                            <TripCard key={trip.id}>
                                <TripImage imageUrl={trip.image} />
                                <TripInfo>
                                    <div>
                                        <TripHeader>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    width: '100%',
                                                }}
                                            >
                                                <TripTitle>{trip.title}</TripTitle>
                                                <TripDate>{trip.dayInfo || 'One Day Tour'}</TripDate>
                                                <TripDate>{trip.date}</TripDate>
                                            </div>
                                            <TripPrice>${trip.price}</TripPrice>
                                        </TripHeader>

                                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            {trip.status && (
                                                <StatusPill
                                                    status={trip.status === 'waiting' ? 'awaiting' : trip.status}
                                                >
                                                    {trip.status === 'waiting'
                                                        ? 'Awaiting'
                                                        : trip.status === 'booked'
                                                          ? 'Booked'
                                                          : trip.status}
                                                </StatusPill>
                                            )}
                                        </div>
                                    </div>

                                    <TripActions>{getTripActions(trip.status)}</TripActions>
                                </TripInfo>
                            </TripCard>
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
