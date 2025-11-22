# 🏗️ 新功能開發順序指南（Agent 專用版）

> **目的**：為 GitHub Copilot Agents 提供標準化的五層架構開發順序，確保所有新功能開發遵循企業標準流程  
> **版本**：v1.0.0  
> **最後更新**：2025-01-19  
> **完整版**：[docs/archive/00-順序.md](../../docs/archive/00-順序.md)

---

## ⚠️ 強制執行流程

**在開始任何新功能開發前，必須**：

1. ✅ **查閱記憶庫**：`.github/copilot/memory.jsonl` 搜尋 "Five Layer Development Order"
2. ✅ **檢查架構圖**：`docs/architecture/01-system-architecture-mindmap.mermaid.md`
3. ✅ **完成檢查清單**：本文件的開發前準備檢查清單
4. ✅ **確認開發順序**：按照五層架構順序開發（Types → Repositories → Models → Services → Facades → Components）

---

## 🎯 五層架構開發順序（標準流程）

```
第 1 步：Types 層（最底層，必須最先完成）
   ↓
第 2 步：Repositories 層（依賴 Types）
   ↓
第 3 步：Models 層（依賴 Types，可與 Repositories 並行）
   ↓
第 4 步：Services 層（依賴 Repositories + Models）
   ↓
第 5 步：Facades 層（依賴 Services）
   ↓
第 6 步：Routes/Components 層（依賴 Facades）
   ↓
第 7 步：測試與文檔（必須完成）
```

### 🔑 關鍵原則

- **嚴格依賴方向**：只能依賴下層，不可反向依賴
- **並行開發**：Models 層可與 Repositories 層並行開發
- **P0 優先級**：所有層級都是 P0 優先級（必須完成）
- **完整驗證**：每個層級完成後必須通過驗證序列

---

## 📋 開發前準備檢查清單

### 1. 需求分析
- [ ] 明確功能需求（PRD、用戶故事）
- [ ] 確認業務流程和規則
- [ ] 識別相關的現有模組和依賴
- [ ] 評估複雜度和優先級
- [ ] **常見做法檢查**：參考項目中已有的類似實現

### 2. 資料庫設計
- [ ] 設計資料表結構（對照 51 張表架構）
- [ ] 確認是否需要新增資料表
- [ ] 設計 RLS 策略（參考安全文檔）
- [ ] 準備資料庫遷移腳本
- [ ] 使用 `@SUPABASE` MCP 工具驗證設計

### 3. 架構規劃
- [ ] 確認功能屬於哪個業務模組（11 個模組之一）
- [ ] 規劃需要哪些層級（Types、Repositories、Models、Services、Facades）
- [ ] 確認與現有模組的整合點
- [ ] 設計 API 介面（如需要）
- [ ] **邏輯一致性檢查**：架構規劃符合分層原則

### 4. 開發準備
- [ ] 分支已創建（遵循分支命名規範）
- [ ] 開發環境已準備
- [ ] 相關文檔已閱讀

---

## 🏗️ 第 1 步：Types 層（最底層）

**優先級**：P0（必須最先完成）  
**位置**：`src/app/core/infra/types/`  
**依賴**：無（最底層）

### 職責
- 從 Supabase 生成 `database.types.ts`（包含所有表的類型）
- 定義業務模組類型文件（如 `finance.types.ts`）

### 開發步驟

1. **生成/更新 database.types.ts**
   ```bash
   # 使用 Supabase MCP 工具生成類型
   # 確保新表已包含在類型定義中
   ```

2. **創建業務模組類型文件**（如需要）
   ```typescript
   // src/app/core/infra/types/{feature}.types.ts
   import { Database } from './database.types';
   
   // 從 database.types.ts 提取類型
   export type FeatureItem = Database['public']['Tables']['feature_items']['Row'];
   export type FeatureItemInsert = Database['public']['Tables']['feature_items']['Insert'];
   export type FeatureItemUpdate = Database['public']['Tables']['feature_items']['Update'];
   
   // 業務相關類型定義
   export type ItemType = 'type1' | 'type2' | 'type3';
   export type ItemStatus = 'active' | 'inactive' | 'archived';
   ```

3. **導出類型**
   ```typescript
   // src/app/core/infra/types/index.ts
   export * from './{feature}.types';
   ```

### 完成標準（企業級檢查）

