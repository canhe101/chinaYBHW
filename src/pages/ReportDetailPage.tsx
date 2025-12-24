import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { getReport, incrementViewCount, incrementDownloadCount, createDownloadLog } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Report } from '@/types';
import { Download, Eye, Clock, ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getReport(id);
        if (data) {
          setReport(data);
          // 增加浏览量
          await incrementViewCount(id);
        } else {
          toast({
            title: 'Error',
            description: 'Report not found',
            variant: 'destructive',
          });
          navigate('/reports');
        }
      } catch (error) {
        console.error('Failed to fetch report:', error);
        toast({
          title: 'Error',
          description: 'Failed to load report',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate, toast]);

  const handleDownload = async () => {
    if (!report) return;

    try {
      // 记录下载
      if (user) {
        await createDownloadLog(report.id);
      }
      await incrementDownloadCount(report.id);
      
      // 打开PDF链接
      window.open(report.pdf_url, '_blank');
      
      toast({
        title: 'Download Successful',
        description: '研报已Open in New Window',
      });
      
      // 更新本地下载计数
      setReport({ ...report, download_count: report.download_count + 1 });
    } catch (error) {
      console.error('Failed to download:', error);
      toast({
        title: 'Download Failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8 bg-muted" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-full mb-4 bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full bg-muted" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <CardTitle className="text-2xl xl:text-3xl">{report.title}</CardTitle>
              {report.category && (
                <Badge variant="secondary" className="shrink-0">
                  {report.category.name}
                </Badge>
              )}
            </div>
            <CardDescription className="text-base">
              {report.description || '暂无描述'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metadata */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">发布时间</p>
                  <p className="font-medium">
                    {report.published_at 
                      ? format(new Date(report.published_at), 'yyyy-MM-dd', { locale: zhCN })
                      : format(new Date(report.created_at), 'yyyy-MM-dd', { locale: zhCN })
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">浏览量</p>
                  <p className="font-medium">{report.view_count}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">下载量</p>
                  <p className="font-medium">{report.download_count}</p>
                </div>
              </div>
              {report.source && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Source</p>
                    <p className="font-medium">{report.source}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* PDF Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-4">PDF Preview</h3>
              <div className="aspect-[3/4] w-full border rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={`${report.pdf_url}#toolbar=0`}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col xl:flex-row gap-4">
              <Button size="lg" className="flex-1" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button size="lg" variant="outline" className="flex-1" asChild>
                <a href={report.pdf_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Window
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
