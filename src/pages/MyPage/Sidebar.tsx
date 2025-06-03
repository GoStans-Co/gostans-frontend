import { AlignVerticalSpaceAround, Camera, LogOut, TreePine, User } from 'lucide-react';
import React from 'react';
import { FaViacoin } from 'react-icons/fa';
import styled from 'styled-components';

enum PageSection {
    TRIPS = 'trips',
    FAVORITES = 'favorites',
    PROFILE = 'profile',
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
    icon: React.ReactNode;
    label: string;
    href: string;
    onClick?: () => void;
};

const SidebarContainer = styled.div`
    width: 280px;
    background-color: ${({ theme }) => theme.colors.background};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.xl};
    position: sticky;
    top: 0;
    height: calc(100vh - 72px);
    overflow-y: auto;
`;

const ProfileSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding-bottom: ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Avatar = styled.div<{ hasImage?: boolean }>`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    background-image: ${({ hasImage }) => (hasImage ? `url(${hasImage})` : 'none')};
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: transform 0.3s ease;

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
    text-align: center;
`;

const ProfileName = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 500;
    margin: 0;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
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
    padding: ${({ theme }) => theme.spacing.md};
    text-decoration: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.text)};
    background-color: ${({ theme, $active }) => ($active ? theme.colors.lightBackground : 'transparent')};
    font-weight: ${({ $active }) => ($active ? '500' : '400')};
    transition: all ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.lightBackground};
    }
`;

const IconWrapper = styled.span`
    display: flex;
    align-items: center;
    margin-right: ${({ theme }) => theme.spacing.md};

    svg {
        width: 20px;
        height: 20px;
    }
`;
function SidebarItem({ active, icon, label, onClick }: SidebarItemProps) {
    return (
        <NavItem $active={active} onClick={onClick}>
            <IconWrapper>{icon}</IconWrapper>
            {label}
        </NavItem>
    );
}

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
                    hasImage={!!profileImage}
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
                    icon={<User />}
                    label="Personal Info"
                    href="/mypage"
                    onClick={() => onSectionChange(PageSection.PROFILE)}
                />
                <SidebarItem
                    active={activePage === 'trips'}
                    icon={<TreePine />}
                    label="Trips"
                    href="/mypage/trips"
                    onClick={() => onSectionChange(PageSection.TRIPS)}
                />
                <SidebarItem
                    active={activePage === 'favorites'}
                    icon={<FaViacoin />}
                    label="Favorites"
                    href="/mypage/favorites"
                    onClick={() => onSectionChange(PageSection.FAVORITES)}
                />

                <div style={{ flexGrow: 1, minHeight: '120px' }}></div>

                <SidebarItem icon={<LogOut />} label="Logout" href="/logout" onClick={handleLogout} />
            </NavSection>
        </SidebarContainer>
    );
}
