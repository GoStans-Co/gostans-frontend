import { useState } from 'react';
import styled from 'styled-components';
import {
    FaStar,
    FaMapMarkerAlt,
    FaClock,
    FaUsers,
    FaGlobe,
    FaUserFriends,
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft,
    FaArrowRight,
    FaUtensils,
    FaBed,
    FaCheck,
    FaTimes,
} from 'react-icons/fa';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import default_n1 from '@/assets/default/default_1.jpg';
import TourCard from '@/components/tours/ToursCard';
import MapBox from '@/pages/SearchPackage/MapBox';
import { isValidCoordinate } from '@/utils/geoCodingCheck';
import { FaInfoCircle } from 'react-icons/fa';
import { theme } from '@/styles/theme';
import { getDisplayLanguages, getLocationInfo } from '@/utils/general/tourDetailsHelper';
import { TourDetailsResponse } from '@/services/api/tours';

type LeftContentProps = {
    tour: TourDetailsResponse;
    expandedDays: Set<number>;
    onToggleDay: (day: number) => void;
    trendingTours: any[];
    onNavigateToTour: (tourId: string) => void;
};

const LeftContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 800px;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.lg};
        max-width: 100%;
        order: 0;
    }
`;

const MapContainer = styled.div`
    width: 100%;
    height: 300px;
    background: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.lightText};
    background-size: cover;
    background-position: center;
`;

const ReviewsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 2rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        margin-top: ${({ theme }) => theme.spacing.sm};
    }
`;

const ReviewCard = styled(Card)`
    padding: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
        width: 100%;
        max-width: 100%;
    }
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    .left-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
`;

const RelatedTours = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    overflow: hidden;

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const Section = styled.div`
    margin-bottom: 1rem;

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        text-align: left;
        color: ${({ theme }) => theme.colors.text};

        ${({ theme }) => theme.responsive.maxMobile} {
            font-size: ${({ theme }) => theme.fontSizes.xl};
        }
    }

    p {
        line-height: 1.6;
        text-align: left;
        color: ${({ theme }) => theme.colors.lightText};

        ${({ theme }) => theme.responsive.maxMobile} {
            font-size: ${({ theme }) => theme.fontSizes.sm};
            line-height: 1.5;
        }
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 0;
    }
`;

const Itinerary = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    text-align: left;
`;

const ItineraryDay = styled.div.withConfig({
    shouldForwardProp: (prop) => !['active'].includes(prop),
})<{ active?: boolean }>`
    display: block;
    align-items: flex-start;
    gap: 1rem;
`;

const TimelineContainer = styled.div`
    position: relative;
`;

const DayContent = styled.div`
    flex: 1;

    h4 {
        margin: 0 0 0.5rem 0;
        color: ${({ theme }) => theme.colors.text};
    }

    p {
        padding-left: 60px;
        margin: 0.5rem 0 0 0;
        color: ${({ theme }) => theme.colors.lightText};
        font-size: 14px;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding-left: 0;
    }
`;

const Arrow = styled.span.withConfig({
    shouldForwardProp: (prop) => !['expanded'].includes(prop),
})<{ expanded: boolean }>`
    transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.3s ease;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 12px;
`;

const ReviewsSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 0;
        padding-bottom: 0;
    }
`;

const ReviewerName = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
`;

const ReviewDate = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.lightText};
`;

const NavigationButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
`;

const DayContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => !['last'].includes(prop),
})<{ last: boolean }>`
    position: relative;
    margin-bottom: ${({ last }) => (last ? '0' : '20px')};
`;

const DayNumberStyled = styled.div.withConfig({
    shouldForwardProp: (prop) => !['active'].includes(prop),
})<{ active: boolean }>`
    position: absolute;
    left: 10px;
    z-index: 2;
    background: ${({ active }) => (active ? '#000' : '#fff')};
    color: ${({ active }) => (active ? '#fff' : '#000')};
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Description = styled.p`
    white-space: pre-line;
`;

const InfoParagraph = styled.p`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.error};
`;

const DayHeaderStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding-left: 60px;
    min-height: 40px;
`;

const StartContainer = styled.div`
    position: relative;
    margin-bottom: 20px;
`;

const StartBubble = styled.div`
    position: absolute;
    left: 10px;
    z-index: 2;
    background: #ffd700;
    color: #000;
    border-radius: 999px;
    padding: 5px 10px;
    font-weight: bold;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
