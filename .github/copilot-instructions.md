# Copilot Instructions for ng-alain-gighub-supabase

## Project Overview

This repository is based on the **NG-ALAIN** framework, an out-of-box UI solution for enterprise applications built on top of Angular, ng-zorro-antd, and @delon. The project includes:

- **Framework:** NG-ALAIN 20.1.x (based on Angular 20.3.x)
- **Language:** TypeScript 5.9.x
- **Styling:** LESS (not SCSS/Sass)
- **Build Tool:** Angular CLI with @angular/build
- **Testing:** Karma + Jasmine
- **UI Library:** ng-zorro-antd (Ant Design for Angular)
- **Core Libraries:** @delon suite (abc, acl, auth, cache, chart, form, mock, theme, util)
- **Additional Libraries:** ngx-tinymce, screenfull
- **Note:** This project does NOT use SSR, Supabase, or standalone components by default

## Development Environment Setup

### Prerequisites
- Node.js (v20.x recommended, as specified in `.nvmrc`)
- yarn 4.9.2 (configured as package manager in `package.json`)

### Installation
```bash
yarn install
# or if you prefer npm
npm install
```

## Build & Test Commands

### Development Server
```bash
npm start
# or with HMR (Hot Module Replacement)
npm run hmr
# or
ng serve
```
The application runs on `http://localhost:4200/` by default and will automatically open in your browser with the `-o` flag.

### Build
```bash
npm run build
```
Production build artifacts are stored in the `dist/ng-alain/` directory. 
**Note:** The build uses high memory allocation (8GB) via `ng-high-memory` script.

### Testing
```bash
npm test
```
Runs unit tests with Karma test runner in watch mode. Tests should pass before submitting PRs.

For coverage report without watch mode:
```bash
npm run test-coverage
```

### Linting
```bash
npm run lint
```
Runs both TypeScript ESLint and LESS style linting.

Individual linting commands:
```bash
npm run lint:ts      # TypeScript/JavaScript linting
npm run lint:style   # LESS style linting
```

### Other Commands
```bash
npm run analyze      # Build with source maps for analysis
npm run analyze:view # View bundle analysis
npm run color-less   # Generate color.less theme file
npm run theme        # Generate theme CSS
npm run icon         # Generate icon assets
```

## Project Structure

```
/src
  /app           - Angular application (components, services, routes)
    /core        - Core services and guards
    /layout      - Layout components
    /routes      - Feature routes/pages
    /shared      - Shared components and utilities
  /assets        - Static assets (images, i18n, fonts)
  index.html     - Main HTML template
  main.ts        - Application entry point
  styles.less    - Global LESS styles
/public          - Public static assets
/_mock           - Mock data for development
/_cli-tpl        - CLI templates for code generation
/scripts         - Build and utility scripts
angular.json     - Angular workspace configuration
ng-alain.json    - NG-ALAIN specific configuration
tsconfig.*.json  - TypeScript configuration files
package.json     - Dependencies and scripts
```

## Coding Conventions

