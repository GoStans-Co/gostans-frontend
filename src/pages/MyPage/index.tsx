import styled from 'styled-components';
import Sidebar from '@/pages/MyPage/Sidebar';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { ModalAlert } from '@/components/ModalPopup';
import { message } from 'antd';
import { useApiServices } from '@/services/api';
import { createDefaultUserData, type UserData } from '@/services/api/user/types';
import { BookingDetail } from '@/services/api/checkout';
import OrderHistory from '@/pages/MyPage/Order/OrderHistory';
import { useUserProfileQuery } from '@/hooks/queries/userProfileQuery';
import ManageAccountDetails from '@/pages/MyPage/ManageAccount/ManageAccountDetails';
import ManageFavorites from '@/pages/MyPage/ManageAccount/ManageFavorites';
import ManageTours from '@/pages/MyPage/ManageAccount/ManageTours';
import ManagePayments from '@/pages/MyPage/ManageAccount/ManagePayments';
import ManageCoupons from '@/pages/MyPage/ManageAccount/ManageCoupons';
import { getSectionFromParam } from '@/utils/general/getSectionFromPage';

export enum PageSection {
    TRIPS = 'trips',
    FAVORITES = 'favorites',
    PROFILE = 'profile',
    PAYMENT_MANAGE = 'paymentMethods',
    COUPONS = 'coupons',
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
    overflow-y: auto;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid ${({ theme }) => theme.colors.border || '#E5E5E5'};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing['2xl']};
    margin: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing['2xl']}
        ${({ theme }) => theme.spacing.xl} 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
        padding-bottom: ${({ theme }) => theme.spacing.xl};
        margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
        border: none;
    }
`;

/**
 * MyPage - Root Page Component
 * @description Main component for the user account page, managing sections
 * and state and rendering the appropriate content
 * @param {React.PropsWithChildren} props - Component props
 */
export default function MyPageRoot() {
    const { removeAuthCookie } = useCookieAuth();
    const { auth: authService, user: userService } = useApiServices();
    const { data: profileData, isLoading: profileLoading } = useUserProfileQuery();
    const [searchParams, setSearchParams] = useSearchParams();
    const sectionParam = searchParams.get('section');

    const [messageApi, contextHolder] = message.useMessage();

    const [activeSection, setActiveSection] = useState<PageSection>(() => getSectionFromParam(sectionParam));
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [userData, setUserData] = useState<UserData>(createDefaultUserData());
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    useEffect(() => {
        setActiveSection(getSectionFromParam(sectionParam));
    }, [sectionParam]);

    useEffect(() => {
        const profile = profileData?.success ? profileData.data : null;
        if (profile) {
            const transformedData = transformUserResponse(profile);
            setUserData(transformedData);
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
                return <ManageAccountDetails userData={userData} />;
            case PageSection.FAVORITES:
                return <ManageFavorites />;
            case PageSection.TRIPS:
                return <ManageTours bookings={userData.bookings} onTripClick={handleTripClick} />;
            case PageSection.PAYMENT_MANAGE:
                return <ManagePayments />;
            case PageSection.COUPONS:
                return <ManageCoupons />;
            default:
                return <ManageAccountDetails userData={userData} />;
        }
    };

    return (
        <>
            {contextHolder}
            <PageContainer>
                <SidebarContainer>
                    <Sidebar
                        userName={userData.name}
                        email={userData.email}
                        activePage={activeSection}
                        onSectionChange={handleSectionChange}
                        handleLogout={showLogoutConfirmation}
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
