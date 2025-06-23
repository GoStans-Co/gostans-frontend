import React from 'react';
import styled, { css } from 'styled-components';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'outlined' | 'filled';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    endIcon?: React.ReactNode;
    icon?: React.ReactNode;
    noBorder?: boolean;
    error?: string;
    inputConfig?: {
        size?: InputSize;
        variant?: InputVariant;
        fullWidth?: boolean;
        noBorder?: boolean;
    };
};

const InputContainer = styled.div<{ noBorder: boolean; fullWidth: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
    align-items: flex-start;
    width: 100%;
    // width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const InputLabel = styled.label`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    text-align: left;
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
`;

const IconContainer = styled.div`
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text || '#666'};
    z-index: 1;

    svg {
        width: 20px;
        height: 20px;
        stroke-width: 2px; /* Make icon lines thicker */
    }
`;

const EndIconContainer = styled.div`
    position: absolute;
    right: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text || '#666'};
    z-index: 1;

    width: 24px;
    height: 24px;
    background-color: ${({ theme }) => theme.colors.lightBackground || '#f5f5f5'};
    border-radius: 50%;

    svg {
        width: 16px;
        height: 16px;
    }
`;

const StyledInput = styled.input<{
    $hasIcon: boolean;
    $hasEndIcon: boolean;
    $size: InputSize;
    $variant: InputVariant;
    $hasError: boolean;
}>`
    width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: all ${({ theme }) => theme.transitions.default};
    color: ${({ theme }) => theme.colors.text};

    padding: ${({ $size }) => ($size === 'sm' ? '0.1rem 0.75rem' : $size === 'lg' ? '0.75rem 1rem' : '0.625rem 1rem')};

    ${({ $hasIcon }) =>
        $hasIcon &&
        css`
            padding-left: 2.5rem;
        `}

    ${({ $hasEndIcon }) =>
        $hasEndIcon &&
        css`
            padding-right: 2.5rem;
        `}


    ${({ $size, theme }) => {
        switch ($size) {
            case 'sm':
                return css`
                    padding: 0.5rem 0.75rem;
                    font-size: ${theme.fontSizes.sm};
                    height: 40px;
                `;
            case 'lg':
                return css`
                    padding: 0.75rem 1rem;
                    font-size: ${theme.fontSizes.lg};
                    height: 56px;
                `;
            case 'md':
            default:
                return css`
                    padding: 0.65rem 1rem;
                    font-size: ${theme.fontSizes.md};
                    height: 48px;
                `;
        }
    }}

    ${({ $variant, theme, $hasError }) => {
        switch ($variant) {
            case 'outlined':
                return css`
                    border: 1px solid ${$hasError ? theme.colors.accent : theme.colors.border};
                    background-color: transparent;

                    &:focus {
                        border-color: ${$hasError ? theme.colors.accent : theme.colors.primary};
                        box-shadow: 0 0 0 2px ${$hasError ? 'rgba(255, 107, 53, 0.2)' : 'rgba(31, 101, 160, 0.2)'};
                    }
                `;
            case 'filled':
                return css`
                    border: none;
                    background-color: ${theme.colors.lightBackground};

                    &:focus {
                        box-shadow: 0 0 0 2px ${$hasError ? 'rgba(255, 107, 53, 0.2)' : 'rgba(31, 101, 160, 0.2)'};
                    }
                `;
            case 'default':
            default:
                return css`
                    border: none;
                    border-bottom: 1px solid ${$hasError ? theme.colors.accent : theme.colors.border};
                    border-radius: 0;
                    background-color: transparent;

                    &:focus {
                        border-bottom: 2px solid ${$hasError ? theme.colors.accent : theme.colors.primary};
                    }
                `;
        }
    }}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background-color: ${({ theme }) => theme.colors.lightBackground};
    }

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

const ErrorMessage = styled.span`
    color: ${({ theme }) => theme.colors.accent};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-top: 0;
`;

export default function Input({ label, icon, endIcon, error, inputConfig = {}, ...rest }: InputProps) {
    const { size = 'md', variant = 'outlined', fullWidth = true, noBorder = false } = inputConfig;

    const styleProps = {
        $hasIcon: !!icon,
        $hasEndIcon: !!endIcon,
        $size: size,
        $variant: variant,
        $hasError: !!error,
    };

    return (
        <InputContainer noBorder={noBorder} fullWidth={fullWidth}>
            {label && (
                <InputLabel htmlFor={rest.name}>
                    {label}
                    {rest.required && <span style={{ color: 'red' }}> *</span>}
                </InputLabel>
            )}
            <InputWrapper>
                {icon && <IconContainer>{icon}</IconContainer>}
                <StyledInput {...styleProps} {...rest} />
                {endIcon && <EndIconContainer>{endIcon}</EndIconContainer>}
            </InputWrapper>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputContainer>
    );
}
