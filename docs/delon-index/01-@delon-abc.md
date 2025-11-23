# @delon/abc 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心特點](#核心特點)
- [安裝與導入](#安裝與導入)
  - [安裝](#安裝)
  - [導入方式](#導入方式)
    - [方式 1：單個組件導入](#方式-1單個組件導入)
    - [方式 2：使用 SHARED_IMPORTS（推薦）](#方式-2使用-shared_imports推薦)
- [主要組件](#主要組件)
  - [ST (Smart Table) - 智能表格](#st-smart-table---智能表格)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [使用示例](#使用示例)
  - [SV (Simple View) - 鍵值描述視圖](#sv-simple-view---鍵值描述視圖)
    - [基本用法](#基本用法)
  - [SE (Simple Edit) - 表單佈局](#se-simple-edit---表單佈局)
    - [基本用法](#基本用法)
  - [PageHeader - 頁面標題](#pageheader---頁面標題)
    - [基本用法](#基本用法)
  - [Ellipsis - 文本省略](#ellipsis---文本省略)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [使用示例](#使用示例)
  - [FooterToolbar - 底部工具欄](#footertoolbar---底部工具欄)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [使用示例](#使用示例)
  - [FullContent - 全屏內容](#fullcontent---全屏內容)
    - [基本用法](#基本用法)
  - [ReuseTab - 標籤頁（路由快取）](#reusetab---標籤頁路由快取)
    - [基本用法](#基本用法)
  - [TagSelect - 標籤選擇](#tagselect---標籤選擇)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [使用示例](#使用示例)
  - [Onboarding - 引導式操作](#onboarding---引導式操作)
    - [基本用法](#基本用法)
    - [使用示例](#使用示例)
  - [QuickMenu - 快捷菜單](#quickmenu---快捷菜單)
    - [基本用法](#基本用法)
    - [使用示例](#使用示例)
  - [CountDown - 倒計時](#countdown---倒計時)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [使用示例](#使用示例)
  - [GlobalFooter - 全局頁腳](#globalfooter---全局頁腳)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [使用示例](#使用示例)
  - [Exception - 異常頁面](#exception---異常頁面)
    - [基本用法](#基本用法)
  - [NoticeIcon - 通知圖標](#noticeicon---通知圖標)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [使用示例](#使用示例)
  - [DownFile - 下載文件指令](#downfile---下載文件指令)
    - [基本用法](#基本用法)
    - [主要屬性](#主要屬性)
    - [使用示例](#使用示例)
  - [Cell - 單元格渲染](#cell---單元格渲染)
    - [基本用法](#基本用法)
    - [使用示例](#使用示例)
- [實際使用示例](#實際使用示例)
  - [示例 1：ST 表格完整示例](#示例-1st-表格完整示例)
  - [示例 2：SV 鍵值描述視圖](#示例-2sv-鍵值描述視圖)
  - [示例 3：SE 表單佈局](#示例-3se-表單佈局)
- [最佳實踐](#最佳實踐)
  - [1. 使用 SHARED_IMPORTS](#1-使用-shared_imports)
  - [2. 使用 Signals 管理表格數據](#2-使用-signals-管理表格數據)
  - [3. ST 表格列配置](#3-st-表格列配置)
- [常見問題](#常見問題)
  - [Q1: 如何自定義 ST 表格列渲染？](#q1-如何自定義-st-表格列渲染)
  - [Q2: 如何實現 ST 表格服務器端分頁？](#q2-如何實現-st-表格服務器端分頁)
  - [Q3: 如何清空 ReuseTab 緩存？](#q3-如何清空-reusetab-緩存)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)
  - [相關組件](#相關組件)

---


> 📋 **目的**：詳細說明 `@delon/abc` 業務組件庫的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/abc ^20.1.0
**相關文檔**：[SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [主要組件](#主要組件)
  - [ST (Smart Table) - 智能表格](#st-smart-table---智能表格)
  - [SV (Simple View) - 鍵值描述視圖](#sv-simple-view---鍵值描述視圖)
  - [SE (Simple Edit) - 表單佈局](#se-simple-edit---表單佈局)
  - [PageHeader - 頁面標題](#pageheader---頁面標題)
  - [Ellipsis - 文本省略](#ellipsis---文本省略)
  - [FooterToolbar - 底部工具欄](#footertoolbar---底部工具欄)
  - [FullContent - 全屏內容](#fullcontent---全屏內容)
  - [ReuseTab - 標籤頁（路由快取）](#reusetab---標籤頁路由快取)
  - [TagSelect - 標籤選擇](#tagselect---標籤選擇)
  - [Onboarding - 引導式操作](#onboarding---引導式操作)
  - [QuickMenu - 快捷菜單](#quickmenu---快捷菜單)
  - [CountDown - 倒計時](#countdown---倒計時)
  - [GlobalFooter - 全局頁腳](#globalfooter---全局頁腳)
  - [Exception - 異常頁面](#exception---異常頁面)
  - [NoticeIcon - 通知圖標](#noticeicon---通知圖標)
  - [DownFile - 下載文件指令](#downfile---下載文件指令)
  - [Cell - 單元格渲染](#cell---單元格渲染)
- [實際使用示例](#實際使用示例)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/abc` 是 ng-alain 框架提供的業務組件庫，包含17個常用業務組件，涵蓋表格、表單、佈局、展示等各個方面。

### 核心特點

- **豐富組件**：17個業務組件，覆蓋常見業務場景
- **功能強大**：ST 表格支持排序、篩選、分頁等高級功能
- **易於使用**：組件 API 設計簡潔，易於上手
- **類型安全**：完整的 TypeScript 類型定義

- --

## 安裝與導入

### 安裝

`@delon/abc` 已包含在專案依賴中（`package.json`）：

```json
{
  "dependencies": {
    "@delon/abc": "^20.1.0"
  }
}
```

### 導入方式

#### 方式 1：單個組件導入

```typescript
// 單個組件導入
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { SEModule } from '@delon/abc/se';
import { PageHeaderModule } from '@delon/abc/page-header';
import { EllipsisComponent } from '@delon/abc/ellipsis';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { FullContentModule } from '@delon/abc/full-content';
import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { TagSelectComponent } from '@delon/abc/tag-select';
import { OnboardingModule } from '@delon/abc/onboarding';
import { QuickMenuModule } from '@delon/abc/quick-menu';
import { CountDownModule } from '@delon/abc/count-down';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { ExceptionModule } from '@delon/abc/exception';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { DownFileDirective } from '@delon/abc/down-file';
import { CellModule } from '@delon/abc/cell';
```

#### 方式 2：使用 SHARED_IMPORTS（推薦）

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含所有 @delon/abc 組件
  // ...
})
export class ExampleComponent {}
```

- --

## 主要組件

### ST (Smart Table) - 智能表格

**導入**：`import { STModule } from '@delon/abc/st';`
**文檔**：https://ng-alain.com/components/st

功能強大的數據表格組件，支持排序、篩選、分頁、自定義渲染等功能。

#### 基本用法

```html
<st
  #st
  [data]="data"
  [columns]="columns"
  [loading]="loading"
  [page]="{ front: false, show: true, showSize: true }"
  (change)="onTableChange($event)">
</st>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[data]` | 表格數據 | `STData[]` | `[]` |
| `[columns]` | 列配置 | `STColumn[]` | `[]` |
| `[loading]` | 加載狀態 | `boolean` | `false` |
| `[page]` | 分頁配置 | `STPage` | `-` |
| `[scroll]` | 滾動配置 | `{ x?: string; y?: string }` | `-` |
| `(change)` | 表格變化事件 | `EventEmitter<STChange>` | `-` |

#### 使用示例

**實際使用案例**：

```23:58:src/app/routes/accounts/list/account-list.component.ts
      <st
        #st
        [data]="accountService.accounts()"
        [columns]="columns"
        [loading]="accountService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange($event)"
      >
        <ng-template #type let-record>
          @switch (record.type) {
            @case ('User') {
              <nz-tag nzColor="blue">用户</nz-tag>
            }
            @case ('Bot') {
              <nz-tag nzColor="purple">机器人</nz-tag>
            }
            @case ('Organization') {
              <nz-tag nzColor="green">组织</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('active') {
              <nz-tag nzColor="success">活跃</nz-tag>
            }
            @case ('inactive') {
              <nz-tag nzColor="default">非活跃</nz-tag>
            }
            @case ('suspended') {
              <nz-tag nzColor="error">已暂停</nz-tag>
            }
          }
        </ng-template>
      </st>
```

```67:94:src/app/routes/accounts/list/account-list.component.ts
  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '名称', index: 'name', width: 200 },
    { title: '类型', index: 'type', width: 100, render: 'type' },
    { title: '邮箱', index: 'email', width: 200 },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: Account) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: Account) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: Account) => this.delete(record.id)
        }
      ]
    }
  ];
```

**更多實際使用案例**：

```24:66:src/app/routes/delon/st/st.component.ts
  columns: STColumn[] = [
    { title: 'id', index: 'id.value', type: 'checkbox' },
    { title: 'Avatar', index: 'picture.thumbnail', type: 'img', width: 80 },
    {
      title: 'Name',
      index: 'name.first',
      width: 150,
      format: item => `${item.name.first} ${item.name.last}`,
      type: 'link',
      click: item => this.message.info(`${item.name.first}`)
    },
    { title: 'Email', index: 'email' },
    {
      title: 'Gender',
      index: 'gender',
      type: 'yn',
      yn: {
        truth: 'female',
        yes: '男',
        no: '女',
        mode: 'text'
      },
      width: 120
    },
    { title: 'Events', render: 'events', width: 90 },
    { title: 'Registered', index: 'registered.date', type: 'date', width: 170 },
    {
      title: 'Actions',
      width: 120,
      buttons: [
        {
          text: 'Edit',
          click: item => this.message.info(`edit [${item.id.value}]`),
          iif: item => item.gender === 'female'
        },
        {
          text: 'Delete',
          type: 'del',
          click: item => this.message.info(`deleted [${item.id.value}]`)
        }
      ]
    }
  ];
```

- --

### SV (Simple View) - 鍵值描述視圖

**導入**：`import { SVModule } from '@delon/abc/sv';`
**文檔**：https://ng-alain.com/components/sv

用於鍵值對形式的數據展示。

#### 基本用法

```html
<sv-container [col]="2" [size]="'large'" [title]="'標題'">
  <sv label="標籤1">值1</sv>
  <sv label="標籤2">值2</sv>
</sv-container>
```

**實際使用案例**：

```1:17:src/app/routes/pro/profile/basic/basic.component.html
<page-header [title]="'基础详情页'" />
<nz-card [nzHoverable]="true" [nzBordered]="false">
  <sv-container size="large" title="退款申请">
    <sv label="取货单号">1000000000</sv>
    <sv label="状态">已取货</sv>
    <sv label="销售单号">1234123421</sv>
    <sv label="子订单">3214321432</sv>
  </sv-container>
  <nz-divider />
  <sv-container size="large" title="用户信息">
    <sv label="用户姓名">付小小</sv>
    <sv label="联系电话">18100000000</sv>
    <sv label="常用快递">菜鸟仓储</sv>
    <sv label="取货地址">浙江省杭州市西湖区万塘路18号</sv>
    <sv label="备注">无</sv>
  </sv-container>
```

```40:49:src/app/routes/pro/profile/advanced/advanced.component.html
  <sv-container size="small" col="2">
    <sv label="创建人">曲丽丽</sv>
    <sv label="订购产品">XX 服务</sv>
    <sv label="创建时间">2017-07-07</sv>
    <sv label="关联单据">
      <a (click)="msg.success('yes')">12421</a>
    </sv>
    <sv label="生效日期">2017-07-07 ~ 2017-08-08</sv>
    <sv label="备注">请于两个工作日内确认</sv>
  </sv-container>
```

- --

### SE (Simple Edit) - 表單佈局

**導入**：`import { SEModule } from '@delon/abc/se';`
**文檔**：https://ng-alain.com/components/se

簡潔的表單佈局組件，快速排版表單項。

#### 基本用法

```html
<se-container [col]="2" [gutter]="32">
  <se-item label="用戶名">
    <input nz-input [(ngModel)]="username" />
  </se-item>
  <se-item label="郵箱">
    <input nz-input type="email" [(ngModel)]="email" />
  </se-item>
</se-container>
```

**實際使用案例**：

```13:21:src/app/routes/delon/st/st.component.html
        <form nz-form nzLayout="inline" se-container>
          <se label="User ID" labelWidth="0">
            <input nz-input [(ngModel)]="args.userid" name="userid" id="userid" />
          </se>
          <se>
            <button nz-button [nzType]="'primary'" (click)="st.load()" [nzLoading]="http.loading">Search</button>
            <button nz-button (click)="st.load(1, { _allow_anonymous: true })" [disabled]="http.loading">Clear</button>
          </se>
        </form>
```

- --

### PageHeader - 頁面標題

**導入**：`import { PageHeaderModule } from '@delon/abc/page-header';`
**文檔**：https://ng-alain.com/components/page-header

頁面標題區，包含麵包屑和操作區。

#### 基本用法

```html
<page-header [title]="'頁面標題'" [breadcrumb]="breadcrumb">
  <ng-template #extra>
    <button nz-button nzType="primary">操作</button>
  </ng-template>
</page-header>
```

**實際使用案例**：

```13:20:src/app/routes/accounts/list/account-list.component.ts
    <page-header [title]="'账户管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createAccount()">
          <span nz-icon nzType="plus"></span>
          新建账户
        </button>
      </ng-template>
    </page-header>
```

```12:33:src/app/routes/accounts/detail/account-detail.component.ts
    <page-header [title]="'账户详情'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        @if (account()) {
          <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
            <span nz-icon nzType="edit"></span>
            编辑
          </button>
          <button nz-button nzDanger (click)="delete()">
            <span nz-icon nzType="delete"></span>
            删除
          </button>
        }
      </ng-template>
    </page-header>
```

```1:39:src/app/routes/pro/profile/advanced/advanced.component.html
<page-header [title]="'单号：234231029431'" [logo]="logo" [action]="action" [extra]="extra" [tab]="tab">
  <ng-template #logo>
    <img src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
  </ng-template>
  <ng-template #action>
    <nz-space-compact>
      <button nz-button>操作</button>
      <button nz-button>操作</button>
    </nz-space-compact>
    <button nz-button nz-dropdown [nzDropdownMenu]="opMenu" class="mx-sm">
      <i nz-icon nzType="ellipsis"></i>
    </button>
    <nz-dropdown-menu #opMenu="nzDropdownMenu">
      <ul nz-menu>
        <li nz-menu-item>选项一</li>
        <li nz-menu-item>选项二</li>
        <li nz-menu-item>选项三</li>
      </ul>
    </nz-dropdown-menu>
    <button nz-button [nzType]="'primary'">主操作</button>
  </ng-template>
  <ng-template #extra>
    <div nz-row>
      <div nz-col nzXs="24" nzSm="12">
        <p class="text-grey">状态</p>
        <p class="text-lg">待审批</p>
      </div>
      <div nz-col nzXs="24" nzSm="12">
        <p class="text-grey">订单金额</p>
        <p class="text-lg">¥ 568.08</p>
      </div>
    </div>
  </ng-template>
  <ng-template #tab>
    <nz-tabs>
      <nz-tab nzTitle="详情" />
      <nz-tab nzTitle="规则" />
    </nz-tabs>
  </ng-template>
```

- --

### Ellipsis - 文本省略

**導入**：`import { EllipsisComponent } from '@delon/abc/ellipsis';`
**文檔**：https://ng-alain.com/components/ellipsis

文本超出省略顯示組件，支持按長度或行數省略，並可顯示 Tooltip。

#### 基本用法

```html
<ellipsis [tooltip]="true" [length]="50">{{ text }}</ellipsis>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[tooltip]` | 是否顯示 Tooltip | `boolean` | `false` |
| `[length]` | 最大顯示長度（字符數） | `number` | `-` |
| `[lines]` | 最大顯示行數 | `number` | `-` |
| `[fullWidthRecognition]` | 是否將全角字符視為兩個字符 | `boolean` | `false` |

#### 使用示例

**實際使用案例**：

```38:38:src/app/routes/pro/list/card-list/card-list.component.html
              <ellipsis>{{ item.description }}</ellipsis>
```

**按行數省略**：

```html
<ellipsis [lines]="2" [tooltip]="true">
  這是一段很長的文本，當超過兩行時會自動省略並顯示省略號，鼠標懸停時會顯示完整內容。
</ellipsis>
```

**按長度省略**：

```html
<ellipsis [length]="50" [tooltip]="true">
  這是一段很長的文本，當超過50個字符時會自動省略。
</ellipsis>
```

- --

### FooterToolbar - 底部工具欄

**導入**：`import { FooterToolbarModule } from '@delon/abc/footer-toolbar';`
**文檔**：https://ng-alain.com/components/footer-toolbar

頁面底部操作工具欄，固定在頁面底部，適合表單提交等場景。

#### 基本用法

```html
<footer-toolbar>
  <button nz-button>取消</button>
  <button nz-button nzType="primary">確定</button>
</footer-toolbar>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[errorCollect]` | 是否顯示表單錯誤收集 | `boolean` | `false` |
| `[extra]` | 額外內容（左側） | `TemplateRef<void>` | `-` |

#### 使用示例

**實際使用案例**：

```1:19:src/app/routes/pro/form/advanced-form/advanced-form.component.ts
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { SHARED_IMPORTS } from '@shared';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

interface UserForm {
  key: FormControl<string>;
  workId: FormControl<string>;
  name: FormControl<string>;
  department: FormControl<string>;
}

@Component({
  selector: 'app-advanced-form',
  templateUrl: './advanced-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS, FooterToolbarModule]
})
```

**帶錯誤收集的表單工具欄**：

```html
<footer-toolbar [errorCollect]="true">
  <button nz-button (click)="reset()">重置</button>
  <button nz-button nzType="primary" (click)="submit()">提交</button>
</footer-toolbar>
```

- --

### FullContent - 全屏內容

**導入**：`import { FullContentModule } from '@delon/abc/full-content';`
**文檔**：https://ng-alain.com/components/full-content

內容區全屏/填充切換。

#### 基本用法

```html
<full-content (fullscreenChange)="onFullscreenChange($event)">
  <nz-card>
    <!-- 內容 -->
  </nz-card>
</full-content>
```

**實際使用案例**：

```9:47:src/app/routes/delon/st/st.component.html
<full-content (fullscreenChange)="fullChange($event)">
  <nz-card>
    <div nz-row class="mb-md">
      <div nz-col nzSpan="12">
        <form nz-form nzLayout="inline" se-container>
          <se label="User ID" labelWidth="0">
            <input nz-input [(ngModel)]="args.userid" name="userid" id="userid" />
          </se>
          <se>
            <button nz-button [nzType]="'primary'" (click)="st.load()" [nzLoading]="http.loading">Search</button>
            <button nz-button (click)="st.load(1, { _allow_anonymous: true })" [disabled]="http.loading">Clear</button>
          </se>
        </form>
      </div>
      <div nz-col nzSpan="12">
        <div class="text-right">
          <button nz-button nz-dropdown [nzDropdownMenu]="exportMenu">
            <span>Export</span>
            <i nz-icon nzType="down"></i>
          </button>
          <nz-dropdown-menu #exportMenu="nzDropdownMenu">
            <ul nz-menu>
              <li nz-menu-item>Excel</li>
              <li nz-menu-item>JSON</li>
              <li nz-menu-item>PNG</li>
            </ul>
          </nz-dropdown-menu>
          <button nz-button [nzType]="'default'" full-toggle class="ml-sm">Full</button>
        </div>
      </div>
    </div>
    <st #st [data]="url" [req]="{ params: args }" [res]="{ reName: { list: 'results' } }" [total]="total" [ps]="ps"
      [columns]="columns" [scroll]="scroll">
      <ng-template st-row="events" let-item let-index="index">
        <g2-mini-bar height="15" theme="mini" color="#999" borderWidth="3" [padding]="[0, 0, 0, 0]" [data]="events"
          tooltipType="mini" />
      </ng-template>
    </st>
  </nz-card>
</full-content>
```

```72:74:src/app/routes/delon/st/st.component.ts
  fullChange(val?: boolean): void {
    this.scroll = val ? { y: '350px' } : { y: '230px' };
  }
```

- --

### ReuseTab - 標籤頁（路由快取）

**導入**：`import { ReuseTabModule } from '@delon/abc/reuse-tab';`
**文檔**：https://ng-alain.com/components/reuse-tab

標籤頁組件，支持路由快取。

#### 基本用法

在路由配置中啟用：

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { reuse: true } // 啟用路由快取
  }
];
```

**實際使用案例**：

```88:88:src/app/routes/passport/login/login.component.ts
          this.reuseTabService?.clear();
```

- --

### TagSelect - 標籤選擇

**導入**：`import { TagSelectComponent } from '@delon/abc/tag-select';`
**文檔**：https://ng-alain.com/components/tag-select

Tag 多選與展開/收起選擇器，用於篩選和標籤選擇場景。

#### 基本用法

```html
<tag-select [(ngModel)]="selectedTags" [expandable]="true">
  <nz-tag nzMode="checkable" [nzChecked]="tag.checked" (nzCheckedChange)="onChange($event, tag)">
    {{ tag.text }}
  </nz-tag>
</tag-select>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[expandable]` | 是否可展開/收起 | `boolean` | `false` |
| `[hideExpanded]` | 展開後是否隱藏展開按鈕 | `boolean` | `false` |

#### 使用示例

**實際使用案例**：

```4:10:src/app/routes/pro/list/projects/projects.component.html
      <tag-select>
        @for (i of categories; track $index) {
          <nz-tag nzMode="checkable" [nzChecked]="i.value" (nzCheckedChange)="changeCategory($event, $index)">
            {{ i.text }}
          </nz-tag>
        }
      </tag-select>
```

**配合 SE 表單佈局使用**：

```html
<se label="所属类目">
  <tag-select [expandable]="true">
    <nz-tag nzMode="checkable" *ngFor="let tag of tags" [nzChecked]="tag.checked">
      {{ tag.text }}
    </nz-tag>
  </tag-select>
</se>
```

- --

### Onboarding - 引導式操作

**導入**：`import { OnboardingModule, OnboardingService } from '@delon/abc/onboarding';`
**文檔**：https://ng-alain.com/components/onboarding

引導式操作組件，用於新用戶引導和功能提示。

#### 基本用法

```typescript
import { OnboardingService } from '@delon/abc/onboarding';

const obSrv = inject(OnboardingService);

// 啟動引導
obSrv.start(config);
```

#### 使用示例

**實際使用案例**：

```94:103:src/app/routes/dashboard/v1/v1.component.ts
  private genOnboarding(): void {
    const KEY = 'on-boarding';
    if (!this.platform.isBrowser || localStorage.getItem(KEY) === '1') {
      return;
    }
    this.http.get(`./assets/tmp/on-boarding.json`).subscribe(res => {
      this.obSrv.start(res);
      localStorage.setItem(KEY, '1');
    });
  }
```

**配置示例**：

```json
{
  "items": [
    {
      "title": "歡迎使用",
      "selector": "#welcome",
      "placement": "bottom"
    },
    {
      "title": "這是功能區",
      "selector": "#features",
      "placement": "right"
    }
  ]
}
```

- --

### QuickMenu - 快捷菜單

**導入**：`import { QuickMenuModule } from '@delon/abc/quick-menu';`
**文檔**：https://ng-alain.com/components/quick-menu

快捷菜單組件，用於快速導航和常用功能入口。

#### 基本用法

```html
<quick-menu>
  <nz-list [nzBordered]="false" [nzSplit]="false">
    <nz-list-item>
      <a routerLink="/dashboard">儀表盤</a>
    </nz-list-item>
    <nz-list-item>
      <a routerLink="/settings">設置</a>
    </nz-list-item>
  </nz-list>
</quick-menu>
```

#### 使用示例

**實際使用案例**：

```7:25:src/app/routes/dashboard/v1/v1.component.html
<quick-menu>
  <nz-list [nzBordered]="false" [nzSplit]="false">
    <nz-list-item>
      <a routerLink="/">Home</a>
    </nz-list-item>
    <nz-list-item>
      <a routerLink="/widgets">Widgets</a>
    </nz-list-item>
    <nz-list-item>
      <a routerLink="/style/typography">typography</a>
    </nz-list-item>
    <nz-list-item>
      <a routerLink="/style/gridmasonry">gridmasonry</a>
    </nz-list-item>
    <nz-list-item>
      <a routerLink="/pro/result/success">success result</a>
    </nz-list-item>
  </nz-list>
</quick-menu>
```

- --

### CountDown - 倒計時

**導入**：`import { CountDownModule } from '@delon/abc/count-down';`
**文檔**：https://ng-alain.com/components/count-down

倒計時組件，基於 `ngx-countdown`，支持多種格式和配置。

#### 基本用法

```html
<count-down [config]="countdownConfig" (end)="onEnd()"></count-down>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[config]` | 倒計時配置 | `CountdownConfig` | `-` |
| `[target]` | 目標時間（已棄用，使用 config） | `Date \| number` | `-` |
| `(end)` | 倒計時結束事件 | `EventEmitter<void>` | `-` |

#### 使用示例

**實際使用案例**：

```42:45:src/app/routes/dashboard/monitor/monitor.component.ts
  cd: CountdownConfig = {
    format: `HH:mm:ss.S`,
    leftTime: 10000
  };
```

```12:16:src/app/routes/dashboard/monitor/monitor.component.html
          <number-info [subTitle]="'app.monitor.remaining-time' | i18n" [total]="lastTotalTime">
            <ng-template #lastTotalTime>
              <count-down [config]="cd" />
            </ng-template>
          </number-info>
```

**配置示例**：

```typescript
import type { CountdownConfig } from 'ngx-countdown';

countdownConfig: CountdownConfig = {
  format: 'HH:mm:ss',
  leftTime: 3600, // 1小時（秒）
  demand: true
};
```

- --

### GlobalFooter - 全局頁腳

**導入**：`import { GlobalFooterModule } from '@delon/abc/global-footer';`
**文檔**：https://ng-alain.com/components/global-footer

全局頁腳組件，用於顯示版權信息、鏈接等。

#### 基本用法

```html
<global-footer [links]="links" [copyright]="copyright"></global-footer>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[links]` | 鏈接列表 | `Array<{ title: string; href: string; blankTarget?: boolean }>` | `[]` |
| `[copyright]` | 版權信息 | `string` | `-` |

#### 使用示例

**實際使用案例**：

```3:3:src/app/layout/passport/passport.component.ts
import { GlobalFooterModule } from '@delon/abc/global-footer';
```

**配置示例**：

```typescript
links = [
  { title: '幫助', href: 'https://ng-alain.com' },
  { title: '隱私', href: 'https://ng-alain.com' },
  { title: '條款', href: 'https://ng-alain.com' }
];

copyright = '2024 © ng-alain';
```

- --

### Exception - 異常頁面

**導入**：`import { ExceptionModule } from '@delon/abc/exception';`
**文檔**：https://ng-alain.com/components/exception

異常頁面組件（404、403、500 等）。

#### 基本用法

```html
<exception type="404" [backRouterLink]="['/']"></exception>
```

**實際使用案例**：

```1:16:src/app/routes/exception/exception.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExceptionModule, ExceptionType } from '@delon/abc/exception';

@Component({
  selector: 'app-exception',
  template: ` <exception [type]="type" style="min-height: 500px; height: 80%;" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ExceptionModule]
})
export class ExceptionComponent {
  private readonly route = inject(ActivatedRoute);
  get type(): ExceptionType {
    return this.route.snapshot.data['type'];
  }
}
```

- --

### NoticeIcon - 通知圖標

**導入**：`import { NoticeIconModule, NoticeItem, NoticeIconSelect } from '@delon/abc/notice-icon';`
**文檔**：https://ng-alain.com/components/notice-icon

通知圖標組件，用於顯示通知、消息、待辦等信息。

#### 基本用法

```html
<notice-icon
  [data]="data"
  [count]="count"
  [loading]="loading"
  (select)="select($event)"
  (clear)="clear($event)"
  (popoverVisibleChange)="loadData()"
/>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[data]` | 通知數據 | `NoticeItem[]` | `[]` |
| `[count]` | 未讀數量 | `number` | `0` |
| `[loading]` | 加載狀態 | `boolean` | `false` |
| `[btnClass]` | 按鈕樣式類 | `string` | `-` |
| `[btnIconClass]` | 圖標樣式類 | `string` | `-` |
| `(select)` | 選擇通知事件 | `EventEmitter<NoticeIconSelect>` | `-` |
| `(clear)` | 清空通知事件 | `EventEmitter<string>` | `-` |
| `(popoverVisibleChange)` | 彈窗顯示/隱藏事件 | `EventEmitter<boolean>` | `-` |

#### 使用示例

**實際使用案例**：

```1:195:src/app/layout/basic/widgets/notify.component.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { NoticeIconList, NoticeIconModule, NoticeIconSelect, NoticeItem } from '@delon/abc/notice-icon';
import { add, formatDistanceToNow, parse } from 'date-fns';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'header-notify',
  template: `
    <notice-icon
      [data]="data"
      [count]="count"
      [loading]="loading"
      btnClass="alain-default__nav-item"
      btnIconClass="alain-default__nav-item-icon"
      (select)="select($event)"
      (clear)="clear($event)"
      (popoverVisibleChange)="loadData()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NoticeIconModule]
})
export class HeaderNotifyComponent {
  private readonly msg = inject(NzMessageService);
  private readonly nzI18n = inject(NzI18nService);
  private readonly cdr = inject(ChangeDetectorRef);
  data: NoticeItem[] = [
    {
      title: '通知',
      list: [],
      emptyText: '你已查看所有通知',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: '清空通知'
    },
    {
      title: '消息',
      list: [],
      emptyText: '您已读完所有消息',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
      clearText: '清空消息'
    },
    {
      title: '待办',
      list: [],
      emptyText: '你已完成所有待办',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: '清空待办'
    }
  ];
  count = 5;
  loading = false;

  private updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach(i => (i.list = []));

    notices.forEach(item => {
      const newItem = { ...item } as NoticeIconList;
      if (typeof newItem.datetime === 'string') {
        newItem.datetime = parse(newItem.datetime, 'yyyy-MM-dd', new Date());
      }
      if (newItem.datetime) {
        newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
      }
      if (newItem.extra && newItem['status']) {
        newItem['color'] = (
          {
            todo: undefined,
            processing: 'blue',
            urgent: 'red',
            doing: 'gold'
          } as Record<string, string | undefined>
        )[newItem['status']];
      }
      data.find(w => w.title === newItem['type'])!.list.push(newItem);
    });
    return data;
  }

  loadData(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      const now = new Date();
      this.data = this.updateNoticeData([
        {
          id: '000000001',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '你收到了 14 份新周报',
          datetime: add(now, { days: 10 }),
          type: '通知'
        },
        {
          id: '000000002',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
          title: '你推荐的 曲妮妮 已通过第三轮面试',
          datetime: add(now, { days: -3 }),
          type: '通知'
        },
        {
          id: '000000003',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
          title: '这种模板可以区分多种通知类型',
          datetime: add(now, { months: -3 }),
          read: true,
          type: '通知'
        },
        {
          id: '000000004',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
          title: '左侧图标用于区分不同的类型',
          datetime: add(now, { years: -1 }),
          type: '通知'
        },
        {
          id: '000000005',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
          title: '内容不要超过两行字，超出时自动截断',
          datetime: '2017-08-07',
          type: '通知'
        },
        {
          id: '000000006',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '曲丽丽 评论了你',
          description: '描述信息描述信息描述信息',
          datetime: '2017-08-07',
          type: '消息'
        },
        {
          id: '000000007',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '朱偏右 回复了你',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: '消息'
        },
        {
          id: '000000008',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
          title: '标题',
          description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
          datetime: '2017-08-07',
          type: '消息'
        },
        {
          id: '000000009',
          title: '任务名称',
          description: '任务需要在 2017-01-12 20:00 前启动',
          extra: '未开始',
          status: 'todo',
          type: '待办'
        },
        {
          id: '000000010',
          title: '第三方紧急代码变更',
          description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '马上到期',
          status: 'urgent',
          type: '待办'
        },
        {
          id: '000000011',
          title: '信息安全考试',
          description: '指派竹尔于 2017-01-09 前完成更新并发布',
          extra: '已耗时 8 天',
          status: 'doing',
          type: '待办'
        },
        {
          id: '000000012',
          title: 'ABCD 版本发布',
          description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
          extra: '进行中',
          status: 'processing',
          type: '待办'
        }
      ]);

      this.loading = false;
      this.cdr.detectChanges();
    }, 500);
  }

  clear(type: string): void {
    this.msg.success(`清空了 ${type}`);
  }

  select(res: NoticeIconSelect): void {
    this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
  }
}
```

- --

### DownFile - 下載文件指令

**導入**：`import { DownFileDirective } from '@delon/abc/down-file';`
**文檔**：https://ng-alain.com/components/down-file

下載文件指令，用於觸發文件下載。

#### 基本用法

```html
<button nz-button [down-file]="fileUrl" [file-name]="fileName">下載</button>
```

#### 主要屬性

| 屬性 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[down-file]` | 文件 URL 或 Blob | `string \| Blob` | `-` |
| `[file-name]` | 下載文件名 | `string` | `-` |
| `[options]` | 下載選項 | `{ type?: string; name?: string }` | `-` |

#### 使用示例

**實際使用案例**：

```2:2:src/app/routes/delon/downfile/downfile.component.ts
import { DownFileDirective } from '@delon/abc/down-file';
```

**下載 URL 文件**：

```html
<button nz-button [down-file]="'https://example.com/file.pdf'" [file-name]="'document.pdf'">
  下載 PDF
</button>
```

**下載 Blob 文件**：

```typescript
downloadBlob(): void {
  const blob = new Blob(['Hello World'], { type: 'text/plain' });
  this.fileBlob = blob;
}
```

```html
<button nz-button [down-file]="fileBlob" [file-name]="'hello.txt'">
  下載文本
</button>
```

- --

### Cell - 單元格渲染

**導入**：`import { CellModule } from '@delon/abc/cell';`
**文檔**：https://ng-alain.com/components/cell/zh

單元格渲染組件，用於 ST 表格的自定義單元格渲染。

#### 基本用法

```typescript
// 在 app.config.ts 中配置
import { provideCellWidgets } from '@delon/abc/cell';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCellWidgets([
      {
        type: 'custom',
        component: CustomCellComponent
      }
    ])
  ]
};
```

#### 使用示例

**實際使用案例**：

```14:15:src/app/app.config.ts
import { provideCellWidgets } from '@delon/abc/cell';
import { provideSTWidgets } from '@delon/abc/st';
```

**在 ST 表格中使用**：

```typescript
columns: STColumn[] = [
  {
    title: '自定義',
    index: 'custom',
    type: 'widget',
    widget: { type: 'custom' }
  }
];
```

- --

## 實際使用示例

### 示例 1：ST 表格完整示例

**實際使用案例**：

```8:132:src/app/routes/accounts/list/account-list.component.ts
@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'账户管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createAccount()">
          <span nz-icon nzType="plus"></span>
          新建账户
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有账户" style="margin-top: 16px;">
      <st
        #st
        [data]="accountService.accounts()"
        [columns]="columns"
        [loading]="accountService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange($event)"
      >
        <ng-template #type let-record>
          @switch (record.type) {
            @case ('User') {
              <nz-tag nzColor="blue">用户</nz-tag>
            }
            @case ('Bot') {
              <nz-tag nzColor="purple">机器人</nz-tag>
            }
            @case ('Organization') {
              <nz-tag nzColor="green">组织</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('active') {
              <nz-tag nzColor="success">活跃</nz-tag>
            }
            @case ('inactive') {
              <nz-tag nzColor="default">非活跃</nz-tag>
            }
            @case ('suspended') {
              <nz-tag nzColor="error">已暂停</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class AccountListComponent implements OnInit {
  accountService = inject(AccountService);
  router = inject(Router);
  message = inject(NzMessageService);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '名称', index: 'name', width: 200 },
    { title: '类型', index: 'type', width: 100, render: 'type' },
    { title: '邮箱', index: 'email', width: 200 },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: Account) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: Account) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: Account) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadAccounts();
  }

  async loadAccounts(): Promise<void> {
    try {
      await this.accountService.loadAccounts();
    } catch (error) {
      this.message.error('加载账户列表失败');
    }
  }

  onTableChange(event: any): void {
    // 处理表格变化事件（分页、排序等）
  }

  createAccount(): void {
    this.router.navigate(['/accounts/create']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/accounts', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/accounts', id, 'edit']);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.accountService.deleteAccount(id);
      this.message.success('删除成功');
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}
```

### 示例 2：SV 鍵值描述視圖

**實際使用案例**：

```1:17:src/app/routes/pro/profile/basic/basic.component.html
<page-header [title]="'基础详情页'" />
<nz-card [nzHoverable]="true" [nzBordered]="false">
  <sv-container size="large" title="退款申请">
    <sv label="取货单号">1000000000</sv>
    <sv label="状态">已取货</sv>
    <sv label="销售单号">1234123421</sv>
    <sv label="子订单">3214321432</sv>
  </sv-container>
  <nz-divider />
  <sv-container size="large" title="用户信息">
    <sv label="用户姓名">付小小</sv>
    <sv label="联系电话">18100000000</sv>
    <sv label="常用快递">菜鸟仓储</sv>
    <sv label="取货地址">浙江省杭州市西湖区万塘路18号</sv>
    <sv label="备注">无</sv>
  </sv-container>
```

### 示例 3：SE 表單佈局

**實際使用案例**：

```13:21:src/app/routes/delon/st/st.component.html
        <form nz-form nzLayout="inline" se-container>
          <se label="User ID" labelWidth="0">
            <input nz-input [(ngModel)]="args.userid" name="userid" id="userid" />
          </se>
          <se>
            <button nz-button [nzType]="'primary'" (click)="st.load()" [nzLoading]="http.loading">Search</button>
            <button nz-button (click)="st.load(1, { _allow_anonymous: true })" [disabled]="http.loading">Clear</button>
          </se>
        </form>
```

- --

## 最佳實踐

### 1. 使用 SHARED_IMPORTS

```typescript
// ✅ 推薦：使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // 已包含所有 @delon/abc 組件
  template: `<st [data]="data" [columns]="columns"></st>`
})
export class ExampleComponent {}
```

### 2. 使用 Signals 管理表格數據

```typescript
import { Component, inject, signal } from '@angular/core';
import { STColumn } from '@delon/abc/st';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  data = signal<any[]>([]);
  loading = signal(false);

  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '名称', index: 'name' }
  ];
}
```

### 3. ST 表格列配置

```typescript
// ✅ 推薦：使用類型定義
import { STColumn } from '@delon/abc/st';

const columns: STColumn[] = [
  { title: 'ID', index: 'id', width: 100 },
  { title: '名称', index: 'name', width: 200 },
  { title: '类型', index: 'type', render: 'type' }, // 使用自定義渲染
  {
    title: '操作',
    width: 200,
    buttons: [
      {
        text: '查看',
        click: (record) => this.view(record)
      }
    ]
  }
];
```

- --

## 常見問題

### Q1: 如何自定義 ST 表格列渲染？

```typescript
// 在模板中使用 ng-template
<st [data]="data" [columns]="columns">
  <ng-template #type let-record>
    <nz-tag>{{ record.type }}</nz-tag>
  </ng-template>
</st>

// 在 columns 中指定 render
columns: STColumn[] = [
  { title: '类型', index: 'type', render: 'type' }
];
```

### Q2: 如何實現 ST 表格服務器端分頁？

```typescript
<st
  [data]="url"
  [req]="{ params: args }"
  [res]="{ reName: { list: 'results', total: 'total' } }"
  [page]="{ front: false, show: true }">
</st>
```

### Q3: 如何清空 ReuseTab 緩存？

```typescript
import { ReuseTabService } from '@delon/abc/reuse-tab';

const reuseTabService = inject(ReuseTabService);
reuseTabService?.clear();
```

- --

## 🔗 相關文檔

- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md) - 共享模組使用指南
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/abc 官方文檔](https://ng-alain.com/components)
- [ng-alain 官方文檔](https://ng-alain.com)

### 相關組件

- [@delon/form](https://ng-alain.com/form) - 動態表單
- [@delon/chart](https://ng-alain.com/chart) - 圖表組件

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
