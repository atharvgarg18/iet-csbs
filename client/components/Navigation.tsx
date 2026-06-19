import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MagneticButton } from './MotionWrappers';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Notes', href: '/notes' },
    { title: 'Papers', href: '/papers' },
    { title: 'Syllabus', href: '/syllabus' },
    { title: 'Notices', href: '/notices' },
    { title: 'Gallery', href: '/gallery' },
    { title: 'Results', href: '/results' },
    { title: 'About', href: '/about' },
    { title: 'Contributors', href: '/contributors' },
  ];

  const easeCurve = [0.76, 0, 0.24, 1] as const;

  const menuVariants: any = {
    closed: {
      x: '100%',
      transition: {
        duration: 0.8,
        ease: easeCurve,
      },
    },
    open: {
      x: '0%',
      transition: {
        duration: 0.8,
        ease: easeCurve,
      },
    },
  };

  const linkVariants: any = {
    closed: { y: 100, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: easeCurve,
        delay: 0.2 + i * 0.05,
      },
    }),
  };

  return (
    <>
      {/* Magnetic Menu Toggle */}
      <div className="fixed top-8 right-8 z-[1000]">
        <MagneticButton className="magnetic">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center justify-center w-16 h-16 rounded-full bg-background border border-border/50 text-foreground mix-blend-difference hover:bg-primary hover:text-black transition-colors duration-300"
          >
            <span className="sr-only">Toggle Menu</span>
            <div className="flex flex-col gap-1.5 w-6">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-full bg-current transition-transform duration-300"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block h-0.5 w-full bg-current transition-opacity duration-300"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-full bg-current transition-transform duration-300"
              />
            </div>
          </button>
        </MagneticButton>
      </div>

      {/* Logo - Fixed Top Left */}
      <div className="fixed top-8 left-8 z-[900] mix-blend-difference">
        <Link to="/" className="text-xl font-bold font-syne hover:text-primary transition-colors tracking-tight">
          CSBS<span className="text-primary">.</span>
        </Link>
      </div>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[900] bg-background overflow-y-auto px-6 sm:px-12 md:px-32 pt-32 pb-16 flex flex-col justify-start md:justify-center"
          >
            {/* Background Noise/Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none fixed" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            <div className="relative z-10 flex flex-col md:flex-row justify-between w-full max-w-7xl mx-auto gap-12 md:gap-8">

              {/* Links */}
              <nav className="flex flex-col gap-2 sm:gap-4 md:gap-6">
                {navLinks.map((link, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.div custom={i} variants={linkVariants} initial="closed" animate="open" exit="closed">
                      <Link
                        to={link.href}
                        className="group relative inline-block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-syne hover-trigger"
                      >
                        <span className="relative z-10 text-foreground group-hover:text-primary transition-colors duration-500">
                          {link.title}
                        </span>
                        <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </nav>

              {/* Info Block */}
              <div className="mt-8 md:mt-auto md:w-1/3 flex flex-col justify-end text-muted-foreground pb-4 md:pb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-4">Location</h3>
                    <p>Institute of Engineering & Technology<br />DAVV, Khandwa Road<br />Indore, MP 452017</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-4">Contact</h3>
                    <a href="mailto:admissions@ietdavv.edu.in" className="hover:text-primary transition-colors hover-trigger">admissions@ietdavv.edu.in</a>
                    <p className="mt-1">+91-731-2570179</p>
                  </div>
                  <div className="flex gap-4">
                    {['LinkedIn', 'Twitter', 'GitHub'].map((social) => (
                      <a key={social} href="#" className="text-sm uppercase tracking-wider hover:text-primary transition-colors hover-trigger">
                        {social}
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
