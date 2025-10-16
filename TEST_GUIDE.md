# Testing Guide

## Overview

This project uses **Vitest** as the testing framework with **React Testing Library** for component testing. The test suite covers utility functions, React hooks, and UI components with comprehensive test cases for happy paths, edge cases, error handling, and user interactions.

## Test Infrastructure

### Configuration Files

- **`vitest.config.ts`**: Main Vitest configuration
- **`src/test/setup.ts`**: Global test setup and mocks
- **`package.json`**: Test scripts and dependencies

### Test Scripts

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### 1. Utility Functions Tests
**Location**: `src/utils/general/__tests__/cartItemHandling.test.ts`

Tests pure utility functions for cart item handling:
- `createCartItemFromBooking()` - Converting booking data to cart items
- `formatImageUrl()` - Image URL formatting and validation
- `cleanCartData()` - Data validation and deduplication
- `mapApiToCartItem()` - API response mapping
- `mapCartItemResponseToCartItem()` - Cart response mapping

**Coverage**: 50+ test cases covering:
- Valid data transformations
- Invalid input handling
- Edge cases (empty strings, null values, special characters)
- URL formatting (absolute, relative, missing)
- Duplicate removal
- Data validation

### 2. React Hook Tests
**Location**: `src/services/api/cart/__tests__/useCartService.test.ts`

Tests the `useCartService` custom hook:
- `getCartList()` - Fetch cart from server
- `addToCart()` - Add items (authenticated/guest)
- `removeFromCart()` - Remove items
- `addToLocalCart()` - Local storage management
- `syncCartOnLogin()` - Server synchronization
- `clearCartOnLogout()` - Cleanup on logout
- `removeDuplicates()` - Deduplication

**Coverage**: 30+ test cases covering:
- Authenticated vs guest user flows
- Server API integration
- Local state management
- Error handling
- Race condition prevention
- Sync cooldown mechanisms

### 3. Component Tests

#### Button Component
**Location**: `src/components/common/__tests__/Button.test.tsx`

Tests the Button UI component:
- All variants: primary, secondary, outline, text, light, circle, gradient
- All sizes: mini, xs, sm, md, lg
- Props: fullWidth, disabled, type
- Icons: startIcon, endIcon, startText
- User interactions: click, keyboard navigation
- Accessibility: ARIA attributes, roles

**Coverage**: 40+ test cases

#### Input Component
**Location**: `src/components/common/__tests__/Input.test.tsx`

Tests the Input UI component:
- Basic rendering and controlled/uncontrolled inputs
- Label and required field indicators
- Icons (start and end)
- Error messages
- Sizes: sm, md, lg
- Variants: default, outlined, filled
- User interactions: typing, focus, blur, paste
- Disabled state
- Input types: text, password, email, number, tel, url, date
- HTML attributes: maxLength, pattern, autoComplete
- Accessibility: ARIA attributes, keyboard navigation

**Coverage**: 60+ test cases

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ComponentName', () => {
    describe('Feature Set', () => {
        it('should do something specific', () => {
            // Arrange
            render(<Component />);
            
            // Act
            const element = screen.getByText('Expected Text');
            
            // Assert
            expect(element).toBeInTheDocument();
        });
    });
});
```

### Testing Hooks

```typescript
import { renderHook, waitFor, act } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
);

describe('useCustomHook', () => {
    it('should handle state changes', async () => {
        const { result } = renderHook(() => useCustomHook(), { wrapper });
        
        await act(async () => {
            result.current.updateValue('new value');
        });
        
        await waitFor(() => {
            expect(result.current.value).toBe('new value');
        });
    });
});
```

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
});
```

### Testing with Theme Provider

```typescript
import { ThemeProvider } from 'styled-components';

const mockTheme = {
    colors: { primary: '#007bff' },
    fontSizes: { md: '1rem' },
    // ... other theme properties
};

const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

it('should render with theme', () => {
    renderWithTheme(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
});
```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use clear, descriptive test names
- Follow the Arrange-Act-Assert pattern
- One assertion per test (when possible)

