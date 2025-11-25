---
title: 日誌 (Diary) 每日記錄 功能設計
version: 2.0.0
lastUpdated: 2025-01-25
status: approved
owner: Development Team
---

# 日誌 (Diary) 每日記錄 功能設計

## 1. 文件概要

> **📋 文件目的**：此文件定義藍圖內用於記錄每日工地情況的 `diary`（每日記錄）功能設計，遵循 Angular 企業級開發規範。

### 1.1 目的與範圍

| 項目 | 說明 |
|------|------|
| **目的** | 為專案/藍圖提供每日工地紀錄，包含進度、問題、天氣、現場照片與相關待辦或任務連結 |
| **範圍** | 前端編輯器、檔案上傳、資料模型、API、權限與匯出功能 |
| **對應規範** | `angular-enterprise-development-guidelines.md` |

### 1.2 文件變更歷史

| 版本 | 日期 | 作者 | 變更說明 |
|------|------|------|----------|
| 2.0.0 | 2025-01-25 | Copilot Agent | 重構：符合企業級開發規範 |
| 1.0.0 | - | - | 初始版本 |

---

## 2. 分層架構設計

> **⚠️ 重要**：必須遵守分層依賴順序，禁止跨層或反方向依賴

### 2.1 分層流向

```
Types → Repositories → Models → Services → Facades → Routes/Components
```

### 2.2 各層職責定義

#### 2.2.1 Types 層 (`src/app/domain/diary/types/`)

**📌 職責**：僅定義資料結構，禁止包含任何邏輯

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `diary.types.ts` | Domain Types 定義 | 核心業務型別 |
| `diary-dto.types.ts` | DTO Types 定義 | Supabase 回傳結構 |
| `diary-view-model.types.ts` | View Model Types | UI 顯示專用型別 |
| `index.ts` | Barrel file | 統一匯出公開 API |

```typescript
// diary.types.ts
/**
 * @description 日誌 Domain Type
 * @layer Types
 * @module Domain/Diary
 */
export interface Diary {
  readonly id: string;
  readonly blueprintId: string;
  readonly date: Date;
  readonly authorId: string;
  readonly summary: string | null;
  readonly progressPercent: number;
  readonly weather: DiaryWeather | null;
  readonly photos: DiaryPhoto[];
  readonly attachments: DiaryAttachment[];
  readonly issues: DiaryIssue[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export type DiaryWeather = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';

export interface DiaryPhoto {
  readonly id: string;
  readonly url: string;
  readonly thumbnailUrl: string;
  readonly size: number;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly caption?: string;
}

export interface DiaryAttachment {
  readonly id: string;
  readonly url: string;
  readonly filename: string;
  readonly size: number;
  readonly mimeType: string;
  readonly storagePath: string;
}

export interface DiaryIssue {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly linkedTodoId?: string;
}
```

```typescript
// diary-dto.types.ts
/**
 * @description Supabase DTO Types
 * @layer Types
 * @source Supabase Database
 */
export interface DiaryDto {
  id: string;
  blueprint_id: string;
  date: string; // ISO date string
  author_id: string;
  summary: string | null;
  progress_percent: number;
  weather: string | null;
  photos: unknown; // JSONB
  attachments: unknown; // JSONB
  issues: unknown; // JSONB
  created_at: string;
  updated_at: string;
}

export interface CreateDiaryDto {
  blueprint_id: string;
  date: string;
  author_id: string;
  summary?: string;
  progress_percent?: number;
  weather?: string;
  photos?: unknown;
  attachments?: unknown;
  issues?: unknown;
}

export interface UpdateDiaryDto {
  summary?: string;
  progress_percent?: number;
  weather?: string;
  photos?: unknown;
  attachments?: unknown;
  issues?: unknown;
}
```

#### 2.2.2 Repositories 層 (`src/app/infrastructure/repositories/`)

**📌 職責**：純後端存取操作，處理 RLS 驗證錯誤，禁止包含業務邏輯

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `diary.repository.ts` | Supabase CRUD 操作 | 唯一可使用 Supabase Client 的層級 |
| `diary-comment.repository.ts` | 日誌評論 CRUD | 獨立 Repository |
| `diary-storage.repository.ts` | 檔案儲存操作 | Supabase Storage |
| `index.ts` | Barrel file | 僅供 Service 層使用 |

