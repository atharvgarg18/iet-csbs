import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Download,
  GraduationCap,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Semester {
  id: number;
  title: string;
  year: string;
  description: string;
  subjects: string[];
  downloadLink: string;
  credits: string;
}

export default function Syllabus() {
  const [expandedSemester, setExpandedSemester] = useState<number | null>(null);

  useEffect(() => {
    document.title = "Syllabus - CSBS IET DAVV";
  }, []);

  const semesters: Semester[] = [
    {
      id: 1,
      title: "Semester 1",
      year: "1st Year",
      description: "Foundation semester — mathematics, basic CS, and communication skills",
      subjects: [
        "Discrete Mathematics",
        "Introductory Topics in Statistics, Probability and Calculus",
        "Fundamentals of Computer Science + Lab",
        "Principles of Electrical Engineering + Lab",
        "Physics for Computing Science + Lab",
        "Business Communication & Value Science - I",
      ],
      downloadLink:
        "https://ietdavv.edu.in/images/downloads/syllabus/BTech_Iyr_CSBS_Scheme_syllabus_2024.pdf",
      credits: "22 Credits",
    },
    {
      id: 2,
      title: "Semester 2",
      year: "1st Year",
      description: "Data structures, economics, electronics, and statistical methods",
      subjects: [
        "Linear Algebra",
        "Statistical Methods + Lab",
        "Data Structures and Algorithms + Lab",
        "Principles of Electronics + Lab",
        "Fundamentals of Economics",
        "Business Communication and Value Science – II",
        "Environmental Sciences",
      ],
      downloadLink:
        "https://ietdavv.edu.in/images/downloads/syllabus/BTech_Iyr_CSBS_Scheme_syllabus_2024.pdf",
      credits: "22 Credits",
    },
    {
      id: 3,
      title: "Semester 3",
      year: "2nd Year",
      description: "OOP, databases, computer architecture, and automata theory",
      subjects: [
        "Formal Language and Automata Theory",
        "Computer Organization and Architecture + Lab",
        "Object Oriented Programming + Lab",
        "Database Management Systems + Lab",
        "Computational Statistics + Lab",
        "Indian Constitution",
        "Internship I",
      ],
      downloadLink:
        "https://res.cloudinary.com/dt326igsz/image/upload/v1760514550/II_Year_3rd_Sem_Syllabus_updated_iiyis1.pdf",
      credits: "22 Credits",
    },
    {
      id: 4,
      title: "Semester 4",
      year: "2nd Year",
      description: "OS, algorithms, software engineering, and entrepreneurship",
      subjects: [
        "Operating Systems + Lab (Unix)",
        "Design and Analysis of Algorithms + Lab",
        "Software Engineering + Lab",
        "Introduction to Innovation, IP Management and Entrepreneurship",
        "Design Thinking",
        "Operations Research + Lab",
        "Essence of Indian Traditional Knowledge",
      ],
      downloadLink:
        "https://res.cloudinary.com/ddv5limch/image/upload/v1770468034/IV_Sem_CSBS_Syllabus_byz1lx.pdf",
      credits: "22 Credits",
    },
    {
      id: 5,
      title: "Semester 5",
      year: "3rd Year",
      description: "Specialized topics in software engineering and business intelligence",
      subjects: [],
      downloadLink: "",
      credits: "",
    },
    {
      id: 6,
      title: "Semester 6",
      year: "3rd Year",
      description: "Advanced algorithms, machine learning, and project work",
      subjects: [],
      downloadLink: "",
      credits: "",
    },
    {
      id: 7,
      title: "Semester 7",
      year: "4th Year",
      description: "Industry-oriented subjects and major project development",
      subjects: [],
      downloadLink: "",
      credits: "",
    },
    {
      id: 8,
      title: "Semester 8",
      year: "4th Year",
      description: "Capstone project, internship, and career preparation",
      subjects: [],
      downloadLink: "",
      credits: "",
    },
  ];

  const toggleSemester = (id: number) => {
    setExpandedSemester(expandedSemester === id ? null : id);
  };

  const availableSemesters = semesters.filter((s) => s.subjects.length > 0);
  const upcomingSemesters = semesters.filter((s) => s.subjects.length === 0);

  const yearColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    "1st Year": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", icon: "text-primary" },
    "2nd Year": { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/20", icon: "text-secondary" },
    "3rd Year": { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20", icon: "text-accent" },
    "4th Year": { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", icon: "text-primary" },
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Academic Curriculum</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            CSBS Syllabus
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive curriculum designed in collaboration with TCS — covering 8 semesters across 4 years
          </p>
        </div>

        {/* Full Curriculum Download */}
        <Card className="mb-12 border border-primary/10 bg-gradient-to-r from-card to-primary/5">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Complete CSBS Curriculum
                </h2>
                <p className="text-muted-foreground">
                  Full 4-year program overview — 180 Credits • 8 Semester Pattern
                </p>
              </div>
              <a
                href="https://info.tcs.com/rs/744-FUI-742/images/AY%2020-21%20-%20CSBS%20Curriculum%20-%207%20Sem%20Pattern%20180%20Credits.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="shadow-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Semester-wise Syllabus */}
        <div className="space-y-12">
          {/* Available Semesters (with subjects) */}
          <div className="space-y-4">
            {availableSemesters.map((semester) => {
              const isExpanded = expandedSemester === semester.id;
              const colors = yearColors[semester.year];

              return (
                <Card
                  key={semester.id}
                  className="border border-border/50 hover:border-border transition-colors overflow-hidden"
                >
                  {/* Semester Header — clickable to expand */}
                  <button
                    onClick={() => toggleSemester(semester.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-lg font-bold ${colors.text}`}>
                        {semester.id}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {semester.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {semester.year}
                        </Badge>
                        {semester.credits && (
                          <Badge variant="outline" className="text-xs">
                            {semester.credits}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {semester.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Expanded Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    <div className="px-5 sm:px-6 pb-6 border-t border-border/50">
                      {/* Subject List */}
                      <div className="mt-5 grid gap-2">
                        {semester.subjects.map((subject, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className={`w-6 h-6 rounded-md ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                              <span className={`text-xs font-semibold ${colors.text}`}>
                                {index + 1}
                              </span>
                            </div>
                            <span className="text-sm text-foreground">
                              {subject}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Download Button */}
                      {semester.downloadLink && (
                        <div className="mt-5">
                          <a
                            href={semester.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className={`${colors.border} ${colors.text} hover:${colors.bg}`}>
                              <Download className="w-4 h-4 mr-2" />
                              Download Semester {semester.id} Syllabus PDF
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Upcoming Semesters */}
          {upcomingSemesters.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Upcoming Semesters</h2>
                  <p className="text-sm text-muted-foreground">Syllabus will be updated as the program progresses</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {upcomingSemesters.map((semester) => {
                  const colors = yearColors[semester.year];
                  return (
                    <Card key={semester.id} className="border-dashed border-border/50 bg-muted/10">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center`}>
                            <span className={`text-sm font-bold ${colors.text}`}>
                              {semester.id}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground text-sm">{semester.title}</h3>
                            <span className="text-xs text-muted-foreground">{semester.year}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {semester.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <Card className="border border-border/50 bg-muted/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-foreground">8</div>
                  <div className="text-sm text-muted-foreground">Semesters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">180</div>
                  <div className="text-sm text-muted-foreground">Total Credits</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">4</div>
                  <div className="text-sm text-muted-foreground">Years Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TCS</div>
                  <div className="text-sm text-muted-foreground">Industry Partner</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