- [ ] 所有新表的類型定義已包含在 `database.types.ts`
- [ ] 業務模組類型文件已創建（如需要）
- [ ] 類型已正確導出
- [ ] 類型定義與資料庫結構一致
- [ ] 通過 TypeScript 編譯檢查（`yarn type-check`）
- [ ] **常見做法**：類型定義遵循 TypeScript 最佳實踐
- [ ] **企業標準**：無 `any` 類型（除非必要）
- [ ] **邏輯一致性**：類型命名語義化，與資料庫字段對應
- [ ] **符合常理**：類型定義可用，編譯無錯誤

---

## 🗄️ 第 2 步：Repositories 層

**優先級**：P0（依賴 Types 層）  
**位置**：`src/app/core/infra/repositories/`  
**依賴**：Types 層、BaseRepository、SupabaseService

### 職責
- 封裝資料庫訪問
- 處理 snake_case ↔ camelCase 轉換
- 統一錯誤處理

### 開發步驟

```typescript
// src/app/core/infra/repositories/{feature}-item.repository.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, QueryOptions } from '@core';
import { 
  FeatureItem, 
  FeatureItemInsert, 
  FeatureItemUpdate 
} from '@core';

@Injectable({ providedIn: 'root' })
export class FeatureItemRepository extends BaseRepository<
  FeatureItem,
  FeatureItemInsert,
  FeatureItemUpdate
> {
  protected tableName = 'feature_items';
  
  // 可選：添加特定查詢方法
  findByOwnerId(ownerId: string, options?: QueryOptions): Observable<FeatureItem[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        ownerId, // 會自動轉換為 owner_id
      },
    });
  }
}
```

### 完成標準（企業級檢查）

- [ ] Repository 繼承自 `BaseRepository`
- [ ] `tableName` 已正確設置（snake_case）
- [ ] 類型參數正確（Entity, Insert, Update）
- [ ] 特定查詢方法已實現（如需要）
- [ ] Repository 已正確導出
- [ ] 通過 TypeScript 編譯檢查
- [ ] **常見做法**：遵循 Repository 模式，參考現有實現
- [ ] **企業標準**：職責分離明確（只負責數據訪問）
- [ ] **邏輯一致性**：查詢方法命名語義化，參數類型正確
- [ ] **符合常理**：基本 CRUD 操作可用

---

## 📊 第 3 步：Models 層（可與 Repositories 並行）

**優先級**：P0（可與 Repositories 並行開發）  
**位置**：`src/app/shared/models/`  
**依賴**：Types 層（必須）、可參考 Repositories（不強制依賴）

### 職責
- 定義業務模型（camelCase）
- 提供業務相關的類型定義和枚舉

### 開發步驟

```typescript
// src/app/shared/models/{feature}.models.ts
import { FeatureItem } from '@core';

// 從 Types 層提取並轉換為業務模型
export type FeatureItemModel = FeatureItem;

// 業務相關枚舉
export enum ItemType {
  TYPE1 = 'type1',
  TYPE2 = 'type2',
  TYPE3 = 'type3',
}

export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

// 業務相關接口
export interface CreateItemRequest {
  name: string;
  type: ItemType;
  description?: string;
}
```

### 完成標準（企業級檢查）

- [ ] Models 文件已創建
- [ ] 從 Types 層正確提取類型
- [ ] 業務相關枚舉和類型已定義
- [ ] Models 已正確導出
- [ ] 通過 TypeScript 編譯檢查
- [ ] **常見做法**：參考現有 Models 文件結構
- [ ] **企業標準**：模型定義完整，枚舉值明確
- [ ] **邏輯一致性**：模型命名語義化，與業務邏輯對應
- [ ] **符合常理**：模型定義可用，類型正確

---

## ⚙️ 第 4 步：Services 層

**優先級**：P0（依賴 Repositories + Models）  
**位置**：`src/app/shared/services/`  
**依賴**：Repositories 層、Models 層、Angular Signals

### 職責
- 業務邏輯處理
- 狀態管理（使用 Signals）
- 協調多個 Repositories

### 開發步驟

