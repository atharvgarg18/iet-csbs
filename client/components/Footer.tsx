import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-12 border-t border-border/20">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/5 to-background"></div>

      <div className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          {/* Logo and Title */}
          <div className="flex items-center justify-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                CSBS
              </div>
              <div className="text-sm text-muted-foreground">
                IET DAVV Indore
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Computer Science and Business Systems
            </p>
            <p className="text-sm text-muted-foreground/80">
              Powered by TCS Partnership
            </p>
          </div>

          {/* Made with love */}
          <div className="bg-gradient-to-r from-card to-muted/10 border border-border/20 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-lg text-foreground font-medium">
              Made with <span className="text-red-400 animate-pulse">❤️</span>{" "}
              by the CSBS batch of '28
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
