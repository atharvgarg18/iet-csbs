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
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Users,
  GraduationCap,
  Zap,
  Target,
  ArrowRight,
  Award,
  TrendingUp,
  Calculator,
  Brain,
} from "lucide-react";
import { useState } from "react";

export default function Papers() {
  const [selectedBatch, setSelectedBatch] = useState("2024-28");

  const batches = [
    {
      id: "2024-28",
      name: "2024-28 Batch",
      status: "Active",
      students: 76,
      driveLink:
        "https://drive.google.com/drive/folders/1dltzniRbeR2vK4iOlXeIPGMU8cq1ioko",
      description: "MST and End Semester papers collection",
      color: "from-primary/20 to-secondary/20",
      borderColor: "border-primary/30",
      year: "2nd Year",
    },
    {
      id: "2025-29",
      name: "2025-29 Batch",
      status: "Coming Soon",
      students: "TBA",
      driveLink: null,
      description: "Papers will be available after first MST",
      color: "from-muted/20 to-muted/30",
      borderColor: "border-muted/30",
      year: "1st Year",
    },
  ];

  const examStructure = [
    {
      type: "MST 1",
      marks: 20,
      weightage: "Best 2 out of 3",
      icon: FileText,
      color: "from-blue-500/20 to-cyan-500/20",
      description: "Mid Semester Test 1",
    },
    {
      type: "MST 2",
      marks: 20,
      weightage: "Best 2 out of 3",
      icon: Brain,
      color: "from-purple-500/20 to-pink-500/20",
      description: "Mid Semester Test 2",
    },
    {
      type: "MST 3",
      marks: 20,
      weightage: "Best 2 out of 3",
      icon: Target,
      color: "from-green-500/20 to-emerald-500/20",
      description: "Mid Semester Test 3",
    },
    {
      type: "End Sem",
      marks: 60,
      weightage: "Mandatory",
      icon: Award,
      color: "from-orange-500/20 to-yellow-500/20",
      description: "End Semester Examination",
    },
  ];

  const paperCategories = [
    {
      name: "Data Structures & Algorithms",
      mstPapers: 3,
      endSemPapers: 2,
      semester: "3rd Sem",
      difficulty: "High",
      icon: Calculator,
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      name: "Object Oriented Programming",
      mstPapers: 3,
      endSemPapers: 2,
      semester: "3rd Sem",
      difficulty: "Medium",
      icon: Zap,
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      name: "Database Management Systems",
      mstPapers: 3,
      endSemPapers: 2,
      semester: "3rd Sem",
      difficulty: "Medium",
      icon: BookOpen,
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      name: "Business Economics",
      mstPapers: 3,
      endSemPapers: 2,
      semester: "3rd Sem",
      difficulty: "Low",
      icon: TrendingUp,
      color: "from-orange-500/20 to-yellow-500/20",
    },
  ];

  const selectedBatchData = batches.find((batch) => batch.id === selectedBatch);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "High":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "Low":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

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
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm">
              <FileText className="w-4 h-4" />
              Examination Papers
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                CSBS{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                  Papers
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Access previous year MST and End Semester papers to ace your
                examinations. Prepare smart, score high, and excel in your CSBS
                journey.
              </p>
            </div>
          </div>
        </section>

        {/* MST Structure Explanation */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/5 to-primary/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
                <Award className="w-4 h-4" />
                Exam Structure
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Understanding MST Pattern
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Know your examination structure to strategize your preparation
                effectively
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {examStructure.map((exam, index) => {
                const Icon = exam.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${exam.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {exam.type}
                      </h3>
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">
                        {exam.marks}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {exam.description}
                      </p>
                      <Badge variant="secondary" size="sm">
                        {exam.weightage}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Calculation Explanation */}
            <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm">
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Final Score Calculation
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    <strong>3 MSTs</strong> of 20 marks each →{" "}
                    <strong>Best 2 count</strong> = 40 marks
                    <br />
                    <strong>End Semester</strong> = 60 marks
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold">
                      Total = 100 marks per subject
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Batch Selection */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Select Your Batch
              </h2>
              <p className="text-lg text-muted-foreground">
                Access papers from your academic year
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {batches.map((batch) => {
                const isSelected = selectedBatch === batch.id;
                const isActive = batch.status === "Active";

                return (
                  <Card
                    key={batch.id}
                    className={`cursor-pointer transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-accent/5 border backdrop-blur-sm ${
                      isSelected
                        ? "border-primary shadow-2xl shadow-primary/20 ring-2 ring-primary/30"
                        : batch.borderColor
                    }`}
                    onClick={() => setSelectedBatch(batch.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${batch.color} rounded-xl flex items-center justify-center`}
                          >
                            <GraduationCap className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-foreground">
                              {batch.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={isActive ? "default" : "secondary"}
                                className={
                                  isActive
                                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                                    : ""
                                }
                              >
                                {batch.status}
                              </Badge>
                              <Badge variant="outline" size="sm">
                                {batch.year}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {batch.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">
                            {batch.students}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Students
                          </div>
                        </div>
                        <div className="text-center p-3 bg-background/50 rounded-lg">
                          <div className="text-lg font-bold text-secondary">
                            {isActive ? "Available" : "Soon"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Status
                          </div>
                        </div>
                      </div>

                      {isActive && batch.driveLink ? (
                        <a
                          href={batch.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Access Drive Folder
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      ) : (
                        <Button disabled className="w-full">
                          <Clock className="w-4 h-4 mr-2" />
                          Coming Soon
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Subject-wise Papers Preview */}
        {selectedBatchData?.status === "Active" && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6 mb-16">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium border border-secondary/20">
                  <Target className="w-4 h-4" />
                  Subject Overview
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Papers by Subject
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Explore examination papers organized by subjects for targeted
                  preparation
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paperCategories.map((subject, index) => {
                  const Icon = subject.icon;
                  return (
                    <Card
                      key={index}
                      className="group hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-sm"
                    >
                      <CardContent className="p-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                          {subject.name}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              MST Papers:
                            </span>
                            <Badge variant="secondary">
                              {subject.mstPapers}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              End Sem:
                            </span>
                            <Badge variant="secondary">
                              {subject.endSemPapers}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Difficulty:
                            </span>
                            <Badge
                              className={getDifficultyColor(subject.difficulty)}
                            >
                              {subject.difficulty}
                            </Badge>
                          </div>
                          <div className="text-center pt-2">
                            <Badge variant="outline" size="sm">
                              {subject.semester}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="text-center mt-12">
                <a
                  href={selectedBatchData.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-gradient-to-r from-accent to-primary text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 text-lg px-8 py-6">
                    <FileText className="w-5 h-5 mr-2" />
                    Explore All Papers
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Study Tips Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Card className="p-12 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-xl shadow-2xl shadow-accent/10">
              <CardContent>
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl flex items-center justify-center mx-auto">
                    <Brain className="w-10 h-10 text-accent" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                    Strategic Preparation
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Remember: Only your best 2 MST scores count! Use this to
                    your advantage - focus on consistent performance and you
                    have a buffer for one exam.
                  </p>
                  <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">40%</div>
                      <div className="text-sm text-muted-foreground">
                        MST Weightage
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        60%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        End Sem
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">
                        Best 2
                      </div>
                      <div className="text-sm text-muted-foreground">
                        MST Count
                      </div>
                    </div>
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
