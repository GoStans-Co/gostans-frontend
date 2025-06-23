import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Dayjs } from 'dayjs';
import {
    FaStar,
    FaMapMarkerAlt,
    FaHeart,
    FaClock,
    FaUsers,
    FaGlobe,
    FaUserFriends,
    FaCheck,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft,
    FaArrowRight,
} from 'react-icons/fa';
import { DatePicker, message } from 'antd';
import Button from '@/components/Common/Button';
import Card from '@/components/Common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import useApiServices from '@/services';
import { tourDetailsAtom } from '@/atoms/tours';
import { useRecoilState, useRecoilValue } from 'recoil';
import CopyLink from '@/components/CopyLink';
import default_n1 from '@/assets/default/default_1.jpg';
import default_n2 from '@/assets/default/default_2.jpg';
import TourCard from '@/components/Tours/ToursCard';
import { tours } from '@/data/mockData';
import { cartAtom } from '@/atoms/cart';

const PageContainer = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    overflow: visible;
`;
const Header = styled.div`
    background: white;
    padding: 1rem 2rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const MainContent = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow: visible;

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const LeftContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 800px;
`;

const InfoCards = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
    margin-top: 0;
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

const ReviewCard = styled(Card)`
    padding: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
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
    // overflow-x: auto;
    overflow: hidden;
`;

const Breadcrumb = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: 1rem;

    a {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const TitleSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const IconButton = styled.button`
    width: 40px;
    height: 40px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: white;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background: ${({ theme }) => theme.colors.lightBackground};
    }
`;

const MetaInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const ImageSection = styled.div`
    width: 100%;
    position: relative;
    margin-bottom: 2rem;
`;

const ImageGallery = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.5rem;
    height: 520px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    width: 100%;
`;

const MainImage = styled.div`
    grid-row: 1 / 3;
    grid-column: 1;
    position: relative;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const SideImage = styled.div`
    position: relative;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ContentSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
    align-items: start;
    overflow: visible;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const RightSidebar = styled.div`
    position: -webkit-sticky;
    position: sticky;
    top: 20px;
    height: fit-content;
    z-index: 10;
`;

const PriceCard = styled(Card)`
    padding: 1.5rem;
    border: 2px solid ${({ theme }) => theme.colors.border};
`;

const SeeAllButton = styled.button`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    cursor: pointer;
`;

const InfoCard = styled(Card)`
    text-align: center;
    padding: 1.5rem 1rem;
    background-color: ${({ theme }) => theme.colors.lightBackground};

    .icon {
        color: ${({ theme }) => theme.colors.primary};
        margin-bottom: 0.5rem;
    }

    .label {
        font-size: 12px;
        color: ${({ theme }) => theme.colors.lightText};
        margin-bottom: 0.25rem;
    }

    .value {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
    }
`;

const Section = styled.div`
    margin-bottom: 2rem;

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        text-align: left;
        color: ${({ theme }) => theme.colors.text};
    }

    p {
        line-height: 1.6;
        text-align: left;
        color: ${({ theme }) => theme.colors.lightText};
    }
`;

