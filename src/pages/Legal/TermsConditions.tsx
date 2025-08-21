import styled from 'styled-components';
import LegalPageLayout from '@/pages/Legal/LegalPagesLayout';

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
    margin-top: ${({ theme }) => theme.spacing.md};

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
    line-height: 1.6;
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
    line-height: 1.6;
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
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Section = styled.section`
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const SubSection = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ContactTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
`;

const ContactInfo = styled.div`
    color: ${({ theme }) => theme.colors.lightText};

    a {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const HighlightBox = styled.div`
    background: ${({ theme }) => theme.colors.lightBackground};
    border-left: 3px solid ${({ theme }) => theme.colors.accent};
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.lg} 0;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

/**
 *  Terms and Conditions - Static Page Component
 * @description A static page component that displays the terms and conditions of the application.
 */
export default function TermsConditions() {
    return (
        <LegalPageLayout>
            <ContentWrapper>
                <Header>
                    <Title>Terms & Conditions</Title>
                    <LastUpdated>Effective Date: August 21, 2025</LastUpdated>
                </Header>

                <Section>
                    <SectionTitle>1. Agreement to Terms</SectionTitle>
                    <Paragraph>
                        By accessing or using GoStans platform ("Service"), you agree to be bound by these Terms and
                        Conditions ("Terms"). These Terms apply to all users of the platform, including customers
                        booking tours and partner companies offering services.
                    </Paragraph>
                    <Paragraph>
                        If you disagree with any part of these terms, you may not access our Service. Your continued use
                        of the platform constitutes acceptance of any revised Terms.
                    </Paragraph>
                </Section>

                <Section>
                    <SectionTitle>2. Service Description</SectionTitle>
                    <Paragraph>
                        GoStans is an online marketplace that connects travelers with tour operators, activity
                        providers, and travel service companies. We facilitate bookings but do not directly provide tour
                        services.
                    </Paragraph>
                    <SubSection>
                        <SubTitle>Our platform enables:</SubTitle>
                        <List>
                            <ListItem>Browsing and booking tours, activities, and travel experiences</ListItem>
                            <ListItem>Secure payment processing</ListItem>
                            <ListItem>Communication between customers and service providers</ListItem>
                            <ListItem>Review and rating systems</ListItem>
                            <ListItem>Partner dashboard for tour operators to list and manage offerings</ListItem>
                        </List>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>3. User Accounts</SectionTitle>

                    <SubSection>
                        <SubTitle>3.1 Account Registration</SubTitle>
                        <List>
                            <ListItem>You must provide accurate, current, and complete information</ListItem>
                            <ListItem>You are responsible for maintaining account security</ListItem>
                            <ListItem>You must notify us immediately of any unauthorized access</ListItem>
                            <ListItem>One person or entity may not maintain multiple accounts</ListItem>
                            <ListItem>You must be at least 18 years old to create an account</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>3.2 Account Responsibilities</SubTitle>
                        <Paragraph>
                            You are responsible for all activities under your account and must keep your login
                            credentials confidential. GoStans is not liable for any loss or damage from your failure to
                            comply with these security obligations.
                        </Paragraph>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>4. Bookings and Payments</SectionTitle>

                    <SubSection>
                        <SubTitle>4.1 Booking Process</SubTitle>
                        <List>
                            <ListItem>All bookings are subject to availability and confirmation</ListItem>
                            <ListItem>Prices displayed include all mandatory fees unless otherwise stated</ListItem>
                            <ListItem>You agree to pay all charges associated with your bookings</ListItem>
                            <ListItem>Booking confirmations will be sent to your registered email</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>4.2 Payment Terms</SubTitle>
                        <List>
                            <ListItem>Payments are processed securely through third-party payment providers</ListItem>
                            <ListItem>
                                Full payment is required at the time of booking unless otherwise specified
                            </ListItem>
                            <ListItem>
                                Prices are displayed in the currency selected and may be subject to exchange rates
                            </ListItem>
                            <ListItem>You authorize us to charge your payment method for all fees</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>4.3 Service Fees</SubTitle>
                        <Paragraph>
                            GoStans may charge service fees for facilitating bookings. These fees are non-refundable
                            unless the booking is canceled by the service provider or due to platform error.
                        </Paragraph>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>5. Cancellations and Refunds</SectionTitle>

                    <SubSection>
                        <SubTitle>5.1 Cancellation Policy</SubTitle>
                        <List>
                            <ListItem>Each tour operator sets their own cancellation policy</ListItem>
                            <ListItem>Cancellation terms are displayed before booking confirmation</ListItem>
                            <ListItem>Refunds are subject to the applicable cancellation policy</ListItem>
                            <ListItem>GoStans service fees may be non-refundable</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>5.2 Refund Processing</SubTitle>
                        <Paragraph>
                            Approved refunds will be processed within 7-14 business days. Refunds are issued to the
                            original payment method. Processing times may vary depending on your payment provider.
                        </Paragraph>
                    </SubSection>

                    <HighlightBox>
                        <Paragraph>
                            <strong>Important:</strong> We strongly recommend purchasing travel insurance to protect
                            against unforeseen circumstances that may affect your travel plans.
                        </Paragraph>
                    </HighlightBox>
                </Section>

                <Section>
                    <SectionTitle>6. Partner Terms (Tour Operators)</SectionTitle>

                    <SubSection>
                        <SubTitle>6.1 Partner Obligations</SubTitle>
                        <List>
                            <ListItem>Provide accurate descriptions and images of services</ListItem>
                            <ListItem>Honor all confirmed bookings at advertised prices</ListItem>
                            <ListItem>Maintain necessary licenses, permits, and insurance</ListItem>
                            <ListItem>Respond to customer inquiries within 24 hours</ListItem>
                            <ListItem>Comply with all applicable laws and regulations</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>6.2 Commission and Payments</SubTitle>
                        <List>
                            <ListItem>Partners agree to pay GoStans commission on completed bookings</ListItem>
                            <ListItem>Commission rates are specified in partner agreements</ListItem>
                            <ListItem>Payments to partners are processed according to agreed schedules</ListItem>
                            <ListItem>Partners are responsible for their own taxes and fees</ListItem>
                        </List>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>7. User Conduct</SectionTitle>
                    <Paragraph>Users agree NOT to:</Paragraph>
                    <List>
                        <ListItem>Violate any laws or regulations</ListItem>
                        <ListItem>Provide false or misleading information</ListItem>
                        <ListItem>Interfere with platform operation or security</ListItem>
                        <ListItem>Use the platform for unauthorized commercial purposes</ListItem>
                        <ListItem>Harass, abuse, or harm other users or partners</ListItem>
                        <ListItem>Post inappropriate content in reviews or communications</ListItem>
                        <ListItem>Attempt to circumvent the booking system</ListItem>
                        <ListItem>Copy, modify, or distribute platform content without permission</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>8. Intellectual Property</SectionTitle>
                    <Paragraph>
                        All content on GoStans, including text, graphics, logos, images, and software, is the property
                        of GoStans or its licensors and is protected by copyright and intellectual property laws.
                    </Paragraph>
                    <SubSection>
                        <SubTitle>User Content</SubTitle>
                        <Paragraph>
                            By posting reviews, photos, or other content, you grant GoStans a non-exclusive, worldwide,
                            royalty-free license to use, reproduce, and display such content for platform operations and
                            marketing purposes.
                        </Paragraph>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>9. Liability and Disclaimers</SectionTitle>

                    <SubSection>
                        <SubTitle>9.1 Platform Role</SubTitle>
                        <Paragraph>
                            GoStans acts solely as an intermediary between customers and service providers. We are not
                            responsible for the actual provision of tours or travel services.
                        </Paragraph>
                    </SubSection>

                    <SubSection>
                        <SubTitle>9.2 Limitation of Liability</SubTitle>
                        <Paragraph>To the maximum extent permitted by law, GoStans shall not be liable for:</Paragraph>
                        <List>
                            <ListItem>Quality, safety, or legality of tours and services</ListItem>
                            <ListItem>Accuracy of listings, descriptions, or reviews</ListItem>
                            <ListItem>Performance or conduct of service providers</ListItem>
                            <ListItem>Personal injury, property damage, or other damages during tours</ListItem>
                            <ListItem>Indirect, incidental, or consequential damages</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>9.3 Travel Risks</SubTitle>
                        <Paragraph>
                            Travel involves inherent risks. Users acknowledge these risks and agree to take
                            responsibility for their safety and belongings. We recommend comprehensive travel insurance.
                        </Paragraph>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>10. Indemnification</SectionTitle>
                    <Paragraph>
                        You agree to indemnify and hold GoStans, its affiliates, officers, and employees harmless from
                        any claims, damages, losses, or expenses arising from your use of the platform, violation of
                        these Terms, or infringement of any rights of another party.
                    </Paragraph>
                </Section>

                <Section>
                    <SectionTitle>11. Dispute Resolution</SectionTitle>

                    <SubSection>
                        <SubTitle>11.1 Direct Resolution</SubTitle>
                        <Paragraph>
                            Users should first attempt to resolve disputes directly with the relevant tour operator.
                            GoStans may assist in facilitating communication but is not obligated to resolve disputes.
                        </Paragraph>
                    </SubSection>

                    <SubSection>
                        <SubTitle>11.2 Arbitration</SubTitle>
                        <Paragraph>
                            Any disputes not resolved directly shall be settled through binding arbitration in
                            accordance with applicable arbitration rules. This clause does not prevent seeking
                            injunctive relief.
                        </Paragraph>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>12. Modifications to Terms</SectionTitle>
                    <Paragraph>
                        GoStans reserves the right to modify these Terms at any time. We will notify users of
                        significant changes via email or platform notification. Continued use after changes constitutes
                        acceptance of modified Terms.
                    </Paragraph>
                </Section>

                <Section>
                    <SectionTitle>13. Termination</SectionTitle>
                    <Paragraph>
                        We may terminate or suspend your account immediately, without prior notice, for:
                    </Paragraph>
                    <List>
                        <ListItem>Breach of these Terms</ListItem>
                        <ListItem>Fraudulent or illegal activities</ListItem>
                        <ListItem>Harmful conduct toward other users or partners</ListItem>
                        <ListItem>At our sole discretion for protecting the platform integrity</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>14. Governing Law</SectionTitle>
                    <Paragraph>
                        These Terms shall be governed by and construed in accordance with the laws of [Your
                        Jurisdiction], without regard to conflict of law provisions. You consent to exclusive
                        jurisdiction in the courts of [Your Jurisdiction].
                    </Paragraph>
                </Section>

                <Section>
                    <SectionTitle>15. General Provisions</SectionTitle>
                    <List>
                        <ListItem>
                            <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you
                            and GoStans
                        </ListItem>
                        <ListItem>
                            <strong>Severability:</strong> If any provision is deemed invalid, the remaining provisions
                            continue in effect
                        </ListItem>
                        <ListItem>
                            <strong>Waiver:</strong> No waiver of any term shall be deemed a further or continuing
                            waiver
                        </ListItem>
                        <ListItem>
                            <strong>Assignment:</strong> You may not assign your rights without our written consent
                        </ListItem>
                    </List>
                </Section>

                <ContactBox>
                    <ContactTitle>Contact Information</ContactTitle>
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
