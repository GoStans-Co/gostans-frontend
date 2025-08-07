import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScollToTop';

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Main = styled.main`
    flex: 1;
    width: 100%;
    max-width: 100%;
    // overflow-x: auto;
`;

export default function MainLayout() {
    return (
        <>
            <ScrollToTop />
            <LayoutContainer>
                <Header />
                <Main>
                    <Outlet />
                </Main>
                <Footer />
            </LayoutContainer>
        </>
    );
}
