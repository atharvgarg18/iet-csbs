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
  Bell,
  Calendar,
  Download,
  ExternalLink,
  Pin,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function Notices() {
  // Current notices
  const notices = [
    {
      id: 1,
      title: "Third Semester Time Table - July 2025",
      description:
        "Class schedule for III Semester B.Tech Computer Science & Business Systems (Session: July 2025 to Nov. 2025)",
      date: "2025-07-01",
      type: "Academic",
      priority: "high",
      downloadLink:
        "https://html-starter-beige-beta.vercel.app/BTech_CSBS_Sem_III_Time%20Table_July_25.pdf",
      isPDF: true,
    },
    {
      id: 2,
      title: "Application Deadline Extended",
      description:
        "Last date for CSBS program applications has been extended to July 20th, 2025.",
      date: "2025-07-15",
      type: "Administrative",
      priority: "high",
      downloadLink:
        "https://ietdavv.edu.in/images/downloads/Admission/Adv_CSBS_BDes_Web_2025.pdf",
      isPDF: true,
    },
  ];

  const getNoticeTypeColor = (type: string) => {
    const colors = {
      Academic: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      Event: "bg-green-500/10 text-green-400 border-green-500/30",
      Administrative: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-500/10 text-gray-400 border-gray-500/30"
    );
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "high") return <Pin className="w-4 h-4 text-red-400" />;
    if (priority === "medium")
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    return <Bell className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
              <Bell className="w-4 h-4" />
              Official Notices
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              CSBS{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
                Notices
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest announcements, academic schedules,
              and important information for the CSBS program.
            </p>
          </div>
        </section>

        {/* Notices Grid */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Latest Notices
                </h2>
                <p className="text-muted-foreground">
                  Important updates and announcements
                </p>
              </div>
              <Badge variant="secondary" className="px-4 py-2">
                {notices.length} Active Notices
              </Badge>
            </div>

            <div className="grid gap-6">
              {notices.map((notice) => (
                <Card
                  key={notice.id}
                  className="hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-card to-primary/5 border border-primary/10 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          {getPriorityIcon(notice.priority)}
                          <Badge className={getNoticeTypeColor(notice.type)}>
                            {notice.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(notice.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                        <CardTitle className="text-xl text-foreground hover:text-primary transition-colors duration-300">
                          {notice.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {notice.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {notice.isPDF ? (
                        <a
                          href={notice.downloadLink}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="flex-1 sm:flex-none">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </a>
                      ) : (
                        <Button size="sm" className="flex-1 sm:flex-none">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <Card className="p-8 text-center bg-gradient-to-br from-card to-muted/5 border border-border/50 backdrop-blur-sm">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  More Notices Coming Soon
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This section will be regularly updated with new notices,
                  announcements, and important information for CSBS students.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
