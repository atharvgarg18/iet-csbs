import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Settings,
  Users,
  BookOpen,
  FileText,
  Camera,
  Bell,
  Home,
  Database,
  ArrowLeft,
  Shield,
  Tag,
  LogOut,
  User as UserIcon,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@shared/api";
import AuthGuard from "../auth/AuthGuard";
import { useAuth } from "../auth/AuthProvider";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Settings,
      description: "Overview and statistics"
    },
    {
      name: "Batches & Sections",
      href: "/admin/batches",
      icon: Users,
      description: "Manage student batches and sections"
    },
    {
      name: "Notes",
      href: "/admin/notes",
      icon: BookOpen,
      description: "Manage Google Drive links for notes"
    },
    {
      name: "Papers",
      href: "/admin/papers",
      icon: FileText,
      description: "Manage Google Drive links for papers"
    },
    {
      name: "Gallery Categories",
      href: "/admin/gallery-categories",
      icon: Tag,
      description: "Manage gallery categories"
    },
    {
      name: "Gallery Images",
      href: "/admin/gallery-images",
      icon: Camera,
      description: "Manage gallery images"
    },
    {
      name: "Notice Categories",
      href: "/admin/notice-categories",
      icon: Tag,
      description: "Manage notice categories"
    },
    {
      name: "Notices",
      href: "/admin/notices",
      icon: Bell,
      description: "Manage notices and announcements"
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Shield,
      description: "Manage system users and permissions",
      adminOnly: true
    }
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Site</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">CSBS Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              CMS Management
            </Badge>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Content Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {navigation
                  .filter((item) => {
                    // Super admin can see everything
                    if (user?.role === 'admin') return true;
                    
                    // Editor permissions: only notes, papers, gallery images, and notices
                    if (user?.role === 'editor') {
                      const allowedPaths = [
                        '/admin/notes',
                        '/admin/papers', 
                        '/admin/gallery-images',
                        '/admin/notices'
                      ];
                      return allowedPaths.includes(item.href);
                    }
                    
                    // Viewer has no access to admin features
                    return false;
                  })
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent/50",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 leading-tight">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}