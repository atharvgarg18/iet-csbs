import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Settings,
  Folder,
  FolderOpen
} from 'lucide-react';

export default function ManagementLayout() {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/management-portal/login');
      return;
    }

    // Check if user has management access
    if (!loading && user && !['admin', 'editor', 'viewer'].includes(user.role)) {
      navigate('/');
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading management portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Define navigation based on database schema and user roles
  const navigationItems = [
    { name: 'Dashboard', href: '/management-portal', icon: Home, roles: ['admin', 'editor', 'viewer'] },
    { name: 'Batches', href: '/management-portal/batches', icon: GraduationCap, roles: ['admin'] },
    { name: 'Sections', href: '/management-portal/sections', icon: FolderOpen, roles: ['admin'] },
    { name: 'Notes', href: '/management-portal/notes', icon: BookOpen, roles: ['admin', 'editor'] },
    { name: 'Papers', href: '/management-portal/papers', icon: FileText, roles: ['admin', 'editor'] },
    { name: 'Gallery Categories', href: '/management-portal/gallery-categories', icon: Folder, roles: ['admin'] },
    { name: 'Gallery Images', href: '/management-portal/gallery-images', icon: Image, roles: ['admin', 'editor'] },  
    { name: 'Notice Categories', href: '/management-portal/notice-categories', icon: Folder, roles: ['admin'] },
    { name: 'Notices', href: '/management-portal/notices', icon: Bell, roles: ['admin', 'editor'] },
    { name: 'Users', href: '/management-portal/users', icon: Users, roles: ['admin'] },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/management-portal/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/management-portal/login');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'editor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-blue-600">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-white" />
            <h1 className="text-lg font-semibold text-white">Management Portal</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-blue-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
            <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start text-gray-700 hover:text-red-600 hover:border-red-200"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredNavigation.find(item => item.href === location.pathname)?.name || 'Management Portal'}
            </h2>
          </div>

          {/* User indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{user.full_name}</span>
            <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
              {user.role}
            </Badge>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}