`;

const StartContent = styled.div`
    padding-left: 60px;
    h4 {
        margin: 0;
        color: ${({ theme }) => theme.colors.text};
        font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        margin-left: 8px;
        padding: 4px 0;
    }
    p {
        margin: 4px 0 0;
        color: ${({ theme }) => theme.colors.primary};
        font-size: 14px;
    }
`;

const EndContainer = styled.div`
    position: relative;
    margin-top: 20px;
`;

const EndBubble = styled.div`
    position: absolute;
    left: 10px;
    z-index: 2;
    background: #ffd700;
    color: #000;
    border-radius: 999px;
    padding: 5px 10px;
    font-weight: bold;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
`;

const EndContent = styled.div`
    padding-left: 60px;
    h4 {
        margin: 0;
        padding: 4px 0;
        color: ${({ theme }) => theme.colors.text};
        font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        margin-left: 8px;
    }
`;

const TimelineLine = styled.div`
    position: absolute;
    left: 29px;
    top: 0;
    bottom: 0;
    border-left: 2px dotted #ccc;
    z-index: 1;
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-top: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        align-items: stretch;
    }
`;

const InfoCards = styled.div`
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;

    ${({ theme }) => theme.responsive.maxMobile} {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: ${({ theme }) => theme.spacing.sm};
    }
`;

const InfoCardItemValue = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    max-width: 110px;
    text-overflow: ellipsis;
    line-height: 1.2;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        max-width: 100%;
    }
`;

const InfoCardItemIcon = styled.div`
    color: ${({ theme }) => theme.colors.primary};

    svg {
        vertical-align: center;
        line-height: 1;
        font-size: 1.2rem;
        height: 1.4rem;
        width: 1.4rem;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        svg {
            vertical-align: center;
            line-height: 1;
            font-size: 0.9rem;
            height: 1.2rem;
            width: 1.2rem;
        }
    }
`;

const StyledInfoCard = styled(Card)`
    background: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    flex: 0 1 auto;
    min-width: 140px;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        flex-direction: row; /* Keep horizontal on mobile */
        align-items: center; /* Keep center alignment */
        text-align: left; /* Keep left alignment */
        min-width: unset;
        gap: ${({ theme }) => theme.spacing.sm};
    }
`;

const IncludedExcludedCard = styled(Card)`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.lg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const StyledCallout = styled.div`
    background: ${({ theme }) => `${theme.colors.warning}15`};
    border: 1px solid ${({ theme }) => `${theme.colors.warning}30`};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: 0;
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};

    .callout-icon {
        color: ${({ theme }) => theme.colors.warning};
        flex-shrink: 0;
        margin-top: 2px;
    }

    .callout-text {
        flex: 1;
        color: ${({ theme }) => theme.colors.text};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        line-height: 1.5;
        text-align: left;
    }
`;

const IncludedExcludedItem = styled.div.withConfig({
    shouldForwardProp: (prop) => !['included'].includes(prop),
})<{ included?: boolean }>`
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.sm} 0;

    .item-icon {
        flex-shrink: 0;
        margin-top: 2px;
    }

    .item-text {
        flex: 1;
        color: ${({ theme }) => theme.colors.text};
        font-size: ${({ theme }) => theme.fontSizes.md};
        line-height: 1.5;
        text-align: left;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.sm};

        .item-text {
            font-size: ${({ theme }) => theme.fontSizes.sm};
        }
    }
`;

const SlotContainer = styled.div`
    position: relative;
    padding-left: 0;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
    background: ${theme.colors.lightBackground};
    margin-bottom: 1rem;
    margin-top: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${theme.spacing.sm};
    }
`;

const SlotItem = styled.div`
    margin-bottom: 0.5rem;
    position: relative;
    padding-left: 0;
`;

const SlotTimeRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
`;

const SlotContentRow = styled.div`
    margin-left: 20px;
`;

const SlotBullet = styled.div`
    width: 8px;
    height: 8px;
    background: ${theme.colors.primary};
    border-radius: 50%;
    margin-right: 12px;
    flex-shrink: 0;
`;

const SlotTimeText = styled.div`
    display: flex;
    align-items: center;
    color: ${theme.colors.primary};
    font-weight: 600;
    font-size: ${theme.fontSizes.sm};
`;

const SlotTitle = styled.div`
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${theme.colors.text};
    font-size: ${theme.fontSizes.md};
`;

const SlotDescription = styled.div`
    color: ${theme.colors.lightText};
    font-size: ${theme.fontSizes.sm};
    line-height: 1.6;
`;

