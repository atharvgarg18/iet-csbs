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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Index() {
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0);
  const [isApplicationOpen, setIsApplicationOpen] = useState(true);

  useEffect(() => {
    const deadline = new Date("2025-07-15");
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysUntilDeadline(diffDays);
    setIsApplicationOpen(diffDays > 0);
  }, []);

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
    {
      label: "Total Seats",
      value: "75",
      icon: Users,
      subtitle: "60 Regular + 15 Supernumerary",
    },
    { label: "Industry Partner", value: "TCS", icon: Building2 },
    { label: "Admission Based", value: "JEE", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 dark:from-background dark:via-primary/10 dark:to-secondary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="text-sm px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm"
                >
                  <span className="text-2xl mr-2">🎓</span>
                  New Program • Academic Year 2024-25
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight">
                  Computer Science &
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                    {" "}
                    Business Systems
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  A pioneering 4-year B.Tech program developed in collaboration
                  with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent font-semibold">
                    TCS
                  </span>{" "}
                  at Institute of Engineering & Technology, DAVV Indore
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
                    className="text-center p-6 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm group"
                  >
                    <CardContent className="pt-4 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Icon className="w-10 h-10 mx-auto mb-3 text-primary group-hover:text-secondary transition-colors duration-300 relative z-10" />
                      <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent mb-1 relative z-10">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground relative z-10">
                        {stat.label}
                      </div>
                      {stat.subtitle && (
                        <div className="text-xs bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-1 font-medium relative z-10">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                    About the CSBS Program
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    The Computer Science and Business Systems program is a
                    unique interdisciplinary course that bridges the gap between
                    technology and business. Developed in partnership with Tata
                    Consultancy Services (TCS), this program prepares students
                    for the evolving demands of the digital economy.
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
                      <strong className="text-foreground">
                        Dual Expertise:
                      </strong>
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
                        <CardTitle className="text-lg">
                          {feature.title}
                        </CardTitle>
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

        {/* Campus Gallery Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-100/50 to-pink-100/50">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Our Beautiful Campus
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore the state-of-the-art facilities and green campus of IET
                DAVV Indore
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 group">
                <div className="relative overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2Fc79016cf4e3c4708a6b13e21831da2a8?format=webp&width=800"
                    alt="IET DAVV Campus Aerial View"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">Campus Overview</h3>
                    <p className="text-sm opacity-90">
                      Aerial view of our green campus
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 group">
                <div className="relative overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F62fe5cef9f1d491f8db2da6c0f4ac66e?format=webp&width=800"
                    alt="Modern Computer Laboratory"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">Computer Labs</h3>
                    <p className="text-sm opacity-90">
                      State-of-the-art computing facilities
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 group">
                <div className="relative overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F3f6c4bd2576e4a2a9456401e4c9c8782?format=webp&width=800"
                    alt="Academic Building"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">Academic Block</h3>
                    <p className="text-sm opacity-90">
                      Modern classrooms and labs
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-100/60 to-yellow-100/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 px-4 py-2 rounded-full text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Admissions Open
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Apply for CSBS Program 2025-29
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join the pioneering batch of Computer Science and Business
                Systems program
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {isApplicationOpen ? (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <CardTitle className="text-green-800">
                          Applications Open!
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <span className="text-green-700 font-medium">
                            {daysUntilDeadline > 0
                              ? `${daysUntilDeadline} days remaining to apply`
                              : "Last day to apply!"}
                          </span>
                        </div>
                        <p className="text-green-700">
                          Application deadline: <strong>July 15, 2025</strong>
                        </p>
                        <a
                          href="https://davv.mponline.gov.in/Portal/Services/DAVV/Entrance/NON_CET/Admission_Entrance_Form.aspx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-800">
                        Applications Closed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-red-700">
                        The application period for the CSBS program 2025-29 has
                        ended on July 15, 2025. Please check back next year for
                        the 2026-30 batch.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Card className="text-center p-4 bg-blue-50/50">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-800">75</div>
                    <div className="text-sm text-blue-600">Total Seats</div>
                  </Card>
                  <Card className="text-center p-4 bg-purple-50/50">
                    <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-800">
                      JEE
                    </div>
                    <div className="text-sm text-purple-600">
                      Based Admission
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-6 bg-white/80 backdrop-blur">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Admission Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">
                        Valid JEE Main/Advanced scores
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">
                        12th grade with Mathematics and Physics
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">
                        Domicile certificate for state quota
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Age limit: 17-23 years</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-indigo-600" />
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm">admissions@ietdavv.edu.in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm">+91-731-2570179</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-100/60 to-blue-100/60">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-600 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Academic Resources
              </div>
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
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse Notes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/papers">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 w-full sm:w-auto border-2 border-primary hover:bg-primary hover:text-white"
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
    </div>
  );
}
