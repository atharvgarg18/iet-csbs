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
  FolderOpen,
  Calendar,
  Clock,
  Star,
  Users,
  GraduationCap,
  Zap,
  Target,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function Notes() {
  const [selectedBatch, setSelectedBatch] = useState("2024-28");

  const batches = [
    {
      id: "2024-28",
      name: "2024-28 Batch",
      status: "Active",
      students: 76,
      driveLink:
        "https://drive.google.com/drive/folders/19Nf8oa_KdmTia81fagfMWgaBm1c9ZqnK",
      description: "Complete notes collection for the pioneering CSBS batch",
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
      description: "Notes will be available as the batch progresses",
      color: "from-muted/20 to-muted/30",
      borderColor: "border-muted/30",
      year: "1st Year",
    },
  ];

  const subjects = [
    {
      name: "Data Structures & Algorithms",
      icon: Target,
      semester: "3rd Sem",
      topics: 12,
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      name: "Object Oriented Programming",
      icon: Zap,
      semester: "3rd Sem",
      topics: 8,
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      name: "Database Management Systems",
      icon: BookOpen,
      semester: "3rd Sem",
      topics: 10,
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      name: "Business Economics",
      icon: TrendingUp,
      semester: "3rd Sem",
      topics: 6,
      color: "from-orange-500/20 to-yellow-500/20",
    },
  ];

  const selectedBatchData = batches.find((batch) => batch.id === selectedBatch);

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
              <BookOpen className="w-4 h-4" />
              Study Resources
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                CSBS{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                  Notes
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Comprehensive study materials and notes curated by students, for
                students. Your gateway to academic excellence in the CSBS
                program.
              </p>
            </div>
          </div>
        </section>

        {/* Batch Selection */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Select Your Batch
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose your academic year to access relevant study materials
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

        {/* Subject Preview (for active batch) */}
        {selectedBatchData?.status === "Active" && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6 mb-16">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
                  <Target className="w-4 h-4" />
                  Current Semester
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Subject-wise Notes Preview
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Get organized notes for each subject in your current semester
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((subject, index) => {
                  const Icon = subject.icon;
                  return (
                    <Card
                      key={index}
                      className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm"
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {subject.name}
                        </h3>
                        <div className="space-y-2">
                          <Badge variant="secondary" size="sm">
                            {subject.semester}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {subject.topics} Topics Available
                          </p>
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
                    <FolderOpen className="w-5 h-5 mr-2" />
                    Explore All Notes
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Info Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Card className="p-12 bg-gradient-to-br from-card to-secondary/5 border border-secondary/10 backdrop-blur-xl shadow-2xl shadow-secondary/10">
              <CardContent>
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-3xl flex items-center justify-center mx-auto">
                    <Users className="w-10 h-10 text-secondary" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                    Collaborative Learning
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Our notes are continuously updated and improved by the
                    entire CSBS community. Join us in building the most
                    comprehensive study resource.
                  </p>
                  <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        500+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Documents
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">
                        76
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Contributors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-sm text-muted-foreground">
                        Access
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
