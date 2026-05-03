import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdmissionPopup() {
  const [showTicket, setShowTicket] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the popup
    const hasDismissed = sessionStorage.getItem('csbs_admission_popup_dismissed');
    
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
    sessionStorage.setItem('csbs_admission_popup_dismissed', 'true');
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
              <div className="relative px-6 py-4 bg-background border-2 border-primary rounded-lg flex items-center gap-3 shadow-xl hover:bg-muted/50 transition-colors">
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
              className="absolute inset-0 bg-black/90"
              onClick={handleClose}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }}
              className="relative w-fit max-w-[95vw] md:max-w-4xl bg-card border border-border rounded-xl shadow-2xl p-4 md:p-6 overflow-y-auto max-h-[95vh]"
            >
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center justify-center gap-4 mt-4 md:mt-2">
                {/* Heading */}
                <div className="text-center w-full px-8 md:px-12">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Admissions Open 2026-2027
                  </h3>
                </div>

                {/* Poster - Maximized */}
                <div className="w-full flex items-center justify-center">
                  <img 
                    src="/assets/admission-poster.jpg" 
                    alt="CSBS Admissions 2026-2027 Poster" 
                    className="w-auto max-w-full max-h-[75vh] object-contain rounded shadow-sm border border-muted rounded-md"
                  />
                </div>
                
                {/* Footer Text */}
                <div className="text-center px-4 w-full">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Application dates, forms, and further announcements will be updated on the portal shortly. <br className="hidden sm:block" />
                    <span className="font-semibold text-foreground/80 mt-1 inline-block">Stay tuned!</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
