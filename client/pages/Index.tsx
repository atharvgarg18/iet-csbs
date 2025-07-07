import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  Building2,
  Award,
  BookOpen,
  FileText,
  ArrowRight,
  Code,
  TrendingUp,
  Shield,
  Cloud,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const features = [
    {
      icon: Code,
      title: "Computer Science Fundamentals",
      description:
        "Core programming, algorithms, data structures, and software engineering principles",
    },
    {
      icon: TrendingUp,
      title: "Business Systems",
      description:
        "Business management, systems analysis, and enterprise solution development",
    },
    {
      icon: Shield,
      title: "Cyber Security",
      description:
        "Information security, network protection, and cybersecurity frameworks",
    },
    {
      icon: Cloud,
      title: "Cloud & IoT",
      description:
        "Cloud computing, Internet of Things, and modern distributed systems",
    },
  ];

  const stats = [
    { label: "Program Duration", value: "4 Years", icon: GraduationCap },
    { label: "Seats Available", value: "60", icon: Users },
    { label: "Industry Partner", value: "TCS", icon: Building2 },
    { label: "Admission Based", value: "JEE", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-green-50/30">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🎓 New Program • Academic Year 2024-25
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight">
                Computer Science &
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {" "}
                  Business Systems
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A pioneering 4-year B.Tech program developed in collaboration
                with TCS at Institute of Engineering & Technology, DAVV Indore
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/notes">
                <Button size="lg" className="text-lg px-8 py-6">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Access Notes
                  <ArrowRight className="w-5 h-5 ml-2" />
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
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-4">
                    <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <div className="text-3xl font-bold text-foreground mb-1">
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

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  About the CSBS Program
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The Computer Science and Business Systems program is a unique
                  interdisciplinary course that bridges the gap between
                  technology and business. Developed in partnership with Tata
                  Consultancy Services (TCS), this program prepares students for
                  the evolving demands of the digital economy.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">
                      Industry-Aligned Curriculum:
                    </strong>
                    Designed by TCS experts to meet current industry
                    requirements
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Dual Expertise:</strong>
                    Strong foundation in both computer science and business
                    management
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">
                      Future-Ready Skills:
                    </strong>
                    Focus on emerging technologies and digital transformation
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <Icon className="w-8 h-8 text-primary mb-2" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Institute Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Institute of Engineering & Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              DAVV Indore - A premier institution committed to excellence in
              technical education and research, preparing students for global
              challenges and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Academic Excellence
                </h3>
                <p className="text-muted-foreground">
                  Rigorous academic programs with industry-relevant curriculum
                  and experienced faculty
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Industry Partnership
                </h3>
                <p className="text-muted-foreground">
                  Strong collaboration with leading companies like TCS for
                  practical exposure
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Research & Innovation
                </h3>
                <p className="text-muted-foreground">
                  Cutting-edge research facilities and innovation labs for
                  hands-on learning
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ready to Explore?
            </h2>
            <p className="text-xl text-muted-foreground">
              Access comprehensive study materials, notes, and test papers for
              your academic journey
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/notes">
              <Button size="lg" className="text-lg px-8 py-6 w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Notes
              </Button>
            </Link>
            <Link to="/papers">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 w-full sm:w-auto"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Test Papers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">
              CSBS - IET DAVV Indore
            </span>
          </div>
          <p className="text-muted-foreground">
            Computer Science and Business Systems • Powered by TCS Partnership
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 Institute of Engineering & Technology, DAVV Indore. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
