import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobe, FaShoppingCart, FaBars, FaTimes, FaChevronDown, FaMoneyBill } from 'react-icons/fa';
import Button from '@/components/Common/Button';
import { theme } from '@/styles/theme';
import useModal from '@/hooks/useModal';
import ModalAuth from '@/components/ModalPopup/AuthModal/ModalAuth';
import useCookieAuth from '@/services/cookieAuthService';
import UserProfileModal from '@/components/Modal/UserProfileModal';
import { ModalAlert } from '@/components/ModalPopup';
import userImage from '@/assets/user.jpg';
import { User } from 'lucide-react';
import CountriesModal from '@/components/Modal/HeaderModals/CountriesModal';
import LanguageModal from '@/components/Modal/HeaderModals/LanguageModal';
import CurrencyModal from '@/components/Modal/HeaderModals/CurrencyModal';
import CartModal from '@/components/Modal/HeaderModals/CartModal';
import useApiServices from '@/services';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';

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

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
`;

const LanguageSelector = styled.div<{ isActive?: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    transition: all 0.2s ease;
    background-color: 'transparent';

    svg {
        transition: color 0.2s ease;
        color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.lightText)};
    }

    span {
        color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.text)};
    }

    &:hover {
        svg {
            color: ${({ theme }) => theme.colors.primary};
        }

        span {
            color: ${({ theme }) => theme.colors.primary};
        }
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

const MobileAuthSection = styled.div`
    display: block;
    margin-top: 20px;
    padding: 0 20px;

    @media (min-width: 768px) {
        display: none;
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

const UserAvatarButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.border};
    }
