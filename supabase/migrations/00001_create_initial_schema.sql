-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 创建用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建分类表
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建研报表
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  pdf_url TEXT NOT NULL,
  source TEXT,
  published_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建下载记录表
CREATE TABLE download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建首页配置表
CREATE TABLE homepage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission TEXT,
  features JSONB,
  advantages JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_reports_category ON reports(category_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_published_at ON reports(published_at DESC);
CREATE INDEX idx_download_logs_report ON download_logs(report_id);
CREATE INDEX idx_download_logs_user ON download_logs(user_id);
CREATE INDEX idx_download_logs_downloaded_at ON download_logs(downloaded_at DESC);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加更新时间触发器
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建用户同步函数
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- 从email中提取用户名（去掉@miaoda.com）
  extracted_username := SPLIT_PART(NEW.email, '@', 1);
  
  -- 插入用户资料
  INSERT INTO profiles (id, username, email, role)
  VALUES (
    NEW.id,
    extracted_username,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  RETURN NEW;
END;
$$;

-- 创建用户确认触发器
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- 创建管理员检查函数
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- 启用RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;

-- Profiles 权限策略
CREATE POLICY "管理员可以完全访问profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "用户可以查看自己的profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的profile（除了role）" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- 创建公开的profiles视图
CREATE VIEW public_profiles AS
  SELECT id, username, role FROM profiles;

-- Categories 权限策略
CREATE POLICY "所有人可以查看分类" ON categories
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理分类" ON categories
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Reports 权限策略
CREATE POLICY "所有人可以查看研报" ON reports
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理研报" ON reports
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Download logs 权限策略
CREATE POLICY "用户可以查看自己的下载记录" ON download_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建下载记录" ON download_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "管理员可以查看所有下载记录" ON download_logs
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- Homepage config 权限策略
CREATE POLICY "所有人可以查看首页配置" ON homepage_config
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "管理员可以管理首页配置" ON homepage_config
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- 插入默认首页配置
INSERT INTO homepage_config (mission, features, advantages) VALUES (
  '为全球用户提供最新、最全面的中国研究报告和市场分析资料',
  '["权威来源", "实时更新", "专业分类", "便捷下载"]'::jsonb,
  '["覆盖全行业", "数据准确", "更新及时", "免费访问"]'::jsonb
);

-- 插入默认分类
INSERT INTO categories (name, description) VALUES
  ('经济报告', '中国宏观经济分析与预测报告'),
  ('行业研究', '各行业深度研究与市场分析'),
  ('市场分析', '股票、债券、期货等市场分析报告'),
  ('政策解读', '政府政策解读与影响分析'),
  ('企业研究', '上市公司及重点企业研究报告');