# Receipt 更新修改计划

## 已完成的任务
1. 简化 Receipt 接口，只保留 id, vendor, amount, date 字段
2. 更新 receipts.tsx 中的 mock 数据以匹配新的接口
3. 修改 receipts.tsx 中的表单，添加 vendor 字段并移除不需要的字段
4. 更新 receipts.tsx 中的卡片显示，只显示必要字段
5. 更新 receipt-detail.tsx 中的 mock 数据以匹配新的接口
6. 修改 receipt-detail.tsx 中的显示，只显示必要字段
7. 在 receipts.tsx 中添加拍照和上传文件的UI按钮（仅显示，不实现实际功能）

## 新增任务

### 任务 1：修改 receipts.tsx 中的 Add Receipt 按钮
- **目标**：使 Add Receipt 按钮直接跳转到 Receipt Detail 页面而不是弹窗
- **修改内容**：
  - 移除模态框相关代码
  - 修改 Add Receipt 按钮的 onPress 事件，使其跳转到 receipt-detail 页面
  - 可能需要传递一个参数表示这是新增模式

### 任务 2：修改 receipt-detail.tsx，使其成为集合新增和编辑为一体的页面
- **目标**：将 receipt-detail 页面改造为同时支持新增和编辑功能
- **修改内容**：
  - 添加表单组件用于编辑/新增 receipt
  - 根据路由参数判断是新增模式还是编辑模式
  - 在新增模式下，表单为空；在编辑模式下，表单填充现有数据
  - 添加保存按钮，根据模式执行新增或更新操作
  - 保留拍照和上传文件的UI按钮（仅显示，不实现实际功能）
  - 可能需要添加取消按钮，在新增模式下可以取消并返回列表页

## 详细实施步骤

### 步骤 1：修改 receipts.tsx
1. 移除模态框相关代码（Modal 相关的 state 和 JSX）
2. 移除 handleAddReceipt 函数
3. 修改 Add Receipt 按钮的 onPress 事件，使其跳转到 receipt-detail 页面
4. 可能需要传递一个参数表示这是新增模式，例如：`router.push('/receipt-detail?mode=new')`

### 步骤 2：修改 receipt-detail.tsx
1. 添加表单状态管理（vendor, amount, date）
2. 添加模式判断逻辑（新增模式 vs 编辑模式）
3. 根据模式初始化表单数据
4. 添加表单输入组件（Vendor, Amount, Date）
5. 添加拍照和上传文件按钮（从 receipts.tsx 移过来）
6. 添加保存和取消按钮
7. 实现保存逻辑（根据模式执行新增或更新）
8. 实现取消逻辑（在新增模式下返回列表页）

### 步骤 3：测试功能
1. 测试从列表页点击 Add Receipt 按钮跳转到详情页
2. 测试新增模式下表单为空
3. 测试编辑模式下表单填充现有数据
4. 测试保存功能
5. 测试取消功能

## 注意事项
- 确保两个文件中的 Receipt 接口保持一致
- 新增模式下，可能需要生成新的 id
- 编辑模式下，需要更新现有的 receipt 数据
- 拍照和上传文件按钮只需要显示UI，不需要实现实际功能