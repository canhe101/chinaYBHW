export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// 用户角色
export type UserRole = 'user' | 'admin';

// 用户资料
export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// 分类
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// 研报
export interface Report {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  pdf_url: string;
  source: string | null;
  published_at: string | null;
  view_count: number;
  download_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// 下载记录
export interface DownloadLog {
  id: string;
  report_id: string;
  user_id: string | null;
  downloaded_at: string;
  report?: Report;
}

// 首页配置
export interface HomepageConfig {
  id: string;
  mission: string | null;
  features: string[] | null;
  advantages: string[] | null;
  updated_at: string;
}

// 统计数据
export interface Statistics {
  totalReports: number;
  totalDownloads: number;
  totalUsers: number;
  totalViews: number;
}
