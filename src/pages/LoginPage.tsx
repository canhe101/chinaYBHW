import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '', confirmPassword: '' });
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 验证用户名格式
      if (!/^[a-zA-Z0-9_]+$/.test(loginForm.username)) {
        toast({
          title: '登录失败',
          description: '用户名只能包含字母、数字和下划线',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await signIn(loginForm.username, loginForm.password);

      if (error) {
        toast({
          title: '登录失败',
          description: error.message || '用户名或密码错误',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '登录成功',
          description: '欢迎回来！',
        });
        navigate(from, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 验证用户名格式
      if (!/^[a-zA-Z0-9_]+$/.test(registerForm.username)) {
        toast({
          title: '注册失败',
          description: '用户名只能包含字母、数字和下划线',
          variant: 'destructive',
        });
        return;
      }

      if (registerForm.password !== registerForm.confirmPassword) {
        toast({
          title: '注册失败',
          description: '两次输入的密码不一致',
          variant: 'destructive',
        });
        return;
      }

      if (registerForm.password.length < 6) {
        toast({
          title: '注册失败',
          description: '密码长度至少为6位',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await signUp(registerForm.username, registerForm.password);

      if (error) {
        toast({
          title: '注册失败',
          description: error.message || '注册失败，请稍后重试',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '注册成功',
          description: '欢迎加入 ChinaResearchHub！',
        });
        navigate(from, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">ChinaResearchHub</span>
          </Link>
          <p className="text-muted-foreground">中国研报下载平台</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>登录账号</CardTitle>
                <CardDescription>输入您的用户名和密码登录</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">用户名</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="请输入用户名"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="请输入密码"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '登录中...' : '登录'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>注册账号</CardTitle>
                <CardDescription>创建一个新账号开始使用</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">用户名</Label>
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="字母、数字、下划线"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">密码</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="至少6位"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">确认密码</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="再次输入密码"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '注册中...' : '注册'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
