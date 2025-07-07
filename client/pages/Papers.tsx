import Navigation from "@/components/Navigation";
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
} from "lucide-react";

export default function Papers() {
  const driveLinks = {
    "2024-28":
      "https://drive.google.com/drive/folders/1dltzniRbeR2vK4iOlXeIPGMU8cq1ioko",
    "2025-29":
      "https://drive.google.com/drive/folders/1dltzniRbeR2vK4iOlXeIPGMU8cq1ioko", // Placeholder - will be updated when available
  };

  const batches = [
    { id: "2024-28", label: "2024-28" },
    { id: "2025-29", label: "2025-29" },
  ];

  const getExamTypeColor = (examType: string) => {
    const colors = {
      "Mid-Term": "bg-blue-100 text-blue-800",
      Final: "bg-red-100 text-red-800",
      "End-Semester": "bg-red-100 text-red-800",
      Quiz: "bg-green-100 text-green-800",
      "Case Study": "bg-purple-100 text-purple-800",
      Assignment: "bg-yellow-100 text-yellow-800",
    };
    return (
      colors[examType as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800",
    };
    return (
      colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const renderPapersGrid = (batchId: string) => {
    const filteredPapers = samplePapers.filter(() => true); // For demo, showing all papers for both batches

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Test Papers & Examinations
            </h3>
            <p className="text-muted-foreground">
              Practice with previous year papers and sample tests
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredPapers.length} Papers Available
          </Badge>
        </div>

        <div className="grid gap-6">
          {filteredPapers.map((paper) => (
            <Card
              key={paper.id}
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-secondary/30"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getExamTypeColor(paper.examType)}>
                        {paper.examType}
                      </Badge>
                      <Badge variant="outline">{paper.semester}</Badge>
                      <Badge className={getDifficultyColor(paper.difficulty)}>
                        {paper.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {paper.title}
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-primary">
                      {paper.subject}
                    </CardDescription>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{paper.maxMarks} marks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{paper.duration}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(paper.date).toLocaleDateString()}
                    </span>
                    <span>{paper.academic_year}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <Card className="p-12 text-center">
            <CardContent>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Papers Available
              </h3>
              <p className="text-muted-foreground">
                Test papers for this batch will be uploaded soon. Check back
                later!
              </p>
            </CardContent>
          </Card>
        )}
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
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium">
              <FileText className="w-4 h-4" />
              Test Papers
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Examination{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
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
                      className="text-center"
                    >
                      <div>
                        <div className="font-medium">{batch.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {batch.year}
                        </div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {batches.map((batch) => (
                <TabsContent key={batch.id} value={batch.id} className="mt-8">
                  {renderPapersGrid(batch.id)}
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
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
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

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
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

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
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
      </div>
    </div>
  );
}
