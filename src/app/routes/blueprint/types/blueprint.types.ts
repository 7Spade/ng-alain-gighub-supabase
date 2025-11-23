/**
 * Blueprint 相關型別定義
 */

/**
 * 藍圖狀態
 */
export type BlueprintStatus = 'draft' | 'active' | 'archived';

/**
 * 藍圖基礎介面
 */
export interface Blueprint {
  id: string;
  name: string;
  description?: string;
  status: BlueprintStatus;
  created_at: string;
  updated_at: string;
}

/**
 * 建立藍圖的參數
 */
export interface CreateBlueprintDto {
  name: string;
  description?: string;
}

/**
 * 更新藍圖的參數
 */
export interface UpdateBlueprintDto {
  name?: string;
  description?: string;
  status?: BlueprintStatus;
}
