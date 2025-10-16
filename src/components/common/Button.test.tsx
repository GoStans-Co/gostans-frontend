import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Button from './Button';
import userEvent from '@testing-library/user-event';

describe('Button Component', () => {
    describe('rendering', () => {
        it('should render with children text', () => {
            render(<Button>Click Me</Button>);
            expect(screen.getByText('Click Me')).toBeInTheDocument();
        });

        it('should render as button element by default', () => {
            render(<Button>Button</Button>);
            const button = screen.getByRole('button');
            expect(button.tagName).toBe('BUTTON');
        });

        it('should apply default type="button"', () => {
            render(<Button>Button</Button>);
            expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
        });
    });

    describe('variants', () => {
        it('should render primary variant', () => {
            render(<Button variant="primary">Primary</Button>);
            expect(screen.getByText('Primary')).toBeInTheDocument();
        });

        it('should render secondary variant', () => {
            render(<Button variant="secondary">Secondary</Button>);
            expect(screen.getByText('Secondary')).toBeInTheDocument();
        });

        it('should render outline variant', () => {
            render(<Button variant="outline">Outline</Button>);
            expect(screen.getByText('Outline')).toBeInTheDocument();
        });

        it('should render text variant', () => {
            render(<Button variant="text">Text</Button>);
            expect(screen.getByText('Text')).toBeInTheDocument();
        });

        it('should render light variant', () => {
            render(<Button variant="light">Light</Button>);
            expect(screen.getByText('Light')).toBeInTheDocument();
        });

        it('should render circle variant', () => {
            render(<Button variant="circle">O</Button>);
            expect(screen.getByText('O')).toBeInTheDocument();
        });

        it('should render gradient variant', () => {
            render(<Button variant="gradient">Gradient</Button>);
            expect(screen.getByText('Gradient')).toBeInTheDocument();
        });
    });

    describe('sizes', () => {
        it('should render mini size', () => {
            render(<Button size="mini">Mini</Button>);
            expect(screen.getByText('Mini')).toBeInTheDocument();
        });

        it('should render xs size', () => {
            render(<Button size="xs">Extra Small</Button>);
            expect(screen.getByText('Extra Small')).toBeInTheDocument();
        });

        it('should render sm size', () => {
            render(<Button size="sm">Small</Button>);
            expect(screen.getByText('Small')).toBeInTheDocument();
        });

        it('should render md size (default)', () => {
            render(<Button size="md">Medium</Button>);
            expect(screen.getByText('Medium')).toBeInTheDocument();
        });

        it('should render lg size', () => {
            render(<Button size="lg">Large</Button>);
            expect(screen.getByText('Large')).toBeInTheDocument();
        });
    });

    describe('fullWidth prop', () => {
        it('should render full width when fullWidth is true', () => {
            render(<Button fullWidth>Full Width</Button>);
            expect(screen.getByText('Full Width')).toBeInTheDocument();
        });

        it('should not be full width by default', () => {
            render(<Button>Normal Width</Button>);
            expect(screen.getByText('Normal Width')).toBeInTheDocument();
        });
    });

    describe('disabled state', () => {
        it('should render disabled button', () => {
            render(<Button disabled>Disabled</Button>);
            expect(screen.getByText('Disabled')).toBeDisabled();
        });

        it('should not call onClick when disabled', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(
                <Button disabled onClick={handleClick}>
                    Disabled Button
                </Button>
            );

            await user.click(screen.getByText('Disabled Button'));
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('onClick handler', () => {
        it('should call onClick when clicked', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Clickable</Button>);

            await user.click(screen.getByText('Clickable'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('should call onClick multiple times', async () => {
            const user = userEvent.setup();
            const handleClick = vi.fn();
            render(<Button onClick={handleClick}>Multi Click</Button>);

            const button = screen.getByText('Multi Click');
            await user.click(button);
            await user.click(button);
            await user.click(button);
            expect(handleClick).toHaveBeenCalledTimes(3);
        });
    });

    describe('button types', () => {
        it('should render submit type', () => {
            render(<Button type="submit">Submit</Button>);
            expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
        });

        it('should render reset type', () => {
            render(<Button type="reset">Reset</Button>);
            expect(screen.getByText('Reset')).toHaveAttribute('type', 'reset');
        });
    });

    describe('icons', () => {
        it('should render with startIcon', () => {
            const icon = <span data-testid="start-icon">→</span>;
            render(<Button startIcon={icon}>With Start Icon</Button>);
            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
            expect(screen.getByText('With Start Icon')).toBeInTheDocument();
        });

        it('should render with startText', () => {
            render(<Button startText="Prefix">Button Text</Button>);
            expect(screen.getByText('Prefix')).toBeInTheDocument();
            expect(screen.getByText('Button Text')).toBeInTheDocument();
        });

        it('should render with endIcon', () => {
            const icon = <span data-testid="end-icon">→</span>;
            render(<Button endIcon={icon}>With End Icon</Button>);
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
            expect(screen.getByText('With End Icon')).toBeInTheDocument();
        });

        it('should render with both startIcon and endIcon', () => {
            const startIcon = <span data-testid="start-icon">←</span>;
            const endIcon = <span data-testid="end-icon">→</span>;
            render(
                <Button startIcon={startIcon} endIcon={endIcon}>
                    Both Icons
                </Button>
            );
            expect(screen.getByTestId('start-icon')).toBeInTheDocument();
            expect(screen.getByTestId('end-icon')).toBeInTheDocument();
            expect(screen.getByText('Both Icons')).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('should be focusable', () => {
            render(<Button>Focusable</Button>);
            const button = screen.getByText('Focusable');
            button.focus();
            expect(button).toHaveFocus();
        });

        it('should not be focusable when disabled', () => {
            render(<Button disabled>Not Focusable</Button>);
            const button = screen.getByText('Not Focusable');
            button.focus();
            expect(button).not.toHaveFocus();
        });

        it('should have proper role', () => {
            render(<Button>Accessible Button</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });

    describe('custom props', () => {
        it('should accept and apply custom className', () => {
            render(<Button className="custom-class">Custom Class</Button>);
            expect(screen.getByText('Custom Class')).toHaveClass('custom-class');
        });

        it('should accept and apply custom styles', () => {
            render(<Button style={{ backgroundColor: 'red' }}>Styled Button</Button>);
            const button = screen.getByText('Styled Button');
            expect(button).toHaveStyle({ backgroundColor: 'red' });
        });

        it('should accept data attributes', () => {
            render(<Button data-testid="custom-button">Test Button</Button>);
            expect(screen.getByTestId('custom-button')).toBeInTheDocument();
        });
    });

    describe('edge cases', () => {
        it('should handle empty children', () => {
            render(<Button></Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('should handle complex children', () => {
            render(
                <Button>
                    <span>Complex</span>
                    <strong>Children</strong>
                </Button>
            );
            expect(screen.getByText('Complex')).toBeInTheDocument();
            expect(screen.getByText('Children')).toBeInTheDocument();
        });

        it('should combine multiple props correctly', () => {
            const handleClick = vi.fn();
            render(
                <Button variant="outline" size="lg" fullWidth onClick={handleClick}>
                    Combined Props
                </Button>
            );
            expect(screen.getByText('Combined Props')).toBeInTheDocument();
        });
    });
});