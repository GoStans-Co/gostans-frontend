import {
    CalendarOutlined,
    HeartOutlined,
    UserOutlined,
    TagsOutlined,
    RightOutlined,
    CreditCardOutlined,
} from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { PageSection } from '@/types/pageSection';
import Button from '@/components/common/Button';

type SidebarProps = {
    userName: string;
    activePage: PageSection;
    onSectionChange: (section: PageSection) => void;
    handleLogout?: () => void;
    email: string;
};

type SidebarItemProps = {
    active?: boolean;
    icon?: React.ReactNode;
    label: string;
    description?: string;
    onClick?: () => void;
};

const SidebarContainer = styled.div`
    width: calc(100% - ${({ theme }) => theme.spacing.md}*1);
    max-width: 320px;
    padding: ${({ theme }) => theme.spacing.sm};
    margin: 0;
    position: sticky;
    top: 110px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    gap: 1rem;

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
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: 4px;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        text-align: center;
        gap: ${({ theme }) => theme.spacing.sm};
        margin-bottom: ${({ theme }) => theme.spacing.lg};
        padding-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const ProfileInfo = styled.div`
    text-align: flex-start;
    flex: 1;
    min-width: 0;
    width: 100%;
    margin-left: 4px;
`;

const ProfileName = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.xl || '20px'};
    font-weight: 700;
    margin: 0;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.text || '#1a1a1a'};
`;

const ProfileEmail = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm || '14px'};
    color: ${({ theme }) => theme.colors.muted || '#666'};
    margin: 0;
    font-weight: 400;
`;

const NavItem = styled.button<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.md};
    border: ${({ theme, $active }) => ($active ? `1px solid ${theme.colors.primary} ` : '1px solid #e5e7eb')};
    border-radius: 12px;
    background-color: transparent;
    transition: background-color 0.2s ease;
    font-weight: 500;
    font-size: 15px;
    color: #1a1a1a;
    cursor: pointer;
    width: 100%;
    text-align: left;
    position: relative;
    overflow: hidden;

    &:hover {
        background-color: #f5f6f7;
    }
`;

const IconWrapper = styled.span<{ $active?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${({ theme }) => theme.spacing.lg};
    width: 24px;
    height: 24px;
    color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.text)};
    transition: color ${({ theme }) => theme.transitions.default};

    svg {
        width: 22px;
        height: 22px;
    }
`;

const ItemContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const ItemLabel = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 500;
`;

const Description = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.sm || '14px'};
    color: ${({ theme }) => theme.colors.muted || '#666'};
`;

/**
 * Sidebar - Sub Component
 * @description This component displays the sidebar navigation for the MyPage section,
 * allowing users to navigate between different sections like Profile, Trips, and Favorites.
 */
export default function Sidebar({ userName, activePage, onSectionChange, handleLogout, email }: SidebarProps) {
    return (
        <SidebarContainer>
            <ProfileSection>
                <ProfileInfo>
                    <ProfileName>Hi, {userName}</ProfileName>
                    <ProfileEmail>{email ? email : 'No email found'}</ProfileEmail>
                </ProfileInfo>
            </ProfileSection>

            <SidebarItem
                active={activePage === PageSection.PROFILE}
                label="Profile"
                description="Provide your personal details"
                icon={<UserOutlined />}
                onClick={() => onSectionChange(PageSection.PROFILE)}
            />
            <SidebarItem
                active={activePage === PageSection.TRIPS}
                label="Trips"
                description="Manage your travel bookings"
                icon={<CalendarOutlined />}
                onClick={() => onSectionChange(PageSection.TRIPS)}
            />
            <SidebarItem
                active={activePage === PageSection.FAVORITES}
                label="Favorites"
                description="See your saved trips"
                icon={<HeartOutlined />}
                onClick={() => onSectionChange(PageSection.FAVORITES)}
            />
            <SidebarItem
                active={activePage === PageSection.PAYMENT_MANAGE}
                label="Payment methods"
                description="Manage your payment options"
                icon={<CreditCardOutlined />}
                onClick={() => onSectionChange(PageSection.PAYMENT_MANAGE)}
            />
            <SidebarItem
                active={activePage === PageSection.COUPONS}
                label="Coupons"
                description="Check your available discounts"
                icon={<TagsOutlined />}
                onClick={() => onSectionChange(PageSection.COUPONS)}
            />

            <Button size="md" variant="text" onClick={handleLogout}>
                {' '}
                Log out{' '}
            </Button>
        </SidebarContainer>
    );
}

function SidebarItem({ active, icon, label, description, onClick }: SidebarItemProps) {
    return (
        <NavItem $active={active} onClick={onClick}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {icon && <IconWrapper $active={active}>{icon}</IconWrapper>}
                <ItemContent>
                    <ItemLabel>{label}</ItemLabel>
                    {description && <Description>{description}</Description>}
                </ItemContent>
                <RightOutlined style={{ color: '#999' }} />
            </div>
        </NavItem>
    );
}
