import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdmissionPopup() {
  const [showTicket, setShowTicket] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the popup
    const hasDismissed = localStorage.getItem('csbs_admission_popup_dismissed');
    
    // If not dismissed, wait 2 seconds before showing the entry ticket
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setShowTicket(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowTicket(false); // Hide the ticket permanently for this session/device
    localStorage.setItem('csbs_admission_popup_dismissed', 'true');
  };

  return (
    <>
      {/* The Floating Ticket (Entry Trigger) */}
      <AnimatePresence>
        {showTicket && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative">
              {/* Glowing Background Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative px-6 py-4 bg-background border border-primary/20 rounded-lg flex items-center gap-3 shadow-2xl">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-bold text-sm">Admissions 2026-27</p>
                  <p className="text-xs text-muted-foreground">Click for details</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Fold-Out Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={handleClose}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row bg-card border border-border rounded-2xl shadow-2xl overflow-hidden overflow-y-auto"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-background/60 hover:bg-background rounded-full transition-colors backdrop-blur-md border border-border"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Text Side (Left) */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-background to-muted/50">
                <Badge variant="outline" className="w-fit mb-6 text-primary border-primary/30 text-sm">
                  ✨ Coming Soon
                </Badge>
                
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
                  Think Tech,<br /> Think Business.
                </h2>
                
                <h3 className="text-xl md:text-2xl text-muted-foreground mb-6">
                  Shape your future with CSBS at IET DAVV.
                </h3>
                
                <div className="space-y-4 text-sm md:text-base text-card-foreground/80 mb-8 font-medium">
                  <p className="flex items-center gap-2">
                    <span className="text-primary">🎓</span> Curriculum co-created with TCS Experts
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary">🚀</span> Industry-Driven B.Tech for Future Innovators
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-primary">💼</span> Expertise in Aligned Platforms
                  </p>
                </div>
                
                <div className="mt-auto p-5 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary rounded-r-xl">
                  <p className="font-bold text-lg text-primary">Admissions Open 2026-2027</p>
                  <p className="text-sm mt-2 opacity-80">
                    Stay tuned! Application dates, forms, and further announcements will be updated on the portal shortly.
                  </p>
                </div>
              </div>
              
              {/* Image Side (Right) */}
              <div className="flex-1 relative min-h-[400px] md:min-h-full bg-slate-900/5 flex items-center justify-center p-4 md:p-8">
                {/* 
                  Make sure to add your poster image into public/assets/admission-poster.jpg 
                  (or change the src here to match your uploaded asset)
                */}
                <img 
                  src="/assets/admission-poster.jpg" 
                  alt="CSBS Admissions 2026-2027 Poster" 
                  className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-border/50"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
