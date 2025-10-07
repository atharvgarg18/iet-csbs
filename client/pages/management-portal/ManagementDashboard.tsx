import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  BookOpen, 
  Image, 
  Bell, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface DashboardStats {
  batches: number;
  sections: number;
  notes: number;
  papers: number;
  gallery_images: number;
  notices: number;
  users: number;
  recent_activity: Array<{
    type: string;
    description: string;
    timestamp: string;
    user_name: string;
  }>;
  user_stats: {
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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/api/dashboard/stats', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Dashboard stats error:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatsCards = () => {
    if (!stats) return [];

    const cards = [
      { 
        title: 'Notes', 
        value: stats.notes, 
        icon: BookOpen, 
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        accessible: ['admin', 'editor', 'viewer']
      },
      { 
        title: 'Papers', 
        value: stats.papers, 
        icon: FileText, 
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        accessible: ['admin', 'editor', 'viewer']
      },
      { 
        title: 'Gallery Images', 
        value: stats.gallery_images, 
        icon: Image, 
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        accessible: ['admin', 'editor', 'viewer']
      },
      { 
        title: 'Notices', 
        value: stats.notices, 
        icon: Bell, 
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        accessible: ['admin', 'editor', 'viewer']
      },
      { 
        title: 'Batches', 
        value: stats.batches, 
        icon: GraduationCap, 
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        accessible: ['admin']
      },
      { 
        title: 'Sections', 
        value: stats.sections, 
        icon: Activity, 
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        accessible: ['admin']
      },
      { 
        title: 'Users', 
        value: stats.users, 
        icon: Users, 
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        accessible: ['admin']
      }
    ];

    return cards.filter(card => card.accessible.includes(user?.role || ''));
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'update': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'delete': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button onClick={fetchDashboardStats} variant="outline">
            Retry
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.full_name}! Here's what's happening in your management portal.
          </p>
        </div>
        <Badge 
          variant="outline" 
          className={`${
            user?.role === 'admin' ? 'border-red-200 text-red-700 bg-red-50' :
            user?.role === 'editor' ? 'border-blue-200 text-blue-700 bg-blue-50' :
            'border-green-200 text-green-700 bg-green-50'
          }`}
        >
          {user?.role?.toUpperCase()} ACCESS
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsCards().map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Stats for Admin */}
      {user?.role === 'admin' && stats?.user_stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {stats.user_stats.active_users}
                </p>
                <p className="text-sm text-green-700">Active Users</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {stats.user_stats.admin_count}
                </p>
                <p className="text-sm text-red-700">Admins</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.user_stats.editor_count}
                </p>
                <p className="text-sm text-blue-700">Editors</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">
                  {stats.user_stats.viewer_count}
                </p>
                <p className="text-sm text-gray-700">Viewers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {stats?.recent_activity && stats.recent_activity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recent_activity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        by {activity.user_name}
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {user?.role === 'admin' && (
              <>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/management-portal/batches">
                    <GraduationCap className="h-5 w-5" />
                    <span className="text-xs">Manage Batches</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/management-portal/users">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Manage Users</span>
                  </a>
                </Button>
              </>
            )}
            {['admin', 'editor'].includes(user?.role || '') && (
              <>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/management-portal/notes">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-xs">Add Notes</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/management-portal/papers">
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Add Papers</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/management-portal/notices">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">Post Notice</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                  <a href="/management-portal/gallery-images">
                    <Image className="h-5 w-5" />
                    <span className="text-xs">Add Images</span>
                  </a>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}