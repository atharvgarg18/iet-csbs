import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  Home
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
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
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users, adminOnly: true },
    { name: 'Batches', href: '/admin/batches', icon: GraduationCap, adminOnly: true },
    { name: 'Notes', href: '/admin/notes', icon: FileText },
    { name: 'Papers', href: '/admin/papers', icon: BookOpen },
    { name: 'Gallery Categories', href: '/admin/gallery-categories', icon: Image, adminOnly: true },
    { name: 'Gallery Images', href: '/admin/gallery-images', icon: Image },
    { name: 'Notice Categories', href: '/admin/notice-categories', icon: Bell, adminOnly: true },
    { name: 'Notices', href: '/admin/notices', icon: Bell },
  ];

  const filteredNavigation = navigation.filter(item => {
    // Admins can see everything
    if (user?.role === 'admin') return true;
    
    // Editors can only see: Dashboard, Notes, Papers, Gallery Images, Notices
    if (user?.role === 'editor') {
      const allowedPaths = ['/admin', '/admin/notes', '/admin/papers', '/admin/gallery-images', '/admin/notices'];
      return allowedPaths.includes(item.href);
    }
    
    // Viewers can only see Dashboard
    if (user?.role === 'viewer') {
      return item.href === '/admin';
    }
    
    return false;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
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
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </Button>
        </div>

        <nav className="mt-6 flex-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-white">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600 mb-2">Logged in as:</div>
              <div className="font-medium text-gray-900">{user.full_name}</div>
              <div className="text-sm text-gray-500 truncate">{user.email}</div>
              <div className="text-xs text-blue-600 mt-1 font-semibold">{user.role.toUpperCase()}</div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full mt-3 text-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
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
            {navigation.find(item => item.href === location.pathname)?.name || 'Admin'}
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