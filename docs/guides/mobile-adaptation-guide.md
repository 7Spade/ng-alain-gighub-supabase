# 移動端適配指南

> **目的**：提供完整的移動端適配策略，確保應用程式在各種移動裝置上的最佳體驗

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：Development Team

- --

## 📋 目錄

1. [響應式設計策略](#響應式設計策略)
2. [移動端優化](#移動端優化)
3. [觸控互動設計](#觸控互動設計)
4. [PWA 實作](#pwa-實作)
5. [效能優化](#效能優化)
6. [測試與除錯](#測試與除錯)

- --

## 響應式設計策略

### 1. Mobile First 方法

採用 **Mobile First** 設計方法，從最小螢幕開始設計，逐步增強到大螢幕。

```scss
// 基礎樣式（手機）
.container {
  width: 100%;
  padding: 16px;
}

// 平板
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
}

// 桌面
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
```

### 2. 視口配置

#### index.html

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="utf-8">

  <!-- 響應式視口 -->
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes">

  <!-- iOS Safari -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="NG-ALAIN">

  <!-- Android Chrome -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#1890ff">

  <title>NG-ALAIN GitHub</title>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### 3. 斷點系統

```typescript
import { Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface BreakpointState {
  current: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

@Injectable({ providedIn: 'root' })
export class ResponsiveService {
  private breakpoints = {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  };

  currentBreakpoint = signal<BreakpointState>({
    current: this.getBreakpoint(),
    isMobile: window.innerWidth < this.breakpoints.md,
    isTablet: window.innerWidth >= this.breakpoints.md && window.innerWidth < this.breakpoints.lg,
    isDesktop: window.innerWidth >= this.breakpoints.lg
  });

  constructor() {
    // 監聽視窗大小變化
    fromEvent(window, 'resize')
      .pipe(debounceTime(150))
      .subscribe(() => {
        this.updateBreakpoint();
      });
  }

  private getBreakpoint(): Breakpoint {
    const width = window.innerWidth;
    if (width < this.breakpoints.xs) return 'xs';
    if (width < this.breakpoints.sm) return 'sm';
    if (width < this.breakpoints.md) return 'md';
    if (width < this.breakpoints.lg) return 'lg';
    if (width < this.breakpoints.xl) return 'xl';
    return 'xxl';
  }

  private updateBreakpoint(): void {
    const width = window.innerWidth;
    this.currentBreakpoint.set({
      current: this.getBreakpoint(),
      isMobile: width < this.breakpoints.md,
      isTablet: width >= this.breakpoints.md && width < this.breakpoints.lg,
      isDesktop: width >= this.breakpoints.lg
    });
  }
}
```

- --

## 相關文檔

- [64-UI-UX設計規範.md](./64-UI-UX設計規範.md) - UI/UX 設計
- [59-前端狀態管理指南.md](./59-前端狀態管理指南.md) - 狀態管理
- [62-前端路由設計指南.md](./62-前端路由設計指南.md) - 路由設計

- --

**版本歷史**

| 版本 | 日期 | 變更內容 | 作者 |
|------|------|---------|------|
| v1.0 | 2025-11-16 | 初始版本 | Development Team |
