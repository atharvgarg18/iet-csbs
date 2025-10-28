import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Mail,
  Phone
} from "lucide-react";

export default function AboutDepartment() {
  const hodDetails = {
    name: "Dr. Chandra Prakash Patidar",
    designation: "Head of Department",
    department: "Computer Science and Business Systems",
    email: "cpatidar@ietdavv.edu.in",
    phone: "+91-9826490631",
    image: "https://res.cloudinary.com/dt326igsz/image/upload/v1761661763/WhatsApp_Image_2025-10-28_at_15.24.51_ptelxb.jpg",
    qualifications: "BE, ME, Ph.D.",
    experience: "19 Years",
    phdSupervision: {
      submitted: "02 Students Submitted PhD Thesis",
      registered: "05 PhD Students Registered"
    },
    subjects: [
      "Compiler Design",
      "Computer Organization",
      "Software Testing",
      "Machine Learning",
      "Android Programming",
      "Computer Hardware"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Department - CSBS IET DAVV"
        description="Learn about the Computer Science and Business Systems department at IET DAVV Indore"
      />
      <Navigation />

      <main className="relative">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 text-xs">About Us</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                Computer Science & Business Systems
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Institute of Engineering & Technology, DAVV Indore
              </p>
            </div>
          </div>
        </section>

        {/* Department Overview */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">About the Department</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {/* TODO: Add actual department description */}
                  The Computer Science and Business Systems (CSBS) department at IET DAVV represents 
                  a pioneering approach to engineering education, seamlessly integrating core computer 
                  science principles with essential business management concepts.
                </p>
                <p>
                  This unique program is designed to create professionals who can bridge the gap between 
                  technology and business, preparing students for leadership roles in the digital economy.
                </p>
                <p>
                  {/* TODO: Add more department-specific content */}
                  With state-of-the-art facilities and experienced faculty, the department focuses on 
                  practical learning, industry collaboration, and holistic development of students.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* HOD Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Head of Department
            </h2>
            
            <Card className="border-border/40 overflow-hidden">
              <CardContent className="p-0">
                {/* Top Section - Photo and Basic Info */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
                        <img 
                          src={hodDetails.image} 
                          alt={hodDetails.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold text-foreground mb-2">
                        {hodDetails.name}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-1">
                        {hodDetails.designation}
                      </p>
                      <p className="text-base text-muted-foreground mb-4">
                        {hodDetails.department}, IET DAVV Indore
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Badge className="text-sm px-3 py-1">
                          {hodDetails.qualifications}
                        </Badge>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {hodDetails.experience} Teaching Experience
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Details Grid */}
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* PhD Supervision */}
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                          <div className="w-1 h-6 bg-primary rounded-full"></div>
                          PhD Supervision
                        </h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                            <p className="text-sm text-muted-foreground">{hodDetails.phdSupervision.submitted}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                            <p className="text-sm text-muted-foreground">{hodDetails.phdSupervision.registered}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                          <div className="w-1 h-6 bg-primary rounded-full"></div>
                          Contact Information
                        </h4>
                        <div className="space-y-3 pl-4">
                          <a 
                            href={`mailto:${hodDetails.email}`} 
                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <span>{hodDetails.email}</span>
                          </a>
                          <a 
                            href={`tel:${hodDetails.phone}`} 
                            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Phone className="w-4 h-4 text-primary" />
                            </div>
                            <span>{hodDetails.phone}</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Teaching Subjects */}
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                        Teaching Subjects
                      </h4>
                      <div className="grid grid-cols-1 gap-2 pl-4">
                        {hodDetails.subjects.map((subject, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <div className="w-2 h-2 rounded-full bg-secondary"></div>
                            <span>{subject}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
