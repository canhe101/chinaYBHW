import { supabase } from './supabase';
import type { Profile, Category, Report, DownloadLog, HomepageConfig, Statistics } from '@/types';

// ==================== 用户相关 ====================

// 获取用户资料
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// 获取所有用户（管理员）
export const getAllProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// 更新用户角色（管理员）
export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  
  if (error) throw error;
};

// ==================== 分类相关 ====================

// 获取所有分类
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// 创建分类
export const createCategory = async (category: { name: string; description?: string }): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// 更新分类
export const updateCategory = async (id: string, updates: Partial<Category>): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
};

// 删除分类
export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ==================== 研报相关 ====================

// 获取研报列表（带分页和筛选）
export const getReports = async (params: {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  sortBy?: 'created_at' | 'published_at' | 'view_count' | 'download_count';
  sortOrder?: 'asc' | 'desc';
}): Promise<{ reports: Report[]; total: number }> => {
  const { page = 1, pageSize = 10, categoryId, search, sortBy = 'created_at', sortOrder = 'desc' } = params;
  
  let query = supabase
    .from('reports')
    .select('*, category:categories(*)', { count: 'exact' });
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);
  
  const { data, error, count } = await query;
  
  if (error) throw error;
  return {
    reports: Array.isArray(data) ? data : [],
    total: count || 0
  };
};

// 获取单个研报
export const getReport = async (id: string): Promise<Report | null> => {
  const { data, error } = await supabase
    .from('reports')
    .select('*, category:categories(*)')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// 创建研报
export const createReport = async (report: {
  title: string;
  description?: string;
  category_id?: string;
  pdf_url: string;
  source?: string;
  published_at?: string;
}): Promise<Report> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('reports')
    .insert({
      ...report,
      created_by: user?.id || null
    })
    .select('*, category:categories(*)')
    .single();
  
  if (error) throw error;
  return data;
};

// 批量创建研报
export const createReportsBatch = async (reports: Array<{
  title: string;
  description?: string;
  category_id?: string;
  pdf_url: string;
  source?: string;
  published_at?: string;
}>): Promise<Report[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const reportsWithCreator = reports.map(report => ({
    ...report,
    created_by: user?.id || null
  }));
  
  const { data, error } = await supabase
    .from('reports')
    .insert(reportsWithCreator)
    .select('*, category:categories(*)');
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// 更新研报
export const updateReport = async (id: string, updates: Partial<Report>): Promise<void> => {
  const { error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', id);
  
  if (error) throw error;
};

// 删除研报
export const deleteReport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// 批量删除研报
export const deleteReportsBatch = async (ids: string[]): Promise<void> => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .in('id', ids);
  
  if (error) throw error;
};

// 增加浏览量
export const incrementViewCount = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_view_count', { report_id: id });
  if (error) {
    // 如果RPC不存在，使用普通更新
    const { data } = await supabase
      .from('reports')
      .select('view_count')
      .eq('id', id)
      .maybeSingle();
    
    if (data) {
      await supabase
        .from('reports')
        .update({ view_count: data.view_count + 1 })
        .eq('id', id);
    }
  }
};

// 增加下载量
export const incrementDownloadCount = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_download_count', { report_id: id });
  if (error) {
    // 如果RPC不存在，使用普通更新
    const { data } = await supabase
      .from('reports')
      .select('download_count')
      .eq('id', id)
      .maybeSingle();
    
    if (data) {
      await supabase
        .from('reports')
        .update({ download_count: data.download_count + 1 })
        .eq('id', id);
    }
  }
};

// ==================== 下载记录相关 ====================

// 创建下载记录
export const createDownloadLog = async (reportId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('download_logs')
    .insert({
      report_id: reportId,
      user_id: user?.id || null
    });
  
  if (error) throw error;
};

// 获取用户下载记录
export const getUserDownloadLogs = async (userId: string, page = 1, pageSize = 10): Promise<{ logs: DownloadLog[]; total: number }> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from('download_logs')
    .select('*, report:reports!download_logs_report_id_fkey(*)', { count: 'exact' })
    .eq('user_id', userId)
    .order('downloaded_at', { ascending: false })
    .range(from, to);
  
  if (error) throw error;
  return {
    logs: Array.isArray(data) ? data : [],
    total: count || 0
  };
};

// 获取研报的下载记录（管理员）
export const getReportDownloadLogs = async (reportId: string, page = 1, pageSize = 10): Promise<{ logs: DownloadLog[]; total: number }> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from('download_logs')
    .select('*', { count: 'exact' })
    .eq('report_id', reportId)
    .order('downloaded_at', { ascending: false })
    .range(from, to);
  
  if (error) throw error;
  return {
    logs: Array.isArray(data) ? data : [],
    total: count || 0
  };
};

// ==================== 首页配置相关 ====================

// 获取首页配置
export const getHomepageConfig = async (): Promise<HomepageConfig | null> => {
  const { data, error } = await supabase
    .from('homepage_config')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// 更新首页配置
export const updateHomepageConfig = async (id: string, config: Partial<HomepageConfig>): Promise<void> => {
  const { error } = await supabase
    .from('homepage_config')
    .update(config)
    .eq('id', id);
  
  if (error) throw error;
};

// ==================== 统计相关 ====================

// 获取统计数据
export const getStatistics = async (): Promise<Statistics> => {
  const [reportsResult, downloadsResult, usersResult] = await Promise.all([
    supabase.from('reports').select('*', { count: 'exact', head: true }),
    supabase.from('download_logs').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
  ]);
  
  // 获取总浏览量
  const { data: viewData } = await supabase
    .from('reports')
    .select('view_count');
  
  const totalViews = Array.isArray(viewData) 
    ? viewData.reduce((sum, report) => sum + (report.view_count || 0), 0)
    : 0;
  
  return {
    totalReports: reportsResult.count || 0,
    totalDownloads: downloadsResult.count || 0,
    totalUsers: usersResult.count || 0,
    totalViews
  };
};
