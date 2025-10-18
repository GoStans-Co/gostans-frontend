import { useState } from 'react';
import styled from 'styled-components';
import { message } from 'antd';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const ContactSection = styled.section`
    padding: ${({ theme }) => theme.spacing['5xl']} ${({ theme }) => theme.spacing['4xl']};
    background-color: ${({ theme }) => theme.colors.background};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.sm};
    }
`;

const ContactContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.xl};

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        padding: 0 ${({ theme }) => theme.spacing.md};
    }
`;

const ContactInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`;

const ContactTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ContactDesc = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    line-height: 1.6;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoIcon = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary};
`;

const InfoText = styled.div`
    display: flex;
    flex-direction: column;

    h4 {
        font-size: ${({ theme }) => theme.fontSizes.md};
        font-weight: 500;
        text-align: left;
        margin-bottom: ${({ theme }) => theme.spacing.xs};
        color: ${({ theme }) => theme.colors.text};
    }

    p {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        color: ${({ theme }) => theme.colors.lightText};
        margin: 0;
    }
`;

const ContactForm = styled.form`
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.xl};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }

    ${({ theme }) => theme.responsive.tablet} {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
`;

const FormTextarea = styled.textarea`
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.md};
    min-height: 150px;
    resize: vertical;
    font-family: inherit;
    transition: all ${({ theme }) => theme.transitions.default};

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.grayBackground};
    }
`;
/**
 * ContactUs - Component for the contact us page
 * @description This component allows users to send messages to the company.
 */
export default function ContactUs() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            /* i will update this part with actual API call tomorrow*/
            messageApi.success('Message sent successfully!');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            messageApi.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContactSection>
            {contextHolder}
            <ContactContainer>
                <ContactInfo>
                    <div>
                        <ContactTitle>Get in Touch</ContactTitle>
                        <ContactDesc>
                            Have questions about our tours or services? Need assistance with your booking? We're here to
                            help! Reach out to us through any of these channels, or fill out the form and we'll get back
                            to you as soon as possible.
                        </ContactDesc>
                    </div>

                    <div>
                        <InfoItem>
                            <InfoIcon>
                                <Mail size={24} />
                            </InfoIcon>
                            <InfoText>
                                <h4>Email Us</h4>
                                <p>gostans.com@gmail.com</p>
                            </InfoText>
                        </InfoItem>

                        <InfoItem>
                            <InfoIcon>
                                <Phone size={24} />
                            </InfoIcon>
                            <InfoText>
                                <h4>Call Us</h4>
                                <p>+998-77-503-57-47</p>
                            </InfoText>
                        </InfoItem>

                        <InfoItem>
                            <InfoIcon>
                                <MapPin size={24} />
                            </InfoIcon>
                            <InfoText>
                                <h4>Visit Us</h4>
                                <p>Afrosiyob 9, Bukhara, Uzbekistan</p>
                            </InfoText>
                        </InfoItem>
                    </div>
                </ContactInfo>

                <ContactForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            label="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Dave Smith"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="Email"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input
                            id="subject"
                            name="subject"
                            type="text"
                            label="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="Subject Inquiry"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormTextarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Your message here..."
                            required
                        />
                    </FormGroup>
                    <Button
                        type="submit"
                        size="lg"
                        variant="secondary"
                        disabled={loading}
                        startIcon={<Send size={18} />}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                </ContactForm>
            </ContactContainer>
        </ContactSection>
    );
}