```typescript
// src/app/shared/services/{feature}/{feature}-item.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { FeatureItemRepository } from '@core';
import { 
  FeatureItemModel, 
  ItemStatus,
  CreateItemRequest 
} from '@shared';

@Injectable({ providedIn: 'root' })
export class FeatureItemService {
  private readonly itemRepo = inject(FeatureItemRepository);
  
  // 使用 Signals 管理狀態
  private itemsState = signal<FeatureItemModel[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);
  
  // 暴露 ReadonlySignal 給組件
  readonly items = this.itemsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  
  // Computed signals
  readonly activeItems = computed(() => 
    this.items().filter(item => item.status === ItemStatus.ACTIVE)
  );
  
  // 業務邏輯方法
  async loadItems(ownerId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    
    try {
      const items = await firstValueFrom(
        this.itemRepo.findByOwnerId(ownerId)
      );
      this.itemsState.set(items);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }
}
```

### 完成標準（企業級檢查）

- [ ] Service 使用 `@Injectable({ providedIn: 'root' })`
- [ ] 使用 `inject()` 進行依賴注入
- [ ] 使用 Signals 管理狀態（`signal()`, `computed()`）
- [ ] 暴露 `ReadonlySignal` 給組件
- [ ] 業務邏輯方法已實現
- [ ] 錯誤處理已實現（try-catch，錯誤狀態管理）
- [ ] Loading 狀態管理已實現
- [ ] Service 已正確導出
- [ ] 通過 TypeScript 編譯檢查
- [ ] **常見做法**：遵循 Angular 20 現代語法
- [ ] **企業標準**：錯誤處理完善、測試覆蓋率 ≥80%
- [ ] **邏輯一致性**：數據流清晰、命名語義化
- [ ] **符合常理**：功能真正可用、狀態管理正確

---

## 🎭 第 5 步：Facades 層

**優先級**：P0（依賴 Services 層）  
**位置**：`src/app/core/facades/`  
**依賴**：Services 層、ErrorStateService、BlueprintActivityService

### 職責
- 業務模組門面，統一對外接口
- 協調多個 Services
- 提供統一的 Signal 狀態接口

### 開發步驟

```typescript
// src/app/core/facades/{feature}.facade.ts
import { Injectable, inject } from '@angular/core';
import { FeatureItemService } from '@shared';
import { ErrorStateService } from '@shared';

@Injectable({ providedIn: 'root' })
export class FeatureFacade {
  private readonly itemService = inject(FeatureItemService);
  private readonly errorState = inject(ErrorStateService);
  
  // 暴露 Service 的狀態（通過 Facade）
  readonly items = this.itemService.items;
  readonly loading = this.itemService.loading;
  readonly error = this.itemService.error;
  
  async loadItems(ownerId: string): Promise<void> {
    try {
      await this.itemService.loadItems(ownerId);
    } catch (error) {
      this.errorState.setError('feature', error);
      throw error;
    }
  }
}
```

### 完成標準（企業級檢查）

- [ ] Facade 使用 `@Injectable({ providedIn: 'root' })`
- [ ] 協調多個 Services（如需要）
- [ ] 暴露統一的 Signal 狀態接口
- [ ] 整合錯誤處理（ErrorStateService）
- [ ] 業務方法已實現
- [ ] Facade 已正確導出
- [ ] 通過 TypeScript 編譯檢查
- [ ] **常見做法**：遵循 Facade 模式
- [ ] **企業標準**：接口統一，易於使用
- [ ] **邏輯一致性**：數據流清晰
- [ ] **符合常理**：功能真正可用

---

## 🎨 第 6 步：Routes/Components 層

**優先級**：P0（依賴 Facades 層）  
**位置**：`src/app/routes/`  
**依賴**：Facades 層、SHARED_IMPORTS

### 職責
- UI 組件實現
- 用戶交互處理
- 路由配置

### 開發步驟

```typescript
// src/app/routes/{feature}/{feature}-list/{feature}-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { FeatureFacade } from '@core';

@Component({
  selector: 'app-{feature}-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './{feature}-list.component.html',
  styleUrl: './{feature}-list.component.less',
})
export class FeatureListComponent implements OnInit {
  private readonly featureFacade = inject(FeatureFacade);
  
  // 從 Facade 獲取狀態
  readonly items = this.featureFacade.items;
  readonly loading = this.featureFacade.loading;
  
  ngOnInit(): void {
    this.featureFacade.loadItems('owner-id');
  }
}
```

### 完成標準（企業級檢查）

