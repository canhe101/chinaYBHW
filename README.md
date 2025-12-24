# ChinaResearchHub.com - 中国PDF研报下载网站

## 项目简介

ChinaResearchHub 是一个面向全球用户的中国PDF研报下载平台，提供最新的中国经济报告、市场分析资料、行业研究报告等专业文档的在线浏览和下载服务。

## 主要功能

### 前台功能
- **用户系统**：用户注册、登录、个人信息管理
- **首页展示**：网站使命、服务特色、优势介绍
- **研报浏览**：按发布时间、分类、浏览量、下载量排序展示
- **搜索筛选**：支持关键词搜索和分类筛选
- **研报详情**：PDF在线预览、下载功能、浏览量和下载量统计
- **个人中心**：查看下载记录

### 后台管理功能
- **仪表盘**：平台数据统计概览
- **首页管理**：编辑首页内容、使命、特色等
- **研报管理**：
  - 手动添加研报（标题、描述、PDF链接等）
  - Excel批量导入研报
  - 编辑、删除研报
  - 批量删除功能
- **分类管理**：新增、编辑、删除研报分类
- **用户管理**：查看用户列表、管理用户角色
- **统计分析**：查看平台整体数据统计

## 技术栈

- **前端框架**：React 18 + TypeScript + Vite
- **UI组件库**：shadcn/ui + Tailwind CSS
- **路由管理**：React Router v6
- **状态管理**：React Context + Hooks
- **后端服务**：Supabase (PostgreSQL + Auth + RLS)
- **表格处理**：xlsx (Excel导入导出)
- **日期处理**：date-fns

## 设计风格

- **主色调**：深蓝色 (#1E3A8A) 体现专业性与可信度
- **辅助色**：浅灰色 (#F8FAFC) 作为背景色
- **设计风格**：现代简约的 Material Design 风格
- **布局特点**：卡片布局、圆角8px、响应式设计

## 项目结构

```
├── src
│   ├── components
│   │   ├── layouts          # 布局组件
│   │   │   ├── Header.tsx   # 顶部导航
│   │   │   ├── Footer.tsx   # 底部信息
│   │   │   └── AdminLayout.tsx  # 管理后台布局
│   │   ├── common           # 通用组件
│   │   │   └── RouteGuard.tsx   # 路由守卫
│   │   └── ui               # UI组件库
│   ├── contexts
│   │   └── AuthContext.tsx  # 认证上下文
│   ├── db
│   │   ├── supabase.ts      # Supabase客户端
│   │   └── api.ts           # 数据库API封装
│   ├── pages
│   │   ├── HomePage.tsx     # 首页
│   │   ├── LoginPage.tsx    # 登录注册页
│   │   ├── ReportsListPage.tsx  # 研报列表页
│   │   ├── ReportDetailPage.tsx # 研报详情页
│   │   ├── ProfilePage.tsx  # 个人中心
│   │   └── admin            # 管理后台页面
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminHomepage.tsx
│   │       ├── AdminReports.tsx
│   │       ├── AdminCategories.tsx
│   │       ├── AdminUsers.tsx
│   │       └── AdminStatistics.tsx
│   ├── types
│   │   └── index.ts         # TypeScript类型定义
│   ├── routes.tsx           # 路由配置
│   └── App.tsx              # 应用入口
```

## 快速开始

### 环境要求

```bash
Node.js >= 20
npm >= 10
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev -- --host 127.0.0.1
```

或者

```bash
npx vite --host 127.0.0.1
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

### 首次使用

1. **注册账号**：访问登录页面，点击"注册"标签，输入用户名和密码完成注册
2. **首位用户自动成为管理员**：第一个注册的用户将自动获得管理员权限
3. **访问管理后台**：管理员登录后，点击顶部导航栏的"管理后台"按钮

### 管理员操作

#### 添加研报
1. 进入"研报管理"页面
2. 点击"新增研报"按钮
3. 填写研报信息（标题、描述、PDF链接、分类等）
4. 点击"创建"保存

#### Excel批量导入
1. 进入"研报管理"页面
2. 点击"Excel导入"按钮
3. 下载Excel模板
4. 按照模板格式填写研报信息（标题、简介、下载链接、来源、发布时间）
5. 上传填好的Excel文件完成批量导入

#### 管理分类
1. 进入"分类管理"页面
2. 可以新增、编辑、删除研报分类

#### 管理用户
1. 进入"用户管理"页面
2. 可以查看所有用户并修改用户角色（普通用户/管理员）

### 普通用户操作

1. **浏览研报**：访问首页或研报列表页浏览最新研报
2. **搜索研报**：使用搜索框输入关键词查找研报
3. **筛选研报**：按分类或排序方式筛选研报
4. **查看详情**：点击研报卡片查看详细信息和PDF预览
5. **下载研报**：在详情页点击"下载研报"按钮
6. **查看记录**：登录后在个人中心查看下载记录

## 数据库结构

### 主要表结构

- **profiles**：用户资料表
- **categories**：研报分类表
- **reports**：研报信息表
- **download_logs**：下载记录表
- **homepage_config**：首页配置表

### 权限控制

- 使用 Supabase Row Level Security (RLS) 实现数据安全
- 管理员拥有所有数据的完全访问权限
- 普通用户只能查看公开数据和自己的个人数据

## 注意事项

1. **用户名格式**：只能包含字母、数字和下划线
2. **密码要求**：至少6位字符
3. **PDF链接**：必须是有效的PDF文件URL
4. **Excel导入格式**：必须包含"标题"和"下载链接"列，其他列可选

## 技术支持

如有问题或建议，欢迎联系我们。

---

© 2025 ChinaResearchHub. All rights reserved.

