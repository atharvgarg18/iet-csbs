import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Reveal, StaggerContainer, StaggerItem } from "@/components/MotionWrappers";
import { OptimizedImage } from '@/components/OptimizedImage';

export default function AboutDepartment() {
  useEffect(() => {
    document.title = "About CSBS - IET DAVV";
  }, []);

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

  const sections = [
    {
      title: "Vision",
      content: "To build a strong foundation in Computer Science while equipping students with an understanding of management and humanities, ensuring they are well-prepared for the evolving demands of the global IT industry."
    },
    {
      title: "Mission",
      content: "To foster an environment of continuous learning and innovation, collaborating with industry leaders like TCS to deliver a curriculum that bridges the gap between theoretical knowledge and practical business applications."
    },
    {
      title: "The TCS Partnership",
      content: "The CSBS program was architected in direct collaboration with Tata Consultancy Services (TCS). This unique partnership ensures the syllabus is always aligned with the latest industry paradigms, including AI, Machine Learning, and Design Thinking."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] relative">
      <Navigation />

      <main className="relative z-10 px-8 md:px-16 pt-48 pb-32 max-w-[1600px] mx-auto">
        <Reveal>
          <div className="mb-32">
            <p className="font-syne text-sm uppercase tracking-widest text-[#00F0FF] mb-4">Department / 05</p>
            <h1 className="font-syne text-[12vw] md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.85]">
              About <br /> <span className="text-transparent" style={{ WebkitTextStroke: '2px #FAFAFA' }}>The Program</span>
            </h1>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-48">
          <div className="lg:col-span-5 h-[50vh] lg:h-[80vh] relative overflow-hidden bg-[#111111] border border-white/10 flex items-center justify-center">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
            <h2 className="font-syne text-[25vw] lg:text-[18vw] font-bold text-white/5 leading-none tracking-tighter rotate-90">
              CSBS
            </h2>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <StaggerContainer className="space-y-16">
              <StaggerItem>
                <p className="font-syne text-3xl md:text-5xl leading-tight font-bold tracking-tighter mb-16">
                  Computer Science and Business Systems (CSBS) is a pioneering engineering discipline designed to meet the demands of the modern industrial landscape.
                </p>
              </StaggerItem>

              {sections.map((section, idx) => (
                <StaggerItem key={idx} className="border-t border-white/10 pt-8">
                  <h3 className="font-syne text-xl md:text-2xl font-bold uppercase text-[#00F0FF] mb-4 tracking-tighter">
                    {section.title}
                  </h3>
                  <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light">
                    {section.content}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>

        {/* HOD Section */}
        <Reveal>
          <div className="border-t border-white/10 pt-32">
            <h2 className="font-syne text-sm uppercase tracking-[0.3em] text-[#FF3C00] mb-16 border border-[#FF3C00]/30 px-6 py-2 rounded-full inline-block">
              Head of Department
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              <div className="lg:col-span-4">
                <div className="aspect-square w-full md:w-3/4 mx-auto overflow-hidden border border-white/10 bg-[#111111] rounded-full">
                  <OptimizedImage
                    src={hodDetails.image}
                    alt={hodDetails.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col justify-center">
                <h3 className="font-syne text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
                  {hodDetails.name}
                </h3>
                <p className="font-syne text-xl md:text-2xl text-[#00F0FF] tracking-tighter mb-12 uppercase">
                  {hodDetails.designation}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-12">
                    <div>
                      <h4 className="font-syne text-lg uppercase tracking-widest text-white/40 mb-4">Credentials</h4>
                      <ul className="space-y-2 text-lg text-white/80">
                        <li>{hodDetails.qualifications}</li>
                        <li>{hodDetails.experience} Experience</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-syne text-lg uppercase tracking-widest text-white/40 mb-4">Contact</h4>
                      <ul className="space-y-2 text-lg text-white/80">
                        <li><a href={`mailto:${hodDetails.email}`} className="hover:text-[#00F0FF] transition-colors hover-trigger">{hodDetails.email}</a></li>
                        <li><a href={`tel:${hodDetails.phone}`} className="hover:text-[#00F0FF] transition-colors hover-trigger">{hodDetails.phone}</a></li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <h4 className="font-syne text-lg uppercase tracking-widest text-white/40 mb-4">PhD Supervision</h4>
                      <ul className="space-y-2 text-lg text-white/80">
                        <li className="flex gap-4">
                          <span className="text-[#FF3C00] font-syne">01</span>
                          {hodDetails.phdSupervision.submitted}
                        </li>
                        <li className="flex gap-4">
                          <span className="text-[#FF3C00] font-syne">02</span>
                          {hodDetails.phdSupervision.registered}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-syne text-lg uppercase tracking-widest text-white/40 mb-4">Teaching Subjects</h4>
                      <ul className="space-y-2 text-lg text-white/80">
                        {hodDetails.subjects.map((subject, idx) => (
                          <li key={idx} className="flex gap-4">
                            <span className="text-[#00F0FF]/50 font-syne">-</span>
                            {subject}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
