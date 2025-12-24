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
        title: 'CreateSuccessfully',
        description: '研报已Create',
      });
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to create report:', error);
      toast({
        title: 'CreateFailed',
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
        title: 'UpdateSuccessfully',
        description: '研报已Update',
      });
      setDialogOpen(false);
      setEditingReport(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to update report:', error);
      toast({
        title: 'UpdateFailed',
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
        title: 'DeleteSuccessfully',
        description: '研报已Delete',
      });
      setDeletingReport(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast({
        title: 'DeleteFailed',
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
        title: '批量DeleteSuccessfully',
        description: `已Delete ${selectedReports.size} 个研报`,
      });
      setSelectedReports(new Set());
      fetchData();
    } catch (error) {
      console.error('Failed to batch delete:', error);
      toast({
        title: '批量DeleteFailed',
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
        title: row['Title'] || row['title'] || '',
        description: row['Description'] || row['description'] || '',
        pdf_url: row['Download URL'] || row['pdf_url'] || '',
        source: row['Source'] || row['source'] || '',
        published_at: row['Published Date'] || row['published_at'] || '',
        category_id: undefined,
      })).filter(r => r.title && r.pdf_url);

      if (reportsToImport.length === 0) {
        toast({
          title: '导入Failed',
          description: 'No valid data in Excel file',
          variant: 'destructive',
        });
        return;
      }

      await createReportsBatch(reportsToImport);
      toast({
        title: '导入Successfully',
        description: `Imported ${reportsToImport.length} 个研报`,
      });
      setImportDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to import Excel:', error);
      toast({
        title: '导入Failed',
        description: 'Please check Excel file format',
        variant: 'destructive',
      });
    }

    e.target.value = '';
  };

  const downloadTemplate = () => {
    const template = [
      { Title: 'Sample Report Title', Description: 'Report description', 'Download URL': 'https://example.com/report.pdf', Source: 'Research Institution', 'Published Date': '2025-01-01' }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports Template');
    XLSX.writeFile(wb, 'reports_import_template.xlsx');
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
              批量Delete ({selectedReports.size})
            </Button>
          )}
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Excel Import
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add研报
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports List</CardTitle>
          <CardDescription>Manage all reports</CardDescription>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Create时间</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
            <DialogTitle>{editingReport ? 'Edit研报' : 'Add研报'}</DialogTitle>
            <DialogDescription>
              {editingReport ? 'Modify report information' : 'Create一个新的研报'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="输入研报Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter report description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category_id || 'none'} onValueChange={(value) => setFormData({ ...formData, category_id: value === 'none' ? '' : value })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无Category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdf_url">PDF Download URL *</Label>
              <Input
                id="pdf_url"
                value={formData.pdf_url}
                onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                placeholder="https://example.com/report.pdf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="Research institution name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="published_at">Published Date</Label>
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
              Cancel
            </Button>
            <Button onClick={editingReport ? handleUpdate : handleCreate}>
              {editingReport ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excel Batch Import</DialogTitle>
            <DialogDescription>
              Upload Excel file to batch import reports
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Excel file format requirements</Label>
              <p className="text-sm text-muted-foreground">
                Excel file should contain the following columns: Title, Description, Download URL, Source, Published Date
              </p>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excel-file">Select Excel file</Label>
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
            <AlertDialogTitle>确认Delete</AlertDialogTitle>
            <AlertDialogDescription>
              确定要Delete研报 "{deletingReport?.title}" 吗？This action cannot be undone。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
