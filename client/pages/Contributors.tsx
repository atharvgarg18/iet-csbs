import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Reveal, StaggerContainer, StaggerItem, MagneticButton } from "@/components/MotionWrappers";
import { Github, Linkedin } from 'lucide-react';

export default function Contributors() {
  useEffect(() => {
    document.title = "Contributors - CSBS IET DAVV";
  }, []);

  const departments = [
    {
      name: "Development & Maintenance",
      description: "Frontend and backend architecture of the platform",
      members: [
        {
          name: "Atharv Garg",
          image: "https://html-starter-beige-beta.vercel.app/1749249981340.jpg",
          linkedin: "https://www.linkedin.com/in/atharvgrg/",
          github: "https://github.com/atharvgrg",
        },
      ],
    },
    {
      name: "Designing Unit",
      description: "UI/UX design and visual identity creation",
      members: [
        {
          name: "Suwaaq Kothari",
          image: "https://html-starter-beige-beta.vercel.app/suwaaq.jpg",
          linkedin: "https://github.com/Skothari-11677",
          github: "https://github.com/Skothari-11677/builder-quantum-den",
        },
        {
          name: "Naman Kasliwal",
          image: "https://html-starter-beige-beta.vercel.app/naman.jpg",
          linkedin: "http://www.linkedin.com/in/naman-kasliwal-082a4b33a",
          github: null,
        },
      ],
    },
    {
      name: "Notes Department",
      description: "Curating and organizing comprehensive study materials",
      members: [
        {
          name: "Bharat Jain Sanghvi",
          image: "https://html-starter-beige-beta.vercel.app/bharat.jpg",
          linkedin: "http://www.linkedin.com/in/bharat-jain-76046832a",
          github: "https://github.com/jainsanghvi-bharat15",
        },
      ],
    },
    {
      name: "MST's & End Sem Papers",
      description: "Managing examination papers and assessment materials",
      members: [
        {
          name: "Advait Kshirsagar",
          image: null,
          linkedin: "https://www.linkedin.com/in/advait-kshirsagar-93b46032a",
          github: "https://github.com/finoyes",
        },
        {
          name: "Gurpreet Singh Bhatia",
          image: null,
          linkedin: "https://linkedin.com/in/gurpreet-singh-bhatia-73713a231",
          github: null,
        },
      ],
    },
    {
      name: "Gallery Division",
      description: "Capturing and showcasing campus life and events",
      members: [
        {
          name: "Bhumi Jain",
          image: null,
          linkedin: "http://linkedin.com/in/bhumi-jain-9a919932b",
          github: null,
        },
        {
          name: "Pranamya Sharma",
          image: null,
          linkedin: "https://www.linkedin.com/in/pranamya-sharma-425149321",
          github: "https://github.com/PranamyaSharma05",
        },
      ],
    },
    {
      name: "Overview Unit",
      description: "Program overview and strategic content management",
      members: [
        {
          name: "Kanha Agrawal",
          image: null,
          linkedin: "https://linkedin.com/in/kanha-agrawal-3b2403331",
          github: null,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] relative">
      <Navigation />

      <main className="relative z-10 px-4 sm:px-8 md:px-16 pt-48 pb-32 max-w-[1600px] mx-auto">
        <Reveal>
          <div className="mb-32">
            <p className="font-syne text-sm uppercase tracking-widest text-[#00F0FF] mb-4">Department / 06</p>
            <h1 className="font-syne text-[12vw] md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.85]">
              System <br /> <span className="text-transparent" style={{ WebkitTextStroke: '2px #FAFAFA' }}>Contributors</span>
            </h1>
          </div>
        </Reveal>

        <div className="space-y-32">
          {departments.map((dept, deptIdx) => (
            <div key={deptIdx} className="border-t border-white/10 pt-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Department Info */}
                <div className="lg:col-span-4">
                  <Reveal>
                    <div className="sticky top-32">
                      <span className="font-syne text-5xl md:text-7xl font-bold tracking-tighter text-white/10 mb-4 block leading-none">
                        {(deptIdx + 1).toString().padStart(2, '0')}
                      </span>
                      <h2 className="font-syne text-3xl md:text-4xl font-bold uppercase tracking-tighter text-[#00F0FF] mb-4">
                        {dept.name}
                      </h2>
                      <p className="text-lg text-white/50 font-light leading-relaxed">
                        {dept.description}
                      </p>
                    </div>
                  </Reveal>
                </div>

                {/* Members List */}
                <div className="lg:col-span-8">
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {dept.members.map((member, memberIdx) => (
                      <StaggerItem key={memberIdx}>
                        <div className="group relative bg-[#111111] border border-white/10 p-8 hover:border-[#00F0FF]/50 transition-colors duration-500 overflow-hidden h-full flex flex-col justify-between hover-trigger">
                          <div className="absolute inset-0 bg-[#00F0FF]/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />

                          <div className="relative z-10 flex flex-col gap-6 h-full">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#222222] border border-white/10 shrink-0">
                                {member.image ? (
                                  <img src={member.image} alt={member.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-syne text-xl text-white/50">
                                    {member.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <h3 className="font-syne text-2xl font-bold uppercase tracking-tight group-hover:text-[#00F0FF] transition-colors duration-300">
                                {member.name}
                              </h3>
                            </div>

                            <div className="flex gap-4 mt-auto pt-8 border-t border-white/10">
                              {member.github && (
                                <MagneticButton>
                                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#FAFAFA] hover:text-[#050505] transition-colors duration-300">
                                    <Github className="w-5 h-5" />
                                  </a>
                                </MagneticButton>
                              )}
                              {member.linkedin && (
                                <MagneticButton>
                                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors duration-300">
                                    <Linkedin className="w-5 h-5" />
                                  </a>
                                </MagneticButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
