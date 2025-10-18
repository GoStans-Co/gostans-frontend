import styled from 'styled-components';
import type { Dayjs } from 'dayjs';
import { DatePicker } from 'antd';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { TourDetailsResponse } from '@/services/api/tours';
import { formatCurrency } from '@/utils/general/formatCurrency';

type RightSidebarProps = {
    tour: TourDetailsResponse;
    selectedDate: Dayjs | null;
    onDateChange: (date: Dayjs | null) => void;
    isInCart: boolean;
    cartItemsCount: number;
    onBookingAction: () => void;
};

const RightSidebar = styled.div`
    position: -webkit-sticky;
    position: sticky;
    height: fit-content;
    z-index: 10;
    top: 100px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;

    ${({ theme }) => theme.responsive.maxMobile} {
        position: static;
        top: auto;
        max-height: none;
        overflow-y: visible;
        order: -1;
        margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
`;

const PriceCard = styled(Card)`
    padding: 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
        margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
`;

const PriceHeader = styled.div`
    text-align: right;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;

    .from {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.lightText};
    }

    .price {
        font-size: 1.4rem;
        font-weight: bold;
        color: ${({ theme }) => theme.colors.text};
    }
`;

const BookingForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.sm};
    }
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const FormLabel = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    text-align: left;
`;

const Total = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin-top: 1rem;

    .label {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
    }

    .amount {
        font-size: 1.25rem;
        font-weight: bold;
        color: ${({ theme }) => theme.colors.text};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.sm} 0;
        margin-top: ${({ theme }) => theme.spacing.sm};

        .amount {
            font-size: ${({ theme }) => theme.fontSizes.lg};
        }
    }
`;

const CartItemCount = styled.span`
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff6b35;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TourDetailsSection = styled.div`
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: 1rem;
`;

const TourDetailsTitle = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.75rem;
    font-weight: 600;
    text-align: left;
`;

const TourDetailsContent = styled.div`
    font-size: 13px;
    line-height: 1.5;
    text-align: left;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 3rem;
    color: ${({ theme }) => theme.colors.lightText};

    div {
        margin-bottom: 0.5rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .label {
        font-weight: 400;
        color: ${({ theme }) => theme.colors.lightText};
    }

    .value {
        color: ${({ theme }) => theme.colors.secondary};
        font-weight: 500;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.lg};
        font-size: ${({ theme }) => theme.fontSizes.sm};

        div {
            flex: 1;
            min-width: 45%;
        }
    }
`;

/**
 * SearchPackageDetailSidebar - Sub Component
 * @description This component displays the sidebar for the search package detail page,
 * including price, date selection, tour details, and booking action.
 */
export default function SearchPackageDetailSidebar({
    tour,
    selectedDate,
    onDateChange,
    isInCart,
    cartItemsCount,
    onBookingAction,
}: RightSidebarProps) {
    return (
        <RightSidebar>
            <PriceCard>
                <PriceHeader>
                    <div className="from">From</div>
                    <div className="price">{formatCurrency(tour.price)}</div>
                </PriceHeader>

                <BookingForm>
                    <div style={{ gap: '5px' }}>
                        <FormGroup>
                            <FormLabel>Date</FormLabel>
                            <DatePicker
                                value={selectedDate}
                                style={{ width: '100%', height: '48px' }}
                                placeholder="04.13.2025"
                                onChange={onDateChange}
                            />
                        </FormGroup>

                        <TourDetailsSection>
                            <TourDetailsTitle>Tour Details:</TourDetailsTitle>
                            <TourDetailsContent>
                                <div>
                                    <span className="label">Duration:</span>{' '}
                                    <span className="value">{tour.durationDays} </span>
                                </div>
                                <div>
                                    <span className="label">Ages:</span>{' '}
                                    <span className="value">
                                        {tour.ageMin}-{tour.ageMax} years
                                    </span>
                                </div>
                            </TourDetailsContent>
                        </TourDetailsSection>

                        <Total>
                            <span className="label">Total:</span>
                            <span className="amount">{formatCurrency(tour.price)}</span>
                        </Total>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth={true}
                            onClick={onBookingAction}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                position: 'relative',
                            }}
                        >
                            {isInCart ? 'Continue to Checkout' : 'Select Package'}
                            {cartItemsCount > 0 && <CartItemCount>{cartItemsCount}</CartItemCount>}
                        </Button>
                    </div>
                </BookingForm>
            </PriceCard>
        </RightSidebar>
    );
}
