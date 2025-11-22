# 貢獻指南

歡迎為 ng-alain-gighub-supabase 專案做出貢獻！本指南將幫助您了解如何參與專案開發。

## 開始之前

### 行為準則

參與本專案即表示您同意遵守我們的行為準則：

- 尊重所有參與者
- 提供建設性的回饋
- 接受不同的觀點
- 專注於對專案最好的方案

### 先了解專案

在開始貢獻之前，請：

1. 閱讀 [README.md](../../README.md)
2. 查看 [開發指南](../development/getting-started.md)
3. 了解 [編碼規範](../standards/coding-standards.md)
4. 熟悉 [Git 工作流程](./git-workflow.md)

## 貢獻方式

### 報告錯誤

發現錯誤時：

1. **搜尋現有 Issues**
   - 確認問題尚未被報告

2. **建立新 Issue**
   - 使用錯誤報告模板
   - 提供清晰的標題
   - 詳細描述問題
   - 包含重現步驟
   - 提供環境資訊
   - 如可能，附上截圖或日誌

**好的錯誤報告範例：**

```markdown
## 問題描述
在使用者列表頁面點擊編輯按鈕時，應用程式崩潰。

## 重現步驟
1. 登入系統
2. 導航到使用者管理 > 使用者列表
3. 點擊任一使用者的「編輯」按鈕
4. 觀察錯誤發生

## 預期行為
應該開啟使用者編輯對話框

## 實際行為
應用程式崩潰，顯示錯誤訊息：
TypeError: Cannot read property 'id' of undefined

## 環境
- OS: Windows 11
- Browser: Chrome 120.0
- App Version: 1.2.0

## 截圖
[附上截圖]
```

### 建議新功能

1. **建立 Feature Request Issue**
   - 使用功能請求模板
   - 說明功能的價值
   - 描述預期行為
   - 提供使用案例

2. **討論**
   - 在 Issue 中討論實作細節
   - 等待維護者回饋

### 提交程式碼

#### 準備工作

1. **Fork 專案**

```bash
# 在 GitHub 上 Fork 專案
# 克隆你的 Fork
git clone https://github.com/YOUR_USERNAME/ng-alain-gighub-supabase.git
cd ng-alain-gighub-supabase

# 添加上游倉庫
git remote add upstream https://github.com/7Spade/ng-alain-gighub-supabase.git
```

2. **設置開發環境**

```bash
# 安裝依賴
npm install

# 確認可以建構
npm run build

# 確認測試通過
npm test
```

#### 開發流程

1. **建立分支**

```bash
# 從 develop 建立功能分支
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

2. **進行開發**
   - 遵循編碼規範
   - 寫清晰的程式碼
   - 添加必要的測試
   - 更新相關文檔

3. **提交變更**

```bash
# 暫存變更
git add .

# 提交（遵循提交訊息規範）
git commit -m "feat: add new feature description"

# 推送到你的 Fork
git push origin feature/your-feature-name
```

4. **建立 Pull Request**
   - 在 GitHub 上建立 PR
   - 填寫 PR 模板
   - 連結相關 Issue
   - 等待程式碼審查

#### Pull Request 檢查清單

提交 PR 前確認：

- [ ] 程式碼符合專案編碼規範
- [ ] 所有測試通過
- [ ] 新功能有對應的單元測試
- [ ] 測試覆蓋率沒有降低
- [ ] 文檔已更新
- [ ] 提交訊息符合規範
- [ ] 沒有合併衝突
- [ ] PR 描述清楚且完整

### 改進文檔

文檔貢獻同樣重要：

1. **文檔類型**
   - 技術文檔
   - API 文檔
   - 教學文檔
   - 範例程式碼

2. **文檔標準**
   - 使用清晰的語言
   - 提供程式碼範例
   - 包含截圖（如適用）
   - 保持更新

3. **提交流程**
   - 與程式碼貢獻相同的流程
   - PR 標題使用 `docs:` 前綴

## 程式碼審查

### 作為審查者

**審查重點：**

1. **功能性**
   - 程式碼是否達成預期功能
   - 是否有邊界條件處理
   - 錯誤處理是否適當

2. **程式碼品質**
   - 是否遵循編碼規範
   - 命名是否清晰
   - 邏輯是否簡潔

3. **測試**
   - 測試覆蓋率是否足夠
   - 測試案例是否完整
   - 測試是否有意義

4. **效能**
   - 是否有效能問題
   - 是否有優化空間

5. **安全性**
   - 是否有安全漏洞
   - 敏感資料處理是否適當

**審查回饋原則：**

- ✅ 具體且有建設性
- ✅ 解釋「為什麼」
- ✅ 提供改進建議
- ✅ 讚賞好的實作
- ❌ 避免主觀批評
- ❌ 避免模糊的評論

**回饋範例：**

```markdown
# ✅ 好的回饋
建議這裡使用 `Array.filter()` 而不是手動迴圈，會更簡潔且
效能更好。範例：
```typescript
const activeUsers = users.filter(u => u.isActive);
```

