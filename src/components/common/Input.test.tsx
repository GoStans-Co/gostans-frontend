import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Input from './Input';
import userEvent from '@testing-library/user-event';

describe('Input Component', () => {
    describe('rendering', () => {
        it('should render input element', () => {
            render(<Input />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should render with placeholder', () => {
            render(<Input placeholder="Enter text..." />);
            expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
        });

        it('should render with default value', () => {
            render(<Input defaultValue="Default text" />);
            expect(screen.getByRole('textbox')).toHaveValue('Default text');
        });

        it('should render with controlled value', () => {
            render(<Input value="Controlled value" onChange={() => {}} />);
            expect(screen.getByRole('textbox')).toHaveValue('Controlled value');
        });
    });

    describe('label', () => {
        it('should render with label', () => {
            render(<Input label="Username" name="username" />);
            expect(screen.getByLabelText('Username')).toBeInTheDocument();
        });

        it('should show required indicator when required', () => {
            render(<Input label="Email" required />);
            expect(screen.getByText('Email')).toBeInTheDocument();
            expect(screen.getByText('*')).toBeInTheDocument();
        });

        it('should link label to input via htmlFor', () => {
            render(<Input label="Password" name="password" />);
            const label = screen.getByText('Password');
            const input = screen.getByLabelText('Password');
            expect(label).toHaveAttribute('for', 'password');
            expect(input).toHaveAttribute('name', 'password');
        });
    });

    describe('variants', () => {
        it('should render default variant', () => {
            render(<Input inputConfig={{ variant: 'default' }} />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should render outlined variant', () => {
            render(<Input inputConfig={{ variant: 'outlined' }} />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should render filled variant', () => {
            render(<Input inputConfig={{ variant: 'filled' }} />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });

    describe('sizes', () => {
        it('should render small size', () => {
            render(<Input inputConfig={{ size: 'sm' }} />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should render medium size (default)', () => {
            render(<Input inputConfig={{ size: 'md' }} />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should render large size', () => {
            render(<Input inputConfig={{ size: 'lg' }} />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });

    describe('icons', () => {
        it('should render with start icon', () => {
            const icon = <span data-testid="start-icon">🔍</span>;
            render(<Input icon={icon} />);
            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
        });

        it('should render with end icon', () => {
            const icon = <span data-testid="end-icon">👁️</span>;
            render(<Input endIcon={icon} />);
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
        });

        it('should render with both icons', () => {
            const startIcon = <span data-testid="start-icon">🔍</span>;
            const endIcon = <span data-testid="end-icon">👁️</span>;
            render(<Input icon={startIcon} endIcon={endIcon} />);
            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
        });
    });

    describe('error handling', () => {
        it('should display error message', () => {
            render(<Input error="This field is required" />);
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });

        it('should apply error styling when error exists', () => {
            render(<Input error="Invalid input" />);
            expect(screen.getByText('Invalid input')).toBeInTheDocument();
        });

        it('should not display error message when no error', () => {
            render(<Input />);
            expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
        });
    });

    describe('disabled state', () => {
        it('should render disabled input', () => {
            render(<Input disabled />);
            expect(screen.getByRole('textbox')).toBeDisabled();
        });

        it('should not accept input when disabled', async () => {
            const user = userEvent.setup();
            render(<Input disabled />);
            const input = screen.getByRole('textbox');
            
            await user.type(input, 'test');
            expect(input).toHaveValue('');
        });
    });

    describe('input types', () => {
        it('should render as email type', () => {
            render(<Input type="email" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
        });

        it('should render as password type', () => {
            render(<Input type="password" />);
            const input = screen.getByLabelText('', { selector: 'input' }) || document.querySelector('input[type="password"]');
            expect(input).toHaveAttribute('type', 'password');
        });

        it('should render as number type', () => {
            render(<Input type="number" />);
            const input = document.querySelector('input[type="number"]');
            expect(input).toHaveAttribute('type', 'number');
        });

        it('should render as tel type', () => {
            render(<Input type="tel" />);
            const input = document.querySelector('input[type="tel"]');
            expect(input).toHaveAttribute('type', 'tel');
        });

        it('should render as date type', () => {
            render(<Input type="date" />);
            const input = document.querySelector('input[type="date"]');
            expect(input).toHaveAttribute('type', 'date');
        });
    });

    describe('user interactions', () => {
        it('should call onChange when value changes', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<Input onChange={handleChange} />);
            
            const input = screen.getByRole('textbox');
            await user.type(input, 'test');
            
            expect(handleChange).toHaveBeenCalled();
        });

        it('should call onFocus when input is focused', async () => {
            const user = userEvent.setup();
            const handleFocus = vi.fn();
            render(<Input onFocus={handleFocus} />);
            
            const input = screen.getByRole('textbox');
            await user.click(input);
            
            expect(handleFocus).toHaveBeenCalledTimes(1);
        });

        it('should call onBlur when input loses focus', async () => {
            const user = userEvent.setup();
            const handleBlur = vi.fn();
            render(<Input onBlur={handleBlur} />);
            
            const input = screen.getByRole('textbox');
            await user.click(input);
            await user.tab();
            
            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it('should update value on user input', async () => {
            const user = userEvent.setup();
            render(<Input />);
            
            const input = screen.getByRole('textbox');
            await user.type(input, 'Hello World');
            
            expect(input).toHaveValue('Hello World');
        });
    });

    describe('accessibility', () => {
        it('should be focusable', () => {
            render(<Input />);
            const input = screen.getByRole('textbox');
            input.focus();
            expect(input).toHaveFocus();
        });

        it('should not be focusable when disabled', () => {
            render(<Input disabled />);
            const input = screen.getByRole('textbox');
            input.focus();
            expect(input).not.toHaveFocus();
        });

        it('should support aria-label', () => {
            render(<Input aria-label="Search input" />);
            expect(screen.getByLabelText('Search input')).toBeInTheDocument();
        });

        it('should support aria-describedby with error', () => {
            render(<Input error="Error message" aria-describedby="error-id" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'error-id');
        });
    });

    describe('configuration options', () => {
        it('should apply fullWidth configuration', () => {
            render(<Input inputConfig={{ fullWidth: true }} />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should apply noBorder configuration', () => {
            render(<Input inputConfig={{ noBorder: true }} />);
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('should combine multiple config options', () => {
            render(
                <Input
                    inputConfig={{
                        size: 'lg',
                        variant: 'outlined',
                        fullWidth: true,
                    }}
                />
            );
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });

    describe('custom attributes', () => {
        it('should accept name attribute', () => {
            render(<Input name="username" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
        });

        it('should accept id attribute', () => {
            render(<Input id="email-input" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email-input');
        });

        it('should accept maxLength', () => {
            render(<Input maxLength={10} />);
            expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
        });

        it('should accept pattern', () => {
            render(<Input pattern="[0-9]*" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('pattern', '[0-9]*');
        });

        it('should accept autoComplete', () => {
            render(<Input autoComplete="email" />);
            expect(screen.getByRole('textbox')).toHaveAttribute('autoComplete', 'email');
        });
    });

    describe('edge cases', () => {
        it('should handle very long values', async () => {
            const user = userEvent.setup();
            const longText = 'a'.repeat(1000);
            render(<Input />);
            
            const input = screen.getByRole('textbox');
            await user.type(input, longText);
            
            expect(input).toHaveValue(longText);
        });

        it('should handle special characters', async () => {
            const user = userEvent.setup();
            const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            render(<Input />);
            
            const input = screen.getByRole('textbox');
            await user.type(input, specialChars);
            
            expect(input).toHaveValue(specialChars);
        });

        it('should handle rapid input changes', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            render(<Input onChange={handleChange} />);
            
            const input = screen.getByRole('textbox');
            await user.type(input, 'rapid');
            
            expect(handleChange).toHaveBeenCalledTimes(5); // One for each character
        });
    });
});