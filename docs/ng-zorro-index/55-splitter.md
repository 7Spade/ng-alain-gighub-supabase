# Splitter - 分隔面板

> **組件分類**：佈局類組件 (Layout)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSplitterModule` |
| **官方文檔** | [Splitter](https://ng.ant.design/components/splitter/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzSplitterModule } from 'ng-zorro-antd/splitter';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzSplitterModule],
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

請參考 [官方文檔](https://ng.ant.design/components/splitter/en) 查看詳細用法和示例。

## API

### nz-splitter 組件

分隔面板組件，用於將區域分割成多個水平或垂直的面板。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzDirection]` | 分割方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `[nzDisabledBarSize]` | 禁用拖動條的大小 | `number` | `-` |
| `[nzSplitBarSize]` | 拖動條的大小 | `number` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzResizeEnd)` | 調整大小結束時觸發 | `EventEmitter<{ sizes: number[] }>` |
| `(nzResizeMove)` | 調整大小移動時觸發 | `EventEmitter<{ sizes: number[] }>` |
| `(nzResizeStart)` | 調整大小開始時觸發 | `EventEmitter<{ sizes: number[] }>` |

### nz-splitter-pane 組件

分隔面板中的單個面板。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzSize]` | 面板大小（百分比） | `number` | `-` |
| `[nzMinSize]` | 面板最小大小（百分比） | `number` | `-` |
| `[nzMaxSize]` | 面板最大大小（百分比） | `number` | `-` |
| `[nzCollapsible]` | 是否可摺疊 | `boolean` | `false` |
| `[nzCollapsedSize]` | 摺疊時的大小（百分比） | `number` | `-` |

## 相關資源

- [官方文檔](https://ng.ant.design/components/splitter/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

