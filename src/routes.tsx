import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ReportsListPage from './pages/ReportsListPage';
import ReportDetailPage from './pages/ReportDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminReports from './pages/admin/AdminReports';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStatistics from './pages/admin/AdminStatistics';
import { AdminLayout } from './components/layouts/AdminLayout';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />
  },
  {
    name: '登录',
    path: '/login',
    element: <LoginPage />,
    visible: false
  },
  {
    name: '研报列表',
    path: '/reports',
    element: <ReportsListPage />
  },
  {
    name: '研报详情',
    path: '/reports/:id',
    element: <ReportDetailPage />,
    visible: false
  },
  {
    name: '个人中心',
    path: '/profile',
    element: <ProfilePage />,
    visible: false
  },
  {
    name: '管理后台',
    path: '/admin',
    element: <AdminLayout />,
    visible: false,
    children: [
      {
        name: '仪表盘',
        path: '',
        element: <AdminDashboard />
      },
      {
        name: '首页管理',
        path: 'homepage',
        element: <AdminHomepage />
      },
      {
        name: '研报管理',
        path: 'reports',
        element: <AdminReports />
      },
      {
        name: '分类管理',
        path: 'categories',
        element: <AdminCategories />
      },
      {
        name: '用户管理',
        path: 'users',
        element: <AdminUsers />
      },
      {
        name: '统计分析',
        path: 'statistics',
        element: <AdminStatistics />
      }
    ]
  }
];

export default routes;
