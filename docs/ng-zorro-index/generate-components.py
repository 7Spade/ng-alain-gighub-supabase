#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成 ng-zorro-antd 組件文檔腳本
"""

import os
from pathlib import Path

# 組件定義
COMPONENTS = [
    # 反饋類組件 (Feedback)
    {"name": "Alert", "module": "NzAlertModule", "path": "alert", "category": "反饋類組件 (Feedback)", "index": 1, "schematics": None, "is_service": False},
    {"name": "Result", "module": "NzResultModule", "path": "result", "category": "反饋類組件 (Feedback)", "index": 2, "schematics": None, "is_service": False},
    {"name": "Skeleton", "module": "NzSkeletonModule", "path": "skeleton", "category": "反饋類組件 (Feedback)", "index": 3, "schematics": None, "is_service": False},
    {"name": "Spin", "module": "NzSpinModule", "path": "spin", "category": "反饋類組件 (Feedback)", "index": 4, "schematics": None, "is_service": False},
    {"name": "Progress", "module": "NzProgressModule", "path": "progress", "category": "反饋類組件 (Feedback)", "index": 5, "schematics": None, "is_service": False},
    {"name": "Drawer", "module": "NzDrawerModule", "path": "drawer", "category": "反饋類組件 (Feedback)", "index": 6, "schematics": None, "is_service": False},
    {"name": "Modal", "module": "NzModalModule", "path": "modal", "category": "反饋類組件 (Feedback)", "index": 7, "schematics": None, "is_service": False},
    {"name": "Popconfirm", "module": "NzPopconfirmModule", "path": "popconfirm", "category": "反饋類組件 (Feedback)", "index": 8, "schematics": None, "is_service": False},
    {"name": "Message", "module": "NzMessageService", "path": "message", "category": "反饋類組件 (Feedback)", "index": 9, "schematics": None, "is_service": True},
    {"name": "Notification", "module": "NzNotificationService", "path": "notification", "category": "反饋類組件 (Feedback)", "index": 10, "schematics": None, "is_service": True},
    
    # 數據展示類組件 (Data Display)
    {"name": "Avatar", "module": "NzAvatarModule", "path": "avatar", "category": "數據展示類組件 (Data Display)", "index": 11, "schematics": None, "is_service": False},
    {"name": "Badge", "module": "NzBadgeModule", "path": "badge", "category": "數據展示類組件 (Data Display)", "index": 12, "schematics": None, "is_service": False},
    {"name": "Calendar", "module": "NzCalendarModule", "path": "calendar", "category": "數據展示類組件 (Data Display)", "index": 13, "schematics": None, "is_service": False},
    {"name": "Card", "module": "NzCardModule", "path": "card", "category": "數據展示類組件 (Data Display)", "index": 14, "schematics": None, "is_service": False},
    {"name": "Carousel", "module": "NzCarouselModule", "path": "carousel", "category": "數據展示類組件 (Data Display)", "index": 15, "schematics": None, "is_service": False},
    {"name": "Collapse", "module": "NzCollapseModule", "path": "collapse", "category": "數據展示類組件 (Data Display)", "index": 16, "schematics": None, "is_service": False},
    {"name": "Comment", "module": "NzCommentModule", "path": "comment", "category": "數據展示類組件 (Data Display)", "index": 17, "schematics": None, "is_service": False},
    {"name": "Descriptions", "module": "NzDescriptionsModule", "path": "descriptions", "category": "數據展示類組件 (Data Display)", "index": 18, "schematics": None, "is_service": False},
    {"name": "Empty", "module": "NzEmptyModule", "path": "empty", "category": "數據展示類組件 (Data Display)", "index": 19, "schematics": None, "is_service": False},
    {"name": "Image", "module": "NzImageModule", "path": "image", "category": "數據展示類組件 (Data Display)", "index": 20, "schematics": None, "is_service": False},
    {"name": "List", "module": "NzListModule", "path": "list", "category": "數據展示類組件 (Data Display)", "index": 21, "schematics": None, "is_service": False},
    {"name": "Popover", "module": "NzPopoverModule", "path": "popover", "category": "數據展示類組件 (Data Display)", "index": 22, "schematics": None, "is_service": False},
    {"name": "QRCode", "module": "NzQRCodeModule", "path": "qr-code", "category": "數據展示類組件 (Data Display)", "index": 23, "schematics": None, "is_service": False},
    {"name": "Segmented", "module": "NzSegmentedModule", "path": "segmented", "category": "數據展示類組件 (Data Display)", "index": 24, "schematics": None, "is_service": False},
    {"name": "Statistic", "module": "NzStatisticModule", "path": "statistic", "category": "數據展示類組件 (Data Display)", "index": 25, "schematics": None, "is_service": False},
    {"name": "Table", "module": "NzTableModule", "path": "table", "category": "數據展示類組件 (Data Display)", "index": 26, "schematics": None, "is_service": False},
    {"name": "Tag", "module": "NzTagModule", "path": "tag", "category": "數據展示類組件 (Data Display)", "index": 27, "schematics": None, "is_service": False},
    {"name": "Timeline", "module": "NzTimelineModule", "path": "timeline", "category": "數據展示類組件 (Data Display)", "index": 28, "schematics": None, "is_service": False},
    {"name": "Tooltip", "module": "NzTooltipModule", "path": "tooltip", "category": "數據展示類組件 (Data Display)", "index": 29, "schematics": None, "is_service": False},
    {"name": "Tree", "module": "NzTreeModule", "path": "tree", "category": "數據展示類組件 (Data Display)", "index": 30, "schematics": "tree", "is_service": False},
    {"name": "TreeView", "module": "NzTreeViewModule", "path": "tree-view", "category": "數據展示類組件 (Data Display)", "index": 31, "schematics": None, "is_service": False},
    
    # 數據錄入類組件 (Data Entry)
    {"name": "AutoComplete", "module": "NzAutocompleteModule", "path": "auto-complete", "category": "數據錄入類組件 (Data Entry)", "index": 32, "schematics": None, "is_service": False},
    {"name": "Cascader", "module": "NzCascaderModule", "path": "cascader", "category": "數據錄入類組件 (Data Entry)", "index": 33, "schematics": None, "is_service": False},
    {"name": "Checkbox", "module": "NzCheckboxModule", "path": "checkbox", "category": "數據錄入類組件 (Data Entry)", "index": 34, "schematics": None, "is_service": False},
    {"name": "ColorPicker", "module": "NzColorPickerModule", "path": "color-picker", "category": "數據錄入類組件 (Data Entry)", "index": 35, "schematics": None, "is_service": False},
    {"name": "DatePicker", "module": "NzDatePickerModule", "path": "date-picker", "category": "數據錄入類組件 (Data Entry)", "index": 36, "schematics": None, "is_service": False},
    {"name": "Form", "module": "NzFormModule", "path": "form", "category": "數據錄入類組件 (Data Entry)", "index": 37, "schematics": "form", "is_service": False},
    {"name": "Input", "module": "NzInputModule", "path": "input", "category": "數據錄入類組件 (Data Entry)", "index": 38, "schematics": None, "is_service": False},
    {"name": "InputNumber", "module": "NzInputNumberModule", "path": "input-number", "category": "數據錄入類組件 (Data Entry)", "index": 39, "schematics": None, "is_service": False},
    {"name": "Mention", "module": "NzMentionModule", "path": "mention", "category": "數據錄入類組件 (Data Entry)", "index": 40, "schematics": None, "is_service": False},
    {"name": "Radio", "module": "NzRadioModule", "path": "radio", "category": "數據錄入類組件 (Data Entry)", "index": 41, "schematics": None, "is_service": False},
    {"name": "Rate", "module": "NzRateModule", "path": "rate", "category": "數據錄入類組件 (Data Entry)", "index": 42, "schematics": None, "is_service": False},
    {"name": "Select", "module": "NzSelectModule", "path": "select", "category": "數據錄入類組件 (Data Entry)", "index": 43, "schematics": None, "is_service": False},
    {"name": "Slider", "module": "NzSliderModule", "path": "slider", "category": "數據錄入類組件 (Data Entry)", "index": 44, "schematics": None, "is_service": False},
    {"name": "Switch", "module": "NzSwitchModule", "path": "switch", "category": "數據錄入類組件 (Data Entry)", "index": 45, "schematics": None, "is_service": False},
    {"name": "TimePicker", "module": "NzTimePickerModule", "path": "time-picker", "category": "數據錄入類組件 (Data Entry)", "index": 46, "schematics": None, "is_service": False},
    {"name": "Transfer", "module": "NzTransferModule", "path": "transfer", "category": "數據錄入類組件 (Data Entry)", "index": 47, "schematics": None, "is_service": False},
    {"name": "TreeSelect", "module": "NzTreeSelectModule", "path": "tree-select", "category": "數據錄入類組件 (Data Entry)", "index": 48, "schematics": None, "is_service": False},
    {"name": "Upload", "module": "NzUploadModule", "path": "upload", "category": "數據錄入類組件 (Data Entry)", "index": 49, "schematics": None, "is_service": False},
    
    # 佈局類組件 (Layout)
    {"name": "Divider", "module": "NzDividerModule", "path": "divider", "category": "佈局類組件 (Layout)", "index": 50, "schematics": None, "is_service": False},
    {"name": "Flex", "module": "NzFlexModule", "path": "flex", "category": "佈局類組件 (Layout)", "index": 51, "schematics": None, "is_service": False},
    {"name": "Grid", "module": "NzGridModule", "path": "grid", "category": "佈局類組件 (Layout)", "index": 52, "schematics": None, "is_service": False},
    {"name": "Layout", "module": "NzLayoutModule", "path": "layout", "category": "佈局類組件 (Layout)", "index": 53, "schematics": None, "is_service": False},
    {"name": "Space", "module": "NzSpaceModule", "path": "space", "category": "佈局類組件 (Layout)", "index": 54, "schematics": None, "is_service": False},
    {"name": "Splitter", "module": "NzSplitterModule", "path": "splitter", "category": "佈局類組件 (Layout)", "index": 55, "schematics": None, "is_service": False},
    
    # 通用類組件 (General)
    {"name": "Button", "module": "NzButtonModule", "path": "button", "category": "通用類組件 (General)", "index": 56, "schematics": None, "is_service": False},
    {"name": "FloatButton", "module": "NzFloatButtonModule", "path": "float-button", "category": "通用類組件 (General)", "index": 57, "schematics": None, "is_service": False},
    {"name": "Icon", "module": "NzIconModule", "path": "icon", "category": "通用類組件 (General)", "index": 58, "schematics": None, "is_service": False},
    {"name": "Typography", "module": "NzTypographyModule", "path": "typography", "category": "通用類組件 (General)", "index": 59, "schematics": None, "is_service": False},
    
    # 導航類組件 (Navigation)
    {"name": "Anchor", "module": "NzAnchorModule", "path": "anchor", "category": "導航類組件 (Navigation)", "index": 60, "schematics": None, "is_service": False},
    {"name": "Breadcrumb", "module": "NzBreadCrumbModule", "path": "breadcrumb", "category": "導航類組件 (Navigation)", "index": 61, "schematics": None, "is_service": False},
    {"name": "Dropdown", "module": "NzDropDownModule", "path": "dropdown", "category": "導航類組件 (Navigation)", "index": 62, "schematics": None, "is_service": False},
    {"name": "Menu", "module": "NzMenuModule", "path": "menu", "category": "導航類組件 (Navigation)", "index": 63, "schematics": None, "is_service": False},
    {"name": "PageHeader", "module": "NzPageHeaderModule", "path": "page-header", "category": "導航類組件 (Navigation)", "index": 64, "schematics": None, "is_service": False},
    {"name": "Pagination", "module": "NzPaginationModule", "path": "pagination", "category": "導航類組件 (Navigation)", "index": 65, "schematics": None, "is_service": False},
    {"name": "Steps", "module": "NzStepsModule", "path": "steps", "category": "導航類組件 (Navigation)", "index": 66, "schematics": None, "is_service": False},
    {"name": "Tabs", "module": "NzTabsModule", "path": "tabs", "category": "導航類組件 (Navigation)", "index": 67, "schematics": None, "is_service": False},
    
    # 其他類組件 (Other)
    {"name": "Affix", "module": "NzAffixModule", "path": "affix", "category": "其他類組件 (Other)", "index": 68, "schematics": None, "is_service": False},
    {"name": "BackTop", "module": "NzBackTopModule", "path": "back-top", "category": "其他類組件 (Other)", "index": 69, "schematics": None, "is_service": False},
    {"name": "WaterMark", "module": "NzWaterMarkModule", "path": "water-mark", "category": "其他類組件 (Other)", "index": 70, "schematics": None, "is_service": False},
    
    # 特色組件 (Special)
    {"name": "CheckList", "module": "NzCheckListModule", "path": "check-list", "category": "特色組件 (Special)", "index": 71, "schematics": None, "is_service": False},
    {"name": "HashCode", "module": "NzHashCodeModule", "path": "hash-code", "category": "特色組件 (Special)", "index": 72, "schematics": None, "is_service": False},
]

# Tree schematics
TREE_SCHEMATICS = [
    "tree-basic",
    "tree-basic-controlled",
    "tree-draggable",
    "tree-draggable-confirm",
    "tree-dynamic",
    "tree-search",
    "tree-customized-icon",
    "tree-line",
    "tree-directory",
    "tree-virtual-scroll"
]

# Form schematics
FORM_SCHEMATICS = [
    "form-normal-login",
    "form-normal-register",
    "form-normal-validation",
    "form-advanced-search",
    "form-dynamic-form",
    "form-dynamic-form-item",
    "form-dynamic-form-rule"
]

def generate_component_doc(component):
    """生成組件文檔"""
    index_str = f"{component['index']:02d}"
    filename = f"{index_str}-{component['name']}.md"
    
    # 確定導入類型
    import_type = "服務導入" if component['is_service'] else "模組導入"
    import_example = f"import {{ {component['module']} }} from 'ng-zorro-antd/{component['path']}';"
    
    # Schematics 部分
    schematics_section = ""
    if component['schematics'] == "tree":
        schematics_section = """
