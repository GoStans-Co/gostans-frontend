import { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import { Box } from 'lucide-react';
import TripCard from '@/components/Card/TripCard';
import TripStatusTabs from '@/components/tours/TourStatusTabs';
import { Booking } from '@/services/api/user';

type TripStatus = 'all' | 'booked' | 'waiting' | 'complete' | 'cancelled';
type TripsPageProps = {
    bookings?: {
        all: Booking[];
        upcoming: Booking[];
        completed: Booking[];
    };
    onTripClick?: (bookingId: string) => void;
};

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

export default function TripsPage({ bookings, onTripClick }: TripsPageProps) {
    const [activeTab, setActiveTab] = useState<TripStatus>('all');

    const mapBookingStatus = (status: string): TripStatus => {
        const upperStatus = status.toUpperCase();
        switch (upperStatus) {
            case 'PENDING':
                return 'waiting';
            case 'BOOKED':
            case 'CONFIRMED':
                return 'booked';
            case 'COMPLETED':
                return 'complete';
            case 'CANCELLED':
                return 'cancelled';
            default:
                return 'waiting';
        }
    };

    const transformedTrips =
        bookings?.all.map((booking) => ({
            id: `booking-${booking.id}`,
            bookingId: booking.id.toString(),
            uuid: booking.uuid,
            image: booking.mainImage.startsWith('http')
                ? booking.mainImage
                : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${booking.mainImage}`,
            title: booking.tourTitle,
            dayInfo: `${booking.tourType}`,
            date: `${booking.tripStartDate} - ${booking.tripEndDate}`,
            price: Number(booking.amount),
            status: mapBookingStatus(booking.status) as TripStatus,
        })) || [];

    const filteredTrips =
        activeTab === 'all' ? transformedTrips : transformedTrips.filter((trip) => trip.status === activeTab);

    const showEmptyState = filteredTrips.length === 0;

    const getTripActions = (status: TripStatus, tripId: string) => {
        switch (status) {
            case 'waiting':
                return (
                    <>
                        <Button variant="outline" size="mini" onClick={() => handleCancel(tripId)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="mini" onClick={() => handlePayment(tripId)}>
                            Go to payment
                        </Button>
                    </>
                );
            case 'complete':
                return (
                    <Button variant="outline" size="mini" onClick={() => handleDelete(tripId)}>
                        Delete
                    </Button>
                );
            case 'cancelled':
                return (
                    <>
                        <Button variant="outline" size="mini" onClick={() => handleDelete(tripId)}>
                            Delete
                        </Button>
                        <Button variant="primary" size="mini" onClick={() => handleBookAgain(tripId)}>
                            Book again
                        </Button>
                    </>
                );
            default:
                return null;
        }
    };

    const handleCancel = (tripId: string) => {
        console.info('Cancel trip:', tripId);
    };

    const handlePayment = (tripId: string) => {
        console.info('Go to payment:', tripId);
    };

    const handleDelete = (tripId: string) => {
        console.info('Delete trip:', tripId);
    };

    const handleBookAgain = (tripId: string) => {
        console.info('Book again:', tripId);
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
                    <Button variant="primary" onClick={() => (window.location.href = '/searchTrips')}>
                        Explore and book!
                    </Button>
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
                                subtitle={trip.dayInfo}
                                date={trip.date}
                                price={trip.price}
                                status={trip.status}
                                actions={getTripActions(trip.status, trip.id)}
                                onClick={() => onTripClick?.(trip.bookingId)}
                            />
                        ))}
                    </TripsList>
                </>
            )}
        </TripsContainer>
    );
}
