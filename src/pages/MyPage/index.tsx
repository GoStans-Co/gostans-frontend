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

enum PageSection {
    TRIPS = 'trips',
    FAVORITES = 'favorites',
    PROFILE = 'profile',
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

export default function MyPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const sectionParam = searchParams.get('section');

    const [activeSection, setActiveSection] = useState<PageSection>(() => {
        if (sectionParam === 'trips') return PageSection.TRIPS;
        if (sectionParam === 'favorites') return PageSection.FAVORITES;
        return PageSection.PROFILE;
    });
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const { removeAuthCookie } = useCookieAuth();
    const { auth: authService, user: userService } = useApiServices();

    useEffect(() => {
        if (sectionParam === 'trips') setActiveSection(PageSection.TRIPS);
        else if (sectionParam === 'favorites') setActiveSection(PageSection.FAVORITES);
        else setActiveSection(PageSection.PROFILE);
    }, [sectionParam]);

    const [userData, setUserData] = useState({
        name: '',
        dateJoined: '',
        email: '',
        image: '',
        phone: '',
    });


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await userService.getUserProfile();
                if (userResponse.success) {
                    const userData = userResponse.data.data;
                    const createdDate = new Date(userData.dateJoined);
                    console.log('Fetched user data:', userData);
                    setUserData({
                        name: userData.name,
                        dateJoined: !isNaN(createdDate.getTime()) ? createdDate.toLocaleDateString() : '2025-01-01',
                        email: userData.email,
                        image: userData.image || '',
                        phone: userData.phone || '',
                    });

                    setProfileImage(userData.image || null);
                } else {
                    messageApi.error({
                        content: 'Failed to fetch user data. Please try again later.',
                        duration: 3,
                    });
                    setUserData({
                        name: '',
                        dateJoined: '',
                        email: '',
                        image: '',
                        phone: '',
                    });
                    setProfileImage(null);
                }
            } catch (error) {
                messageApi.error({
                    content: 'Failed to fetch user data. Please try again later.',
                    duration: 3,
                });
                setUserData({
                    name: '',
                    dateJoined: '',
                    email: '',
                    image: '',
                    phone: '',
                });
                setProfileImage(null);
            }
        };
        fetchUserData();
    }, []);

    const handleSectionChange = (section: PageSection) => {
        setActiveSection(section);
        setSearchParams({ section });
    };

    const handleSectionLogout = useCallback(async () => {
        try {
            await authService.logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            /* if logout fails, we force to remove cookies */
            removeAuthCookie();
            window.location.href = '/';
        } finally {
            setIsLogoutModalOpen(false);
        }
    }, [authService, removeAuthCookie]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            messageApi.error({
                content: 'File size exceeds 1MB limit',
                duration: 3,
            });
            return;
        }

        if (!file.type.startsWith('image/')) {
            messageApi.error({
                content: 'Invalid file type. Please upload an image.',
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
                console.log('Upload successful:', response);
            }
        } catch (error) {
            console.error('Image upload failed:', error);
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
        switch (activeSection) {
            case PageSection.PROFILE:
                return <ProfileContent userData={userData} />;
            case PageSection.FAVORITES:
                return <FavoritesPage />;
            case PageSection.TRIPS:
                return <TripsPage />;
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
