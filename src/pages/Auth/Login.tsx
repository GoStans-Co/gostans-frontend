import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import login from '@/assets/login.jpg';

const LoginContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
`;

const LoginFormSection = styled.div`
    flex: 1;
    padding: 2rem;
    padding-left: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 600px;
`;

const ImageSection = styled.div`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    background-image: url(${login});
    background-size: cover;
    background-position: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        display: none;
    }
`;

const Logo = styled(Link)`
    margin-bottom: 3rem;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};

    img {
        height: 40px;
        margin-right: 0.75rem;
    }
`;

const FormContainer = styled.div`
    width: 100%;
    max-width: 380px;
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: 2rem;
`;

const TabsContainer = styled.div`
    display: flex;
    margin-bottom: 2rem;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.grayBackground};
`;

const Tab = styled.button<{ active: boolean }>`
    flex: 1;
    padding: 0.75rem;
    border: none;
    background-color: ${({ active, theme }) => (active ? theme.colors.background : 'transparent')};
    color: ${({ active, theme }) => (active ? theme.colors.text : theme.colors.lightText)};
    font-weight: ${({ active }) => (active ? '600' : '400')};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.default};
    outline: none;
    box-shadow: ${({ active, theme }) => (active ? theme.shadows.sm : 'none')};

    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: none;
    }

    &:active {
        outline: none;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const Divider = styled.div`
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    color: ${({ theme }) => theme.colors.lightText};

    &::before,
    &::after {
        content: '';
        flex: 1;
        height: 1px;
        background-color: ${({ theme }) => theme.colors.border};
    }

    span {
        padding: 0 1rem;
        font-size: 0.875rem;
    }
`;

const SocialButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
`;

// background-color: rgba(255, 255, 255, 0.1);
// color: transparent;
// height: 40px;
// width: 40px;
// border-radius: 50%;

const SocialButton = styled.button`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    color: transparent;
    justify-content: center;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: white;
    color: ${({ theme }) => theme.colors.text};
    transition: all ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme }) => theme.colors.lightBackground};
    }
`;

const FooterText = styled.p`
    color: ${({ theme }) => theme.colors.lightText};
    font-size: 0.875rem;
    text-align: center;
    margin-top: 2rem;
    line-height: 1.5;
`;

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log({ email, password });
    };

    return (
        <LoginContainer>
            <ImageSection />
            <LoginFormSection>
                <Logo to="/">GoStans</Logo>

                <FormContainer>
                    <Title>Welcome Back</Title>
                    <Subtitle>Welcome Back. Please enter your details</Subtitle>

                    <TabsContainer>
                        <Tab active={activeTab === 'login'} onClick={() => setActiveTab('login')}>
                            Sign In
                        </Tab>
                        <Tab active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>
                            Sign up
                        </Tab>
                    </TabsContainer>

                    <Form onSubmit={handleSubmit}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<FaEnvelope />}
                            inputConfig={{
                                variant: 'outlined',
                                size: 'md',
                                fullWidth: true,
                            }}
                            required
                        />

                        {activeTab === 'login' && (
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<FaLock />}
                                inputConfig={{
                                    variant: 'outlined',
                                    size: 'md',
                                    fullWidth: true,
                                }}
                                required
                            />
                        )}

                        <Button type="submit" variant="primary" fullWidth={true} size="lg">
                            {activeTab === 'login' ? 'Continue' : 'Sign Up'}
                        </Button>
                    </Form>

                    <Divider>
                        <span>Or Continue With</span>
                    </Divider>

                    <SocialButtonsContainer>
                        <SocialButton aria-label="Continue with Google">
                            <FaGoogle />
                        </SocialButton>
                        <SocialButton aria-label="Continue with Apple">
                            <FaApple />
                        </SocialButton>
                        <SocialButton aria-label="Continue with Facebook">
                            <FaFacebook />
                        </SocialButton>
                    </SocialButtonsContainer>

                    <FooterText>
                        Join the millions of smart travelers who trust us to manage their travel plans. Log in to access
                        your personalized dashboard, track your bookings, and make informed travel decisions.
                    </FooterText>
                </FormContainer>
            </LoginFormSection>
        </LoginContainer>
    );
}
