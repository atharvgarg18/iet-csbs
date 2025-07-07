import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  BookOpen,
  FileText,
  Users,
  Bell,
  TrendingUp,
  Camera,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: GraduationCap },
    { name: "Notes", href: "/notes", icon: BookOpen },
    { name: "Papers", href: "/papers", icon: FileText },
    { name: "Notices", href: "/notices", icon: Bell },
    { name: "At a Glance", href: "/at-a-glance", icon: TrendingUp },
    { name: "Gallery", href: "/gallery", icon: Camera },
    { name: "Contributors", href: "/contributors", icon: Users },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 shadow-lg shadow-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              {/* Full IET Logo */}
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2Fc288a09ecf9f4912b157301cc10fa6a8?format=webp&width=800"
                alt="IET DAVV Logo"
                className="h-14 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="hidden sm:block">
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CSBS
                </div>
              </div>
            </Link>

            {/* IET Website Link */}
            <a
              href="https://ietdavv.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-300 ml-6 px-3 py-2 rounded-md hover:bg-primary/5 border border-transparent hover:border-primary/20"
            >
              <span>Visit IET DAVV</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 relative overflow-hidden group transition-all duration-300 text-sm px-4 py-2",
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                        : "hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    <Icon className="w-4 h-4 z-10" />
                    <span className="z-10">{item.name}</span>
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </Button>
                </Link>
              );
            })}

            {/* More Dropdown for remaining items */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-3">
                  <Menu className="w-4 h-4" />
                  <span className="sr-only">More pages</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navigation.slice(4).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} to={item.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </DropdownMenuItem>
                    </Link>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <div className="ml-3 pl-3 border-l border-border/50">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-primary/10 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 relative overflow-hidden group",
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "hover:bg-primary/10 hover:text-primary",
                    )}
                  >
                    <Icon className="w-4 h-4 z-10" />
                    <span className="z-10">{item.name}</span>
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </Button>
                </Link>
              );
            })}

            {/* IET Website Link in Mobile */}
            <a
              href="https://ietdavv.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit IET DAVV</span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
