import styled from 'styled-components';
import Sidebar from '@/pages/MyPage/Sidebar';
import ProfileContent from '@/pages/MyPage/ProfileContent';
import { useCallback, useEffect, useState } from 'react';
import FavoritesPage from '@/pages/MyPage/MyFavorites';
import TripsPage from '@/pages/MyPage/MyTrip';
import { useSearchParams } from 'react-router-dom';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { ModalAlert } from '@/components/ModalPopup';
import { message } from 'antd';
import { useApiServices } from '@/services/api';
import { createDefaultUserData, type UserData } from '@/services/api/user/types';
import { BookingDetail } from '@/services/api/checkout';
import OrderHistory from '@/pages/MyPage/Order/OrderHistory';
import { useUserProfileQuery } from '@/hooks/queries/userProfileQuery';

enum PageSection {
    TRIPS = 'trips',
    FAVORITES = 'favorites',
    PROFILE = 'profile',
    ORDER_HISTORY = 'order_history',
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    width: 100%;
    position: relative;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
    }
`;

const SidebarContainer = styled.aside`
    width: 340px;
    min-width: 340px;
    flex-shrink: 0;
    border-right: 1px solid #e5e5e5;
    background: white;
    position: relative;
    overflow: visible;
    height: auto;
    display: flex;
    flex-direction: column;

    ${({ theme }) => theme.responsive.maxMobile} {
        display: none;
    }
`;

const ContentContainer = styled.main`
    flex: 1;
    background-color: #f0f3f5;
    overflow-y: auto;
    padding-bottom: ${({ theme }) => theme.spacing['2xl']};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding-bottom: ${({ theme }) => theme.spacing.xl};
    }
