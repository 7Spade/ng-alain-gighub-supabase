# 第三方服務整合指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [整合原則](#整合原則)
  - [1. 安全性優先](#1-安全性優先)
  - [2. 服務降級](#2-服務降級)
  - [3. 錯誤重試](#3-錯誤重試)
- [API 整合](#api-整合)
  - [1. HTTP 攔截器](#1-http-攔截器)
  - [2. API 封裝服務](#2-api-封裝服務)
  - [3. Webhook 處理](#3-webhook-處理)
- [OAuth 認證](#oauth-認證)
  - [1. OAuth 2.0 流程](#1-oauth-20-流程)
- [支付服務](#支付服務)
  - [1. Stripe 整合](#1-stripe-整合)
- [雲端儲存](#雲端儲存)
  - [1. AWS S3 整合](#1-aws-s3-整合)
- [通訊服務](#通訊服務)
  - [1. SendGrid 電子郵件](#1-sendgrid-電子郵件)
  - [2. Twilio SMS](#2-twilio-sms)
- [監控與分析](#監控與分析)
  - [1. Google Analytics 4](#1-google-analytics-4)
  - [2. Sentry 錯誤追蹤](#2-sentry-錯誤追蹤)
- [錯誤處理](#錯誤處理)
  - [1. 統一錯誤處理](#1-統一錯誤處理)
  - [2. 重試策略](#2-重試策略)
- [相關文檔](#相關文檔)

---


> **目的**：提供第三方服務整合的最佳實踐，確保安全、可靠、可維護的外部服務整合

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：Development Team

- --

## 📋 目錄

1. [整合原則](#整合原則)
2. [API 整合](#api-整合)
3. [OAuth 認證](#oauth-認證)
4. [支付服務](#支付服務)
5. [雲端儲存](#雲端儲存)
6. [通訊服務](#通訊服務)
7. [監控與分析](#監控與分析)
8. [錯誤處理](#錯誤處理)

- --

## 整合原則

### 1. 安全性優先

**API 金鑰管理**
- ❌ 永遠不要將 API 金鑰寫死在程式碼中
- ✅ 使用環境變數儲存敏感資訊
- ✅ 在後端處理敏感操作
- ✅ 定期輪換 API 金鑰

**範例**

```typescript
// ❌ 錯誤做法
const apiKey = 'sk_live_abc123xyz';

// ✅ 正確做法
const apiKey = environment.apiKey;
```

### 2. 服務降級

```typescript
import { Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThirdPartyService {
  isServiceAvailable = signal(true);

  callExternalAPI() {
    return this.http.get('/api/external').pipe(
      catchError(error => {
        // 標記服務不可用
        this.isServiceAvailable.set(false);

        // 返回降級資料或快取資料
        return of(this.getCachedData());
      })
    );
  }

  private getCachedData() {
    // 返回快取或預設資料
    return [];
  }
}
```

### 3. 錯誤重試

```typescript
import { retry, timer } from 'rxjs';

export class RetryService {
  callWithRetry() {
    return this.http.get('/api/external').pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          // 指數退避：1s, 2s, 4s
          return timer(Math.pow(2, retryCount) * 1000);
        }
      })
    );
  }
}
```

- --

## API 整合

### 1. HTTP 攔截器

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = inject(EnvironmentService).apiKey;

  // 只為第三方 API 添加認證
  if (req.url.includes('api.thirdparty.com')) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  return next(req);
};
```

### 2. API 封裝服務

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ThirdPartyConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

@Injectable({ providedIn: 'root' })
export class ThirdPartyApiService {
  private http = inject(HttpClient);
  private config: ThirdPartyConfig = {
    baseUrl: 'https://api.thirdparty.com',
    apiKey: environment.thirdPartyApiKey,
    timeout: 10000
  };

  /**
   * 取得資源
   */
  getResource(id: string): Observable<any> {
    return this.http.get(`${this.config.baseUrl}/resources/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`
      }
    });
  }

  /**
   * 建立資源
   */
  createResource(data: any): Observable<any> {
    return this.http.post(`${this.config.baseUrl}/resources`, data, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
```

### 3. Webhook 處理

```typescript
import { Injectable } from '@angular/core';
import { createHmac } from 'crypto';

@Injectable({ providedIn: 'root' })
export class WebhookService {
  /**
   * 驗證 webhook 簽名
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  /**
   * 處理 webhook 事件
   */
  handleWebhook(event: any): void {
    switch (event.type) {
      case 'payment.success':
        this.handlePaymentSuccess(event.data);
        break;
      case 'payment.failed':
        this.handlePaymentFailed(event.data);
        break;
      default:
        console.warn('Unknown webhook event:', event.type);
    }
  }

  private handlePaymentSuccess(data: any): void {
    // 處理支付成功
  }

  private handlePaymentFailed(data: any): void {
    // 處理支付失敗
  }
}
```

- --

## OAuth 認證

### 1. OAuth 2.0 流程

```typescript
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private config = {
    clientId: environment.oauthClientId,
    clientSecret: environment.oauthClientSecret,
    authorizationUrl: 'https://oauth.provider.com/authorize',
    tokenUrl: 'https://oauth.provider.com/token',
    redirectUri: window.location.origin + '/auth/callback'
  };

  /**
   * 開始 OAuth 流程
   */
  initiateOAuth(): void {
    const state = this.generateRandomState();
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'read write',
      state
    });

    window.location.href = `${this.config.authorizationUrl}?${params}`;
  }

  /**
   * 處理 OAuth 回調
   */
  handleCallback(code: string, state: string): Promise<void> {
    // 驗證 state
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    // 交換 code 取得 access token
    return this.http.post<any>(this.config.tokenUrl, {
      grant_type: 'authorization_code',
      code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri
    }).toPromise().then(response => {
      // 儲存 access token
      localStorage.setItem('oauth_access_token', response.access_token);
      localStorage.setItem('oauth_refresh_token', response.refresh_token);

      this.router.navigate(['/dashboard']);
    });
  }

  /**
   * 刷新 access token
   */
  refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('oauth_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<any>(this.config.tokenUrl, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret
    }).toPromise().then(response => {
      localStorage.setItem('oauth_access_token', response.access_token);
    });
  }

  private generateRandomState(): string {
    return Math.random().toString(36).substring(7);
  }
}
```

- --

## 支付服務

### 1. Stripe 整合

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private http = inject(HttpClient);
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  async initialize(): Promise<void> {
    this.stripe = await loadStripe(environment.stripePublishableKey);
  }

  /**
   * 建立付款意圖
   */
  async createPaymentIntent(amount: number, currency: string = 'twd'): Promise<string> {
    const response = await this.http.post<any>('/api/payment/create-intent', {
      amount,
      currency
    }).toPromise();

    return response.clientSecret;
  }

  /**
   * 確認付款
   */
  async confirmPayment(clientSecret: string, cardElement: any): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const result = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.paymentIntent;
  }

  /**
   * 建立卡片元素
   */
  createCardElement(container: HTMLElement): any {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    this.elements = this.stripe.elements();
    const cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a'
        }
      }
    });

    cardElement.mount(container);
    return cardElement;
  }
}
```

- --

## 雲端儲存

### 1. AWS S3 整合

```typescript
import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable({ providedIn: 'root' })
export class S3Service {
  private s3Client: S3Client;
  private bucketName = environment.s3BucketName;

  constructor() {
    this.s3Client = new S3Client({
      region: environment.awsRegion,
      credentials: {
        accessKeyId: environment.awsAccessKeyId,
        secretAccessKey: environment.awsSecretAccessKey
      }
    });
  }

  /**
   * 上傳檔案
   */
  async uploadFile(file: File, key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: file.type
    });

    await this.s3Client.send(command);
    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  /**
   * 取得預簽名 URL（用於直接上傳）
   */
  async getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  /**
   * 取得預簽名 URL（用於下載）
   */
  async getPresignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
```

- --

## 通訊服務

### 1. SendGrid 電子郵件

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private http = inject(HttpClient);

  /**
   * 發送電子郵件（透過後端）
   */
  sendEmail(data: EmailData): Promise<void> {
    return this.http.post('/api/email/send', data).toPromise().then();
  }

  /**
   * 發送範本郵件
   */
  sendTemplateEmail(to: string, templateId: string, data: any): Promise<void> {
    return this.http.post('/api/email/send-template', {
      to,
      templateId,
      dynamicData: data
    }).toPromise().then();
  }
}
```

### 2. Twilio SMS

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SmsService {
  private http = inject(HttpClient);

  /**
   * 發送簡訊（透過後端）
   */
  sendSms(to: string, message: string): Promise<void> {
    return this.http.post('/api/sms/send', {
      to,
      message
    }).toPromise().then();
  }

  /**
   * 發送驗證碼
   */
  sendVerificationCode(phoneNumber: string): Promise<string> {
    return this.http.post<any>('/api/sms/send-verification', {
      phoneNumber
    }).toPromise().then(response => response.verificationId);
  }

  /**
   * 驗證驗證碼
   */
  verifyCode(verificationId: string, code: string): Promise<boolean> {
    return this.http.post<any>('/api/sms/verify-code', {
      verificationId,
      code
    }).toPromise().then(response => response.valid);
  }
}
```

- --

## 監控與分析

### 1. Google Analytics 4

```typescript
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: Function;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private router: Router) {
    // 追蹤頁面瀏覽
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.trackPageView(event.urlAfterRedirects);
    });
  }

  /**
   * 追蹤頁面瀏覽
   */
  trackPageView(url: string): void {
    if (typeof gtag !== 'undefined') {
      gtag('config', environment.gaTrackingId, {
        page_path: url
      });
    }
  }

  /**
   * 追蹤事件
   */
  trackEvent(action: string, category: string, label?: string, value?: number): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  }

  /**
   * 追蹤使用者屬性
   */
  setUserProperties(properties: Record<string, any>): void {
    if (typeof gtag !== 'undefined') {
      gtag('set', 'user_properties', properties);
    }
  }
}
```

### 2. Sentry 錯誤追蹤

```typescript
import { ErrorHandler, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {
    Sentry.init({
      dsn: environment.sentryDsn,
      environment: environment.production ? 'production' : 'development',
      tracesSampleRate: 1.0,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.routingInstrumentation
        })
      ]
    });
  }

  handleError(error: any): void {
    // 記錄到 Sentry
    Sentry.captureException(error);

    // 也記錄到 console
    console.error(error);
  }

  /**
   * 設定使用者資訊
   */
  setUser(user: { id: string; email?: string; username?: string }): void {
    Sentry.setUser(user);
  }

  /**
   * 新增額外資訊
   */
  addBreadcrumb(message: string, category: string, data?: any): void {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info'
    });
  }
}
```

- --

## 錯誤處理

### 1. 統一錯誤處理

```typescript
import { Injectable, signal } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface ServiceError {
  service: string;
  error: any;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ThirdPartyErrorHandler {
  errors = signal<ServiceError[]>([]);

  constructor(private message: NzMessageService) {}

  /**
   * 處理第三方服務錯誤
   */
  handleError(service: string, error: any): void {
    // 記錄錯誤
    this.errors.update(errors => [
      ...errors,
      { service, error, timestamp: new Date() }
    ]);

    // 根據錯誤類型顯示訊息
    if (error.status === 401) {
      this.message.error('認證失敗，請重新登入');
    } else if (error.status === 429) {
      this.message.warning('請求過於頻繁，請稍後再試');
    } else if (error.status >= 500) {
      this.message.error(`${service} 服務暫時無法使用`);
    } else {
      this.message.error(`操作失敗：${error.message || '未知錯誤'}`);
    }

    // 上報到監控系統
    this.reportError(service, error);
  }

  private reportError(service: string, error: any): void {
    // 上報到 Sentry 或其他監控系統
    console.error(`[${service}]`, error);
  }
}
```

### 2. 重試策略

```typescript
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RetryStrategy {
  /**
   * 指數退避重試
   */
  exponentialBackoff(maxRetries = 3, initialDelay = 1000) {
    return (errors: Observable<any>) => errors.pipe(
      mergeMap((error, index) => {
        const retryAttempt = index + 1;

        if (retryAttempt > maxRetries) {
          return throwError(() => error);
        }

        const delay = initialDelay * Math.pow(2, index);
        console.log(`Retry attempt ${retryAttempt} after ${delay}ms`);

        return timer(delay);
      })
    );
  }

  /**
   * 條件重試（只重試特定錯誤）
   */
  conditionalRetry(shouldRetry: (error: any) => boolean, maxRetries = 3) {
    return (errors: Observable<any>) => errors.pipe(
      mergeMap((error, index) => {
        const retryAttempt = index + 1;

        if (retryAttempt > maxRetries || !shouldRetry(error)) {
          return throwError(() => error);
        }

        console.log(`Conditional retry attempt ${retryAttempt}`);
        return timer(1000 * retryAttempt);
      })
    );
  }
}
```

- --

## 相關文檔

- [55-版本管理與發布指南.md](./55-版本管理與發布指南.md) - 版本管理
- [56-監控與告警配置指南.md](./56-監控與告警配置指南.md) - 監控告警
- [61-Edge-Function開發指南.md](./61-Edge-Function開發指南.md) - Edge Functions

- --

**版本歷史**

| 版本 | 日期 | 變更內容 | 作者 |
|------|------|---------|------|
| v1.0 | 2025-11-16 | 初始版本 | Development Team |
