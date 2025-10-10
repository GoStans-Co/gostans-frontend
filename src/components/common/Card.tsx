import styled, { css } from 'styled-components';
import { CardProps } from '@/types/index';

const StyledCard = styled.div.withConfig({
    shouldForwardProp: (prop) => !['variant', 'padding'].includes(prop),
})<Omit<CardProps, 'children'>>`
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow: hidden;

    ${({ padding }) =>
        padding &&
        css`
            padding: ${({ theme }) => theme.spacing.lg};
        `}

    ${({ variant, theme }) => {
        switch (variant) {
            case 'outlined':
                return css`
                    border: 1px solid ${theme.colors.border};
                `;
            case 'elevated':
                return css`
                    box-shadow: ${theme.shadows.md};
                `;
            case 'default':
            default:
                return css`
                    background-color: ${theme.colors.background};
                `;
        }
    }}
`;

export default function Card({ children, variant = 'default', padding = true, ...rest }: CardProps) {
    return (
        <StyledCard variant={variant} padding={padding} {...rest}>
            {children}
        </StyledCard>
    );
}
