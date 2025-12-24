import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import routes from './routes';

import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Toaster } from '@/components/ui/toaster';

// Helper component to conditionally render Header and Footer
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';

  if (isAdminRoute || isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

// Recursive route renderer
function renderRoutes(routeConfigs: typeof routes): React.ReactNode {
  return routeConfigs.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {route.children.map((child, childIndex) => (
            <Route key={childIndex} path={child.path} element={child.element} />
          ))}
        </Route>
      );
    }
    return <Route key={index} path={route.path} element={route.element} />;
  });
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <LayoutWrapper>
            <div className="flex flex-col min-h-screen">
              <main className="flex-grow">
                <Routes>
                  {renderRoutes(routes)}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </LayoutWrapper>
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </Router>
  );
};

export default App;
