# UI/UX 設計規範


> **📚 目的**: 定義 UI/UX 設計規範，確保使用者介面的一致性與可用性

## 目標讀者 (Audience)

- 前端開發者
- UI/UX 設計師

---


## 📑 目錄

- [📋 目錄](#-目錄)
- [設計原則](#設計原則)
  - [1. 一致性 (Consistency)](#1-一致性-consistency)
  - [2. 清晰性 (Clarity)](#2-清晰性-clarity)
  - [3. 效率性 (Efficiency)](#3-效率性-efficiency)
  - [4. 容錯性 (Error Tolerance)](#4-容錯性-error-tolerance)
- [設計系統](#設計系統)
  - [1. NG-ZORRO + NG-ALAIN](#1-ng-zorro--ng-alain)
  - [2. 設計 Token](#2-設計-token)
    - [主題配置](#主題配置)
- [色彩系統](#色彩系統)
  - [1. 主色調 (Primary Colors)](#1-主色調-primary-colors)
  - [2. 功能色 (Functional Colors)](#2-功能色-functional-colors)
  - [3. 中性色 (Neutral Colors)](#3-中性色-neutral-colors)
  - [4. 色彩使用規範](#4-色彩使用規範)
- [字體排版](#字體排版)
  - [1. 字體家族](#1-字體家族)
  - [2. 字體大小](#2-字體大小)
  - [3. 字重 (Font Weight)](#3-字重-font-weight)
  - [4. 排版範例](#4-排版範例)
- [間距系統](#間距系統)
  - [1. 間距單位](#1-間距單位)
  - [2. 使用場景](#2-使用場景)
- [組件設計](#組件設計)
  - [1. 按鈕 (Button)](#1-按鈕-button)
    - [類型](#類型)
    - [尺寸](#尺寸)
    - [狀態](#狀態)
  - [2. 表單 (Form)](#2-表單-form)
    - [佈局](#佈局)
    - [驗證](#驗證)
  - [3. 卡片 (Card)](#3-卡片-card)
  - [4. 表格 (Table)](#4-表格-table)
- [響應式設計](#響應式設計)
  - [1. 斷點系統](#1-斷點系統)
  - [2. 柵格系統](#2-柵格系統)
  - [3. 響應式圖片](#3-響應式圖片)
- [可訪問性](#可訪問性)
  - [1. WCAG 2.1 AA 標準](#1-wcag-21-aa-標準)
  - [2. 語義化 HTML](#2-語義化-html)
  - [3. ARIA 屬性](#3-aria-屬性)
  - [4. 焦點管理](#4-焦點管理)
- [互動設計](#互動設計)
  - [1. 載入狀態](#1-載入狀態)
  - [2. 反饋機制](#2-反饋機制)
  - [3. 動畫效果](#3-動畫效果)
- [最佳實踐](#最佳實踐)
  - [1. 設計一致性檢查清單](#1-設計一致性檢查清單)
  - [2. 可用性檢查清單](#2-可用性檢查清單)
  - [3. 可訪問性檢查清單](#3-可訪問性檢查清單)
- [相關文檔](#相關文檔)

---


> **目的**：建立統一的 UI/UX 設計標準，確保應用程式的一致性、可用性和可訪問性

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：Development Team

- --

## 📋 目錄

1. [設計原則](#設計原則)
2. [設計系統](#設計系統)
3. [色彩系統](#色彩系統)
4. [字體排版](#字體排版)
5. [間距系統](#間距系統)
6. [組件設計](#組件設計)
7. [響應式設計](#響應式設計)
8. [可訪問性](#可訪問性)
9. [互動設計](#互動設計)
10. [最佳實踐](#最佳實踐)

- --

## 設計原則

### 1. 一致性 (Consistency)

**視覺一致性**
- 使用統一的色彩、字體、圖示系統
- 保持相似元素的外觀和行為一致
- 遵循平台設計規範（Material Design 原則）

**功能一致性**
- 相同操作使用相同的互動模式
- 統一的錯誤處理和反饋機制
- 一致的資訊架構和導航結構

### 2. 清晰性 (Clarity)

**視覺清晰**
- 清晰的視覺層次結構
- 適當的對比度和可讀性
- 避免視覺雜亂

**內容清晰**
- 使用簡潔明瞭的文案
- 提供清楚的操作指引
- 明確的狀態反饋

### 3. 效率性 (Efficiency)

**操作效率**
- 減少點擊次數和操作步驟
- 提供快捷鍵和批次操作
- 智慧預設值和自動完成

**載入效率**
- 優化頁面載入速度
- 使用骨架屏和進度指示
- 實施懶加載策略

### 4. 容錯性 (Error Tolerance)

**防錯設計**
- 使用約束和驗證防止錯誤
- 提供清楚的錯誤訊息
- 支援撤銷和恢復操作

**錯誤恢復**
- 優雅的錯誤處理
- 自動儲存和恢復機制
- 明確的補救措施

- --

## 設計系統

### 1. NG-ZORRO + NG-ALAIN

本專案基於 **NG-ZORRO** (Ant Design for Angular) 和 **NG-ALAIN** 構建設計系統。

**核心元件庫**
- NG-ZORRO：提供豐富的 UI 組件
- NG-ALAIN：提供業務組件和範本
- 自訂共用元件：專案特定的共用組件

### 2. 設計 Token

#### 主題配置

```scss
// styles/theme.scss

// 主色調
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;
$info-color: #1890ff;

// 中性色
$text-color: rgba(0, 0, 0, 0.85);
$text-color-secondary: rgba(0, 0, 0, 0.65);
$text-color-tertiary: rgba(0, 0, 0, 0.45);
$border-color: #d9d9d9;
$background-color: #f0f2f5;

// 字體
$font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
$font-size-base: 14px;
$line-height-base: 1.5715;

// 陰影
$shadow-1: 0 2px 8px rgba(0, 0, 0, 0.15);
$shadow-2: 0 4px 12px rgba(0, 0, 0, 0.15);
$shadow-3: 0 6px 16px rgba(0, 0, 0, 0.08);

// 圓角
$border-radius-base: 2px;
$border-radius-sm: 2px;
$border-radius-lg: 4px;

// 間距
$padding-xs: 8px;
$padding-sm: 12px;
$padding-md: 16px;
$padding-lg: 24px;
$padding-xl: 32px;
```

- --

## 色彩系統

### 1. 主色調 (Primary Colors)

```scss
// 主色調色板（藍色系）
$blue-1: #e6f7ff;   // 最淺
$blue-2: #bae7ff;
$blue-3: #91d5ff;
$blue-4: #69c0ff;
$blue-5: #40a9ff;
$blue-6: #1890ff;   // 主色
$blue-7: #096dd9;
$blue-8: #0050b3;
$blue-9: #003a8c;
$blue-10: #002766;  // 最深
```

### 2. 功能色 (Functional Colors)

| 用途 | 色彩 | Hex | 使用場景 |
|------|------|-----|---------|
| **成功** | 綠色 | `#52c41a` | 成功操作、完成狀態 |
| **警告** | 橙色 | `#faad14` | 警告訊息、待處理 |
| **錯誤** | 紅色 | `#f5222d` | 錯誤訊息、危險操作 |
| **資訊** | 藍色 | `#1890ff` | 提示訊息、中性操作 |

### 3. 中性色 (Neutral Colors)

```scss
$gray-1: #ffffff;   // 白色
$gray-2: #fafafa;   // 背景色（淺）
$gray-3: #f5f5f5;
$gray-4: #f0f0f0;
$gray-5: #d9d9d9;   // 邊框色
$gray-6: #bfbfbf;
$gray-7: #8c8c8c;
$gray-8: #595959;   // 次要文字
$gray-9: #434343;
$gray-10: #262626;  // 主要文字
$gray-11: #1f1f1f;
$gray-12: #141414;  // 最深
$gray-13: #000000;  // 黑色
```

### 4. 色彩使用規範

✅ **Do**
- 使用主色調表示主要操作和品牌元素
- 功能色用於對應的狀態反饋
- 保持 4.5:1 以上的對比度（文字與背景）

❌ **Don't**
- 不要使用過多顏色造成視覺雜亂
- 不要單純依賴顏色傳達資訊（考慮色盲使用者）
- 不要使用低對比度的色彩組合

- --

## 字體排版

### 1. 字體家族

```scss
// 主要字體
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
  'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
  'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

// 等寬字體（程式碼）
$font-family-code: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;

// 中文字體優化
$font-family-zh: 'PingFang SC', 'Microsoft YaHei', '微軟雅黑', sans-serif;
```

### 2. 字體大小

| 類型 | 大小 | 行高 | 使用場景 |
|------|------|------|---------|
| **H1** | 38px | 1.23 | 頁面主標題 |
| **H2** | 30px | 1.35 | 區塊標題 |
| **H3** | 24px | 1.35 | 子標題 |
| **H4** | 20px | 1.4 | 小標題 |
| **Body Large** | 16px | 1.5 | 重點內容 |
| **Body** | 14px | 1.57 | 主要內容（預設） |
| **Body Small** | 12px | 1.66 | 次要資訊 |
| **Caption** | 12px | 1.66 | 輔助說明 |

### 3. 字重 (Font Weight)

```scss
$font-weight-light: 300;
$font-weight-regular: 400;   // 預設
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 4. 排版範例

```html
<h1 class="text-3xl font-semibold mb-4">頁面標題</h1>
<h2 class="text-2xl font-medium mb-3">區塊標題</h2>
<p class="text-base text-gray-8 leading-relaxed">
  這是主要內容文字，使用 14px 字體大小和 1.57 行高。
</p>
<small class="text-sm text-gray-7">輔助說明文字</small>
```

- --

## 間距系統

### 1. 間距單位

採用 **8px 基礎單位系統**：

```scss
$space-1: 4px;    // 0.5x
$space-2: 8px;    // 1x（基礎單位）
$space-3: 12px;   // 1.5x
$space-4: 16px;   // 2x
$space-5: 20px;   // 2.5x
$space-6: 24px;   // 3x
$space-8: 32px;   // 4x
$space-10: 40px;  // 5x
$space-12: 48px;  // 6x
$space-16: 64px;  // 8x
```

### 2. 使用場景

| 間距 | 使用場景 |
|------|---------|
| 4px | 圖示與文字、緊密元素 |
| 8px | 表單元素內部、按鈕內邊距 |
| 12px | 卡片內邊距、列表項間距 |
| 16px | 區塊內容間距（預設） |
| 24px | 區塊之間間距 |
| 32px | 大區塊間距 |
| 48px+ | 頁面級間距 |

- --

## 組件設計

### 1. 按鈕 (Button)

#### 類型

```html
<!-- 主要按鈕 -->
<button nz-button nzType="primary">主要操作</button>

<!-- 次要按鈕 -->
<button nz-button>次要操作</button>

<!-- 虛線按鈕 -->
<button nz-button nzType="dashed">虛線按鈕</button>

<!-- 文字按鈕 -->
<button nz-button nzType="link">文字連結</button>

<!-- 危險按鈕 -->
<button nz-button nzType="primary" nzDanger>刪除</button>
```

#### 尺寸

```html
<button nz-button nzSize="large">大按鈕</button>
<button nz-button>預設按鈕</button>
<button nz-button nzSize="small">小按鈕</button>
```

#### 狀態

```html
<!-- 載入中 -->
<button nz-button nzType="primary" [nzLoading]="isLoading()">
  儲存
</button>

<!-- 禁用 -->
<button nz-button [disabled]="true">禁用按鈕</button>
```

### 2. 表單 (Form)

#### 佈局

```html
<form nz-form [formGroup]="form" nzLayout="vertical">
  <!-- 垂直佈局（預設） -->
  <nz-form-item>
    <nz-form-label nzRequired>使用者名稱</nz-form-label>
    <nz-form-control nzErrorTip="請輸入使用者名稱">
      <input nz-input formControlName="username" placeholder="請輸入" />
    </nz-form-control>
  </nz-form-item>

  <!-- 水平佈局 -->
  <nz-form-item nzLayout="horizontal">
    <nz-form-label [nzSpan]="6">電子郵件</nz-form-label>
    <nz-form-control [nzSpan]="18">
      <input nz-input formControlName="email" type="email" />
    </nz-form-control>
  </nz-form-item>
</form>
```

#### 驗證

```typescript
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-example',
  template: `...`
})
export class FormExampleComponent {
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder) {}
}
```

### 3. 卡片 (Card)

```html
<nz-card nzTitle="卡片標題" [nzExtra]="extraTemplate">
  <p>卡片內容</p>
</nz-card>

<ng-template #extraTemplate>
  <a>更多</a>
</ng-template>
```

### 4. 表格 (Table)

```html
<nz-table #table [nzData]="data()" [nzLoading]="loading()">
  <thead>
    <tr>
      <th>姓名</th>
      <th>年齡</th>
      <th>地址</th>
      <th>操作</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let item of table.data">
      <td>{{ item.name }}</td>
      <td>{{ item.age }}</td>
      <td>{{ item.address }}</td>
      <td>
        <a (click)="edit(item)">編輯</a>
        <nz-divider nzType="vertical"></nz-divider>
        <a (click)="delete(item)" class="text-red-500">刪除</a>
      </td>
    </tr>
  </tbody>
</nz-table>
```

- --

## 響應式設計

### 1. 斷點系統

```scss
// NG-ZORRO 斷點
$screen-xs: 480px;   // 手機
$screen-sm: 576px;   // 平板直向
$screen-md: 768px;   // 平板橫向
$screen-lg: 992px;   // 筆記型電腦
$screen-xl: 1200px;  // 桌面
$screen-xxl: 1600px; // 大螢幕
```

### 2. 柵格系統

```html
<div nz-row [nzGutter]="16">
  <!-- 手機 24 列，平板 12 列，桌面 8 列 -->
  <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8">
    <nz-card>內容 1</nz-card>
  </div>
  <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8">
    <nz-card>內容 2</nz-card>
  </div>
  <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8">
    <nz-card>內容 3</nz-card>
  </div>
</div>
```

### 3. 響應式圖片

```html
<!-- 使用 srcset -->
<img
  src="image-400.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="描述文字"
/>
```

- --

## 可訪問性

### 1. WCAG 2.1 AA 標準

**色彩對比度**
- 正常文字：至少 4.5:1
- 大字體（18pt+ 或 14pt 粗體+）：至少 3:1
- UI 組件和圖形：至少 3:1

**鍵盤操作**
- 所有互動元素可用鍵盤存取
- 提供清晰的焦點指示
- 支援 Tab、Enter、Space、Arrow keys

### 2. 語義化 HTML

✅ **Do**
```html
<header>
  <nav>
    <ul>
      <li><a href="/dashboard">儀表板</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>標題</h1>
    <p>內容</p>
  </article>
</main>

<footer>
  <p>&copy; 2025 NG-ALAIN GitHub</p>
</footer>
```

❌ **Don't**
```html
<div class="header">
  <div class="nav">
    <div class="link">儀表板</div>
  </div>
</div>
```

### 3. ARIA 屬性

```html
<!-- 按鈕 -->
<button aria-label="關閉對話框" (click)="close()">
  <span aria-hidden="true">×</span>
</button>

<!-- 表單 -->
<label for="username">使用者名稱</label>
<input
  id="username"
  type="text"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="username-hint"
/>
<span id="username-hint">請輸入 3-20 個字元</span>

<!-- 對話框 -->
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
  aria-modal="true"
>
  <h2 id="dialog-title">確認刪除</h2>
  <p id="dialog-desc">此操作無法恢復</p>
</div>
```

### 4. 焦點管理

```typescript
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog',
  template: `
    <div class="dialog">
      <button #closeBtn (click)="close()">關閉</button>
    </div>
  `
})
export class DialogComponent {
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  ngAfterViewInit(): void {
    // 對話框開啟時聚焦到關閉按鈕
    this.closeBtn.nativeElement.focus();
  }
}
```

- --

## 互動設計

### 1. 載入狀態

```html
<!-- 骨架屏 -->
<nz-skeleton [nzActive]="true" [nzLoading]="loading()">
  <nz-card>
    <!-- 實際內容 -->
  </nz-card>
</nz-skeleton>

<!-- 進度條 -->
<nz-progress [nzPercent]="progress()" />

<!-- 載入指示器 -->
<nz-spin [nzSpinning]="loading()">
  <div>內容區域</div>
</nz-spin>
```

### 2. 反饋機制

```typescript
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export class FeedbackExample {
  private message = inject(NzMessageService);
  private notification = inject(NzNotificationService);

  showSuccess(): void {
    this.message.success('操作成功');
  }

  showError(): void {
    this.message.error('操作失敗，請重試');
  }

  showNotification(): void {
    this.notification.success(
      '系統通知',
      '您有新的訊息',
      { nzDuration: 4500 }
    );
  }
}
```

### 3. 動畫效果

```scss
// 過渡動畫
.fade-enter {
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

// 懸停效果
.button {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
```

- --

## 最佳實踐

### 1. 設計一致性檢查清單

- [ ] 色彩使用符合設計系統
- [ ] 字體大小和行高一致
- [ ] 間距遵循 8px 系統
- [ ] 按鈕狀態完整（預設、懸停、點擊、禁用）
- [ ] 互動元素有視覺反饋
- [ ] 錯誤訊息清晰有用
- [ ] 響應式佈局在各尺寸下正常

### 2. 可用性檢查清單

- [ ] 主要操作路徑簡短
- [ ] 表單有適當的預設值
- [ ] 操作可撤銷或確認
- [ ] 載入狀態有指示
- [ ] 空狀態有明確指引
- [ ] 搜尋和過濾功能可用

### 3. 可訪問性檢查清單

- [ ] 所有圖片有 alt 文字
- [ ] 表單有關聯的 label
- [ ] 色彩對比度足夠
- [ ] 鍵盤可操作
- [ ] 焦點指示清晰
- [ ] ARIA 屬性正確

- --

## 相關文檔

- [48-共用元件清單.md](./48-共用元件清單.md) - 共用元件
- [63-國際化與本地化指南.md](./63-國際化與本地化指南.md) - i18n
- [65-移動端適配指南.md](./65-移動端適配指南.md) - 移動端

- --

**版本歷史**

| 版本 | 日期 | 變更內容 | 作者 |
|------|------|---------|------|
| v1.0 | 2025-11-16 | 初始版本 | Development Team |
