import styled from 'styled-components';
import {
    ArrowLeft,
    Calendar,
    Users,
    CreditCard,
    AlertCircle,
    Clock,
    Hash,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import Button from '@/components/common/Button';
import { BookingDetail } from '@/services/api/checkout/types';

type OrderHistoryProps = {
    bookingId: string;
    bookingDetail: BookingDetail | null;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onRetry: () => void;
};

const Container = styled.div`
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.xl};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
`;

const Title = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xl};
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingSpinner = styled.div`
    width: 48px;
    height: 48px;
    border: 3px solid ${({ theme }) => theme.colors.border};
    border-top: 3px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const LoadingText = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
`;

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: ${({ theme }) => theme.spacing.lg};
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
    background: ${({ theme }) => theme.colors.error}10;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid ${({ theme }) => theme.colors.error}20;
`;

const ErrorIcon = styled(AlertCircle)`
    color: ${({ theme }) => theme.colors.error};
`;

const ErrorMessage = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.text};
    max-width: 400px;
`;

const StatusCard = styled.div<{ $status?: string }>`
    background: ${({ theme, $status }) => {
        switch ($status?.toUpperCase()) {
            case 'COMPLETED':
                return `linear-gradient(135deg, ${theme.colors.success}15, ${theme.colors.success}05)`;
            case 'PENDING':
                return `linear-gradient(135deg, ${theme.colors.warning}15, ${theme.colors.warning}05)`;
            case 'CANCELLED':
            case 'FAILED':
                return `linear-gradient(135deg, ${theme.colors.error}15, ${theme.colors.error}05)`;
            default:
                return theme.colors.lightBackground;
        }
    }};
    border: 1px solid
        ${({ theme, $status }) => {
            switch ($status?.toUpperCase()) {
                case 'COMPLETED':
                    return theme.colors.success + '30';
                case 'PENDING':
                    return theme.colors.warning + '30';
                case 'CANCELLED':
                case 'FAILED':
                    return theme.colors.error + '30';
                default:
                    return theme.colors.border;
            }
        }};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatusHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        align-items: flex-start;
        gap: ${({ theme }) => theme.spacing.sm};
    }
`;

const StatusTitle = styled.div<{ $status?: string }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme, $status }) => {
        switch ($status?.toUpperCase()) {
            case 'COMPLETED':
                return theme.colors.success;
            case 'PENDING':
                return theme.colors.warning;
            case 'CANCELLED':
            case 'FAILED':
                return theme.colors.error;
            default:
                return theme.colors.text;
        }
    }};
`;

const StatusIcon = styled.div<{ $status?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${({ theme, $status }) => {
        switch ($status?.toUpperCase()) {
            case 'COMPLETED':
                return theme.colors.success + '20';
            case 'PENDING':
                return theme.colors.warning + '20';
            case 'CANCELLED':
            case 'FAILED':
                return theme.colors.error + '20';
            default:
                return theme.colors.lightBackground;
        }
    }};
`;

const BookingInfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
    }
`;

const BookingInfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoLabel = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.lightText};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoValue = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    text-align: left;
`;

const OrderCard = styled.div`
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const OrderHeader = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.primary}08,
        ${({ theme }) => theme.colors.primary}03
    );
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const TourInfo = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
    }
`;

const TourImage = styled.div<{ $hasImage?: boolean }>`
    width: 80px;
    height: 80px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme, $hasImage }) => ($hasImage ? 'transparent' : theme.colors.lightBackground)};
    border: 1px solid ${({ theme }) => theme.colors.border};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    svg {
        color: ${({ theme }) => theme.colors.lightText};
    }
`;

const TourDetails = styled.div`
    flex: 1;
`;

const TourTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    text-align: left;
`;

const TourMeta = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Section = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};

    &:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const SectionTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const ParticipantGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
`;

const ParticipantCard = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ParticipantHeader = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ParticipantAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary}20;
    color: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const ParticipantName = styled.div`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
`;

const ParticipantDetail = styled.div`
    display: flex;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.xs} 0;
    font-size: ${({ theme }) => theme.fontSizes.xs};

    span:first-child {
        color: ${({ theme }) => theme.colors.lightText};
    }

    span:last-child {
        color: ${({ theme }) => theme.colors.text};
        font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
`;