# ❌ 不好的回饋
這段程式碼不好。
```

### 作為被審查者

**接受審查回饋：**

- 認真對待所有回饋
- 不要將批評視為個人攻擊
- 提出不同意見時保持專業
- 感謝審查者的時間

**回應審查意見：**

```markdown
# 感謝並採納
感謝建議！我已經按照您的建議使用 Array.filter() 重構了這段程式碼。

# 提出疑問
我理解您的擔憂，但這裡使用迴圈是因為 [具體原因]。
您覺得這樣可以接受嗎？或者您有其他建議？

# 不同意見
我理解這個觀點，但考慮到 [具體情境]，我認為目前的實作
更適合，因為 [具體理由]。您怎麼看？
```

## 測試指南

### 測試要求

所有程式碼變更都需要相應的測試：

1. **單元測試**
   - 測試個別函數和方法
   - 覆蓋正常和異常情況
   - 使用有意義的測試描述

2. **整合測試**（如適用）
   - 測試元件間的互動
   - 驗證資料流

3. **E2E 測試**（如適用）
   - 測試關鍵使用者流程

### 測試範例

```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUserById', () => {
    it('should return user when ID is valid', () => {
      const mockUser = { id: '1', name: 'Test User' };
      
      service.getUserById('1').subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/api/users/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle error when user not found', () => {
      service.getUserById('999').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('/api/users/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
```

## 發布流程

### 版本號規則

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR** (x.0.0): 不相容的 API 變更
- **MINOR** (0.x.0): 向後相容的新功能
- **PATCH** (0.0.x): 向後相容的錯誤修復

### 變更日誌

每次發布需要更新 CHANGELOG.md：

```markdown
## [1.2.0] - 2024-01-15

### Added
- 新增使用者權限管理功能
- 新增匯出報表功能

### Changed
- 優化使用者列表載入效能
- 更新依賴套件版本

### Fixed
- 修復登入時的記憶體洩漏問題
- 修正日期選擇器的時區問題

### Security
- 修補 XSS 漏洞
```

## 社群

### 溝通管道

- **GitHub Issues**: 錯誤報告和功能請求
- **GitHub Discussions**: 一般討論
- **Pull Requests**: 程式碼審查和討論

### 獲取幫助

遇到問題時：

1. 搜尋現有 Issues 和 Discussions
2. 查看文檔
3. 建立新 Issue 或 Discussion
4. 在 PR 中標記維護者

## 貢獻者認可

我們重視每一個貢獻：

- 貢獻者會列在 CONTRIBUTORS.md
- 重大貢獻會在發布說明中提及
- 持續貢獻者可能被邀請成為維護者

## 法律

### 授權

本專案使用 MIT 授權。提交貢獻即表示您同意：

- 您的貢獻將使用相同授權
- 您有權利貢獻這些內容

### Developer Certificate of Origin

提交程式碼時，請確保您：

- 擁有程式碼的著作權，或
- 有權利提交此程式碼

## 問題與建議

如果您對貢獻流程有任何問題或建議，請：

- 建立 Issue 討論
- 在現有 Issue 中提問
- 聯絡專案維護者

感謝您考慮為本專案做出貢獻！

## 相關文檔

- [Git 工作流程](./git-workflow.md)
- [程式碼審查指南](./code-review.md)
- [編碼規範](../standards/coding-standards.md)
- [開發指南](../development/getting-started.md)
