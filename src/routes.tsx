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
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false
  },
  {
    name: 'Research Reports',
    path: '/reports',
    element: <ReportsListPage />
  },
  {
    name: 'Report Details',
    path: '/reports/:id',
    element: <ReportDetailPage />,
    visible: false
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <ProfilePage />,
    visible: false
  },
  {
    name: 'Admin Panel',
    path: '/admin',
    element: <AdminLayout />,
    visible: false,
    children: [
      {
        name: 'Dashboard',
        path: '',
        element: <AdminDashboard />
      },
      {
        name: 'Home管理',
        path: 'homepage',
        element: <AdminHomepage />
      },
      {
        name: 'Reports Management',
        path: 'reports',
        element: <AdminReports />
      },
      {
        name: 'Categories Management',
        path: 'categories',
        element: <AdminCategories />
      },
      {
        name: 'Users Management',
        path: 'users',
        element: <AdminUsers />
      },
      {
        name: 'Statistics',
        path: 'statistics',
        element: <AdminStatistics />
      }
    ]
  }
];

export default routes;
