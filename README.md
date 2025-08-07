# EMS RN Demo

这是一个基于 Expo 和 React Native 的企业费用管理系统移动应用示例项目，使用了 Expo Router 实现文件路由管理，展示了完整的费用报销流程和功能。

## 项目概述

EMS (Expense Management System) RN Demo 是一个功能完整的企业费用管理移动应用，旨在帮助企业员工高效地提交、管理和审批费用报销。该应用采用现代化的设计理念，提供了直观的用户界面和流畅的用户体验。

### 主要特点

- **完整的费用管理流程**：从费用提交到审批的全流程管理
- **直观的用户界面**：基于 Material Design 3 的现代化设计
- **跨平台支持**：支持 iOS、Android 和 Web 平台
- **响应式设计**：适配不同屏幕尺寸的设备
- **类型安全**：使用 TypeScript 确保代码质量

## 主要技术栈

### 核心技术

- **React Native 0.79.5**：移动应用开发框架
- **Expo SDK 53**：开发工具链和平台服务
- **TypeScript**：类型安全的 JavaScript 超集
- **Expo Router**：基于文件的导航系统

### UI 框架和组件

- **React Native Paper 5.14.5**：Material Design 组件库
- **React Navigation 7.1.6**：导航管理
- **React Native Reanimated 3.17.4**：流畅的动画和手势处理

### 功能性依赖

- **日期时间处理**：@react-native-community/datetimepicker 8.4.1
- **手势处理**：react-native-gesture-handler 2.24.0
- **WebView 支持**：react-native-webview 13.13.5
- **安全区域处理**：react-native-safe-area-context 5.4.0
- **模态日期选择器**：react-native-modal-datetime-picker 18.0.0

### 开发工具

- **ESLint**：代码质量检查
- **Babel**：JavaScript 编译器
- **gh-pages**：GitHub Pages 部署

## 主要功能模块

### 1. 用户认证

- **登录页面** (`app/login.tsx`)：提供用户登录功能
- **演示账户**：支持快速登录体验（demo@company.com / demo123）
- **安全退出**：通过 ProfileMenu 组件实现

### 2. 主页仪表板

- **费用概览**：显示当月总支出和待审批金额
- **最近费用**：列出最近的费用记录及其状态
- **快速操作**：提供常用功能的快速访问
- **每日提示**：提供使用建议和最佳实践

### 3. 费用管理

- **费用列表** (`app/(tabs)/expenses.tsx`)：查看所有费用记录
- **费用详情** (`app/report-detail.tsx`)：查看费用的详细信息、收据和评论
- **费用编辑** (`app/expense-edit.tsx`)：编辑费用信息和关联收据
- **费用创建**：通过模态框创建新的费用报告

### 4. 审批管理

- **审批列表** (`app/(tabs)/approvals.tsx`)：查看待审批、已批准和已拒绝的报告
- **审批详情**：查看报告的完整信息和相关费用
- **审批操作**：批准或拒绝费用报告，并添加评论
- **状态统计**：显示不同状态报告的数量统计

### 5. 收据管理

- **收据列表** (`app/(tabs)/receipts.tsx`)：查看所有收据记录
- **收据详情** (`app/receipt-detail.tsx`)：查看收据的详细信息
- **收据上传**：支持拍照或上传收据图片
- **金额确认** (`app/confirm-amount.tsx`)：确认收据金额

### 6. 个人资料

- **资料查看** (`app/profile.tsx`)：查看和编辑个人信息
- **设置管理**：通知设置、自动同步等
- **数据管理**：数据导出和重置功能
- **帮助支持**：应用帮助和联系信息

### 7. 导航系统

- **底部标签导航** (`app/(tabs)/_layout.tsx`)：首页、费用、审批、收据四个主要模块
- **堆栈导航** (`app/_layout.tsx`)：管理页面间的导航关系
- **个人资料菜单** (`app/components/ProfileMenu.tsx`)：快速访问个人资料相关功能

## 主题设计与 UI 框架

### 设计理念

- **商务风格**：采用蓝色为主色调的商务主题
- **Material Design 3**：遵循最新的 Material Design 设计规范
- **一致性**：统一的颜色方案、字体和间距
- **可访问性**：考虑到不同用户的需求，提供良好的可访问性支持

### 主题配置

