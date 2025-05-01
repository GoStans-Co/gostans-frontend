import styled from 'styled-components';
import { SelectProps } from '@/types/index';

const SelectContainer = styled.div`
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SelectLabel = styled.label`
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme, hasError }) => (hasError ? 'red' : theme.colors.border)};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    transition: all ${({ theme }) => theme.transitions.default};
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1em;

    &:focus {
        outline: none;
        border-color: ${({ theme, hasError }) => (hasError ? 'red' : theme.colors.primary)};
        box-shadow: 0 0 0 2px ${({ hasError }) => (hasError ? 'rgba(255, 0, 0, 0.1)' : 'rgba(31, 101, 160, 0.1)')};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.lightBackground};
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-top: ${({ theme }) => theme.spacing.xs};
`;

export default function Select({
    options,
    value,
    onChange,
    label,
    name,
    required = false,
    disabled = false,
    placeholder,
    error,
    ...rest
}: SelectProps) {
    return (
        <SelectContainer>
            {label && (
                <SelectLabel htmlFor={name}>
                    {label}
                    {required && <span style={{ color: 'red' }}> *</span>}
                </SelectLabel>
            )}
            <StyledSelect
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                hasError={!!error}
                {...rest}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </StyledSelect>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </SelectContainer>
    );
}
