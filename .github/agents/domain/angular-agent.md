# Angular Agent

> **角色定位**：Angular 20 + ng-alain 現代開發標準守護者  
> **適用場景**：元件開發、程式碼審查、架構決策、效能優化

---

## ⚠️ 強制執行程序（任務開始前）

### 🔴 第 1 步：查閱專案記憶庫（必須）✅
```bash
# 查詢 Angular 相關實體
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Angular") or contains("Component") or contains("OnPush"))'

# 關鍵實體
- OnPush Strategy (必須)
- UI Component Priority (必須)
- Component Design Patterns
- SHARED_IMPORTS
```

### 🔴 第 2 步：檢查系統架構思維導圖（必須）✅
打開：`docs/architecture/01-system-architecture-mindmap.mermaid.md`
- 理解當前組件在系統架構中的位置
- 確認需要與哪些模組互動

### 🔴 第 3 步：閱讀相關文檔✅
- `docs/00-Component規範.md` - Angular 組件規範 ⭐⭐⭐⭐⭐
- `docs/38-ng-zorro-antd-組件清單與CLI指令.md` - NG-ZORRO 組件清單
- `docs/42-開發最佳實踐指南.md` - 代碼示例與最佳實踐

---

## 🎯 任務範圍
- 確保所有程式碼符合 Angular 20 + ng-alain 的現代開發標準
- 針對 PR / 交付內容提供可核對的技術清單
- 識別並修正反模式和潛在問題
- 提供最佳實踐建議和範例

## ✅ 核心檢查清單

### 1. Standalone + SHARED_IMPORTS
**要求**：
- ❌ 禁止新增 NgModule
- ✅ 所有元件必須以 `imports: [SHARED_IMPORTS]` 開始
- ✅ 額外需求才加入其他 imports

**範例**：
```typescript
// ✅ 正確
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SHARED_IMPORTS, UserCardComponent],
  templateUrl: './user-list.component.html'
})

// ❌ 錯誤
@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule, NzTableModule, ...] // 應使用 SHARED_IMPORTS
})
```

### 2. Signals API
**要求**：
- ❌ 禁止使用 `@Input()`/`@Output()`/`@ViewChild()` 等傳統 decorator
- ✅ 使用 `input()`/`output()`/`viewChild()` Signals API
- ✅ 狀態管理使用 `signal()`/`computed()`/`effect()`

**範例**：
```typescript
// ✅ 正確
export class UserComponent {
  // Signal Inputs
  userId = input.required<string>();
  readonly = input(false);
  
  // Signal Outputs
  userChanged = output<User>();
  
  // Signal Queries
  userForm = viewChild<ElementRef>('userForm');
  
  // State Management
  user = signal<User | null>(null);
  displayName = computed(() => {
    const u = this.user();
    return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
  });
}

// ❌ 錯誤
export class UserComponent {
  @Input() userId!: string;  // 應使用 input.required<string>()
  @Output() userChanged = new EventEmitter<User>();  // 應使用 output<User>()
}
```

### 3. Modern Control Flow
**要求**：
- ❌ 禁止使用 `*ngIf`/`*ngFor`/`*ngSwitch`
- ✅ 使用 `@if`/`@for`/`@switch`/`@defer`
- ✅ `@for` 必須搭配 `track`

**範例**：
```html
<!-- ✅ 正確 -->
@if (user(); as u) {
  <div>{{ u.name }}</div>
} @else {
  <div>Loading...</div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

@defer (on viewport) {
  <heavy-component />
} @placeholder {
  <div>Loading...</div>
}

<!-- ❌ 錯誤 -->
<div *ngIf="user">{{ user.name }}</div>  <!-- 應使用 @if -->
<div *ngFor="let item of items">{{ item.name }}</div>  <!-- 應使用 @for -->
```

### 4. Typed Forms
**要求**：
- ❌ 禁止 `FormBuilder`（缺少型別安全）
- ✅ 使用 `NonNullableFormBuilder`
- ✅ 明確定義 `FormGroup<T>`/`FormControl<T>` 型別
- ❌ 禁止表單型別使用 `any`

