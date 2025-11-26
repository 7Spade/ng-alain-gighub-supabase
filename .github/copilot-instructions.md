---
description: 'Repository-specific instructions for ng-alain enterprise application'
applyTo: '**/*.ts, **/*.html, **/*.scss, **/*.css, **/*.less'
---

# ng-alain Enterprise Application - Copilot Instructions

This is an Angular 20 enterprise application built with ng-alain framework and Supabase backend. It provides an out-of-box UI solution for enterprise applications using ng-zorro-antd components.

## Project Overview

- **Framework**: Angular 20.3.x with standalone components
- **UI Library**: ng-zorro-antd 20.x with @delon components
- **Backend**: Supabase for authentication, database, and real-time features
- **Styling**: Less preprocessor with ng-alain theming
- **Testing**: Karma + Jasmine for unit tests, Playwright for E2E

## Development Flow

### Required Before Each Commit
- Run `yarn lint` or `npm run lint` to check for linting issues
- Run `yarn test` or `npm run test` to ensure tests pass

### Development Commands
- **Install dependencies**: `yarn` (preferred) or `npm install`
- **Start dev server**: `yarn start` or `npm start`
- **Build**: `yarn build` or `npm run build`
- **Lint TypeScript**: `yarn lint:ts` or `npm run lint:ts`
- **Lint Styles**: `yarn lint:style` or `npm run lint:style`
- **Lint All**: `yarn lint` or `npm run lint`
- **Unit Tests**: `yarn test` or `npm test`
- **E2E Tests**: `yarn e2e` or `npm run e2e`
- **Test Coverage**: `yarn test-coverage` or `npm run test-coverage`

## Repository Structure
- `src/app/`: Main application source code
- `src/assets/`: Static assets (images, icons, etc.)
- `src/environments/`: Environment configurations
- `src/styles/`: Global styles and theming
- `_mock/`: Mock API data for development
- `supabase/`: Supabase configuration and migrations
- `docs/`: Project documentation
- `e2e/`: End-to-end test files
- `scripts/`: Build and utility scripts

## Key Technologies
- **@delon/abc**: Business components library
- **@delon/acl**: Access Control List module
- **@delon/auth**: Authentication module with JWT support
- **@delon/cache**: Caching module
- **@delon/chart**: Chart components
- **@delon/form**: Dynamic form generation
- **@delon/theme**: Theme and layout components
- **@delon/util**: Utility functions

## Project Context
- Use standalone components by default (Angular 20)
- TypeScript strict mode is enabled
- Follow Angular Style Guide (https://angular.dev/style-guide)
- Use ng-zorro-antd components for UI consistency

## Coding Standards

### Architecture
- Use standalone components (Angular 20 default)
- Implement lazy loading for feature modules
- Use Angular's dependency injection with `inject()` function
- Structure with smart (container) and presentational components

### Component Design
- Use `input()`, `output()`, `viewChild()`, `viewChildren()` functions (Angular 20)
- Prefer `OnPush` change detection strategy for performance
- Use Angular Signals (`signal()`, `computed()`, `effect()`) for state management
- Keep templates clean with logic in component classes or services

### Styling
- Use Less for styling (project convention)
- Follow ng-alain and ng-zorro-antd theming guidelines
- Maintain accessibility (a11y) with ARIA attributes

### Data & State
- Use `HttpClient` with Supabase client for API calls
- Implement error handling with RxJS `catchError`
- Use Angular Signals for reactive state in components
- Use `@delon/cache` for caching strategies

### Security
- Use `@delon/auth` for authentication (JWT)
- Implement route guards with `@delon/acl` for authorization
- Sanitize user inputs using Angular's built-in sanitization

### Testing
- Write unit tests with Jasmine and Karma
- Write E2E tests with Playwright
- Mock HTTP requests using `provideHttpClientTesting`

## Key Guidelines
1. Follow Angular Style Guide and ng-alain conventions
2. Use Angular CLI commands for scaffolding (`ng generate`)
3. Document components and services with JSDoc comments
4. Ensure accessibility compliance (WCAG 2.1)
5. Use @delon components when available instead of custom implementations
6. Leverage ng-zorro-antd components for consistent UI
