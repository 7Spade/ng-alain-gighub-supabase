# DevOps 規範

> **目的**: 本文檔定義 ng-alain-gighub 專案的 DevOps 規範，確保開發團隊遵循統一的標準。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents

## 規範內容

建置流程：type check → lint → test → build → deploy。

任何 PR 都必須經過至少 1 reviewer。

Conventional Commit 強制。

Versioning 使用 SemVer。

CI 必須產出 production build artifacts。

Sentry / APM 必須整合錯誤追蹤。

所有秘密由 Vault / Secret Manager 管理。

使用 GitHub Actions 自動化部署流程。

部署前必須通過所有測試（`yarn test`）。

部署前必須通過程式碼品質檢查（`yarn lint`）。

部署前必須通過型別檢查（`yarn type-check`）。

部署前必須成功建置（`yarn build`）。

部署前必須更新 CHANGELOG.md。

環境變數必須正確配置（開發、測試、生產）。

資料庫遷移必須在部署前準備（`supabase migration up --dry-run`）。

Edge Functions 必須通過測試（含 `branch-merge`、`staging-finalize`）。

使用 Supabase Hosting 或 CDN 部署前端應用。

使用 Supabase Cloud 部署後端服務。

實作自動化回滾機制。

監控部署狀態和錯誤。

記錄部署日誌。

設定部署通知（成功/失敗）。

定期備份資料庫（每日自動備份）。

實作 Point-in-Time Recovery（30 天內任意時間點還原）。

設定災難復原計畫（RTO 4小時、RPO 1小時）。

監控系統可用性（目標 99.9%）。

設定效能監控和告警。

定期執行安全審計。

使用環境隔離（開發、測試、生產）。

禁止在生產環境直接修改資料。

所有資料變更必須通過遷移腳本。

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**相關文檔**: [完整開發規範索引](./README.md)
