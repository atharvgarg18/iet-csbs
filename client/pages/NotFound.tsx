import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Home, Search, BookOpen, FileText } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 dark:from-background dark:via-primary/10 dark:to-accent/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="relative z-10">
        <Navigation />

        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-2xl">
            <div className="space-y-4">
              <h1 className="text-8xl sm:text-9xl font-bold text-primary/20">
                404
              </h1>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Page Not Found
              </h2>
              <p className="text-xl text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Link to="/notes">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/papers">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Papers
                </Button>
              </Link>
            </div>

            <div className="pt-8">
              <p className="text-sm text-muted-foreground">
                Attempted to access:{" "}
                <code className="bg-muted px-2 py-1 rounded text-foreground">
                  {location.pathname}
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