```typescript
// diary.repository.ts
/**
 * @description 日誌 Repository - 純 Supabase CRUD
 * @layer Repository
 * @dependency Supabase Client
 * @prohibit 禁止包含業務邏輯
 */
import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DiaryDto, CreateDiaryDto, UpdateDiaryDto } from '@domain/diary/types';
import { DiaryRepositoryError } from '@infrastructure/errors';

@Injectable({ providedIn: 'root' })
export class DiaryRepository {
  private readonly supabase = inject(SupabaseClient);
  private readonly TABLE_NAME = 'diaries';

  /**
   * 查詢日誌列表
   * @param blueprintId 藍圖 ID
   * @param date 可選日期篩選
   */
  findByBlueprint(blueprintId: string, date?: string): Observable<DiaryDto[]> {
    let query = this.supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('blueprint_id', blueprintId)
      .order('date', { ascending: false });

    if (date) {
      query = query.eq('date', date);
    }

    return from(query).pipe(
      map(response => {
        if (response.error) {
          throw new DiaryRepositoryError(response.error.message, response.error.code);
        }
        return response.data as DiaryDto[];
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 查詢單一日誌
   */
  findById(id: string): Observable<DiaryDto | null> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          if (response.error.code === 'PGRST116') {
            return null; // Not found
          }
          throw new DiaryRepositoryError(response.error.message, response.error.code);
        }
        return response.data as DiaryDto;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 建立日誌
   */
  create(dto: CreateDiaryDto): Observable<DiaryDto> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .insert(dto)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          throw new DiaryRepositoryError(response.error.message, response.error.code);
        }
        return response.data as DiaryDto;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 更新日誌
   */
  update(id: string, dto: UpdateDiaryDto): Observable<DiaryDto> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .update({ ...dto, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) {
          throw new DiaryRepositoryError(response.error.message, response.error.code);
        }
        return response.data as DiaryDto;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 刪除日誌
   */
  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) {
          throw new DiaryRepositoryError(response.error.message, response.error.code);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError = (error: unknown): Observable<never> => {
    if (error instanceof DiaryRepositoryError) {
      throw error;
    }
    throw new DiaryRepositoryError('Unknown repository error', 'UNKNOWN');
  };
}
```

#### 2.2.3 Models 層 (`src/app/domain/diary/models/`)

**📌 職責**：負責資料轉換（DTO → Domain Model → View Model），純資料映射

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `diary.mapper.ts` | DTO ↔ Domain 轉換 | 雙向映射 |
| `diary-view-model.mapper.ts` | Domain → ViewModel 轉換 | UI 專用 |
| `index.ts` | Barrel file | 統一匯出 |

```typescript
// diary.mapper.ts
/**
 * @description 日誌資料映射器
 * @layer Models
 * @pattern Mapper Pattern
 */
import { Diary, DiaryPhoto, DiaryAttachment, DiaryIssue } from '@domain/diary/types';
import { DiaryDto, CreateDiaryDto } from '@domain/diary/types';

export class DiaryMapper {
  /**
   * DTO → Domain Model
   */
  static toDomain(dto: DiaryDto): Diary {
    return {
      id: dto.id,
      blueprintId: dto.blueprint_id,
      date: new Date(dto.date),
      authorId: dto.author_id,
      summary: dto.summary,
      progressPercent: dto.progress_percent ?? 0,
      weather: dto.weather as Diary['weather'],
      photos: this.parsePhotos(dto.photos),
      attachments: this.parseAttachments(dto.attachments),
      issues: this.parseIssues(dto.issues),
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  /**
   * Domain Model → DTO (for create)
   */
  static toCreateDto(domain: Partial<Diary>, authorId: string): CreateDiaryDto {
    return {
      blueprint_id: domain.blueprintId!,
      date: domain.date!.toISOString().split('T')[0],
      author_id: authorId,
      summary: domain.summary ?? undefined,
      progress_percent: domain.progressPercent ?? 0,
      weather: domain.weather ?? undefined,
      photos: domain.photos ?? [],
      attachments: domain.attachments ?? [],
      issues: domain.issues ?? [],
    };
  }

  private static parsePhotos(data: unknown): DiaryPhoto[] {
    if (!Array.isArray(data)) return [];
    return data as DiaryPhoto[];
  }

  private static parseAttachments(data: unknown): DiaryAttachment[] {
    if (!Array.isArray(data)) return [];
    return data as DiaryAttachment[];
  }

  private static parseIssues(data: unknown): DiaryIssue[] {
    if (!Array.isArray(data)) return [];
    return data as DiaryIssue[];
  }
}
```

#### 2.2.4 Services 層 (`src/app/core/services/diary/`)

**📌 職責**：實作業務邏輯與流程控制（use cases），禁止接觸 UI 層

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `diary.service.ts` | 日誌業務邏輯 | 核心 Use Cases |
| `diary-export.service.ts` | 匯出功能邏輯 | PDF/CSV 生成 |
| `diary-notification.service.ts` | 通知邏輯 | 提醒填寫日誌 |
| `index.ts` | Barrel file | 僅供 Facade 使用 |

