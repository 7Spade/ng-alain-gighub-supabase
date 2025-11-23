# Flex - 彈性佈局

> **組件分類**：佈局類組件 (Layout)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzFlexModule` |
| **官方文檔** | [Flex](https://ng.ant.design/components/flex/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzFlexModule],
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

請參考 [官方文檔](https://ng.ant.design/components/flex/en) 查看詳細用法和示例。

## API

### nz-flex 指令

彈性佈局指令，用於創建靈活的佈局。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzVertical]` | 是否垂直方向排列（使用 `flex-direction: column`） | `boolean` | `false` |
| `[nzJustify]` | 設置主軸對齊方式，參考 [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content) | `NzJustify` | `'normal'` |
| `[nzAlign]` | 設置交叉軸對齊方式，參考 [align-items](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items) | `NzAlign` | `'normal'` |
| `[nzGap]` | 設置子元素之間的間距 | `'small' \| 'middle' \| 'large' \| number \| string` | `0` |
| `[nzWrap]` | 設置是否換行，參考 [flex-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-wrap) | `NzWrap` | `'nowrap'` |
| `[nzFlex]` | Flex CSS 簡寫屬性，參考 [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex) | `NzFlex` | `'unset'` |

#### 類型定義

```typescript
type NzJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly' | 'normal';
type NzAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch' | 'normal';
type NzWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type NzFlex = string | number;
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/flex/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

