/**
 * Account Models Module
 *
 * Exports all account-related business models (unified identity abstraction and business domains).
 * This includes user, organization, team, bot models for flat access.
 */

// Account unified identity abstraction models
export * from './account.models';

// Business domain models (flat export)
// Note: Renamed to avoid conflict with supabase.models UserModel
export type { UserAccountEntity, UserAccountModel, CreateUserAccountRequest, UpdateUserAccountRequest } from './user.models';
export type {
  OrganizationModel,
  OrganizationBusinessModel,
  OrganizationMemberModel,
  OrganizationMemberDetail,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  AddOrganizationMemberRequest
} from './organization.models';
export type {
  TeamModel,
  TeamBusinessModel,
  TeamMemberModel,
  TeamMemberDetail,
  CreateTeamRequest,
  UpdateTeamRequest,
  AddTeamMemberRequest
} from './team.models';
export type { BotModel, BotAccountModel, CreateBotRequest, UpdateBotRequest } from './bot.models';
