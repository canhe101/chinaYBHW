import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserDownloadLogs } from '@/db/api';
import type { DownloadLog } from '@/types';
import { User, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { profile } = useAuth();
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloadLogs = async () => {
      if (!profile) return;
      
      setLoading(true);
      try {
        const { logs } = await getUserDownloadLogs(profile.id, 1, 10);
        setDownloadLogs(logs);
      } catch (error) {
        console.error('Failed to fetch download logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloadLogs();
  }, [profile]);

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <h1 className="text-3xl xl:text-4xl font-bold mb-8">Profile</h1>

        <div className="grid gap-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">用户名</p>
                  <p className="font-medium">{profile.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role === 'admin' ? 'Administrator' : 'User'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Registration Date</p>
                  <p className="font-medium">
                    {format(new Date(profile.created_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download History
              </CardTitle>
              <CardDescription>最近10条Download History</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full bg-muted" />
                  ))}
                </div>
              ) : downloadLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>暂无Download History</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link to="/reports">Browse Reports</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {downloadLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">
                          {log.report?.title || 'Unknown Report'}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(log.downloaded_at), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                          </span>
                        </div>
                      </div>
                      {log.report && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/reports/${log.report_id}`}>View</Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
