import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  BookOpen, 
  Image, 
  Bell, 
  LogOut,
  Menu,
  Home,
  X,
  Settings
} from 'lucide-react';

export default function CMSAdminLayout() {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/cms-admin/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const navigation = [
    { name: 'Dashboard', href: '/cms-admin', icon: Home },
    { name: 'Batches', href: '/cms-admin/batches', icon: GraduationCap, adminOnly: true },
    { name: 'Notes', href: '/cms-admin/notes', icon: FileText },
    { name: 'Papers', href: '/cms-admin/papers', icon: BookOpen },
    { name: 'Gallery Images', href: '/cms-admin/gallery-images', icon: Image },
    { name: 'Gallery Categories', href: '/cms-admin/gallery-categories', icon: Image, adminOnly: true },
    { name: 'Notices', href: '/cms-admin/notices', icon: Bell },
    { name: 'Notice Categories', href: '/cms-admin/notice-categories', icon: Bell, adminOnly: true },
    { name: 'Users', href: '/cms-admin/users', icon: Users, adminOnly: true },
  ];

  const filteredNavigation = navigation.filter(item => {
    // Admins can see everything
    if (user?.role === 'admin') return true;
    
    // Editors can only see: Dashboard, Notes, Papers, Gallery Images, Notices
    if (user?.role === 'editor') {
      const allowedPaths = ['/cms-admin', '/cms-admin/notes', '/cms-admin/papers', '/cms-admin/gallery-images', '/cms-admin/notices'];
      return allowedPaths.includes(item.href);
    }
    
    // Viewers can only see Dashboard
    if (user?.role === 'viewer') {
      return item.href === '/cms-admin';
    }
    
    return false;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/cms-admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">CMS Admin</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredNavigation.find(item => item.href === location.pathname)?.name || 'CMS Admin'}
          </h2>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}