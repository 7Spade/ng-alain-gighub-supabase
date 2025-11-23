/**
 * Account Services Module
 *
 * Exports all account-related services (unified identity abstraction and business domains).
 * This includes user, organization, team, bot services for flat access.
 */

// Account unified identity abstraction services
export * from './account.service';
export * from './workspace-context.service';
export * from './workspace-data.service';

// Business domain services (flat export)
export * from './user.service';
export * from './organization.service';
export * from './team.service';
