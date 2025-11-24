/**
 * Blueprint Container Types
 *
 * Base type definitions for Blueprint Container system (邏輯容器)
 * Following docs/00-順序.md and BLUEPRINT_CONTAINER_PLANNING.md
 *
 * @module blueprint.types
 */

/**
 * Blueprint visibility levels
 */
export type BlueprintVisibility = 'private' | 'organization' | 'team' | 'public';

/**
 * Blueprint status
 */
export type BlueprintStatus = 'draft' | 'published' | 'archived';

/**
 * Blueprint category
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

  // Classification
  category: BlueprintCategory;
  visibility: BlueprintVisibility;
  status: BlueprintStatus;

  // Ownership (Account Context Integration)
  ownerId: string;
  ownerType: OwnerType;

  // Blueprint structure definition (JSONB - extensible)
  structure: BlueprintStructure;

  // Metadata
  version: number;
  tags: string[];
  iconUrl?: string;
  thumbnailUrl?: string;

  // Statistics
  usageCount: number;
  rating?: number;

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
 * Blueprint insert type (for creation)
 */
export interface BlueprintInsert {
  name: string;
  description: string;
  category: BlueprintCategory;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  ownerId: string;
  ownerType: OwnerType;
  structure: BlueprintStructure;
  tags?: string[];
  iconUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Blueprint update type (for modifications)
 */
export interface BlueprintUpdate {
  name?: string;
  description?: string;
  category?: BlueprintCategory;
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  structure?: BlueprintStructure;
  tags?: string[];
  iconUrl?: string;
  thumbnailUrl?: string;
  version?: number;
}

/**
 * Type guards
 */
export function isBlueprintStatus(value: unknown): value is BlueprintStatus {
  return typeof value === 'string' && ['draft', 'published', 'archived'].includes(value);
}

export function isBlueprintVisibility(value: unknown): value is BlueprintVisibility {
  return typeof value === 'string' && ['private', 'organization', 'team', 'public'].includes(value);
}

export function isOwnerType(value: unknown): value is OwnerType {
  return typeof value === 'string' && ['user', 'organization', 'team'].includes(value);
}