### TypeScript
- Follow the [Angular Style Guide](https://angular.dev/style-guide)
- Use strict TypeScript settings as configured in `tsconfig.json`
- Prefer `const` over `let` when variables won't be reassigned
- Use meaningful variable and function names
- Follow ESLint rules configured in `eslint.config.mjs`

### Components
- Component prefix: `app-` (configured in `angular.json`)
- Default component style: LESS files
- Generate components using Angular CLI: `ng generate component component-name`
- Or use NG-ALAIN schematics: `ng g ng-alain:component component-name`

### Styling
- **LESS is the default and required styling language** (NOT SCSS/Sass)
- Global styles go in `src/styles.less`
- Component-specific styles should be co-located with components as `.less` files
- Maximum component style size: 10kB (error), 6kB (warning) as per budget
- Use NG-ALAIN theme system for consistent theming
- Color variables can be customized in `src/assets/color.less`

### Code Formatting
- Prettier is configured for code formatting
- ESLint handles TypeScript/JavaScript linting with auto-fix enabled
- Stylelint handles LESS file linting
- Husky pre-commit hooks ensure code quality with lint-staged

## Pull Request Requirements

### Before Submitting a PR
1. **Build:** Ensure `npm run build` completes successfully
2. **Tests:** All tests must pass with `npm test`
3. **Linting:** Code must pass `npm run lint` (both TypeScript and LESS)
4. **Code Quality:** Follow TypeScript, Angular, and NG-ALAIN best practices
5. **No Errors:** Fix all TypeScript compilation errors

### PR Guidelines
- Keep changes focused and minimal
- Update tests when modifying functionality
- Follow NG-ALAIN component patterns and conventions
- Ensure proper use of @delon libraries when applicable
- Verify the application runs correctly with `npm start`

## Important Notes

### Build Budgets
Production builds enforce size budgets:
- Initial bundle: 6MB max (error), 2MB warning
- Component styles: 10kB max (error), 6kB warning

### NG-ALAIN Specific
- This project uses NG-ALAIN framework, not vanilla Angular
- Leverage @delon libraries for common functionality:
  - `@delon/abc` - Business components
  - `@delon/acl` - Access Control List
  - `@delon/auth` - Authentication
  - `@delon/cache` - Caching
  - `@delon/chart` - Chart components
  - `@delon/form` - Dynamic forms
  - `@delon/mock` - Mock data
  - `@delon/theme` - Theming system
  - `@delon/util` - Utilities
- Follow NG-ALAIN documentation: https://ng-alain.com

### UI Components
- Use **ng-zorro-antd** components (Ant Design for Angular)
- Do NOT use Angular Material or Angular CDK (not installed)
- Follow Ant Design principles for UI/UX consistency
- ng-zorro-antd documentation: https://ng.ant.design/

### File Modifications
- **Angular configuration:** Changes to `angular.json` should be carefully reviewed
- **NG-ALAIN config:** Modifications to `ng-alain.json` affect theme generation
- **TypeScript config:** Modifications to `tsconfig.*.json` files should maintain strict type checking
- **Dependencies:** When adding/updating dependencies, ensure compatibility with Angular 20.3 and NG-ALAIN 20.1

## Common Tasks

### Generate New Component
```bash
ng generate component component-name
# or using NG-ALAIN schematics
ng g ng-alain:component component-name
```

### Generate New Service
```bash
ng generate service service-name
```

### Generate NG-ALAIN Module
```bash
ng g ng-alain:module module-name
```

### Update Theme
```bash
npm run color-less  # Update color variables
npm run theme       # Generate theme CSS
```

### Update Dependencies
```bash
npm install <package-name>
# or with yarn
yarn add <package-name>
```

## Testing Strategy

- Unit tests use Jasmine and Karma
- Test files should be co-located with the code they test (`.spec.ts` files)
- Aim for meaningful test coverage of business logic
- Tests run in Chrome (via karma-chrome-launcher)
- Use `@delon/testing` utilities for testing @delon components

## Mock Data

- Mock data is stored in `/_mock` directory
- Use `@delon/mock` for API mocking during development
- Mock rules are registered in the mock module
- Enable/disable mocking in environment files

## Guidelines for Copilot Coding Agents

When working with automated coding agents (e.g., GitHub Copilot for Pull Requests), follow these specific guidelines:

### Agent Workflow

1. **Analyze First**: Before making changes, review the relevant code sections and understand the existing patterns
2. **Minimal Changes**: Make the smallest possible changes to achieve the goal
3. **Test Early**: Run tests immediately after making changes to catch issues early
4. **Iterative Development**: Make incremental changes and validate after each step
5. **Code Review**: Always request a code review before finalizing changes

### Testing Requirements for Agents

- **Run existing tests first**: Run `npm test` to understand baseline test status
- **Create tests for new functionality**: Follow existing test patterns in `.spec.ts` files
- **Verify test coverage**: Run `npm run test-coverage` for coverage reports
- **Fix test failures**: Do not ignore failing tests; fix them or understand why they fail

### Code Quality Checks for Agents

Before submitting changes, ensure:
1. `npm run lint` passes without errors
2. `npm run build` completes successfully
3. `npm test` passes all tests
4. No TypeScript compilation errors
5. All code follows the coding conventions documented above

### Security Considerations for Agents

- Never commit secrets, API keys, or sensitive data
- Follow Angular security best practices (sanitization, etc.)
- Use `@angular/platform-browser` `DomSanitizer` when dealing with dynamic content
- Validate and sanitize all user inputs
- Be cautious with `innerHTML` and similar DOM manipulation

### Error Handling for Agents

- Use try-catch blocks for asynchronous operations
- Provide meaningful error messages
- Handle HTTP errors appropriately using Angular's `HttpClient` error handling
- Use Angular's error handling services where applicable
- Log errors appropriately for debugging

### Code Review Expectations for Agents

When creating PRs, ensure:
- PR description clearly explains what was changed and why
- Changes are focused on the issue being addressed
- No unrelated changes are included
- Breaking changes are clearly documented
- Migration guides provided if needed

## Additional Resources

- [NG-ALAIN Documentation](https://ng-alain.com)
- [NG-ALAIN GitHub](https://github.com/ng-alain/ng-alain)
- [ng-zorro-antd Documentation](https://ng.ant.design/)
- [@delon Components](https://ng-alain.com/components)
- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [LESS Documentation](https://lesscss.org/)
