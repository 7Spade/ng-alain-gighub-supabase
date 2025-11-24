# Supabase 安全性文檔 | Supabase Security Documentation

> **目的**: 本目錄包含 Supabase 安全性相關文檔  
> **最後更新**: 2025-01-20

---

## 📋 目標讀者 (Audience)

- 安全工程師
- 開發者
- 技術主管

---

## 📚 文檔清單

- **rls.md** ⭐⭐⭐⭐⭐ - Row Level Security 策略
  - RLS 基礎概念
  - 策略設計
  - 策略實作
  - 測試與驗證

- **authentication.md** ⭐⭐⭐⭐ - 身份驗證最佳實踐
  - 認證流程
  - Session 管理
  - 密碼策略
  - 多因素認證 (MFA)

- **encryption.md** ⭐⭐⭐⭐ - 資料加密策略
  - 資料加密原則
  - 敏感資料處理
  - 傳輸加密
  - 儲存加密

- **api-keys.md** ⭐⭐⭐⭐ - API 金鑰管理
  - 金鑰類型
  - 金鑰輪換
  - 金鑰安全
  - 最佳實踐

---

## 🔒 安全重點

### Row Level Security (RLS)

- ✅ 所有表啟用 RLS
- ✅ 設計明確的存取策略
- ✅ 測試策略有效性
- ✅ 定期審查策略

### 身份驗證

- ✅ 使用強密碼策略
- ✅ 實作 Session 管理
- ✅ 考慮多因素認證
- ✅ 保護認證端點

### 資料保護

- ✅ 加密敏感資料
- ✅ 使用 HTTPS
- ✅ 實作輸入驗證
- ✅ 防止 SQL 注入

---

## 📖 相關文檔

- [../../security/](../../security/) - 專案安全文檔
- [../architecture/auth.md](../architecture/auth.md) - 認證架構
- [../../guides/security-checklist.md](../../guides/security-checklist.md) - 安全檢查清單

---

**最後更新**: 2025-01-20  
**維護者**: 安全團隊

