import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatistics } from '@/db/api';
import type { Statistics } from '@/types';
import { FileText, Download, Users, Eye, TrendingUp } from 'lucide-react';

export default function AdminStatistics() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatistics();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: '研报总数',
      value: stats?.totalReports || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: '总下载量',
      value: stats?.totalDownloads || 0,
      icon: Download,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: '用户总数',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: '总浏览量',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">统计分析</h1>
        <p className="text-muted-foreground mt-2">平台数据统计概览</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-muted" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-24 bg-muted" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`h-10 w-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value.toLocaleString()}</div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              平台增长
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">平均每个研报浏览量</span>
                <span className="text-lg font-semibold">
                  {stats && stats.totalReports > 0
                    ? Math.round(stats.totalViews / stats.totalReports)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">平均每个研报下载量</span>
                <span className="text-lg font-semibold">
                  {stats && stats.totalReports > 0
                    ? Math.round(stats.totalDownloads / stats.totalReports)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">平均每个用户下载量</span>
                <span className="text-lg font-semibold">
                  {stats && stats.totalUsers > 0
                    ? Math.round(stats.totalDownloads / stats.totalUsers)
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>数据说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• 研报总数：平台上传的所有研报数量</p>
              <p>• 总下载量：所有研报的累计下载次数</p>
              <p>• 用户总数：注册用户的总数量</p>
              <p>• 总浏览量：所有研报的累计浏览次数</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
