# 部署指南 (Deployment Guide)

> **版本**: 1.0.0  
> **最後更新**: 2025-11-22  
> **適用環境**: 開發、測試、生產

---

## 📋 目錄

1. [環境準備](#環境準備)
2. [環境變量配置](#環境變量配置)
3. [建構步驟](#建構步驟)
4. [部署步驟](#部署步驟)
5. [部署驗證](#部署驗證)
6. [常見問題排解](#常見問題排解)

---

## 環境準備

### 系統要求

#### 開發/構建環境
- **Node.js**: >= 20.x (推薦 20.11.0+)
- **Yarn**: >= 4.x (專案使用 Yarn 4.9.2)
- **Git**: >= 2.30.0
- **操作系統**: Windows 10+, macOS 12+, Linux (Ubuntu 20.04+)

#### 生產環境
- **Web 服務器**: Nginx >= 1.20 或 Apache >= 2.4
- **Node.js** (僅用於 SSR，可選): >= 20.x
- **SSL 證書**: 生產環境必需 HTTPS

### 軟件安裝

#### 1. 安裝 Node.js

**使用 nvm (推薦)**:
\`\`\`bash
# 安裝 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安裝 Node.js 20
nvm install 20
nvm use 20
nvm alias default 20
\`\`\`

**或下載官方安裝包**:
- 訪問 https://nodejs.org/
- 下載 LTS 版本
- 按照安裝向導完成安裝

#### 2. 啟用 Corepack (Yarn 4)

\`\`\`bash
# 啟用 Corepack
corepack enable

# 驗證 Yarn 版本
yarn --version
# 應該顯示: 4.9.2
\`\`\`

#### 3. 克隆代碼庫

\`\`\`bash
# 使用 HTTPS
git clone https://github.com/7Spade/ng-alain-gighub.git

# 或使用 SSH (推薦)
git clone git@github.com:7Spade/ng-alain-gighub.git

# 進入專案目錄
cd ng-alain-gighub
\`\`\`

---

## 環境變量配置

### 1. 創建環境配置文件

複製環境變量模板：

\`\`\`bash
# 開發環境
cp .env.example .env.development

# 測試環境
cp .env.example .env.staging

# 生產環境
cp .env.example .env.production
\`\`\`

### 2. Supabase 配置

**必需的環境變量**:

\`\`\`bash
# .env.production 示例
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (僅後端使用)
\`\`\`

**獲取 Supabase 憑證**:
1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的專案
3. 前往 \`Settings\` → \`API\`
4. 複製 \`Project URL\` 和 \`anon public\` key

### 3. 其他配置 (可選)

\`\`\`bash
# API 端點 (如果有額外的後端服務)
API_BASE_URL=https://api.yourdomain.com

# 應用配置
APP_NAME=ng-alain-github
APP_VERSION=1.0.0
APP_ENV=production

# 功能開關
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true
\`\`\`

---

## 建構步驟

### 1. 安裝依賴

\`\`\`bash
# 安裝 Node 模組
yarn install

# 驗證安裝
yarn lint:ts --help
\`\`\`

**預期時間**: 2-5 分鐘（取決於網絡速度）

### 2. 代碼檢查 (可選但推薦)

\`\`\`bash
# ESLint 檢查
yarn lint:ts

# Stylelint 檢查
yarn lint:style
\`\`\`

### 3. 運行測試 (可選但推薦)

\`\`\`bash
# 單元測試
yarn test-coverage

# 驗證測試覆蓋率
# 目標: >= 80%
\`\`\`

### 4. 構建生產版本

\`\`\`bash
# 構建生產版本
yarn build

# 構建將輸出到 dist/ng-alain-gighub/browser/
\`\`\`

**構建選項**:

\`\`\`bash
# 使用特定環境配置
yarn build --configuration=production

# 生成 source maps (用於調試)
yarn analyze

# 查看 bundle 分析
yarn analyze:view
\`\`\`

**預期構建時間**: 2-5 分鐘

---

## 部署步驟

### 選項 1: Vercel 部署 (推薦)

**自動部署**:

1. **連接 GitHub 倉庫**:
   - 訪問 [Vercel Dashboard](https://vercel.com/dashboard)
   - 點擊 "New Project"
   - 選擇 ng-alain-gighub 倉庫
   - 導入專案

2. **配置構建設置**:
   \`\`\`
   Framework Preset: Other
   Build Command: yarn build
   Output Directory: dist/ng-alain-gighub/browser
   Install Command: yarn install
   \`\`\`

3. **設置環境變量**:
   - 在 Vercel 專案設置中添加環境變量
   - 添加 SUPABASE_URL 和 SUPABASE_ANON_KEY

4. **部署**:
   - 點擊 "Deploy"
   - Vercel 將自動構建和部署

**手動部署**:

\`\`\`bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入 Vercel
vercel login

# 部署到生產
vercel --prod
\`\`\`

### 選項 2: Nginx 部署

**1. 構建應用**:
\`\`\`bash
yarn build
\`\`\`

**2. 複製文件到服務器**:
\`\`\`bash
# 使用 scp
scp -r dist/ng-alain-gighub/browser/ user@server:/var/www/ng-alain-gighub/

# 或使用 rsync
rsync -avz dist/ng-alain-gighub/browser/ user@server:/var/www/ng-alain-gighub/
\`\`\`

**3. 配置 Nginx**:

創建 \`/etc/nginx/sites-available/ng-alain-gighub\`:

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL 證書
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 根目錄
    root /var/www/ng-alain-gighub;
    index index.html;

    # Gzip 壓縮
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_min_length 1000;

    # Angular 路由配置
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 靜態資源緩存
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全標頭
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # 日誌
    access_log /var/log/nginx/ng-alain-gighub_access.log;
    error_log /var/log/nginx/ng-alain-gighub_error.log;
}
\`\`\`

**4. 啟用站點**:
\`\`\`bash
# 創建符號鏈接
sudo ln -s /etc/nginx/sites-available/ng-alain-gighub /etc/nginx/sites-enabled/

# 測試配置
sudo nginx -t

# 重新加載 Nginx
sudo systemctl reload nginx
\`\`\`

---

## 部署驗證

### 1. 健康檢查清單

- [ ] **首頁加載**: 訪問 \`https://yourdomain.com\` 正常顯示
- [ ] **用戶登入**: 測試認證流程
- [ ] **數據加載**: 驗證 Supabase 連接
- [ ] **路由導航**: 測試前端路由 (F5 刷新測試)
- [ ] **API 調用**: 驗證所有 API 請求成功
- [ ] **靜態資源**: 檢查 CSS、JS、圖片加載
- [ ] **響應式設計**: 測試不同設備尺寸
- [ ] **錯誤處理**: 測試 404 和錯誤頁面

### 2. 性能檢查

\`\`\`bash
# 使用 Lighthouse
npx lighthouse https://yourdomain.com --view

# 目標分數:
# Performance: >= 90
# Accessibility: >= 90
# Best Practices: >= 90
# SEO: >= 90
\`\`\`

---

## 常見問題排解

### 問題 1: 構建失敗

**解決方案**:
\`\`\`bash
# 1. 檢查 Node 版本
node --version
# 應該是 20.x

# 2. 清除並重新安裝依賴
rm -rf node_modules .yarn/cache
yarn install

# 3. 增加 Node 內存
export NODE_OPTIONS="--max-old-space-size=8192"
yarn build
\`\`\`

### 問題 2: 部署後白屏

**解決方案**:
- 檢查瀏覽器控制台錯誤
- 驗證 base href 配置
- 確認 Nginx 配置有 \`try_files\` 指令
- 檢查環境變量

### 問題 3: API 連接失敗

**解決方案**:
- 驗證 Supabase 環境變量
- 測試 Supabase 連接
- 檢查 CORS 設置
- 確認網絡防火牆規則

### 問題 4: 404 錯誤

**解決方案**:
\`\`\`nginx
# 在 Nginx 配置中添加
location / {
    try_files \$uri \$uri/ /index.html;
}
\`\`\`

---

## 緊急聯絡

- **技術支援**: tech-support@yourdomain.com
- **相關文檔**: [回滾步驟](./ROLLBACK.md)

---

**版本**: 1.0.0  
**維護者**: 開發團隊  
**最後審查**: 2025-11-22
