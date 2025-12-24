-- 创建增加浏览量的RPC函数
CREATE OR REPLACE FUNCTION increment_view_count(report_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE reports
  SET view_count = view_count + 1
  WHERE id = report_id;
END;
$$;

-- 创建增加下载量的RPC函数
CREATE OR REPLACE FUNCTION increment_download_count(report_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE reports
  SET download_count = download_count + 1
  WHERE id = report_id;
END;
$$;