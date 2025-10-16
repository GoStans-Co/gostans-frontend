# Quick Testing Guide

## Installation

```bash
pnpm install
```

## Running Tests

### Development (Watch Mode)
```bash
pnpm test
```
Tests will re-run automatically when you change files.

### Single Run (CI/CD)
```bash
pnpm test:run
```
Runs all tests once and exits.

### With Coverage Report
```bash
pnpm test:coverage
```
Generates a detailed coverage report in the `coverage/` directory.

### Interactive UI
```bash
pnpm test:ui
```
Opens an interactive test UI in your browser.

## Test Files

- `src/utils/general/cartItemHandling.test.ts` - Tests for cart utility functions
- `src/services/api/cart/types.test.ts` - Tests for type definitions

## What's Tested

### ✅ Utility Functions (cartItemHandling.ts)
- `createCartItemFromBooking()` - Converting booking objects to cart items
- `formatImageUrl()` - Image URL formatting and validation
- `cleanCartData()` - Cart data validation and deduplication
- `mapApiToCartItem()` - API response mapping
- `mapCartItemResponseToCartItem()` - Cart response mapping

### ✅ Type Schemas (types.ts)
- CartItem structure validation
- Payment type validation
- API contract validation
- Type consistency checks

## Test Output

When you run tests, you'll see:
- ✓ Passed tests in green
- ✗ Failed tests in red
- Test execution time
- Coverage percentage (with --coverage flag)

## Troubleshooting

### Tests Won't Run
1. Make sure dependencies are installed: `pnpm install`
2. Check Node.js version (should be 18+)
3. Verify TypeScript is working: `pnpm tsc --noEmit`

### Tests Failing
1. Read the error message carefully
2. Check if the function behavior changed
3. Update tests if business logic changed
4. Ensure test data matches expected types

## Writing New Tests

Follow this pattern:

```typescript
describe('MyFunction', () => {
    it('should do something specific', () => {
        // Arrange
        const input = { /* test data */ };
        
        // Act
        const result = myFunction(input);
        
        // Assert
        expect(result).toEqual(expectedOutput);
    });
});
```

## Best Practices

1. Keep tests focused on one behavior
2. Use descriptive test names
3. Test happy paths and edge cases
4. Don't test implementation details
5. Make tests independent of each other

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Tests
  run: pnpm test:run

- name: Generate Coverage
  run: pnpm test:coverage
```