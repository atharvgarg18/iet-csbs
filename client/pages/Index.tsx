import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  Target,
  Zap,
  Heart,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { memo } from "react";

const Index = memo(function Index() {

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
      subtitle: "'28 Batch: 75, '29 Batch: 150",
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
        <SEO 
          title="Home - CSBS IET DAVV | Computer Science & Business Systems"
          description="Official website for Computer Science & Business Systems program at IET DAVV. Access notes, papers, syllabus, and all academic resources for CSBS students. Industry-aligned curriculum designed with TCS."
          url="https://iet-csbs.vercel.app"
        />
        <StructuredData />
        <Navigation />

        {/* Hero Section */}
        <section 
          className="relative py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8"
          aria-label="Hero section introducing CSBS program"
        >
          <div className="max-w-7xl mx-auto">
            <header className="text-center space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <Badge
                  variant="secondary"
                  className="text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm"
                  role="complementary"
                  aria-label="Program highlights"
                >
                  <span className="text-lg sm:text-2xl mr-2" role="img" aria-label="graduation cap">🎓</span>
                  <span className="text-xs sm:text-sm">
                    Industry-Aligned Program • TCS Partnership
                  </span>
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
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px]"
                  >
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
            </header>
          </div>
        </section>

        {/* Stats Section */}
        <section 
          className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
          aria-label="Program statistics and key information"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6" role="list">
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

        {/* Features Section */}
        <section 
          className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-muted/30 to-muted/20"
          aria-label="Program features and highlights"
        >
          <div className="max-w-6xl mx-auto">
            <header className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary/20 backdrop-blur-sm">
                <Target className="w-4 h-4" />
                Program Highlights
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                What Makes CSBS{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                  Special
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                A unique blend of computer science fundamentals with business
                systems knowledge, designed for the modern tech industry
              </p>
            </header>

            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors duration-300" />
                        </div>
                        <CardTitle className="text-foreground font-bold text-xl group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-accent/20">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                Academic Resources
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Essential Study Resources
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                Access everything you need for academic success
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Link to="/notes" className="group block h-full">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5 border border-primary/10">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <CardTitle className="text-foreground text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
                      Study Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Comprehensive subject notes and study materials
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/papers" className="group block h-full">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 hover:-translate-y-1 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary/20 to-secondary/30 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                    </div>
                    <CardTitle className="text-foreground text-base sm:text-lg group-hover:text-secondary transition-colors duration-300">
                      Question Papers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Previous year papers and practice tests
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/syllabus" className="group block h-full">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 bg-gradient-to-br from-card to-accent/5 border border-accent/10">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                    <CardTitle className="text-foreground text-base sm:text-lg group-hover:text-accent transition-colors duration-300">
                      Syllabus
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Complete curriculum and course structure
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/notices" className="group block h-full">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 bg-gradient-to-br from-card to-primary/5 border border-primary/10">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <CardTitle className="text-foreground text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
                      Notices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Latest announcements and updates
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
});

export default Index;