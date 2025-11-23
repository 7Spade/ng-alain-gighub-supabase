# 命名標準化規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 命名標準化規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

所有檔案一律使用 kebab-case。

Component 名稱必須以 -component 結尾（ex: user-card.component.ts）。

Page/route component 需加上 .page.ts。

Service 名稱必須以 Service 結尾（ex: UserService）。

Facade 必須以 Facade 結尾（ex: UserFacade）。

Repository 必須以 Repository 結尾（ex: UserRepository）。

Model 必須以 .model.ts 命名，避免混淆。

DTO（後端傳來的資料）必須以 .dto.ts 命名。

UI model 必須以 .view-model.ts 命名以區分業務 model。

Constant 必須為 SNAKE_CASE（如 MAX_PAGE_SIZE）。

Enum 使用 PascalCase，成員使用 PascalCase。

Signals 使用 prefix：
- 狀態：xxxState = signal()
- 計算：xxxComputed = computed()
- 副作用：xxxEffect = effect()

RxJS observable 使用 $ 結尾（企業標準）。

Route path 命名使用 kebab-case，不得用 camelCase。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
