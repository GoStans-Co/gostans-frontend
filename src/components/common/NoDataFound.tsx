import React from 'react';
import styled from 'styled-components';
import getDefaultContent from '@/components/dataTypes';
import Button from '@/components/Common/Button';

export type NoDataType = 'search' | 'error' | 'empty' | 'location' | 'date' | 'general';

export type NoDataFoundProps = {
    type?: NoDataType;
    title?: string;
    message?: string;
    showButton?: boolean;
    buttonText?: string;
    onButtonClick?: () => void;
    icon?: React.ReactNode;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8rem 2rem;
    text-align: center;
    min-height: 300px;
`;

const IconWrapper = styled.div`
    margin-bottom: 1.5rem;
    opacity: 0.6;

    svg {
        font-size: 4rem;
        color: ${({ theme }) => theme.colors.lightText};
    }
`;

const Title = styled.h3`
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 0.5rem 0;
`;

const Message = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.lightText};
    margin: 0 0 2rem 0;
    max-width: 400px;
    line-height: 1.5;
`;

export default function NoDataFound({
    type = 'search',
    title,
    message,
    showButton = true,
    buttonText,
    onButtonClick,
    icon,
}: NoDataFoundProps) {
    const defaults = getDefaultContent(type);

    const displayTitle = title || defaults.title;
    const displayMessage = message || defaults.message;
    const displayButtonText = buttonText || defaults.buttonText;
    const displayIcon = icon || defaults.icon;

    return (
        <Container>
            <IconWrapper>{displayIcon}</IconWrapper>
            <Title>{displayTitle}</Title>
            <Message>{displayMessage}</Message>
            {showButton && onButtonClick && (
                <Button variant="primary" size="md" onClick={onButtonClick} style={{ marginTop: '1rem' }}>
                    {displayButtonText}
                </Button>
            )}{' '}
        </Container>
    );
}
