import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaMoneyBill } from 'react-icons/fa';
import Button from '@/components/common/Button';
import { theme } from '@/styles/theme';
import useModal from '@/hooks/ui/useModal';
import ModalAuth from '@/components/ModalPopup/AuthModal/ModalAuth';
import useCookieAuth from '@/services/cache/cookieAuthService';
import UserProfileModal from '@/components/Modal/UserProfileModal';
import { ModalAlert } from '@/components/ModalPopup';
import userImage from '@/assets/user.jpg';
import { User } from 'lucide-react';
import CountriesModal from '@/components/Modal/HeaderModals/CountriesModal';
import CurrencyModal from '@/components/Modal/HeaderModals/CurrencyModal';
import CartModal from '@/components/Modal/HeaderModals/CartModal';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';
import { useApiServices } from '@/services/api';
import goStansLogo from '@/assets/white.jpg';
import {
    CloseOutlined,
    FireOutlined,
    HomeOutlined,
    MenuOutlined,
    SearchOutlined,
    UserOutlined,
    CalendarOutlined,
    HeartOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import { Drawer, Menu } from 'antd';

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

const Nav = styled.nav.withConfig({
    shouldForwardProp: (prop) => !['isOpen'].includes(prop),
})<{ isOpen: boolean }>`
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

const LanguageSelector = styled.div.withConfig({
    shouldForwardProp: (prop) => !['isActive'].includes(prop),
})<{ isActive?: boolean }>`
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
        display: none;
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

const NavLinks = styled.div`
    display: flex;
    gap: 2rem;
    margin-left: 2rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        display: none;
    }
`;

const NavLink = styled(Link)`
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    position: relative;
    padding: 0.5rem 0;

    &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 50%;
        background-color: ${({ theme }) => theme.colors.primary};
        transition: all 0.3s ease;
        transform: translateX(-50%);
    }

    &:hover::after {
        width: 100%;
    }

    &.active::after {
        width: 100%;
    }
`;

const LogoImage = styled.img`
    width: 140px;
    height: auto;
    object-fit: contain;
    transition: transform 0.3s ease;
    cursor: pointer;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 130px;
        height: auto;
        transform: scale(0.9);
    }
    &:hover {
        transform: scale(1.05);
    }
`;

const MobileMenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.text};
    padding: 0.5rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const DrawerContent = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const DrawerFooter = styled.div`
    position: absolute;
    bottom: 2rem;
    left: 1rem;
    right: 1rem;
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
    flex: 1;
`;

const UserName = styled.div`
    font-weight: bold;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
`;

const LogoutButtonContainer = styled.div`
    margin-top: 0.5rem;
    width: 100%;
`;

const PartnerLink = styled(Link)`
    color: ${theme.colors.secondary};
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    text-decoration: none;
    padding: 0.5rem 0;
    white-space: nowrap;
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 50%;
        background-color: ${({ theme }) => theme.colors.primary};
        transition: all 0.3s ease;
        transform: translateX(-50%);
    }

    &:hover::after {
        width: 100%;
    }

    &.active::after {
        width: 100%;
    }

    ${theme.responsive.mobile} {
        display: none;
    }
`;

/**
 * Renders the application's top navigation header with branding, primary navigation links, currency selector, cart, and user controls.
 *
 * Includes mobile drawer navigation, country and currency selection modals, a cart modal, a user profile modal, and built-in login/logout flows.
 *
 * @returns The header JSX element
 */
