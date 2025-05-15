import styled from 'styled-components';
import Sidebar from '@/pages/MyPage/Sidebar';
import ProfileContent from '@/pages/MyPage/ProfileContent';
import { useState } from 'react';
import FavoritesPage from './MyFavorites';
import TripsPage from './MyTrip';

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
    const [activeSection, setActiveSection] = useState<PageSection>(PageSection.PROFILE);

    const userData = {
        name: 'Kholikov Oybek',
        email: 'example@example.com',
        phone: '01012345678',
        joinDate: 'Mar 2025',
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
                    onSectionChange={setActiveSection}
                />
            </SidebarContainer>
            <ContentContainer>{renderContent()}</ContentContainer>
        </PageContainer>
    );
}
