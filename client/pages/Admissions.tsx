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
  GraduationCap,
  Users,
  Award,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Zap,
  TrendingUp,
  Shield,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Admissions() {
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0);
  const [isApplicationOpen, setIsApplicationOpen] = useState(true);

  useEffect(() => {
    // Registration reopened for second counselling with 75 additional seats
    // Applications are currently open following the announcement on August 6, 2025
    setIsApplicationOpen(true);
    setDaysUntilDeadline(0); // Will show "Registration Open" message
  }, []);

  const admissionSteps = [
    {
      step: 1,
      title: "Register Online",
      description:
        "Complete your application form through the official DAVV portal",
      icon: FileText,
      color: "primary",
      status: "active",
    },
    {
      step: 2,
      title: "Direct Counselling",
      description:
        "Students will be directly called for counselling based on JEE scores",
      icon: Award,
      color: "secondary",
      status: "upcoming",
    },
    {
      step: 3,
      title: "College-level Counselling",
      description: "Attend counselling session at IET DAVV campus",
      icon: Users,
      color: "accent",
      status: "upcoming",
    },
    {
      step: 4,
      title: "Seat Allocation",
      description:
        "Seats allocated based on merit rank until all 150 seats are filled",
      icon: CheckCircle,
      color: "primary",
      status: "upcoming",
    },
  ];

  const highlights = [
    {
      title: "Industry Partnership",
      description: "Curriculum designed in collaboration with TCS",
      icon: Target,
      value: "TCS",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "Total Seats",
      description: "Increased seats available for this premium program",
      icon: Users,
      value: "150",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: "Average Package",
      description: "Excellent placement opportunities await",
      icon: TrendingUp,
      value: "₹7L+",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: "Program Duration",
      description: "Comprehensive 4-year undergraduate program",
      icon: GraduationCap,
      value: "4 Years",
      color: "from-orange-500/20 to-yellow-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm">
              <GraduationCap className="w-4 h-4" />
              Admissions Open
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Join the Future of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                  Technology & Business
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Embark on a transformative journey with CSBS at IET DAVV Indore.
                Your gateway to becoming a tech leader who understands business.
              </p>
            </div>

            {/* Status Card */}
            {isApplicationOpen ? (
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 backdrop-blur-xl shadow-2xl shadow-green-500/20">
                <CardHeader>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <CardTitle className="text-green-400 font-bold text-xl">
                      Registration Reopened - 75 New Seats Added!
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-medium text-lg">
                        Second counselling announced
                      </span>
                    </div>
                    <p className="text-green-200 text-lg">
                      <strong className="text-green-300">75 additional seats</strong> have been added,
                      bringing total seats to <strong className="text-green-300">150</strong>
                    </p>
                    <a
                      href="https://davv.mponline.gov.in/Portal/Services/DAVV/Entrance/NON_CET/Admission_Entrance_Form.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 text-lg px-8 py-6">
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Apply for Second Counselling
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 backdrop-blur-xl shadow-2xl shadow-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-yellow-400 font-bold text-xl">
                    Counselling in Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-200">
                    First counselling completed. Second counselling with 75 additional seats
                    will be announced soon.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Program Highlights */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Why Choose CSBS?
              </h2>
              <p className="text-xl text-muted-foreground">
                Here's what makes this program extraordinary
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${highlight.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                        {highlight.value}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Admission Process */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
                <Shield className="w-4 h-4" />
                Simple & Transparent
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Admission Process
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your journey to joining CSBS is straightforward with direct
                counselling. Here's exactly what you need to know.
              </p>
            </div>

            <div className="space-y-8">
              {admissionSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === admissionSteps.length - 1;

                return (
                  <div key={step.step} className="relative">
                    {/* Connection Line */}
                    {!isLast && (
                      <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-primary/30 to-secondary/30"></div>
                    )}

                    <Card className="hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-6">
                          {/* Step Number & Icon */}
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <Badge variant="secondary" className="px-3 py-1">
                              Step {step.step}
                            </Badge>
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground mb-2">
                                {step.title}
                              </h3>
                              <p className="text-lg text-muted-foreground">
                                {step.description}
                              </p>
                            </div>

                            {step.step === 1 && isApplicationOpen && (
                              <a
                                href="https://davv.mponline.gov.in/Portal/Services/DAVV/Entrance/NON_CET/Admission_Entrance_Form.aspx"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button className="mt-4 bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Start Your Application
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Important Note */}
            <Card className="mt-12 p-8 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm">
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Merit-Based Selection
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>Important:</strong> After registration closes,
                      students will be directly called for counselling based on
                      their JEE scores. Counselling will be conducted at the
                      college level where students with better ranks will be
                      given preference for admission. The process continues
                      until all 75 seats are filled.
                      <span className="text-primary font-medium">
                        {" "}
                        Your JEE rank determines your admission priority.
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Card className="p-12 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-xl shadow-2xl shadow-secondary/10">
              <CardContent>
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-3xl flex items-center justify-center mx-auto">
                    <Heart className="w-10 h-10 text-secondary" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                    Ready to Transform Your Future?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Don't let this opportunity slip away. Join a program that's
                    designed to make you industry-ready from day one.
                  </p>
                  {isApplicationOpen ? (
                    <div className="space-y-4">
                      <a
                        href="https://davv.mponline.gov.in/Portal/Services/DAVV/Entrance/NON_CET/Admission_Entrance_Form.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all duration-300 text-xl px-12 py-6">
                          <Zap className="w-6 h-6 mr-2" />
                          Apply Now - Secure Your Spot!
                          <ArrowRight className="w-6 h-6 ml-2" />
                        </Button>
                      </a>
                      <p className="text-sm text-muted-foreground">
                        ⏰ Only {daysUntilDeadline} days left to apply
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg text-muted-foreground">
                      Applications will reopen for the next academic year. Stay
                      connected!
                    </p>
                  )}
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