```typescript
// diary.service.ts
/**
 * @description 日誌業務服務
 * @layer Service
 * @dependency Repository, Mapper
 * @prohibit 禁止直接操作 Store 或接觸 UI
 */
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DiaryRepository } from '@infrastructure/repositories';
import { DiaryMapper } from '@domain/diary/models';
import { Diary } from '@domain/diary/types';
import { DiaryDomainError } from '@domain/diary/errors';

@Injectable({ providedIn: 'root' })
export class DiaryService {
  private readonly repository = inject(DiaryRepository);

  /**
   * 取得藍圖的日誌列表
   * @param blueprintId 藍圖 ID
   * @param date 可選日期篩選
   */
  getDiariesByBlueprint(blueprintId: string, date?: Date): Observable<Diary[]> {
    const dateStr = date?.toISOString().split('T')[0];
    return this.repository.findByBlueprint(blueprintId, dateStr).pipe(
      map(dtos => dtos.map(DiaryMapper.toDomain))
    );
  }

  /**
   * 取得單一日誌
   */
  getDiaryById(id: string): Observable<Diary> {
    return this.repository.findById(id).pipe(
      map(dto => {
        if (!dto) {
          throw new DiaryDomainError('Diary not found', 'DIARY_NOT_FOUND');
        }
        return DiaryMapper.toDomain(dto);
      })
    );
  }

  /**
   * 建立日誌
   * @businessRule 同一藍圖同一日期只能有一筆日誌
   */
  createDiary(diary: Partial<Diary>, authorId: string): Observable<Diary> {
    // 業務驗證
    if (!diary.blueprintId) {
      throw new DiaryDomainError('Blueprint ID is required', 'INVALID_INPUT');
    }
    if (!diary.date) {
      throw new DiaryDomainError('Date is required', 'INVALID_INPUT');
    }

    const dto = DiaryMapper.toCreateDto(diary, authorId);
    return this.repository.create(dto).pipe(
      map(DiaryMapper.toDomain)
    );
  }

  /**
   * 更新日誌
   */
  updateDiary(id: string, updates: Partial<Diary>): Observable<Diary> {
    const dto = {
      summary: updates.summary,
      progress_percent: updates.progressPercent,
      weather: updates.weather,
      photos: updates.photos,
      attachments: updates.attachments,
      issues: updates.issues,
    };
    return this.repository.update(id, dto).pipe(
      map(DiaryMapper.toDomain)
    );
  }

  /**
   * 刪除日誌
   */
  deleteDiary(id: string): Observable<void> {
    return this.repository.delete(id);
  }
}
```

#### 2.2.5 Facades 層 (`src/app/features/diary/facades/`)

**📌 職責**：提供 UI 專用的統一 API，封裝 service/store，禁止包含商業邏輯

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `diary.facade.ts` | UI 統一存取介面 | 唯一可操作 Store 的層級 |
| `index.ts` | Barrel file | Feature Module 唯一公開 API |

