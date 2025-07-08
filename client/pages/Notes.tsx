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
  BookOpen,
  Download,
  FileText,
  Star,
  ExternalLink,
  Clock,
} from "lucide-react";

export default function Notes() {
  const driveLinks = {
    "2024-28":
      "https://drive.google.com/drive/folders/19Nf8oa_KdmTia81fagfMWgaBm1c9ZqnK",
  };

  const batches = [
    { id: "2024-28", label: "2024-28", hasContent: true },
    { id: "2025-29", label: "2025-29", hasContent: false },
  ];

  const renderNotesContent = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);

    if (!batch?.hasContent) {
      return (
        <div className="space-y-8">
          <div className="text-center space-y-6">
            <h3 className="text-3xl font-bold text-foreground">
              Study Materials for Batch {batchId}
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
                  Study materials and notes for Batch {batchId} will be
                  available once classes begin.
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
            Study Materials for Batch {batchId}
          </h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive notes and study materials organized by the
            Notes Department
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
            <CardContent className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-foreground">
                  Google Drive Repository
                </h4>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  All study materials, lecture notes, and reference documents
                  for Batch {batchId} are organized in our Google Drive folder.
                </p>
              </div>

              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2">
                  Curated by: Bharat Jain Sanghvi
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
                      className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Access Drive Folder
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    Lecture Notes
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Comprehensive
                  </div>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <BookOpen className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    Study Materials
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Well Organized
                  </div>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-sm font-medium text-foreground">
                    Reference Docs
                  </div>
                  <div className="text-xs text-muted-foreground">
                    High Quality
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              Study Resources
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Course{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Notes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access comprehensive study materials, lecture notes, and reference
              documents for all CSBS courses, organized by batch and semester.
            </p>
          </div>
        </section>

        {/* Notes Content */}
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
                  {renderNotesContent(batch.id)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Need Help Finding Resources?
            </h2>
            <p className="text-lg text-muted-foreground">
              Can't find the notes you're looking for? Reach out to your
              classmates or faculty members for additional resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                Contact Faculty
              </Button>
              <Button variant="outline" size="lg">
                Join Study Groups
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
