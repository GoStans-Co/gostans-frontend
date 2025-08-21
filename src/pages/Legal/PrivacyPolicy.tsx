import styled from 'styled-components';
import LegalPageLayout from './LegalPagesLayout';

const ContentWrapper = styled.div`
    background: ${({ theme }) => theme.colors.background};
    text-align: left;
`;

const Header = styled.div`
    text-align: left;
    margin-bottom: ${({ theme }) => theme.spacing['3xl']};
    padding-bottom: ${({ theme }) => theme.spacing.xl};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h1`
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: 600;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes['2xl']};
    }
`;

const SectionTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
    text-align: left;
    margin-top: ${({ theme }) => theme.spacing['2xl']};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }
`;

const SubTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: 600;
    text-align: left;
`;

const Paragraph = styled.p`
    color: ${({ theme }) => theme.colors.lightText};
    line-height: 1.6; /* Reduced from 1.8 */
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    text-align: left;
`;

const List = styled.ul`
    align-items: flex-start;
    margin: ${({ theme }) => theme.spacing.sm} 0;
    padding-left: ${({ theme }) => theme.spacing.lg};
    text-align: left;
`;

const ListItem = styled.li`
    color: ${({ theme }) => theme.colors.lightText};
    line-height: 1.6; /* Reduced from 1.8 */
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    text-align: left;
`;

const ContactBox = styled.div`
    background: ${({ theme }) => theme.colors.grayBackground};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-top: ${({ theme }) => theme.spacing['3xl']};
    text-align: left;
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const LastUpdated = styled.p`
    text-align: left;
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Section = styled.section`
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
    text-align: left;
`;

const SubSection = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    text-align: left;
`;

const ContactTitle = styled.h3`
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
`;

