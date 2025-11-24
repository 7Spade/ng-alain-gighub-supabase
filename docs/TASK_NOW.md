重新檢查專案結構，確認實際文件組織：


[9 tools called]


根據實際專案結構，重新整理任務表：

# 企業化標準架構重構任務表（修正版）

## 任務總覽

| 階段 | 任務數 | 優先級 | 預計時間 |
|------|--------|--------|----------|
| Phase 1: Repository 層重構 | 7 | 最高 | Week 1 |
| Phase 2: Service 層重構 | 5 | 高 | Week 1-2 |
| Phase 3: Facade 層優化 | 6 | 中 | Week 2 |
| Phase 4: RLS 策略修復 | 5 | 最高 | Week 2-3 |
| Phase 5: Routes 層簡化 | 8 | 中 | Week 3 |
| Phase 6: 測試與文檔 | 7 | 中 | Week 3-4 |
| 總計 | 38 | - | 4 Weeks |

---

## Phase 1: Repository 層重構（五個資料夾架構分離）

### 1.1 資料夾：`core/infra/repositories/account`

| 任務 ID | 任務名稱 | 描述 | 優先級 | 狀態 |
|---------|----------|------|--------|------|
| REPO-001 | 創建 UserRepository | 創建 `user.repository.ts`，繼承 BaseRepository，強制過濾 `type='User'`，實現所有 User 專用查詢方法（findByAuthUserId、findByEmail 等） | 最高 | 待辦 |
| REPO-002 | 創建 BotRepository | 創建 `bot.repository.ts`，繼承 BaseRepository，強制過濾 `type='Bot'`，實現所有 Bot 專用查詢方法 | 最高 | 待辦 |
| REPO-003 | 重構 OrganizationRepository | 重構 `organization.repository.ts`，改為繼承 BaseRepository（不再包裝 AccountRepository），強制過濾 `type='Organization'`，實現所有 Organization 專用方法 | 最高 | 待辦 |
| REPO-004 | 更新 AccountRepository | 更新 `index.ts` 中的 AccountRepository，標記為 `@deprecated`，移除 type 特定查詢方法（findByAuthUserId、findByEmail、findCreatedOrganizations），僅保留通用方法 | 高 | 待辦 |
| REPO-005 | 更新 Repository 導出 | 更新 `index.ts`，導出 UserRepository 和 BotRepository，確保所有 Repository 正確導出 | 高 | 待辦 |
| REPO-006 | 驗證 TeamRepository | 確認 `team.repository.ts` 已正確繼承 BaseRepository，處理獨立的 teams 表（無需修改） | 低 | 待辦 |
| REPO-007 | Repository 層單元測試 | 為 UserRepository、BotRepository、OrganizationRepository 編寫單元測試，驗證 type 過濾和類型安全 | 中 | 待辦 |

### 1.2 資料夾：`core/infra/types/account`

| 任務 ID | 任務名稱 | 描述 | 優先級 | 狀態 |
|---------|----------|------|--------|------|
| TYPE-001 | 驗證類型定義完整性 | 檢查 `user.types.ts`、`bot.types.ts`、`organization.types.ts`、`team.types.ts` 是否完整，確保所有類型定義正確，與 Repository 層匹配 | 中 | 待辦 |
| TYPE-002 | 類型導出檢查 | 檢查 `index.ts` 是否正確導出所有類型（UserAccount、Bot、Organization、Team），確保 Repository 層可以正確使用 | 中 | 待辦 |

---

## Phase 2: Service 層重構（五個資料夾架構分離）

### 2.1 資料夾：`shared/services/account`

