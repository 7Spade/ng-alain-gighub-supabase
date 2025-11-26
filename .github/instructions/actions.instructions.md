---
description: 'Best practices for GitHub Actions workflow files'
applyTo: ".github/workflows/**/*.yml"
---

在產生或改進 GitHub Actions 工作流程時：

安全第一
- 使用 GitHub Secrets 儲存敏感數據，切勿將憑證硬編碼到程式碼中。
- 透過使用 SHA 值將第三方操作固定到特定提交（例如，`- uses: owner/some-action@a824008085750b8e136effc585c3cd6082bd575f`）
- 配置工作流程所需的 GITHUB_TOKEN 的最小權限。

## 表演要點
- 使用 `actions/cache` 或內建快取選項快取相依性
- 新增 `timeout-minutes` 以防止工作流程掛起
- 使用矩陣策略進行多環境測試

最佳實踐
- 為工作流程、作業和步驟使用描述性名稱
- 新增適當的觸發器：`push`、`pull_request`、`workflow_dispatch`
- 新增 `if: always()` 語句，用於指定無論失敗都必須執行的清理步驟

## 範例模式
```yaml
名稱：CI
on: [推送, 拉取請求]

工作機會：
  測試：
    運行平台：ubuntu-latest
    超時時間（分鐘）：10
    步驟：
      - 使用：actions/checkout@v5
      - 使用：actions/setup-node@v4
        和：
          node 版本：20
          快取：npm
      - 運行：npm ci
      - 運行：npm 測試
```
