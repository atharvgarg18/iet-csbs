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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Clock,
  Award,
  ExternalLink,
  Target,
  BookOpen,
  Users,
} from "lucide-react";

export default function Papers() {
  const driveLinks = {
    "2024-28":
      "https://drive.google.com/drive/folders/1dltzniRbeR2vK4iOlXeIPGMU8cq1ioko",
  };

  const batches = [
    { id: "2024-28", label: "2024-28", hasContent: true },
    { id: "2025-29", label: "2025-29", hasContent: false },
  ];

  const renderPapersContent = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);

    if (!batch?.hasContent) {
      return (
        <div className="space-y-8">
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              Test Papers for Batch {batchId}
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Classes haven't started for this batch yet
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center bg-gradient-to-br from-card to-muted/5 border border-border/50 backdrop-blur-sm">
              <CardContent>
                <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-muted-foreground" />
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-4">
                  Coming Soon
                </h4>
                <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                  Test papers and examination materials for Batch {batchId} will
                  be available once classes begin.
                </p>
                <Badge variant="secondary" className="px-4 py-2">
                  Stay tuned for updates
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    const driveLink = driveLinks[batchId as keyof typeof driveLinks];

    return (
      <div className="space-y-8">
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-bold text-foreground">
            Test Papers for Batch {batchId}
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access MST papers and End Semester examinations curated by our
            Papers Department
          </p>
        </div>

        {/* MST Structure Explanation */}
        <div className="max-w-5xl mx-auto mb-8">
          <Card className="p-6 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm">
            <CardContent className="space-y-6">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-foreground mb-2">
                  Assessment Structure
                </h4>
                <p className="text-muted-foreground">
                  Understanding the CSBS examination pattern
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">
                        MST (Mid Semester Test)
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        3 tests, best 2 count
                      </p>
                    </div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          20
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Marks each
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">
                          40
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total weightage
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">
                        End Semester
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Final examination
                      </p>
                    </div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        60
                      </div>
                      <div className="text-xs text-muted-foreground">Marks</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500">
            <CardContent className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-foreground">
                  Test Papers Repository
                </h4>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  All MST papers and End Semester examinations for Batch{" "}
                  {batchId} are organized in our Google Drive folder.
                </p>
              </div>

              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2">
                  Curated by: Advait Kshirsagar & Gurpreet Singh Bhatia
                </Badge>

                <div className="pt-4">
                  <a
                    href={driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 shadow-lg shadow-secondary/25"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Access Papers Folder
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    MST Papers
                  </div>
                  <div className="text-xs text-muted-foreground">
                    All 3 Tests
                  </div>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    End Sem
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Final Exams
                  </div>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    Previous Years
                  </div>
                  <div className="text-xs text-muted-foreground">Archive</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/10 dark:from-background dark:via-secondary/10 dark:to-accent/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary/20">
              <FileText className="w-4 h-4" />
              Test Papers
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Examination{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent animate-gradient">
                Papers
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Practice with previous year question papers, sample tests, and
              mock examinations to excel in your CSBS program assessments.
            </p>
          </div>
        </section>

        {/* Papers Content */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="2025-29" className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  {batches.map((batch) => (
                    <TabsTrigger
                      key={batch.id}
                      value={batch.id}
                      className="text-center font-medium"
                    >
                      {batch.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {batches.map((batch) => (
                <TabsContent key={batch.id} value={batch.id} className="mt-8">
                  {renderPapersContent(batch.id)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Study Tips Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-secondary/5 to-accent/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-3xl font-bold text-foreground">
                Exam Preparation Tips
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Make the most of these practice papers with our study
                recommendations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-primary/5 border border-primary/10">
                <CardContent className="pt-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Time Management
                  </h3>
                  <p className="text-muted-foreground">
                    Practice with time limits to improve your speed and accuracy
                    during actual exams
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-secondary/5 border border-secondary/10">
                <CardContent className="pt-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Pattern Recognition
                  </h3>
                  <p className="text-muted-foreground">
                    Analyze question patterns and marking schemes from previous
                    papers
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-accent/5 border border-accent/10">
                <CardContent className="pt-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Group Study</h3>
                  <p className="text-muted-foreground">
                    Discuss solutions with classmates to gain different
                    perspectives
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
