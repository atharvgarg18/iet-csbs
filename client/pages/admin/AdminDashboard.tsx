import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Camera,
  Bell,
  ArrowRight
} from "lucide-react";
import { useEffect } from "react";

export default function AdminDashboard() {
  useEffect(() => {
    document.title = "Admin Dashboard - CSBS IET DAVV";
  }, []);

  const quickLinks = [
    {
      title: "Notes Management",
      description: "Manage Google Drive links for course notes",
      href: "/admin/notes",
      icon: BookOpen,
      color: "blue"
    },
    {
      title: "Papers Management", 
      description: "Manage Google Drive links for previous papers",
      href: "/admin/papers",
      icon: FileText,
      color: "green"
    },
    {
      title: "Gallery Images",
      description: "Upload and manage gallery images",
      href: "/admin/gallery-images", 
      icon: Camera,
      color: "purple"
    },
    {
      title: "Notices",
      description: "Create and manage announcements",
      href: "/admin/notices",
      icon: Bell,
      color: "orange"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">
          Manage content for the CSBS website. Select a section below to get started.
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Welcome to the Admin Panel</h3>
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