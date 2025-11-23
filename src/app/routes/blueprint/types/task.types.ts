/**
 * Task 相關型別定義
 */

/**
 * 任務狀態
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';

/**
 * 任務優先級
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * 任務基礎介面
 */
export interface Task {
  id: string;
  blueprint_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 建立任務的參數
 */
export interface CreateTaskDto {
  blueprint_id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigned_to?: string;
}

/**
 * 更新任務的參數
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigned_to?: string;
}
