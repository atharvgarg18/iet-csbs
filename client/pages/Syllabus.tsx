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
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Download,
  ExternalLink,
  GraduationCap,
  FileText,
  Calendar,
  Clock,
  Star,
  Target,
} from "lucide-react";

export default function Syllabus() {
  const allSemestersPDF = {
    title: "Complete CSBS Curriculum (All 8 Semesters)",
    description:
      "Comprehensive curriculum pattern for the entire 4-year CSBS program",
    downloadLink:
      "https://info.tcs.com/rs/744-FUI-742/images/AY%2020-21%20-%20CSBS%20Curriculum%20-%207%20Sem%20Pattern%20180%20Credits.pdf",
    credits: "180 Credits • 8 Semester Pattern",
  };

  const semesters = [
    {
      id: 1,
      title: "Semester 1",
      description:
        "Foundation semester focusing on mathematics, basic computer science, and communication skills",
      subjects: [
        "Discrete Mathematics",
        "Introductory Topics in Statistics, Probability and Calculus",
        "Fundamentals of Computer Science + Lab",
        "Principles of Electrical Engineering + Lab",
        "Physics for Computing Science + Lab",
        "Business Communication & Value Science - I",
      ],
      downloadLink:
        "https://info.tcs.com/rs/744-FUI-742/images/CSBS%20Syllabus%20Sem%201_8SemPattern.pdf",
      credits: "22 Credits",
      status: "completed",
    },
    {
      id: 2,
      title: "Semester 2",
      description:
        "Building on foundations with data structures, economics, and statistical methods",
      subjects: [
        "Linear Algebra",
        "Statistical Methods + Lab",
        "Data Structures and Algorithms + Lab",
        "Principles of Electronics + Lab",
        "Fundamentals of Economics",
        "Business Communication and Value Science – II",
        "Environmental Sciences",
      ],
      downloadLink:
        "https://info.tcs.com/rs/744-FUI-742/images/CSBS%20Syllabus%20Sem%202_8SemPattern_Revised.pdf",
      credits: "24 Credits",
      status: "completed",
    },
    {
      id: 3,
      title: "Semester 3",
      description: "Advanced programming concepts and system fundamentals",
      downloadLink:
        "https://html-starter-beige-beta.vercel.app/B.Tech-Scheme-44-51.pdf",
      credits: "22 Credits",
      status: "ongoing",
    },
    {
      id: 4,
      title: "Semester 4",
      description: "Core computer science subjects and business applications",
      downloadLink:
        "https://html-starter-beige-beta.vercel.app/B.Tech-Scheme-53-77.pdf",
      credits: "22 Credits",
      status: "upcoming",
    },
    {
      id: 5,
      title: "Semester 5",
      description:
        "Specialized topics in software engineering and business intelligence",
      downloadLink: "#",
      credits: "22 Credits",
      status: "upcoming",
    },
    {
      id: 6,
      title: "Semester 6",
      description: "Advanced algorithms, machine learning, and project work",
      downloadLink: "#",
      credits: "22 Credits",
      status: "upcoming",
    },
    {
      id: 7,
      title: "Semester 7",
      description: "Industry-oriented subjects and major project development",
      downloadLink: "#",
      credits: "22 Credits",
      status: "upcoming",
    },
    {
      id: 8,
      title: "Semester 8",
      description: "Capstone project, internship, and career preparation",
      downloadLink: "#",
      credits: "24 Credits",
      status: "upcoming",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "bg-green-500/10 text-green-400 border-green-500/30",
      ongoing: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      upcoming: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    };
    return colors[status as keyof typeof colors] || colors.upcoming;
  };

  const getStatusText = (status: string) => {
    const texts = {
      completed: "Completed",
      ongoing: "Current",
      upcoming: "Upcoming",
    };
    return texts[status as keyof typeof texts] || "Upcoming";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
              <BookOpen className="w-4 h-4" />
              Academic Curriculum
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              CSBS{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                Syllabus
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive curriculum designed in collaboration with TCS to
              prepare you for the industry's evolving demands.
            </p>
          </div>
        </section>

        {/* Complete Curriculum Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-xl shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-foreground mb-2">
                      {allSemestersPDF.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {allSemestersPDF.description}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      {allSemestersPDF.credits}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={allSemestersPDF.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg shadow-primary/20">
                      <Download className="w-4 h-4 mr-2" />
                      Download Complete Curriculum
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    className="flex-1 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Online
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Semester-wise Syllabus */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Semester-wise Breakdown
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Detailed syllabus for each semester with subject-wise coverage
                and learning outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {semesters.map((semester) => (
                <Card
                  key={semester.id}
                  className="hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {semester.id}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl text-foreground">
                            {semester.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(semester.status)}>
                              {getStatusText(semester.status)}
                            </Badge>
                            <Badge variant="secondary" size="sm">
                              {semester.credits}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {semester.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {semester.subjects && (
                      <div className="space-y-4 mb-6">
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Target className="w-4 h-4 text-accent" />
                          Subjects Covered:
                        </h4>
                        <div className="grid gap-2">
                          {semester.subjects.map((subject, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-background/80 transition-colors duration-300"
                            >
                              <Star className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">
                                {subject}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      {semester.downloadLink !== "#" ? (
                        <a
                          href={semester.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white shadow-lg shadow-accent/20">
                            <Download className="w-4 h-4 mr-2" />
                            Download Syllabus
                          </Button>
                        </a>
                      ) : (
                        <Button disabled className="flex-1">
                          <Clock className="w-4 h-4 mr-2" />
                          Coming Soon
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="flex-1 border-accent/30 text-accent hover:bg-accent/5"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Info Section */}
            <Card className="p-8 text-center bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Dynamic Curriculum
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                  Our syllabus is continuously updated in collaboration with TCS
                  and industry experts to ensure you learn the most relevant and
                  cutting-edge technologies and business practices.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Updated annually</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>Industry-aligned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>TCS partnership</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
