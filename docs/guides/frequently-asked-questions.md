# 常見問題 FAQ

## 📑 目錄

- [📋 目錄](#-目錄)
- [環境設定問題](#環境設定問題)
  - [Q1: Node.js 版本不符合要求](#q1-nodejs-版本不符合要求)
  - [Q2: Yarn 安裝失敗](#q2-yarn-安裝失敗)
  - [Q3: Supabase 連線失敗](#q3-supabase-連線失敗)
  - [Q4: 端口被占用](#q4-端口被占用)
- [開發問題](#開發問題)
  - [Q5: 建置失敗](#q5-建置失敗)
  - [Q6: TypeScript 類型錯誤](#q6-typescript-類型錯誤)
  - [Q7: 路由無法導航](#q7-路由無法導航)
  - [Q8: 組件無法顯示](#q8-組件無法顯示)
  - [Q9: Signal 狀態不更新](#q9-signal-狀態不更新)
- [資料庫問題](#資料庫問題)
  - [Q10: 資料庫遷移失敗](#q10-資料庫遷移失敗)
  - [Q11: RLS 權限被拒絕](#q11-rls-權限被拒絕)
  - [Q12: 查詢結果為空](#q12-查詢結果為空)
- [部署問題](#部署問題)
  - [Q13: CI/CD 建置失敗](#q13-cicd-建置失敗)
  - [Q14: 生產環境功能異常](#q14-生產環境功能異常)
  - [Q15: 資料庫遷移在生產環境失敗](#q15-資料庫遷移在生產環境失敗)
- [效能問題](#效能問題)
  - [Q16: 頁面載入慢](#q16-頁面載入慢)
  - [Q17: 查詢速度慢](#q17-查詢速度慢)
- [其他問題](#其他問題)
  - [Q18: ESLint 錯誤過多](#q18-eslint-錯誤過多)
  - [Q19: 無法使用 SHARED_IMPORTS](#q19-無法使用-shared_imports)
  - [Q20: 依賴注入失敗](#q20-依賴注入失敗)
  - [Q21: 為什麼分支無法修改任務結構或主欄位？](#q21-為什麼分支無法修改任務結構或主欄位)
  - [Q22: 暫存區提交後要如何撤回或補件？](#q22-暫存區提交後要如何撤回或補件)
- [取得協助](#取得協助)
- [相關文檔](#相關文檔)

---


> 📋 **目的**：快速解答開發過程中常見問題，減少重複問題的處理時間

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [環境設定問題](#環境設定問題)
- [開發問題](#開發問題)
- [資料庫問題](#資料庫問題)
- [部署問題](#部署問題)
- [效能問題](#效能問題)
- [其他問題](#其他問題)

**參考文檔**：
- [快速開始指南](./32-快速開始指南.md) - 環境設定詳細步驟
- [開發作業指引](./specs/00-development-guidelines.md) - 開發規範
- [錯誤處理指南](./37-錯誤處理指南.md) - 錯誤處理方式

- --

## 環境設定問題

### Q1: Node.js 版本不符合要求

**問題**：執行 `yarn install` 時出現版本錯誤

**解決方案**：
1. 檢查 Node.js 版本：`node --version`（應 >= 20）
2. 升級 Node.js：
   - 前往 https://nodejs.org/ 下載最新 LTS 版本
   - 或使用 nvm（Node Version Manager）：
     ```bash
     nvm install 20
     nvm use 20
     ```
3. 重新執行 `yarn install`

- --

### Q2: Yarn 安裝失敗

**問題**：`yarn install` 失敗或速度很慢

**解決方案**：
1. **清除快取**：
   ```bash
   yarn cache clean
   ```

2. **使用國內鏡像**（如果在中國）：
   ```bash
   yarn config set registry https://registry.npmmirror.com
   ```

3. **刪除並重新安裝**：
   ```bash
   rm -rf node_modules yarn.lock
   yarn install
   ```

4. **檢查網路連線**：
   - 確認可以訪問 npm registry
   - 檢查防火牆設定

- --

### Q3: Supabase 連線失敗

**問題**：無法連線到 Supabase，出現連線錯誤

**解決方案**：
1. **檢查環境變數**：
   - 確認 `src/environments/environment.ts` 中的 Supabase URL 和 Anon Key 正確
   - 確認沒有多餘的空格或引號

2. **檢查 Supabase 專案狀態**：
   - 登入 Supabase Dashboard
   - 確認專案狀態為 Active
   - 檢查專案是否暫停或刪除

3. **檢查網路連線**：
   - 確認可以訪問 Supabase 服務
   - 檢查防火牆或代理設定

4. **驗證 API Key**：
   - 在 Supabase Dashboard 中重新複製 Anon Key
   - 確認使用的是 `anon` key 而非 `service_role` key

- --

### Q4: 端口被占用

**問題**：`yarn start` 時提示端口 4200 已被占用

**解決方案**：
1. **查找占用端口的進程**（Windows）：
   ```bash
   netstat -ano | findstr :4200
   ```

2. **終止進程**：
   ```bash
   taskkill /PID <進程ID> /F
   ```

3. **或使用其他端口**：
   ```bash
   yarn ng serve --port 4201
   ```

- --

## 開發問題

### Q5: 建置失敗

**問題**：`yarn build` 失敗

**解決方案**：
1. **檢查錯誤訊息**：
   - 查看完整錯誤訊息
   - 確認是類型錯誤、語法錯誤還是依賴問題

2. **清除建置快取**：
   ```bash
   yarn ng cache clean
   rm -rf .angular dist
   yarn build
   ```

3. **檢查記憶體使用**：
   - 如果記憶體不足，增加 Node.js 記憶體限制：
     ```bash
     node --max_old_space_size=8000 ./node_modules/@angular/cli/bin/ng build
     ```

4. **檢查依賴**：
   ```bash
   yarn install --frozen-lockfile
   ```

- --

### Q6: TypeScript 類型錯誤

**問題**：TypeScript 編譯錯誤，類型不匹配

**解決方案**：
1. **執行類型檢查**：
   ```bash
   yarn type-check  # 如果有此腳本
   # 或
   yarn ng build --configuration development
   ```

2. **檢查類型定義**：
   - 確認模型定義與資料庫結構一致（參考資料模型對照表）
   - 確認導入的類型正確

3. **明確類型標註**：
   - 避免使用 `any`
   - 為函數參數和返回值明確標註類型

4. **檢查 tsconfig.json**：
   - 確認 `strict` 模式設定
   - 確認 `paths` 映射正確

- --

### Q7: 路由無法導航

**問題**：點擊連結或程式碼導航無法跳轉

**解決方案**：
1. **檢查路由配置**：
   - 確認路由定義正確（`routes.ts`）
   - 確認路由路徑與導航路徑一致

2. **檢查路由守衛**：
   - 確認 `canActivate` 守衛返回 `true`
   - 檢查是否有權限限制

3. **檢查路由參數**：
   - 確認路由參數格式正確
   - 確認必要參數已提供

4. **檢查 Console 錯誤**：
   - 查看瀏覽器 Console 是否有錯誤訊息
   - 檢查 Network 面板確認請求是否發送

- --

### Q8: 組件無法顯示

**問題**：組件載入後無法顯示或顯示空白

**解決方案**：
1. **檢查組件導入**：
   - 確認組件已正確導入到 `imports` 陣列
   - 確認使用 `SHARED_IMPORTS`（UI 層組件）

2. **檢查變更檢測**：
   - 確認使用 `OnPush` 策略時，Signal 更新正確
   - 確認沒有在變更檢測期間直接修改狀態

3. **檢查條件渲染**：
   - 確認 `@if` 條件正確
   - 確認資料已正確載入

4. **檢查 Console 錯誤**：
   - 查看是否有 JavaScript 錯誤
   - 檢查是否有模板語法錯誤

- --

### Q9: Signal 狀態不更新

**問題**：Signal 值更新後，UI 沒有反應

**解決方案**：
1. **確認使用 Signal**：
   ```typescript
   // ✅ 正確
   readonly data = signal<Data[]>([]);
   this.data.set(newData);

   // ❌ 錯誤
   data: Data[] = [];
   this.data = newData;  // 不會觸發變更檢測
   ```

2. **檢查變更檢測策略**：
   - 使用 `OnPush` 時，必須透過 Signal 更新
   - 確認沒有在變更檢測期間直接修改

3. **使用 `computed` 衍生狀態**：
   ```typescript
   readonly filteredData = computed(() =>
     this.data().filter(item => item.active)
   );
   ```

- --

## 資料庫問題

### Q10: 資料庫遷移失敗

**問題**：執行資料庫遷移時失敗

**解決方案**：
1. **檢查遷移腳本語法**：
   - 確認 SQL 語法正確
   - 確認沒有語法錯誤

2. **檢查依賴關係**：
   - 確認遷移順序正確
   - 確認外鍵依賴的表已建立

3. **檢查權限**：
   - 確認 Supabase 專案有足夠權限
   - 確認使用正確的資料庫連線

4. **使用 Supabase MCP 工具**：
   ```bash
   @SUPABASE 列出所有遷移
   @SUPABASE 檢查資料庫結構
   ```

- --

### Q11: RLS 權限被拒絕

**問題**：查詢資料時出現權限錯誤（403 Forbidden）

**解決方案**：
1. **檢查 RLS 策略**：
   - 使用 `@SUPABASE` 檢查表的 RLS 策略
   - 確認策略條件正確

2. **檢查用戶身份**：
   - 確認用戶已正確登入
   - 確認 JWT Token 有效

3. **檢查策略條件**：
   - 確認 `auth.uid()` 可以正確取得用戶 ID
   - 確認策略中的條件邏輯正確

4. **參考安全文檔**：
   - 查看 `docs/21-安全與-RLS-權限矩陣.md`
   - 確認權限設定符合需求

- --

### Q12: 查詢結果為空

**問題**：API 查詢返回空陣列，但資料庫中有資料

**解決方案**：
1. **檢查篩選條件**：
   - 確認查詢參數正確
   - 確認篩選條件邏輯正確

2. **檢查 RLS 策略**：
   - 確認 RLS 策略允許當前用戶查詢
   - 確認沒有被策略過濾掉

3. **直接查詢資料庫**：
   - 使用 Supabase Dashboard 的 SQL Editor
   - 確認資料確實存在

4. **檢查 API 請求**：
   - 查看 Network 面板確認請求參數
   - 確認 API 端點正確

- --

## 部署問題

### Q13: CI/CD 建置失敗

**問題**：GitHub Actions 或其他 CI/CD 建置失敗

**解決方案**：
1. **檢查建置日誌**：
   - 查看完整的錯誤訊息
   - 確認是哪個步驟失敗

2. **本地重現**：
   ```bash
   yarn lint
   yarn type-check  # 如果有
   yarn test
   yarn build
   ```

3. **檢查環境變數**：
   - 確認 CI/CD 環境變數已設定
   - 確認敏感資訊已正確配置

4. **檢查依賴版本**：
   - 確認 `yarn.lock` 已提交
   - 確認依賴版本一致

- --

### Q14: 生產環境功能異常

**問題**：本地正常，但生產環境功能異常

**解決方案**：
1. **檢查環境變數**：
   - 確認生產環境變數已正確設定
   - 確認 Supabase 連線資訊正確

2. **檢查建置配置**：
   - 確認 `environment.prod.ts` 配置正確
   - 確認建置使用生產配置

3. **檢查瀏覽器 Console**：
   - 查看生產環境的錯誤訊息
   - 檢查是否有 CORS 或網路錯誤

4. **檢查 Supabase 設定**：
   - 確認生產環境 Supabase 專案狀態
   - 確認 RLS 策略已正確部署

- --

### Q15: 資料庫遷移在生產環境失敗

**問題**：本地遷移成功，但生產環境失敗

**解決方案**：
1. **檢查資料庫狀態**：
   - 確認生產環境資料庫結構
   - 確認是否有未完成的遷移

2. **檢查遷移順序**：
   - 確認遷移按順序執行
   - 確認沒有遺漏的遷移

3. **使用 Supabase Dashboard**：
   - 在 Dashboard 中手動執行遷移
   - 查看詳細錯誤訊息

4. **回滾策略**：
   - 準備回滾腳本
   - 確認可以安全回滾

- --

## 效能問題

### Q16: 頁面載入慢

**問題**：頁面首次載入時間過長

**解決方案**：
1. **檢查 Bundle 大小**：
   ```bash
   yarn build --stats-json
   yarn analyze:view
   ```

2. **啟用懶加載**：
   - 確認路由使用懶加載
   - 確認大型組件使用 `@defer`

3. **優化圖片**：
   - 使用適當的圖片格式
   - 使用 `loading="lazy"` 延遲載入

4. **檢查網路請求**：
   - 減少不必要的 API 請求
   - 使用快取機制

- --

### Q17: 查詢速度慢

**問題**：資料庫查詢回應時間過長

**解決方案**：
1. **檢查查詢語句**：
   - 使用 Supabase Dashboard 的 Query Performance
   - 確認查詢已優化

2. **檢查索引**：
   - 確認常用查詢欄位有索引
   - 使用 `@SUPABASE` 檢查索引

3. **優化查詢**：
   - 減少不必要的關聯查詢
   - 使用分頁限制結果數量

4. **使用快取**：
   - 對不常變動的資料使用快取
   - 使用 Supabase 的查詢快取

- --

## 其他問題

### Q18: ESLint 錯誤過多

**問題**：執行 `yarn lint` 時出現大量錯誤

**解決方案**：
1. **自動修復**：
   ```bash
   yarn lint --fix
   ```

2. **檢查規則配置**：
   - 查看 `eslint.config.mjs`
   - 確認規則設定合理

3. **逐步修復**：
   - 先修復關鍵錯誤
   - 逐步處理警告

4. **暫時禁用規則**（不建議）：
   ```typescript
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const data: any = {};
   ```

- --

### Q19: 無法使用 SHARED_IMPORTS

**問題**：組件無法使用 `SHARED_IMPORTS` 中的模組

**解決方案**：
1. **檢查導入**：
   ```typescript
   import { SHARED_IMPORTS } from '@shared/shared-imports';

   @Component({
     imports: [SHARED_IMPORTS]
   })
   ```

2. **檢查路徑映射**：
   - 確認 `tsconfig.json` 中的 `paths` 設定正確
   - 確認 `@shared` 路徑映射到正確位置

3. **檢查模組內容**：
   - 查看 `src/app/shared/shared-imports.ts`
   - 確認需要的模組已包含

4. **個別導入**（僅在必要時）：
   ```typescript
   // 僅在 SHARED_IMPORTS 無法滿足需求時
   import { SomeModule } from '@angular/some-module';
   ```

- --

### Q20: 依賴注入失敗

**問題**：服務無法注入，出現 `NullInjectorError`

**解決方案**：
1. **檢查服務裝飾器**：
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class MyService {}
   ```

2. **使用 `inject()`**：
   ```typescript
   // ✅ 推薦
   private readonly service = inject(MyService);

   // ❌ 不推薦（但仍可用）
   constructor(private service: MyService) {}
   ```

3. **檢查提供者**：
   - 確認服務已在正確位置提供
   - 確認沒有重複提供

4. **檢查循環依賴**：
   - 確認沒有循環依賴
   - 重構服務結構

- --

### Q21: 為什麼分支無法修改任務結構或主欄位？

**問題**：承攬分支只能填寫執行欄位，無法變更任務階層或 Blueprint 設定。

**解決方案**：
1. 這是 Git-like 分支模型設計，`branch_roles` 僅授權承攬欄位與附件欄位，主任務結構僅限擁有者操作。
2. 若確實需要變更主欄位，必須透過 PR 提出，由主分支擁有者在合併前執行結構調整。
3. 請確認 PR Payload 只包含允許的欄位，否則 `branch-merge` Edge Function 會拒絕並於 logs 提示。

- --

### Q22: 暫存區提交後要如何撤回或補件？

**問題**：誤提交日報/品管資料，需要在 48 小時內修改。

**解決方案**：
1. 暫存資料位於 `staging_submissions`，可呼叫 `PATCH /rest/v1/staging_submissions?id=eq.{id}` 將 `recalled` 設為 `true`。
2. 前端待辦列表亦提供「撤回」按鈕；撤回後重新提交即可。
3. 逾時未處理會自動標記為 `finalized=true`，若已逾期需改用 PR 或由主分支擁有者協助修改。

- --

## 取得協助

如果以上解決方案無法解決您的問題：

1. **查閱相關文檔**：
   - [快速開始指南](./32-快速開始指南.md)
   - [開發作業指引](./specs/00-development-guidelines.md)
   - [錯誤處理指南](./37-錯誤處理指南.md)

2. **檢查專案 Issue**：
   - 查看是否有類似的已報告問題
   - 建立新的 Issue 並提供詳細資訊

3. **聯繫團隊**：
   - 在團隊頻道詢問
   - 提供錯誤訊息和重現步驟

- --

## 相關文檔

- [快速開始指南](./32-快速開始指南.md)
- [開發作業指引](./specs/00-development-guidelines.md)
- [錯誤處理指南](./37-錯誤處理指南.md)
- [測試指南](./38-測試指南.md)
- [部署指南](./39-部署指南.md)

- --

**最後更新**：2025-11-13
**維護者**：開發團隊


