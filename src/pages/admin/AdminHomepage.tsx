import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getHomepageConfig, updateHomepageConfig } from '@/db/api';
import type { HomepageConfig } from '@/types';
import { Save } from 'lucide-react';

export default function AdminHomepage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getHomepageConfig();
        setConfig(data);
      } catch (error) {
        console.error('Failed to fetch config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      await updateHomepageConfig(config.id, {
        mission: config.mission,
        features: config.features,
        advantages: config.advantages,
      });
      toast({
        title: '保存成功',
        description: '首页配置已更新',
      });
    } catch (error) {
      console.error('Failed to save config:', error);
      toast({
        title: '保存失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">首页管理</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? '保存中...' : '保存更改'}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>网站使命</CardTitle>
            <CardDescription>首页展示的网站使命描述</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config.mission || ''}
              onChange={(e) => setConfig({ ...config, mission: e.target.value })}
              rows={3}
              placeholder="输入网站使命..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>平台特色</CardTitle>
            <CardDescription>首页展示的平台特色（每行一个）</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config.features?.join('\n') || ''}
              onChange={(e) => setConfig({ ...config, features: e.target.value.split('\n').filter(Boolean) })}
              rows={5}
              placeholder="权威来源&#10;实时更新&#10;专业分类&#10;便捷下载"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>平台优势</CardTitle>
            <CardDescription>首页展示的平台优势（每行一个）</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config.advantages?.join('\n') || ''}
              onChange={(e) => setConfig({ ...config, advantages: e.target.value.split('\n').filter(Boolean) })}
              rows={5}
              placeholder="覆盖全行业&#10;数据准确&#10;更新及时&#10;免费访问"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
