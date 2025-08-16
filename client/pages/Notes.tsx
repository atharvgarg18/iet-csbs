import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ExternalLink,
  Users,
  Calendar,
  Download,
  Star,
} from "lucide-react";

export default function Notes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border border-primary/20">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              Study Resources
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                CSBS{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                  Notes
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Comprehensive study materials for the Class of 2028
              </p>
            </div>
          </div>
        </section>

        {/* Main Notes Section */}
        <section className="pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm">
              <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                  Class of 2028 Notes Collection
                </CardTitle>
                <div className="flex flex-col gap-2 sm:gap-4 justify-center items-center text-muted-foreground">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                    <div className="flex items-center gap-2 justify-center">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>150 Students</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Currently in 2nd Year</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span>Regularly Updated</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6">
                {/* Drive Access Card */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 sm:p-6 lg:p-8 text-center">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                    Complete Notes Archive
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
                    Access the comprehensive collection of notes, study
                    materials, and resources curated by your fellow classmates
                    and maintained by the Notes Department.
                  </p>

                  <a
                    href="https://drive.google.com/drive/folders/19Nf8oa_KdmTia81fagfMWgaBm1c9ZqnK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px]">
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Open Notes Drive
                    </Button>
                  </a>
                </div>

                {/* Quick Info */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-card to-accent/5 rounded-xl border border-accent/10">
                    <Download className="w-8 h-8 text-accent mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Easy Download
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Download individual files or entire folders
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-card to-primary/5 rounded-xl border border-primary/10">
                    <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Collaborative
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Notes shared by students, for students
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-card to-secondary/5 rounded-xl border border-secondary/10">
                    <Calendar className="w-8 h-8 text-secondary mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Updated
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Fresh content added regularly
                    </p>
                  </div>
                </div>

                {/* Contributors Credit */}
                <div className="text-center pt-8 border-t border-border/20">
                  <p className="text-muted-foreground">
                    Curated with ❤️ by the{" "}
                    <span className="text-primary font-medium">
                      Notes Department
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Managed by Bharat Jain Sanghvi
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
