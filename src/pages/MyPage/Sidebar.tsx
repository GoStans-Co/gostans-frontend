import { AlignVerticalSpaceAround, LogOut, TreePine, User } from 'lucide-react';
import React from 'react';
import { FaViacoin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type SidebarProps = {
    userName: string;
    joinDate: string;
    activePage: 'profile' | 'trips' | 'favorites';
};

type SidebarItemProps = {
    active?: boolean;
    icon: React.ReactNode;
    label: string;
    href: string;
};

const SidebarContainer = styled.div`
    width: 280px;
    background-color: ${({ theme }) => theme.colors.background};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    height: 100%;
    padding: ${({ theme }) => theme.spacing.xl};
`;

const ProfileSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding-bottom: ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Avatar = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    overflow: hidden;
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

const NavItem = styled(Link)<{ $active?: boolean }>`
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

function SidebarItem({ active, icon, label, href }: SidebarItemProps) {
    return (
        <NavItem to={href} $active={active}>
            <IconWrapper>{icon}</IconWrapper>
            {label}
        </NavItem>
    );
}

export default function Sidebar({ userName, joinDate, activePage }: SidebarProps) {
    return (
        <SidebarContainer>
            <ProfileSection>
                <Avatar>
                    <AlignVerticalSpaceAround />
                </Avatar>
                <ProfileInfo>
                    <ProfileName>{userName}</ProfileName>
                    <JoinDate>Since: {joinDate}</JoinDate>
                </ProfileInfo>
            </ProfileSection>

            <NavSection>
                <SidebarItem active={activePage === 'profile'} icon={<User />} label="Personal Info" href="/mypage" />
                <SidebarItem active={activePage === 'trips'} icon={<TreePine />} label="Trips" href="/mypage/trips" />
                <SidebarItem
                    active={activePage === 'favorites'}
                    icon={<FaViacoin />}
                    label="Favorites"
                    href="/mypage/favorites"
                />

                {/* Extra space before logout */}
                <div style={{ flexGrow: 1, minHeight: '120px' }}></div>

                <SidebarItem icon={<LogOut />} label="Logout" href="/logout" />
            </NavSection>
        </SidebarContainer>
    );
}
