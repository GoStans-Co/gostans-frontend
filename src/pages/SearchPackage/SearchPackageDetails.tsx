import { useEffect, useRef, useState } from 'react';
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
    FaUtensils,
    FaBed,
} from 'react-icons/fa';
import { DatePicker, message } from 'antd';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { tourDetailsAtom } from '@/atoms/tours';
import CopyLink from '@/components/CopyLink';
import default_n1 from '@/assets/default/default_1.jpg';
import default_n2 from '@/assets/default/default_2.jpg';
import TourCard from '@/components/tours/ToursCard';
import { cartAtom } from '@/atoms/cart';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import useFavorite from '@/hooks/ui/useFavorite';
import useCookieAuth from '@/services/cache/cookieAuthService';
import useModal from '@/hooks/ui/useModal';
import { ModalAlert, ModalAuth } from '@/components/ModalPopup';
import { TourDetailsResponse } from '@/services/api/tours';
import { CartItem } from '@/services/api/cart';
import { useApiServices } from '@/services/api';
import useTrendingTours from '@/hooks/api/useTrendingTours';
import MapBox from '@/pages/SearchPackage/MapBox';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animation/loading.json';
import { isValidCoordinate } from '@/utils/geoCodingCheck';

const PageContainer = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.background};
    overflow: visible;
`;

const Header = styled.div`
    background: white;
    padding: 1rem 2rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const MainContent = styled.div`
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    overflow: visible;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
        gap: ${({ theme }) => theme.spacing.lg};
    }
`;

const LeftContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 800px;
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

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const TitleSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: ${({ theme }) => theme.spacing.sm};

    ${({ theme }) => theme.responsive.maxMobile} {
        align-items: flex-start;
        margin-bottom: ${({ theme }) => theme.spacing.sm};
        gap: ${({ theme }) => theme.spacing.xs};
    }
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.2;
    max-width: calc(100% - 100px);
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        text-align: left;
        font-size: ${({ theme }) => theme.fontSizes['2xl']};
        line-height: 1.3;
        white-space: nowrap;
        -webkit-line-clamp: unset;
        -webkit-box-orient: unset;
        display: block;
        text-overflow: ellipsis;
        max-width: calc(100% - 90px);
        overflow: hidden;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
    align-items: flex-start;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.sm};
        flex-shrink: 0;
    }
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
    transition: ${({ theme }) => theme.transitions.default};
    flex-shrink: 0;

    &:hover {
        background: ${({ theme }) => theme.colors.lightBackground};
        border-color: ${({ theme }) => theme.colors.primary};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 36px;
        height: 36px;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        box-shadow: ${({ theme }) => theme.shadows.sm};
    }
`;

const MetaInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
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

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: ${({ theme }) => theme.spacing.lg};
    }
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

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        height: 300px;
        gap: 0;
    }
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

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-row: 1;
        grid-column: 1;
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

    ${({ theme }) => theme.responsive.maxMobile} {
        display: none;
    }
`;

const ContentSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
    align-items: start;
    overflow: visible;

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

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

const ListColumn = styled.div`
    border: none;
    background-color: transparent;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const ListContent = styled.div`
    padding: 0;
`;

const ListItem = styled.div<{ included?: boolean }>`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;

    .icon {
        color: ${({ included }) => (included ? '#228b22' : '#ff0000')};
        flex-shrink: 0;
        font-size: 1rem;
    }
`;

const Itinerary = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    text-align: left;
`;

const ItineraryDay = styled.div<{ active?: boolean }>`
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
`;

const DayHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    width: 100%;
`;

const Arrow = styled.span<{ expanded: boolean }>`
    transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 0.3s ease;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 12px;
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
    width: 80vw;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
`;

const ModalImage = styled.img`
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
`;

const CloseButton = styled(Button)`
    position: absolute;
    top: -20px;
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
    left: 10px;
`;

const NextButton = styled(NavigationButton)`
    right: 120px;
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
`;

const DayContainer = styled.div<{ last: boolean }>`
    position: relative;
    margin-bottom: ${({ last }) => (last ? '0' : '20px')};
`;

const DayNumberStyled = styled.div<{ active: boolean }>`
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
    gap: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.sm};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const InfoCard = styled(Card)`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1.4rem 1.3rem;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    min-width: 80px;

    .icon {
        color: ${({ theme }) => theme.colors.primary};
        flex-shrink: 0;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: right;
        flex: 1;
        margin-left: 0.5rem;
    }

    .label {
        font-size: 0.75rem;
        color: ${({ theme }) => theme.colors.lightText};
        margin-bottom: 0.125rem;
    }

    .value {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
        font-size: 0.875rem;
    }
`;

