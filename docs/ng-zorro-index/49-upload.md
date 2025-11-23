# Upload - 上傳

> **組件分類**：數據錄入類組件 (Data Entry)
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzUploadModule` |
| **官方文檔** | [Upload](https://ng.ant.design/components/upload/en) |
| **Schematics 命令** | 暫無專用 schematics |

## 使用方式

### 導入模組

```typescript
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzUploadModule],
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

請參考 [官方文檔](https://ng.ant.design/components/upload/en) 查看詳細用法和示例。

## API

### nz-upload 組件

上傳組件，用於上傳文件。

#### 輸入屬性

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[nzFilter]` | 自定義過濾上傳文件 | `UploadFilter[]` | `-` |
| `[nzHeaders]` | 設置上傳的請求頭部，IE10 以上有效。注意：必須使用 `=>` 定義方法 | `Object \| ((file: NzUploadFile) => Object \| Observable<{}>)` | `-` |
| `[nzListType]` | 上傳列表的內建樣式，支持三種基本樣式 `text`, `picture` 和 `picture-card` | `'text' \| 'picture' \| 'picture-card'` | `'text'` |
| `[nzMultiple]` | 是否支持多選文件，`IE10+` 支持。開啟後按住 ctrl 可選擇多個文件 | `boolean` | `false` |
| `[nzName]` | 發到後台的文件參數名 | `string` | `'file'` |
| `[nzShowUploadList]` | 是否顯示上傳列表，可設為一個對象，用於單獨設定 `showPreviewIcon`, `showRemoveIcon` 和 `showDownloadIcon` | `boolean \| { showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean }` | `true` |
| `[nzShowButton]` | 是否顯示上傳按鈕 | `boolean` | `true` |
| `[nzWithCredentials]` | 上傳請求時是否攜帶 cookie | `boolean` | `false` |
| `[nzOpenFileDialogOnClick]` | 點擊打開文件對話框 | `boolean` | `true` |
| `[nzPreview]` | 點擊文件鏈接或預覽圖標時的回調。注意：必須使用 `=>` 定義方法 | `(file: NzUploadFile) => void` | `-` |
| `[nzPreviewFile]` | 自定義預覽文件邏輯。注意：必須使用 `=>` 定義方法 | `(file: NzUploadFile) => Observable<dataURL: string>` | `-` |
| `[nzPreviewIsImage]` | 自定義預覽文件是否為圖片，一般用於圖片 URL 為非標準格式時。注意：必須使用 `=>` 定義方法 | `(file: NzUploadFile) => boolean` | `-` |
| `[nzRemove]` | 點擊移除文件時的回調，返回 `false` 或 `Observable` 都會阻止上傳。注意：必須使用 `=>` 定義方法 | `(file: NzUploadFile) => boolean \| Observable<boolean>` | `-` |
| `[nzAction]` | 上傳的地址 | `string \| ((file: NzUploadFile) => string \| Observable<string>)` | `-` |
| `[nzAccept]` | 接受上傳的文件類型 | `string` | `-` |
| `[nzBeforeUpload]` | 上傳文件之前的鉤子，參數為上傳的文件，若返回 `false` 或 `Observable` 則停止上傳。注意：必須使用 `=>` 定義方法 | `(file: NzUploadFile, fileList: NzUploadFile[]) => boolean \| Observable<boolean>` | `-` |
| `[nzCustomRequest]` | 通過覆蓋默認的上傳行為，可以自定義自己的上傳實現。注意：必須使用 `=>` 定義方法 | `(item: UploadXHRArgs) => Subscription` | `-` |
| `[nzData]` | 上傳所需參數或返回上傳參數的方法。注意：必須使用 `=>` 定義方法 | `Object \| ((file: NzUploadFile) => Object \| Observable<{}>)` | `-` |
| `[nzDirectory]` | 支持上傳文件夾（caniuse） | `boolean` | `false` |
| `[nzDisabled]` | 是否禁用 | `boolean` | `false` |
| `[nzFileList]` | 文件列表，支持雙向綁定 | `NzUploadFile[]` | `[]` |
| `[nzLimit]` | 限制單次上傳的數量，`nzMultiple` 開啟時有效 | `number` | `-` |
| `[nzSize]` | 限制文件大小（單位：KB） | `number` | `-` |
| `[nzFileType]` | 限制文件類型 | `string` | `-` |
| `[nzTransformFile]` | 在上傳之前轉換文件。注意：必須使用 `=>` 定義方法 | `(file: NzUploadFile) => NzUploadFile \| Observable<NzUploadFile>` | `-` |

#### 輸出事件

| 事件 | 說明 | 類型 |
|------|------|------|
| `(nzChange)` | 上傳文件狀態改變時的回調函數 | `EventEmitter<NzUploadChangeParam>` |

#### 事件對象結構

`NzUploadChangeParam` 事件對象包含以下屬性：

```typescript
{
  file: {
    uid: string;      // 文件唯一標識
    name: string;     // 文件名
    status: string;   // 狀態：uploading, done, error, removed
    response: any;    // 服務器響應
    linkProps: object; // 下載鏈接的額外 HTML 屬性
  },
  fileList: NzUploadFile[]; // 當前文件列表
  event: any;         // 上傳過程中的服務器響應（用於進度等）
}
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/upload/en)
- [返回索引](../reference/ng-zorro-component-cli-reference.md)

