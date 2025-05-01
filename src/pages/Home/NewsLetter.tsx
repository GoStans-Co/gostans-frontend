import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';

const NewsletterContainer = styled.section`
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: 4rem 2rem;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    text-align: center;
    margin: 3rem 0;
    margin-bottom: 90px;
    position: relative;
    overflow: hidden;
`;

const NewsletterBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.1;
    background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pattern' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 0,50 A 50,50 0 1,1 100,50 A 50,50 0 1,1 0,50 Z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)'/%3E%3C/svg%3E");
`;

const NewsletterTitle = styled.h2`
    font-size: 2.5rem;
    margin-bottom: 1rem;
    position: relative;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 2rem;
    }
`;

const NewsletterSubtitle = styled.p`
    font-size: 1.125rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    position: relative;
`;

const InputContainer = styled.div`
    display: flex;
    max-width: 500px;
    margin: 0 auto;
    position: relative;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

const SubscribeInput = styled.input`
    flex: 1;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: 1rem;
    background-color: white;
    color: black;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        border-radius: ${({ theme }) => `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`};
    }
`;

const SubscribeButton = styled.button`
    background-color: ${({ theme }) => theme.colors.accent};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 0.5rem 1rem;
    font-weight: 600;
    cursor: pointer;
    position: absolute;
    right: 5px;
    top: 5px;
    bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        position: static;
        margin-top: -5px;
        border-radius: ${({ theme }) => `0 0 ${theme.borderRadius.lg} ${theme.borderRadius.lg}`};
        width: 100%;
        padding: 1rem;
    }
`;

export default function NewsletterSection() {
    return (
        <NewsletterContainer>
            <NewsletterBackground />
            <NewsletterTitle>Get Updates & More</NewsletterTitle>
            <NewsletterSubtitle>Thoughtful thoughts to your inbox</NewsletterSubtitle>
            <InputContainer>
                <SubscribeInput placeholder="Enter Your email address" />
                <SubscribeButton>
                    <FaPaperPlane />
                </SubscribeButton>
            </InputContainer>
        </NewsletterContainer>
    );
}
