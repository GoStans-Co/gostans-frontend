import styled, { css } from 'styled-components';
import { ButtonProps } from '@/types/index';

const StyledButton = styled.button<Omit<ButtonProps, 'children'>>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: all ${({ theme }) => theme.transitions.default};

    ${({ fullWidth }) =>
        fullWidth &&
        css`
            width: 100%;
        `}

    ${({ disabled }) =>
        disabled &&
        css`
            opacity: 0.6;
            cursor: not-allowed;
        `}
  
    ${({ size }) => {
        switch (size) {
            case 'mini':
                return css`
                    padding: 0.3rem 0.7rem;
                    font-size: ${({ theme }) => theme.fontSizes.xs};
                    height: auto;
                    min-height: 24px;
                `;
            case 'xs':
                return css`
                    padding: 0.7rem;
                    font-size: ${({ theme }) => theme.fontSizes.sm};
                    height: auto;
                `;
            case 'sm':
                return css`
                    padding: 0.5rem 1rem;
                    font-size: ${({ theme }) => theme.fontSizes.sm};
                `;
            case 'lg':
                return css`
                    padding: 0.75rem 1.5rem;
                    font-size: ${({ theme }) => theme.fontSizes.lg};
                `;
            case 'md':
            default:
                return css`
                    padding: 0.625rem 1.25rem;
                    font-size: ${({ theme }) => theme.fontSizes.md};
                `;
        }
    }}
  
  ${({ variant, theme }) => {
        switch (variant) {
            case 'secondary':
                return css`
                    background-color: ${theme.colors.secondary};
                    color: white;

                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.primary};
                    }
                `;
            case 'outline':
                return css`
                    background-color: transparent;
                    color: ${theme.colors.primary};
                    border: 1px solid ${theme.colors.primary};

                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.primary};
                        color: white;
                    }
                `;
            case 'text':
                return css`
                    background-color: transparent;
                    color: ${theme.colors.primary};
                    padding-left: 0;
                    padding-right: 0;

                    &:hover:not(:disabled) {
                        color: ${theme.colors.secondary};
                        text-decoration: underline;
                    }
                `;
            case 'light':
                return css`
                    background-color: transparent;
                    border: 1px solid ${theme.colors.border};
                    color: ${theme.colors.text};

                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.lightBackground};
                    }
                `;
            case 'primary':
                return css`
                    background-color: ${theme.colors.primary};
                    color: white;

                    &:hover:not(:disabled) {
                        background-color: ${theme.colors.secondary};
                    }
                `;
        }
    }}
`;

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    onClick,
    disabled = false,
    type = 'button',
    ...rest
}: ButtonProps) {
    return (
        <StyledButton
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            onClick={onClick}
            disabled={disabled}
            type={type}
            {...rest}
        >
            {children}
        </StyledButton>
    );
}
