import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import goStansLogo from '@/assets/white.jpg';
import { Mail, MapPin, Phone } from 'lucide-react';

const FooterContainer = styled.footer`
    background-color: white;
    color: black;
    padding: 3rem 2rem;
    border-top: 1px solid ${({ theme }) => theme.colors.border};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

const FooterContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled(Link)`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 700;
    color: black;
    margin-bottom: 1rem;
    display: block;
`;

const FooterDescription = styled.p`
    margin-bottom: 1.5rem;
    line-height: 1.6;
    opacity: 0.8;
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.sm};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const FooterHeading = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-bottom: 1.5rem;
    font-weight: 600;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        margin-bottom: 1rem;
    }
`;

const FooterNavList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const FooterNavItem = styled.li`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    opacity: 0.8;
    transition: opacity 0.3s ease;
    text-align: left;

    &:hover {
        opacity: 1;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const ContactItem = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    opacity: 0.8;
    align-items: flex-start;
`;

const ContactText = styled.div`
    text-align: left;
    flex: 1;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    align-self: center;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const ContactIcon = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-top: 0.25rem;
    color: black;
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 1.3em;
        height: 1.3em;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;

const SocialLinks = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
`;

const SocialLink = styled.a`
    background-color: rgba(255, 255, 255, 0.1);
    color: transparent;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.grayBackground};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        height: 32px;
        width: 32px;
    }
`;

const BottomBar = styled.div`
    max-width: 1200px;
    margin: 2rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
`;

const Copyright = styled.p`
    opacity: 0.8;
    font-size: ${({ theme }) => theme.fontSizes.sm};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const BottomLinks = styled.div`
    display: flex;
    gap: 1.5rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-wrap: wrap;
        justify-content: center;
    }
`;

const BottomLink = styled.a`
    opacity: 0.8;
    transition: opacity 0.3s ease;
    font-size: ${({ theme }) => theme.fontSizes.sm};

    &:hover {
        opacity: 1;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const ContactValue = styled.a`
    color: #000;
    text-decoration: none;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    opacity: 0.8;
    transition: opacity 0.3s ease;
    align-self: center;

    &:hover {
        opacity: 70%;
        text-decoration: underline;
        text-decoration-color: ${({ theme }) => theme.colors.muted};
        text-decoration-thickness: 1px;
        color: ${({ theme }) => theme.colors.primary};
        highlight: none;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

export default function Footer() {
    return (
        <FooterContainer>
            <FooterContent>
                <FooterColumn>
                    <FooterLogo to="/">
                        <img src={goStansLogo} alt="Go Stans Logo" style={{ height: '40px' }} />
                    </FooterLogo>
                    <FooterDescription>
                        Discover the best of Asia with our curated tours and travel experiences. Let us help you create
                        unforgettable memories.
                    </FooterDescription>
                    <SocialLinks>
                        <SocialLink
                            href="https://www.facebook.com/people/Gostans-Gostans/pfbid0iKZm29CfLzRrxQoQS6dKmTB1JJxGCS8MasgtUJXzyyj5ffQN4LfyciQ67SrcNyhSl/"
                            target="_blank"
                            aria-label="Facebook"
                        >
                            <FaFacebook style={{ color: 'black' }} />
                        </SocialLink>
                        <SocialLink href="https://x.com/Gostans_Company" target="_blank" aria-label="Twitter">
                            <FaTwitter style={{ color: 'black' }} />
                        </SocialLink>
                        <SocialLink
                            href="https://www.instagram.com/gostans_com/"
                            target="_blank"
                            aria-label="Instagram"
                        >
                            <FaInstagram style={{ color: 'black' }} />
                        </SocialLink>
                        <SocialLink
                            href="https://www.linkedin.com/company/gostans/"
                            target="_blank"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin style={{ color: 'black' }} />
                        </SocialLink>
                    </SocialLinks>
                </FooterColumn>

                <FooterColumn>
                    <FooterHeading>Quick Links</FooterHeading>
                    <FooterNavList>
                        <FooterNavItem>
                            <Link to="/">Home</Link>
                        </FooterNavItem>
                        <FooterNavItem>
                            <Link to="/top-destinations">Destinations</Link>
                        </FooterNavItem>
                        <FooterNavItem>
                            <Link to="/searchTrips">Tours</Link>
                        </FooterNavItem>
                        <FooterNavItem>
                            <Link to="/trendingTours">Trending Tours</Link>
                        </FooterNavItem>
                    </FooterNavList>
                </FooterColumn>

                <FooterColumn>
                    <FooterHeading>Support</FooterHeading>
                    <FooterNavList>
                        <FooterNavItem>
                            <Link to="/faq">FAQ</Link>
                        </FooterNavItem>
                        <FooterNavItem>
                            <Link to="/contact-us">Contact Us</Link>
                        </FooterNavItem>
                        <FooterNavItem>
                            <Link to="/privacy-policy">Privacy Policy</Link>
                        </FooterNavItem>
                        <FooterNavItem>
                            <Link to="/terms-conditions">Terms & Conditions</Link>
                        </FooterNavItem>
                        <FooterNavItem>
                            <Link to="/cancellation-policy">Cancellation Policy</Link>
                        </FooterNavItem>
                    </FooterNavList>
                </FooterColumn>

                <FooterColumn>
                    <FooterHeading>Contact Us</FooterHeading>
                    <ContactItem>
                        <ContactIcon>
                            <MapPin />
                        </ContactIcon>
                        <ContactText>Afrosiyob 9, Bukhara, Uzbekistan</ContactText>
                    </ContactItem>
                    <ContactItem>
                        <ContactIcon>
                            <Phone />
                        </ContactIcon>
                        <ContactValue href="tel:+998775035747" target="_blank" rel="noopener noreferrer">
                            +998-77-503-57-47
                        </ContactValue>
                    </ContactItem>
                    <ContactItem>
                        <ContactIcon>
                            <Mail />
                        </ContactIcon>
                        <ContactValue href="mailto:info@gostans.com" target="_blank" rel="noopener noreferrer">
                            info@gostans.com
                        </ContactValue>
                    </ContactItem>
                </FooterColumn>
            </FooterContent>

            <BottomBar>
                <Copyright>&copy; {new Date().getFullYear()} GoStans. All rights reserved.</Copyright>
                <BottomLinks>
                    <BottomLink href="/privacy-policy">Privacy Policy</BottomLink>
                    <BottomLink href="/terms-conditions">Terms & Conditions</BottomLink>
                    <BottomLink href="/cookies-policy">Cookies Policy</BottomLink>
                </BottomLinks>
            </BottomBar>
        </FooterContainer>
    );
}
