import React from 'react';
import styled from 'styled-components';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    icon?: React.ReactNode;
    noBorder?: boolean;
    error?: string;
};

const InputContainer = styled.div<{ noBorder: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0;
    border-right: ${({ noBorder, theme }) => (noBorder ? 'none' : `1px solid ${theme.colors.border}`)};
`;

const IconContainer = styled.div`
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    color: #999;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    border: none;
    font-size: ${({ theme }) => theme.fontSizes.md};
    background-color: white;
    padding-left: 40px;
    height: 56px;
`;

const InputLabel = styled.label`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
`;

const InputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export default function Input({
    type = 'text',
    placeholder,
    value,
    onChange,
    label,
    name,
    required = false,
    disabled = false,
    icon,
    error,
    noBorder = false,
    ...rest
}: InputProps) {
    return (
        <InputContainer noBorder={noBorder}>
            {label && (
                <InputLabel htmlFor={name}>
                    {label}
                    {required && <span style={{ color: 'red' }}> *</span>}
                </InputLabel>
            )}
            <InputWrapper>
                {icon && <IconContainer>{icon}</IconContainer>}
                <StyledInput
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    {...rest}
                />
            </InputWrapper>
            {error && <span style={{ color: 'red', fontSize: '0.875rem' }}>{error}</span>}
        </InputContainer>
    );
}