## Schematics 命令

```bash
# 基本樹形控件
ng g ng-zorro-antd:tree-basic <name>

# 受控樹形控件
ng g ng-zorro-antd:tree-basic-controlled <name>

# 可拖拽樹形控件
ng g ng-zorro-antd:tree-draggable <name>

# 帶確認的可拖拽樹形控件
ng g ng-zorro-antd:tree-draggable-confirm <name>

# 動態加載數據的樹形控件
ng g ng-zorro-antd:tree-dynamic <name>

# 可搜索的樹形控件
ng g ng-zorro-antd:tree-search <name>

# 自定義圖標的樹形控件
ng g ng-zorro-antd:tree-customized-icon <name>

# 帶連接線的樹形控件
ng g ng-zorro-antd:tree-line <name>

# 目錄樹形控件
ng g ng-zorro-antd:tree-directory <name>

# 虛擬滾動樹形控件
ng g ng-zorro-antd:tree-virtual-scroll <name>
```
"""
    elif component['schematics'] == "form":
        schematics_section = """
## Schematics 命令

```bash
# 標準登入表單
ng g ng-zorro-antd:form-normal-login <name>

# 標準註冊表單
ng g ng-zorro-antd:form-normal-register <name>

# 標準表單驗證
ng g ng-zorro-antd:form-normal-validation <name>

# 高級搜索表單
ng g ng-zorro-antd:form-advanced-search <name>

# 動態表單
ng g ng-zorro-antd:form-dynamic-form <name>

# 動態表單項目
ng g ng-zorro-antd:form-dynamic-form-item <name>

# 動態表單規則
ng g ng-zorro-antd:form-dynamic-form-rule <name>
```
"""
    else:
        schematics_section = """
