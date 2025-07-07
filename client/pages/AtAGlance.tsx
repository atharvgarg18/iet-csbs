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
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Trophy,
  Target,
  Sparkles,
  TrendingUp,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";

export default function AtAGlance() {
  const timeline = [
    {
      date: "May 2024",
      title: "Program Announcement",
      description:
        "Official announcement of the CSBS program in collaboration with TCS",
      status: "completed",
      icon: Sparkles,
    },
    {
      date: "June - Aug 2024",
      title: "Program Registration",
      description:
        "Application and registration process for the inaugural batch",
      status: "completed",
      icon: Users,
    },
    {
      date: "Aug - Sept 2024",
      title: "First Batch Counseling",
      description: "Counseling and admission process for the pioneer students",
      status: "completed",
      icon: BookOpen,
    },
    {
      date: "Sept 2024",
      title: "Teaching Begun",
      description: "Commencement of classes for the inaugural CSBS batch",
      status: "completed",
      icon: Award,
    },
    {
      date: "Jan 2025",
      title: "First Semester End",
      description: "Completion of the first semester with examinations",
      status: "completed",
      icon: CheckCircle,
    },
    {
      date: "Feb 2025",
      title: "Second Semester Start",
      description: "Beginning of the second semester curriculum",
      status: "current",
      icon: TrendingUp,
    },
    {
      date: "June 2025",
      title: "Second Semester End",
      description: "Completion of the first academic year",
      status: "upcoming",
      icon: Target,
    },
  ];

  const stats = [
    { label: "Inaugral Batch", value: "2024-28", icon: Users },
    { label: "Students Enrolled", value: "60", icon: Trophy },
    { label: "Semesters Completed", value: "1", icon: CheckCircle },
    { label: "Industry Partner", value: "TCS", icon: Zap },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "current":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "upcoming":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "current":
        return <Clock className="w-5 h-5 text-blue-400 animate-pulse" />;
      case "upcoming":
        return <Calendar className="w-5 h-5 text-orange-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 dark:from-background dark:via-primary/10 dark:to-accent/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
              <TrendingUp className="w-4 h-4" />
              Program Overview
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              CSBS{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient">
                at a Glance
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Journey of the Computer Science and Business Systems program from
              inception to implementation - marking the beginning of an
              innovative educational venture.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className="text-center p-6 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm group"
                  >
                    <CardContent className="pt-4">
                      <Icon className="w-10 h-10 mx-auto mb-3 text-primary group-hover:text-secondary transition-colors duration-300" />
                      <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Inaugural Batch Timeline
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Key milestones in the journey of our pioneering CSBS batch
                2024-28
              </p>
            </div>

            <div className="space-y-6">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={index}
                    className={`hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-card to-primary/5 border backdrop-blur-sm ${
                      item.status === "current"
                        ? "border-blue-500/30 shadow-blue-500/20"
                        : "border-primary/10"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border ${item.status === "current" ? "border-blue-500/30" : "border-primary/10"} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="text-xl font-bold text-foreground">
                              {item.title}
                            </h3>
                            <span className="text-sm text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Our Vision & Expectations
              </h2>
              <p className="text-xl text-muted-foreground">
                Building the future of interdisciplinary education
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    High Expectations
                  </h3>
                  <p className="text-muted-foreground">
                    We hope this innovative CSBS branch exceeds all our
                    expectations, creating a new benchmark in interdisciplinary
                    education that bridges technology and business seamlessly.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm">
                <CardContent className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Pioneering Excellence
                  </h3>
                  <p className="text-muted-foreground">
                    As the inaugural batch, these students are pioneers who will
                    shape the future of the program, setting standards for
                    generations of CSBS scholars to come.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-accent/20">
              <CardContent className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  <Trophy className="w-4 h-4" />
                  Future Outlook
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Setting New Standards
                </h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  With the strong foundation laid by TCS partnership and IET
                  DAVV's academic excellence, we anticipate this program will
                  become a model for innovative education, producing graduates
                  who are equally proficient in technology and business domains.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
