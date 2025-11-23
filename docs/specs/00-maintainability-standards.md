# 可維護性規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 可維護性規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

strict: true 必須開啟。

interface > type（除 function signature）。

model 檔案需強制分開：*.model.ts，*.dto.ts，*.entity.ts。

禁止 any / unknown（除非有註解）。

import 路徑必須為 alias（絕對路徑）。

每個資料夾必須有 index.ts 作為 public API。

Utils 必須 pure（無 side-effect）。

靜態常數放 constants.ts，不放在 component/service。

大型 Enum 改用 string literal union。

避免非必要的泛型。

注解（decorator）不可自行擴展。

File naming 統一 kebab-case。

一個檔案只放一個 class。

任何邏輯重覆兩次以上必須抽 service 或 utils。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
