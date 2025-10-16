import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import Input from '../Input';

// Mock theme object
const mockTheme = {
    colors: {
        primary: '#1f65a0',
        secondary: '#6c757d',
        accent: '#ff6b35',
        text: '#212529',
        border: '#dee2e6',
        lightBackground: '#f8f9fa',
    },
    fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
    },
    borderRadius: {
        md: '0.375rem',
    },
    transitions: {
        default: '0.2s ease',
    },
    spacing: {
        sm: '0.5rem',
        md: '1rem',
    },
    responsive: {
        maxMobile: '@media (max-width: 768px)',
    },
};

const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe('Input Component', () => {
    describe('Basic Rendering', () => {
        it('should render input field', () => {
            renderWithTheme(<Input placeholder="Enter text" />);
            expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
        });

        it('should render with label', () => {
            renderWithTheme(<Input label="Username" placeholder="Enter username" />);
            expect(screen.getByText('Username')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
        });

        it('should render with default value', () => {
            renderWithTheme(<Input defaultValue="John Doe" />);
            expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        });

        it('should render with controlled value', () => {
            renderWithTheme(<Input value="Controlled" onChange={() => {}} />);
            expect(screen.getByDisplayValue('Controlled')).toBeInTheDocument();
        });
    });

    describe('Label Rendering', () => {
        it('should associate label with input using htmlFor', () => {
            renderWithTheme(<Input label="Email" name="email" />);
            const label = screen.getByText('Email');
            const input = screen.getByRole('textbox');
            expect(label).toHaveAttribute('for', 'email');
        });

        it('should render required indicator when required prop is true', () => {
            renderWithTheme(<Input label="Password" required />);
            expect(screen.getByText('*')).toBeInTheDocument();
            const requiredIndicator = screen.getByText('*');
            expect(requiredIndicator).toHaveStyle({ color: 'red' });
        });

        it('should not render label when not provided', () => {
            renderWithTheme(<Input placeholder="No label" />);
            expect(screen.queryByRole('label')).not.toBeInTheDocument();
        });
    });

    describe('Icons', () => {
        it('should render with start icon', () => {
            const icon = <span data-testid="search-icon">🔍</span>;
            renderWithTheme(<Input icon={icon} placeholder="Search" />);
            expect(screen.getByTestId('search-icon')).toBeInTheDocument();
        });

        it('should render with end icon', () => {
            const endIcon = <span data-testid="clear-icon">✖</span>;
            renderWithTheme(<Input endIcon={endIcon} placeholder="Clearable" />);
            expect(screen.getByTestId('clear-icon')).toBeInTheDocument();
        });

        it('should render with both start and end icons', () => {
            const icon = <span data-testid="start-icon">📧</span>;
            const endIcon = <span data-testid="end-icon">✓</span>;
            renderWithTheme(<Input icon={icon} endIcon={endIcon} placeholder="Email" />);
            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('should render error message when error prop is provided', () => {
            renderWithTheme(<Input error="This field is required" />);
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });

        it('should not render error message when error is not provided', () => {
            renderWithTheme(<Input placeholder="No error" />);
            const errorMessages = screen.queryByRole('alert');
            expect(errorMessages).not.toBeInTheDocument();
        });

        it('should render multiple error states independently', () => {
            const { rerender } = renderWithTheme(<Input error="Error 1" />);
            expect(screen.getByText('Error 1')).toBeInTheDocument();
            
            rerender(
                <ThemeProvider theme={mockTheme}>
                    <Input error="Error 2" />
                </ThemeProvider>
            );
            expect(screen.getByText('Error 2')).toBeInTheDocument();
            expect(screen.queryByText('Error 1')).not.toBeInTheDocument();
        });
    });

    describe('Input Sizes', () => {
        it('should render with small size', () => {
            renderWithTheme(
                <Input inputConfig={{ size: 'sm' }} placeholder="Small input" />
            );
            expect(screen.getByPlaceholderText('Small input')).toBeInTheDocument();
        });

        it('should render with medium size (default)', () => {
            renderWithTheme(
                <Input inputConfig={{ size: 'md' }} placeholder="Medium input" />
            );
            expect(screen.getByPlaceholderText('Medium input')).toBeInTheDocument();
        });

        it('should render with large size', () => {
            renderWithTheme(
                <Input inputConfig={{ size: 'lg' }} placeholder="Large input" />
            );
            expect(screen.getByPlaceholderText('Large input')).toBeInTheDocument();
        });

        it('should default to medium size when size not specified', () => {
            renderWithTheme(<Input placeholder="Default size" />);
            expect(screen.getByPlaceholderText('Default size')).toBeInTheDocument();
        });
    });

    describe('Input Variants', () => {
        it('should render with default variant', () => {
            renderWithTheme(
                <Input inputConfig={{ variant: 'default' }} placeholder="Default variant" />
            );
            expect(screen.getByPlaceholderText('Default variant')).toBeInTheDocument();
        });

        it('should render with outlined variant', () => {
            renderWithTheme(
                <Input inputConfig={{ variant: 'outlined' }} placeholder="Outlined variant" />
            );
            expect(screen.getByPlaceholderText('Outlined variant')).toBeInTheDocument();
        });

        it('should render with filled variant', () => {
            renderWithTheme(
                <Input inputConfig={{ variant: 'filled' }} placeholder="Filled variant" />
            );
            expect(screen.getByPlaceholderText('Filled variant')).toBeInTheDocument();
        });

        it('should default to outlined variant when not specified', () => {
            renderWithTheme(<Input placeholder="Default outlined" />);
            expect(screen.getByPlaceholderText('Default outlined')).toBeInTheDocument();
        });
    });

    describe('Width Properties', () => {
        it('should render full width by default', () => {
            renderWithTheme(<Input placeholder="Full width" />);
            const input = screen.getByPlaceholderText('Full width');
            expect(input).toBeInTheDocument();
        });

        it('should render with custom fullWidth setting', () => {
            renderWithTheme(
                <Input inputConfig={{ fullWidth: false }} placeholder="Not full width" />
            );
            expect(screen.getByPlaceholderText('Not full width')).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should handle onChange event', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            renderWithTheme(<Input onChange={handleChange} placeholder="Type here" />);
            
            const input = screen.getByPlaceholderText('Type here');
            await user.type(input, 'Hello');
            
            expect(handleChange).toHaveBeenCalled();
            expect(input).toHaveValue('Hello');
        });

        it('should handle onFocus event', async () => {
            const user = userEvent.setup();
            const handleFocus = vi.fn();
            renderWithTheme(<Input onFocus={handleFocus} placeholder="Focus me" />);
            
            const input = screen.getByPlaceholderText('Focus me');
            await user.click(input);
            
            expect(handleFocus).toHaveBeenCalledTimes(1);
        });

        it('should handle onBlur event', async () => {
            const user = userEvent.setup();
            const handleBlur = vi.fn();
            renderWithTheme(<Input onBlur={handleBlur} placeholder="Blur me" />);
            
            const input = screen.getByPlaceholderText('Blur me');
            await user.click(input);
            await user.tab();
            
            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it('should handle keyboard input', async () => {
            const user = userEvent.setup();
            renderWithTheme(<Input placeholder="Keyboard input" />);
            
            const input = screen.getByPlaceholderText('Keyboard input');
            await user.type(input, 'Test123');
            
            expect(input).toHaveValue('Test123');
        });

        it('should handle paste event', async () => {
            const user = userEvent.setup();
            renderWithTheme(<Input placeholder="Paste here" />);
            
            const input = screen.getByPlaceholderText('Paste here') as HTMLInputElement;
            input.focus();
            await user.paste('Pasted text');
            
            expect(input).toHaveValue('Pasted text');
        });
    });

    describe('Disabled State', () => {
        it('should render disabled input', () => {
            renderWithTheme(<Input disabled placeholder="Disabled input" />);
            const input = screen.getByPlaceholderText('Disabled input');
            expect(input).toBeDisabled();
        });

        it('should not accept input when disabled', async () => {
            const user = userEvent.setup();
            const handleChange = vi.fn();
            renderWithTheme(
                <Input disabled onChange={handleChange} placeholder="Cannot type" />
            );
            
            const input = screen.getByPlaceholderText('Cannot type');
            await user.type(input, 'Test');
            
            expect(handleChange).not.toHaveBeenCalled();
            expect(input).toHaveValue('');
        });

        it('should not trigger events when disabled', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            renderWithTheme(
                <Input disabled onClick={handleClick} placeholder="No clicks" />
            );
            
            const input = screen.getByPlaceholderText('No clicks');
            await user.click(input);
            
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Input Types', () => {
        it('should render text input by default', () => {
            renderWithTheme(<Input placeholder="Text input" />);
            const input = screen.getByPlaceholderText('Text input');
            expect(input).toHaveAttribute('type', 'text');
        });

        it('should render password input', () => {
            renderWithTheme(<Input type="password" placeholder="Password" />);
            const input = screen.getByPlaceholderText('Password');
            expect(input).toHaveAttribute('type', 'password');
        });

        it('should render email input', () => {
            renderWithTheme(<Input type="email" placeholder="Email" />);
            const input = screen.getByPlaceholderText('Email');
            expect(input).toHaveAttribute('type', 'email');
        });

        it('should render number input', () => {
            renderWithTheme(<Input type="number" placeholder="Number" />);
            const input = screen.getByPlaceholderText('Number');
            expect(input).toHaveAttribute('type', 'number');
        });

        it('should render tel input', () => {
            renderWithTheme(<Input type="tel" placeholder="Phone" />);
            const input = screen.getByPlaceholderText('Phone');
            expect(input).toHaveAttribute('type', 'tel');
        });

        it('should render url input', () => {
            renderWithTheme(<Input type="url" placeholder="Website" />);
            const input = screen.getByPlaceholderText('Website');
            expect(input).toHaveAttribute('type', 'url');
        });

        it('should render date input', () => {
            renderWithTheme(<Input type="date" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('type', 'date');
        });
    });

    describe('Additional HTML Attributes', () => {
        it('should handle name attribute', () => {
            renderWithTheme(<Input name="username" placeholder="Username" />);
            const input = screen.getByPlaceholderText('Username');
            expect(input).toHaveAttribute('name', 'username');
        });

        it('should handle id attribute', () => {
            renderWithTheme(<Input id="email-input" placeholder="Email" />);
            const input = screen.getByPlaceholderText('Email');
            expect(input).toHaveAttribute('id', 'email-input');
        });

        it('should handle maxLength attribute', () => {
            renderWithTheme(<Input maxLength={10} placeholder="Max 10 chars" />);
            const input = screen.getByPlaceholderText('Max 10 chars');
            expect(input).toHaveAttribute('maxLength', '10');
        });

        it('should handle minLength attribute', () => {
            renderWithTheme(<Input minLength={5} placeholder="Min 5 chars" />);
            const input = screen.getByPlaceholderText('Min 5 chars');
            expect(input).toHaveAttribute('minLength', '5');
        });

        it('should handle pattern attribute', () => {
            renderWithTheme(<Input pattern="[0-9]*" placeholder="Numbers only" />);
            const input = screen.getByPlaceholderText('Numbers only');
            expect(input).toHaveAttribute('pattern', '[0-9]*');
        });

        it('should handle autoComplete attribute', () => {
            renderWithTheme(<Input autoComplete="email" placeholder="Email" />);
            const input = screen.getByPlaceholderText('Email');
            expect(input).toHaveAttribute('autoComplete', 'email');
        });

        it('should handle autoFocus attribute', () => {
            renderWithTheme(<Input autoFocus placeholder="Auto focused" />);
            const input = screen.getByPlaceholderText('Auto focused');
            expect(input).toHaveFocus();
        });

        it('should handle readOnly attribute', () => {
            renderWithTheme(<Input readOnly value="Read only" />);
            const input = screen.getByDisplayValue('Read only');
            expect(input).toHaveAttribute('readOnly');
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            renderWithTheme(
                <Input
                    label="Username"
                    placeholder="Enter username"
                    aria-describedby="username-help"
                />
            );
            const input = screen.getByPlaceholderText('Enter username');
            expect(input).toHaveAttribute('aria-describedby', 'username-help');
        });

        it('should be keyboard accessible', async () => {
            const user = userEvent.setup();
            renderWithTheme(<Input placeholder="Tab to me" />);
            
            await user.tab();
            const input = screen.getByPlaceholderText('Tab to me');
            expect(input).toHaveFocus();
        });

        it('should support aria-label', () => {
            renderWithTheme(<Input aria-label="Search field" placeholder="Search" />);
            const input = screen.getByLabelText('Search field');
            expect(input).toBeInTheDocument();
        });

        it('should support aria-required', () => {
            renderWithTheme(<Input required aria-required="true" placeholder="Required" />);
            const input = screen.getByPlaceholderText('Required');
            expect(input).toHaveAttribute('aria-required', 'true');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty string as value', () => {
            renderWithTheme(<Input value="" onChange={() => {}} />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveValue('');
        });

        it('should handle very long text', async () => {
            const user = userEvent.setup();
            const longText = 'a'.repeat(1000);
            renderWithTheme(<Input placeholder="Long text" />);
            
            const input = screen.getByPlaceholderText('Long text');
            await user.type(input, longText);
            
            expect(input).toHaveValue(longText);
        });

        it('should handle special characters', async () => {
            const user = userEvent.setup();
            renderWithTheme(<Input placeholder="Special chars" />);
            
            const input = screen.getByPlaceholderText('Special chars');
            await user.type(input, '!@#$%^&*()');
            
            expect(input).toHaveValue('!@#$%^&*()');
        });

        it('should handle unicode characters', async () => {
            const user = userEvent.setup();
            renderWithTheme(<Input placeholder="Unicode" />);
            
            const input = screen.getByPlaceholderText('Unicode');
            await user.type(input, '你好世界');
            
            expect(input).toHaveValue('你好世界');
        });

        it('should handle emojis', async () => {
            const user = userEvent.setup();
            renderWithTheme(<Input placeholder="Emojis" />);
            
            const input = screen.getByPlaceholderText('Emojis');
            await user.type(input, '😀🎉🚀');
            
            expect(input).toHaveValue('😀🎉🚀');
        });
    });

    describe('Complex Combinations', () => {
        it('should handle all props together', () => {
            const icon = <span data-testid="icon">🔍</span>;
            const endIcon = <span data-testid="end-icon">✖</span>;
            
            renderWithTheme(
                <Input
                    label="Search"
                    icon={icon}
                    endIcon={endIcon}
                    error="Invalid search term"
                    inputConfig={{
                        size: 'lg',
                        variant: 'outlined',
                        fullWidth: true,
                    }}
                    placeholder="Search..."
                    required
                />
            );
            
            expect(screen.getByText('Search')).toBeInTheDocument();
            expect(screen.getByTestId('icon')).toBeInTheDocument();
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
            expect(screen.getByText('Invalid search term')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
            expect(screen.getByText('*')).toBeInTheDocument();
        });

        it('should handle size and variant combinations', () => {
            const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
            const variants: Array<'default' | 'outlined' | 'filled'> = [
                'default',
                'outlined',
                'filled',
            ];
            
            sizes.forEach((size) => {
                variants.forEach((variant) => {
                    const { unmount } = renderWithTheme(
                        <Input
                            inputConfig={{ size, variant }}
                            placeholder={`${size}-${variant}`}
                        />
                    );
                    expect(screen.getByPlaceholderText(`${size}-${variant}`)).toBeInTheDocument();
                    unmount();
                });
            });
        });

        it('should handle error state with different variants', () => {
            const variants: Array<'default' | 'outlined' | 'filled'> = [
                'default',
                'outlined',
                'filled',
            ];
            
            variants.forEach((variant) => {
                const { unmount } = renderWithTheme(
                    <Input
                        inputConfig={{ variant }}
                        error={`Error in ${variant}`}
                        placeholder={variant}
                    />
                );
                expect(screen.getByText(`Error in ${variant}`)).toBeInTheDocument();
                unmount();
            });
        });
    });

    describe('Form Integration', () => {
        it('should work within a form', async () => {
            const user = userEvent.setup();
            const handleSubmit = vi.fn((e) => e.preventDefault());
            
            render(
                <ThemeProvider theme={mockTheme}>
                    <form onSubmit={handleSubmit}>
                        <Input name="username" placeholder="Username" />
                        <button type="submit">Submit</button>
                    </form>
                </ThemeProvider>
            );
            
            const input = screen.getByPlaceholderText('Username');
            await user.type(input, 'testuser');
            
            const submitButton = screen.getByText('Submit');
            await user.click(submitButton);
            
            expect(handleSubmit).toHaveBeenCalled();
        });

        it('should validate required field', async () => {
            const user = userEvent.setup();
            
            render(
                <ThemeProvider theme={mockTheme}>
                    <form>
                        <Input required placeholder="Required field" />
                    </form>
                </ThemeProvider>
            );
            
            const input = screen.getByPlaceholderText('Required field');
            expect(input).toBeRequired();
        });
    });
});