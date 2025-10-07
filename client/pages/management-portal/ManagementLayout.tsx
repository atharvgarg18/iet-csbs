import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Settings2,
  FolderOpen,
  ChevronRight,
  Sparkles,
  Crown,
  Zap
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

    if (!loading && user && !['admin', 'editor', 'viewer'].includes(user.role)) {
      navigate('/');
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-purple-200/30 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Initializing Portal</h3>
          <p className="text-purple-200">Preparing your management experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/management-portal', 
      icon: LayoutDashboard, 
      roles: ['admin', 'editor', 'viewer'],
      description: 'Overview & Analytics',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Batches', 
      href: '/management-portal/batches', 
      icon: GraduationCap, 
      roles: ['admin'],
      description: 'Academic Batches',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      name: 'Sections', 
      href: '/management-portal/sections', 
      icon: FolderOpen, 
      roles: ['admin'],
      description: 'Class Sections',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      name: 'Notes', 
      href: '/management-portal/notes', 
      icon: BookOpen, 
      roles: ['admin', 'editor'],
      description: 'Study Materials',
      gradient: 'from-violet-500 to-purple-500'
    },
    { 
      name: 'Papers', 
      href: '/management-portal/papers', 
      icon: FileText, 
      roles: ['admin', 'editor'],
      description: 'Question Papers',
      gradient: 'from-indigo-500 to-blue-500'
    },
    { 
      name: 'Gallery', 
      href: '/management-portal/gallery-images', 
      icon: Image, 
      roles: ['admin', 'editor'],
      description: 'Image Gallery',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      name: 'Notices', 
      href: '/management-portal/notices', 
      icon: Bell, 
      roles: ['admin', 'editor'],
      description: 'Announcements',
      gradient: 'from-yellow-500 to-orange-500'
    },
    { 
      name: 'Users', 
      href: '/management-portal/users', 
      icon: Users, 
      roles: ['admin'],
      description: 'User Management',
      gradient: 'from-slate-500 to-gray-500'
    },
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/management-portal/login');
    }
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin': return {
        gradient: 'from-red-500 to-pink-500',
        icon: Crown,
        bgClass: 'bg-gradient-to-br from-red-50 to-pink-50',
        textClass: 'text-red-700'
      };
      case 'editor': return {
        gradient: 'from-blue-500 to-cyan-500',
        icon: Zap,
        bgClass: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        textClass: 'text-blue-700'
      };
      case 'viewer': return {
        gradient: 'from-green-500 to-emerald-500',
        icon: Settings2,
        bgClass: 'bg-gradient-to-br from-green-50 to-emerald-50',
        textClass: 'text-green-700'
      };
      default: return {
        gradient: 'from-gray-500 to-slate-500',
        icon: Settings2,
        bgClass: 'bg-gradient-to-br from-gray-50 to-slate-50',
        textClass: 'text-gray-700'
      };
    }
  };

  const getCurrentPageName = () => {
    const currentItem = filteredNavigation.find(item => item.href === location.pathname);
    return currentItem?.name || 'Portal';
  };

  const roleConfig = getRoleConfig(user.role);
  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-slate-200/50 transform transition-all duration-500 ease-out lg:translate-x-0 lg:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="relative h-24 px-6 flex items-center bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
          <div className="relative flex items-center gap-4 z-10">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-xl">
                <Settings2 className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Management</h1>
              <p className="text-purple-200 text-sm font-medium">Control Center</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden ml-auto relative z-10 text-white hover:bg-white/10 rounded-xl"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center gap-4">
            <div className={`relative w-14 h-14 bg-gradient-to-br ${roleConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-lg">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                <RoleIcon className="h-3 w-3 text-slate-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate text-lg">
                {user.full_name}
              </p>
              <p className="text-sm text-slate-500 truncate mb-1">
                {user.email}
              </p>
              <Badge className={`${roleConfig.bgClass} ${roleConfig.textClass} border-0 shadow-sm font-medium`}>
                {user.role.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl shadow-purple-500/25 scale-105` 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:scale-102'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20 shadow-lg' 
                    : 'bg-slate-100 group-hover:bg-white group-hover:shadow-md'
                }`}>
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className={`text-xs mt-0.5 ${
                    isActive ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
                
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-white/80 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200/50">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-xl py-3"
            onClick={handleLogout}
          >
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-red-100 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-semibold">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-18 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
          <div className="flex items-center px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-4 text-slate-600 hover:bg-slate-100 rounded-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Settings2 className="h-4 w-4" />
                <span>Management</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-900 font-semibold">{getCurrentPageName()}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{getCurrentPageName()}</h1>
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user.full_name}</p>
                <p className={`text-xs font-medium ${roleConfig.textClass}`}>{user.role.toUpperCase()}</p>
              </div>
              <div className={`relative w-12 h-12 bg-gradient-to-br ${roleConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer`}>
                <span className="text-white font-bold">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                  <RoleIcon className="h-2.5 w-2.5 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}