- [ ] 組件使用 Standalone Component
- [ ] 使用 `SHARED_IMPORTS` 導入模組
- [ ] 使用 `inject()` 注入 Facade
- [ ] 從 Facade 獲取狀態（ReadonlySignal）
- [ ] 路由已配置（懶加載）
- [ ] UI/UX 符合設計規範
- [ ] 響應式設計已實現
- [ ] 可訪問性要求已滿足（WCAG 2.1 AA）
- [ ] 通過 TypeScript 編譯檢查
- [ ] **常見做法**：遵循 Angular 20 現代語法、使用 SHARED_IMPORTS
- [ ] **企業標準**：代碼結構清晰、錯誤處理完善
- [ ] **邏輯一致性**：數據流清晰、組件初始化順序正確
- [ ] **符合常理**：功能真正可用、用戶體驗良好

---

## 🧪 第 7 步：測試與文檔

**優先級**：P0（必須完成）

### 測試要求

1. **單元測試**
   - [ ] Service 測試（必須，≥80% 覆蓋率）
   - [ ] Facade 測試（必須，≥80% 覆蓋率）
   - [ ] Repository 測試（可選，但建議）
   - [ ] Component 測試（建議）

2. **集成測試**
   - [ ] 端到端測試（如需要）
   - [ ] API 集成測試（如需要）

3. **文檔**
   - [ ] README 更新（如需要）
   - [ ] API 文檔更新（如需要）
   - [ ] 架構文檔更新（如需要）

### 完成標準
- [ ] 所有測試通過（`yarn test`）
- [ ] 測試覆蓋率達標（≥80%）
- [ ] 文檔已更新
- [ ] 代碼審查通過

---

## 🔍 開發後完整驗證流程

### 1. 代碼質量檢查
```bash
yarn type-check    # TypeScript 編譯檢查
yarn lint          # ESLint 檢查
yarn lint:style    # Stylelint 檢查
yarn build         # 建構檢查
```

### 2. 功能驗證
```bash
yarn test          # 單元測試
# 啟動開發服務器，瀏覽器中驗證功能
```

### 3. 企業標準最終檢查

**四大核心原則**（必須全部滿足）：

#### ✅ 1. 常見做法（Common Practices）
- [ ] 遵循 Angular/NG-ZORRO/Supabase 官方最佳實踐
- [ ] 參考項目中已有的類似實現
- [ ] UI/UX 符合常規
- [ ] 避免不必要的創新

#### ✅ 2. 企業標準（Enterprise Standards）
- [ ] 代碼結構清晰（分層架構、依賴方向）
- [ ] 職責分離明確（單一職責原則）
- [ ] 錯誤處理完善（所有異步操作都有錯誤處理）
- [ ] 狀態管理規範（使用 Signals）
- [ ] 測試覆蓋充分（≥80%）

#### ✅ 3. 符合邏輯（Logical Consistency）
- [ ] 數據流清晰（Component → Facade → Service → Repository）
- [ ] 命名語義化（能清楚表達意圖）
- [ ] 條件判斷合理（避免複雜嵌套）
- [ ] 組件初始化順序正確
- [ ] 狀態更新時機正確

#### ✅ 4. 符合常理（Common Sense）
- [ ] 功能真正可用（不只是編譯通過）
- [ ] 用戶體驗良好（符合使用習慣）
- [ ] 避免過度設計（KISS、YAGNI 原則）
- [ ] 及時驗證（構建檢查、運行時檢查）
- [ ] 文檔與代碼一致

---

## ⚠️ 重要提醒

**如果任何一項檢查不通過，必須修復後才能標記為完成。**

**四個核心原則必須全部滿足**：
1. ✅ 常見做法（Common Practices）
2. ✅ 企業標準（Enterprise Standards）
3. ✅ 符合邏輯（Logical Consistency）
4. ✅ 符合常理（Common Sense）

---

## 📚 相關文檔

- [完整版開發順序指南](../../docs/archive/00-順序.md) - 詳細版本
- [Agent 啟動檢查清單](./agent-startup-checklist.md) - 啟動流程
- [企業標準合規檢查](./enterprise-compliance-checklist.md) - 合規檢查
- [專案記憶庫](../copilot/memory.jsonl) - 知識圖譜
- [系統架構思維導圖](../../docs/architecture/01-system-architecture-mindmap.mermaid.md) - 系統架構

---

**最後更新**：2025-01-19  
**維護者**：開發團隊  
**適用對象**：所有 GitHub Copilot Agents
