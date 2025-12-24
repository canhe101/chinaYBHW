import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getStatistics } from '@/db/api';
import type { Statistics } from '@/types';
import { FileText, Download, Users, Eye } from 'lucide-react';

export default function AdminDashboard() {
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
    },
    {
      title: '总下载量',
      value: stats?.totalDownloads || 0,
      icon: Download,
      color: 'text-green-600',
    },
    {
      title: '用户总数',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: '总浏览量',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'text-orange-600',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>欢迎使用管理后台</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            这里是 ChinaResearchHub 的管理后台。您可以在这里管理研报、分类、用户等内容。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