- **主色调**：Material Blue (#1976D2)
- **辅助色**：深蓝色 (#1565C0) 和浅蓝色 (#42A5F5)
- **背景色**：白色 (#FFFFFF) 和浅蓝灰色 (#F5F7FA)
- **状态颜色**：绿色 (批准)、橙色 (待处理)、红色 (拒绝)

### 组件库

- **React Native Paper**：提供 Material Design 风格的组件
- **自定义组件**：针对业务需求定制的组件
- **图标系统**：使用 Material Icons 图标库

## 项目结构

```
ems-rn-demo/
├── app/                    # 应用主要代码
│   ├── _layout.tsx         # 根布局组件
│   ├── login.tsx           # 登录页面
│   ├── profile.tsx         # 个人资料页面
│   ├── confirm-amount.tsx  # 金额确认页面
│   ├── report-detail.tsx   # 报告详情页面
│   ├── expense-edit.tsx    # 费用编辑页面
│   ├── receipt-detail.tsx  # 收据详情页面
│   ├── +not-found.tsx      # 404 页面
│   ├── (tabs)/             # 标签导航页面组
│   │   ├── _layout.tsx     # 标签布局组件
│   │   ├── index.tsx       # 首页
│   │   ├── expenses.tsx    # 费用页面
│   │   ├── approvals.tsx   # 审批页面
│   │   └── receipts.tsx    # 收据页面
│   └── components/         # 公共组件
│       └── ProfileMenu.tsx # 个人资料菜单组件
├── assets/                 # 静态资源
│   ├── fonts/             # 字体文件
│   └── images/            # 图片资源
├── package.json           # 项目依赖和脚本
├── app.json              # Expo 应用配置
├── tsconfig.json         # TypeScript 配置
└── README.md             # 项目说明文档
```

## 安装和运行

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器
- Expo CLI（可选，用于本地开发）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/xiaomu0712/ems_rn_demo.git
   cd ems-rn-demo
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **启动开发服务器**
   ```bash
   npm start
   # 或
   yarn start
   ```

4. **运行应用**
   
   - **在移动设备上运行**：
     1. 安装 Expo Go 应用（iOS/Android）
     2. 扫描终端显示的 QR 码
   
   - **在 iOS 模拟器上运行**：
     ```bash
     npm run ios
     # 或
     yarn ios
     ```
   
   - **在 Android 模拟器上运行**：
     ```bash
     npm run android
     # 或
     yarn android
     ```
   
   - **在 Web 浏览器上运行**：
     ```bash
     npm run web
     # 或
     yarn web
     ```

### 构建和部署

- **代码检查**：
  ```bash
  npm run lint
  ```

- **部署到 GitHub Pages**：
  ```bash
  npm run deploy
  ```

## 开发指南

### 代码规范

项目使用 ESLint 进行代码质量检查，请确保在提交代码前运行：
```bash
npm run lint
```

### 文件命名约定

- 页面组件：使用 PascalCase（如 `LoginPage.tsx`）
- 通用组件：使用 PascalCase（如 `ProfileMenu.tsx`）
- 工具函数：使用 camelCase（如 `formatDate.ts`）
- 样式文件：与组件同名（如 `LoginPage.styles.ts`）

### 提交规范

使用语义化的提交信息格式：
```
类型(范围): 简短描述

详细描述（可选）
```

类型包括：
- `feat`：新功能
- `fix`：修复 bug
- `docs`：文档更新
- `style`：代码格式调整
- `refactor`：代码重构
- `test`：测试相关
- `chore`：构建或工具变动

## 常见问题

### Q: 如何添加新的页面？

A: 在 `app` 目录下创建新的文件，Expo Router 会自动将其添加到路由中。如果需要在标签导航中显示，请在 `app/(tabs)` 目录下创建。

### Q: 如何修改主题颜色？

A: 在 `app/_layout.tsx` 文件中修改 `businessTheme` 对象的颜色配置。

### Q: 如何添加新的图标？

A: 使用 `@expo/vector-icons` 包中的图标，或导入自定义图标到 `assets/images` 目录。

## 贡献指南

我们欢迎所有形式的贡献！如果您想为项目做出贡献，请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目主页：https://xiaomu0712.github.io/ems_rn_demo
- 提交问题：https://github.com/xiaomu0712/ems_rn_demo/issues

## 致谢

感谢以下开源项目和工具的支持：

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Material Design](https://material.io/design)
