import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Star,
  Zap,
  Globe,
  Target,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Index() {
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0);
  const [isApplicationOpen, setIsApplicationOpen] = useState(true);

  useEffect(() => {
    // Counselling completed, admissions closed for this cycle
    setIsApplicationOpen(false);
    setDaysUntilDeadline(0);
  }, []);

  const features = [
    {
      icon: Code,
      title: "Core Computer Science",
      description:
        "Covers fundamental computing subjects like Data Structures, Algorithms, OS, DBMS, and Networking to build strong technical foundations.",
    },
    {
      icon: TrendingUp,
      title: "Business and Management Studies",
      description:
        "Introduces subjects like Economics, Management Principles, Financial Accounting, and Business Communication to develop business acumen.",
    },
    {
      icon: Target,
      title: "Data Science and Analytics",
      description:
        "Focuses on subjects like Machine Learning, Data Mining, and Statistics to prepare students for data-driven decision-making roles.",
    },
    {
      icon: Zap,
      title: "Emerging Technologies and Industry Relevance",
      description:
        "Includes AI, IoT, Cloud Computing, Cybersecurity, and Industry 4.0 topics to align students with current industry trends and future tech.",
    },
  ];

  const stats = [
    { label: "Program Duration", value: "4 Years", icon: GraduationCap },
    {
      label: "Total Seats",
      value: "150",
      icon: Users,
      subtitle: "75 Original + 75 New Seats",
    },
    { label: "Industry Partner", value: "TCS", icon: Building2 },
    { label: "Admission Based", value: "JEE", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/8 to-secondary/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/8 to-primary/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-gradient-to-br from-primary/6 to-secondary/6 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <Badge
                  variant="secondary"
                  className="text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm"
                >
                  <span className="text-lg sm:text-2xl mr-2">🎓</span>
                  <span className="text-xs sm:text-sm">Industry-Aligned Program • TCS Partnership</span>
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground tracking-tight leading-tight">
                  Computer Science &
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient block sm:inline">
                    {" "}
                    Business Systems
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-2">
                  A pioneering 4-year B.Tech program developed in collaboration
                  with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent font-semibold">
                    TCS
                  </span>{" "}
                  at{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent font-semibold">
                    Institute of Engineering & Technology, DAVV Indore
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
                <Link to="/notes" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px]">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Access Notes
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/papers" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px]"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    View Papers
                  </Button>
                </Link>
              </div>

              {/* Welcome message */}
              <div className="pt-6 sm:pt-8 max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-full text-xs font-medium border border-primary/20 mb-3 sm:mb-4">
                  <Heart className="w-3 h-3" />
                  <span className="text-xs">Welcome Class of 2029! Classes Start 18 August</span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground px-4">
                  Admissions completed with 150 total seats filled!
                  The CSBS program is now ready to welcome its new batch of students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className="text-center p-3 sm:p-4 lg:p-6 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm group"
                  >
                    <CardContent className="pt-2 sm:pt-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mx-auto mb-2 sm:mb-3 text-primary group-hover:text-secondary transition-colors duration-300 relative z-10" />
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent mb-1 relative z-10">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground relative z-10 leading-tight">
                        {stat.label}
                      </div>
                      {stat.subtitle && (
                        <div className="text-xs bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-1 font-medium relative z-10 leading-tight">
                          {stat.subtitle}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    About the CSBS Program
                  </h2>
                  <div className="space-y-4">
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      <span className="text-accent font-semibold">
                        Still studying Civil or Mechanical Engineering in your
                        CS degree in 2025?
                      </span>{" "}
                      While other programs load you with irrelevant subjects
                      from the stone age, CSBS is laser-focused on what actually
                      matters in today's tech industry.
                    </p>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      Developed in partnership with{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent font-semibold">
                        Tata Consultancy Services (TCS)
                      </span>
                      , every subject in our curriculum is handpicked to make
                      you{" "}
                      <span className="text-primary font-semibold">
                        job-ready from day one
                      </span>
                      . No fluff, no outdated theory – just the skills that land
                      you your dream package and set you up for real-world
                      success.
                    </p>
                    <p className="text-base sm:text-lg text-foreground font-medium">
                      This isn't just another engineering degree. It's your
                      direct pathway to becoming a{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                        tech leader who understands business
                      </span>{" "}
                      – exactly what the industry is desperately looking for.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <strong className="text-foreground">
                        Industry-Aligned Curriculum:
                      </strong>
                      Designed by TCS experts to meet current industry
                      requirements
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <strong className="text-foreground">
                        Dual Expertise:
                      </strong>
                      Strong foundation in both computer science and business
                      management
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <strong className="text-foreground">
                        Future-Ready Skills:
                      </strong>
                      Focus on emerging technologies and digital transformation
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className="p-3 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2 sm:pb-3">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" />
                        <CardTitle className="text-base sm:text-lg leading-tight">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-xs sm:text-sm leading-relaxed">
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

        {/* Institute & Campus Section - Completely Redesigned */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Elegant Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/40"></div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl animate-pulse delay-300"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/6 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Hero Header */}
            <div className="text-center space-y-8 mb-20">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm">
                <Building2 className="w-4 h-4" />
                Premier Institution
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                  Institute of Engineering &{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                    Technology
                  </span>
                </h2>
                <p className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                  DAVV Indore
                </p>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Where innovation meets tradition. A premier institution
                  committed to excellence in technical education and research,
                  preparing students for global challenges and opportunities.
                </p>

                <div className="flex flex-col items-center gap-4 pt-4">
                  <a
                    href="https://ietdavv.edu.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 rounded-2xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
                  >
                    <span>Visit Official Website</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                  <Link
                    to="/at-a-glance"
                    className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors duration-300 font-medium"
                  >
                    <span>View Program Timeline At a Glance</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Campus Showcase with Integrated Content */}
            <div className="space-y-20">
              {/* First Row - Academic Excellence with Campus Image */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
                      <GraduationCap className="w-4 h-4" />
                      Academic Excellence
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                      Rigorous Academic Programs
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Our industry-aligned curriculum is designed by experts and
                      experienced faculty to ensure students are equipped with
                      cutting-edge knowledge and practical skills that meet
                      global standards.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-card to-primary/5 p-4 rounded-xl border border-primary/10 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">
                        150+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expert Faculty
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-card to-secondary/5 p-4 rounded-xl border border-secondary/10 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-secondary">
                        29+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Years Legacy
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-700 border-primary/20">
                  <div className="relative overflow-hidden">
                    <img
                      src="https://html-starter-beige-beta.vercel.app/campus_2.jpg"
                      alt="State-of-the-art Computer Laboratory"
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Advanced Computing Labs
                      </h4>
                      <p className="text-white/90 text-sm">
                        State-of-the-art facilities equipped with latest
                        technology for hands-on learning
                      </p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full p-2">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Second Row - Industry Partnership with Campus Image (Reversed) */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <Card className="lg:order-1 order-2 overflow-hidden group hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-700 border-secondary/20">
                  <div className="relative overflow-hidden">
                    <img
                      src="https://html-starter-beige-beta.vercel.app/campus_1.jpg"
                      alt="Beautiful IET DAVV Campus"
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Sprawling Green Campus
                      </h4>
                      <p className="text-white/90 text-sm">
                        Eco-friendly campus spread across acres providing serene
                        learning environment
                      </p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-secondary/20 backdrop-blur-sm border border-secondary/30 rounded-full p-2">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="lg:order-2 order-1 space-y-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary/20">
                      <Building2 className="w-4 h-4" />
                      Industry Partnership
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                      Strong Industry Connections
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Strategic partnerships with leading companies like TCS,
                      providing students with real-world exposure, internships,
                      and direct pathways to exciting career opportunities.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-card to-secondary/5 p-4 rounded-xl border border-secondary/10 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-secondary">
                        50+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Industry Partners
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-card to-accent/5 p-4 rounded-xl border border-accent/10 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-accent">₹7L+</div>
                      <div className="text-sm text-muted-foreground">
                        Avg. Package
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Third Row - Research & Innovation with Campus Image */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
                      <Award className="w-4 h-4" />
                      Research & Innovation
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
                      Cutting-edge Research Facilities
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Advanced research laboratories and innovation hubs foster
                      creativity and breakthrough discoveries, encouraging
                      students to push the boundaries of technology and
                      knowledge.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-card to-accent/5 p-4 rounded-xl border border-accent/10 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-accent">25+</div>
                      <div className="text-sm text-muted-foreground">
                        Research Labs
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-card to-primary/5 p-4 rounded-xl border border-primary/10 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-primary">
                        100+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Projects/Year
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="overflow-hidden group hover:shadow-2xl hover:shadow-accent/20 transition-all duration-700 border-accent/20">
                  <div className="relative overflow-hidden">
                    <img
                      src="https://html-starter-beige-beta.vercel.app/campus_3.jpg"
                      alt="Modern Academic Building"
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Modern Infrastructure
                      </h4>
                      <p className="text-white/90 text-sm">
                        Contemporary buildings designed for collaborative
                        learning and innovation
                      </p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full p-2">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="text-center pt-20">
              <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/10">
                <CardContent>
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto">
                      <Star className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Join the Legacy of Excellence
                    </h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Be part of a tradition that shapes future leaders,
                      innovators, and problem-solvers who make a difference in
                      the world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4 text-primary" />
                        <span>Globally Recognized</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="w-4 h-4 text-secondary" />
                        <span>Industry Focused</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4 text-accent" />
                        <span>Innovation Driven</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AICTE Approval Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-muted/20 to-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm">
                <Shield className="w-4 h-4" />
                Official Verification
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                AICTE Approval{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                  Verification
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Concerned about program authenticity? Here's the official
                documentation that confirms our AICTE approval status.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground font-bold text-xl">
                          Officially Approved
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          AICTE Recognition Confirmed
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-foreground text-lg leading-relaxed">
                        The Computer Science and Business Systems program holds{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold">
                          official AICTE approval
                        </span>{" "}
                        and is documented in the Expert Committee minutes.
                      </p>
                      <p className="text-muted-foreground">
                        All documentation is publicly available through official
                        AICTE channels for complete transparency.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a
                          href="https://www.aicte.gov.in/sites/default/files/118%20EC%20minutes.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Official Document
                          </Button>
                        </a>
                        <Button
                          variant="outline"
                          className="border-primary/30 text-primary hover:bg-primary/5 w-full sm:w-auto"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Verification Guide
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Star className="w-5 h-5 text-accent" />
                      Verification Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-foreground">
                        Approved by AICTE Expert Committee
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-foreground">
                        Listed in official EC minutes document
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-foreground">
                        TCS partnership formally validated
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-foreground">
                        Direct counselling process
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="overflow-hidden bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm hover:shadow-xl hover:shadow-secondary/10 transition-all duration-500 group">
                  <CardHeader>
                    <CardTitle className="text-foreground text-center">
                      Official AICTE Approval Document
                    </CardTitle>
                    <p className="text-center text-sm text-muted-foreground">
                      Click to view the complete documentation
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative cursor-pointer">
                      <img
                        src="https://html-starter-beige-beta.vercel.app/aicte-approval.jpg"
                        alt="AICTE Approval Document for CSBS Program"
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 border border-primary/10"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                        <a
                          href="https://www.aicte.gov.in/sites/default/files/118%20EC%20minutes.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Full Document
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Globe className="w-5 h-5 text-primary" />
                      Independent Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Verify our approval status independently through official
                      AICTE resources.
                    </p>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">
                        aicte.gov.in - Official Portal
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-foreground">
                        EC Minutes Document #118
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">
                        Publicly accessible records
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-muted/25 to-muted/35">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-primary/20">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                Admissions Completed
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Welcome New CSBS Students!
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                Your journey with the industry-aligned Computer Science
                and Business Systems program begins soon
              </p>
            </div>

            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="space-y-4 sm:space-y-6">
                <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 backdrop-blur-xl shadow-2xl shadow-blue-500/20">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-blue-400 dark:text-blue-300 font-bold text-base sm:text-lg">
                      Admissions Completed - Welcome New Students!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-blue-200 dark:text-blue-100 text-sm sm:text-base">
                        Counselling completed successfully! 🎉
                      </p>
                      <div className="text-xs sm:text-sm text-blue-200 space-y-1">
                        <p><strong>📅 Classes Start:</strong> 18 August 2025</p>
                        <p><strong>🎓 Induction Program:</strong> 28-29 August 2025</p>
                        <p><strong>📍 Reporting:</strong> All admitted students must report at IET on 18 August</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Card className="text-center p-3 sm:p-4 bg-gradient-to-br from-card to-primary/5 border border-primary/10">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-primary" />
                    <div className="text-xl sm:text-2xl font-bold text-foreground">150</div>
                    <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
                      Total Seats
                    </div>
                  </Card>
                  <Card className="text-center p-3 sm:p-4 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-secondary" />
                    <div className="text-xl sm:text-2xl font-bold text-foreground">
                      JEE
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
                      Based Admission
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <Card className="p-4 sm:p-6 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-4 px-0">
                    <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      Admission Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-0">
                    <div className="flex items-start gap-3">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground">
                        ✅ Registration completed (8-11 August 2025)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground">
                        ✅ Counselling completed (12th August)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground">
                        📅 Classes start 18 August - Report to IET
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground">
                        🎓 Induction Program: 28-29 August 2025
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4 sm:p-6 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-4 px-0">
                    <CardTitle className="flex items-center gap-2 text-foreground text-base sm:text-lg">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-0">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground break-all">
                        admissions@ietdavv.edu.in
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-foreground">
                        +91-731-2570179
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-foreground leading-relaxed">
                        IET DAVV, Khandwa Road, Indore
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-muted/30 to-muted/20">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-primary/20">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                Academic Resources
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Ready to Explore?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
                Access comprehensive study materials, notes, and test papers for
                your academic journey
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link to="/notes" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px] bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Browse Notes
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/papers" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px] border-2 border-primary hover:bg-primary hover:text-white"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View Test Papers
                </Button>
              </Link>
            </div>
          </div>
        </section>



        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary/20">
                <Target className="w-4 h-4" />
                Common Questions
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Get answers to the most common queries about CSBS
              </p>
            </div>

            <div className="space-y-4">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none bg-gradient-to-r from-card to-secondary/5 hover:bg-secondary/10 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-foreground">
                      Will there be limitations in placement opportunities since
                      TCS designed the curriculum? Can we sit with CSE/IT
                      branches?
                    </h3>
                    <div className="group-open:rotate-180 transition-transform duration-300">
                      <ArrowRight className="w-5 h-5 text-secondary" />
                    </div>
                  </summary>
                  <CardContent className="px-6 pb-6">
                    <div className="pt-4 border-t border-border/20">
                      <p className="text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">
                          Great question!
                        </strong>{" "}
                        Yes, the curriculum is designed by TCS, and this
                        actually works in our favor. TCS will prioritize hiring
                        from this branch over others during their recruitment
                        drives. However, this doesn't limit you –{" "}
                        <span className="text-primary font-medium">
                          students can apply to any company and sit for
                          placements with any branch whatsoever
                        </span>
                        .
                      </p>
                      <p className="text-muted-foreground mt-3">
                        You get the best of both worlds: priority consideration
                        from TCS plus the freedom to explore opportunities
                        across the entire tech industry.
                      </p>
                    </div>
                  </CardContent>
                </details>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none bg-gradient-to-r from-card to-primary/5 hover:bg-primary/10 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-foreground">
                      Are the classes held at the main IET DAVV campus?
                    </h3>
                    <div className="group-open:rotate-180 transition-transform duration-300">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </summary>
                  <CardContent className="px-6 pb-6">
                    <div className="pt-4 border-t border-border/20">
                      <p className="text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">
                          Yes, absolutely!
                        </strong>{" "}
                        All CSBS classes are conducted at the main IET DAVV
                        campus on Khandwa Road, Indore. You'll have access to
                        all the campus facilities, laboratories, library, and
                        infrastructure that the institute offers.
                      </p>
                      <p className="text-muted-foreground mt-3">
                        You're not in a separate facility or branch campus –
                        you're part of the main IET DAVV community with full
                        access to all campus resources and activities.
                      </p>
                    </div>
                  </CardContent>
                </details>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none bg-gradient-to-r from-card to-accent/5 hover:bg-accent/10 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-foreground">
                      How is CSBS different from regular Computer Science
                      Engineering?
                    </h3>
                    <div className="group-open:rotate-180 transition-transform duration-300">
                      <ArrowRight className="w-5 h-5 text-accent" />
                    </div>
                  </summary>
                  <CardContent className="px-6 pb-6">
                    <div className="pt-4 border-t border-border/20">
                      <p className="text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">
                          CSBS is more focused and industry-aligned.
                        </strong>{" "}
                        While traditional CSE includes subjects like Civil
                        Engineering, Mechanical Engineering, and other core
                        engineering topics, CSBS eliminates these and focuses
                        entirely on computer science fundamentals plus business
                        systems.
                      </p>
                      <p className="text-muted-foreground mt-3">
                        Every subject in CSBS is handpicked to be relevant to
                        today's tech industry, making you job-ready from day one
                        without wasting time on outdated or irrelevant
                        coursework.
                      </p>
                    </div>
                  </CardContent>
                </details>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
