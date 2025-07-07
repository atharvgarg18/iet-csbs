import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  FileText,
  Camera,
  Eye,
  Palette,
  Code,
  Crown,
  Star,
  Zap,
  Heart,
} from "lucide-react";

export default function Contributors() {
  const departments = [
    {
      name: "Notes Department",
      icon: BookOpen,
      description: "Curating and organizing comprehensive study materials",
      members: ["Bharat Jain Sanghvi"],
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
    },
    {
      name: "MST's & End Sem Papers",
      icon: FileText,
      description: "Managing examination papers and assessment materials",
      members: ["Advait Kshirsagar", "Gurpreet Singh Bhatia"],
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      name: "Gallery Division",
      icon: Camera,
      description: "Capturing and showcasing campus life and events",
      members: ["Bhumi Jain", "Pranamya Sharma"],
      color: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
    },
    {
      name: "Overview Unit",
      icon: Eye,
      description: "Program overview and strategic content management",
      members: ["Kanha Agrawal"],
      color: "from-purple-500/20 to-violet-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      name: "Designing Unit",
      icon: Palette,
      description: "UI/UX design and visual identity creation",
      members: ["Suwaaq Kothari", "Naman Kasliwal"],
      color: "from-orange-500/20 to-yellow-500/20",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
    },
    {
      name: "Development Unit",
      icon: Code,
      description: "Frontend and backend development of the platform",
      members: ["Atharv Garg"],
      color: "from-cyan-500/20 to-teal-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-72 h-72 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
              <Users className="w-4 h-4" />
              Meet the Team
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Site{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                Contributors
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated team behind the CSBS platform - passionate
              students working together to create an exceptional academic
              experience.
            </p>
          </div>
        </section>

        {/* Team Stats */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center p-6 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Crown className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                  <div className="text-2xl font-bold text-foreground mb-1">
                    6
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Departments
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center p-6 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Star className="w-8 h-8 mx-auto mb-3 text-secondary" />
                  <div className="text-2xl font-bold text-foreground mb-1">
                    9
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Contributors
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center p-6 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Zap className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <div className="text-2xl font-bold text-foreground mb-1">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Dedication
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center p-6 bg-gradient-to-br from-card to-pink-500/5 border border-pink-500/10 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <Heart className="w-8 h-8 mx-auto mb-3 text-pink-400" />
                  <div className="text-2xl font-bold text-foreground mb-1">
                    1
                  </div>
                  <div className="text-sm text-muted-foreground">Mission</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Departments Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept) => {
                const Icon = dept.icon;
                return (
                  <Card
                    key={dept.name}
                    className={`hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-105 bg-gradient-to-br ${dept.color} ${dept.borderColor} border backdrop-blur-sm group relative overflow-hidden`}
                  >
                    {/* Animated background overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} border ${dept.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className={`w-6 h-6 ${dept.iconColor}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                            {dept.name}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-muted-foreground mt-2">
                        {dept.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Team Members:
                        </h4>
                        <div className="space-y-2">
                          {dept.members.map((member, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
                                {member
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="text-foreground font-medium">
                                {member}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Acknowledgment Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Thank You
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                This platform exists because of the collective efforts of
                passionate students who believe in sharing knowledge and
                building a stronger academic community.
              </p>
            </div>

            <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm">
              <CardContent className="pt-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className="w-6 h-6 text-red-400 animate-pulse" />
                  <span className="text-lg font-semibold text-foreground">
                    Made with love for CSBS Community
                  </span>
                  <Heart className="w-6 h-6 text-red-400 animate-pulse" />
                </div>
                <p className="text-muted-foreground">
                  Every line of code, every design element, and every piece of
                  content has been crafted with care to serve our fellow
                  students and create a valuable resource for current and future
                  CSBS scholars.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
