import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import { tours } from '@/data/mockData';
import { Box } from 'lucide-react';
import TripCard from '@/components/Card/TripCard';
import TripStatusTabs from '@/components/tours/TourStatusTabs';

type TripStatus = 'all' | 'booked' | 'waiting' | 'complete' | 'cancelled';

const TripsContainer = styled.div`
    width: 100%;
    max-width: 720px;
    padding: ${({ theme }) => theme.spacing.xl};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1rem;
        max-width: 100%;
    }
`;

const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xl};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const TripsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.md};
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

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.xl};
        margin: 0 0.5rem;
    }
`;

const EmptyIcon = styled.div`
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.lightText};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 2.5rem;
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const EmptyTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.lg};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const EmptyText = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: ${({ theme }) => theme.spacing.xl};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        margin-bottom: ${({ theme }) => theme.spacing.lg};
        padding: 0 ${({ theme }) => theme.spacing.md};
    }
`;
export default function TripsPage() {
    const [activeTab, setActiveTab] = useState<TripStatus>('all');
    const filteredTrips = tours.filter((trip) => (activeTab === 'all' ? true : trip.status === activeTab));
    const [showEmptyState, setShowEmptyState] = useState(filteredTrips.length === 0);

    useEffect(() => {
        setShowEmptyState(filteredTrips.length === 0);
    }, [filteredTrips]);

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
            <PageTitle>My Trips</PageTitle>

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
                    <TripStatusTabs activeStatus={activeTab} onStatusChange={setActiveTab} />
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
        </TripsContainer>
    );
}
