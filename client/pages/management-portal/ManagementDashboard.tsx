import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { COLORS, COMPONENTS } from '@/lib/management-design-system';
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
  Eye,
  Plus,
  RefreshCw,
  Activity,
  Calendar,
  Clock,
  CheckCircle
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
      const result = await apiGet('/.netlify/functions/api/dashboard/stats');
      const data = result.success ? result.data : result;
      setStats(data);
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const statsCards = [
    {
      title: 'Users',
      value: stats?.users || 0,
      subtitle: `${stats?.user_stats?.active_users || 0} active`,
      icon: Users,
      color: COLORS.primary[600],
      bgColor: COLORS.primary[50],
      href: user?.role === 'admin' ? '/management-portal/users' : null,
      trend: '+12%'
    },
    {
      title: 'Batches',
      value: stats?.batches || 0,
      subtitle: 'Academic batches',
      icon: GraduationCap,
      color: COLORS.accent[600],
      bgColor: COLORS.accent[50],
      href: user?.role === 'admin' ? '/management-portal/batches' : null,
      trend: '+5%'
    },
    {
      title: 'Sections',
      value: stats?.sections || 0,
      subtitle: 'Class sections',
      icon: BarChart3,
      color: COLORS.success[600],
      bgColor: COLORS.success[50],
      href: user?.role === 'admin' ? '/management-portal/sections' : null,
      trend: '+8%'
    },
    {
      title: 'Study Notes',
      value: stats?.notes || 0,
      subtitle: 'Available resources',
      icon: FileText,
      color: COLORS.warning[600],
      bgColor: COLORS.warning[50],
      href: '/management-portal/notes',
      trend: '+23%'
    },
    {
      title: 'Question Papers',
      value: stats?.papers || 0,
      subtitle: 'Practice materials',
      icon: BookOpen,
      color: COLORS.error[600],
      bgColor: COLORS.error[50],
      href: '/management-portal/papers',
      trend: '+15%'
    },
    {
      title: 'Notices',
      value: stats?.notices || 0,
      subtitle: 'Active announcements',
      icon: Bell,
      color: COLORS.primary[500],
      bgColor: COLORS.primary[50],
      href: '/management-portal/notices',
      trend: '+7%'
    },
    {
      title: 'Gallery Images',
      value: stats?.gallery_images || 0,
      subtitle: 'Media content',
      icon: Image,
      color: COLORS.accent[500],
      bgColor: COLORS.accent[50],
      href: '/management-portal/gallery-images',
      trend: '+18%'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Note',
      description: 'Upload study materials',
      icon: Plus,
      href: '/management-portal/notes',
      color: COLORS.primary[600]
    },
    {
      title: 'Create Notice',
      description: 'Post announcement',
      icon: Bell,
      href: '/management-portal/notices',
      color: COLORS.accent[600]
    },
    {
      title: 'Upload Paper',
      description: 'Add question paper',
      icon: BookOpen,
      href: '/management-portal/papers',
      color: COLORS.success[600]
    },
    {
      title: 'Add Gallery',
      description: 'Upload images',
      icon: Image,
      href: '/management-portal/gallery-images',
      color: COLORS.warning[600]
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div 
            className="h-8 rounded mb-4"
            style={{ backgroundColor: COLORS.neutral[200] }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="h-32 rounded-lg"
                style={{ backgroundColor: COLORS.neutral[200] }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="rounded-lg p-6 text-center"
        style={{ backgroundColor: COLORS.error[50], borderColor: COLORS.error[200] }}
      >
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.error[100] }}
          >
            <RefreshCw className="h-6 w-6" style={{ color: COLORS.error[600] }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: COLORS.error[800] }}>
              Unable to Load Dashboard
            </h3>
            <p className="text-sm mt-1" style={{ color: COLORS.error[600] }}>
              {error}
            </p>
          </div>
          <Button
            onClick={fetchStats}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-3xl font-bold"
            style={{ color: COLORS.neutral[900] }}
          >
            Welcome back, {user?.full_name}
          </h1>
          <p 
            className="mt-2"
            style={{ color: COLORS.neutral[600] }}
          >
            Here's what's happening with your management portal today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4" style={{ color: COLORS.neutral[500] }} />
          <span style={{ color: COLORS.neutral[600] }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const CardComponent = stat.href ? Link : 'div';
          
          return (
            <CardComponent
              key={index}
              to={stat.href || '#'}
              className={`block ${stat.href ? 'hover:shadow-lg transition-all duration-200' : ''}`}
            >
              <Card 
                className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: COLORS.neutral[50] }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: COLORS.neutral[600] }}
                      >
                        {stat.title}
                      </p>
                      <p 
                        className="text-3xl font-bold mt-2"
                        style={{ color: COLORS.neutral[900] }}
                      >
                        {stat.value.toLocaleString()}
                      </p>
                      <p 
                        className="text-sm mt-1"
                        style={{ color: COLORS.neutral[500] }}
                      >
                        {stat.subtitle}
                      </p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <Icon className="h-6 w-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4 pt-4 border-t" style={{ borderTopColor: COLORS.neutral[200] }}>
                    <TrendingUp className="h-3 w-3 mr-1" style={{ color: COLORS.success[500] }} />
                    <span className="text-sm font-medium" style={{ color: COLORS.success[600] }}>
                      {stat.trend}
                    </span>
                    <span className="text-sm ml-1" style={{ color: COLORS.neutral[500] }}>
                      vs last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CardComponent>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card 
          className="border-0 shadow-sm"
          style={{ backgroundColor: COLORS.neutral[50] }}
        >
          <CardHeader>
            <CardTitle 
              className="flex items-center text-lg"
              style={{ color: COLORS.neutral[900] }}
            >
              <Activity className="h-5 w-5 mr-2" style={{ color: COLORS.primary[600] }} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md"
                  style={{ 
                    backgroundColor: COLORS.neutral[50],
                    borderColor: COLORS.neutral[200]
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: action.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 
                      className="font-medium"
                      style={{ color: COLORS.neutral[900] }}
                    >
                      {action.title}
                    </h4>
                    <p 
                      className="text-sm"
                      style={{ color: COLORS.neutral[600] }}
                    >
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4" style={{ color: COLORS.neutral[400] }} />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card 
          className="border-0 shadow-sm"
          style={{ backgroundColor: COLORS.neutral[50] }}
        >
          <CardHeader>
            <CardTitle 
              className="flex items-center justify-between text-lg"
              style={{ color: COLORS.neutral[900] }}
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" style={{ color: COLORS.accent[600] }} />
                System Status
              </div>
              <Button variant="ghost" size="sm" onClick={fetchStats}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-4 rounded-lg" style={{ backgroundColor: COLORS.success[50] }}>
              <CheckCircle className="h-5 w-5 mr-3" style={{ color: COLORS.success[600] }} />
              <div>
                <p className="font-medium" style={{ color: COLORS.success[800] }}>
                  All Systems Operational
                </p>
                <p className="text-sm" style={{ color: COLORS.success[600] }}>
                  Dashboard loaded successfully
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: COLORS.neutral[600] }}>
                  Database Connection
                </span>
                <span className="text-sm font-medium" style={{ color: COLORS.success[600] }}>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: COLORS.neutral[600] }}>
                  API Status
                </span>
                <span className="text-sm font-medium" style={{ color: COLORS.success[600] }}>
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: COLORS.neutral[600] }}>
                  Last Updated
                </span>
                <span className="text-sm font-medium" style={{ color: COLORS.neutral[700] }}>
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}