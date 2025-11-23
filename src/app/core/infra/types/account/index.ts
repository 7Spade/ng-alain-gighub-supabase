/**
 * Account Types Module
 *
 * Exports all account-related type definitions (unified identity abstraction and business domains).
 * This includes user, organization, team, bot types for flat access.
 */

// Account unified identity abstraction types
export * from './account.types';

// Business domain types (flat export)
// Note: UserAccount is exported to avoid conflict with Supabase User type
export type { UserAccount, UserAccountInsert, UserAccountUpdate, UserQueryOptions } from './user.types';
export * from './organization.types';
export * from './team.types';
export * from './bot.types';
