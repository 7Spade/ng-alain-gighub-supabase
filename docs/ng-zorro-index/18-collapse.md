# Collapse - 折疊面板

> **組件分類**：數據展示類組件 (Data Display)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCollapseModule` |
| **官方文檔** | [Collapse](https://ng.ant.design/components/collapse/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzCollapseModule],
  // ...
})
export class ExampleComponent {}
```

### 或使用 SHARED_IMPORTS

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含所有 ng-zorro-antd 組件
  // ...
})
export class ExampleComponent {}
```

## 基本用法

請參考 [官方文檔](https://ng.ant.design/components/collapse/en) 查看詳細用法和示例。

## API

### nz-collapse 組件

折疊面板組件，用於展示可折疊的內容區域。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 | 全局配置 |
|------|------|------|--------|----------|
| `[nzAccordion]` | 手風琴模式，每次只打開一個面板 | `boolean` | `false` | ✅ |
| `[nzBordered]` | 設置折疊面板的邊框樣式 | `boolean` | `true` | ✅ |
| `[nzGhost]` | 使折疊面板透明且無邊框 | `boolean` | `false` | ✅ |
| `[nzExpandIconPosition]` | 設置展開圖標的位置 | `'start' \| 'end'` | `'start'` | - |
| `[nzSize]` | 設置折疊面板的大小 | `'small' \| 'large'` | `'middle'` | - |

### nz-collapse-panel 組件

折疊面板中的單個面板。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 | 全局配置 | 版本 |
|------|------|------|--------|----------|------|
| `[nzDisabled]` | 禁用該面板，阻止用戶交互改變展開狀態 | `boolean` | `false` | - | - |
| `[nzHeader]` | 面板標題內容 | `string \| TemplateRef<void>` | `-` | - | - |
| `[nzExpandedIcon]` | 自定義展開/折疊圖標 | `string \| TemplateRef<void>` | `-` | - | - |
| `[nzExtra]` | 自定義渲染在每個面板右上角的內容 | `string \| TemplateRef<void>` | `-` | - | - |
| `[nzShowArrow]` | 是否顯示展開箭頭 | `boolean` | `true` | ✅ | - |
| `[nzActive]` | 控制面板是否展開，支持雙向綁定 | `boolean` | `-` | - | - |
| `[nzCollapsible]` | 設置觸發折疊/展開的區域 | `'header' \| 'icon' \| 'disabled'` | `'header'` | - | 20.2.0 |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzActiveChange)` | 面板展開狀態變化時觸發 | `EventEmitter<boolean>` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/collapse/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

