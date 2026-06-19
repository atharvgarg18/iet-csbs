import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { MagneticButton } from '@/components/MotionWrappers';
import { MoveRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Index() {
  // Use Lenis scroll internally or default if SmoothScroll wraps the app
  return (
    <div className="bg-[#050505] text-[#FAFAFA] font-inter selection:bg-white/20">
      <Navigation />
      <HeroPortalSection />

      {/* The rest of the site is wrapped in a container that appears *after* the portal expands */}
      <div className="relative z-10 bg-[#050505]">
        <AdmissionsSection />
        <HorizontalScrollSection />
        <StatsSection />
        <ResourceSection />
        <Footer />
      </div>
    </div>
  );
}

function HeroPortalSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // We track the scroll over a shorter section (150vh instead of 300vh) to halve the scroll effect length
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Text fades out faster
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);

  // The portal scales up massively to cover the entire screen, but reaches full size quicker
  const portalScale = useTransform(scrollYProgress, [0.2, 0.9], [1, 100]);

  // The background of the portal (which reveals the next section's theme) fades in
  const portalOpacity = useTransform(scrollYProgress, [0.5, 0.9], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[150vh] w-full bg-[#050505]">
      {/* Sticky container that holds the visual elements while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Background Noise for texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
        />

        {/* Massive Centered Typography */}
        <motion.div
          className="absolute z-20 flex flex-col items-center justify-center text-center pointer-events-none w-full px-4"
          style={{ opacity: textOpacity, y: textY, scale: textScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <p className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] mb-8 text-white/50">
              Institute of Engineering & Technology
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="font-syne text-[15vw] md:text-[10vw] leading-[0.85] tracking-tighter uppercase font-bold text-white flex flex-col items-center"
          >
            <span>Computer Science</span>
            <span className="flex items-center gap-2 md:gap-8 italic font-light text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.8)' }}>
              & Business
            </span>
            <span>Systems</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
              Scroll to Explore [↓]
            </p>
          </motion.div>
        </motion.div>

        {/* The Expanding Portal */}
        {/* It starts as a glowing orb/ring in the center. As scroll increases, it scales up immensely */}
        <motion.div
          className="absolute z-30 w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 flex items-center justify-center overflow-hidden"
          style={{ scale: portalScale }}
        >
          {/* Inside the portal, we reveal a dark void that eventually consumes the screen */}
          <motion.div
            className="w-full h-full bg-[#0A0A0A] rounded-full"
            style={{ opacity: portalOpacity }}
          />
        </motion.div>

        {/* Glow effect behind the portal */}
        <motion.div
          className="absolute z-10 w-48 h-48 rounded-full bg-[#00F0FF]/10 blur-[50px] pointer-events-none"
          style={{ scale: portalScale }}
        />

      </div>
    </div>
  );
}

function AdmissionsSection() {
  return (
    <section className="py-32 px-8 md:px-16 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col lg:flex-row items-start justify-between gap-16">
        <div className="lg:w-5/12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-2 bg-[#FF3C00] rounded-full animate-pulse" />
            <span className="font-syne text-xs tracking-[0.3em] uppercase text-[#FF3C00]">System Notice</span>
          </div>
          <h2 className="font-syne text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.9] mb-8">
            Admissions <br /> <span className="text-[#00F0FF]">2026-27</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
            We are redefining the intake process and curriculum structure to align with elite global standards.
          </p>
        </div>
        <div className="lg:w-6/12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111111] p-10 border border-white/5 hover:border-white/20 transition-colors duration-500">
            <h3 className="font-syne text-2xl font-bold uppercase mb-4 tracking-tight">DTE Bhopal & <br />JEE Merit</h3>
            <p className="text-white/60 leading-relaxed font-light">
              Institute counseling has been fully discontinued. All admissions are now conducted strictly through the DTE, Bhopal portal, 100% based on JEE Main merit ranking.
            </p>
          </div>
          <div className="bg-[#111111] p-10 border border-white/5 hover:border-white/20 transition-colors duration-500">
            <h3 className="font-syne text-2xl font-bold uppercase mb-4 tracking-tight">Curriculum <br />V2 Upgrade</h3>
            <p className="text-white/60 leading-relaxed font-light">
              The CSBS syllabus is undergoing a major structural revision starting this academic year. Prepare for an upgraded, industry-forward academic journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HorizontalScrollSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const cards = [
    { num: '01', title: 'Core Tech', desc: 'Data Structures, Algorithms, OS, DBMS, Networking.' },
    { num: '02', title: 'Business', desc: 'Economics, Management Principles, Financial Accounting.' },
    { num: '03', title: 'Data Science', desc: 'Machine Learning, Data Mining, and Advanced Statistics.' },
    { num: '04', title: 'Emerging', desc: 'AI, IoT, Cloud Computing, Cybersecurity, Industry 4.0.' },
  ];

  return (
    <section ref={targetRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-[#050505]">
        <div className="absolute top-1/4 left-8 md:left-16 z-10 mix-blend-difference pointer-events-none">
          <h2 className="text-5xl md:text-[7vw] font-syne font-bold uppercase tracking-tighter leading-[0.85]">
            Curriculum<br />Blueprint
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-8 md:px-16 pl-[100vw] items-center">
          {cards.map((card, idx) => (
            <div key={idx} className="w-[85vw] md:w-[450px] h-[550px] flex-shrink-0 bg-[#0A0A0A] border border-white/10 p-10 flex flex-col justify-between hover:bg-[#111111] transition-colors duration-500 hover-trigger relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F0FF]/5 rounded-full blur-[80px] group-hover:bg-[#00F0FF]/10 transition-colors duration-500" />
              <span className="font-syne text-7xl md:text-[8rem] font-bold text-transparent leading-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                {card.num}
              </span>
              <div className="relative z-10">
                <h3 className="font-syne text-3xl md:text-4xl font-bold mb-4 uppercase text-[#00F0FF] tracking-tighter">{card.title}</h3>
                <p className="text-lg md:text-xl text-white/60 font-light">{card.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-24 md:py-48 px-8 md:px-16 bg-[#FAFAFA] text-[#050505]">
      <div className="max-w-[1600px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
        >
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-black/10 pb-12 md:pb-0 md:pr-12">
            <span className="font-syne text-7xl sm:text-8xl md:text-[12rem] font-bold leading-none tracking-tighter text-[#050505]">
              150<span className="text-[#FF3C00]">.</span>
            </span>
            <span className="text-lg md:text-xl font-medium mt-4 md:mt-6 uppercase tracking-[0.2em] text-black/50">
              Total Seats Capacity
            </span>
          </div>
          <div className="flex flex-col pt-4 md:pt-0 pl-0 md:pl-12">
            <span className="font-syne text-7xl sm:text-8xl md:text-[12rem] font-bold leading-none tracking-tighter text-[#050505]">
              04<span className="text-[#00F0FF]">.</span>
            </span>
            <span className="text-lg md:text-xl font-medium mt-4 md:mt-6 uppercase tracking-[0.2em] text-black/50">
              Years Duration
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ResourceSection() {
  const resources = [
    { title: 'Study Notes', to: '/notes', num: '01' },
    { title: 'Question Papers', to: '/papers', num: '02' },
    { title: 'Course Syllabus', to: '/syllabus', num: '03' },
    { title: 'Official Notices', to: '/notices', num: '04' },
  ];

  return (
    <section className="py-24 md:py-48 px-4 sm:px-8 md:px-16 bg-[#050505] flex flex-col justify-center">
      <div className="max-w-[1600px] mx-auto w-full">
        <h2 className="font-syne text-xs md:text-sm uppercase tracking-[0.3em] text-[#00F0FF] mb-12 md:mb-24 border border-[#00F0FF]/30 px-6 py-2 rounded-full inline-block">
          Academic Resources
        </h2>
        <div className="flex flex-col border-t border-white/10">
          {resources.map((item, i) => (
            <Link key={i} to={item.to} className="group relative border-b border-white/10 py-8 md:py-12 hover-trigger overflow-hidden block">
              <div className="absolute inset-0 bg-[#FAFAFA] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
              <div className="relative z-10 flex justify-between items-center mix-blend-difference text-white px-2 md:px-4">
                <div className="flex items-start gap-4 md:gap-12">
                  <span className="font-syne text-base md:text-xl mt-1 md:mt-2 opacity-50 hidden sm:block">{item.num}</span>
                  <h3 className="font-syne text-3xl sm:text-5xl md:text-8xl font-bold uppercase tracking-tighter group-hover:pl-2 md:group-hover:pl-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {item.title}
                  </h3>
                </div>
                <MagneticButton>
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/30 flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-700">
                    <MoveRight className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                </MagneticButton>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
