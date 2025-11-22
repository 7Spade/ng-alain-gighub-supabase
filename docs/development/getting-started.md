# 開發入門指南

## 快速開始

### 1. 環境準備

確保已完成 [環境設置](../setup/environment.md)。

### 2. 啟動開發服務器

```bash
npm start
```

瀏覽器會自動開啟 `http://localhost:4200/`。

### 3. 開始開發

專案使用 Angular 20.1，採用最新的 standalone components 架構。

## 專案結構

```
ng-alain-gighub-supabase/
├── src/
│   ├── app/                  # 應用程式主目錄
│   │   ├── core/            # 核心模組（單例服務、攔截器等）
│   │   ├── shared/          # 共用模組（元件、指令、管道）
│   │   ├── routes/          # 路由模組（功能模組）
│   │   ├── layout/          # 版面配置元件
│   │   └── app.config.ts    # 應用程式配置
│   ├── assets/              # 靜態資源
│   ├── environments/        # 環境配置
│   ├── styles/              # 全域樣式
│   ├── main.ts             # 應用程式入口
│   └── main.server.ts      # SSR 入口
├── docs/                    # 文檔
├── e2e/                     # E2E 測試
├── scripts/                 # 建構腳本
└── public/                  # 公開資源
```

## 開發工作流程

### 創建新功能

1. **創建 Feature Module**

```bash
ng generate module routes/feature-name --routing
```

2. **創建 Component**

```bash
ng generate component routes/feature-name/components/component-name
```

3. **創建 Service**

```bash
ng generate service routes/feature-name/services/data
```

### 程式碼風格

專案使用以下工具確保代碼一致性：

- **ESLint**: TypeScript 和 Angular 代碼檢查
- **Prettier**: 程式碼格式化
- **Stylelint**: LESS/SCSS 樣式檢查
- **Husky**: Git hooks 自動化

### 執行 Linting

```bash
# 檢查 TypeScript 代碼
npm run lint:ts

# 檢查樣式檔案
npm run lint:style

# 執行所有檢查
npm run lint
```

### 自動格式化

VSCode 使用者：儲存時自動格式化（需安裝推薦擴展）。

手動格式化：

```bash
npx prettier --write "src/**/*.{ts,html,scss,json}"
```

## 常用開發任務

### 建構專案

```bash
# 開發建構
npm run build

# 生產建構
npm run build:prod

# 分析建構結果
npm run analyze
npm run analyze:view
```

### 執行測試

```bash
# 單元測試（watch 模式）
npm test

# 單元測試（單次執行）
npm run test-coverage

# E2E 測試
npm run e2e
```

### 產生元件範本

使用 ng-alain CLI：

```bash
# 產生 CRUD 頁面
ng g ng-alain:list feature-name

# 產生編輯頁面
ng g ng-alain:edit feature-name

# 產生檢視頁面
ng g ng-alain:view feature-name
```

## 除錯

### 使用 Chrome DevTools

1. 開啟 Chrome DevTools（F12）
2. 在 Sources 面板中設置中斷點
3. 使用 Console 面板查看日誌

### Angular DevTools

安裝 [Angular DevTools](https://angular.dev/tools/devtools) 瀏覽器擴展：

- 檢視元件樹
- 檢查元件屬性
- 分析變更檢測效能

### VSCode 除錯

專案包含 `.vscode/launch.json` 配置：

1. 在 VSCode 中打開除錯面板（Ctrl+Shift+D）
2. 選擇 "Launch Chrome"
3. 按 F5 開始除錯

## 開發最佳實務

### 元件設計

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-component.component.html',
  styleUrls: ['./feature-component.component.scss']
})
export class FeatureComponentComponent implements OnInit {
  // 使用強型別
  data: DataModel[] = [];
  
  constructor(
    private dataService: DataService
  ) {}
  
  ngOnInit(): void {
    this.loadData();
  }
  
  private loadData(): void {
    this.dataService.getData().subscribe({
      next: (data) => this.data = data,
      error: (error) => console.error('Error loading data:', error)
    });
  }
}
```

### Service 設計

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly apiUrl = '/api/data';
  
  constructor(private http: HttpClient) {}
  
  getData(): Observable<DataModel[]> {
    return this.http.get<DataModel[]>(this.apiUrl);
  }
  
  createData(data: DataModel): Observable<DataModel> {
    return this.http.post<DataModel>(this.apiUrl, data);
  }
}
```

### 狀態管理

對於複雜的狀態管理，建議使用：

- **RxJS BehaviorSubject**: 簡單狀態
- **NgRx**: 大型應用狀態管理（如需要）

### 效能優化

1. **使用 OnPush 變更檢測策略**

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

2. **使用 TrackBy 優化 ngFor**

```typescript
trackByFn(index: number, item: DataModel): number {
  return item.id;
}
```

3. **延遲載入模組**

```typescript
const routes: Routes = [
  {
    path: 'feature',
    loadChildren: () => import('./routes/feature/feature.module')
      .then(m => m.FeatureModule)
  }
];
```

## SSR 開發注意事項

### 平台檢查

```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

someMethod() {
  if (isPlatformBrowser(this.platformId)) {
    // 只在瀏覽器端執行
    window.localStorage.setItem('key', 'value');
  }
}
```

### SSR 測試

```bash
# 建構並啟動 SSR
npm run build
npm run serve:ssr:ng-alain
```

## 問題排查

### 常見問題

1. **模組找不到**: 檢查 import 路徑是否正確
2. **元件無法顯示**: 檢查是否已加入 imports 陣列
3. **樣式不生效**: 檢查 styleUrls 路徑和 ViewEncapsulation
4. **API 請求失敗**: 檢查 proxy.conf.js 和環境變數

### 獲取幫助

1. 查看 [Angular 官方文檔](https://angular.dev)
2. 查看 [ng-alain 文檔](https://ng-alain.com)
3. 搜尋專案 issues
4. 聯絡團隊成員

## 下一步

- 學習專案架構（待建立）
- 閱讀 [編碼規範](../standards/coding-standards.md)
- 了解 API 文檔（待建立）
- 查看部署指南（待建立）
