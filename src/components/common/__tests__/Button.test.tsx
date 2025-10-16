import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import Button from '../Button';

// Mock theme object
const mockTheme = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
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
    },
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    responsive: {
        maxMobile: '@media (max-width: 768px)',
    },
};

const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe('Button Component', () => {
    describe('Rendering', () => {
        it('should render button with children', () => {
            renderWithTheme(<Button>Click Me</Button>);
            expect(screen.getByText('Click Me')).toBeInTheDocument();
        });

        it('should render with default variant (primary)', () => {
            renderWithTheme(<Button>Primary Button</Button>);
            const button = screen.getByText('Primary Button');
            expect(button).toBeInTheDocument();
        });

        it('should render with secondary variant', () => {
            renderWithTheme(<Button variant="secondary">Secondary Button</Button>);
            const button = screen.getByText('Secondary Button');
            expect(button).toBeInTheDocument();
        });

        it('should render with outline variant', () => {
            renderWithTheme(<Button variant="outline">Outline Button</Button>);
            const button = screen.getByText('Outline Button');
            expect(button).toBeInTheDocument();
        });

        it('should render with text variant', () => {
            renderWithTheme(<Button variant="text">Text Button</Button>);
            const button = screen.getByText('Text Button');
            expect(button).toBeInTheDocument();
        });

        it('should render with light variant', () => {
            renderWithTheme(<Button variant="light">Light Button</Button>);
            const button = screen.getByText('Light Button');
            expect(button).toBeInTheDocument();
        });

        it('should render with circle variant', () => {
            renderWithTheme(<Button variant="circle">O</Button>);
            const button = screen.getByText('O');
            expect(button).toBeInTheDocument();
        });

        it('should render with gradient variant', () => {
            renderWithTheme(<Button variant="gradient">Gradient Button</Button>);
            const button = screen.getByText('Gradient Button');
            expect(button).toBeInTheDocument();
        });
    });

    describe('Sizes', () => {
        it('should render with mini size', () => {
            renderWithTheme(<Button size="mini">Mini</Button>);
            expect(screen.getByText('Mini')).toBeInTheDocument();
        });

        it('should render with xs size', () => {
            renderWithTheme(<Button size="xs">Extra Small</Button>);
            expect(screen.getByText('Extra Small')).toBeInTheDocument();
        });

        it('should render with sm size', () => {
            renderWithTheme(<Button size="sm">Small</Button>);
            expect(screen.getByText('Small')).toBeInTheDocument();
        });

        it('should render with md size (default)', () => {
            renderWithTheme(<Button size="md">Medium</Button>);
            expect(screen.getByText('Medium')).toBeInTheDocument();
        });

        it('should render with lg size', () => {
            renderWithTheme(<Button size="lg">Large</Button>);
            expect(screen.getByText('Large')).toBeInTheDocument();
        });
    });

    describe('Props', () => {
        it('should render full width button', () => {
            renderWithTheme(<Button fullWidth>Full Width</Button>);
            const button = screen.getByText('Full Width');
            expect(button).toBeInTheDocument();
        });

        it('should render disabled button', () => {
            renderWithTheme(<Button disabled>Disabled</Button>);
            const button = screen.getByText('Disabled');
            expect(button).toBeDisabled();
        });

        it('should render with submit type', () => {
            renderWithTheme(<Button type="submit">Submit</Button>);
            const button = screen.getByText('Submit');
            expect(button).toHaveAttribute('type', 'submit');
        });

        it('should render with reset type', () => {
            renderWithTheme(<Button type="reset">Reset</Button>);
            const button = screen.getByText('Reset');
            expect(button).toHaveAttribute('type', 'reset');
        });

        it('should render with custom style', () => {
            renderWithTheme(<Button style={{ margin: '10px' }}>Styled</Button>);
            const button = screen.getByText('Styled');
            expect(button).toHaveStyle({ margin: '10px' });
        });
    });

    describe('Icons', () => {
        it('should render with start icon', () => {
            const startIcon = <span data-testid="start-icon">→</span>;
            renderWithTheme(<Button startIcon={startIcon}>With Icon</Button>);
            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
            expect(screen.getByText('With Icon')).toBeInTheDocument();
        });

        it('should render with end icon', () => {
            const endIcon = <span data-testid="end-icon">←</span>;
            renderWithTheme(<Button endIcon={endIcon}>With Icon</Button>);
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
            expect(screen.getByText('With Icon')).toBeInTheDocument();
        });

        it('should render with start text', () => {
            renderWithTheme(<Button startText="Start">Button</Button>);
            expect(screen.getByText('Start')).toBeInTheDocument();
            expect(screen.getByText('Button')).toBeInTheDocument();
        });

        it('should render with both start icon and text', () => {
            const startIcon = <span data-testid="icon">*</span>;
            renderWithTheme(
                <Button startIcon={startIcon} startText="Label">
                    Button
                </Button>
            );
            expect(screen.getByTestId('icon')).toBeInTheDocument();
            expect(screen.getByText('Label')).toBeInTheDocument();
            expect(screen.getByText('Button')).toBeInTheDocument();
        });

        it('should render with start and end icons', () => {
            const startIcon = <span data-testid="start">→</span>;
            const endIcon = <span data-testid="end">←</span>;
            renderWithTheme(
                <Button startIcon={startIcon} endIcon={endIcon}>
                    Complete
                </Button>
            );
            expect(screen.getByTestId('start')).toBeInTheDocument();
            expect(screen.getByTestId('end')).toBeInTheDocument();
            expect(screen.getByText('Complete')).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('should call onClick when clicked', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            renderWithTheme(<Button onClick={handleClick}>Click Me</Button>);
            
            const button = screen.getByText('Click Me');
            await user.click(button);
            
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should not call onClick when disabled', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            renderWithTheme(
                <Button onClick={handleClick} disabled>
                    Disabled
                </Button>
            );
            
            const button = screen.getByText('Disabled');
            await user.click(button);
            
            expect(handleClick).not.toHaveBeenCalled();
        });

        it('should handle multiple clicks', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            renderWithTheme(<Button onClick={handleClick}>Multi Click</Button>);
            
            const button = screen.getByText('Multi Click');
            await user.click(button);
            await user.click(button);
            await user.click(button);
            
            expect(handleClick).toHaveBeenCalledTimes(3);
        });
    });

    describe('Accessibility', () => {
        it('should have button role', () => {
            renderWithTheme(<Button>Accessible</Button>);
            const button = screen.getByRole('button', { name: 'Accessible' });
            expect(button).toBeInTheDocument();
        });

        it('should be keyboard accessible', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            renderWithTheme(<Button onClick={handleClick}>Keyboard</Button>);
            
            const button = screen.getByText('Keyboard');
            button.focus();
            await user.keyboard('{Enter}');
            
            expect(handleClick).toHaveBeenCalled();
        });

        it('should not be keyboard accessible when disabled', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            renderWithTheme(
                <Button onClick={handleClick} disabled>
                    Disabled Keyboard
                </Button>
            );
            
            const button = screen.getByText('Disabled Keyboard');
            button.focus();
            await user.keyboard('{Enter}');
            
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        it('should render with empty children', () => {
            renderWithTheme(<Button>{''}</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        it('should render with complex children', () => {
            renderWithTheme(
                <Button>
                    <span>Complex</span>
                    <strong>Children</strong>
                </Button>
            );
            expect(screen.getByText('Complex')).toBeInTheDocument();
            expect(screen.getByText('Children')).toBeInTheDocument();
        });

        it('should handle all variant and size combinations', () => {
            const variants: Array<'primary' | 'secondary' | 'outline' | 'text' | 'light' | 'circle' | 'gradient'> = [
                'primary',
                'secondary',
                'outline',
                'text',
                'light',
                'circle',
                'gradient',
            ];
            const sizes: Array<'mini' | 'xs' | 'sm' | 'md' | 'lg'> = ['mini', 'xs', 'sm', 'md', 'lg'];

            variants.forEach((variant) => {
                sizes.forEach((size) => {
                    const { unmount } = renderWithTheme(
                        <Button variant={variant} size={size}>
                            {variant}-{size}
                        </Button>
                    );
                    expect(screen.getByText(`${variant}-${size}`)).toBeInTheDocument();
                    unmount();
                });
            });
        });

        it('should handle onClick with undefined', () => {
            renderWithTheme(<Button onClick={undefined}>No Handler</Button>);
            const button = screen.getByText('No Handler');
            expect(button).toBeInTheDocument();
        });

        it('should pass through additional props', () => {
            renderWithTheme(
                <Button data-testid="custom-button" aria-label="Custom Label">
                    Custom Props
                </Button>
            );
            const button = screen.getByTestId('custom-button');
            expect(button).toHaveAttribute('aria-label', 'Custom Label');
        });
    });

    describe('Combinations', () => {
        it('should render disabled button with full width', () => {
            renderWithTheme(
                <Button disabled fullWidth>
                    Disabled Full Width
                </Button>
            );
            const button = screen.getByText('Disabled Full Width');
            expect(button).toBeDisabled();
        });

        it('should render secondary large button with icons', () => {
            const startIcon = <span data-testid="start">→</span>;
            const endIcon = <span data-testid="end">←</span>;
            renderWithTheme(
                <Button variant="secondary" size="lg" startIcon={startIcon} endIcon={endIcon}>
                    Complete Button
                </Button>
            );
            expect(screen.getByTestId('start')).toBeInTheDocument();
            expect(screen.getByTestId('end')).toBeInTheDocument();
            expect(screen.getByText('Complete Button')).toBeInTheDocument();
        });

        it('should handle submit button that is disabled', () => {
            renderWithTheme(
                <Button type="submit" disabled>
                    Submit Disabled
                </Button>
            );
            const button = screen.getByText('Submit Disabled');
            expect(button).toHaveAttribute('type', 'submit');
            expect(button).toBeDisabled();
        });
    });
});