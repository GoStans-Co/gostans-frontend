import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

type LegalPageLayoutProps = {
    children: React.ReactNode;
};

const PageContainer = styled.div`
    display: flex;
    max-width: 1280px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.xl};
    padding-top: 30px;
    gap: ${({ theme }) => theme.spacing['4xl']};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
    }
`;

const MainContent = styled.div`
    flex: 1;
    max-width: 800px;
`;

const SideNavigation = styled.aside`
    width: 280px;
    position: sticky;
    top: 100px;
    height: fit-content;
    text-align: left;

    ${({ theme }) => theme.responsive.tablet} {
        display: none;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        display: none;
    }

    ${({ theme }) => theme.responsive.minLaptop} {
        display: block;
    }
`;

const NavSection = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const NavTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const NavItem = styled.li`
    margin-bottom: 0;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
    display: block;
    color: ${({ theme, $isActive }) => ($isActive ? theme.colors.primary : theme.colors.lightText)};
    text-decoration: none;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    padding: ${({ theme }) => theme.spacing.xs} 0;
    transition: color 0.2s ease;
    font-weight: ${({ $isActive }) => ($isActive ? '500' : '400')};

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

/**
 * LegalPageLayout - Page Component
 * @description This component provides a layout for legal pages,
 * including a side navigation menu for different legal documents.
 */
export default function LegalPagesLayout({ children }: LegalPageLayoutProps) {
    const location = useLocation();

    const legalLinks = [
        { path: '/privacy-policy', label: 'Privacy Policy' },
        { path: '/terms-conditions', label: 'Terms & Conditions' },
        { path: '/cancellation-policy', label: 'Cancellation Policy' },
    ];

    const supportLinks = [
        { path: '/faq', label: 'FAQ' },
        { path: '/contact-us', label: 'Contact Us' },
    ];

    const partnerLinks = [
        { path: '/partner-agreement', label: 'Partner Agreement' },
        { path: '/commission-policy', label: 'Commission Policy' },
    ];

    return (
        <PageContainer>
            <MainContent>{children}</MainContent>

            <SideNavigation>
                <NavSection>
                    <NavTitle>Legal</NavTitle>
                    <NavList>
                        {legalLinks.map((link) => (
                            <NavItem key={link.path}>
                                <NavLink to={link.path} $isActive={location.pathname === link.path}>
                                    {link.label}
                                </NavLink>
                            </NavItem>
                        ))}
                    </NavList>
                </NavSection>

                <NavSection>
                    <NavTitle>Support</NavTitle>
                    <NavList>
                        {supportLinks.map((link) => (
                            <NavItem key={link.path}>
                                <NavLink to={link.path} $isActive={location.pathname === link.path}>
                                    {link.label}
                                </NavLink>
                            </NavItem>
                        ))}
                    </NavList>
                </NavSection>

                <NavSection>
                    <NavTitle>Partner Policies</NavTitle>
                    <NavList>
                        {partnerLinks.map((link) => (
                            <NavItem key={link.path}>
                                <NavLink to={link.path} $isActive={location.pathname === link.path}>
                                    {link.label}
                                </NavLink>
                            </NavItem>
                        ))}
                    </NavList>
                </NavSection>
            </SideNavigation>
        </PageContainer>
    );
}
