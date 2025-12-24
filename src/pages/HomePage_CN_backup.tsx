import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getHomepageConfig, getReports } from '@/db/api';
import type { HomepageConfig, Report } from '@/types';
import { FileText, TrendingUp, Clock, Download, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function HomePage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [latestReports, setLatestReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configData, reportsData] = await Promise.all([
          getHomepageConfig(),
          getReports({ page: 1, pageSize: 6, sortBy: 'created_at', sortOrder: 'desc' })
        ]);
        setConfig(configData);
        setLatestReports(reportsData.reports);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 xl:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl xl:text-6xl font-bold tracking-tight">
              <span className="gradient-text">中国研报下载平台</span>
            </h1>
            <p className="text-lg xl:text-xl text-muted-foreground max-w-2xl mx-auto">
              {config?.mission || '为全球用户提供最新、最全面的中国研究报告和市场分析资料'}
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link to="/reports">
                  浏览研报
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">立即注册</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 xl:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4">平台特色</h2>
            <p className="text-muted-foreground">专业、权威、及时的研报服务</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-lg bg-muted" />
                    <Skeleton className="h-6 w-32 bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>权威来源</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      汇集国内外知名研究机构的权威报告
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>实时更新</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      每日更新最新研报，把握市场动态
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>专业分类</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      按行业、主题精细分类，快速找到所需
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>便捷下载</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      一键下载，支持在线预览和离线阅读
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Latest Reports Section */}
      <section className="py-16 xl:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">最新发布</h2>
              <p className="text-muted-foreground">最新上传的研究报告</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/reports">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-full mb-2 bg-muted" />
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))
            ) : (
              latestReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg line-clamp-2">{report.title}</CardTitle>
                      {report.category && (
                        <Badge variant="secondary" className="shrink-0">
                          {report.category.name}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {report.description || '暂无描述'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(report.created_at), 'yyyy-MM-dd', { locale: zhCN })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {report.download_count}
                      </span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link to={`/reports/${report.id}`}>查看详情</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xl:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl xl:text-4xl font-bold mb-4">开始探索中国市场</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            立即注册，获取最新的中国经济报告和市场分析资料
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/login">免费注册</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