## Schematics 命令

暫無專用 schematics
"""
    
    # 使用方式
    usage_section = ""
    if component['is_service']:
        usage_section = f"""
### 使用服務

```typescript
import {{ inject }} from '@angular/core';
{import_example}

@Component({{
  selector: 'app-example',
  standalone: true,
  // ...
}})
export class ExampleComponent {{
  private {component['path']} = inject({component['module']});

  // 使用服務方法
}}
```
"""
    else:
        usage_section = f"""
### 導入模組

```typescript
{import_example}

@Component({{
  selector: 'app-example',
  standalone: true,
  imports: [{component['module']}],
  // ...
}})
export class ExampleComponent {{}}
```

### 或使用 SHARED_IMPORTS

```typescript
import {{ SHARED_IMPORTS }} from '@shared/shared-imports';

@Component({{
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含所有 ng-zorro-antd 組件
  // ...
}})
export class ExampleComponent {{}}
```
"""
    
    # 生成文檔內容
    doc_content = f"""# {component['name']} - {component['name']}

> **組件分類**：{component['category']}  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **{import_type}** | `{component['module']}` |
| **官方文檔** | [{component['name']}](https://ng.ant.design/components/{component['path']}/en) |
| **Schematics 命令** | {'詳見下方命令列表' if component['schematics'] else '暫無專用 schematics'} |
{schematics_section}
## 使用方式
{usage_section}
## 基本用法

請參考 [官方文檔](https://ng.ant.design/components/{component['path']}/en) 查看詳細用法和示例。

## 相關資源

- [官方文檔](https://ng.ant.design/components/{component['path']}/en)
- [返回索引](../46-ng-zorro-antd-組件清單與CLI指令.md)
"""
    
    return filename, doc_content

def main():
    """主函數"""
    # 獲取當前腳本所在目錄
    script_dir = Path(__file__).parent
    output_dir = script_dir
    
    print(f"生成組件文檔到: {output_dir}")
    
    for component in COMPONENTS:
        filename, content = generate_component_doc(component)
        filepath = output_dir / filename
        
        # 如果文件已存在，跳過（保留已創建的文檔）
        if filepath.exists():
            print(f"⏭️  跳過已存在的文件: {filename}")
            continue
        
        # 寫入文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已生成: {filename}")
    
    print(f"\n✅ 完成！共生成 {len(COMPONENTS)} 個組件文檔")

if __name__ == "__main__":
    main()

