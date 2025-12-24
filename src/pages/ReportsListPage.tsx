import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getReports, getCategories } from '@/db/api';
import type { Report, Category } from '@/types';
import { Search, Clock, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function ReportsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const page = Number.parseInt(searchParams.get('page') || '1');
  const categoryId = searchParams.get('category') || '';
  const sortBy = (searchParams.get('sortBy') || 'created_at') as 'created_at' | 'published_at' | 'view_count' | 'download_count';
  const pageSize = 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsData, categoriesData] = await Promise.all([
          getReports({
            page,
            pageSize,
            categoryId: categoryId || undefined,
            search: searchParams.get('search') || undefined,
            sortBy,
            sortOrder: 'desc'
          }),
          getCategories()
        ]);
        setReports(reportsData.reports);
        setTotal(reportsData.total);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, categoryId, searchParams, sortBy]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', value);
    params.set('page', '1');
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold mb-4">Research Reports</h1>
          <p className="text-muted-foreground">Browse and search the latest research reports</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search report titles or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline">Search</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full xl:w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full xl:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Latest</SelectItem>
                  <SelectItem value="published_at">Published Date</SelectItem>
                  <SelectItem value="view_count">Views</SelectItem>
                  <SelectItem value="download_count">Downloads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            Found {total} reports
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {loading ? (
            Array.from({ length: pageSize }).map((_, i) => (
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
          ) : reports.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No reports available</p>
            </div>
          ) : (
            reports.map((report) => (
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
                  <CardDescription className="line-clamp-3">
                    {report.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(report.created_at), 'yyyy-MM-dd', { locale: zhCN })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {report.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {report.download_count}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link to={`/reports/${report.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (page > 1) {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(page - 1));
                      setSearchParams(params);
                    }
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', String(pageNum));
                        setSearchParams(params);
                      }}
                      isActive={page === pageNum}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (page < totalPages) {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(page + 1));
                      setSearchParams(params);
                    }
                  }}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
