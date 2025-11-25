# Blueprint 垂直切片架構分析報告

## 📋 執行摘要

本文件分析將 blueprint 模組從**橫向分層架構**遷移至**垂直切片架構**的可行性、優劣勢及實施建議。

**結論：建議採用垂直切片架構，但需謹慎漸進式實施。**

---

## 🎯 核心問題

> 將藍圖遷移並重構成垂直切片結構，是否會為未來開發帶來更大優勢？RLS 規則是否更好寫？

---

## 📊 當前架構 vs 提議架構

### 當前架構（橫向分層）

```
src/app/
├── core/
│   ├── infra/
│   │   ├── types/
│   │   │   ├── blueprint.types.ts       ← Types 層
│   │   │   └── task.types.ts
│   │   └── repositories/
│   │       ├── blueprint.repository.ts  ← Repositories 層
│   │       └── task.repository.ts
│   └── facades/
│       ├── blueprint.facade.ts          ← Facades 層
│       └── task.facade.ts
├── shared/
│   ├── models/
│   │   ├── blueprint.models.ts          ← Models 層
│   │   └── task.models.ts
│   └── services/
│       ├── blueprint/
│       │   └── blueprint.service.ts     ← Services 層
│       └── task/
│           └── task.service.ts
└── routes/
    └── blueprint/
        ├── blueprint-container.component.ts  ← Components 層
        └── task/
            └── task-list.component.ts
```

**特點：**
- ✅ 清晰的層級劃分
- ✅ 符合 angular-enterprise-development-guidelines.md
- ✅ 依賴方向明確：Types → Repositories → Models → Services → Facades → Components
- ❌ 修改一個 feature 需要跨 6+ 目錄
- ❌ 新成員 onboarding 困難
- ❌ RLS policy 設計時需要在多處查找 context

---

### 提議架構（垂直切片）

```
src/app/features/blueprint/
├── index.ts                          # Public API
├── blueprint.routes.ts               # Standalone 路由
│
├── shell/                            # 容器層 (Smart Components)
│   ├── blueprint-shell/
│   │   ├── blueprint-shell.component.ts
│   │   ├── blueprint-shell.component.html
│   │   └── blueprint-shell.component.less
│   └── dialogs/
│
├── ui/                               # 展示層 (Dumb Components)
│   ├── canvas/
│   ├── task/
│   ├── floor/
│   ├── work-zone/
│   └── shared/
│       ├── status-badge/
│       ├── priority-tag/
│       └── empty-state/
│
├── data-access/                      # 數據訪問層
│   ├── services/
│   │   ├── blueprint-api.service.ts
│   │   ├── task-api.service.ts
│   │   └── progress-api.service.ts
│   ├── stores/                       # Signal Store
│   │   ├── blueprint.store.ts
│   │   ├── task.store.ts
│   │   └── ui.store.ts
│   └── repositories/
│       ├── blueprint.repository.ts
│       └── task.repository.ts
│
├── domain/                           # 領域層
│   ├── models/
│   │   ├── project.model.ts
│   │   ├── floor-plan.model.ts
│   │   └── task.model.ts
│   ├── enums/
│   │   ├── task-status.enum.ts
│   │   └── priority.enum.ts
│   ├── interfaces/
│   │   ├── blueprint-config.interface.ts
│   │   └── canvas-options.interface.ts
│   └── types/
│       ├── canvas.types.ts
│       └── coordinate.types.ts
│
├── utils/                            # 工具函數層
│   ├── date/
│   ├── geometry/
│   ├── canvas/
│   └── validation/
│
├── directives/                       # 自定義指令
│   ├── draggable.directive.ts
│   └── resizable.directive.ts
│
├── pipes/                            # 自定義管道
│   ├── task-status.pipe.ts
│   └── progress-color.pipe.ts
│
├── guards/                           # 路由守衛
│   ├── project-access.guard.ts
│   └── unsaved-changes.guard.ts
│
└── constants/                        # 常量定義
    ├── task-status.constant.ts
    └── colors.constant.ts
```

**特點：**
- ✅ 所有相關代碼集中在一處
- ✅ Feature 完全獨立，易於並行開發
- ✅ RLS policy 設計時 context 完整可見
- ✅ 符合 Nx, DDD, Clean Architecture 最佳實踐
- ✅ 依賴方向仍保持正確
- ⚠️ 需要明確定義 Shared vs Feature-specific 的界線
- ⚠️ 可能有代碼重複風險

---

## 🔍 與企業級規範的相容性分析

### angular-enterprise-development-guidelines.md 核心規範

#### 1. 分層順序（完全符合）
```
Types → Repositories → Models → Services → Facades → Components
```

**垂直切片中的體現：**
```
domain/types → data-access/repositories → domain/models 
→ data-access/services → data-access/stores → shell (smart components)
```

✅ **依賴方向不變，只是物理位置改變**

---

#### 2. 模組邊界管理

##### 2.1 Feature Module（完全符合）
- ✅ 每個業務領域建立獨立 Feature Module
- ✅ 各 Feature 之間禁止互相 import
- ✅ 必須支援 Lazy Load

**垂直切片的實現：**
```typescript
// features/blueprint/index.ts
export * from './shell/blueprint-shell/blueprint-shell.component';
export * from './domain/models'; // 公開必要的型別
// 不公開內部實作細節
```

---

##### 2.2 Infrastructure Module（需要調整理解）

**原規範：**
> "放置 Supabase Client、Repositories、Http Adapter"

**垂直切片的調整：**
- **共用 Infrastructure** 仍在 `core/infra/`：
  - Supabase Client
  - Auth Service
  - Http Interceptors
  - 全域 Error Handler

- **Feature-Specific Infrastructure** 在 `features/blueprint/data-access/`：
  - Blueprint Repository
  - Task Repository
  - Feature-specific API services

**結論：** ✅ 不違反精神，是「分散式 Infrastructure」的實現方式
