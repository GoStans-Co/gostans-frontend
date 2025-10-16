# Testing Documentation

## Overview

This project uses **Vitest** as the testing framework along with **React Testing Library** for component testing. The testing setup provides comprehensive coverage for utility functions, React hooks, and UI components.

## Technology Stack

- **Vitest**: Fast unit test framework powered by Vite
- **React Testing Library**: Testing utilities for React components
- **@testing-library/user-event**: User interaction simulation
- **happy-dom**: Lightweight DOM implementation for testing
- **@testing-library/jest-dom**: Custom matchers for assertions

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (default)
npm test

# Run tests once (CI mode)
npm test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Advanced Options

```bash
# Run specific test file
npm test -- Button.test.tsx

# Run tests matching a pattern
npm test -- --grep "should render"

# Run tests with verbose output
npm test -- --reporter=verbose
```

## Test Coverage

The test suite covers:

1. **Utility Functions** (`cartItemHandling.ts`): 60+ tests
2. **React Hooks** (`useCartService.ts`): 25+ tests
3. **UI Components** (Button, Input) - 100+ tests

## Writing Tests

Follow the Arrange-Act-Assert (AAA) pattern:

```typescript
describe('Component Name', () => {
    it('should do something specific', () => {
        // Arrange
        const props = { value: 'test' };
        
        // Act
        render(<Component {...props} />);
        
        // Assert
        expect(screen.getByText('test')).toBeInTheDocument();
    });
});
```

## Best Practices

1. Test behavior, not implementation
2. Use semantic queries (getByRole, getByLabelText)
3. Test accessibility
4. Keep tests isolated
5. Test edge cases
6. Use descriptive test names

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)