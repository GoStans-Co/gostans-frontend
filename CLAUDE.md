# GoStans Frontend - LLM Coding Agent Instructions

This file provides guidance to Claude Code and other LLM coding agents when
working with the GoStans Frontend codebase.

## Project Overview

GoStans is a tour booking and travel experience platform connecting travelers
with unique local experiences. Built with React 18, TypeScript, and modern
tooling for optimal performance and user experience.

Main features:

- Tour browsing with advanced search and filtering
- Interactive Mapbox-powered location maps
- Multi-vendor payments (Stripe + PayPal)
- OAuth2 authentication with JWT tokens
- Shopping cart and wishlist management
- Responsive design for all devices

## Development Environment

- **Package Manager**: pnpm (required)
- **Node Version**: 18.x or higher
- **Editor**: VS Code with ESLint, TypeScript, Styled Components extensions
- **Setup**: `pnpm install` → configure `.env` → `pnpm dev`
- **Dev Server**: http://localhost:5173

## Tech Stack

- **Build**: Vite 5 with HMR
- **Framework**: React 18 + TypeScript 5
- **Styling**: Styled Components with custom theming
- **State**: Recoil (client) + React Query (server)
- **Routing**: React Router v7 with lazy loading
- **Maps**: Mapbox GL JS
- **Payments**: Stripe Elements + PayPal SDK
- **HTTP**: Axios with interceptors
- **Animations**: Framer Motion + Lottie

## Repository Structure

The repository is organized as a single-page application with the following
structure:

- _src/atoms/_: Recoil state management atoms organized by domain
    - _authAtom.ts_: User authentication state
    - _cartAtom.ts_: Shopping cart state and items
    - _toursAtom.ts_: Tour listings and filters state
    - _wishlistAtom.ts_: User wishlist state
    - _modalAtom.ts_: Modal visibility and content state
    - _searchAtom.ts_: Search query and results state
- _src/components/_: Reusable UI components organized by feature domain
    - _auth/_: Authentication components (login, signup, OAuth flows)
    - _cart/_: Shopping cart UI (cart items, cart summary, checkout button)
    - _common/_: Shared UI elements (buttons, inputs, modals, loaders)
    - _layout/_: Layout components (header, footer, sidebar, navigation)
    - _tour/_: Tour-related components (cards, details, filters, search)
    - _payment/_: Payment form components (Stripe, PayPal integration)
- _src/pages/_: Route-level page components (all lazy loaded for performance)
    - _Home.tsx_: Landing page with featured tours
    - _TourDetails.tsx_: Individual tour detail page
    - _Checkout.tsx_: Payment and booking checkout flow
    - _Profile.tsx_: User profile and booking history
    - _Search.tsx_: Tour search results page
- _src/services/_: API service layer organized by domain
    - _api/auth.ts_: Authentication API calls (login, signup, OAuth)
    - _api/tours.ts_: Tour data fetching and filtering
    - _api/cart.ts_: Cart management operations
    - _api/booking.ts_: Booking creation and management
    - _api/user.ts_: User profile and preferences
    - _config.ts_: Axios instance configuration and interceptors
- _src/hooks/_: Custom React hooks for shared logic
    - _useAuth.ts_: Authentication state and operations
    - _useTours.ts_: Tour data fetching with React Query
    - _useCart.ts_: Cart management operations
    - _useBooking.ts_: Booking operations and history
- _src/utils/_: Utility functions and helpers
    - _payment.ts_: Payment processing utilities (Stripe, PayPal)
    - _token.ts_: JWT token management and validation
    - _validation.ts_: Form validation helpers
    - _format.ts_: Data formatting (dates, currency, text)
- _src/routes/_: Application routing configuration
    - _index.tsx_: Route definitions with lazy loading and protected routes
    - _ProtectedRoute.tsx_: HOC for authentication-required routes
- _src/context/_: React Context API providers
    - _AuthContext.tsx_: Authentication context provider
- _src/providers/_: Application-level providers
    - _QueryProvider.tsx_: React Query configuration and provider
