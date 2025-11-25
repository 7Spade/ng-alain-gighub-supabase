# Multi-Tenant SaaS Core Design Document
# 多租戶 SaaS 核心設計文件

## Document Information | 文件資訊

**Version:** 1.0  
**Date:** 2025-11-23  
**Status:** Complete Design Specification  
**Authors:** GitHub Copilot Agent  
**Project:** ng-alain-gighub-supabase  

**References:**
- [Account Context Switcher Design](./archive/2025/design-docs/ACCOUNT_CONTEXT_SWITCHER_DESIGN.md) (已封存 - 功能已實施)
- [Blueprint Container Planning](./archive/2025/design-docs/BLUEPRINT_CONTAINER_PLANNING.md) (已封存 - 功能已實施)
- [Supabase RLS Documentation](./supabase/security/rls.md)
- [Security Standards](./specs/00-security-standards.md)

---

## 1. Executive Summary | 執行摘要

### 1.1 Purpose | 目的

This document defines the complete architecture for a **Multi-Tenant SaaS** platform based on the ng-alain-gighub-supabase project. It addresses the six core design pillars required for enterprise-grade SaaS applications.

本文件定義基於 ng-alain-gighub-supabase 專案的**多租戶 SaaS** 平台完整架構，解決企業級 SaaS 應用所需的六大核心設計支柱。

---

## 2. Account & Identity Management | 帳號與身份管理

### 2.1 Account Types | 帳號類型

```typescript
// src/app/core/types/account.types.ts
export enum AccountType {
  USER = 'user',           // Personal account | 個人帳戶
  ORGANIZATION = 'organization', // Organization account | 組織帳戶
  TEAM = 'team',           // Team account | 團隊帳戶
  BOT = 'bot'              // Bot/Service account | 機器人帳戶
}

export interface BaseAccount {
  id: string;
  type: AccountType;
  name: string;
  avatarUrl?: string;
  status: AccountStatus;  // NEW: Status management
  metadata: AccountMetadata; // NEW: Extended metadata
  createdAt: Date;
  updatedAt: Date;
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  DELETED = 'deleted'
}

export interface AccountMetadata {
  department?: string;
  position?: string;
  location?: string;
  timezone?: string;
  language?: string;
  customFields?: Record<string, unknown>;
}
```