/**
 * SearchPackageDetails - Page Component
 * @description This component displays detailed information about a specific tour package,
 * including images, reviews, itinerary, and booking options.
 * It also handles user interactions such as adding to cart, viewing images, and managing wishlist.
 */
export default function SearchPackageDetails() {
    const { packageId: id } = useParams<{ packageId: string }>();
    const navigate = useNavigate();

    const { toggleWishlistWithTour, getHeartColor, isProcessing } = useFavorite();

    const tourDetailsCache = useRecoilValue(tourDetailsAtom);
    const setTourDetailsCache = useSetRecoilState(tourDetailsAtom);
    const [cart, setCart] = useRecoilState(cartAtom);

    const { tours: toursService, cart: cartApiService } = useApiServices();
    const { tours: trendingTours, fetchTrendingTours } = useTrendingTours();

    const { isAuthenticated } = useCookieAuth();
    const { openModal, closeModal } = useModal();

    const hasInitialized = useRef(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'wishlist-login' | 'select-package-login' | 'date-confirmation' | null;
    }>({
        isOpen: false,
        type: null,
    });
    const [expandedDays, setExpandedDays] = useState(new Set([1]));

    const toursPerPage = 3;

    const tour = id ? tourDetailsCache[id]?.data : null;

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        if (hasInitialized.current) return;

        const cachedTour = tourDetailsCache[id];

        if (cachedTour?.data) {
            setIsLoading(false);
            hasInitialized.current = true;
            return;
        }

        setIsLoading(true);
        hasInitialized.current = true;

        const fetchTourDetails = async () => {
            try {
                const response = await toursService.getTourDetails(id);
                if (response.statusCode === 200 && response.data) {
                    setTourDetailsCache((prev) => ({
                        ...prev,
                        [id]: {
                            data: response.data,
                            lastFetch: Date.now(),
                        },
                    }));
                } else {
                    console.error('Failed to fetch tour details:', response.message);
                }
            } catch (error) {
                console.error('Error fetching tour details:', error);
                hasInitialized.current = false;
            } finally {
                setIsLoading(false);
            }
        };

        fetchTourDetails();
    }, [id, tourDetailsCache]);

    useEffect(() => {
        fetchTrendingTours();
    }, [fetchTrendingTours]);

    useEffect(() => {
        setSelectedDate(null);
        setExpandedDays(new Set([1]));
        hasInitialized.current = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    fontSize: '18px',
                }}
            >
                <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    style={{ width: 120, height: 120, marginBottom: 24 }}
                />
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

    const filteredTours = trendingTours.filter((trendingTour) => trendingTour.uuid !== tour?.uuid).slice(0, 12);
    const totalPages = Math.ceil(filteredTours.length / toursPerPage);
    const visibleTours = filteredTours.slice(currentPage * toursPerPage, (currentPage + 1) * toursPerPage);
    const totalPrice = parseFloat(tour.price);

    const startTitle = tour.itineraries?.[0]?.dayTitle.split(' (')[0] ?? 'Unknown';
    const startLocation = startTitle.includes(' - ') ? startTitle.split(' - ')[0] : startTitle;
    const endTitle = tour.itineraries?.[tour.itineraries.length - 1]?.dayTitle.split(' (')[0] ?? 'Unknown';
    const endLocation = endTitle.includes(' - ') ? endTitle.split(' - ')[1] : endTitle;
    const isLoop = startLocation === endLocation;
    const endMessage = isLoop ? "You'll return to the starting point" : `You'll end at ${endLocation}`;

    const languageMap: { [key: string]: string } = {
        en: 'ENG',
        ko: 'KOR',
        rus: 'RUS',
        uz: 'UZB',
    };

    const getDisplayLanguages = (lang: unknown) => {
        if (!lang) return 'Not specified';
        if (Array.isArray(lang)) {
            return lang.map((code) => languageMap[String(code).toLowerCase()] || code).join(', ');
        }
        if (typeof lang === 'string') {
            const codes = lang.match(/.{1,2}/g) || [];
            return codes.map((code) => languageMap[code.toLowerCase()] || code).join(', ');
        }
        return 'Not specified';
    };

    const images =
        tour.images?.length > 0 ? tour.images.map((img) => img.image || default_n1) : [tour.mainImage || default_n1];
    const galleryImages = [...images];

    const defaultImages = [default_n1, default_n2];
    let defaultIndex = 0;

    while (galleryImages.length < 5) {
        galleryImages.push(defaultImages[defaultIndex % 2]);
        defaultIndex++;
    }

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

    const createCartItem = (tour: TourDetailsResponse, selectedDate?: string): CartItem => {
        return {
            tourId: tour.uuid,
            tourData: {
                uuid: tour.uuid,
                title: tour.title,
                price: tour.price,
                mainImage: tour.mainImage ?? '',
                duration: tour.duration,
                about: tour.about,
                tourType: parseInt(tour.tourType) || 0,
                shortDescription: tour.shortDescription || '',
            },
            quantity: 1,
            selectedDate: selectedDate,
            adults: 1,
            addedAt: Date.now(),
            price: parseFloat(tour.price),
            duration: tour.duration,
        };
    };

    /* we handle booking action based on whether the user is authenticated or not */
    const handleBookingAction = async () => {
        const isInCart = cart.some((item) => item.tourId === tour.uuid);

        if (isInCart) {
            if (isAuthenticated()) {
                navigate('/cart');
            } else {
                setModalConfig({
                    isOpen: true,
                    type: 'select-package-login',
                });
            }
        } else {
            if (isAuthenticated()) {
                try {
                    const response = await cartApiService.addToCart({
                        tourUuid: tour.uuid,
                        quantity: 1,
                    });

                    if (response.statusCode === 201) {
                        messageApi.success(`Tour "${tour.title}" added to your cart!`);
                    } else if (response.statusCode === 200) {
                        messageApi.info(`Tour "${tour.title}" quantity updated in cart!`);
                    }
                } catch (error) {
                    messageApi.error('Failed to add tour to cart');
                }
            } else {
                /* if user is not authenticated, we show a confirmation modal */
                const cartItem = createCartItem(tour, selectedDate?.format('YYYY-MM-DD'));
                setCart((prev) => [...prev, cartItem]);
                messageApi.success(`Tour "${tour.title}" added to your cart!`);
            }
        }
    };

    const handleConfirmedAddToCart = () => {
        const cartItem = createCartItem(tour, selectedDate?.format('YYYY-MM-DD'));

        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => item.tourId === tour.uuid);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1,
                };
                return updated;
            }
            return [...prev, cartItem];
        });

        messageApi.success(`Tour "${tour.title}" added to your cart!`);
        setModalConfig({ isOpen: false, type: null });
        navigate('/cart');
    };

    const toggleDay = (dayNumber: number) => {
        setExpandedDays((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(dayNumber)) {
                newSet.delete(dayNumber);
            } else {
                newSet.add(dayNumber);
            }
            return newSet;
        });
    };

    const handleModalConfirm = () => {
        switch (modalConfig.type) {
            case 'wishlist-login':
            case 'select-package-login':
                setModalConfig({ isOpen: false, type: null });
                openLoginModal('login');
                break;
            case 'date-confirmation':
                handleConfirmedAddToCart();
                break;
            default:
                setModalConfig({ isOpen: false, type: null });
        }
    };

    const getModalContent = () => {
        switch (modalConfig.type) {
            case 'wishlist-login':
                return {
                    title: 'Login Required',
                    message: 'Please login to add items to your favorites.',
                    type: 'info' as const,
                    confirmText: 'Login',
                };
            case 'select-package-login':
                return {
                    title: 'Login Required',
                    message: 'Please login to continue to your cart and complete your booking.',
                    type: 'info' as const,
                    confirmText: 'Login',
                };
            case 'date-confirmation':
                return {
                    title: 'Confirm Package Selection',
                    message: 'Are you sure you want to continue to the payment section?',
                    type: 'warning' as const,
                    confirmText: 'Continue',
                };
            default:
                return {
                    title: '',
                    message: '',
                    type: 'info' as const,
                    confirmText: 'OK',
                };
        }
    };

    const handleWishlistToggle = async () => {
        if (!isAuthenticated()) {
            setModalConfig({
                isOpen: true,
                type: 'wishlist-login',
            });
            return;
        }

        if (!tour?.uuid || !id) return;

        const wasLiked = tour?.isLiked || false;
        const success = await toggleWishlistWithTour(tour.uuid, tour);

        if (success) {
            setTourDetailsCache((prev) => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    data: {
                        ...prev[id].data,
                        isLiked: !prev[id].data.isLiked,
                    },
                },
            }));

            if (wasLiked) {
                messageApi.success('Removed from favorites');
            } else {
                messageApi.success('Added to favorites');
            }
        } else {
            messageApi.error('Failed to update favorites');
        }
    };

    const openLoginModal = (initialTab: 'login' | 'signup' = 'login') => {
        openModal('login-modal', <ModalAuth onClose={() => closeModal('login-modal')} initialTab={initialTab} />);
    };

    const modalContent = getModalContent();

    return (
        <>
            {contextHolder}
            <PageContainer>
                <Header>
                    <Breadcrumb>
                        <a href="/">Home</a> &gt; <a href="/searchTrips">Tours</a> &gt;
                        <span>
                            {tour.country}, {tour.city}
                        </span>
                    </Breadcrumb>

                    <TitleSection>
                        <Title>{tour.title}</Title>
                        <ActionButtons>
                            <IconButton
                                onClick={handleWishlistToggle}
                                disabled={isProcessing(tour?.uuid)}
                                style={{
                                    color: getHeartColor(tour?.uuid, tour),
                                }}
                            >
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
                            <InfoRow>
                                <InfoCards>
                                    <InfoCard>
                                        <div className="icon">
                                            <FaClock className="icon" size={28} />
                                        </div>
                                        <div className="content">
                                            <div className="label">Duration</div>
                                            <div className="value">{tour.duration}</div>
                                        </div>
                                    </InfoCard>

                                    <InfoCard>
                                        <div className="icon">
                                            <FaMapMarkerAlt className="icon" size={28} />
                                        </div>
                                        <div className="content">
                                            <div className="label">Tour Type</div>
                                            <div className="value">{tour.tourType}</div>
                                        </div>
                                    </InfoCard>

                                    <InfoCard>
                                        <div className="icon">
                                            <FaUsers className="icon" size={28} />
                                        </div>
                                        <div className="content">
                                            <div className="label">Group Size</div>
                                            <div className="value">{tour.groupSize}</div>
                                        </div>
                                    </InfoCard>

                                    <InfoCard>
                                        <div className="icon">
                                            <FaUserFriends className="icon" size={28} />
                                        </div>
                                        <div className="content">
                                            <div className="label">Ages</div>
                                            <div className="value">
                                                {tour.ageMin}-{tour.ageMax}
                                            </div>
                                        </div>
                                    </InfoCard>

                                    <InfoCard>
                                        <div className="icon">
                                            <FaGlobe className="icon" size={28} />
                                        </div>
                                        <div className="content">
                                            <div className="label">Languages</div>
                                            <div className="value">{getDisplayLanguages(tour.language || '')}</div>
                                        </div>
                                    </InfoCard>
                                </InfoCards>
                            </InfoRow>

                            <Section>
                                <h2>Tour Overview</h2>
                                <p>{tour.about}</p>
                            </Section>

                            <Section>
                                <h2>What's included</h2>
                                <ListColumn>
                                    <ListContent>
                                        {tour.includedItem?.length > 0 ? (
                                            tour.includedItem.map((item, index) => (
                                                <ListItem key={`included-${index}`} included>
                                                    <FaCheck className="icon" />
                                                    <span>{item.text}</span>
                                                </ListItem>
                                            ))
                                        ) : (
                                            <ListItem included>
                                                <FaCheck className="icon" />
                                                <span>No included items specified.</span>
                                            </ListItem>
                                        )}
                                        {tour.excludedItem?.length > 0 ? (
                                            tour.excludedItem.map((item, index) => (
                                                <ListItem key={`excluded-${index}`}>
                                                    <FaTimes className="icon" />
                                                    <span>{item.text}</span>
                                                </ListItem>
                                            ))
                                        ) : (
                                            <ListItem>
                                                <FaTimes className="icon" />
                                                <span>No excluded items specified.</span>
                                            </ListItem>
                                        )}
                                    </ListContent>
                                </ListColumn>
                            </Section>

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
                                                <DayContainer
                                                    key={day.dayNumber}
                                                    last={index === tour.itineraries.length - 1}
                                                >
                                                    <DayNumberStyled active={expandedDays.has(day.dayNumber)}>
                                                        {day.dayNumber}
                                                    </DayNumberStyled>
                                                    <DayContent>
                                                        <DayHeaderStyled onClick={() => toggleDay(day.dayNumber)}>
                                                            <h4>
                                                                Day {day.dayNumber}: {day.dayTitle}
                                                            </h4>
                                                            <Arrow expanded={expandedDays.has(day.dayNumber)}>▼</Arrow>
                                                        </DayHeaderStyled>
                                                        {expandedDays.has(day.dayNumber) && (
                                                            <>
                                                                <Description>{day.description}</Description>
                                                                {day.includedMeals && (
                                                                    <InfoParagraph>
                                                                        <FaUtensils size={16} />
                                                                        <strong>Included Meals:</strong>{' '}
                                                                        {day.includedMeals}
                                                                    </InfoParagraph>
                                                                )}
                                                                {day.accommodation && (
                                                                    <InfoParagraph>
                                                                        <FaBed size={16} />
                                                                        <strong>Accommodation:</strong>{' '}
                                                                        {day.accommodation}
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

                            <Section id="map">
                                <h2>Location</h2>
                                {Array.isArray(tour.itineraries) && tour.itineraries.length > 0 ? (
                                    <MapBox
                                        key={tour.uuid + '-' + tour.itineraries.length}
                                        itineraries={tour.itineraries.map((item) => ({
                                            dayNumber: item.dayNumber,
                                            dayTitle: item.dayTitle,
                                            description: item.description,
                                            locationNames: item.locationNames || [],
                                            locationName: item.locationNames?.map((l) => l.name).join(', ') || '',
                                            latitude:
                                                item.locationNames?.find((l) =>
                                                    isValidCoordinate(l.latitude, l.longitude),
                                                )?.latitude ?? null,
                                            longitude:
                                                item.locationNames?.find((l) =>
                                                    isValidCoordinate(l.latitude, l.longitude),
                                                )?.longitude ?? null,
                                            accommodation: item.accommodation,
                                            includedMeals: item.includedMeals,
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
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                        >
                                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                                            <div>No itinerary available</div>
                                        </div>
                                    </MapContainer>
                                )}
                            </Section>
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
                                </ReviewsContainer>
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
                                    {visibleTours.map((relatedTour) => (
                                        <div
                                            style={{ cursor: 'pointer' }}
                                            key={relatedTour.id}
                                            onClick={() => {
                                                setIsLoading(true);
                                                hasInitialized.current = false;
                                                navigate(`/searchTrips/${relatedTour.uuid}`, { replace: true });
                                            }}
                                        >
                                            <TourCard
                                                buttonText="See more"
                                                key={relatedTour.id}
                                                id={relatedTour.id}
                                                title={relatedTour.title}
                                                shortDescription={relatedTour.shortDescription}
                                                mainImage={relatedTour.mainImage ? relatedTour.mainImage : default_n1}
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
                        <RightSidebar>
                            <PriceCard>
                                <PriceHeader>
                                    <div className="from">From</div>
                                    <div className="price">${tour.price}</div>
                                </PriceHeader>

                                <BookingForm>
                                    <div style={{ gap: '5px' }}>
                                        <FormGroup>
                                            <FormLabel>Date</FormLabel>
                                            <DatePicker
                                                value={selectedDate}
                                                style={{ width: '100%', height: '48px' }}
                                                placeholder="04.13.2025"
                                                onChange={setSelectedDate}
                                            />
                                        </FormGroup>

                                        <TourDetailsSection>
                                            <TourDetailsTitle>Tour Details:</TourDetailsTitle>
                                            <TourDetailsContent>
                                                <div>
                                                    <span className="label">Duration:</span>{' '}
                                                    <span className="value">{tour.duration}</span>
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
                                            variant="primary"
                                            size="lg"
                                            fullWidth={true}
                                            onClick={handleBookingAction}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                position: 'relative',
                                            }}
                                        >
                                            {cart.some((item) => item.tourId === tour.uuid)
                                                ? 'Continue to Checkout'
                                                : 'Select Package'}
                                            {cart.length > 0 && (
                                                <CartItemCount>
                                                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                                </CartItemCount>
                                            )}
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
            <ModalAlert
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, type: null })}
                title={modalContent.title}
                message={modalContent.message}
                type={modalContent.type}
                showCancel={true}
                confirmText={modalContent.confirmText}
                cancelText="Cancel"
                onConfirm={handleModalConfirm}
            />
        </>
    );
}
