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

const LastUpdated = styled.p`
    text-align: left;
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Section = styled.section`
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
    text-align: left;
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

const SubSection = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    text-align: left;
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

const HighlightBox = styled.div`
    background: ${({ theme }) => theme.colors.lightBackground};
    border-left: 3px solid ${({ theme }) => theme.colors.accent};
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.lg} 0;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: ${({ theme }) => theme.spacing.lg} 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TableHeader = styled.th`
    background: ${({ theme }) => theme.colors.lightBackground};
    padding: ${({ theme }) => theme.spacing.md};
    text-align: left;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableCell = styled.td`
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.lightText};
`;

const ContactBox = styled.div`
    background: ${({ theme }) => theme.colors.grayBackground};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-top: ${({ theme }) => theme.spacing['3xl']};
    text-align: left;
    border: 1px solid ${({ theme }) => theme.colors.border};
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
 * Cancellation Policy - Static Page Component
 * @description A static page component that displays the cancellation policy of GoStans platform.
 */
export default function CancellationPolicy() {
    return (
        <LegalPageLayout>
            <ContentWrapper>
                <Header>
                    <Title>Cancellation Policy</Title>
                    <LastUpdated>Last updated: August 21, 2025</LastUpdated>
                </Header>

                <Section>
                    <SectionTitle>1. Overview</SectionTitle>
                    <Paragraph>
                        At GoStans, we understand that travel plans can change. This Cancellation Policy outlines the
                        terms and conditions for canceling bookings made through our platform. Please note that
                        individual tour operators may have their own cancellation policies, which will be clearly
                        displayed before you confirm your booking.
                    </Paragraph>
                    <Paragraph>
                        By making a booking through GoStans, you agree to the cancellation terms specified for that
                        particular tour or activity, as well as our general platform cancellation guidelines outlined
                        below.
                    </Paragraph>
                </Section>

                <Section>
                    <SectionTitle>2. General Cancellation Rules</SectionTitle>

                    <SubSection>
                        <SubTitle>2.1 Customer-Initiated Cancellations</SubTitle>
                        <Paragraph>
                            Customers may cancel their bookings through their GoStans account dashboard or by contacting
                            our support team. The refund amount depends on when the cancellation is made relative to the
                            tour start date.
                        </Paragraph>
                        <List>
                            <ListItem>
                                Cancellations are processed based on the tour operator's specific policy
                            </ListItem>
                            <ListItem>Refund timelines vary between 7-14 business days</ListItem>
                            <ListItem>All cancellations must be submitted in writing or through the platform</ListItem>
                            <ListItem>The cancellation time is recorded when we receive your request</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>2.2 Tour Operator-Initiated Cancellations</SubTitle>
                        <Paragraph>If a tour operator cancels a booking, customers are entitled to:</Paragraph>
                        <List>
                            <ListItem>Full refund including all fees and charges</ListItem>
                            <ListItem>Priority rebooking on alternative dates (if available)</ListItem>
                            <ListItem>Assistance in finding similar alternative tours</ListItem>
                            <ListItem>Expedited refund processing within 3-5 business days</ListItem>
                        </List>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>3. Standard Cancellation Timeline</SectionTitle>
                    <Paragraph>
                        Unless otherwise specified by the tour operator, the following standard cancellation policy
                        applies:
                    </Paragraph>

                    <Table>
                        <thead>
                            <tr>
                                <TableHeader>Cancellation Period</TableHeader>
                                <TableHeader>Refund Amount</TableHeader>
                                <TableHeader>Service Fee</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <TableCell>30+ days before tour</TableCell>
                                <TableCell>100% refund</TableCell>
                                <TableCell>Fully refunded</TableCell>
                            </tr>
                            <tr>
                                <TableCell>15-29 days before tour</TableCell>
                                <TableCell>75% refund</TableCell>
                                <TableCell>Non-refundable</TableCell>
                            </tr>
                            <tr>
                                <TableCell>7-14 days before tour</TableCell>
                                <TableCell>50% refund</TableCell>
                                <TableCell>Non-refundable</TableCell>
                            </tr>
                            <tr>
                                <TableCell>Less than 7 days</TableCell>
                                <TableCell>No refund</TableCell>
                                <TableCell>Non-refundable</TableCell>
                            </tr>
                        </tbody>
                    </Table>

                    <HighlightBox>
                        <Paragraph>
                            <strong>Note:</strong> Some tours may have different cancellation policies due to their
                            nature (e.g., peak season tours, special events, group bookings). Always check the specific
                            cancellation terms displayed on the tour page before booking.
                        </Paragraph>
                    </HighlightBox>
                </Section>

                <Section>
                    <SectionTitle>4. Special Circumstances</SectionTitle>

                    <SubSection>
                        <SubTitle>4.1 Force Majeure Events</SubTitle>
                        <Paragraph>
                            In cases of force majeure (natural disasters, war, pandemic restrictions, government travel
                            bans), we work with tour operators to provide flexible options:
                        </Paragraph>
                        <List>
                            <ListItem>Free rescheduling to future dates</ListItem>
                            <ListItem>Credit vouchers valid for 12 months</ListItem>
                            <ListItem>Full refunds where legally required</ListItem>
                            <ListItem>Waived change fees for affected bookings</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>4.2 Medical Emergencies</SubTitle>
                        <Paragraph>
                            For cancellations due to medical emergencies (with valid medical documentation):
                        </Paragraph>
                        <List>
                            <ListItem>Enhanced refund consideration on case-by-case basis</ListItem>
                            <ListItem>Waived cancellation fees where possible</ListItem>
                            <ListItem>Option to transfer booking to another person</ListItem>
                            <ListItem>Extended credit validity periods</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>4.3 Weather-Related Cancellations</SubTitle>
                        <Paragraph>For outdoor activities affected by severe weather:</Paragraph>
                        <List>
                            <ListItem>Tour operators will attempt to reschedule when safe</ListItem>
                            <ListItem>Full refunds if rescheduling is not possible</ListItem>
                            <ListItem>No penalties for weather-related operator cancellations</ListItem>
                        </List>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>5. Refund Processing</SectionTitle>

                    <SubSection>
                        <SubTitle>5.1 Refund Timeline</SubTitle>
                        <List>
                            <ListItem>Refund approval: 1-3 business days after cancellation request</ListItem>
                            <ListItem>Processing time: 7-14 business days from approval</ListItem>
                            <ListItem>Bank processing: Additional 3-5 business days may apply</ListItem>
                            <ListItem>Credit card refunds may take 1-2 billing cycles to appear</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>5.2 Refund Method</SubTitle>
                        <Paragraph>Refunds are processed to the original payment method used for booking:</Paragraph>
                        <List>
                            <ListItem>Credit/Debit cards: Refunded to the same card</ListItem>
                            <ListItem>Digital wallets: Returned to the wallet account</ListItem>
                            <ListItem>Bank transfers: Sent to the originating bank account</ListItem>
                            <ListItem>Alternative methods available in special circumstances</ListItem>
                        </List>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>6. Non-Refundable Items</SectionTitle>
                    <Paragraph>
                        The following items are typically non-refundable unless the tour is canceled by the operator:
                    </Paragraph>
                    <List>
                        <ListItem>GoStans service fees (unless specified otherwise)</ListItem>
                        <ListItem>Travel insurance premiums</ListItem>
                        <ListItem>Visa processing fees</ListItem>
                        <ListItem>Special request or customization charges</ListItem>
                        <ListItem>Last-minute booking fees</ListItem>
                        <ListItem>No-show bookings (failure to appear without cancellation)</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>7. Group Bookings</SectionTitle>
                    <Paragraph>Group bookings (10+ participants) may have different cancellation terms:</Paragraph>
                    <List>
                        <ListItem>Longer cancellation notice periods required (typically 45-60 days)</ListItem>
                        <ListItem>Partial cancellations may affect group rates</ListItem>
                        <ListItem>Minimum participant requirements must be maintained</ListItem>
                        <ListItem>Deposits may be non-refundable</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>8. How to Cancel Your Booking</SectionTitle>

                    <SubSection>
                        <SubTitle>Online Cancellation (Recommended)</SubTitle>
                        <List>
                            <ListItem>Log in to your GoStans account</ListItem>
                            <ListItem>Navigate to "My Bookings" section</ListItem>
                            <ListItem>Select the booking you wish to cancel</ListItem>
                            <ListItem>Click "Cancel Booking" and follow the prompts</ListItem>
                            <ListItem>Receive confirmation email with refund details</ListItem>
                        </List>
                    </SubSection>

                    <SubSection>
                        <SubTitle>Cancellation via Support Team</SubTitle>
                        <Paragraph>Contact our support team with your booking reference number:</Paragraph>
                        <List>
                            <ListItem>Email: support@gostans.com</ListItem>
                            <ListItem>Include booking ID and reason for cancellation</ListItem>
                            <ListItem>Await confirmation within 24 hours</ListItem>
                        </List>
                    </SubSection>
                </Section>

                <Section>
                    <SectionTitle>9. Travel Insurance Recommendation</SectionTitle>
                    <HighlightBox>
                        <Paragraph>
                            <strong>We strongly recommend purchasing travel insurance</strong> to protect your trip
                            investment. Travel insurance can cover cancellations due to illness, emergencies, and other
                            unforeseen circumstances not covered by standard cancellation policies.
                        </Paragraph>
                    </HighlightBox>
                </Section>

                <Section>
                    <SectionTitle>10. Disputes and Appeals</SectionTitle>
                    <Paragraph>If you disagree with a cancellation decision:</Paragraph>
                    <List>
                        <ListItem>Contact our support team within 30 days of the cancellation</ListItem>
                        <ListItem>Provide supporting documentation for your appeal</ListItem>
                        <ListItem>Allow 5-7 business days for review</ListItem>
                        <ListItem>Final decisions will be communicated via email</ListItem>
                    </List>
                </Section>

                <Section>
                    <SectionTitle>11. Policy Updates</SectionTitle>
                    <Paragraph>
                        GoStans reserves the right to modify this cancellation policy. Changes will be effective for
                        bookings made after the update date. Existing bookings will be honored under the policy in
                        effect at the time of booking.
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
