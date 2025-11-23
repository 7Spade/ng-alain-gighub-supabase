# DELON-Index 索引

## 📑 目錄

- [📋 目錄](#-目錄)
- [包列表](#包列表)
  - [業務組件 (Business Components)](#業務組件-business-components)
    - [[@delon/abc - 業務組件庫](./DELON-Index/01-@delon-abc.md)](#delonabc---業務組件庫delon-index01-delon-abcmd)
    - [[@delon/form - 動態表單](./DELON-Index/06-@delon-form.md)](#delonform---動態表單delon-index06-delon-formmd)
  - [核心服務 (Core Services)](#核心服務-core-services)
    - [[@delon/auth - 認證服務](./DELON-Index/03-@delon-auth.md)](#delonauth---認證服務delon-index03-delon-authmd)
    - [[@delon/cache - 緩存服務](./DELON-Index/04-@delon-cache.md)](#deloncache---緩存服務delon-index04-delon-cachemd)
    - [[@delon/acl - 訪問控制列表](./DELON-Index/02-@delon-acl.md)](#delonacl---訪問控制列表delon-index02-delon-aclmd)
  - [UI 組件 (UI Components)](#ui-組件-ui-components)
    - [[@delon/chart - 圖表組件](./DELON-Index/05-@delon-chart.md)](#delonchart---圖表組件delon-index05-delon-chartmd)
    - [[@delon/theme - 主題系統](./DELON-Index/08-@delon-theme.md)](#delontheme---主題系統delon-index08-delon-thememd)
  - [工具庫 (Utilities)](#工具庫-utilities)
    - [[@delon/util - 工具函數庫](./DELON-Index/09-@delon-util.md)](#delonutil---工具函數庫delon-index09-delon-utilmd)
    - [[@delon/mock - Mock 數據服務](./DELON-Index/07-@delon-mock.md)](#delonmock---mock-數據服務delon-index07-delon-mockmd)
    - [[@delon/testing - 測試工具](./DELON-Index/10-@delon-testing.md)](#delontesting---測試工具delon-index10-delon-testingmd)
- [使用指南](#使用指南)
  - [快速開始](#快速開始)
  - [優先使用 SHARED_IMPORTS](#優先使用-shared_imports)
  - [包分類說明](#包分類說明)
- [參考文檔](#參考文檔)
  - [專案文檔](#專案文檔)
  - [官方文檔](#官方文檔)
  - [相關索引](#相關索引)

---


> 📋 **目的**：提供 @delon 套件索引和配置參考，包含常用組件和最佳實踐

**最後更新**：2025-11-15
**維護者**：開發團隊
**版本**：基於 @delon ^20.1.0
**驗證來源**：ng-alain 官方文檔、專案 `shared-delon.module.ts`

- --

## 📋 目錄

- [包列表](#包列表)
- [使用指南](#使用指南)
- [參考文檔](#參考文檔)

- --

## 包列表

> **說明**：每個包都有獨立的詳細使用指南，點擊包名稱查看詳細信息。

> **📁 詳細文檔位置**：所有包詳細文檔位於 [`DELON-Index/`](./DELON-Index/) 資料夾

### 業務組件 (Business Components)

#### [@delon/abc - 業務組件庫](./DELON-Index/01-@delon-abc.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/abc` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/abc](https://ng-alain.com/components) |
| **主要功能** | 提供業務組件庫，包含 ST 表格、SV 鍵值描述、SE 表單佈局等 17 個子組件 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/01-@delon-abc.md) |

**主要組件**：
- ST (Smart Table) - 智能表格
- SV (Simple View) - 鍵值描述視圖
- SE (Simple Edit) - 表單佈局
- PageHeader - 頁面標題
- ReuseTab - 標籤頁（路由快取）
- 更多...（共 17 個組件）

#### [@delon/form - 動態表單](./DELON-Index/06-@delon-form.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/form` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/form](https://ng-alain.com/form) |
| **主要功能** | 基於 JSON Schema 的動態表單生成與驗證 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/06-@delon-form.md) |

- --

### 核心服務 (Core Services)

#### [@delon/auth - 認證服務](./DELON-Index/03-@delon-auth.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/auth` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/auth](https://ng-alain.com/auth) |
| **主要功能** | 提供認證服務，包括登錄、登出、Token 管理等功能 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/03-@delon-auth.md) |

#### [@delon/cache - 緩存服務](./DELON-Index/04-@delon-cache.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/cache` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/cache](https://ng-alain.com/cache) |
| **主要功能** | 提供緩存服務，支持本地存儲、會話存儲和內存緩存 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/04-@delon-cache.md) |

#### [@delon/acl - 訪問控制列表](./DELON-Index/02-@delon-acl.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/acl` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/acl](https://ng-alain.com/acl) |
| **主要功能** | 提供訪問控制列表（ACL）功能，用於權限控制 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/02-@delon-acl.md) |

- --

### UI 組件 (UI Components)

#### [@delon/chart - 圖表組件](./DELON-Index/05-@delon-chart.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/chart` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/chart](https://ng-alain.com/docs/chart) |
| **主要功能** | 提供圖表組件，基於 G2 和 ECharts 構建，包含 15 個圖表組件 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/05-@delon-chart.md) |

**主要組件**：
- G2Bar - 柱狀圖
- G2Pie - 餅圖
- G2MiniArea - 迷你面積圖
- ChartECharts - ECharts 圖表
- 更多...（共 15 個組件）

#### [@delon/theme - 主題系統](./DELON-Index/08-@delon-theme.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/theme` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/theme](https://ng-alain.com/theme) |
| **主要功能** | 提供主題系統，包括佈局、樣式、國際化等功能 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/08-@delon-theme.md) |

- --

### 工具庫 (Utilities)

#### [@delon/util - 工具函數庫](./DELON-Index/09-@delon-util.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/util` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/util](https://ng-alain.com/util) |
| **主要功能** | 提供常用工具函數，包括格式化、轉換、驗證等功能 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/09-@delon-util.md) |

**主要模組**：
- @delon/util/array - 數組與樹操作
- @delon/util/browser - 瀏覽器相關
- @delon/util/date-time - 日期時間轉換
- @delon/util/format - 字符格式化
- 更多...（共 10 個模組）

#### [@delon/mock - Mock 數據服務](./DELON-Index/07-@delon-mock.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/mock` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/mock](https://ng-alain.com/mock) |
| **主要功能** | 提供 Mock 數據服務，用於開發環境模擬 API 響應 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/07-@delon-mock.md) |

#### [@delon/testing - 測試工具](./DELON-Index/10-@delon-testing.md)

| 項目 | 內容 |
|------|------|
| **包名稱** | `@delon/testing` |
| **版本** | ^20.1.0 |
| **官方文檔** | [@delon/testing](https://ng-alain.com/testing) |
| **主要功能** | 提供測試輔助函數和工具，用於單元測試和集成測試 |
| **詳細文檔** | [查看詳細文檔](./DELON-Index/10-@delon-testing.md) |

- --

## 使用指南

### 快速開始

1. **安裝依賴**：所有 @delon 包已包含在專案依賴中（`package.json`）
2. **導入模組**：優先使用 `SHARED_IMPORTS`，避免零碎引入
3. **查看文檔**：點擊上方包名稱查看詳細使用指南

### 優先使用 SHARED_IMPORTS

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // ✅ 包含所有 @delon 組件
  // ...
})
export class ExampleComponent {}
```

詳細說明請參考：[SHARED_IMPORTS 使用指南](./reference/shared-imports-guide.md)

### 包分類說明

- **業務組件**：提供業務場景常用的組件，如表格、表單、頁面標題等
- **核心服務**：提供認證、緩存、權限等核心功能服務
- **UI 組件**：提供圖表、主題等 UI 相關組件
- **工具庫**：提供工具函數、Mock 數據、測試工具等

- --

## 參考文檔

### 專案文檔

- [SHARED_IMPORTS 使用指南](./reference/shared-imports-guide.md) - 共享模組使用指南 ⭐ 必讀
- [開發作業指引](./specs/00-development-guidelines.md) - 開發規範
- [專案結構說明](./architecture/02-project-structure-flowchart.mermaid.md) - 專案結構

### 官方文檔

- [ng-alain 官方文檔](https://ng-alain.com) - ng-alain 框架官方文檔
- [@delon GitHub 倉庫](https://github.com/ng-alain/delon) - @delon 源碼倉庫

### 相關索引

- [NG-ZORRO-Index 索引](./reference/ng-zorro-component-cli-reference.md) - ng-zorro-antd 組件索引

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15


