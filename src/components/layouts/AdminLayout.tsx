import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Users,
  Home,
  Menu,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';

const sidebarItems = [
  {
    title: '仪表盘',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: '首页管理',
    href: '/admin/homepage',
    icon: Home,
  },
  {
    title: '研报管理',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    title: '分类管理',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: '用户管理',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: '统计分析',
    href: '/admin/statistics',
    icon: BarChart3,
  },
];

function SidebarContent() {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">管理后台</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-accent'
                )}
                asChild
              >
                <Link to={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/">返回前台</Link>
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-muted/40 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-6 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