`;

const UserImageDefault = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: none;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const CountrySelector = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 6px 12px;
    border: 0.4px solid ${({ theme }) => theme.colors.border};
    border-radius: 25px;
    transition: all 0.2s ease;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};

    &:hover {
        background-color: ${({ theme }) => theme.colors.lightBackground};
        border-color: ${({ theme }) => theme.colors.primary};
    }

    svg {
        transition: transform 0.2s ease;
        color: ${({ theme }) => theme.colors.lightText};
    }

    &:hover svg {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export default function Header() {
    const { openModal, closeModal } = useModal();
    const { auth: authService } = useApiServices();
    const { isAuthenticated, getUserData, removeAuthCookie } = useCookieAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const userButtonRef = useRef<HTMLButtonElement>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const [authState, setAuthState] = useState(isAuthenticated());

    const countryRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLAnchorElement>(null);

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useRecoilState(cartAtom);

    const [showCountries, setShowCountries] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);
    const [showCurrency, setShowCurrency] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState({
        code: 'UZ',
        name: 'Uzbekistan',
        flag: '🇺🇿',
    });
    const [selectedLanguage, setSelectedLanguage] = useState({
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
    });
    const [selectedCurrency, setSelectedCurrency] = useState({
        code: 'USD',
        name: 'United States Dollar',
        symbol: '$',
        flag: '🇺🇸',
    });

    const userData = getUserData();
    const isLoggedIn = authState;

    const openLoginModal = (initialTab: 'login' | 'signup' = 'login') => {
        openModal('login-modal', <ModalAuth onClose={() => closeModal('login-modal')} initialTab={initialTab} />);
    };

    useEffect(() => {
        setAuthState(isAuthenticated());
    }, [isAuthenticated]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(!isMenuOpen);
    }, []);

    const handleLogout = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            removeAuthCookie();
            window.location.href = '/';
        } finally {
            setIsLoggingOut(false);
            setIsMenuOpen(false);
            setIsUserModalOpen(false);
        }
    }, [authService, removeAuthCookie]);

    const toggleUserModal = () => {
        setIsUserModalOpen(!isUserModalOpen);
    };

    const showLogoutConfirmation = () => {
        setIsLogoutModalOpen(true);
        setIsUserModalOpen(false);
    };

    return (
        <HeaderContainer>
            <HeaderContent>
                <LeftSection>
                    <Logo to="/">GoStans</Logo>
                    <CountrySelector ref={countryRef} onClick={() => setShowCountries(true)}>
                        <span style={{ fontSize: '18px' }}>{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                        <FaChevronDown size={12} />
                    </CountrySelector>
                </LeftSection>

                <MobileMenuButton onClick={toggleMenu}>
                    <FaBars />
                </MobileMenuButton>

                <OverlayBackdrop isOpen={isMenuOpen} onClick={toggleMenu} />

                <Nav isOpen={isMenuOpen}>
                    <CloseButton onClick={toggleMenu}>
                        <FaTimes />
                    </CloseButton>
                    <NavList></NavList>
                    <MobileAuthSection>
                        {isLoggedIn ? (
                            <div>
                                <div
                                    style={{
                                        color: theme.colors.text,
                                        marginBottom: '12px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Welcome, <strong>{userData?.name || 'User'}</strong>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={showLogoutConfirmation}
                                    disabled={isLoggingOut}
                                    style={{ width: '100%' }}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        openLoginModal('signup');
                                        setIsMenuOpen(false);
                                    }}
                                    style={{ width: '100%' }}
                                >
                                    Sign up
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        openLoginModal('login');
                                        setIsMenuOpen(false);
                                    }}
                                    style={{ width: '100%' }}
                                >
                                    Login
                                </Button>
                            </div>
                        )}
                    </MobileAuthSection>
                </Nav>

                <RightSection>
                    <LanguageSelector ref={languageRef} onClick={() => setShowLanguage(true)} isActive={showLanguage}>
                        <FaGlobe style={{ width: '18px', height: '18px' }} />
                        <span>{selectedLanguage.name}</span>
                    </LanguageSelector>

                    <LanguageSelector ref={currencyRef} onClick={() => setShowCurrency(true)} isActive={showCurrency}>
                        <FaMoneyBill style={{ width: '18px', height: '18px' }} />
                        <span>{selectedCurrency.code}</span>
                    </LanguageSelector>
                    <CartLink
                        to="#"
                        ref={cartRef}
                        onClick={(e) => {
                            e.preventDefault();
                            setShowCart(true);
                        }}
                    >
                        <FaShoppingCart />
                        <CartCount>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</CartCount>
                    </CartLink>
                    {isLoggedIn ? (
                        <>
                            <UserAvatarButton ref={userButtonRef} onClick={toggleUserModal} aria-label="User menu">
                                <UserImageDefault
                                    src={userImage}
                                    alt="User Avatar"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement
                                            ?.querySelector('svg')
                                            ?.style.setProperty('display', 'block');
                                    }}
                                />
                                <User style={{ display: userData?.avatar ? 'none' : 'block' }} />
                            </UserAvatarButton>

                            <UserProfileModal
                                isOpen={isUserModalOpen}
                                onClose={() => setIsUserModalOpen(false)}
                                anchorElement={userButtonRef.current}
                                onLogout={showLogoutConfirmation}
                            />
                        </>
                    ) : (
                        <AuthButtons>
                            <Button variant="outline" onClick={() => openLoginModal('signup')}>
                                Sign up
                            </Button>
                            <Button variant="primary" onClick={() => openLoginModal('login')}>
                                Login
                            </Button>
                        </AuthButtons>
                    )}
                </RightSection>
            </HeaderContent>
            <CountriesModal
                isOpen={showCountries}
                onClose={() => setShowCountries(false)}
                anchorElement={countryRef.current}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
            />

            <LanguageModal
                isOpen={showLanguage}
                onClose={() => setShowLanguage(false)}
                anchorElement={languageRef.current}
                selectedLanguage={selectedLanguage}
                onLanguageSelect={setSelectedLanguage}
            />

            <CurrencyModal
                isOpen={showCurrency}
                onClose={() => setShowCurrency(false)}
                anchorElement={currencyRef.current}
                selectedCurrency={selectedCurrency}
                onCurrencySelect={(currency) =>
                    setSelectedCurrency({
                        ...currency,
                        name: currency.code,
                    })
                }
            />

            <CartModal
                isOpen={showCart}
                onClose={() => setShowCart(false)}
                anchorElement={cartRef.current}
                cartItems={cartItems}
                onUpdateQuantity={(tourId, quantity) => {
                    setCartItems((items) =>
                        items.map((item) => (item.tourId === tourId ? { ...item, quantity } : item)),
                    );
                }}
                onRemoveItem={(tourId) => {
                    setCartItems((items) => items.filter((item) => item.tourId !== tourId));
                }}
                onGoToCart={() => {
                    navigate('/cart');
                    setShowCart(false);
                }}
            />
            <ModalAlert
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                type="warning"
                showCancel={true}
                confirmText="Logout"
                cancelText="Cancel"
                onConfirm={handleLogout}
            />
        </HeaderContainer>
    );
}
