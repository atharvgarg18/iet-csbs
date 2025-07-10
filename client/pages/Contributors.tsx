import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
  Linkedin,
  Github,
  ExternalLink,
} from "lucide-react";

export default function Contributors() {
  const departments = [
    {
      name: "Notes Department",
      icon: BookOpen,
      description: "Curating and organizing comprehensive study materials",
      members: [
        {
          name: "Bharat Jain Sanghvi",
          image: "https://html-starter-beige-beta.vercel.app/bharat.jpg",
          linkedin: "http://www.linkedin.com/in/bharat-jain-76046832a",
          github: "https://github.com/jainsanghvi-bharat15",
        },
      ],
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
    },
    {
      name: "MST's & End Sem Papers",
      icon: FileText,
      description: "Managing examination papers and assessment materials",
      members: [
        {
          name: "Advait Kshirsagar",
          image: null,
          linkedin: "https://www.linkedin.com/in/advait-kshirsagar-93b46032a",
          github: "https://github.com/finoyes",
        },
        {
          name: "Gurpreet Singh Bhatia",
          image: null,
          linkedin: "https://linkedin.com/in/gurpreet-singh-bhatia-73713a231",
          github: null,
        },
      ],
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      name: "Gallery Division",
      icon: Camera,
      description: "Capturing and showcasing campus life and events",
      members: [
        {
          name: "Bhumi Jain",
          image: null,
          linkedin: "http://linkedin.com/in/bhumi-jain-9a919932b",
          github: null,
        },
        {
          name: "Pranamya Sharma",
          image: null,
          linkedin: "https://www.linkedin.com/in/pranamya-sharma-425149321",
          github: "https://github.com/PranamyaSharma05",
        },
      ],
      color: "from-pink-500/20 to-rose-500/20",
      borderColor: "border-pink-500/30",
      iconColor: "text-pink-400",
    },
    {
      name: "Overview Unit",
      icon: Eye,
      description: "Program overview and strategic content management",
      members: [
        {
          name: "Kanha Agrawal",
          image: null,
          linkedin: "https://linkedin.com/in/kanha-agrawal-3b2403331",
          github: null,
        },
      ],
      color: "from-purple-500/20 to-violet-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      name: "Designing Unit",
      icon: Palette,
      description: "UI/UX design and visual identity creation",
      members: [
        {
          name: "Suwaaq Kothari",
          image: "https://html-starter-beige-beta.vercel.app/suwaaq.jpg",
          linkedin: "https://github.com/Skothari-11677",
          github: "https://github.com/Skothari-11677/builder-quantum-den",
        },
        {
          name: "Naman Kasliwal (ETC)",
          image: "https://html-starter-beige-beta.vercel.app/naman.jpg",
          linkedin: "http://www.linkedin.com/in/naman-kasliwal-082a4b33a",
          github: null,
        },
      ],
      color: "from-orange-500/20 to-yellow-500/20",
      borderColor: "border-orange-500/30",
      iconColor: "text-orange-400",
    },
    {
      name: "Development & maintenance Department",
      icon: Code,
      description: "Frontend and backend development of the platform",
      members: [
        {
          name: "Atharv Garg",
          image: "https://html-starter-beige-beta.vercel.app/1749249981340.jpg",
          linkedin: "https://www.linkedin.com/in/atharvgrg/",
          github: "https://github.com/atharvgrg",
        },
      ],
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
                        <div className="space-y-3">
                          {dept.members.map((member, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-colors duration-300"
                            >
                              <div className="flex items-start gap-3">
                                {/* Profile Image */}
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                                  {member.image ? (
                                    <img
                                      src={member.image}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-white text-sm font-semibold">
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h5 className="text-foreground font-medium text-sm mb-1">
                                    {member.name}
                                  </h5>

                                  {/* Social Links */}
                                  {(member.linkedin || member.github) && (
                                    <div className="flex gap-2">
                                      {member.linkedin && (
                                        <a
                                          href={member.linkedin}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                        >
                                          <Linkedin className="w-3 h-3" />
                                          <span>LinkedIn</span>
                                          <ExternalLink className="w-2 h-2" />
                                        </a>
                                      )}
                                      {member.github && (
                                        <a
                                          href={member.github}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                        >
                                          <Github className="w-3 h-3" />
                                          <span>GitHub</span>
                                          <ExternalLink className="w-2 h-2" />
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
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

        <Footer />
      </div>
    </div>
  );
}
