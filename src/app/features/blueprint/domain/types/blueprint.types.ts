/**
 * Blueprint Container Types
 *
 * Base type definitions for Blueprint Container system (邏輯容器)
 * Following vertical slice architecture and enterprise guidelines
 *
 * 適用於工地建築領域的排程規劃、進度追蹤、品質驗收
 *
 * @module features/blueprint/domain/types/blueprint.types
 */

/**
 * Blueprint visibility levels
 * 簡化為公開/隱藏，搭配上下文可區分個人或組織建立
 */
export type BlueprintVisibility = 'private' | 'public';

/**
 * Blueprint status
 */
export type BlueprintStatus = 'draft' | 'published' | 'archived';

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

  // Classification (簡化：移除 category)
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
  visibility?: BlueprintVisibility;
  status?: BlueprintStatus;
  ownerId: string;
  ownerType: OwnerType;
  structure: BlueprintStructure;
  tags?: string[];
}

/**
 * Blueprint update type (for modifications)
 */
export interface BlueprintUpdate {
  name?: string;
  description?: string;
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
  return typeof value === 'string' && ['private', 'public'].includes(value);
}

export function isOwnerType(value: unknown): value is OwnerType {
  return typeof value === 'string' && ['user', 'organization', 'team'].includes(value);
}