```typescript
// diary.facade.ts
/**
 * @description 日誌 Facade - UI 唯一存取介面
 * @layer Facade
 * @dependency Service, Store
 * @prohibit 禁止包含業務邏輯
 */
import { Injectable, inject, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DiaryService } from '@core/services/diary';
import { AuthFacade } from '@core/facades';
import { Diary } from '@domain/diary/types';
import { DiaryViewModel } from '@domain/diary/types/diary-view-model.types';
import { DiaryViewModelMapper } from '@domain/diary/models';

interface DiaryState {
  diaries: Diary[];
  selectedDiary: Diary | null;
  loading: boolean;
  error: string | null;
}

@Injectable()
export class DiaryFacade {
  private readonly diaryService = inject(DiaryService);
  private readonly authFacade = inject(AuthFacade);

  // State (Signal-based)
  private readonly state = signal<DiaryState>({
    diaries: [],
    selectedDiary: null,
    loading: false,
    error: null,
  });

  // Selectors (Computed Signals for UI)
  readonly diaries = computed(() => this.state().diaries);
  readonly selectedDiary = computed(() => this.state().selectedDiary);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  // Derived View Models
  readonly diaryViewModels = computed<DiaryViewModel[]>(() =>
    this.diaries().map(DiaryViewModelMapper.toViewModel)
  );

  /**
   * 載入藍圖日誌
   */
  loadDiaries(blueprintId: string): void {
    this.updateState({ loading: true, error: null });

    this.diaryService.getDiariesByBlueprint(blueprintId).subscribe({
      next: diaries => this.updateState({ diaries, loading: false }),
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 選擇日誌
   */
  selectDiary(id: string): void {
    this.updateState({ loading: true, error: null });

    this.diaryService.getDiaryById(id).subscribe({
      next: diary => this.updateState({ selectedDiary: diary, loading: false }),
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 建立日誌
   */
  createDiary(diary: Partial<Diary>): void {
    const authorId = this.authFacade.currentUserId();
    if (!authorId) {
      this.updateState({ error: '請先登入' });
      return;
    }

    this.updateState({ loading: true, error: null });

    this.diaryService.createDiary(diary, authorId).subscribe({
      next: newDiary => {
        this.updateState({
          diaries: [newDiary, ...this.diaries()],
          loading: false,
        });
      },
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 更新日誌
   */
  updateDiary(id: string, updates: Partial<Diary>): void {
    this.updateState({ loading: true, error: null });

    this.diaryService.updateDiary(id, updates).subscribe({
      next: updated => {
        const diaries = this.diaries().map(d => d.id === id ? updated : d);
        this.updateState({ diaries, selectedDiary: updated, loading: false });
      },
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 刪除日誌
   */
  deleteDiary(id: string): void {
    this.updateState({ loading: true, error: null });

    this.diaryService.deleteDiary(id).subscribe({
      next: () => {
        const diaries = this.diaries().filter(d => d.id !== id);
        this.updateState({ diaries, selectedDiary: null, loading: false });
      },
      error: err => this.updateState({ loading: false, error: this.mapErrorMessage(err) }),
    });
  }

  /**
   * 清除錯誤
   */
  clearError(): void {
    this.updateState({ error: null });
  }

  private updateState(partial: Partial<DiaryState>): void {
    this.state.update(state => ({ ...state, ...partial }));
  }

  /**
   * 錯誤映射：Domain Error → UI Error Message
   */
  private mapErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      // 根據錯誤類型映射使用者友善訊息
      const errorMap: Record<string, string> = {
        DIARY_NOT_FOUND: '找不到該日誌',
        INVALID_INPUT: '輸入資料不完整',
        RLS_VIOLATION: '您沒有權限執行此操作',
        NETWORK_ERROR: '網路連線錯誤，請稍後再試',
      };
      return errorMap[(error as any).code] || '操作失敗，請稍後再試';
    }
    return '發生未知錯誤';
  }
}
```

#### 2.2.6 Routes/Components 層 (`src/app/routes/diary/`)

**📌 職責**：僅負責 UI 呈現與事件觸發，禁止直接操作 store、service、repository

| 檔案名稱 | 說明 | 備註 |
|----------|------|------|
| `diary-list.component.ts` | 日誌列表頁面 | 日曆/列表檢視 |
| `diary-detail.component.ts` | 日誌詳情頁面 | 查看/編輯 |
| `diary-editor.component.ts` | 日誌編輯器 | 建立/編輯表單 |
| `diary.routes.ts` | 路由配置 | Lazy Load |
| `index.ts` | Barrel file | 路由匯出 |

```typescript
// diary-list.component.ts
/**
 * @description 日誌列表元件
 * @layer Component
 * @dependency Facade only
 * @prohibit 禁止直接呼叫 Service/Repository/Store
 */
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DiaryFacade } from '../facades';
import { DiaryCardComponent } from '../components';

@Component({
  selector: 'app-diary-list',
  standalone: true,
  imports: [
    CommonModule,
    NzCalendarModule,
    NzListModule,
    NzSpinModule,
    NzEmptyModule,
    NzButtonModule,
    DiaryCardComponent,
  ],
  template: `
    <page-header [title]="'日誌管理'" [breadcrumb]="breadcrumb">
      <ng-template #action>
        <button nz-button nzType="primary" (click)="onCreateDiary()">
          <span nz-icon nzType="plus"></span>
          新增日誌
        </button>
      </ng-template>
    </page-header>

    <nz-spin [nzSpinning]="facade.loading()">
      @if (facade.diaryViewModels().length > 0) {
        <nz-list [nzDataSource]="facade.diaryViewModels()" [nzRenderItem]="item">
          <ng-template #item let-diary>
            <app-diary-card
              [diary]="diary"
              (view)="onViewDiary($event)"
              (edit)="onEditDiary($event)"
              (delete)="onDeleteDiary($event)"
            />
          </ng-template>
        </nz-list>
      } @else {
        <nz-empty [nzNotFoundContent]="'尚無日誌紀錄'" />
      }
    </nz-spin>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiaryListComponent implements OnInit {
  readonly facade = inject(DiaryFacade);
  private readonly message = inject(NzMessageService);

  // 假設從路由取得 blueprintId
  private blueprintId = ''; // 實際從 ActivatedRoute 取得

  ngOnInit(): void {
    this.facade.loadDiaries(this.blueprintId);
  }

  onCreateDiary(): void {
    // 導航至編輯頁或開啟 Modal
  }

  onViewDiary(id: string): void {
    this.facade.selectDiary(id);
  }

  onEditDiary(id: string): void {
    // 導航至編輯頁
  }

  onDeleteDiary(id: string): void {
    this.facade.deleteDiary(id);
  }
}
```

---

## 3. 模組邊界管理

> **⚠️ 禁止規則**：嚴格遵守模組邊界，違反將導致架構腐敗

### 3.1 模組結構

```
src/app/
├── domain/                    # Domain Module
│   └── diary/
│       ├── types/            # 型別定義
│       ├── models/           # Mapper
│       ├── errors/           # Domain Errors
│       └── index.ts          # Public API
│
├── infrastructure/            # Infrastructure Module
│   └── repositories/
│       ├── diary.repository.ts
│       └── index.ts
│
├── core/                      # Core Module
│   └── services/
│       └── diary/
│           ├── diary.service.ts
│           └── index.ts
│
├── features/                  # Feature Modules
│   └── diary/
│       ├── facades/
│       ├── components/
│       └── index.ts          # 僅公開 Facade
│
└── routes/                    # Routes/Components
    └── diary/
        ├── diary-list.component.ts
        ├── diary-detail.component.ts
        └── diary.routes.ts
