import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  Users, 
  GraduationCap, 
  FileText, 
  BookOpen, 
  Image, 
  Bell,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Crown,
  Zap,
  Eye,
  Plus,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  batches: number;
  sections: number;
  notes: number;
  papers: number;
  gallery_images: number;
  notices: number;
  users: number;
  user_stats?: {
    active_users: number;
    admin_count: number;
    editor_count: number;
    viewer_count: number;
  };
}

export default function ManagementDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch data from multiple endpoints to build dashboard stats
      const [
        usersResponse,
        notesResponse,
        papersResponse,
        noticesResponse,
        batchesResponse,
        sectionsResponse,
        galleryResponse
      ] = await Promise.all([
        fetch('/.netlify/functions/api/admin/users', { method: 'GET', credentials: 'include' }).catch(() => null),
        fetch('/.netlify/functions/api/admin/notes', { method: 'GET', credentials: 'include' }).catch(() => null),
        fetch('/.netlify/functions/api/admin/papers', { method: 'GET', credentials: 'include' }).catch(() => null),
        fetch('/.netlify/functions/api/admin/notices', { method: 'GET', credentials: 'include' }).catch(() => null),
        fetch('/.netlify/functions/api/admin/batches', { method: 'GET', credentials: 'include' }).catch(() => null),
        fetch('/.netlify/functions/api/admin/sections', { method: 'GET', credentials: 'include' }).catch(() => null),
        fetch('/.netlify/functions/api/admin/gallery-images', { method: 'GET', credentials: 'include' }).catch(() => null)
      ]);

      // Parse responses safely and handle API response format
      const usersResult = usersResponse?.ok ? await usersResponse.json().catch(() => ({})) : {};
      const notesResult = notesResponse?.ok ? await notesResponse.json().catch(() => ({})) : {};
      const papersResult = papersResponse?.ok ? await papersResponse.json().catch(() => ({})) : {};
      const noticesResult = noticesResponse?.ok ? await noticesResponse.json().catch(() => ({})) : {};
      const batchesResult = batchesResponse?.ok ? await batchesResponse.json().catch(() => ({})) : {};
      const sectionsResult = sectionsResponse?.ok ? await sectionsResponse.json().catch(() => ({})) : {};
      const galleryResult = galleryResponse?.ok ? await galleryResponse.json().catch(() => ({})) : {};

      // Extract data from API response format {success: true, data: [...]}
      const users = usersResult.success ? usersResult.data : usersResult;
      const notes = notesResult.success ? notesResult.data : notesResult;
      const papers = papersResult.success ? papersResult.data : papersResult;
      const notices = noticesResult.success ? noticesResult.data : noticesResult;
      const batches = batchesResult.success ? batchesResult.data : batchesResult;
      const sections = sectionsResult.success ? sectionsResult.data : sectionsResult;
      const gallery = galleryResult.success ? galleryResult.data : galleryResult;

      // Build stats object matching expected format
      setStats({
        users: Array.isArray(users) ? users.length : 0,
        notes: Array.isArray(notes) ? notes.length : 0,
        papers: Array.isArray(papers) ? papers.length : 0,
        notices: Array.isArray(notices) ? notices.length : 0,
        batches: Array.isArray(batches) ? batches.length : 0,
        sections: Array.isArray(sections) ? sections.length : 0,
        gallery_images: Array.isArray(gallery) ? gallery.length : 0,
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
      // Set fallback stats to prevent blank page
      setStats({
        batches: 0,
        sections: 0,
        notes: 0,
        papers: 0,
        gallery_images: 0,
        notices: 0,
        users: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin': return Crown;
      case 'editor': return Zap;
      case 'viewer': return Eye;
      default: return Users;
    }
  };

  const getRoleGradient = () => {
    switch (user?.role) {
      case 'admin': return 'from-red-500 to-pink-500';
      case 'editor': return 'from-blue-500 to-cyan-500';
      case 'viewer': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const statCards = [
    {
      title: 'Notes',
      value: stats?.notes || 0,
      icon: BookOpen,
      gradient: 'from-violet-500 to-purple-500',
      href: '/management-portal/notes',
      roles: ['admin', 'editor', 'viewer']
    },
    {
      title: 'Papers',
      value: stats?.papers || 0,
      icon: FileText,
      gradient: 'from-indigo-500 to-blue-500',
      href: '/management-portal/papers',
      roles: ['admin', 'editor', 'viewer']
    },
    {
      title: 'Gallery',
      value: stats?.gallery_images || 0,
      icon: Image,
      gradient: 'from-pink-500 to-rose-500',
      href: '/management-portal/gallery-images',
      roles: ['admin', 'editor', 'viewer']
    },
    {
      title: 'Notices',
      value: stats?.notices || 0,
      icon: Bell,
      gradient: 'from-yellow-500 to-orange-500',
      href: '/management-portal/notices',
      roles: ['admin', 'editor', 'viewer']
    },
    {
      title: 'Batches',
      value: stats?.batches || 0,
      icon: GraduationCap,
      gradient: 'from-emerald-500 to-teal-500',
      href: '/management-portal/batches',
      roles: ['admin']
    },
    {
      title: 'Users',
      value: stats?.users || 0,
      icon: Users,
      gradient: 'from-slate-500 to-gray-500',
      href: '/management-portal/users',
      roles: ['admin']
    }
  ];

  const visibleStats = statCards.filter(card => 
    card.roles.includes(user?.role || '')
  );

  const quickActions = [
    {
      title: 'Add Notes',
      description: 'Upload study materials',
      icon: Plus,
      href: '/management-portal/notes',
      gradient: 'from-violet-500 to-purple-500',
      roles: ['admin', 'editor']
    },
    {
      title: 'Post Notice',
      description: 'Create announcements',
      icon: Plus,
      href: '/management-portal/notices',
      gradient: 'from-yellow-500 to-orange-500',
      roles: ['admin', 'editor']
    },
    {
      title: 'Manage Users',
      description: 'User permissions',
      icon: Users,
      href: '/management-portal/users',
      gradient: 'from-slate-500 to-gray-500',
      roles: ['admin']
    },
    {
      title: 'Manage Batches',
      description: 'Academic batches',
      icon: GraduationCap,
      href: '/management-portal/batches',
      gradient: 'from-emerald-500 to-teal-500',
      roles: ['admin']
    }
  ];

  const visibleActions = quickActions.filter(action => 
    action.roles.includes(user?.role || '')
  );

  const RoleIcon = getRoleIcon();

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Dashboard</h3>
          <p className="text-slate-500">Fetching your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 bg-gradient-to-br ${getRoleGradient()} rounded-2xl flex items-center justify-center`}>
                <RoleIcon className="h-5 w-5 text-white" />
              </div>
              <div className="text-purple-200 text-sm font-medium uppercase tracking-wider">
                {user?.role} Dashboard
              </div>
            </div>
            <h1 className="text-3xl font-black mb-2">
              Welcome back, {user?.full_name?.split(' ')[0]}!
            </h1>
            <p className="text-purple-200 text-lg">
              Your management portal is ready. Let's get things done.
            </p>
          </div>
          <div className="hidden md:block">
            <Sparkles className="h-20 w-20 text-purple-300 opacity-50" />
          </div>
        </div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-bold mb-1">Connection Issue</h3>
              <p className="text-red-600">{error}</p>
            </div>
            <Button
              onClick={fetchStats}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.href}>
              <Card className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:scale-105 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-2 bg-gradient-to-r ${stat.gradient}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-black text-slate-900">
                          {stat.value.toLocaleString()}
                        </p>
                      </div>
                      <div className={`relative p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                        <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-slate-400 group-hover:text-slate-600 transition-colors">
                      <span className="text-sm font-medium">View Details</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* User Stats for Admin */}
      {user?.role === 'admin' && stats?.user_stats && (
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-2 bg-gradient-to-r from-slate-500 to-gray-500"></div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-500 rounded-2xl">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">User Analytics</h3>
                  <p className="text-slate-500">Platform user distribution</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-black text-green-600 mb-1">
                    {stats.user_stats.active_users}
                  </p>
                  <p className="text-sm font-bold text-green-700">Active Users</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-black text-red-600 mb-1">
                    {stats.user_stats.admin_count}
                  </p>
                  <p className="text-sm font-bold text-red-700">Admins</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-black text-blue-600 mb-1">
                    {stats.user_stats.editor_count}
                  </p>
                  <p className="text-sm font-bold text-blue-700">Editors</p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-black text-slate-600 mb-1">
                    {stats.user_stats.viewer_count}
                  </p>
                  <p className="text-sm font-bold text-slate-700">Viewers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Quick Actions</h3>
                <p className="text-slate-500">Jump to your most used features</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibleActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} to={action.href}>
                    <div className="group p-6 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-black text-slate-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-slate-500 mb-3">{action.description}</p>
                      <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <span className="text-xs font-bold uppercase tracking-wide">Open</span>
                        <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}