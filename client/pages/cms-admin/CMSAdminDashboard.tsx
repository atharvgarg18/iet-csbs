import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Camera,
  Bell,
  ArrowRight,
  Users,
  GraduationCap
} from "lucide-react";
import { useEffect } from "react";
import { useAuth } from '@/components/auth/AuthProvider';

export default function CMSAdminDashboard() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "CMS Admin Dashboard - CSBS IET DAVV";
  }, []);

  const getQuickLinks = () => {
    const allLinks = [
      {
        title: "Batches Management",
        description: "Manage student batches and academic years",
        href: "/cms-admin/batches",
        icon: GraduationCap,
        color: "blue",
        adminOnly: true
      },
      {
        title: "Notes Management",
        description: "Manage Google Drive links for course notes",
        href: "/cms-admin/notes",
        icon: BookOpen,
        color: "blue"
      },
      {
        title: "Papers Management", 
        description: "Manage Google Drive links for previous papers",
        href: "/cms-admin/papers",
        icon: FileText,
        color: "green"
      },
      {
        title: "Gallery Images",
        description: "Upload and manage gallery images",
        href: "/cms-admin/gallery-images", 
        icon: Camera,
        color: "purple"
      },
      {
        title: "Notices",
        description: "Create and manage announcements",
        href: "/cms-admin/notices",
        icon: Bell,
        color: "orange"
      },
      {
        title: "Users Management",
        description: "Manage admin users and permissions",
        href: "/cms-admin/users",
        icon: Users,
        color: "red",
        adminOnly: true
      }
    ];

    // Filter based on user role
    if (user?.role === 'admin') {
      return allLinks;
    } else if (user?.role === 'editor') {
      return allLinks.filter(link => !link.adminOnly);
    } else {
      return [];
    }
  };

  const quickLinks = getQuickLinks();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to CMS Admin</h1>
        <p className="text-muted-foreground">
          Content Management System for CSBS IET DAVV. Select a section below to get started.
        </p>
        {user && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Logged in as:</span>
            <span className="font-medium">{user.full_name}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
              {user.role}
            </span>
          </div>
        )}
      </div>

      {/* Quick Links Grid */}
      {quickLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} to={link.href}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${link.color}-100`}>
                          <Icon className={`w-5 h-5 text-${link.color}-600`} />
                        </div>
                        <span>{link.title}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {link.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Limited Access</h3>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Your current role has view-only access. Contact an administrator to request additional permissions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Content Management System</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Use the navigation menu on the left or the quick links above to manage website content. 
              Click on any section to start creating or editing content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}