### 2. Test Coverage Goals
- ✅ Happy paths (normal use cases)
- ✅ Edge cases (boundary conditions)
- ✅ Error handling (invalid inputs)
- ✅ User interactions (clicks, typing, navigation)
- ✅ Accessibility (ARIA, keyboard navigation)
- ✅ State management (React state, Recoil atoms)

### 3. Mocking
- Mock external dependencies (API calls, localStorage)
- Use `vi.fn()` for function mocks
- Use `vi.mock()` for module mocks
- Reset mocks between tests with `vi.clearAllMocks()`

### 4. Async Testing
- Use `async/await` for asynchronous operations
- Use `waitFor()` for state changes
- Use `act()` for React state updates
- Use `findBy` queries for elements that appear asynchronously

### 5. Accessibility
- Test with screen reader compatible queries (`getByRole`, `getByLabelText`)
- Verify ARIA attributes
- Test keyboard navigation
- Ensure proper focus management

## Common Testing Patterns

### Testing Forms

```typescript
it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e) => e.preventDefault());
    
    render(
        <form onSubmit={handleSubmit}>
            <Input name="email" />
            <button type="submit">Submit</button>
        </form>
    );
    
    await user.type(screen.getByRole('textbox'), 'test@example.com');
    await user.click(screen.getByText('Submit'));
    
    expect(handleSubmit).toHaveBeenCalled();
});
```

### Testing API Calls

```typescript
it('should fetch data from API', async () => {
    const mockExecute = vi.fn().mockResolvedValue({
        data: { items: [] },
        statusCode: 200,
    });
    
    vi.spyOn(useTypedFetchModule, 'useTypedFetch').mockReturnValue({
        execute: mockExecute,
        data: null,
        loading: false,
        error: null,
        reset: vi.fn(),
    });
    
    const { result } = renderHook(() => useService());
    
    await act(async () => {
        await result.current.getData();
    });
    
    expect(mockExecute).toHaveBeenCalledWith({
        url: '/api/data',
        method: 'GET',
    });
});
```

### Testing Error States

```typescript
it('should display error message on failure', async () => {
    render(<Component />);
    
    // Trigger error
    await userEvent.click(screen.getByText('Submit'));
    
    expect(await screen.findByText('Error occurred')).toBeInTheDocument();
});
```

## Test Coverage Summary

| Module | Test Files | Test Cases | Coverage Areas |
|--------|-----------|------------|----------------|
| Utilities | 1 | 50+ | Data transformation, validation, mapping |
| Hooks | 1 | 30+ | State management, API integration, auth |
| Components | 2 | 100+ | UI rendering, interactions, accessibility |
| **Total** | **4** | **180+** | **Comprehensive coverage** |

## Running Specific Tests

```bash
# Run tests for a specific file
npm test -- cartItemHandling.test.ts

# Run tests matching a pattern
npm test -- --grep "Button"

# Run tests in a specific directory
npm test -- src/components

# Run tests with specific reporter
npm test -- --reporter=verbose
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Check path aliases in `vitest.config.ts`
   - Ensure imports match actual file locations

2. **"TypeError: Cannot read property" in tests**
   - Verify all mocks are properly set up in `beforeEach`
   - Check that dependencies are mocked before use

3. **Tests timing out**
   - Increase timeout: `vi.setConfig({ testTimeout: 10000 })`
   - Check for missing `await` on async operations

4. **Flaky tests**
   - Use `waitFor` instead of fixed timeouts
   - Ensure proper cleanup in `afterEach`
   - Reset mocks between tests

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User Event API](https://testing-library.com/docs/user-event/intro)

## Contributing

When adding new features:
1. Write tests before implementation (TDD)
2. Maintain minimum 80% code coverage
3. Include tests for edge cases and error handling
4. Update this guide if new patterns are introduced
5. Run full test suite before submitting PR

---

**Last Updated**: 2024
**Maintainer**: Development Team