- _src/constants/_: Static configuration and constants
    - _api.ts_: API endpoint URLs
    - _config.ts_: Application configuration values
- _src/types/_: TypeScript type definitions
    - _tour.ts_: Tour-related type definitions
    - _user.ts_: User-related type definitions
    - _api.ts_: API request/response types
    - _payment.ts_: Payment-related types
- _src/styles/_: Global styling and theme configuration
    - _GlobalStyles.ts_: Global CSS styles
    - _theme.ts_: Styled Components theme (colors, spacing, breakpoints)
- _public/_: Static assets served directly
    - _images/_: Static images and icons
    - _fonts/_: Custom font files

## Code Patterns and Principles

### State Management

**Client State (Recoil)**:

- UI state, auth, cart, wishlist in domain-specific atoms
- Use `useRecoilState` or `useRecoilValue` in components

**Server State (React Query)**:

- All API data fetching with custom hooks per domain
- Implement optimistic updates for mutations
- Cache with appropriate `staleTime` settings

### Component Organization

- Domain-based structure, not by size
- Lazy load all page-level components
- Define explicit TypeScript interfaces for props
- Co-locate styled components with React components

### API Service Layer

- All API calls through `src/services/api/` functions
- Axios interceptors for auth and error handling
- Define response types for type safety
- Consistent error handling across services

### Authentication

- OAuth2 tokens in HTTP-only cookies (never localStorage)
- Token refresh via Axios interceptors
- Protected routes with authentication HOC
- Auth state synced between Recoil and React Query

### Type Safety

- Strict TypeScript mode enabled
- Define interfaces for all data structures
- Avoid `any` - use `unknown` if type is truly unknown
- Use discriminated unions for variants

## Development Workflow

### Commands

- `pnpm dev` - Start dev server with HMR (port 5173)
- `pnpm build` - TypeScript check + production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm preview` - Preview production build
- `pnpm type-check` - TypeScript compiler check

### Before Committing

1. Run `pnpm lint` for linting errors
2. Run `pnpm type-check` for TypeScript errors
3. Test changes in browser
4. Verify responsive design on mobile

## Common Tasks

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/routes/index.tsx` with lazy loading
3. Add loading fallback with Lottie animation
4. Implement proper meta tags for SEO

### Adding API Endpoint

1. Define types in `src/types/`
2. Create service function in `src/services/api/`
3. Create React Query hook in `src/hooks/`
4. Use hook in components with loading/error states

### Adding Recoil Atom

1. Create atom in appropriate file in `src/atoms/`
2. Define TypeScript interface for state
3. Set meaningful default value
4. Use with `useRecoilState` or `useRecoilValue`

## Important Guidelines

### Security

- **Auth**: Store tokens in HTTP-only cookies, implement refresh, clear on logout
- **Payments**: Never store raw payment data, use tokenization
- **API**: Include CSRF tokens, validate inputs, sanitize before rendering
- **XSS**: Use React's built-in protection, avoid `dangerouslySetInnerHTML`

### Performance

- Use `React.lazy()` for route-level components
- Implement React Query cache strategies properly
- Use `React.memo()` to avoid unnecessary re-renders
- Lazy load images and below-the-fold components

### Styling

- Use centralized theme from `src/styles/theme.ts`
- Access theme in styled components: `${({ theme }) => theme.colors.primary}`
- Use theme breakpoints for responsive design
- Co-locate styled components with React components

## Path Aliases

Configured in `vite.config.ts` and `tsconfig.json`:

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/services/*` → `src/services/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`
- `@/types/*` → `src/types/*`

Always use path aliases for imports outside current directory.

### Troubleshooting

- Port in use: Change port in vite.config.ts or kill process on 5173
- Module errors: Verify path aliases match in config files
- Build fails: Run pnpm type-check, reinstall with pnpm install
- Styled Components: Check ThemeProvider wraps app
- React Query: Verify QueryClientProvider at app root

### Additional Resources

- Repository: https://github.com/GoStans-Co/gostans-frontend
- React Documentation
- TypeScript Handbook
- React Query Docs
- Recoil Documentation
- Styled Components
