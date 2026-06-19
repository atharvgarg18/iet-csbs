import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Download, ChevronDown } from 'lucide-react';
import { Reveal, StaggerContainer, StaggerItem, MagneticButton } from "@/components/MotionWrappers";
import { motion, AnimatePresence } from "framer-motion";
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
      title: "Semester 01",
      year: "1st Year",
      description: "Foundation semester — mathematics, basic CS, and communication skills.",
      subjects: [
        "Discrete Mathematics",
        "Introductory Topics in Statistics, Probability and Calculus",
        "Fundamentals of Computer Science + Lab",
        "Principles of Electrical Engineering + Lab",
        "Physics for Computing Science + Lab",
        "Business Communication & Value Science - I",
      ],
      downloadLink: "https://ietdavv.edu.in/images/downloads/syllabus/BTech_Iyr_CSBS_Scheme_syllabus_2024.pdf",
      credits: "22 Credits",
    },
    {
      id: 2,
      title: "Semester 02",
      year: "1st Year",
      description: "Data structures, economics, electronics, and statistical methods.",
      subjects: [
        "Linear Algebra",
        "Statistical Methods + Lab",
        "Data Structures and Algorithms + Lab",
        "Principles of Electronics + Lab",
        "Fundamentals of Economics",
        "Business Communication and Value Science – II",
        "Environmental Sciences",
      ],
      downloadLink: "https://ietdavv.edu.in/images/downloads/syllabus/BTech_Iyr_CSBS_Scheme_syllabus_2024.pdf",
      credits: "22 Credits",
    },
    {
      id: 3,
      title: "Semester 03",
      year: "2nd Year",
      description: "OOP, databases, computer architecture, and automata theory.",
      subjects: [
        "Formal Language and Automata Theory",
        "Computer Organization and Architecture + Lab",
        "Object Oriented Programming + Lab",
        "Database Management Systems + Lab",
        "Computational Statistics + Lab",
        "Indian Constitution",
        "Internship I",
      ],
      downloadLink: "https://res.cloudinary.com/dt326igsz/image/upload/v1760514550/II_Year_3rd_Sem_Syllabus_updated_iiyis1.pdf",
      credits: "22 Credits",
    },
    {
      id: 4,
      title: "Semester 04",
      year: "2nd Year",
      description: "OS, algorithms, software engineering, and entrepreneurship.",
      subjects: [
        "Operating Systems + Lab (Unix)",
        "Design and Analysis of Algorithms + Lab",
        "Software Engineering + Lab",
        "Introduction to Innovation, IP Management and Entrepreneurship",
        "Design Thinking",
        "Operations Research + Lab",
        "Essence of Indian Traditional Knowledge",
      ],
      downloadLink: "https://res.cloudinary.com/ddv5limch/image/upload/v1770468034/IV_Sem_CSBS_Syllabus_byz1lx.pdf",
      credits: "22 Credits",
    },
    { id: 5, title: "Semester 05", year: "3rd Year", description: "Specialized topics in software engineering and business intelligence.", subjects: [], downloadLink: "", credits: "" },
    { id: 6, title: "Semester 06", year: "3rd Year", description: "Advanced algorithms, machine learning, and project work.", subjects: [], downloadLink: "", credits: "" },
    { id: 7, title: "Semester 07", year: "4th Year", description: "Industry-oriented subjects and major project development.", subjects: [], downloadLink: "", credits: "" },
    { id: 8, title: "Semester 08", year: "4th Year", description: "Capstone project, internship, and career preparation.", subjects: [], downloadLink: "", credits: "" },
  ];

  const toggleSemester = (id: number) => {
    setExpandedSemester(expandedSemester === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navigation />

      <main className="relative z-10 px-4 md:px-16 pt-48 pb-32 max-w-[1600px] mx-auto">
        <Reveal>
          <div className="mb-16">
            <p className="font-syne text-sm uppercase tracking-widest text-primary mb-4">Archive / 03</p>
            <h1 className="font-syne text-6xl md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.9]">
              Curriculum <br /> <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Syllabus</span>
            </h1>
          </div>
        </Reveal>

        {/* Admission & Syllabus Warning */}
        <div className="mb-24 border border-secondary/30 bg-secondary/5 p-8 md:p-12">
          <h3 className="font-syne text-2xl md:text-4xl font-bold uppercase text-secondary mb-4 tracking-tighter">
            ATTENTION: CURRICULUM REVISION
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl">
            The CSBS syllabus is undergoing a major revision. Content and structure might change starting this academic year (2026-27 onwards). Please refer to the official DTE/IET notifications for final confirmations.
          </p>
        </div>

        <div className="flex flex-col border-t border-border">
          {semesters.map((semester) => {
            const isExpanded = expandedSemester === semester.id;
            return (
              <div key={semester.id} className="border-b border-border">
                <button
                  onClick={() => toggleSemester(semester.id)}
                  className="w-full text-left py-8 md:py-12 group flex flex-col md:flex-row md:items-center justify-between hover-trigger"
                >
                  <div className="flex items-baseline gap-8">
                    <span className="font-syne text-2xl md:text-4xl text-muted-foreground group-hover:text-primary transition-colors">
                      {semester.id.toString().padStart(2, '0')}
                    </span>
                    <h2 className="font-syne text-3xl md:text-6xl font-bold uppercase tracking-tighter group-hover:pl-4 transition-all duration-300">
                      {semester.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-8 mt-4 md:mt-0">
                    <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase hidden md:block">
                      {semester.year} {semester.credits ? `// ${semester.credits}` : ''}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                      className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12 md:pl-24">
                        <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                          {semester.description}
                        </p>

                        {semester.subjects.length > 0 ? (
                          <ul className="space-y-4 mb-8">
                            {semester.subjects.map((subject, idx) => (
                              <li key={idx} className="flex gap-4 text-lg">
                                <span className="text-primary font-syne opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                                <span>{subject}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground italic mb-8">Syllabus details pending update.</p>
                        )}

                        {semester.downloadLink && (
                          <MagneticButton>
                            <a
                              href={semester.downloadLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-4 font-syne text-sm uppercase tracking-widest px-8 py-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-black transition-colors duration-300"
                            >
                              <Download className="w-4 h-4" />
                              Download PDF
                            </a>
                          </MagneticButton>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}
