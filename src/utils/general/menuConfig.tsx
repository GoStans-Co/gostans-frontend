import { NavigateFunction } from 'react-router-dom';
import {
    HomeOutlined,
    SearchOutlined,
    FireOutlined,
    UserOutlined,
    CalendarOutlined,
    HeartOutlined,
    CreditCardOutlined,
    TagsOutlined,
} from '@ant-design/icons';

type MenuItemConfig = {
    key: string;
    icon: React.ReactNode;
    label: string;
    section?: string;
};

const PUBLIC_MENU_ITEMS: MenuItemConfig[] = [
    { key: '/top-destinations', icon: <HomeOutlined />, label: 'Destinations' },
    { key: '/searchTrips', icon: <SearchOutlined />, label: 'Search Trips' },
    { key: '/trendingTours', icon: <FireOutlined />, label: 'Trending Tours' },
    { key: '/become-partner', icon: <UserOutlined />, label: 'Become a Partner' },
];

const AUTHENTICATED_MENU_ITEMS: MenuItemConfig[] = [
    { key: '/mypage', icon: <UserOutlined />, label: 'Personal Info', section: 'profile' },
    { key: '/mypage', icon: <CalendarOutlined />, label: 'My Trips', section: 'trips' },
    { key: '/mypage', icon: <HeartOutlined />, label: 'Favorites', section: 'favorites' },
    { key: '/mypage', icon: <CreditCardOutlined />, label: 'Payment Methods', section: 'paymentMethods' },
    { key: '/mypage', icon: <TagsOutlined />, label: 'Coupons', section: 'coupons' },
];

/**
 * Creates a menu item with navigation and close functionality
 */
const createMenuItem = (item: MenuItemConfig, navigate: NavigateFunction, onClose: () => void) => {
    const path = item.section ? `${item.key}?section=${item.section}` : item.key;

    return {
        key: path,
        icon: item.icon,
        label: item.label,
        onClick: () => {
            navigate(path);
            onClose();
        },
    };
};

/**
 * Returns menu items based on user authentication status
 */
export const getMenuItems = (isLoggedIn: boolean, navigate: NavigateFunction, onClose: () => void) => {
    const publicItems = PUBLIC_MENU_ITEMS.map((item) => createMenuItem(item, navigate, onClose));

    if (!isLoggedIn) {
        return publicItems;
    }

    const authenticatedItems = AUTHENTICATED_MENU_ITEMS.map((item) => createMenuItem(item, navigate, onClose));

    return [...publicItems, { type: 'divider' as const }, ...authenticatedItems];
};