| 任務 ID | 任務名稱 | 描述 | 優先級 | 狀態 |
|---------|----------|------|--------|------|
| SVC-001 | 重構 UserService | 更新 `user.service.ts`，將 `AccountRepository` 替換為 `UserRepository`，移除運行時 type 檢查（第 43、58 行的 type 檢查） | 最高 | 待辦 |
| SVC-002 | 重構 OrganizationService | 更新 `organization.service.ts`，將 `AccountRepository`（第 34 行）替換為 `UserRepository`（用於查詢 User），確保職責清晰 | 最高 | 待辦 |
| SVC-003 | 創建 BotService | 創建 `bot.service.ts`，使用 `BotRepository`，實現 Bot 的 CRUD 操作和狀態管理（Signals） | 高 | 待辦 |
| SVC-004 | 更新 Service 導出 | 更新 `index.ts`，導出 BotService，確保所有 Service 正確導出 | 高 | 待辦 |
| SVC-005 | Service 層單元測試 | 為 UserService、OrganizationService、BotService 編寫單元測試，驗證 Repository 依賴正確 | 中 | 待辦 |

### 2.2 資料夾：`shared/models/account`

| 任務 ID | 任務名稱 | 描述 | 優先級 | 狀態 |
|---------|----------|------|--------|------|
| MODEL-001 | 驗證模型定義完整性 | 檢查 `user.models.ts`、`bot.models.ts`、`organization.models.ts`、`team.models.ts` 是否完整，確保與 Repository 類型匹配 | 中 | 待辦 |
| MODEL-002 | 模型導出檢查 | 檢查 `index.ts` 是否正確導出所有模型，確保 Service 層可以正確使用 | 中 | 待辦 |

---

## Phase 3: Facade 層優化（五個資料夾架構分離）

### 3.1 資料夾：`core/facades/account`

| 任務 ID | 任務名稱 | 描述 | 優先級 | 狀態 |
|---------|----------|------|--------|------|
| FACADE-001 | 創建 BaseAccountCrudFacade | 創建 `base-account-crud.facade.ts`，封裝通用 CRUD 邏輯（executeCreate、executeUpdate、executeDelete、reloadWorkspaceData），減少重複代碼 | 高 | 待辦 |
| FACADE-002 | 重構 OrganizationFacade | 更新 `organization.facade.ts`，繼承 BaseAccountCrudFacade，簡化 createOrganization、updateOrganization、deleteOrganization 方法（從 150 行減少到約 50 行） | 高 | 待辦 |
| FACADE-003 | 重構 UserFacade | 更新 `user.facade.ts`，繼承 BaseAccountCrudFacade，簡化 createUser、updateUser、deleteUser 方法，統一錯誤處理 | 高 | 待辦 |
| FACADE-004 | 重構 TeamFacade | 更新 `team.facade.ts`，繼承 BaseAccountCrudFacade，簡化 createTeam、updateTeam、deleteTeam 方法 | 高 | 待辦 |
| FACADE-005 | 創建 BotFacade | 創建 `bot.facade.ts`，繼承 BaseAccountCrudFacade，實現 Bot 的 Facade 方法 | 高 | 待辦 |
| FACADE-006 | 更新 Facade 導出 | 更新 `index.ts`，導出 BaseAccountCrudFacade 和 BotFacade，確保所有 Facade 正確導出 | 高 | 待辦 |
| FACADE-007 | Facade 層單元測試 | 為所有 Facade 編寫單元測試，驗證 BaseAccountCrudFacade 的通用邏輯正確 | 中 | 待辦 |

---

## Phase 4: RLS 策略修復

| 任務 ID | 任務名稱 | 描述 | 優先級 | 狀態 |
|---------|----------|------|--------|------|
| RLS-001 | 創建 SECURITY DEFINER 函數 | 創建 Migration，實現 `get_user_account_id()` 函數，使用 `SECURITY DEFINER` 和 `SET row_security = off` 避免遞迴，函數內查詢 accounts 表時不觸發 RLS | 最高 | 待辦 |
| RLS-002 | 重寫 User RLS 策略 | 重寫 accounts 表的 User 相關 RLS 策略（users_view_own_user_account、users_update_own_user_account），確保不 JOIN accounts 表，直接使用 `auth.uid()` | 最高 | 待辦 |
| RLS-003 | 重寫 Organization RLS 策略 | 重寫 accounts 表的 Organization 相關 RLS 策略（users_view_organizations_they_belong_to、org_owners_update_organizations），使用 `get_user_account_id()` 函數避免遞迴 | 最高 | 待辦 |
| RLS-004 | 重寫 Bot RLS 策略 | 重寫 accounts 表的 Bot 相關 RLS 策略（users_view_bots_in_their_teams），使用 `get_user_account_id()` 函數避免遞迴 | 最高 | 待辦 |
| RLS-005 | RLS 策略測試 | 測試所有 RLS 策略，確保無無限遞迴錯誤，驗證租戶隔離正確，測試創建組織流程 | 最高 | 待辦 |

