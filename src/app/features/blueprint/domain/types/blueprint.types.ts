/**
 * Blueprint Container Types
 *
 * Base type definitions for Blueprint Container system (邏輯容器)
 * Following vertical slice architecture and enterprise guidelines
 *
 * @module features/blueprint/domain/types/blueprint.types
 */

/**
 * Blueprint visibility levels (simplified)
 * - public: 公開，任何人都能看到
 * - hidden: 隱藏/私有，只有擁有者和成員能看到
 */
export type BlueprintVisibility = 'public' | 'hidden';

/**
 * Blueprint status
 */
export type BlueprintStatus = 'draft' | 'published' | 'archived';

/**
 * Blueprint category (optional)
 */
export type BlueprintCategory = 'software_development' | 'marketing' | 'sales' | 'hr' | 'operations' | 'custom';

/**
 * Owner type (Account Context integration)
 */
export type OwnerType = 'user' | 'organization' | 'team';

/**
 * Base blueprint interface
 * Minimal structure for extensibility
 */
export interface Blueprint {
  // Identity
  id: string;
  name: string;
  description: string;

  // Classification (simplified)
  category?: BlueprintCategory;
  visibility: BlueprintVisibility;
  status: BlueprintStatus;

  // Ownership (Account Context Integration)
  ownerId: string;
  ownerType: OwnerType;

  // Blueprint structure definition (JSONB - extensible, optional)
  structure?: BlueprintStructure;

  // Metadata
  version: number;
  tags: string[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Blueprint structure definition
 * Extensible for future modules (tasks, files, settings, etc.)
 */
export interface BlueprintStructure {
  // Extensible fields for future modules
  tasks?: unknown[]; // Task templates (to be defined in task module)
  folders?: unknown[]; // Folder templates
  settings: WorkspaceSettings;
  automations?: unknown[]; // Automation rules
  defaultRoles?: unknown[]; // Default role assignments
}

/**
 * Workspace settings within blueprint
 */
export interface WorkspaceSettings {
  allowGuestAccess: boolean;
  requireApprovalForJoin: boolean;
  defaultMemberRole: 'member' | 'viewer';
  enableTaskComments: boolean;
  enableFileSharing: boolean;
  enableNotifications: boolean;
}

/**
 * Blueprint insert type (for creation - simplified)
 */
export interface BlueprintInsert {
  name: string;
  description: string;
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  ownerId: string;
  ownerType: OwnerType;
  structure?: BlueprintStructure;
  tags?: string[];
}

/**
 * Blueprint update type (for modifications - simplified)
 */
export interface BlueprintUpdate {
  name?: string;
  description?: string;
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  structure?: BlueprintStructure;
  tags?: string[];
  version?: number;
}

/**
 * Type guards
 */
export function isBlueprintStatus(value: unknown): value is BlueprintStatus {
  return typeof value === 'string' && ['draft', 'published', 'archived'].includes(value);
}

export function isBlueprintVisibility(value: unknown): value is BlueprintVisibility {
  return typeof value === 'string' && ['public', 'hidden'].includes(value);
}

export function isOwnerType(value: unknown): value is OwnerType {
  return typeof value === 'string' && ['user', 'organization', 'team'].includes(value);
}