```

### 3.2 邊界禁止規則

| 規則 | 說明 | 違反後果 |
|------|------|----------|
| Component → Repository | ❌ 禁止 | 架構腐敗 |
| Component → Service | ❌ 禁止 | 繞過 Facade |
| Feature → Feature | ❌ 禁止 | 模組耦合 |
| Domain → Infrastructure | ❌ 禁止 | 依賴反轉 |
| Shared → Feature | ❌ 禁止 | 循環依賴 |

### 3.3 Barrel Files (`index.ts`)

```typescript
// domain/diary/index.ts - 僅公開型別
export * from './types';
export * from './models';
export * from './errors';

// features/diary/index.ts - 僅公開 Facade
export { DiaryFacade } from './facades';
// ❌ 禁止: export { DiaryService } from './services';
// ❌ 禁止: export { DiaryRepository } from './repositories';
```

---

## 4. 狀態管理標準

### 4.1 狀態流向

```
Component → Facade → Service → Store
    ↓           ↓
  UI 事件    Observable/Signal
```

### 4.2 各層職責

| 層級 | 允許操作 | 禁止操作 |
|------|----------|----------|
| **Component** | 綁定 UI、呼叫 Facade 方法 | `.select()`, `.dispatch()`, `.update()` |
| **Facade** | 操作 Store、暴露 Observable/Signal | 包含業務邏輯 |
| **Service** | 執行業務邏輯、呼叫 Repository | 直接控制 Store |
| **Repository** | Supabase CRUD | 涉及狀態管理 |

---

## 5. 資料模型設計

### 5.1 資料庫結構

> **📌 注意**：必須透過 Supabase MCP 驗證實際 Schema

#### Table: `diaries`

| 欄位 | 型別 | 說明 | 約束 |
|------|------|------|------|
| `id` | uuid | 主鍵 | PK, DEFAULT gen_random_uuid() |
| `blueprint_id` | uuid | 關聯藍圖 | NOT NULL, FK |
| `date` | date | 日誌日期 | NOT NULL |
| `author_id` | uuid | 作者 ID | NOT NULL, FK |
| `summary` | text | 當日摘要 | NULLABLE |
| `progress_percent` | int | 進度百分比 | DEFAULT 0, CHECK (0-100) |
| `weather` | text | 天氣狀況 | NULLABLE, ENUM |
| `photos` | jsonb | 照片陣列 | DEFAULT '[]' |
| `attachments` | jsonb | 附件陣列 | DEFAULT '[]' |
| `issues` | jsonb | 問題清單 | DEFAULT '[]' |
| `created_at` | timestamptz | 建立時間 | DEFAULT now() |
| `updated_at` | timestamptz | 更新時間 | DEFAULT now() |

#### Table: `diary_comments`

| 欄位 | 型別 | 說明 | 約束 |
|------|------|------|------|
| `id` | uuid | 主鍵 | PK |
| `diary_id` | uuid | 關聯日誌 | NOT NULL, FK |
| `author_id` | uuid | 評論者 | NOT NULL, FK |
| `content` | text | 評論內容 | NOT NULL |
| `created_at` | timestamptz | 建立時間 | DEFAULT now() |

#### Table: `diary_history`

| 欄位 | 型別 | 說明 | 約束 |
|------|------|------|------|
| `id` | uuid | 主鍵 | PK |
| `diary_id` | uuid | 關聯日誌 | NOT NULL, FK |
| `changed_by` | uuid | 變更者 | NOT NULL, FK |
| `changes` | jsonb | 變更內容 | NOT NULL |
| `created_at` | timestamptz | 變更時間 | DEFAULT now() |

### 5.2 SQL Migration

```sql
-- Migration: 001_create_diaries_table
CREATE TABLE diaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id uuid NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
  date date NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id),
  summary text,
  progress_percent int DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  weather text CHECK (weather IN ('sunny', 'cloudy', 'rainy', 'stormy', 'snowy')),
  photos jsonb DEFAULT '[]'::jsonb,
  attachments jsonb DEFAULT '[]'::jsonb,
  issues jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (blueprint_id, date)
);