---

## Phase 5: Routes 層簡化

| 任務 ID | 任務名稱 | 描述 | 優先級 | 狀態 |
|---------|----------|------|--------|------|
| ROUTE-001 | 創建 FormUtils 工具類 | 創建 `shared/utils/form.utils.ts`，實現 `markFormGroupTouched` 和 `buildForm` 方法，減少表單驗證重複代碼 | 中 | 待辦 |
| ROUTE-002 | 簡化 CreateOrganizationComponent | 重構 `create-organization.component.ts`，使用 FormUtils 和 Facade 方法，從 82 行減少到約 40 行 | 中 | 待辦 |
| ROUTE-003 | 簡化 CreateTeamComponent | 重構 `create-team.component.ts`，使用 FormUtils 和 Facade 方法，減少代碼量 | 中 | 待辦 |
| ROUTE-004 | 簡化 UpdateOrganizationComponent | 重構 `update-organization.component.ts`，使用 FormUtils 和 Facade 方法，從 103 行減少到約 50 行 | 中 | 待辦 |
| ROUTE-005 | 簡化 UpdateTeamComponent | 重構 `update-team.component.ts`，使用 FormUtils 和 Facade 方法，減少代碼量 | 中 | 待辦 |
| ROUTE-006 | 簡化 DeleteOrganizationComponent | 重構 `delete-organization.component.ts`，使用 Facade 方法，從 73 行減少到約 40 行 | 中 | 待辦 |
| ROUTE-007 | 簡化 DeleteTeamComponent | 重構 `delete-team.component.ts`，使用 Facade 方法，減少代碼量 | 中 | 待辦 |
| ROUTE-008 | Routes 層 E2E 測試 | 為所有 Routes 組件編寫 E2E 測試，驗證 CRUD 操作正常 | 中 | 待辦 |

---

## Phase 6: 測試與文檔

| 任務 ID | 任務名稱 | 描述 | 優先級 | 狀態 |
|---------|----------|------|--------|------|
| TEST-001 | Repository 層整合測試 | 編寫 Repository 層整合測試，驗證與資料庫交互正確，驗證 type 過濾生效 | 中 | 待辦 |
| TEST-002 | Service 層整合測試 | 編寫 Service 層整合測試，驗證業務邏輯正確，驗證 Repository 依賴正確 | 中 | 待辦 |
| TEST-003 | Facade 層整合測試 | 編寫 Facade 層整合測試，驗證協調邏輯正確，驗證 BaseAccountCrudFacade 通用邏輯 | 中 | 待辦 |
| TEST-004 | 完整流程 E2E 測試 | 編寫完整流程 E2E 測試（創建組織、更新組織、刪除組織），驗證端到端功能，驗證無 RLS 無限遞迴 | 中 | 待辦 |
| TEST-005 | 性能測試 | 進行性能測試，確保重構後無性能退化，確保查詢性能正常 | 中 | 待辦 |
| DOC-001 | 更新架構文檔 | 更新架構文檔，說明新的 Repository/Service/Facade 層結構，說明五個資料夾的職責分離 | 中 | 待辦 |
| DOC-002 | 更新開發指南 | 更新開發指南，說明如何使用新的架構模式，說明如何創建新的 Repository/Service/Facade | 中 | 待辦 |

---

## 五個資料夾架構分離檢查清單

### 資料夾 1: `core/infra/repositories/account`

