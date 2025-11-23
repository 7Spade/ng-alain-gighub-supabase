# 效能優化指南


> **📚 目的**: 提供全方位的效能優化策略，涵蓋前端與後端的效能提升方法

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 架構師

---


## 📑 目錄

- [📋 目錄](#-目錄)
- [效能優化概述](#效能優化概述)
  - [效能指標（Core Web Vitals）](#效能指標core-web-vitals)
  - [優化目標](#優化目標)
- [前端效能優化](#前端效能優化)
  - [1. 懶加載（Lazy Loading）](#1-懶加載lazy-loading)
    - [路由懶加載](#路由懶加載)
    - [組件懶加載（@defer）](#組件懶加載defer)
    - [圖片懶加載](#圖片懶加載)
  - [2. 虛擬滾動（Virtual Scrolling）](#2-虛擬滾動virtual-scrolling)
    - [使用 CDK Virtual Scrolling](#使用-cdk-virtual-scrolling)
    - [使用 ng-zorro Table 虛擬滾動](#使用-ng-zorro-table-虛擬滾動)
  - [3. 變更檢測優化](#3-變更檢測優化)
    - [使用 OnPush 策略](#使用-onpush-策略)
    - [使用 Signals 管理狀態](#使用-signals-管理狀態)
    - [使用 trackBy 優化 @for](#使用-trackby-優化-for)
  - [4. Bundle 優化](#4-bundle-優化)
    - [程式碼分割](#程式碼分割)
    - [Tree Shaking](#tree-shaking)
    - [分析 Bundle 大小](#分析-bundle-大小)
  - [5. 圖片優化](#5-圖片優化)
    - [使用適當的圖片格式](#使用適當的圖片格式)
    - [響應式圖片](#響應式圖片)
    - [圖片壓縮](#圖片壓縮)
  - [6. 快取策略](#6-快取策略)
    - [HTTP 快取](#http-快取)
    - [Service Worker（PWA）](#service-workerpwa)
- [資料庫查詢優化](#資料庫查詢優化)
  - [1. 索引優化](#1-索引優化)
    - [建立適當的索引](#建立適當的索引)
    - [檢查索引使用情況](#檢查索引使用情況)
  - [2. 查詢優化](#2-查詢優化)
    - [避免 N+1 查詢](#避免-n1-查詢)
    - [使用關聯查詢](#使用關聯查詢)
    - [限制查詢結果](#限制查詢結果)
  - [3. 查詢快取](#3-查詢快取)
    - [使用 Supabase 查詢快取](#使用-supabase-查詢快取)
    - [應用層快取](#應用層快取)
- [快取策略](#快取策略)
  - [1. 前端快取](#1-前端快取)
    - [記憶體快取（Signals）](#記憶體快取signals)
    - [LocalStorage 快取](#localstorage-快取)
  - [2. 後端快取](#2-後端快取)
    - [資料庫查詢快取](#資料庫查詢快取)
    - [Edge Functions 快取](#edge-functions-快取)
  - [3. CDN 快取](#3-cdn-快取)
    - [靜態資源快取](#靜態資源快取)
- [效能監控工具](#效能監控工具)
  - [1. 前端監控](#1-前端監控)
    - [Angular DevTools](#angular-devtools)
    - [Chrome DevTools Performance](#chrome-devtools-performance)
    - [Web Vitals](#web-vitals)
  - [2. 後端監控](#2-後端監控)
    - [Supabase Dashboard](#supabase-dashboard)
    - [使用 Supabase MCP 工具](#使用-supabase-mcp-工具)
- [效能基準測試](#效能基準測試)
  - [1. 前端基準測試](#1-前端基準測試)
    - [Lighthouse CI](#lighthouse-ci)
    - [手動測試](#手動測試)
  - [2. 後端基準測試](#2-後端基準測試)
    - [API 效能測試](#api-效能測試)
    - [資料庫查詢測試](#資料庫查詢測試)
- [最佳實踐](#最佳實踐)
  - [1. 開發階段](#1-開發階段)
  - [2. 建置階段](#2-建置階段)
  - [3. 部署階段](#3-部署階段)
  - [4. 持續優化](#4-持續優化)
- [效能檢查清單](#效能檢查清單)
  - [頁面載入](#頁面載入)
  - [資源優化](#資源優化)
  - [程式碼優化](#程式碼優化)
  - [資料庫優化](#資料庫優化)
- [相關文檔](#相關文檔)

---


> 📋 **目的**：提供前端和後端效能優化最佳實踐，確保應用程式快速響應

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [效能優化概述](#效能優化概述)
- [前端效能優化](#前端效能優化)
- [資料庫查詢優化](#資料庫查詢優化)
- [快取策略](#快取策略)
- [效能監控工具](#效能監控工具)
- [效能基準測試](#效能基準測試)
- [最佳實踐](#最佳實踐)

**參考文檔**：
- [開發作業指引](./specs/00-development-guidelines.md) - 效能優化規範
- [部署指南](./39-部署指南.md) - 部署相關優化

- --

## 效能優化概述

### 效能指標（Core Web Vitals）

- **LCP (Largest Contentful Paint)**：< 2.5 秒
- **FID/INP (First Input Delay/Interaction to Next Paint)**：< 100 毫秒
- **CLS (Cumulative Layout Shift)**：< 0.1

### 優化目標

- **頁面載入時間**：< 3 秒
- **API 回應時間**：< 500 毫秒
- **資料庫查詢時間**：< 100 毫秒（簡單查詢）

- --

## 前端效能優化

### 1. 懶加載（Lazy Loading）

#### 路由懶加載

```typescript
// ✅ 使用懶加載路由
const routes: Routes = [
  {
    path: 'blueprints',
    loadChildren: () => import('./routes/blueprint/blueprint.routes').then(m => m.BLUEPRINT_ROUTES)
  }
];
```

#### 組件懶加載（@defer）

```typescript
// ✅ 使用 @defer 延遲載入組件
@Component({
  template: `
    @defer (on viewport) {
      <app-heavy-component />
    } @placeholder {
      <div>載入中...</div>
    }
  `
})
```

#### 圖片懶加載

```html
<!-- ✅ 使用 loading="lazy" -->
<img src="image.jpg" loading="lazy" alt="描述" />

<!-- ✅ 使用 ng-zorro 的 nz-image -->
<nz-image nzSrc="image.jpg" [nzLazyLoad]="true" />
```

- --

### 2. 虛擬滾動（Virtual Scrolling）

#### 使用 CDK Virtual Scrolling

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      @for (item of items(); track item.id) {
        <div class="item">{{ item.name }}</div>
      }
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .viewport {
      height: 400px;
    }
    .item {
      height: 50px;
    }
  `]
})
```

#### 使用 ng-zorro Table 虛擬滾動

```html
<nz-table
  [nzData]="data()"
  [nzVirtualScroll]="true"
  [nzVirtualItemSize]="54"
  [nzVirtualMaxBufferPx]="200"
  [nzVirtualMinBufferPx]="100">
  <!-- 表格列定義 -->
</nz-table>
```

- --

### 3. 變更檢測優化

#### 使用 OnPush 策略

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

#### 使用 Signals 管理狀態

```typescript
// ✅ 使用 Signal
readonly data = signal<Data[]>([]);
readonly loading = signal(false);

// ❌ 避免直接修改物件
// this.data.push(newItem); // 不會觸發變更檢測

// ✅ 使用 set 或 update
this.data.set([...this.data(), newItem]);
this.data.update(items => [...items, newItem]);
```

#### 使用 trackBy 優化 @for

```typescript
@Component({
  template: `
    @for (item of items(); track trackByFn) {
      <div>{{ item.name }}</div>
    }
  `
})
export class MyComponent {
  trackByFn(index: number, item: Item): string {
    return item.id; // 使用唯一 ID
  }
}
```

- --

### 4. Bundle 優化

#### 程式碼分割

```typescript
// 使用動態導入
const module = await import('./heavy-module');
```

#### Tree Shaking

確保使用 ES6 模組語法：

```typescript
// ✅ 好的做法
import { specificFunction } from './utils';

// ❌ 避免
import * as utils from './utils';
```

#### 分析 Bundle 大小

```bash
# 建置並分析
yarn build --configuration production --stats-json
yarn analyze:view
```

- --

### 5. 圖片優化

#### 使用適當的圖片格式

- **WebP**：現代瀏覽器，較小檔案
- **AVIF**：最新格式，最佳壓縮
- **JPEG**：照片
- **PNG**：透明背景

#### 響應式圖片

```html
<img
  srcset="image-320w.webp 320w,
          image-640w.webp 640w,
          image-1280w.webp 1280w"
  sizes="(max-width: 640px) 320px,
         (max-width: 1280px) 640px,
         1280px"
  src="image-1280w.webp"
  alt="描述"
/>
```

#### 圖片壓縮

- 使用工具壓縮圖片（如 ImageOptim、TinyPNG）
- 使用 CDN 自動優化（如 Supabase Storage CDN）

- --

### 6. 快取策略

#### HTTP 快取

```typescript
// 在 HTTP 請求中設定快取標頭
this.http.get('/api/data', {
  headers: {
    'Cache-Control': 'max-age=3600'
  }
});
```

#### Service Worker（PWA）

```typescript
// 使用 Angular Service Worker
// ng add @angular/pwa
```

- --

## 資料庫查詢優化

### 1. 索引優化

#### 建立適當的索引

```sql
-- ✅ 為常用查詢欄位建立索引
CREATE INDEX idx_blueprints_owner_id ON blueprints(owner_id);
CREATE INDEX idx_tasks_blueprint_id ON tasks(blueprint_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- ✅ 複合索引
CREATE INDEX idx_tasks_blueprint_status ON tasks(blueprint_id, status);
CREATE INDEX idx_branch_forks_blueprint ON branch_forks(blueprint_id);
CREATE INDEX idx_blueprint_branches_org ON blueprint_branches(blueprint_id, organization_id);
CREATE INDEX idx_pull_requests_status ON pull_requests(blueprint_id, status, created_at);
CREATE INDEX idx_staging_submissions_submitter ON staging_submissions(submitter_id, finalized, expires_at);
```

#### 檢查索引使用情況

```sql
-- 使用 EXPLAIN 分析查詢
EXPLAIN ANALYZE
SELECT * FROM tasks WHERE blueprint_id = 'xxx' AND status = 'active';
```

- --

### 2. 查詢優化

#### 避免 N+1 查詢

```typescript
// ❌ 不好的做法（N+1 查詢）
for (const blueprint of blueprints) {
  const tasks = await this.getTasks(blueprint.id);
}

// ✅ 好的做法（批量查詢）
const blueprintIds = blueprints.map(b => b.id);
const allTasks = await this.getTasksByBlueprintIds(blueprintIds);
```

#### 使用關聯查詢

```typescript
// ✅ 使用 PostgREST 關聯查詢
const response = await supabase
  .from('blueprints')
  .select(`
    *,
    tasks(*),
    members(*)
  `)
  .eq('id', blueprintId);
```

#### 限制查詢結果

```typescript
// ✅ 使用分頁
const response = await supabase
  .from('tasks')
  .select('*')
  .range(0, 19) // 限制 20 筆
  .order('created_at', { ascending: false });
```

- --

### 3. 查詢快取

#### 使用 Supabase 查詢快取

```typescript
// Supabase 自動快取某些查詢
// 可以透過設定快取策略優化
```

#### 應用層快取

```typescript
// 使用 RxJS shareReplay 快取
readonly blueprints$ = this.http.get<Blueprint[]>('/api/blueprints').pipe(
  shareReplay(1) // 快取最後一次結果
);
```

- --

## 快取策略

### 1. 前端快取

#### 記憶體快取（Signals）

```typescript
// 使用 Signal 作為快取
readonly cachedData = signal<Data | null>(null);

loadData() {
  if (this.cachedData()) {
    return; // 使用快取
  }
  // 載入資料
  this.http.get('/api/data').subscribe(data => {
    this.cachedData.set(data);
  });
}
```

#### LocalStorage 快取

```typescript
// 快取用戶設定等不常變動的資料
const cacheKey = 'user-preferences';
const cached = localStorage.getItem(cacheKey);
if (cached) {
  return JSON.parse(cached);
}
```

- --

### 2. 後端快取

#### 資料庫查詢快取

```typescript
// 使用 Supabase 的查詢快取
// 或實作應用層快取
```

#### Edge Functions 快取

```typescript
// 在 Edge Function 中使用快取
const cacheKey = `weather-${date}`;
const cached = await cache.get(cacheKey);
if (cached) {
  return cached;
}
// 計算並快取
const result = await fetchWeather(date);
await cache.set(cacheKey, result, { ttl: 3600 });
```

- --

### 3. CDN 快取

#### 靜態資源快取

- 使用 Supabase Storage CDN 快取圖片和檔案
- 設定適當的 Cache-Control 標頭

- --

## 效能監控工具

### 1. 前端監控

#### Angular DevTools

```bash
# 安裝 Angular DevTools 瀏覽器擴充功能
# 用於分析變更檢測和效能
```

#### Chrome DevTools Performance

```bash
# 使用 Chrome DevTools 的 Performance 面板
# 分析頁面載入和執行效能
```

#### Web Vitals

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

- --

### 2. 後端監控

#### Supabase Dashboard

- 查看 API 回應時間
- 查看資料庫查詢時間
- 查看 Edge Functions 執行時間

#### 使用 Supabase MCP 工具

```bash
# 獲取 API 日誌
@SUPABASE 獲取 API 日誌

# 獲取資料庫日誌
@SUPABASE 獲取 Postgres 日誌
```

- --

## 效能基準測試

### 1. 前端基準測試

#### Lighthouse CI

```bash
# 安裝 Lighthouse CI
npm install -g @lhci/cli

# 執行測試
lhci autorun
```

#### 手動測試

```bash
# 使用 Chrome DevTools
# 1. 開啟 Performance 面板
# 2. 錄製頁面載入
# 3. 分析結果
```

- --

### 2. 後端基準測試

#### API 效能測試

```bash
# 使用工具測試 API 回應時間
# 如：Apache Bench, wrk, k6
```

#### 資料庫查詢測試

```sql
-- 使用 EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT * FROM tasks WHERE blueprint_id = 'xxx';
```

- --

## 最佳實踐

### 1. 開發階段

- [ ] 使用 `OnPush` 變更檢測策略
- [ ] 使用 Signals 管理狀態
- [ ] 使用 `trackBy` 優化列表渲染
- [ ] 使用懶加載路由和組件
- [ ] 優化圖片大小和格式

### 2. 建置階段

- [ ] 啟用生產模式優化
- [ ] 分析 Bundle 大小
- [ ] 啟用 Tree Shaking
- [ ] 壓縮和最小化程式碼

### 3. 部署階段

- [ ] 使用 CDN 快取靜態資源
- [ ] 設定適當的 HTTP 快取標頭
- [ ] 啟用 Gzip/Brotli 壓縮
- [ ] 監控效能指標

### 4. 持續優化

- [ ] 定期檢查效能指標
- [ ] 分析慢查詢並優化
- [ ] 更新依賴套件
- [ ] 優化資料庫索引

- --

## 效能檢查清單

### 頁面載入

- [ ] LCP < 2.5 秒
- [ ] FID/INP < 100 毫秒
- [ ] CLS < 0.1
- [ ] 首屏內容載入 < 3 秒

### 資源優化

- [ ] 圖片已優化（WebP/AVIF）
- [ ] JavaScript Bundle < 500KB（gzipped）
- [ ] CSS Bundle < 50KB（gzipped）
- [ ] 使用 CDN 快取

### 程式碼優化

- [ ] 使用懶加載路由
- [ ] 使用 OnPush 變更檢測
- [ ] 使用 trackBy 優化列表
- [ ] 避免記憶體洩漏

### 資料庫優化

- [ ] 常用查詢欄位有索引
- [ ] 查詢回應時間 < 100 毫秒
- [ ] 避免 N+1 查詢
- [ ] 使用分頁限制結果

- --

## 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md)
- [部署指南](./39-部署指南.md)
- [常見問題 FAQ](./36-常見問題-FAQ.md)

- --

**最後更新**：2025-11-13
**維護者**：開發團隊