const PaymentCard = styled.div`
    background: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaymentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-bottom: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaymentMethod = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    text-transform: uppercase;
`;

const PaymentStatus = styled.span<{ $status: string }>`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    text-transform: uppercase;
    background: ${({ theme, $status }) => {
        switch ($status?.toUpperCase()) {
            case 'COMPLETED':
            case 'SUCCESS':
                return theme.colors.success;
            case 'PENDING':
                return theme.colors.warning;
            case 'FAILED':
            case 'CANCELLED':
                return theme.colors.error;
            default:
                return theme.colors.lightBackground;
        }
    }};
    color: white;
`;

const PaymentDetails = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
    }
`;

const PaymentDetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const PriceBreakdown = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
`;

const PriceRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm} 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};

    span:first-child {
        color: ${({ theme }) => theme.colors.lightText};
    }

    span:last-child {
        color: ${({ theme }) => theme.colors.text};
        font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
`;

const TotalRow = styled(PriceRow)`
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-size: ${({ theme }) => theme.fontSizes.lg};

    span {
        font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
        color: ${({ theme }) => theme.colors.primary};
    }
`;
/**
 * Order History - UI Component
 * @description Displays the user's order history with details and status.
 * @param {Object} props - Component props
 * @param {BookingDetail} props.bookingDetail - The booking details to display
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onBack - Callback for back button
 * @param {Function} props.onRetry - Callback for retrying the request
 */
export default function OrderHistory({ bookingDetail, loading, error, onBack, onRetry }: OrderHistoryProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'COMPLETED':
                return <CheckCircle size={18} />;
            case 'PENDING':
                return <Clock size={18} />;
            case 'CANCELLED':
            case 'FAILED':
                return <XCircle size={18} />;
            default:
                return <AlertTriangle size={18} />;
        }
    };

    const getParticipantInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    if (loading) {
        return (
            <Container>
                <LoadingContainer>
                    <LoadingSpinner />
                    <LoadingText>Loading order details...</LoadingText>
                </LoadingContainer>
            </Container>
        );
    }

    if (error || !bookingDetail) {
        return (
            <Container>
                <ErrorContainer>
                    <ErrorIcon size={48} />
                    <ErrorMessage>{error || 'Failed to load order details. Please try again.'}</ErrorMessage>
                    <Button variant="primary" onClick={onRetry}>
                        Try Again
                    </Button>
                </ErrorContainer>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <Button size="md" variant="text" onClick={onBack}>
                    <ArrowLeft size={20} />
                </Button>
                <Title>Order Details</Title>
            </Header>

            {/* Status Overview Card */}
            <StatusCard $status={bookingDetail.status}>
                <StatusHeader>
                    <StatusTitle $status={bookingDetail.status}>
                        <StatusIcon $status={bookingDetail.status}>{getStatusIcon(bookingDetail.status)}</StatusIcon>
                        Booking {bookingDetail.status}
                    </StatusTitle>
                </StatusHeader>

                <BookingInfoGrid>
                    <BookingInfoItem>
                        <InfoLabel>
                            <Hash size={12} />
                            Booking ID
                        </InfoLabel>
                        <InfoValue>{bookingDetail.uuid.slice(0, 8).toUpperCase()}</InfoValue>
                    </BookingInfoItem>

                    <BookingInfoItem>
                        <InfoLabel>
                            <Clock size={12} />
                            Booked On
                        </InfoLabel>
                        <InfoValue>{formatDateTime(bookingDetail.createdAt)}</InfoValue>
                    </BookingInfoItem>

                    <BookingInfoItem>
                        <InfoLabel>
                            <CreditCard size={12} />
                            Amount
                        </InfoLabel>
                        <InfoValue>
                            {bookingDetail.currency} {bookingDetail.amount}
                        </InfoValue>
                    </BookingInfoItem>
                </BookingInfoGrid>
            </StatusCard>
            <OrderCard>
                <OrderHeader>
                    <TourInfo>
                        <TourImage $hasImage={!!bookingDetail.mainImage}>
                            {bookingDetail.mainImage ? (
                                <img src={bookingDetail.mainImage} alt={bookingDetail.tourTitle} />
                            ) : (
                                <ImageIcon size={24} />
                            )}
                        </TourImage>
                        <TourDetails>
                            <TourTitle>{bookingDetail.tourTitle}</TourTitle>
                            {bookingDetail.tourType && <TourMeta>Tour Type: {bookingDetail.tourType}</TourMeta>}
                            <TourMeta>
                                <Calendar size={14} />
                                {bookingDetail.tripStartDate && bookingDetail.tripEndDate ? (
                                    <>
                                        {formatDate(bookingDetail.tripStartDate)} -{' '}
                                        {formatDate(bookingDetail.tripEndDate)}
                                    </>
                                ) : (
                                    'Travel dates not specified'
                                )}
                            </TourMeta>
                        </TourDetails>
                    </TourInfo>
                </OrderHeader>
                {bookingDetail.participants && bookingDetail.participants.length > 0 && (
                    <Section>
                        <SectionTitle>
                            <Users size={18} />
                            Participants ({bookingDetail.participants.length})
                        </SectionTitle>
                        <ParticipantGrid>
                            {bookingDetail.participants.map((participant, index) => (
                                <ParticipantCard key={index}>
                                    <ParticipantHeader>
                                        <ParticipantAvatar>
                                            {getParticipantInitials(participant.firstName, participant.lastName)}
                                        </ParticipantAvatar>
                                        <ParticipantName>
                                            {participant.firstName} {participant.lastName}
                                        </ParticipantName>
                                    </ParticipantHeader>
                                    <ParticipantDetail>
                                        <span>ID Type:</span>
                                        <span>{participant.idType}</span>
                                    </ParticipantDetail>
                                    <ParticipantDetail>
                                        <span>ID Number:</span>
                                        <span>{participant.idNumber}</span>
                                    </ParticipantDetail>
                                    <ParticipantDetail>
                                        <span>Date of Birth:</span>
                                        <span>{formatDate(participant.dateOfBirth)}</span>
                                    </ParticipantDetail>
                                </ParticipantCard>
                            ))}
                        </ParticipantGrid>
                    </Section>
                )}
                <Section>
                    <SectionTitle>
                        <CreditCard size={18} />
                        Payment Information
                    </SectionTitle>

                    {bookingDetail.payments &&
                        bookingDetail.payments.map((payment, index) => (
                            <PaymentCard key={index}>
                                <PaymentHeader>
                                    <PaymentMethod>
                                        <CreditCard size={16} />
                                        {payment.paymentMethod}
                                    </PaymentMethod>
                                    <PaymentStatus $status={payment.status}>{payment.status}</PaymentStatus>
                                </PaymentHeader>

                                <PaymentDetails>
                                    <PaymentDetailItem>
                                        <InfoLabel>Payment ID</InfoLabel>
                                        <InfoValue>{payment.paymentId || 'N/A'}</InfoValue>
                                    </PaymentDetailItem>

                                    <PaymentDetailItem>
                                        <InfoLabel>Payment Date</InfoLabel>
                                        <InfoValue>{formatDateTime(payment.createdAt)}</InfoValue>
                                    </PaymentDetailItem>

                                    {payment.payerId && (
                                        <PaymentDetailItem>
                                            <InfoLabel>Payer ID</InfoLabel>
                                            <InfoValue>{payment.payerId}</InfoValue>
                                        </PaymentDetailItem>
                                    )}
                                </PaymentDetails>

                                <PriceBreakdown>
                                    <PriceRow>
                                        <span>Tour Price</span>
                                        <span>$ {Math.round(parseFloat(payment.amount)) / 100}</span>
                                    </PriceRow>
                                    <TotalRow>
                                        <span>Total Amount</span>
                                        <span>$ {Math.round(parseFloat(payment.amount)) / 100}</span>
                                    </TotalRow>
                                </PriceBreakdown>
                            </PaymentCard>
                        ))}
                </Section>
            </OrderCard>
        </Container>
    );
}