const IncludedExcluded = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ListItem = styled.div<{ included?: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .icon {
        color: ${({ included }) => (included ? '#52c41a' : '#ff4d4f')};
    }
`;

const Itinerary = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: left;
`;

const ItineraryDay = styled.div<{ active?: boolean }>`
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ active, theme }) => (active ? theme.colors.lightBackground : 'white')};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DayNumber = styled.div<{ active?: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.lightBackground)};
    color: ${({ active }) => (active ? 'white' : '#666')};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
`;

const DayContent = styled.div`
    flex: 1;

    h4 {
        margin: 0 0 0.5rem 0;
        color: ${({ theme }) => theme.colors.text};
    }

    p {
        margin: 0;
        color: ${({ theme }) => theme.colors.lightText};
        font-size: 14px;
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
        font-size: 2rem;
        font-weight: bold;
        color: ${({ theme }) => theme.colors.text};
    }
`;

const BookingForm = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

const GuestSelector = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    background: white;
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
`;

const ReviewsSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
`;

const ReviewerName = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
`;

const ReviewDate = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.lightText};
`;

const ImageModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: pointer;
`;

const ImageModalContent = styled(motion.div)`
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    cursor: default;
`;

const ModalImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-width: 90vw;
    max-height: 90vh;
`;

const CloseButton = styled(Button)`
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    z-index: 1001;
`;

const NavigationButton = styled(Button)`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    color: white;
    background: ${({ theme }) => theme.colors.primary};

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

const PrevButton = styled(NavigationButton)`
    left: -60px;
`;

const NextButton = styled(NavigationButton)`
    right: -60px;
`;

const ImageCounter = styled.div`
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 1rem;
`;

const NavigationButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    margin-top: 0.5rem;
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
    fontsize: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function SearchPackageDetails() {
    const { packageId: id } = useParams<{ packageId: string }>();
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [adults, setAdults] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const tourDetailsCache = useRecoilValue(tourDetailsAtom);
    const [cart, setCart] = useRecoilState(cartAtom);
    const [messageApi, contextHolder] = message.useMessage();

    const { tours: toursService } = useApiServices();

    const toursPerPage = 3;

    const tour = id ? tourDetailsCache[id]?.data : null;

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        const cachedTour = tourDetailsCache[id];
        console.log('Cache check for id', id, ':', cachedTour);

        if (cachedTour?.data) {
            console.log('Using cached tour details');
            setIsLoading(false);
            return;
        }

        console.log('No valid cache found, making API call');
        setIsLoading(true);

        const fetchTourDetails = async () => {
            try {
                const response = await toursService.getTourDetails(id);
                console.log('Tour details fetched:', response);
            } catch (error) {
                console.error('Error fetching tour details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTourDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    fontSize: '18px',
                }}
            >
                Loading tour details...
            </div>
        );
    }

    if (!tour) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    fontSize: '18px',
                }}
            >
                Tour not found
            </div>
        );
    }

    const filteredTours = tours.filter((tour) => {
        if (tour.id === id) return false;
        return tour.country.toLowerCase() === tour.country.toLowerCase();
    });

    const totalPages = Math.ceil(filteredTours.length / toursPerPage);

    const images =
        tour.images?.length > 0 ? tour.images.map((img) => img.image || default_n1) : [tour.mainImage || default_n1];
    const galleryImages = [...images];

    const defaultImages = [default_n1, default_n2];
    let defaultIndex = 0;

    while (galleryImages.length < 5) {
        galleryImages.push(defaultImages[defaultIndex % 2]);
        defaultIndex++;
    }

    const totalPrice = parseFloat(tour.price) * adults;

    const includedItems = [
        'Lorem Ipsum is simply dummy text of the printing',
        'Lorem Ipsum is simply dummy text of the printing',
    ];

    const excludedItems = [
        'Lorem Ipsum is simply dummy text of the printing',
        'Lorem Ipsum is simply dummy text of the printing',
    ];

    const reviews = [
        {
            name: 'Oybek',
            date: '4.13.2025',
            rating: 5,
            text: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, labore et dolore magna aliqua. Ut enim ad minim veniam.',
        },
        {
            name: 'Oybek',
            date: '4.13.2025',
            rating: 5,
            text: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, labore et dolore magna aliqua. Ut enim ad minim veniam.',
        },
    ];

    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
        setShowImageModal(true);
        document.body.style.overflow = 'hidden';
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        document.body.style.overflow = 'unset';
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    };

    const visibleTours = filteredTours.slice(currentPage * toursPerPage, (currentPage + 1) * toursPerPage);

    const handleAddToCart = () => {
        const cartItem = {
            tourId: tour.uuid,
            tourData: tour,
            quantity: 1,
            selectedDate: selectedDate?.format('YYYY-MM-DD'),
            adults: adults,
            addedAt: Date.now(),
        };

        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => item.tourId === tour.uuid);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1,
                };
                console.log('Updated cart:', updated);
                return updated;
            }
            console.log('Added to cart:', [...prev, cartItem]);
            return [...prev, cartItem];
        });

        messageApi.success({
            content: `Tour "${tour.title}" has been added to your cart.`,
            style: { marginTop: '1vh' },
            duration: 5,
        });
    };

    return (
        <>
            {contextHolder}
            <PageContainer>
                <Header>
                    <Breadcrumb>
                        <a href="/">Home</a> &gt; <a href="/uzbekistan">Uzbekistan</a> &gt; <span>Registan</span>
                    </Breadcrumb>

                    <TitleSection>
                        <Title>{tour.title}</Title>
                        <ActionButtons>
                            <IconButton>
                                <FaHeart />
                            </IconButton>
                            <IconButton>
                                <CopyLink url={window.location.href} iconSize={16} showText={false} />
                            </IconButton>
                        </ActionButtons>
                    </TitleSection>

                    <MetaInfo>
                        <Rating>
                            <span>4.5</span>
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} color="#ffc107" size={14} />
                            ))}
                            <span>(25 reviews)</span>
                        </Rating>
                        <span>•</span>
                        <span>{tour.groupSize}+ people booked</span>
                        <span>•</span>
                        <span>
                            <FaMapMarkerAlt /> {tour.country}, {tour.city}
                        </span>
                        <a href="#map">Show on Map</a>
                    </MetaInfo>
                </Header>

                <MainContent>
                    <ImageSection>
                        <ImageGallery>
                            <MainImage onClick={() => openImageModal(0)}>
                                <img src={galleryImages[0]} alt="Main tour image" />
                            </MainImage>
                            <SideImage onClick={() => openImageModal(1)}>
                                <img src={galleryImages[1]} alt="Tour image" />
                            </SideImage>
                            <SideImage onClick={() => openImageModal(2)}>
                                <img src={galleryImages[2]} alt="Tour image" />
                            </SideImage>
                            <SideImage onClick={() => openImageModal(3)}>
                                <img src={galleryImages[3]} alt="Tour image" />
                            </SideImage>
                            <SideImage onClick={() => openImageModal(4)}>
                                <img src={galleryImages[4]} alt="Tour image" />
                                <SeeAllButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openImageModal(0);
                                    }}
                                >
                                    See all
                                </SeeAllButton>
                            </SideImage>
                        </ImageGallery>
                    </ImageSection>
                    <ContentSection>
                        <LeftContent>
                            <InfoCards>
                                <InfoCard>
                                    <FaClock className="icon" size={24} />
                                    <div className="label">Duration</div>
                                    <div className="value">{tour.duration}</div>
                                </InfoCard>
                                <InfoCard>
                                    <FaMapMarkerAlt className="icon" size={24} />
                                    <div className="label">Tour Type</div>
                                    <div className="value">{tour.tourType}</div>
                                </InfoCard>
                                <InfoCard>
                                    <FaUsers className="icon" size={24} />
                                    <div className="label">Group Size</div>
                                    <div className="value">{tour.groupSize}</div>
                                </InfoCard>
                                <InfoCard>
                                    <FaUserFriends className="icon" size={24} />
                                    <div className="label">Ages</div>
                                    <div className="value">
                                        {tour.ageMin}-{tour.ageMax}
                                    </div>
                                </InfoCard>
                                <InfoCard>
                                    <FaGlobe className="icon" size={24} />
                                    <div className="label">Languages</div>
                                    <div className="value">{tour.language}</div>
                                </InfoCard>
                            </InfoCards>

                            <Section>
                                <h2>Tour Overview</h2>
                                <p>{tour.about}</p>
                            </Section>

                            <Section>
                                <h2>Included / Excluded</h2>
                                <IncludedExcluded>
                                    <div>
                                        {includedItems.map((item, index) => (
                                            <ListItem key={index} included>
                                                <FaCheck className="icon" />
                                                <span>{item}</span>
                                            </ListItem>
                                        ))}
                                    </div>
                                    <div>
                                        {excludedItems.map((item, index) => (
                                            <ListItem key={index}>
                                                <FaTimes className="icon" />
                                                <span>{item}</span>
                                            </ListItem>
                                        ))}
                                    </div>
                                </IncludedExcluded>
                            </Section>

                            <Section>
                                <h2>Itinerary</h2>
                                <Itinerary>
                                    {tour.itineraries?.map((day) => (
                                        <ItineraryDay key={day.day_number} active={day.day_number === 1}>
                                            <DayNumber active={day.day_number === 1}>{day.day_number}</DayNumber>
                                            <DayContent>
                                                <h4>
                                                    Day {day.day_number}: {day.day_title}
                                                </h4>
                                                <p>{day.description}</p>
                                            </DayContent>
                                        </ItineraryDay>
                                    ))}
                                </Itinerary>
                            </Section>

                            <Section id="map">
                                <h2>Location</h2>
                                <MapContainer>
                                    <p>Interactive Map Component</p>
                                </MapContainer>
                            </Section>
                            <Section>
                                <ReviewsSection>
                                    <h2>Reviews</h2>
                                    <Button variant="text" size="sm">
                                        Read all reviews
                                    </Button>
                                </ReviewsSection>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '1rem',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    {reviews.map((review, index) => (
                                        <ReviewCard key={index} variant="outlined">
                                            <ReviewHeader>
                                                <div className="left-content">
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            gap: '12px',
                                                        }}
                                                    >
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
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        marginTop: '1rem',
                                    }}
                                >
                                    <Button variant="outline" size="sm">
                                        <FaChevronLeft />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <FaChevronRight />
                                    </Button>
                                </div>
                            </Section>
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
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 0}
                                            aria-label="Previous page"
                                        >
                                            <FaArrowLeft />
                                        </Button>
                                        <Button
                                            variant="circle"
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages - 1}
                                            aria-label="Next page"
                                        >
                                            <FaArrowRight />
                                        </Button>
                                    </NavigationButtons>
                                </div>
                                <RelatedTours>
                                    {visibleTours.map((tour) => (
                                        <TourCard
                                            buttonText="See more"
                                            // variant="link"
                                            key={tour.id}
                                            id={tour.id}
                                            title={tour.title}
                                            description={tour.description}
                                            price={tour.price}
                                            image={tour.image}
                                            country={tour.country}
                                            status={'all'}
                                        />
                                    ))}
                                </RelatedTours>
                            </Section>
                        </LeftContent>
                        <RightSidebar>
                            <PriceCard>
                                <PriceHeader>
                                    <div className="from">From</div>
                                    <div className="price">${tour.price}</div>
                                </PriceHeader>

                                <BookingForm>
                                    <div
                                        style={{
                                            gap: '5px',
                                        }}
                                    >
                                        <FormGroup>
                                            <FormLabel>Date</FormLabel>
                                            <DatePicker
                                                value={selectedDate}
                                                style={{ width: '100%', height: '48px' }}
                                                placeholder="04.13.2025"
                                                onChange={setSelectedDate}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <FormLabel>Adults</FormLabel>
                                            <GuestSelector>
                                                <span>Age 18+</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setAdults(Math.max(0, adults - 1))}
                                                        style={{ width: '25px', height: '25px', padding: 0 }}
                                                    >
                                                        -
                                                    </Button>
                                                    <span style={{ minWidth: '20px', textAlign: 'center' }}>
                                                        {adults}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setAdults(adults + 1)}
                                                        style={{ width: '25px', height: '25px', padding: 0 }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </GuestSelector>
                                        </FormGroup>

                                        <Total>
                                            <span className="label">Total:</span>
                                            <span className="amount">${totalPrice.toFixed(2)}</span>
                                        </Total>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: '20px',
                                        }}
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            style={{ width: '30%', position: 'relative' }}
                                            onClick={handleAddToCart}
                                        >
                                            🛒 +
                                            {cart.length > 0 && (
                                                <CartItemCount>
                                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                                </CartItemCount>
                                            )}
                                        </Button>

                                        <Button variant="primary" size="lg" fullWidth={true}>
                                            Book now
                                        </Button>
                                    </div>
                                </BookingForm>
                            </PriceCard>
                        </RightSidebar>
                    </ContentSection>
                </MainContent>

                <AnimatePresence>
                    {showImageModal && (
                        <ImageModalOverlay
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeImageModal}
                        >
                            <ImageModalContent
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <CloseButton variant="outline" size="sm" fullWidth={false} onClick={closeImageModal}>
                                    ×
                                </CloseButton>
                                <PrevButton fullWidth={false} size="sm" variant="outline" onClick={prevImage}>
                                    ‹
                                </PrevButton>
                                <NextButton variant="outline" fullWidth={false} size="sm" onClick={nextImage}>
                                    ›
                                </NextButton>
                                <ModalImage src={galleryImages[selectedImageIndex]} alt="Tour image" />
                                <ImageCounter>
                                    {selectedImageIndex + 1} / {galleryImages.length}
                                </ImageCounter>
                            </ImageModalContent>
                        </ImageModalOverlay>
                    )}
                </AnimatePresence>
            </PageContainer>
        </>
    );
}