export default function SearchPackageContent({
    tour,
    expandedDays,
    onToggleDay,
    trendingTours,
    onNavigateToTour,
}: LeftContentProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const toursPerPage = 3;

    const filteredTours = trendingTours.filter((t) => t.uuid !== tour?.uuid).slice(0, 12);

    const totalPages = Math.ceil(filteredTours.length / toursPerPage);
    const visibleTours = filteredTours.slice(currentPage * toursPerPage, (currentPage + 1) * toursPerPage);

    const { startLocation, endLocation, isLoop } = getLocationInfo(tour.itineraries);
    const endMessage = isLoop ? "You'll return to the starting point" : `You'll end at ${endLocation}`;

    const renderIncludedItems = (items: any[], type: 'included' | 'excluded') => {
        const Icon = type === 'included' ? FaCheck : FaTimes;
        const color = type === 'included' ? '#228b22' : '#ff0000';
        const defaultText = type === 'included' ? 'No included items specified.' : 'No excluded items specified.';

        if (!items?.length) {
            return [
                {
                    icon: <Icon style={{ color, fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }} />,
                    text: defaultText,
                    key: `${type}-default`,
                },
            ];
        }

        return items.flatMap((item, index) => {
            const itemArray = Array.isArray(item) ? item : [item];
            return itemArray.map((subItem, subIndex) => ({
                icon: <Icon style={{ color, fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }} />,
                text: subItem.text || '',
                key: `${type}-${index}-${subIndex}`,
            }));
        });
    };

    const includedItems = renderIncludedItems(tour.includedItem || [], 'included');
    const excludedItems = renderIncludedItems(tour.excludedItem || [], 'excluded');

    const reviews = [
        {
            name: 'Oybek',
            date: '4.13.2025',
            rating: 5,
            text: 'I had an amazing experience with this tour! The guides were knowledgeable and the sights were breathtaking. Highly recommend!',
        },
        {
            name: 'Aziz',
            date: '4.13.2025',
            rating: 5,
            text: 'This tour exceeded my expectations! The itinerary was well-planned, and I got to see so many incredible places. The food was also fantastic!',
        },
    ];

    return (
        <LeftContent>
            {/* Tour Info Cards */}
            <InfoRow>
                <InfoCards>
                    <StyledInfoCard>
                        <InfoCardItemIcon>
                            <FaClock />
                        </InfoCardItemIcon>
                        <div>
                            <div
                                style={{
                                    fontSize: theme.fontSizes.xs,
                                    color: theme.colors.lightText,
                                    lineHeight: 1.2,
                                    textAlign: 'left',
                                }}
                            >
                                Duration
                            </div>
                            <InfoCardItemValue>{tour.durationDays}</InfoCardItemValue>
                        </div>
                    </StyledInfoCard>

                    <StyledInfoCard>
                        <InfoCardItemIcon>
                            <FaMapMarkerAlt />
                        </InfoCardItemIcon>
                        <div>
                            <div
                                style={{
                                    fontSize: theme.fontSizes.xs,
                                    color: theme.colors.lightText,
                                    lineHeight: 1.2,
                                    textAlign: 'left',
                                }}
                            >
                                Tour Type
                            </div>
                            <InfoCardItemValue>{tour.tourType}</InfoCardItemValue>
                        </div>
                    </StyledInfoCard>

                    <StyledInfoCard>
                        <InfoCardItemIcon>
                            <FaUsers />
                        </InfoCardItemIcon>
                        <div>
                            <div
                                style={{
                                    fontSize: theme.fontSizes.xs,
                                    color: theme.colors.lightText,
                                    lineHeight: 1.2,
                                    textAlign: 'left',
                                }}
                            >
                                Group Size
                            </div>
                            <InfoCardItemValue>{tour.groupSize}</InfoCardItemValue>
                        </div>
                    </StyledInfoCard>

                    <StyledInfoCard>
                        <InfoCardItemIcon>
                            <FaUserFriends />
                        </InfoCardItemIcon>
                        <div>
                            <div
                                style={{
                                    fontSize: theme.fontSizes.xs,
                                    color: theme.colors.lightText,
                                    lineHeight: 1.2,
                                    textAlign: 'left',
                                }}
                            >
                                Ages
                            </div>
                            <InfoCardItemValue>
                                {tour.ageMin}-{tour.ageMax}
                            </InfoCardItemValue>
                        </div>
                    </StyledInfoCard>

                    <StyledInfoCard>
                        <InfoCardItemIcon>
                            <FaGlobe />
                        </InfoCardItemIcon>
                        <div>
                            <div
                                style={{
                                    fontSize: theme.fontSizes.xs,
                                    color: theme.colors.lightText,
                                    lineHeight: 1.2,
                                    textAlign: 'left',
                                }}
                            >
                                Languages
                            </div>
                            <InfoCardItemValue>{getDisplayLanguages(tour.language || '')}</InfoCardItemValue>
                        </div>
                    </StyledInfoCard>
                </InfoCards>
            </InfoRow>

            {/* Tour Overview */}
            <Section>
                <h2>Tour Overview</h2>
                <p>{tour.about}</p>
            </Section>

            {/* What's Included */}
            <Section>
                <h2>What's included</h2>
                <IncludedExcludedCard>
                    <div>
                        {includedItems?.map((item) => (
                            <IncludedExcludedItem key={item.key} included>
                                <div className="item-icon">
                                    <FaCheck
                                        style={{
                                            color: '#228b22',
                                            fontSize: '1.25rem',
                                            flexShrink: 0,
                                            marginTop: '2px',
                                        }}
                                    />
                                </div>
                                <span className="item-text">{item.text}</span>
                            </IncludedExcludedItem>
                        ))}
                    </div>
                    <div>
                        {excludedItems?.map((item) => (
                            <IncludedExcludedItem key={item.key}>
                                <div className="item-icon">
                                    <FaTimes
                                        style={{
                                            color: '#ff0000',
                                            fontSize: '1.25rem',
                                            flexShrink: 0,
                                            marginTop: '2px',
                                        }}
                                    />
                                </div>
                                <span className="item-text">{item.text}</span>
                            </IncludedExcludedItem>
                        ))}
                    </div>
                </IncludedExcludedCard>
                <StyledCallout>
                    <FaInfoCircle className="callout-icon" size={20} />
                    <div className="callout-text">
                        <strong>Important:</strong> Please review what's included and excluded in your tour package
                        carefully. Additional expenses not listed below will be your responsibility.
                    </div>
                </StyledCallout>
            </Section>

            {/* Itinerary */}
            <Section>
                <h2>Itinerary</h2>
                <Itinerary>
                    <TimelineContainer>
                        <StartContainer>
                            <StartBubble>Start</StartBubble>
                            <StartContent>
                                <h4>You'll start at {startLocation}</h4>
                            </StartContent>
                        </StartContainer>
                        <TimelineLine />

                        {tour.itineraries?.map((day, index) => (
                            <ItineraryDay key={day.dayNumber} active={expandedDays.has(day.dayNumber)}>
                                <DayContainer last={index === tour.itineraries.length - 1}>
                                    <DayNumberStyled active={expandedDays.has(day.dayNumber)}>
                                        {day.dayNumber}
                                    </DayNumberStyled>
                                    <DayContent>
                                        <DayHeaderStyled onClick={() => onToggleDay(day.dayNumber)}>
                                            <h4>
                                                Day {day.dayNumber}: {day.dayTitle}
                                            </h4>
                                            <Arrow expanded={expandedDays.has(day.dayNumber)}>▼</Arrow>
                                        </DayHeaderStyled>

                                        {expandedDays.has(day.dayNumber) && (
                                            <>
                                                <Description>
                                                    {day.description}
                                                    {day.slots && day.slots.length > 0 && (
                                                        <SlotContainer>
                                                            {day.slots.map((slot, slotIndex) => (
                                                                <SlotItem key={slotIndex}>
                                                                    <SlotTimeRow>
                                                                        <SlotBullet />
                                                                        <SlotTimeText>
                                                                            <FaClock
                                                                                size={12}
                                                                                style={{ marginRight: '6px' }}
                                                                            />
                                                                            {slot.startTime?.slice(0, 5) || ''} -{' '}
                                                                            {slot.endTime?.slice(0, 5) || ''}
                                                                        </SlotTimeText>
                                                                    </SlotTimeRow>
                                                                    <SlotContentRow>
                                                                        <SlotTitle>
                                                                            {slot.title || 'Untitled'}
                                                                        </SlotTitle>
                                                                        {slot.description && (
                                                                            <SlotDescription>
                                                                                {slot.description}
                                                                            </SlotDescription>
                                                                        )}
                                                                    </SlotContentRow>
                                                                </SlotItem>
                                                            ))}
                                                        </SlotContainer>
                                                    )}
                                                </Description>

                                                {day.includedMeals && (
                                                    <InfoParagraph>
                                                        <FaUtensils size={16} />
                                                        <strong>Included Meals:</strong> {day.includedMeals}
                                                    </InfoParagraph>
                                                )}

                                                {day.accommodation && (
                                                    <InfoParagraph>
                                                        <FaBed size={16} />
                                                        <strong>Accommodation:</strong> {day.accommodation}
                                                    </InfoParagraph>
                                                )}
                                            </>
                                        )}
                                    </DayContent>
                                </DayContainer>
                            </ItineraryDay>
                        ))}

                        <EndContainer>
                            <EndBubble>End</EndBubble>
                            <EndContent>
                                <h4>{endMessage}</h4>
                            </EndContent>
                        </EndContainer>
                    </TimelineContainer>
                </Itinerary>
            </Section>

            {/* Map Section */}
            <Section id="map">
                <h2>Location</h2>
                {Array.isArray(tour.itineraries) && tour.itineraries.length > 0 ? (
                    <MapBox
                        key={tour.uuid + '-' + tour.itineraries.length}
                        itineraries={tour.itineraries.map((item) => ({
                            id: item.id,
                            dayNumber: item.dayNumber,
                            dayTitle: item.dayTitle,
                            description: item.description,
                            locationNames: item.locationNames || [],
                            locationName: item.locationNames?.map((l) => l.name).join(', ') || '',
                            latitude:
                                item.locationNames?.find((l) => isValidCoordinate(l.latitude, l.longitude))?.latitude ??
                                null,
                            longitude:
                                item.locationNames?.find((l) => isValidCoordinate(l.latitude, l.longitude))
                                    ?.longitude ?? null,
                            accommodation: item.accommodation,
                            includedMeals: item.includedMeals,
                            slots:
                                item.slots?.map((slot) => ({
                                    locationNames: slot.locationNames || [],
                                })) || [],
                        }))}
                        tourUuid={tour.uuid}
                        height="500px"
                    />
                ) : (
                    <MapContainer>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '200px',
                                color: '#666666',
                            }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                            <div>No itinerary available</div>
                        </div>
                    </MapContainer>
                )}
            </Section>

            {/* Reviews */}
            <Section>
                <ReviewsSection>
                    <h2>Reviews</h2>
                    <Button variant="text" size="sm">
                        Read all reviews
                    </Button>
                </ReviewsSection>
                <ReviewsContainer>
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} variant="outlined">
                            <ReviewHeader>
                                <div className="left-content">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                        <Rating>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} color="#ffc107" size={14} />
                                            ))}
                                        </Rating>
                                        <ReviewerName>{review.name}</ReviewerName>
                                    </div>
                                </div>
                                <ReviewDate>{review.date}</ReviewDate>
                            </ReviewHeader>
                            <p>{review.text}</p>
                        </ReviewCard>
                    ))}
                </ReviewsContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <Button variant="outline" size="sm">
                        <FaChevronLeft />
                    </Button>
                    <Button variant="outline" size="sm">
                        <FaChevronRight />
                    </Button>
                </div>
            </Section>

            {/* Related Tours */}
            <Section>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                    }}
                >
                    <h2>Explore other options</h2>
                    <NavigationButtons>
                        <Button
                            variant="circle"
                            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            aria-label="Previous page"
                        >
                            <FaArrowLeft />
                        </Button>
                        <Button
                            variant="circle"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            aria-label="Next page"
                        >
                            <FaArrowRight />
                        </Button>
                    </NavigationButtons>
                </div>
                <RelatedTours>
                    {visibleTours.map((relatedTour) => (
                        <div
                            style={{ cursor: 'pointer' }}
                            key={relatedTour.id}
                            onClick={() => onNavigateToTour(relatedTour.uuid)}
                        >
                            <TourCard
                                buttonText="See more"
                                key={relatedTour.id}
                                id={relatedTour.id}
                                title={relatedTour.title}
                                shortDescription={relatedTour.shortDescription}
                                mainImage={relatedTour.mainImage || default_n1}
                                tourType={{
                                    id: relatedTour.tourType?.id || 0,
                                    name: relatedTour.tourType?.name || 'General',
                                }}
                                price={relatedTour.price}
                                country={relatedTour.country}
                                variant="button"
                                currency="USD"
                                isLiked={relatedTour.isLiked}
                            />
                        </div>
                    ))}
                </RelatedTours>
            </Section>
        </LeftContent>
    );
}
