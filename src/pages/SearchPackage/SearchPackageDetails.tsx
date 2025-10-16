import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import type { Dayjs } from 'dayjs';
import { FaStar, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { message } from 'antd';
import Button from '@/components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { tourDetailsAtom } from '@/atoms/tours';
import CopyLink from '@/components/CopyLink';
import { cartAtom } from '@/atoms/cart';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import useFavorite from '@/hooks/ui/useFavorite';
import useCookieAuth from '@/services/cache/cookieAuthService';
import useModal from '@/hooks/ui/useModal';
import { ModalAlert, ModalAuth } from '@/components/ModalPopup';
import { useApiServices } from '@/services/api';
import useTrendingTours from '@/hooks/api/useTrendingTours';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animation/loading.json';
import SearchPackageContent from './SearchPackageContent';
import SearchPackageDetailSidebar from './SearchPackageSidebar';
import { createCartItem, processImages } from '@/utils/general/tourDetailsHelper';

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
        gap: ${({ theme }) => theme.spacing.md};
        max-width: 100%;
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
        font-size: ${({ theme }) => theme.fontSizes.lg};
        line-height: 1.3;
        -webkit-line-clamp: 3;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
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
        display: none;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
    align-items: flex-start;

    ${({ theme }) => theme.responsive.maxMobile} {
        display: none;
    }
`;

const MetaInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: ${({ theme }) => theme.fontSizes.sm};

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.fontSizes.xs};
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
        display: flex;
        flex-direction: column;
        gap: 0;
        align-items: stretch;
    }
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
    z-index: 9999;
    cursor: pointer;
`;

const ImageModalContent = styled(motion.div)`
    position: relative;
    width: 90vw;
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    padding: 60px;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100vw;
        height: 100vh;
        padding: 0;
    }
`;

const ModalImage = styled.img`
    max-width: calc(90vw - 100px);
    max-height: calc(90vh - 60px);
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;

    ${({ theme }) => theme.responsive.maxMobile} {
        max-width: 100vw;
        max-height: calc(100vh - 100px);
    }
`;

const CloseButton = styled(Button)`
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    z-index: 10001;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    ${({ theme }) => theme.responsive.maxMobile} {
        top: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
        font-size: 1.5rem;
    }
`;

const NavigationButton = styled(Button)`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;

    &:hover {
        background: rgba(0, 0, 0, 0.7);
    }
`;

const PrevButton = styled(NavigationButton)`
    left: 20px;
    z-index: 10001;
    width: 40px;
    height: 40px;
    padding: 0;
    font-size: 1.5rem;
    border-radius: 50%;

    ${({ theme }) => theme.responsive.maxMobile} {
        left: 10px;
        width: 36px;
        height: 36px;
    }
`;

const NextButton = styled(NavigationButton)`
    right: 20px;
    z-index: 10001;
    width: 40px;
    height: 40px;
    padding: 0;
    font-size: 1.5rem;
    border-radius: 50%;

    ${({ theme }) => theme.responsive.maxMobile} {
        right: 10px;
        width: 36px;
        height: 36px;
    }
`;

const ImageCounter = styled.div`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 1rem;
    background: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 4px;
    z-index: 10001;

    ${({ theme }) => theme.responsive.maxMobile} {
        bottom: 60px;
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;

/**
 * Render the tour package details page including gallery, itinerary, reviews, booking controls, and wishlist actions.
 *
 * Displays tour information, an image modal viewer, booking sidebar, and auth/confirmation modals while handling user interactions (add to cart, wishlist toggles, image navigation).
 *
 * @returns The rendered component as a JSX.Element
 */
export default function SearchPackageDetails() {
    const { packageId: id } = useParams<{ packageId: string }>();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    /* recoil states defined here */
    const tourDetailsCache = useRecoilValue(tourDetailsAtom);
    const setTourDetailsCache = useSetRecoilState(tourDetailsAtom);
    const [cart, setCart] = useRecoilState(cartAtom);

    /* api services calls and hooks here */
    const { tours: toursService, cart: cartApiService } = useApiServices();
    const { tours: trendingTours, fetchTrendingTours } = useTrendingTours();
    const { toggleWishlistWithTour, getHeartColor, isProcessing } = useFavorite();
    const { isAuthenticated } = useCookieAuth();
    const { openModal, closeModal } = useModal();

    /* local states defined here */
    const hasInitialized = useRef(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedDays, setExpandedDays] = useState(new Set([1]));
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'wishlist-login' | 'select-package-login' | 'date-confirmation' | null;
    }>({ isOpen: false, type: null });
    const tour = id ? tourDetailsCache[id]?.data : null;
    const isInCart = cart.some((item) => item.tourId === tour?.uuid);
    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const images = tour ? processImages(tour) : [];

    /* fetch tour details defined */
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
                }
            } catch (error) {
                console.error('Error fetching tour details:', error);
                hasInitialized.current = false;
            } finally {
                setIsLoading(false);
            }
        };

        fetchTourDetails();
    }, [id, tourDetailsCache, setTourDetailsCache]);

    useEffect(() => {
        fetchTrendingTours();
    }, [fetchTrendingTours]);

    /* reset on package change */
    useEffect(() => {
        setSelectedDate(null);
        setExpandedDays(new Set([1]));
        hasInitialized.current = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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

    const handleBookingAction = async () => {
        if (isInCart) {
            if (isAuthenticated()) {
                navigate('/cart');
            } else {
                setModalConfig({ isOpen: true, type: 'select-package-login' });
            }
        } else {
            if (isAuthenticated()) {
                if (!tour) return;
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
                if (!tour) return;
                const cartItem = createCartItem(tour, selectedDate?.format('YYYY-MM-DD'));
                await cartApiService.addToCart(
                    {
                        tourUuid: tour.uuid,
                        quantity: 1,
                    },
                    cartItem,
                );
                messageApi.success(`Tour "${tour.title}" added to your cart!`);
            }
        }
    };

    const handleWishlistToggle = async () => {
        if (!isAuthenticated()) {
            setModalConfig({ isOpen: true, type: 'wishlist-login' });
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
                    data: { ...prev[id].data, isLiked: !prev[id].data.isLiked },
                },
            }));
            messageApi.success(wasLiked ? 'Removed from favorites' : 'Added to favorites');
        } else {
            messageApi.error('Failed to update favorites');
        }
    };

    const handleConfirmedAddToCart = () => {
        if (!tour) return;
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

    const handleModalConfirm = () => {
        switch (modalConfig.type) {
            case 'wishlist-login':
            case 'select-package-login':
                setModalConfig({ isOpen: false, type: null });
                openModal('login-modal', <ModalAuth onClose={() => closeModal('login-modal')} initialTab="login" />);
                break;
            case 'date-confirmation':
                handleConfirmedAddToCart();
                break;
            default:
                setModalConfig({ isOpen: false, type: null });
        }
    };

    const navigateToTour = (tourUuid: string) => {
        setIsLoading(true);
        hasInitialized.current = false;
        navigate(`/searchTrips/${tourUuid}`, { replace: true });
    };

    const openImageModal = (index: number) => {
        setSelectedImageIndex(index);
        setShowImageModal(true);
        document.body.style.overflow = 'hidden';
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        document.body.style.overflow = 'unset';
    };

    const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);

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

    const modalContent = getModalContent();

    return (
        <>
            {contextHolder}
            <PageContainer>
                <Header>
                    <Breadcrumb>
                        <a href="/">Home</a> &gt; <a href="/searchTrips">Tours</a> &gt;
                        <span>
                            {' '}
                            {tour.country}, {tour.city}
                        </span>
                    </Breadcrumb>

                    <TitleSection>
                        <Title>{tour.title}</Title>
                        <IconButton
                            onClick={handleWishlistToggle}
                            disabled={isProcessing(tour?.uuid)}
                            style={{ color: getHeartColor(tour?.uuid, tour) }}
                        >
                            <FaHeart />
                        </IconButton>
                        <ActionButtons>
                            <CopyLink
                                url={typeof window !== 'undefined' ? window.location.href : ''}
                                iconSize={16}
                                showText={false}
                            />
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
                                <img src={images[0]} alt="Main tour image" />
                            </MainImage>
                            <SideImage onClick={() => openImageModal(1)}>
                                <img src={images[1]} alt="Tour image" />
                            </SideImage>
                            <SideImage onClick={() => openImageModal(2)}>
                                <img src={images[2]} alt="Tour image" />
                            </SideImage>
                            <SideImage onClick={() => openImageModal(3)}>
                                <img src={images[3]} alt="Tour image" />
                            </SideImage>
                            <SideImage onClick={() => openImageModal(4)}>
                                <img src={images[4]} alt="Tour image" />
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
                        <SearchPackageContent
                            tour={tour}
                            expandedDays={expandedDays}
                            onToggleDay={toggleDay}
                            trendingTours={trendingTours}
                            onNavigateToTour={navigateToTour}
                        />
                        <SearchPackageDetailSidebar
                            tour={tour}
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                            isInCart={isInCart}
                            cartItemsCount={cartItemsCount}
                            onBookingAction={handleBookingAction}
                        />
                    </ContentSection>
                </MainContent>

                {/* Image Modal */}
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
                                <ModalImage src={images[selectedImageIndex]} alt="Tour image" />
                                <ImageCounter>
                                    {selectedImageIndex + 1} / {images.length}
                                </ImageCounter>
                            </ImageModalContent>
                        </ImageModalOverlay>
                    )}
                </AnimatePresence>
            </PageContainer>

            {/* Confirmation Modal */}
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