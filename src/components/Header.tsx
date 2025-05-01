import { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaGlobe, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import Button from '@/components/common/Button';

const HeaderContainer = styled.header`
    padding: 1rem 2rem;
    background-color: white;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    position: sticky;
    top: 0;
    z-index: 100;
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
`;

const Logo = styled(Link)`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
`;

const Nav = styled.nav<{ isOpen: boolean }>`
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 250px;
        background-color: white;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
        transition: transform 0.3s ease;
        display: flex;
        flex-direction: column;
        z-index: 200;
    }
`;

const NavList = styled.ul`
    display: flex;
    align-items: center;
    gap: 2rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
        align-items: flex-start;
        margin-top: 2rem;
    }
`;

const NavItem = styled.li<{ isActive: boolean }>`
    font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
    color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.text)};

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
`;

const LanguageSelector = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: none;
    }
`;

const CartLink = styled(Link)`
    position: relative;
    display: flex;
    align-items: center;
`;

const CartCount = styled.span`
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: ${({ theme }) => theme.colors.accent};
    color: white;
    font-size: 0.7rem;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MobileMenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        display: block;
    }
`;

const OverlayBackdrop = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 150;
`;

const CloseButton = styled.button`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
    align-self: flex-end;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        display: block;
    }
`;

const AuthButtons = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        display: none;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
        width: 100%;
    }
`;

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <HeaderContainer>
            <HeaderContent>
                <Logo to="/">GoStans</Logo>

                <MobileMenuButton onClick={toggleMenu}>
                    <FaBars />
                </MobileMenuButton>

                <OverlayBackdrop isOpen={isMenuOpen} onClick={toggleMenu} />

                <Nav isOpen={isMenuOpen}>
                    <CloseButton onClick={toggleMenu}>
                        <FaTimes />
                    </CloseButton>

                    <NavList>
                        <NavItem isActive={location.pathname === '/'}>
                            <Link to="/">Home</Link>
                        </NavItem>
                        <NavItem isActive={location.pathname === '/destinations'}>
                            <Link to="/destinations">Destinations</Link>
                        </NavItem>
                        <NavItem isActive={location.pathname === '/tours'}>
                            <Link to="/tours">Tours</Link>
                        </NavItem>
                        <NavItem isActive={location.pathname === '/activities'}>
                            <Link to="/activities">Activities</Link>
                        </NavItem>
                        <NavItem isActive={location.pathname === '/hotels'}>
                            <Link to="/hotels">Hotels</Link>
                        </NavItem>
                        <NavItem isActive={location.pathname === '/faq'}>
                            <Link to="/faq">FAQ</Link>
                        </NavItem>
                    </NavList>
                </Nav>

                <RightSection>
                    <LanguageSelector>
                        <FaGlobe />
                        <span>English</span>
                    </LanguageSelector>

                    <CartLink to="/cart">
                        <FaShoppingCart />
                        <CartCount>0</CartCount>
                    </CartLink>

                    <AuthButtons>
                        <Button variant="outline" size="md">
                            Sign up
                        </Button>
                        <Button variant="primary" size="md">
                            Login
                        </Button>
                    </AuthButtons>
                </RightSection>
            </HeaderContent>
        </HeaderContainer>
    );
}