export default function Header() {
    const location = useLocation();
    const { openModal, closeModal } = useModal();
    const { auth: authService } = useApiServices();
    const {
        cart: { removeFromCart, clearCartOnLogout },
    } = useApiServices();

    const { isAuthenticated, getUserData, removeAuthCookie } = useCookieAuth();

    const userButtonRef = useRef<HTMLButtonElement>(null);
    const countryRef = useRef<HTMLDivElement>(null);
    const currencyRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLAnchorElement>(null);

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useRecoilState(cartAtom);

    const [showCountries, setShowCountries] = useState(false);
    const [showCurrency, setShowCurrency] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    const getMenuSelectedKeys = () => {
        const path = location.pathname;
        const search = location.search;

        if (path === '/mypage') {
            const params = new URLSearchParams(search);
            const section = params.get('section') || 'profile';
            return [`/mypage?section=${section}`];
        }
        return [path];
    };

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

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

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
                        <LogoImage src={goStansLogo} alt="Xplore Asia Logo" />
                    </Logo>
                    <NavLinks>
                        <NavLink to="/top-destinations" className={isActive('/top-destinations') ? 'active' : ''}>
                            Destinations
                        </NavLink>
                        <NavLink to="/searchTrips" className={isActive('/searchTrips') ? 'active' : ''}>
                            Search Trips
                        </NavLink>
                        <NavLink to="/trendingTours" className={isActive('/trendingTours') ? 'active' : ''}>
                            Trending Tours
                        </NavLink>
                    </NavLinks>
                </LeftSection>

                <Nav isOpen={isMenuOpen}>
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
                    <PartnerLink to="/become-partner">Become a Partner</PartnerLink>
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

                    <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
                        <MenuOutlined />
                    </MobileMenuButton>

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
                            <Button
                                variant="primary"
                                onClick={() => openLoginModal('login')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: '500',
                                }}
                            >
                                Login
                            </Button>
                        </AuthButtons>
                    )}
                </RightSection>
            </HeaderContent>
            <Drawer
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
                closeIcon={<CloseOutlined />}
                styles={{
                    body: { padding: 0 },
                    header: { borderBottom: `1px solid ${theme.colors.border}` },
                }}
            >
                <DrawerContent>
                    <Menu
                        mode="vertical"
                        selectedKeys={getMenuSelectedKeys()}
                        style={{ border: 'none', height: '100%' }}
                        items={[
                            {
                                key: '/top-destinations',
                                icon: <HomeOutlined />,
                                label: 'Destinations',
                                onClick: () => {
                                    navigate('/top-destinations');
                                    setMobileMenuOpen(false);
                                },
                            },
                            {
                                key: '/searchTrips',
                                icon: <SearchOutlined />,
                                label: 'Search Trips',
                                onClick: () => {
                                    navigate('/searchTrips');
                                    setMobileMenuOpen(false);
                                },
                            },
                            {
                                key: '/trendingTours',
                                icon: <FireOutlined />,
                                label: 'Trending Tours',
                                onClick: () => {
                                    navigate('/trendingTours');
                                    setMobileMenuOpen(false);
                                },
                            },
                            {
                                key: '/become-partner',
                                icon: <UserOutlined />,
                                label: 'Become a Partner',
                                onClick: () => {
                                    navigate('/become-partner');
                                    setMobileMenuOpen(false);
                                },
                            },
                            ...(isLoggedIn
                                ? [
                                      {
                                          type: 'divider' as const,
                                      },
                                      {
                                          key: '/mypage?section=profile',
                                          icon: <UserOutlined />,
                                          label: 'Personal Info',
                                          onClick: () => {
                                              navigate('/mypage?section=profile');
                                              setMobileMenuOpen(false);
                                          },
                                      },
                                      {
                                          key: '/mypage?section=trips',
                                          icon: <CalendarOutlined />,
                                          label: 'My Trips',
                                          onClick: () => {
                                              navigate('/mypage?section=trips');
                                              setMobileMenuOpen(false);
                                          },
                                      },
                                      {
                                          key: '/mypage?section=favorites',
                                          icon: <HeartOutlined />,
                                          label: 'Favorites',
                                          onClick: () => {
                                              navigate('/mypage?section=favorites');
                                              setMobileMenuOpen(false);
                                          },
                                      },
                                  ]
                                : []),
                        ]}
                    />

                    <DrawerFooter>
                        {isLoggedIn ? (
                            <UserSection>
                                <UserImageDefault
                                    src={userImage}
                                    alt="User Avatar"
                                    style={{ width: '40px', height: '40px' }}
                                />
                                <UserInfo>
                                    <UserName>{userData?.name || 'User'}</UserName>
                                    <LogoutButtonContainer>
                                        <Button
                                            variant="light"
                                            size="mini"
                                            onClick={() => {
                                                showLogoutConfirmation();
                                                setMobileMenuOpen(false);
                                            }}
                                            fullWidth
                                            disabled={isLoggingOut}
                                        >
                                            Logout
                                        </Button>
                                    </LogoutButtonContainer>
                                </UserInfo>
                            </UserSection>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    openLoginModal('login');
                                    setMobileMenuOpen(false);
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    background: 'linear-gradient(135deg, #0F2846, #1F65A0)',
                                    border: 'none',
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                    height: '40px',
                                }}
                            >
                                <LoginOutlined />
                                Login
                            </Button>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <CountriesModal
                isOpen={showCountries}
                onClose={() => setShowCountries(false)}
                anchorElement={countryRef.current}
                selectedCountry={selectedCountry}
                onCountrySelect={setSelectedCountry}
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