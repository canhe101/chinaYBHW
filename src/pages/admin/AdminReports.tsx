import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getReports, getCategories, createReport, updateReport, deleteReport, deleteReportsBatch, createReportsBatch } from '@/db/api';
import type { Report, Category } from '@/types';
import { Plus, Pencil, Trash2, Upload, Download } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import * as XLSX from 'xlsx';

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [deletingReport, setDeletingReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    pdf_url: '',
    source: '',
    published_at: '',
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [reportsData, categoriesData] = await Promise.all([
        getReports({ page: 1, pageSize: 100, sortBy: 'created_at', sortOrder: 'desc' }),
        getCategories()
      ]);
      setReports(reportsData.reports);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await createReport({
        ...formData,
        category_id: formData.category_id || undefined,
        published_at: formData.published_at || undefined,
      });
      toast({
        title: '创建成功',
        description: '研报已创建',
      });
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to create report:', error);
      toast({
        title: '创建失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingReport) return;

    try {
      await updateReport(editingReport.id, {
        ...formData,
        category_id: formData.category_id || null,
        published_at: formData.published_at || null,
      });
      toast({
        title: '更新成功',
        description: '研报已更新',
      });
      setDialogOpen(false);
      setEditingReport(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to update report:', error);
      toast({
        title: '更新失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingReport) return;

    try {
      await deleteReport(deletingReport.id);
      toast({
        title: '删除成功',
        description: '研报已删除',
      });
      setDeletingReport(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast({
        title: '删除失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedReports.size === 0) return;

    try {
      await deleteReportsBatch(Array.from(selectedReports));
      toast({
        title: '批量删除成功',
        description: `已删除 ${selectedReports.size} 个研报`,
      });
      setSelectedReports(new Set());
      fetchData();
    } catch (error) {
      console.error('Failed to batch delete:', error);
      toast({
        title: '批量删除失败',
        description: '请稍后重试',
        variant: 'destructive',
      });
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const reportsToImport = jsonData.map((row) => ({
        title: row['标题'] || row['title'] || '',
        description: row['简介'] || row['description'] || '',
        pdf_url: row['下载链接'] || row['pdf_url'] || '',
        source: row['来源'] || row['source'] || '',
        published_at: row['发布时间'] || row['published_at'] || '',
        category_id: undefined,
      })).filter(r => r.title && r.pdf_url);

      if (reportsToImport.length === 0) {
        toast({
          title: '导入失败',
          description: 'Excel文件中没有有效数据',
          variant: 'destructive',
        });
        return;
      }

      await createReportsBatch(reportsToImport);
      toast({
        title: '导入成功',
        description: `已导入 ${reportsToImport.length} 个研报`,
      });
      setImportDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to import Excel:', error);
      toast({
        title: '导入失败',
        description: '请检查Excel文件格式',
        variant: 'destructive',
      });
    }

    e.target.value = '';
  };

  const downloadTemplate = () => {
    const template = [
      { 标题: '示例研报标题', 简介: '研报简介描述', 下载链接: 'https://example.com/report.pdf', 来源: '研究机构', 发布时间: '2025-01-01' }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '研报模板');
    XLSX.writeFile(wb, '研报导入模板.xlsx');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      pdf_url: '',
      source: '',
      published_at: '',
    });
  };

  const openEditDialog = (report: Report) => {
    setEditingReport(report);
    setFormData({
      title: report.title,
      description: report.description || '',
      category_id: report.category_id || '',
      pdf_url: report.pdf_url,
      source: report.source || '',
      published_at: report.published_at ? format(new Date(report.published_at), 'yyyy-MM-dd') : '',
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingReport(null);
    resetForm();
    setDialogOpen(true);
  };

  const toggleReportSelection = (reportId: string) => {
    const newSelection = new Set(selectedReports);
    if (newSelection.has(reportId)) {
      newSelection.delete(reportId);
    } else {
      newSelection.add(reportId);
    }
    setSelectedReports(newSelection);
  };

  const toggleAllReports = () => {
    if (selectedReports.size === reports.length) {
      setSelectedReports(new Set());
    } else {
      setSelectedReports(new Set(reports.map(r => r.id)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">研报管理</h1>
        <div className="flex gap-2">
          {selectedReports.size > 0 && (
            <Button variant="destructive" onClick={handleBatchDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              批量删除 ({selectedReports.size})
            </Button>
          )}
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Excel导入
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            新增研报
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>研报列表</CardTitle>
          <CardDescription>管理所有研报</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>加载中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedReports.size === reports.length && reports.length > 0}
                      onCheckedChange={toggleAllReports}
                    />
                  </TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>浏览量</TableHead>
                  <TableHead>下载量</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedReports.has(report.id)}
                        onCheckedChange={() => toggleReportSelection(report.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-md truncate">{report.title}</TableCell>
                    <TableCell>{report.category?.name || '-'}</TableCell>
                    <TableCell>{report.view_count}</TableCell>
                    <TableCell>{report.download_count}</TableCell>
                    <TableCell>
                      {format(new Date(report.created_at), 'yyyy-MM-dd', { locale: zhCN })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(report)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingReport(report)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReport ? '编辑研报' : '新增研报'}</DialogTitle>
            <DialogDescription>
              {editingReport ? '修改研报信息' : '创建一个新的研报'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">标题 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="输入研报标题"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="输入研报描述"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Select value={formData.category_id || 'none'} onValueChange={(value) => setFormData({ ...formData, category_id: value === 'none' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无分类</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdf_url">PDF下载链接 *</Label>
              <Input
                id="pdf_url"
                value={formData.pdf_url}
                onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                placeholder="https://example.com/report.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">来源</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="研究机构名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="published_at">发布时间</Label>
              <Input
                id="published_at"
                type="date"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={editingReport ? handleUpdate : handleCreate}>
              {editingReport ? '更新' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excel批量导入</DialogTitle>
            <DialogDescription>
              上传Excel文件批量导入研报
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Excel文件格式要求</Label>
              <p className="text-sm text-muted-foreground">
                Excel文件应包含以下列：标题、简介、下载链接、来源、发布时间
              </p>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                下载模板
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excel-file">选择Excel文件</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingReport} onOpenChange={() => setDeletingReport(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除研报 "{deletingReport?.title}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