-- Index for common queries
CREATE INDEX idx_diaries_blueprint_id ON diaries(blueprint_id);
CREATE INDEX idx_diaries_date ON diaries(date DESC);
CREATE INDEX idx_diaries_author_id ON diaries(author_id);

-- Migration: 002_create_diary_comments_table
CREATE TABLE diary_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id uuid NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_diary_comments_diary_id ON diary_comments(diary_id);

-- Migration: 003_create_diary_history_table
CREATE TABLE diary_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id uuid NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
  changed_by uuid NOT NULL REFERENCES auth.users(id),
  changes jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_diary_history_diary_id ON diary_history(diary_id);
```

---

## 6. 認證與授權

### 6.1 認證流向

```
Supabase Auth → @delon/auth → DA_SERVICE_TOKEN → @delon/acl
```

### 6.2 權限規則

| 操作 | 權限要求 | RLS Policy |
|------|----------|------------|
| 讀取日誌 | 藍圖存取權 | `auth.uid() IN (SELECT user_id FROM blueprint_members WHERE blueprint_id = diaries.blueprint_id)` |
| 建立日誌 | 藍圖編輯權限 | `auth.uid() IN (SELECT user_id FROM blueprint_members WHERE blueprint_id = NEW.blueprint_id AND role IN ('owner', 'editor'))` |
| 編輯日誌 | 作者或管理員 | `auth.uid() = author_id OR auth.uid() IN (SELECT user_id FROM blueprint_members WHERE blueprint_id = diaries.blueprint_id AND role = 'owner')` |
| 刪除日誌 | 作者或管理員 | 同上 |

### 6.3 RLS Policies

```sql
-- Enable RLS
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

-- Read policy
CREATE POLICY "Users can view diaries of their blueprints"
  ON diaries FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM blueprint_members
      WHERE blueprint_id = diaries.blueprint_id
    )
  );

-- Insert policy
CREATE POLICY "Users with edit access can create diaries"
  ON diaries FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    auth.uid() IN (
      SELECT user_id FROM blueprint_members
      WHERE blueprint_id = diaries.blueprint_id
      AND role IN ('owner', 'editor')
    )
  );

-- Update policy
CREATE POLICY "Authors and owners can update diaries"
  ON diaries FOR UPDATE
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (
      SELECT user_id FROM blueprint_members
      WHERE blueprint_id = diaries.blueprint_id
      AND role = 'owner'
    )
  );

-- Delete policy
CREATE POLICY "Authors and owners can delete diaries"
  ON diaries FOR DELETE
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (
      SELECT user_id FROM blueprint_members
      WHERE blueprint_id = diaries.blueprint_id
      AND role = 'owner'
    )
  );
```

---

## 7. UI/UX 設計規範

### 7.1 元件使用優先順序

1. **@delon/abc** 業務元件優先
2. **ng-zorro-antd** 基礎元件次之
3. 自定義元件最後考慮

### 7.2 推薦元件清單

| 功能 | 推薦元件 | 來源 |
|------|----------|------|
| 日曆檢視 | `nz-calendar` | ng-zorro-antd |
| 列表檢視 | `st` (Simple Table) | @delon/abc |
| 照片上傳 | `nz-upload` | ng-zorro-antd |
| 照片預覽 | `nz-image` | ng-zorro-antd |
| 富文本編輯 | `ngx-tinymce` | 專案已包含 |
| 頁面標題 | `page-header` | @delon/abc |
| 表單 | `sf` (Schema Form) | @delon/form |
| 進度條 | `nz-progress` | ng-zorro-antd |

### 7.3 頁面佈局

```typescript
// 日曆檢視頁面結構
<page-header title="日誌管理">
  <ng-template #action>
    <button nz-button nzType="primary">新增日誌</button>
  </ng-template>
</page-header>

<nz-card>
  <nz-calendar [nzDateCell]="dateCell">
    <ng-template #dateCell let-date>
      @if (getDiaryForDate(date); as diary) {
        <app-diary-date-cell [diary]="diary" />
      }
    </ng-template>
  </nz-calendar>
