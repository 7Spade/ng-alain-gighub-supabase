# Copilot Instructions for ng-gighub

## Project Overview

This repository contains an Angular 20.1 application with Server-Side Rendering (SSR) capabilities. The project is built using Angular CLI and includes:

- **Framework:** Angular 20.1.x
- **Language:** TypeScript 5.8.x
- **Styling:** SCSS (Sass)
- **Build Tool:** Angular CLI with @angular/build
- **Testing:** Karma + Jasmine
- **SSR:** @angular/ssr with Express server
- **Database:** Supabase (PostgreSQL-based backend with Storage)
- **UI Libraries:** Angular Material, Angular CDK (configured for future use)
- **Animations:** @angular/animations (configured for future use)
- **PWA:** @angular/service-worker (configured for future use)

## Development Environment Setup

### Prerequisites
- Node.js (v20.x recommended)
- npm (comes with Node.js)
- Supabase project (for database and backend services)

### Installation
```bash
npm install
```

## Build & Test Commands

### Development Server
```bash
npm start
# or
ng serve
```
The application runs on `http://localhost:4200/` by default.

### Build
```bash
npm run build
```
Production build artifacts are stored in the `dist/` directory.

### Testing
```bash
npm test
```
Runs unit tests with Karma test runner. Tests should pass before submitting PRs.

### Watch Mode (Development)
```bash
npm run watch
```
Runs build in watch mode for development.

### SSR Server
```bash
npm run serve:ssr:ng-gighub
```
Runs the SSR server after a production build.

## Project Structure

```
/src
  /app           - Angular application components, services, and modules
  index.html     - Main HTML template
  main.ts        - Application entry point
  main.server.ts - Server-side entry point
  server.ts      - Express server configuration for SSR
  styles.scss    - Global styles
/public          - Static assets
angular.json     - Angular workspace configuration
tsconfig.*.json  - TypeScript configuration files
package.json     - Dependencies and scripts
```

## Coding Conventions

### TypeScript
- Follow the [Angular Style Guide](https://angular.dev/style-guide)
- Use strict TypeScript settings as configured in `tsconfig.json`
- Prefer `const` over `let` when variables won't be reassigned
- Use meaningful variable and function names

### Components
- Component prefix: `app-` (configured in `angular.json`)
- Use standalone components when appropriate
- Component style: SCSS files
- Generate components using Angular CLI: `ng generate component component-name`

### Styling
- SCSS is the default styling language
- Global styles go in `src/styles.scss`
- Component-specific styles should be co-located with components
- Maximum component style size: 8kB (error), 4kB (warning) as per budget

### Code Formatting
- Prettier is configured for HTML files (see `package.json`)
- HTML files use the Angular parser
- Follow existing code formatting patterns

## Pull Request Requirements

### Before Submitting a PR
1. **Build:** Ensure `npm run build` completes successfully
2. **Tests:** All tests must pass with `npm test`
3. **Code Quality:** Follow TypeScript and Angular best practices
4. **No Errors:** Fix all TypeScript compilation errors

### PR Guidelines
- Keep changes focused and minimal
- Update tests when modifying functionality
- Ensure SSR compatibility if changing server-side code
- Verify the application runs correctly with `npm start`

## Important Notes

### Build Budgets
Production builds enforce size budgets:
- Initial bundle: 1MB max (error), 500kB warning
- Component styles: 8kB max (error), 4kB warning

### SSR Considerations
- This application uses Server-Side Rendering
- Code must be compatible with both browser and Node.js environments
- Avoid browser-only APIs in SSR-rendered components (use platform checks)
- Server entry point: `src/main.server.ts`
- Express server config: `src/server.ts`

### Database & Storage
- **Backend:** This project uses Supabase as the database and backend service
- **Database Type:** PostgreSQL (via Supabase)
- **Storage:** Supabase Storage with comprehensive file management methods in `SupabaseService`
- **MCP Integration:** Supabase MCP server is configured for database operations
- When working with database operations, use the Supabase client libraries and follow Supabase best practices
- Storage operations are SSR-compatible and return appropriate errors on server-side

### File Modifications
- **Angular configuration:** Changes to `angular.json` should be carefully reviewed
- **TypeScript config:** Modifications to `tsconfig.*.json` files should maintain strict type checking
- **Dependencies:** When adding/updating dependencies, ensure compatibility with Angular 20.1
  - Angular Material, CDK, Animations, and Service Worker are pre-installed
  - Use these packages as needed without reinstalling

## Common Tasks

### Generate New Component
```bash
ng generate component component-name
```

### Generate New Service
```bash
ng generate service service-name
```

### Update Dependencies
```bash
npm install <package-name>
```

## Testing Strategy

- Unit tests use Jasmine and Karma
- Test files should be co-located with the code they test (`.spec.ts` files)
- Aim for meaningful test coverage of business logic
- Tests run in Chrome (via karma-chrome-launcher)

## Database & Backend

### Supabase
This project uses Supabase as the primary database and backend service:
- **Database:** PostgreSQL with Supabase extensions
- **Authentication:** Supabase Auth (if applicable)
- **Storage:** Supabase Storage with comprehensive file management capabilities
- **Real-time:** Supabase Realtime subscriptions (if applicable)

### Working with Supabase
- Use the Supabase JavaScript client library for database operations
- `SupabaseService` provides methods for both database and storage operations
- Storage operations include: upload, download, delete, move, copy, list files, and URL generation
- Follow Supabase best practices for queries and data management
- Ensure proper error handling for database and storage operations
- Use TypeScript types for database schemas when available
- Set up appropriate bucket policies and RLS for storage security
- See `docs/setup/supabase.md` for detailed usage examples

### Angular Material & CDK
- **Material:** Component library installed for future UI development
- **CDK:** Component Dev Kit for custom components
- Imports should be added as needed when using Material components

### Animations
- `@angular/animations` is installed and ready for use
- Import animations as needed in components
- Follow Angular animation best practices

### Service Worker (PWA)
- `@angular/service-worker` is installed for Progressive Web App capabilities
- Configure as needed for offline functionality and caching

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
