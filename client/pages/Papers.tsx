import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ExternalLink,
  Users,
  Calendar,
  Award,
  Star,
  Calculator,
  TrendingUp,
} from "lucide-react";

export default function Papers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary/20">
              <FileText className="w-4 h-4" />
              Exam Resources
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                CSBS{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-primary animate-gradient">
                  Papers
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                MST and End Semester papers for the Class of 2028
              </p>
            </div>
          </div>
        </section>

        {/* Main Papers Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* MST Grading System Explanation */}
            <Card className="bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  MST Grading System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-accent">3</div>
                    <div className="text-foreground font-medium">MST Tests</div>
                    <div className="text-sm text-muted-foreground">
                      Per semester
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-secondary">
                      Best 2
                    </div>
                    <div className="text-foreground font-medium">Count</div>
                    <div className="text-sm text-muted-foreground">
                      @ 20 marks each
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">
                      40 + 60
                    </div>
                    <div className="text-foreground font-medium">
                      Total Marks
                    </div>
                    <div className="text-sm text-muted-foreground">
                      MST + End Sem
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Papers Access */}
            <Card className="overflow-hidden hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-3xl font-bold text-foreground mb-4">
                  Class of 2028 Papers Collection
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>76 Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>2nd Year</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Updated After Each MST</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Drive Access Card */}
                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Complete Papers Archive
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Access all MST and End Semester question papers from
                    previous attempts. Perfect for exam preparation and
                    understanding question patterns.
                  </p>

                  <a
                    href="https://drive.google.com/drive/folders/1dltzniRbeR2vK4iOlXeIPGMU8cq1ioko"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all duration-300 text-lg px-8 py-6">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Open Papers Drive
                    </Button>
                  </a>
                </div>

                {/* Quick Info */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-card to-secondary/5 rounded-xl border border-secondary/10">
                    <Award className="w-8 h-8 text-secondary mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      MST Papers
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Previous test papers for practice
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-card to-accent/5 rounded-xl border border-accent/10">
                    <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      End Sem
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      End semester question papers
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-card to-primary/5 rounded-xl border border-primary/10">
                    <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Solutions
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Sample solutions when available
                    </p>
                  </div>
                </div>

                {/* Contributors Credit */}
                <div className="text-center pt-8 border-t border-border/20">
                  <p className="text-muted-foreground">
                    Curated with ❤️ by the{" "}
                    <span className="text-secondary font-medium">
                      MST's & End Sem Papers Department
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Managed by Advait Kshirsagar & Gurpreet Singh Bhatia
                  </p>
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