</nz-card>
```

### 7.4 Angular 20+ 模板語法

> **⚠️ 強制要求**：必須使用新控制流語法

| 舊語法 | 新語法 | 狀態 |
|--------|--------|------|
| `*ngIf` | `@if` / `@else` | ✅ 必須使用 |
| `*ngFor` | `@for` | ✅ 必須使用 |
| `*ngSwitch` | `@switch` / `@case` | ✅ 必須使用 |
| - | `@defer` | ✅ 建議使用 |

---

## 8. 錯誤處理標準

### 8.1 錯誤流向

```
Supabase Error → Domain Error → UI Error
```

### 8.2 錯誤類型定義

```typescript
// domain/diary/errors/diary.errors.ts
export class DiaryDomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'DiaryDomainError';
  }
}

// Error codes
export const DIARY_ERROR_CODES = {
  DIARY_NOT_FOUND: 'DIARY_NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  DUPLICATE_DATE: 'DUPLICATE_DATE',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
} as const;
```

### 8.3 錯誤映射表

| 層級 | 錯誤來源 | 處理方式 |
|------|----------|----------|
| Repository | Supabase Error | 轉換為 DiaryRepositoryError |
| Service | Domain Logic | 拋出 DiaryDomainError |
| Facade | Domain Error | 映射為 UI 友善訊息 |
| Component | Facade | 顯示訊息（NzMessage） |

---

## 9. 即時與同步功能

### 9.1 Supabase Realtime 訂閱

```typescript
// infrastructure/realtime/diary-realtime.service.ts
@Injectable({ providedIn: 'root' })
export class DiaryRealtimeService {
  private readonly supabase = inject(SupabaseClient);

