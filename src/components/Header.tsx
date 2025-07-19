import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobe, FaShoppingCart, FaBars, FaTimes, FaMoneyBill } from 'react-icons/fa';
import Button from '@/components/Common/Button';
import { theme } from '@/styles/theme';
import useModal from '@/hooks/ui/useModal';
import ModalAuth from '@/components/ModalPopup/AuthModal/ModalAuth';
import useCookieAuth from '@/services/cache/cookieAuthService';
import UserProfileModal from '@/components/Modal/UserProfileModal';
import { ModalAlert } from '@/components/ModalPopup';
import userImage from '@/assets/user.jpg';
import { User } from 'lucide-react';
import CountriesModal from '@/components/Modal/HeaderModals/CountriesModal';
import LanguageModal from '@/components/Modal/HeaderModals/LanguageModal';
import CurrencyModal from '@/components/Modal/HeaderModals/CurrencyModal';
import CartModal from '@/components/Modal/HeaderModals/CartModal';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';
import { useCartService } from '@/services/api/cart/useCartService';
import { useApiServices } from '@/services/api';

const HeaderContainer = styled.header`
    padding: 1rem 2rem;
    background-color: white;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    position: sticky;
    top: 0;
    z-index: 100;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1.1rem 1.5rem;
    }
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    position: relative;

    ${({ theme }) => theme.responsive.maxMobile} {
        justify-content: space-between;
    }
`;

const Logo = styled(Link)`
    font-size: 24px;
    font-weight: bold;
    color: ${theme.colors.primary};
    text-decoration: none;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 20px;
    }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
    ${({ theme }) => theme.responsive.maxMobile} {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 280px;
        background-color: white;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
        transition: transform 0.3s ease;
        display: flex;
        flex-direction: column;
        z-index: 200;
    }
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 1.5rem;
        order: 2;
    }
`;

const LanguageSelector = styled.div<{ isActive?: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    transition: all 0.2s ease;
    background-color: 'transparent';

    ${({ theme }) => theme.responsive.maxMobile} {
        span {
            display: none;
        }

        gap: 0;
    }

    svg {
        transition: color 0.2s ease;
        color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.lightText)};
    }

    span {
        color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.text)};
        font-size: 0.875rem;
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

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 0.6rem;
        height: 14px;
        width: 14px;
        top: -6px;
        right: -6px;
    }
`;

const MobileMenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};

    ${({ theme }) => theme.responsive.maxMobile} {
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
    display: none;

    ${({ theme }) => theme.responsive.maxMobile} {
        display: block;
        margin-top: 0;
        padding: 0;
    }
`;

const AuthButtons = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
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

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 32px;
        height: 32px;
    }

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

    ${({ theme }) => theme.responsive.maxMobile} {
        order: 1;
    }
`;

export default function Header() {
    const { openModal, closeModal } = useModal();
    const { auth: authService } = useApiServices();
    const { clearCartOnLogout, removeFromCart } = useCartService();

    const { isAuthenticated, getUserData, removeAuthCookie } = useCookieAuth();

    const userButtonRef = useRef<HTMLButtonElement>(null);
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
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [authState, setAuthState] = useState(isAuthenticated());
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'logout' | 'loginRequired' | null;
    }>({
        isOpen: false,
        type: null,
    });

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
            clearCartOnLogout();
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

    const handleRemoveItem = async (tourId: string) => {
        if (isAuthenticated()) {
            try {
                await removeFromCart(tourId);
            } catch (error) {
                console.error('Failed to remove item from cart:', error);
                setCartItems((items) => items.filter((item) => item.tourId !== tourId));
            }
        } else {
            setCartItems((items) => items.filter((item) => item.tourId !== tourId));
        }
    };

    const toggleUserModal = () => {
        setIsUserModalOpen(!isUserModalOpen);
    };

    const showLogoutConfirmation = () => {
        setModalConfig({ isOpen: true, type: 'logout' });
        setIsUserModalOpen(false);
    };

    return (
        <HeaderContainer>
            <HeaderContent>
                <LeftSection>
                    <Logo as={Link} to="/">
                        GoStans
                    </Logo>
                </LeftSection>

                <OverlayBackdrop isOpen={isMenuOpen} onClick={toggleMenu} />

                <Nav isOpen={isMenuOpen}>
                    <CloseButton onClick={toggleMenu}>
                        <FaTimes />
                    </CloseButton>
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
                            <Button variant="primary" onClick={() => openLoginModal('login')}>
                                Login
                            </Button>
                        </AuthButtons>
                    )}

                    <MobileMenuButton onClick={toggleMenu}>
                        <FaBars />
                    </MobileMenuButton>
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
                onRemoveItem={handleRemoveItem}
                onGoToCart={() => {
                    if (isAuthenticated()) {
                        navigate('/cart');
                        setShowCart(false);
                    } else {
                        setModalConfig({ isOpen: true, type: 'loginRequired' });
                        setShowCart(false);
                    }
                }}
            />
            <ModalAlert
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, type: null })}
                title={modalConfig.type === 'logout' ? 'Confirm Logout' : 'Login Required'}
                message={
                    modalConfig.type === 'logout'
                        ? 'Are you sure you want to logout?'
                        : 'Please login to continue to your cart and complete your booking.'
                }
                type={modalConfig.type === 'logout' ? 'warning' : 'info'}
                showCancel={true}
                confirmText={modalConfig.type === 'logout' ? 'Logout' : 'Login'}
                cancelText="Cancel"
                onConfirm={() => {
                    if (modalConfig.type === 'logout') {
                        handleLogout();
                    } else {
                        setModalConfig({ isOpen: false, type: null });
                        openLoginModal('login');
                    }
                }}
            />
        </HeaderContainer>
    );
}
