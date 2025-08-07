# Receipt 修改计划

## 任务目标
1. 简化 Receipt 接口，只保留 id, vendor, amount, date 字段
2. 添加拍照和上传文件的UI按钮（仅显示，不实现实际功能）

## 当前状态分析

### 现有 Receipt 接口
**receipts.tsx 中**：
```typescript
interface Receipt {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

**receipt-detail.tsx 中**：
```typescript
interface Receipt {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  merchant?: string;
  category?: string;
  notes?: string;
}
```

### 需要修改的内容
1. 将 Receipt 接口简化为：id, vendor, amount, date
2. 移除 description, status, merchant, category, notes 字段
3. 更新 mock 数据以匹配新接口
4. 修改表单和显示逻辑
5. 添加拍照和上传文件的UI按钮

## 详细修改计划

### 1. 修改 receipts.tsx
- **修改 Receipt 接口**：
  ```typescript
  interface Receipt {
    id: string;
    vendor: string;
    amount: number;
    date: string;
  }
  ```

- **更新 mock 数据**：
  ```typescript
  const mockReceipts: Receipt[] = [
    { id: '1', vendor: 'Restaurant ABC', amount: 45.0, date: '2024-01-15' },
    { id: '2', vendor: 'Office Depot', amount: 89.99, date: '2024-01-14' },
    { id: '3', vendor: 'City Cab', amount: 25.5, date: '2024-01-12' },
  ];
  ```

- **修改表单状态**：
  ```typescript
  const [newReceipt, setNewReceipt] = useState({
    vendor: '',
    amount: '',
    date: '',
  });
  ```

- **修改 handleAddReceipt 函数**：
  - 移除 status 相关逻辑
  - 使用 vendor 替换 description

- **修改卡片显示**：
  - 显示 vendor 而不是 description
  - 移除 status Chip 显示

- **修改模态框表单**：
  - 将 "Description" 输入框改为 "Vendor"
  - 移除 status 相关验证

- **添加拍照和上传文件按钮**：
  - 在模态框中添加两个按钮：拍照和上传文件
  - 按钮只显示UI，不实现实际功能

### 2. 修改 receipt-detail.tsx
- **修改 Receipt 接口**：
  ```typescript
  interface Receipt {
    id: string;
    vendor: string;
    amount: number;
    date: string;
  }
  ```

- **更新 mock 数据**：
  ```typescript
  const mockReceipts: Receipt[] = [
    { id: '1', vendor: 'Restaurant ABC', amount: 45.0, date: '2024-01-15' },
    { id: '2', vendor: 'Office Depot', amount: 89.99, date: '2024-01-14' },
    { id: '3', vendor: 'City Cab', amount: 25.5, date: '2024-01-12' },
  ];
  ```

- **修改详情页面显示**：
  - 显示 vendor 而不是 description
  - 移除 status, merchant, category, notes 相关显示
  - 简化页面布局

## 实施步骤
1. 修改 receipts.tsx 中的接口和 mock 数据
2. 修改 receipts.tsx 中的表单和显示逻辑
3. 在 receipts.tsx 中添加拍照和上传文件按钮
4. 修改 receipt-detail.tsx 中的接口和 mock 数据
5. 修改 receipt-detail.tsx 中的显示逻辑
6. 测试修改后的代码

## 注意事项
- 拍照和上传文件按钮只需要显示UI，不需要实现实际功能
- 确保两个文件中的 Receipt 接口保持一致
- 更新所有相关的引用和显示逻辑