  subscribeToDiaryChanges(blueprintId: string): Observable<RealtimeEvent<Diary>> {
    return new Observable(subscriber => {
      const channel = this.supabase
        .channel(`diary_changes_${blueprintId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'diaries',
            filter: `blueprint_id=eq.${blueprintId}`,
          },
          payload => {
            subscriber.next({
              event: payload.eventType,
              data: DiaryMapper.toDomain(payload.new as DiaryDto),
              old: payload.old ? DiaryMapper.toDomain(payload.old as DiaryDto) : undefined,
            });
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    });
  }
}
```

### 9.2 離線策略

| 階段 | 策略 | 實作方式 |
|------|------|----------|
| 離線偵測 | Navigator.onLine + WebSocket 狀態 | `@delon/util` |
| 本地暫存 | IndexedDB | `idb` 套件 |
| 衝突解決 | 時間戳優先（Last Write Wins） | Service 層實作 |
| 同步恢復 | 連線恢復時批次上傳 | Facade 層觸發 |

---

## 10. 檔案上傳與儲存

### 10.1 Storage 規範

| 項目 | 規格 |
|------|------|
| Bucket | `diary-attachments` |
| 路徑格式 | `{blueprint_id}/{diary_id}/{file_id}_{filename}` |
| 縮圖路徑 | `{blueprint_id}/{diary_id}/thumbnails/{file_id}.webp` |
| 最大檔案大小 | 10MB (照片), 50MB (附件) |
| 允許類型 | 照片: `image/*`, 附件: `pdf, doc, docx, xls, xlsx` |

### 10.2 上傳流程

```typescript
// infrastructure/repositories/diary-storage.repository.ts
@Injectable({ providedIn: 'root' })
export class DiaryStorageRepository {
  private readonly supabase = inject(SupabaseClient);
  private readonly BUCKET = 'diary-attachments';

  uploadPhoto(
    blueprintId: string,
    diaryId: string,
    file: File
  ): Observable<DiaryPhoto> {
    const fileId = crypto.randomUUID();
    const path = `${blueprintId}/${diaryId}/${fileId}_${file.name}`;

    return from(
      this.supabase.storage
        .from(this.BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })
    ).pipe(
      map(response => {
        if (response.error) {
          throw new StorageError(response.error.message);
        }
        return {
          id: fileId,
          url: this.getPublicUrl(path),
          thumbnailUrl: this.getThumbnailUrl(blueprintId, diaryId, fileId),
          size: file.size,
          mimeType: file.type,
          storagePath: path,
        };
      })
    );
  }

  private getPublicUrl(path: string): string {
    return this.supabase.storage.from(this.BUCKET).getPublicUrl(path).data.publicUrl;
  }

  private getThumbnailUrl(blueprintId: string, diaryId: string, fileId: string): string {
    const thumbPath = `${blueprintId}/${diaryId}/thumbnails/${fileId}.webp`;
    return this.supabase.storage.from(this.BUCKET).getPublicUrl(thumbPath).data.publicUrl;
  }
}
```

---

## 11. 匯出功能

### 11.1 匯出格式

| 格式 | 用途 | 實作方式 |
|------|------|----------|
| PDF | 含照片完整報告 | Supabase Edge Function |
| CSV | 數據分析 | 前端生成 |
| Excel | 批次匯出 | `xlsx` 套件 |

### 11.2 匯出 API

```typescript
// core/services/diary/diary-export.service.ts
@Injectable({ providedIn: 'root' })
export class DiaryExportService {
  private readonly http = inject(HttpClient);

  /**
   * 匯出單日 PDF
   */
  exportToPdf(diaryId: string): Observable<Blob> {
    return this.http.post(
      `/api/diaries/${diaryId}/export`,
      { format: 'pdf' },
      { responseType: 'blob' }
    );
  }

  /**
   * 匯出期間 CSV
   */
  exportRangeToCsv(blueprintId: string, startDate: Date, endDate: Date): Observable<Blob> {
    return this.http.post(
      `/api/diaries/export`,
      {
        blueprintId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format: 'csv',
      },
      { responseType: 'blob' }
    );
  }
}
```

---

## 12. 測試標準

### 12.1 測試分層

| 層級 | 測試類型 | 覆蓋率要求 |
|------|----------|------------|
| Types | N/A | - |
| Mapper | Unit | 90% |
| Repository | Unit + Integration | 80% |
| Service | Unit | 85% |
| Facade | Unit | 80% |
| Component | Unit + E2E | 70% |

### 12.2 測試範例

```typescript
// domain/diary/models/diary.mapper.spec.ts
describe('DiaryMapper', () => {
  describe('toDomain', () => {
    it('should map DiaryDto to Diary correctly', () => {
      const dto: DiaryDto = {
        id: '123',
        blueprint_id: 'bp-001',
        date: '2025-01-25',
        author_id: 'user-001',
        summary: 'Test summary',
        progress_percent: 50,
        weather: 'sunny',
        photos: [],
        attachments: [],
        issues: [],
        created_at: '2025-01-25T10:00:00Z',
        updated_at: '2025-01-25T10:00:00Z',
      };

      const result = DiaryMapper.toDomain(dto);

      expect(result.id).toBe('123');
      expect(result.blueprintId).toBe('bp-001');
      expect(result.date).toEqual(new Date('2025-01-25'));
      expect(result.progressPercent).toBe(50);
    });
  });
});
```

### 12.3 驗收條件

| 功能 | 驗收標準 |
|------|----------|
| 日誌建立 | 同一藍圖同日期不可重複建立 |
| 照片上傳 | 上傳後 3 秒內顯示縮圖 |
| PDF 匯出 | 包含所有照片且排版正確 |
| 離線儲存 | 恢復連線後資料無遺失 |
| 即時更新 | 其他使用者變更 5 秒內可見 |

---

## 13. 企業級檢查清單

### 13.1 架構檢查

- [ ] 是否遵守 Types → Repositories → Models → Services → Facades → Components 順序？
- [ ] 是否無跨層依賴（如 Component → Repository）？
- [ ] Component 是否僅呼叫 Facade？
- [ ] 是否使用 barrel file（index.ts）定義公開 API？

### 13.2 模組邊界檢查

- [ ] Feature Module 是否未 import 其他 Feature Module？
- [ ] Domain 是否未依賴 Infrastructure？
- [ ] Supabase Client 是否僅出現在 Repository 層？
- [ ] Feature 是否僅公開 Facade？

### 13.3 狀態管理檢查

- [ ] 是否遵循 Component → Facade → Service → Store 流向？
- [ ] Component 是否未使用 `.select()` / `.dispatch()` / `.update()`？
- [ ] Facade 是否為唯一操作 Store 的層級？

### 13.4 程式碼品質檢查

- [ ] 是否通過 ESLint？
- [ ] 是否符合 Prettier 格式？
- [ ] 是否使用 Angular 20+ 新語法（@if, @for）？
- [ ] 是否避免使用 `any` 型別？

---

## 14. 待討論事項

| 項目 | 說明 | 負責人 | 狀態 |
|------|------|--------|------|
| 圖片壓縮 | 是否需自動壓縮與縮圖生成？ | 產品團隊 | 🟡 待討論 |
| PDF 模版 | 匯出樣式由產品團隊定義 | 設計團隊 | 🟡 待討論 |
| 提醒機制 | 自動提醒填寫日誌的時間與頻率 | 產品團隊 | 🟡 待討論 |
| 離線時長 | 離線資料保留多久？ | 技術團隊 | 🟡 待討論 |

---

## 15. 參考文件

| 文件 | 說明 |
|------|------|
| `angular-enterprise-development-guidelines.md` | 企業級開發規範 |
| `docs/guides/todo-design.md` | 待辦事項設計（關聯功能） |
| `docs/guides/frontend-state-management-guide.md` | 狀態管理指南 |
| `docs/guides/error-handling-guide.md` | 錯誤處理指南 |

---

> **📝 文件維護說明**：此文件遵循企業級開發規範，任何變更需經過 Code Review 並更新版本號。