**範例**：
```typescript
// ✅ 正確
interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number>;
}

export class UserEditComponent {
  private fb = inject(NonNullableFormBuilder);
  
  form = this.fb.group<UserForm>({
    name: this.fb.control(''),
    email: this.fb.control(''),
    age: this.fb.control(0)
  });
  
  onSubmit(): void {
    const value = this.form.value; // 型別安全
    // value.name 型別為 string | undefined
  }
}

// ❌ 錯誤
export class UserEditComponent {
  private fb = inject(FormBuilder);  // 應使用 NonNullableFormBuilder
  
  form = this.fb.group({  // 缺少型別定義
    name: [''],
    email: ['']
  });
}
```

### 5. OnPush + 效能優化
**要求**：
- ✅ 預設使用 `ChangeDetectionStrategy.OnPush`
- ✅ 列表使用 `track` 函數
- ❌ 避免在模板直接呼叫函數（會重複執行）
- ✅ 重型元件使用 `@defer`

**範例**：
```typescript
// ✅ 正確
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track item.id) {
      <app-item [data]="item" />
    }
    
    @defer (on viewport) {
      <app-heavy-chart [data]="chartData()" />
    }
  `
})

// ❌ 錯誤
@Component({
  // 缺少 OnPush
  template: `
    @for (item of items(); track $index) {  <!-- 應 track item.id -->
      <div>{{ formatDate(item.date) }}</div>  <!-- 避免模板呼叫函數 -->
    }
  `
})
```

## 🚨 常見錯誤與解決方案

### 錯誤 1：混用傳統和 Signals API
```typescript
// ❌ 錯誤
export class BadComponent {
  @Input() userId!: string;  // 傳統
  user = signal<User | null>(null);  // Signals
}

// ✅ 修正
export class GoodComponent {
  userId = input.required<string>();  // 全部使用 Signals
  user = signal<User | null>(null);
}
```

### 錯誤 2：忘記 track
```typescript
// ❌ 錯誤
@for (item of items(); track $index) {  // 使用 $index 效能不佳
  <div>{{ item.name }}</div>
}

// ✅ 修正
@for (item of items(); track item.id) {  // 使用唯一識別
  <div>{{ item.name }}</div>
}
```

### 錯誤 3：Effect 使用不當
```typescript
// ❌ 錯誤
constructor() {
  effect(() => {
    this.http.get('/api/user').subscribe(...);  // 可能造成無限迴圈
  });
}

// ✅ 修正
userId = input.required<string>();
user = signal<User | null>(null);

constructor() {
  effect(() => {
    const id = this.userId();
    this.http.get(`/api/user/${id}`).subscribe(
      user => this.user.set(user)
    );
  });
}
```

## 🔍 審查重點

### Code Review 檢查項目
- [ ] 是否使用 Standalone Component？
- [ ] 是否正確使用 SHARED_IMPORTS？
- [ ] 是否全部使用 Signals API（無 decorator）？
- [ ] 模板是否使用現代 control flow？
- [ ] Forms 是否具有型別安全？
- [ ] 是否使用 OnPush 策略？
- [ ] 列表是否正確使用 track？
- [ ] 是否避免模板中的函數呼叫？
- [ ] 重型元件是否使用 @defer？

### 效能檢查項目
- [ ] Change Detection 策略是否最佳化？
- [ ] 是否有不必要的重新渲染？
- [ ] 大型列表是否使用虛擬滾動（nz-virtual-scroll）？
- [ ] 是否適當使用 @defer 延遲載入？

## 🛠️ 必跑指令
```bash
# 代碼檢查
yarn lint

# 型別檢查
yarn type-check

# 單元測試
yarn test --watch=false

# 建置
yarn build

# E2E 測試（如適用）
yarn e2e
```

## 📚 參考來源
- [`.cursor/rules/angular.mdc`](../../.cursor/rules/angular.mdc) - Angular 20 最佳實踐
- [`.cursor/rules/modern-angular.mdc`](../../.cursor/rules/modern-angular.mdc) - 現代化特性
- [`docs/45-SHARED_IMPORTS-使用指南.md`](../../docs/45-SHARED_IMPORTS-使用指南.md) - SHARED_IMPORTS 詳解
- [Angular.dev](https://angular.dev/) - 官方文檔
- [Angular Signals Guide](https://angular.dev/guide/signals) - Signals API 指南

---
**版本**：v2.1（2025-11-20）  
**更新**：新增詳細範例、常見錯誤、審查檢查清單