| 檢查項 | 狀態 | 備註 |
|--------|------|------|
| AccountRepository 在 index.ts 中定義 | ✅ 已存在 | 需要標記為 deprecated |
| UserRepository 存在且強制過濾 type='User' | ❌ 待創建 | REPO-001 |
| BotRepository 存在且強制過濾 type='Bot' | ❌ 待創建 | REPO-002 |
| OrganizationRepository 繼承 BaseRepository 且強制過濾 type='Organization' | ⚠️ 需重構 | 目前包裝 AccountRepository，需改為繼承 BaseRepository |
| TeamRepository 繼承 BaseRepository（teams 表） | ✅ 已存在 | 無需修改 |
| 所有 Repository 正確導出 | ⚠️ 需更新 | REPO-005 |
| Repository 層單元測試完整 | ❌ 待完成 | REPO-007 |

### 資料夾 2: `core/infra/types/account`

| 檢查項 | 狀態 | 備註 |
|--------|------|------|
| user.types.ts 類型定義完整 | ✅ 已存在 | TYPE-001 |
| bot.types.ts 類型定義完整 | ✅ 已存在 | TYPE-001 |
| organization.types.ts 類型定義完整 | ✅ 已存在 | TYPE-001 |
| team.types.ts 類型定義完整 | ✅ 已存在 | TYPE-001 |
| index.ts 正確導出所有類型 | ⚠️ 需檢查 | TYPE-002 |

### 資料夾 3: `shared/models/account`

| 檢查項 | 狀態 | 備註 |
|--------|------|------|
| user.models.ts 模型定義完整 | ✅ 已存在 | MODEL-001 |
| bot.models.ts 模型定義完整 | ✅ 已存在 | MODEL-001 |
| organization.models.ts 模型定義完整 | ✅ 已存在 | MODEL-001 |
| team.models.ts 模型定義完整 | ✅ 已存在 | MODEL-001 |
| index.ts 正確導出所有模型 | ⚠️ 需檢查 | MODEL-002 |

### 資料夾 4: `shared/services/account`

| 檢查項 | 狀態 | 備註 |
|--------|------|------|
| UserService 使用 UserRepository | ⚠️ 需重構 | 目前使用 AccountRepository，需改為 UserRepository |
| OrganizationService 使用 UserRepository（查詢 User）和 OrganizationRepository | ⚠️ 需重構 | 目前使用 AccountRepository 查詢 User |
| BotService 存在且使用 BotRepository | ❌ 待創建 | SVC-003 |
| TeamService 使用 TeamRepository | ✅ 已存在 | 無需修改 |
| index.ts 正確導出所有 Service | ⚠️ 需更新 | SVC-004 |
| Service 層單元測試完整 | ❌ 待完成 | SVC-005 |

### 資料夾 5: `core/facades/account`

| 檢查項 | 狀態 | 備註 |
|--------|------|------|
| BaseAccountCrudFacade 存在 | ❌ 待創建 | FACADE-001 |
| OrganizationFacade 繼承 BaseAccountCrudFacade | ⚠️ 需重構 | 目前獨立實現，需改為繼承 Base |
| UserFacade 繼承 BaseAccountCrudFacade | ⚠️ 需重構 | 目前獨立實現，需改為繼承 Base |
| TeamFacade 繼承 BaseAccountCrudFacade | ⚠️ 需重構 | 目前獨立實現，需改為繼承 Base |
| BotFacade 存在且繼承 BaseAccountCrudFacade | ❌ 待創建 | FACADE-005 |
| index.ts 正確導出所有 Facade | ⚠️ 需更新 | FACADE-006 |
| Facade 層單元測試完整 | ❌ 待完成 | FACADE-007 |

---

## 任務依賴關係

