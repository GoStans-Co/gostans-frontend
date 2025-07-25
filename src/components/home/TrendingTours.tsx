import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TourPropsResponse } from '@/services/api/tours';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import BannerCard from '@/components/Tours/ToursCard';
import defaultImage from '@/assets/default/default_1.jpg';

type TrendingToursProps = {
    tours: TourPropsResponse[];
    loading?: boolean;
};

const SectionContainer = styled.section`
    padding: 4rem 2rem;
    background-color: ${({ theme }) => theme.colors.lightBackground};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 2rem 1rem;
    }
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
    gap: 1rem;
    flex-wrap: wrap;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
        justify-content: center;
        margin-bottom: 2rem;
    }
`;

const SectionTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes['2xl']};
        text-align: left;
    }
`;

const ViewAllLink = styled(Link)`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    flex-shrink: 0;
    white-space: nowrap;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
        color: ${({ theme }) => theme.colors.secondary};
        text-decoration: underline;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.md};

        svg {
            width: 16px;
            height: 16px;
        }
    }
`;

const SwiperContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;

    .swiper {
        overflow: visible;
    }

    .swiper-slide {
        height: auto;
        display: flex;
    }

    /* Custom navigation buttons */
    .swiper-button-next,
    .swiper-button-prev {
        color: ${({ theme }) => theme.colors.primary};
        background: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        box-shadow: ${({ theme }) => theme.shadows.lg};
        transition: ${({ theme }) => theme.transitions.fast};
        z-index: 10;

        &:after {
            font-size: 20px;
            font-weight: bold;
        }

        &.swiper-button-disabled {
            opacity: 0.3;
            cursor: not-allowed;
            transform: none;
        }
    }

    .swiper-button-next {
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
    }

    .swiper-button-prev {
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
    }

    .swiper-button-next::after,
    .swiper-button-prev::after {
        font-size: 16px;
    }

    /* custom pagination */
    .swiper-pagination {
        position: relative;
        margin-top: ${({ theme }) => theme.spacing.lg};
        text-align: center;

        .swiper-pagination-bullet {
            width: 14px;
            height: 14px;
            background: ${({ theme }) => theme.colors.border};
            opacity: 0.7;
            transition: ${({ theme }) => theme.transitions.fast};
            margin: 0 6px;
        }

        .swiper-pagination-bullet-active {
            background: ${({ theme }) => theme.colors.primary};
            opacity: 1;
            transform: scale(1.3);
        }
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        .swiper {
            padding-bottom: 50px;
        }

        .swiper-button-next,
        .swiper-button-prev {
            display: none;
        }
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    color: ${({ theme }) => theme.colors.lightText};
    text-align: center;

    h3 {
        font-size: ${({ theme }) => theme.fontSizes.xl};
        font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
        color: ${({ theme }) => theme.colors.text};
    }

    p {
        font-size: ${({ theme }) => theme.fontSizes.md};
        color: ${({ theme }) => theme.colors.lightText};
    }
`;

const BannerCardWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

export default function TrendingTours({ tours, loading = false }: TrendingToursProps) {
    if (loading) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>Trending Tours</SectionTitle>
                    <ViewAllLink to="/trendingTours">
                        Explore All
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 18L15 12L9 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </ViewAllLink>
                </SectionHeader>
                <LoadingContainer>Loading tours...</LoadingContainer>
            </SectionContainer>
        );
    }

    if (!tours || tours.length === 0) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>Trending Tours</SectionTitle>
                    <ViewAllLink to="/trendingTours">
                        Explore All
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 18L15 12L9 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </ViewAllLink>
                </SectionHeader>
                <EmptyContainer>
                    <h3>No tours available</h3>
                    <p>Check back later for exciting tour packages!</p>
                </EmptyContainer>
            </SectionContainer>
        );
    }

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>Trending Tours</SectionTitle>
                <ViewAllLink to="/trendingTours">
                    Explore All
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </ViewAllLink>
            </SectionHeader>

            <SwiperContainer>
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={24}
                    slidesPerView={1}
                    slidesPerGroup={1}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={tours.length > 2}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    navigation={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 24,
                        },
                        1024: {
                            slidesPerView: 2,
                            spaceBetween: 24,
                        },
                        1200: {
                            slidesPerView: 2,
                            spaceBetween: 24,
                        },
                    }}
                >
                    {tours.map((tour) => (
                        <SwiperSlide key={tour.id}>
                            <BannerCardWrapper>
                                <BannerCard
                                    id={tour.id}
                                    title={tour.title}
                                    shortDescription={tour.shortDescription}
                                    price={tour.price}
                                    mainImage={tour.mainImage ? tour.mainImage : defaultImage}
                                    country={tour.country || 'Unknown'}
                                    currency={tour.currency || 'USD'}
                                    uuid={tour.uuid ?? ''}
                                    tourType={tour.tourType}
                                />
                            </BannerCardWrapper>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </SwiperContainer>
        </SectionContainer>
    );
}
