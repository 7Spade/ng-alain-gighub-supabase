# DELON-Index

> **說明**：此資料夾包含所有 @delon 包的詳細文檔

## 結構說明

每個包都有獨立的文檔文件，命名格式為：`[序號]-[包名稱].md`

例如：
- `01-@delon-abc.md` - @delon/abc 業務組件庫
- `02-@delon-acl.md` - @delon/acl 訪問控制列表
- `03-@delon-auth.md` - @delon/auth 認證服務

## 文檔內容

每個包文檔包含：
- 基本信息（包說明、版本、官方文檔）
- 安裝方式
- 使用方式（導入模組、SHARED_IMPORTS 使用）
- 主要功能與組件
- 基本用法示例
- 相關資源連結

## 包列表

### 生產依賴（dependencies）

1. **@delon/abc** - 業務組件庫（ST 表格、SV 鍵值描述、SE 表單佈局等）
2. **@delon/acl** - 訪問控制列表（權限控制）
3. **@delon/auth** - 認證服務（登錄、登出、Token 管理）
4. **@delon/cache** - 緩存服務（本地存儲、內存緩存）
5. **@delon/chart** - 圖表組件（基於 G2）
6. **@delon/form** - 動態表單（JSON Schema 驅動）
7. **@delon/mock** - Mock 數據服務（開發環境模擬 API）
8. **@delon/theme** - 主題系統（佈局、樣式、國際化）
9. **@delon/util** - 工具函數庫（常用工具函數）

### 開發依賴（devDependencies）

10. **@delon/testing** - 測試工具（測試輔助函數）

**總計**：10 個包

## 相關資源

- [ng-alain 官方文檔](https://ng-alain.com)
- [@delon GitHub 倉庫](https://github.com/ng-alain/delon)
- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

