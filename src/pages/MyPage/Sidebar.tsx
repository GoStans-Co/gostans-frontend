import { CalendarOutlined, HeartOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { AlignVerticalSpaceAround, Camera } from 'lucide-react';
import React from 'react';
import styled from 'styled-components';

enum PageSection {
    TRIPS = 'trips',
    FAVORITES = 'favorites',
    PROFILE = 'profile',
    ORDER_HISTORY = 'order_history',
}

type SidebarProps = {
    userName: string;
    joinDate: string;
    activePage: PageSection;
    onSectionChange: (section: PageSection) => void;
    handleLogout?: () => void;
    profileImage?: string | null;
    isHovering?: boolean;
    onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAvatarClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

type SidebarItemProps = {
    active?: boolean;
    icon?: React.ReactNode;
    label: string;
    href: string;
    onClick?: () => void;
};

const SidebarContainer = styled.div`
    width: calc(100% - ${({ theme }) => theme.spacing.lg}*2);
    max-width: 300px;
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.lg};
    margin: ${({ theme }) => theme.spacing.lg};
    position: sticky;
    top: 110px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    box-shadow: ${({ theme }) => theme.shadows.lg};
    z-index: 10;
    align-self: flex-start;
    backdrop-filter: blur(10px);

    ${({ theme }) => theme.responsive.maxMobile} {
        width: calc(100% - 1rem);
        max-width: none;
        margin: 0;
        padding: 1rem;
        position: static;
        max-height: none;
        top: auto;
    }
`;

const ProfileSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding-bottom: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        text-align: center;
        gap: ${({ theme }) => theme.spacing.sm};
        margin-bottom: ${({ theme }) => theme.spacing.lg};
        padding-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const Avatar = styled.div<{ $hasImage?: boolean }>`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    background-image: ${({ $hasImage }) => ($hasImage ? `url(${$hasImage})` : 'none')};
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;
    flex-shrink: 0;

    &:hover {
        transform: scale(1.05);
    }
`;

const AvatarOverlay = styled.div<{ show: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ show }) => (show ? 1 : 0)};
    transition: opacity 0.3s ease;

    svg {
        color: white;
        width: 24px;
        height: 24px;
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const ProfileInfo = styled.div`
    text-align: left;
    flex: 1;
    min-width: 0;
`;

const ProfileName = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 500;
    margin: 0;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const JoinDate = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin: 0;
`;

const NavSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`;

const NavItem = styled.button<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
    text-decoration: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
    background-color: ${({ theme, $active }) => ($active ? theme.colors.lightBackground : 'transparent')};
    transition: all ${({ theme }) => theme.transitions.default};
    font-weight: ${({ $active }) => ($active ? '600' : '500')};
    font-size: ${({ theme }) => theme.fontSizes.md};
    cursor: pointer;
    width: 100%;
    text-align: left;
    border: none;
    position: relative;
    overflow: hidden;
`;

const IconWrapper = styled.span<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${({ theme }) => theme.spacing.md};
    width: 20px;
    height: 20px;
    color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.lightText)};
    transition: color ${({ theme }) => theme.transitions.default};

    svg {
        width: 18px;
        height: 18px;
    }
`;

/**
 * Renders the user sidebar containing the avatar, profile info, navigation items, and logout action.
 *
 * The avatar supports hover state and image upload; navigation items call `onSectionChange` with the selected section.
 *
 * @param userName - Display name shown in the profile section
 * @param joinDate - User join date string displayed below the name
 * @param activePage - Currently active page key that highlights the corresponding nav item
 * @param onSectionChange - Callback invoked with the selected PageSection when a navigation item is clicked
 * @param handleLogout - Optional callback invoked when the Logout item is clicked
 * @param profileImage - Optional URL for the avatar image; when present the avatar displays the image
 * @param isHovering - Controls whether the avatar's overlay (camera icon) is visible
 * @param onImageUpload - File input change handler for avatar image uploads
 * @param onAvatarClick - Click handler for the avatar area
 * @param onMouseEnter - Mouse enter handler forwarded to the avatar
 * @param onMouseLeave - Mouse leave handler forwarded to the avatar
 * @returns The rendered sidebar React element
 */
export default function Sidebar({
    userName,
    joinDate,
    activePage,
    onSectionChange,
    handleLogout,
    profileImage,
    isHovering,
    onImageUpload,
    onAvatarClick,
    onMouseEnter,
    onMouseLeave,
}: SidebarProps) {
    return (
        <SidebarContainer>
            <ProfileSection>
                <Avatar
                    $hasImage={!!profileImage}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={onAvatarClick}
                >
                    {!profileImage && <AlignVerticalSpaceAround />}
                    <AvatarOverlay show={isHovering || false}>
                        <Camera />
                    </AvatarOverlay>
                    <HiddenFileInput id="avatar-upload" type="file" accept="image/*" onChange={onImageUpload} />
                </Avatar>
                <ProfileInfo>
                    <ProfileName>{userName}</ProfileName>
                    <JoinDate>Since: {joinDate}</JoinDate>
                </ProfileInfo>
            </ProfileSection>

            <NavSection>
                <SidebarItem
                    active={activePage === 'profile'}
                    label="Personal Info"
                    href="/mypage"
                    icon={<UserOutlined />}
                    onClick={() => onSectionChange(PageSection.PROFILE)}
                />
                <SidebarItem
                    active={activePage === 'trips'}
                    label="Trips"
                    href="/mypage/trips"
                    icon={<CalendarOutlined />}
                    onClick={() => onSectionChange(PageSection.TRIPS)}
                />
                <SidebarItem
                    active={activePage === 'favorites'}
                    label="Favorites"
                    href="/mypage/favorites"
                    icon={<HeartOutlined />}
                    onClick={() => onSectionChange(PageSection.FAVORITES)}
                />

                <div
                    style={{
                        borderTop: '1px solid #e5e5e5',
                        margin: '10px 0',
                        color: '#888',
                        fontSize: '0.875rem',
                    }}
                ></div>

                <SidebarItem icon={<LogoutOutlined />} label="Logout" href="/" onClick={handleLogout} />
            </NavSection>
        </SidebarContainer>
    );
}

function SidebarItem({ active, icon, label, onClick }: SidebarItemProps) {
    return (
        <NavItem $active={active} onClick={onClick}>
            <IconWrapper $active={active}>{icon}</IconWrapper>
            {label}
        </NavItem>
    );
}