`;

/**
 * MyPage - Root Page Component
 * @description Main component for the user account page, managing sections
 * and state and rendering the appropriate content
 * @param {React.PropsWithChildren} props - Component props
 * @returns {JSX.Element}
 */
export default function MyPage() {
    const { removeAuthCookie } = useCookieAuth();
    const { auth: authService, user: userService } = useApiServices();
    const { data: profileData, isLoading: profileLoading } = useUserProfileQuery();
    const [searchParams, setSearchParams] = useSearchParams();
    const sectionParam = searchParams.get('section');

    const [messageApi, contextHolder] = message.useMessage();

    const [activeSection, setActiveSection] = useState<PageSection>(() => {
        if (sectionParam === 'trips') return PageSection.TRIPS;
        if (sectionParam === 'favorites') return PageSection.FAVORITES;
        return PageSection.PROFILE;
    });
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData>(createDefaultUserData());
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    useEffect(() => {
        if (sectionParam === 'trips') setActiveSection(PageSection.TRIPS);
        else if (sectionParam === 'favorites') setActiveSection(PageSection.FAVORITES);
        else setActiveSection(PageSection.PROFILE);
    }, [sectionParam]);

    useEffect(() => {
        const profile = profileData?.success ? profileData.data : null;
        if (profile) {
            const transformedData = transformUserResponse(profile);
            setUserData(transformedData);
            setProfileImage(transformedData.image || null);
        } else if (!profileLoading) {
            handleUserDataError();
        }
    }, [profileData]);

    const transformUserResponse = (apiData: any): UserData => {
        const createdDate = new Date(apiData.dateJoined);

        return {
            name: apiData.name || '',
            dateJoined: !isNaN(createdDate.getTime()) ? createdDate.toLocaleDateString() : '2025-01-01',
            email: apiData.email || '',
            image: apiData.image || '',
            phone: apiData.phone || '',
            bookings: apiData.bookings || { all: [], upcoming: [], completed: [] },
        };
    };

    const fetchBookingDetail = async (bookingId: string) => {
        setBookingLoading(true);
        setBookingError(null);
        setSelectedBookingId(bookingId);

        try {
            const result = await userService.getBookingDetail(bookingId);

            if (result.success && result.data) {
                setBookingDetail(result.data);
            } else {
                setBookingError('Failed to load booking details');
                messageApi.error({
                    content: 'Failed to load booking details',
                    duration: 3,
                });
            }
        } catch (err) {
            const errorMessage = 'An unexpected error occurred';
            setBookingError(errorMessage);
            messageApi.error({
                content: errorMessage,
                duration: 3,
            });
        } finally {
            setBookingLoading(false);
        }
    };

    const handleTripClick = (bookingId: string) => {
        fetchBookingDetail(bookingId);
    };

    const handleBackFromOrderDetails = () => {
        setSelectedBookingId(null);
        setBookingDetail(null);
        setBookingError(null);
        setActiveSection(PageSection.TRIPS);
    };

    const handleUserDataError = (message: string = 'Failed to fetch user data. Please try again later.') => {
        messageApi.error({
            content: message,
            duration: 3,
        });
        setUserData(createDefaultUserData());
        setProfileImage(null);
    };

    const handleSectionChange = (section: PageSection) => {
        setActiveSection(section);
        setSearchParams({ section });
        setSelectedBookingId(null);
        setBookingDetail(null);
        setBookingError(null);
    };

    const handleSectionLogout = useCallback(async () => {
        try {
            await authService.logout();
            window.location.href = '/';
        } catch (error) {
            removeAuthCookie();
            window.location.href = '/';
        } finally {
            setIsLogoutModalOpen(false);
        }
    }, [authService, removeAuthCookie]);

    const validateImageFile = (file: File): string | null => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            return 'Invalid file type. Please upload a JPEG, PNG, or GIF image.';
        }
        if (file.size > 1 * 1024 * 1024) {
            return 'File size exceeds 1MB limit.';
        }
        return null;
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validationError = validateImageFile(file);
        if (validationError) {
            messageApi.error({
                content: validationError,
                duration: 3,
            });
            return;
        }

        try {
            const response = await userService.uploadProfileImage(file);

            if (response.success) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setProfileImage(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.info('Image upload failed:', error);
            messageApi.error({
                content: 'Image upload failed. Please try again.',
                duration: 3,
            });
            setProfileImage(null);
        }
    };

    const showLogoutConfirmation = () => {
        setIsLogoutModalOpen(true);
    };

    const renderContent = () => {
        if (selectedBookingId && bookingDetail) {
            return (
                <OrderHistory
                    bookingId={selectedBookingId}
                    bookingDetail={bookingDetail}
                    loading={bookingLoading}
                    error={bookingError}
                    onBack={handleBackFromOrderDetails}
                    onRetry={() => fetchBookingDetail(selectedBookingId)}
                />
            );
        }

        switch (activeSection) {
            case PageSection.PROFILE:
                return <ProfileContent userData={userData} />;
            case PageSection.FAVORITES:
                return <FavoritesPage />;
            case PageSection.TRIPS:
                return <TripsPage bookings={userData.bookings} onTripClick={handleTripClick} />;
            default:
                return <ProfileContent userData={userData} />;
        }
    };

    const handleAvatarClick = () => {
        document.getElementById('avatar-upload')?.click();
    };

    return (
        <>
            {contextHolder}
            <PageContainer>
                <SidebarContainer>
                    <Sidebar
                        userName={userData.name}
                        joinDate={userData.dateJoined}
                        activePage={activeSection}
                        onSectionChange={handleSectionChange}
                        handleLogout={showLogoutConfirmation}
                        profileImage={profileImage}
                        isHovering={isHovering}
                        onImageUpload={handleImageUpload}
                        onAvatarClick={handleAvatarClick}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    />
                </SidebarContainer>
                <ContentContainer>{renderContent()}</ContentContainer>
                <ModalAlert
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    title="Confirm Logout"
                    message="Are you sure you want to logout?"
                    type="warning"
                    showCancel={true}
                    confirmText="Logout"
                    cancelText="Cancel"
                    onConfirm={handleSectionLogout}
                />
            </PageContainer>
        </>
    );
}
