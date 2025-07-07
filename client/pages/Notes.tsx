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
  BookOpen,
  Download,
  Eye,
  FileText,
  Calendar,
  Users,
  Star,
} from "lucide-react";

export default function Notes() {
  const sampleNotes = [
    {
      id: 1,
      title: "Data Structures and Algorithms",
      subject: "Computer Science",
      semester: "Semester 1",
      type: "Lecture Notes",
      author: "Dr. Sharma",
      date: "2024-01-15",
      pages: 45,
      rating: 4.8,
      downloads: 234,
    },
    {
      id: 2,
      title: "Business Communication Fundamentals",
      subject: "Business Systems",
      semester: "Semester 1",
      type: "Study Material",
      author: "Prof. Verma",
      date: "2024-01-20",
      pages: 32,
      rating: 4.6,
      downloads: 198,
    },
    {
      id: 3,
      title: "Programming in C++ - Complete Guide",
      subject: "Computer Science",
      semester: "Semester 2",
      type: "Comprehensive Notes",
      author: "Dr. Singh",
      date: "2024-02-10",
      pages: 78,
      rating: 4.9,
      downloads: 456,
    },
    {
      id: 4,
      title: "Database Management Systems",
      subject: "Computer Science",
      semester: "Semester 3",
      type: "Lecture Notes",
      author: "Prof. Gupta",
      date: "2024-03-05",
      pages: 56,
      rating: 4.7,
      downloads: 312,
    },
    {
      id: 5,
      title: "Business Analytics Introduction",
      subject: "Business Systems",
      semester: "Semester 2",
      type: "Case Studies",
      author: "Dr. Patel",
      date: "2024-02-25",
      pages: 28,
      rating: 4.5,
      downloads: 167,
    },
  ];

  const batches = [
    { id: "2024-28", label: "Batch 2024-28", year: "First Year" },
    { id: "2025-29", label: "Batch 2025-29", year: "Current Batch" },
  ];

  const getSubjectColor = (subject: string) => {
    return subject === "Computer Science"
      ? "bg-primary/10 text-primary"
      : "bg-secondary/10 text-secondary";
  };

  const renderNotesGrid = (batchId: string) => {
    const filteredNotes = sampleNotes.filter(() => true); // For demo, showing all notes for both batches

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Study Materials
            </h3>
            <p className="text-muted-foreground">
              Access comprehensive notes and study materials for your courses
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredNotes.length} Resources Available
          </Badge>
        </div>

        <div className="grid gap-6">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/30"
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getSubjectColor(note.subject)}>
                        {note.subject}
                      </Badge>
                      <Badge variant="outline">{note.semester}</Badge>
                      <Badge variant="secondary">{note.type}</Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {note.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {note.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(note.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {note.pages} pages
                      </span>
                    </CardDescription>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{note.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {note.downloads} downloads
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 sm:flex-none">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card className="p-12 text-center">
            <CardContent>
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Notes Available
              </h3>
              <p className="text-muted-foreground">
                Notes for this batch will be uploaded soon. Check back later!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-green-50/20">
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
              <TabsList className="grid w-full max-w-md grid-cols-2 lg:grid-cols-2">
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
                {renderNotesGrid(batch.id)}
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
    </div>
  );
}
