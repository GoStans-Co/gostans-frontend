# Test Suite Documentation

## Overview

This directory contains the test setup and configuration for the Go Stans application.

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (development)
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

- `setup.ts` - Global test configuration and setup
- Unit tests are located alongside their source files in `__tests__` directories

## Writing Tests

Tests are written using Vitest, which has a Jest-compatible API. Example:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myModule';

describe('myFunction', () => {
    it('should do something', () => {
        const result = myFunction('input');
        expect(result).toBe('expected output');
    });
});
```

## Coverage

Coverage reports are generated in the `coverage` directory when running `npm run test:coverage`.

## Best Practices

1. Write tests for all pure functions
2. Mock external dependencies
3. Test edge cases and error conditions
4. Keep tests focused and readable
5. Use descriptive test names

## Current Test Files

### Cart Item Handling Tests

Location: `src/utils/general/__tests__/cartItemHandling.test.ts`

Comprehensive tests for cart data transformation and validation utilities:
- `createCartItemFromBooking()` - 10 test cases
- `formatImageUrl()` - 11 test cases  
- `cleanCartData()` - 14 test cases
- `mapApiToCartItem()` - 12 test cases
- `mapCartItemResponseToCartItem()` - 14 test cases
- Integration scenarios - 2 test cases

**Total: 63 test cases** covering:
- Happy path scenarios
- Edge cases (null, undefined, empty values)
- Data validation and sanitization
- URL formatting and transformation
- Duplicate removal
- Type conversions
- Integration workflows