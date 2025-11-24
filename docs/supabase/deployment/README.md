# Supabase 部署文檔 | Supabase Deployment Documentation

> **目的**: 本目錄包含 Supabase 部署相關文檔  
> **最後更新**: 2025-01-20

---

## 📋 目標讀者 (Audience)

- DevOps 工程師
- 系統管理員
- 部署負責人

---

## 📚 文檔清單

- **environments.md** ⭐⭐⭐⭐⭐ - 環境配置管理
  - 多環境配置
  - 環境變數管理
  - 環境切換
  - 配置最佳實踐

- **cicd.md** ⭐⭐⭐⭐ - CI/CD 整合流程
  - CI/CD 設置
  - 自動化部署
  - 測試整合
  - 部署流程

- **migrations.md** ⭐⭐⭐⭐⭐ - 資料庫遷移策略
  - 遷移管理
  - 遷移執行
  - 回滾策略
  - 版本控制

- **backup.md** ⭐⭐⭐⭐ - 備份與災難恢復
  - 備份策略
  - 備份執行
  - 恢復流程
  - 災難恢復計劃

---

## 🚀 部署流程

### 標準部署流程

1. **準備環境**
   - 配置環境變數
   - 確認資料庫狀態

2. **執行遷移**
   - 執行資料庫遷移
   - 驗證遷移結果

3. **部署應用**
   - 部署前端應用
   - 部署 Edge Functions（如有）

4. **驗證部署**
   - 檢查服務狀態
   - 執行健康檢查

詳見各部署文檔。

---

## 📖 相關文檔

- [../../deployment/](../../deployment/) - 專案部署文檔
- [../development/local-workflow.md](../development/local-workflow.md) - 本地開發流程

---

**最後更新**: 2025-01-20  
**維護者**: DevOps 團隊

