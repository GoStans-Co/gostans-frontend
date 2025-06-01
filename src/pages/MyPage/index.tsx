import styled from 'styled-components';
import Sidebar from '@/pages/MyPage/Sidebar';
import ProfileContent from '@/pages/MyPage/ProfileContent';
import { useCallback, useEffect, useState } from 'react';
import FavoritesPage from '@/pages/MyPage/MyFavorites';
import TripsPage from '@/pages/MyPage/MyTrip';
import { useSearchParams } from 'react-router-dom';
import useApiService from '@/services/api';
import useCookieAuth from '@/services/cookieAuthService';
import { ModalAlert } from '@/components/ModalPopup';

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
`;

const SidebarContainer = styled.aside`
    width: 280px;
    min-width: 280px;
    flex-shrink: 0;
    border-right: 1px solid #e5e5e5;
    background: white;
    overflow-y: auto;
`;

const ContentContainer = styled.main`
    flex: 1;
    background-color: #f0f3f5;
    overflow-y: auto;
    padding-bottom: ${({ theme }) => theme.spacing['2xl']};
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

    const { removeAuthCookie } = useCookieAuth();

    const { logout: apiLogout } = useApiService();

    useEffect(() => {
        if (sectionParam === 'trips') setActiveSection(PageSection.TRIPS);
        else if (sectionParam === 'favorites') setActiveSection(PageSection.FAVORITES);
        else setActiveSection(PageSection.PROFILE);
    }, [sectionParam]);

    const userData = {
        name: 'Kholikov Oybek',
        email: 'example@example.com',
        phone: '01012345678',
        joinDate: 'Mar 2025',
    };

    const handleSectionChange = (section: PageSection) => {
        setActiveSection(section);
        setSearchParams({ section });
    };

    const handleSectionLogout = useCallback(async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Logout error:', error);
            /* if logout fails, we force to remove cookies */
            removeAuthCookie();
            window.location.href = '/';
        }
    }, []);

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

    return (
        <PageContainer>
            <SidebarContainer>
                <Sidebar
                    userName={userData.name}
                    joinDate={userData.joinDate}
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
    );
}