```
Phase 1 (Repository 層)
  ├── REPO-001: 創建 UserRepository
  ├── REPO-002: 創建 BotRepository
  ├── REPO-003: 重構 OrganizationRepository
  └── REPO-004: 更新 AccountRepository
  ↓
Phase 2 (Service 層) - 依賴 Phase 1
  ├── SVC-001: 重構 UserService (依賴 REPO-001)
  ├── SVC-002: 重構 OrganizationService (依賴 REPO-001, REPO-003)
  └── SVC-003: 創建 BotService (依賴 REPO-002)
  ↓
Phase 3 (Facade 層) - 依賴 Phase 2
  ├── FACADE-001: 創建 BaseAccountCrudFacade
  ├── FACADE-002: 重構 OrganizationFacade (依賴 FACADE-001, SVC-002)
  ├── FACADE-003: 重構 UserFacade (依賴 FACADE-001, SVC-001)
  ├── FACADE-004: 重構 TeamFacade (依賴 FACADE-001)
  └── FACADE-005: 創建 BotFacade (依賴 FACADE-001, SVC-003)
  ↓
Phase 4 (RLS 策略) - 可與 Phase 1-3 並行，但建議在 Phase 1 完成後進行
  ├── RLS-001: 創建 SECURITY DEFINER 函數
  ├── RLS-002: 重寫 User RLS 策略
  ├── RLS-003: 重寫 Organization RLS 策略 (依賴 RLS-001)
  └── RLS-004: 重寫 Bot RLS 策略 (依賴 RLS-001)
  ↓
Phase 5 (Routes 層) - 依賴 Phase 3
  ├── ROUTE-001: 創建 FormUtils
  └── ROUTE-002 至 ROUTE-007: 簡化 Routes 組件 (依賴 ROUTE-001, Phase 3)
  ↓
Phase 6 (測試與文檔) - 依賴所有 Phase
```

---

## 關鍵里程碑

| 里程碑 | 完成條件 | 預計時間 |
|--------|----------|----------|
| M1: Repository 層完成 | UserRepository、BotRepository 創建完成，OrganizationRepository 重構完成，單元測試通過 | Week 1 結束 |
| M2: Service 層完成 | 所有 Service 重構完成，BotService 創建完成，單元測試通過 | Week 2 開始 |
| M3: RLS 問題解決 | RLS 策略修復完成，無無限遞迴錯誤，創建組織流程正常 | Week 2-3 |
| M4: Facade 層完成 | BaseAccountCrudFacade 創建完成，所有 Facade 重構完成，代碼重用率提升 | Week 2 結束 |
| M5: Routes 層簡化完成 | 所有 Routes 組件簡化完成，代碼量減少 67% | Week 3 結束 |
| M6: 測試與文檔完成 | 所有測試通過，文檔更新完成 | Week 4 結束 |

---

## 風險任務標記

| 任務 ID | 風險等級 | 風險說明 | 緩解措施 |
|---------|----------|----------|----------|
| RLS-001 至 RLS-005 | 高 | RLS 策略修復可能影響現有功能，可能導致權限問題 | 在測試環境完整測試，保留舊策略備份，使用 Feature Flag |
| REPO-003 | 中 | OrganizationRepository 重構可能影響現有功能 | 保持向後兼容，分階段遷移，完整的單元測試 |
| SVC-001, SVC-002 | 中 | Service 層依賴變更可能影響現有功能 | 完整的單元測試和整合測試，保持 API 接口不變 |

---

## 完成標準

### 技術標準
- [ ] 所有 Repository 強制過濾 type，無運行時檢查
- [ ] 所有 Service 使用專用 Repository，職責清晰
- [ ] 所有 Facade 繼承 BaseAccountCrudFacade，代碼重用
- [ ] RLS 策略無無限遞迴錯誤
- [ ] 代碼量減少 67%（1,471 行 → 480 行）
- [ ] 測試覆蓋率 ≥80%

### 業務標準
- [ ] 創建組織成功率 100%
- [ ] 查詢性能無退化
- [ ] 錯誤率降低 50%

---

**最後更新**：2025-01-20  
**版本**：v1.1（修正版）  
**總任務數**：38 個  
**預計完成時間**：4 Weeks  
**修正說明**：根據實際專案結構修正，AccountRepository 定義在 index.ts 中，不是單獨文件