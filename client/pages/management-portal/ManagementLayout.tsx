import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COLORS, COMPONENTS, ROLE_COLORS } from '@/lib/management-design-system';
import { 
  LayoutDashboard,
  Users, 
  GraduationCap, 
  FileText, 
  BookOpen, 
  Image, 
  Bell, 
  LogOut,
  Menu,
  X,
  Settings,
  FolderOpen,
  ChevronLeft,
  User,
  Shield,
  Clock,
  Home
} from 'lucide-react';

export default function ManagementLayout() {
  const { user, logout, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/management-portal/login');
      return;
    }

    if (!loading && user && !['admin', 'editor', 'viewer'].includes(user.role)) {
      navigate('/');
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.neutral[50] }}
      >
        <div className="text-center space-y-4">
          <div 
            className="w-12 h-12 rounded-full animate-spin mx-auto border-4 border-t-transparent"
            style={{ 
              borderColor: COLORS.neutral[300],
              borderTopColor: COLORS.primary[600]
            }}
          />
          <p style={{ color: COLORS.neutral[600] }}>Loading management portal...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/management-portal',
      icon: LayoutDashboard,
      active: location.pathname === '/management-portal',
    },
    {
      name: 'Users',
      href: '/management-portal/users',
      icon: Users,
      active: location.pathname === '/management-portal/users',
      adminOnly: true,
    },
    {
      name: 'Batches',
      href: '/management-portal/batches',
      icon: GraduationCap,
      active: location.pathname === '/management-portal/batches',
      adminOnly: true,
    },
    {
      name: 'Sections',
      href: '/management-portal/sections',
      icon: FolderOpen,
      active: location.pathname === '/management-portal/sections',
      adminOnly: true,
    },
    {
      name: 'Notes',
      href: '/management-portal/notes',
      icon: FileText,
      active: location.pathname === '/management-portal/notes',
    },
    {
      name: 'Papers',
      href: '/management-portal/papers',
      icon: BookOpen,
      active: location.pathname === '/management-portal/papers',
    },
    {
      name: 'Notices',
      href: '/management-portal/notices',
      icon: Bell,
      active: location.pathname === '/management-portal/notices',
    },
    {
      name: 'Gallery Categories',
      href: '/management-portal/gallery-categories',
      icon: FolderOpen,
      active: location.pathname === '/management-portal/gallery-categories',
      adminOnly: true,
    },
    {
      name: 'Gallery Images',
      href: '/management-portal/gallery-images',
      icon: Image,
      active: location.pathname === '/management-portal/gallery-images',
    },
    {
      name: 'Notice Categories',
      href: '/management-portal/notice-categories',
      icon: Settings,
      active: location.pathname === '/management-portal/notice-categories',
      adminOnly: true,
    },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !item.adminOnly || user.role === 'admin'
  );

  const userRoleConfig = ROLE_COLORS[user.role] || ROLE_COLORS.viewer;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/management-portal/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.neutral[50] }}>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 z-50 h-full transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
          w-72
        `}
        style={{ backgroundColor: COLORS.neutral[900] }}
      >
        <div className="flex h-full flex-col">
          {/* Logo section */}
          <div 
            className="flex items-center justify-between px-6 py-6 border-b"
            style={{ borderBottomColor: COLORS.neutral[700] }}
          >
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: COLORS.accent[600] }}
                >
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Management</h1>
                  <p style={{ color: COLORS.primary[300], fontSize: '0.75rem' }}>Portal</p>
                </div>
              </div>
            )}
            
            {/* Collapse button - desktop only */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md transition-colors hover:bg-white hover:bg-opacity-10"
              style={{ color: COLORS.primary[300] }}
            >
              <ChevronLeft className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>

            {/* Close button - mobile only */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-white hover:bg-white hover:bg-opacity-10 p-1 rounded"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${item.active 
                      ? 'text-white shadow-md' 
                      : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                    }
                  `}
                  style={item.active ? { backgroundColor: COLORS.accent[600] } : {}}
                >
                  <Icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div 
            className="px-4 py-6 border-t"
            style={{ borderTopColor: COLORS.primary[700] }}
          >
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: userRoleConfig.background }}
              >
                <User className="h-5 w-5" style={{ color: userRoleConfig.text }} />
              </div>
              
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.full_name}
                  </p>
                  <div className="flex items-center mt-1">
                    <Badge 
                      className="text-xs capitalize px-2 py-1 border"
                      style={{
                        backgroundColor: userRoleConfig.background,
                        color: userRoleConfig.text,
                        borderColor: userRoleConfig.border
                      }}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="w-full mt-4 text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top header */}
        <header 
          className="sticky top-0 z-30 px-6 py-4 border-b backdrop-blur-sm"
          style={{ 
            backgroundColor: `${COLORS.neutral[50]}f5`,
            borderBottomColor: COLORS.neutral[200]
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                style={{ color: COLORS.neutral[600] }}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
                <span style={{ color: COLORS.neutral[400] }}>/</span>
                <span 
                  className="text-sm font-medium capitalize"
                  style={{ color: COLORS.neutral[700] }}
                >
                  {location.pathname.split('/').pop() || 'dashboard'}
                </span>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
                <span style={{ color: COLORS.neutral[600] }}>
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}