const ContactInfo = styled.div`
    color: ${({ theme }) => theme.colors.lightText};
    text-align: left;

    a {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

/**
 * Privacy Policy - Static Page Component
 * @description A static page component that displays the privacy policy of the application.
 */
export default function PrivacyPolicy() {
    return (
        <LegalPageLayout>
            <ContentWrapper>
                <Header>
                    <Title>Privacy Policy</Title>
                    <LastUpdated>Last updated: August 21, 2025</LastUpdated>
                </Header>

                <Section>
                    <SectionTitle>1. Introduction</SectionTitle>
                    <Paragraph>
                        Welcome to GoStans. We are committed to protecting your personal information and your right to
                        privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                        information when you use our platform for booking tours, activities, and travel experiences.
                    </Paragraph>
                    <Paragraph>
                        By using GoStans, you agree to the collection and use of information in accordance with this
                        policy. If you do not agree with our policies and practices, please do not use our services.
                    </Paragraph>
                </Section>

                <Section>
                    <SectionTitle>2. Information We Collect</SectionTitle>

                    <SubSection>
                        <SubTitle>2.1 Information You Provide</SubTitle>
                        <List>
                            <ListItem>
                                <strong>Account Information:</strong> Name, email address, phone number, password, and
                                profile picture
                            </ListItem>
                            <ListItem>
                                <strong>Booking Information:</strong> Tour selections, travel dates, number of
                                travelers, special requirements
                            </ListItem>
                            <ListItem>
                                <strong>Payment Information:</strong> Credit/debit card details, billing address
                                (processed securely through payment providers)
                            </ListItem>
                            <ListItem>
                                <strong>Communications:</strong> Messages with tour operators, reviews, feedback, and
                                support inquiries
                            </ListItem>
                            <ListItem>
                                <strong>Partner Information:</strong> Business details, tax information, bank accounts
                                (for tour operators and partners)
                            </ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>2.2 Information Collected Automatically</SubTitle>
                        <List>
                            <ListItem>Device information (IP address, browser type, operating system)</ListItem>
                            <ListItem>Usage data (pages visited, click patterns, search queries)</ListItem>
                            <ListItem>Location data (with your permission)</ListItem>
                            <ListItem>Cookies and similar tracking technologies</ListItem>
                        </List>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>3. How We Use Your Information</SectionTitle>
                    <Paragraph>We use your personal information to:</Paragraph>
                    <List>
                        <ListItem>Process bookings and facilitate tour experiences</ListItem>
                        <ListItem>Connect customers with tour operators and service providers</ListItem>
                        <ListItem>Process payments and prevent fraud</ListItem>
                        <ListItem>Send booking confirmations, updates, and travel information</ListItem>
                        <ListItem>Provide customer support and respond to inquiries</ListItem>
                        <ListItem>Personalize your experience and recommend relevant tours</ListItem>
                        <ListItem>Send marketing communications (with your consent)</ListItem>
                        <ListItem>Improve our platform and develop new features</ListItem>
                        <ListItem>Comply with legal obligations and enforce our terms</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>4. Information Sharing</SectionTitle>

                    <SubSection>
                        <SubTitle>4.1 We share information with:</SubTitle>
                        <List>
                            <ListItem>
                                <strong>Tour Operators:</strong> To facilitate your bookings and provide tour services
                            </ListItem>
                            <ListItem>
                                <strong>Payment Processors:</strong> To securely process transactions
                            </ListItem>
                            <ListItem>
                                <strong>Service Providers:</strong> Who help us operate our platform (hosting,
                                analytics, email services)
                            </ListItem>
                            <ListItem>
                                <strong>Legal Authorities:</strong> When required by law or to protect rights and safety
                            </ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>4.2 We do NOT:</SubTitle>
                        <List>
                            <ListItem>Sell your personal information to third parties</ListItem>
                            <ListItem>Share your information for third-party marketing without consent</ListItem>
                            <ListItem>Store payment card details on our servers</ListItem>
                        </List>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>5. Data Security</SectionTitle>
                    <Paragraph>
                        We implement appropriate technical and organizational measures to protect your personal
                        information, including:
                    </Paragraph>
                    <List>
                        <ListItem>SSL encryption for data transmission</ListItem>
                        <ListItem>Secure servers and regular security audits</ListItem>
                        <ListItem>Limited access to personal information by employees</ListItem>
                        <ListItem>Regular security training for our team</ListItem>
                        <ListItem>PCI DSS compliance for payment processing</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>6. Your Rights</SectionTitle>
                    <Paragraph>You have the right to:</Paragraph>
                    <List>
                        <ListItem>Access and receive a copy of your personal data</ListItem>
                        <ListItem>Correct inaccurate or incomplete information</ListItem>
                        <ListItem>Request deletion of your personal data</ListItem>
                        <ListItem>Object to or restrict processing of your data</ListItem>
                        <ListItem>Withdraw consent for marketing communications</ListItem>
                        <ListItem>Data portability (receive your data in a structured format)</ListItem>
                    </List>
                    <Paragraph>To exercise these rights, please contact us at privacy@gostans.com</Paragraph>
                </Section>

                <Section>
                    <SectionTitle>7. Cookies Policy</SectionTitle>
                    <Paragraph>We use cookies and similar technologies to enhance your experience:</Paragraph>
                    <List>
                        <ListItem>
                            <strong>Essential Cookies:</strong> Required for platform functionality
                        </ListItem>
                        <ListItem>
                            <strong>Analytics Cookies:</strong> Help us understand platform usage
                        </ListItem>
                        <ListItem>
                            <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
                        </ListItem>
                        <ListItem>
                            <strong>Preference Cookies:</strong> Remember your settings and choices
                        </ListItem>
                    </List>
                    <Paragraph>You can manage cookie preferences through your browser settings.</Paragraph>
                </Section>

                <Section>
                    <SectionTitle>8. International Data Transfers</SectionTitle>
                    <Paragraph>
                        As we operate globally, your information may be transferred to and processed in countries other
                        than your country of residence. We ensure appropriate safeguards are in place to protect your
                        information in accordance with this privacy policy.
                    </Paragraph>
                </Section>

                <Section>
                    <SectionTitle>9. Children's Privacy</SectionTitle>
                    <Paragraph>
                        Our services are not directed to children under 16. We do not knowingly collect personal
                        information from children. If you believe we have collected information from a child, please
                        contact us immediately.
                    </Paragraph>
                </Section>

                <Section>
                    <SectionTitle>10. Changes to This Policy</SectionTitle>
                    <Paragraph>
                        We may update this Privacy Policy periodically. We will notify you of any changes by posting the
                        new policy on this page and updating the "Last updated" date. For significant changes, we will
                        provide additional notice via email or platform notification.
                    </Paragraph>
                </Section>

                <ContactBox>
                    <ContactTitle>Contact Us</ContactTitle>
                    <ContactInfo>
                        <p>If you have questions about this Privacy Policy, please contact us:</p>
                        <p>
                            Support: <a href="mailto:info@gostans.com">info@gostans.com</a>
                            <br />
                            Address: GoStans Travel Platform
                            <br />
                            GoStans LLC, Afrosiyob 9, Bukhara, Uzbekistan
                        </p>
                    </ContactInfo>
                </ContactBox>
            </ContentWrapper>
        </LegalPageLayout>
    );
}
