import { Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/40" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Logo with hover effect & Links */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Logo that transforms */}
            <div className="relative min-w-[180px] h-5 group">
              {/* Default text */}
              <div className="absolute inset-0 flex items-center justify-center sm:justify-start font-bold text-foreground text-sm transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:-translate-y-2">
                CSBS IET DAVV
              </div>
              {/* Developer credits */}
              <div className="absolute inset-0 flex items-center justify-center sm:justify-start opacity-0 translate-y-2 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
                <div className="font-mono text-xs whitespace-nowrap">
                  <span className="text-primary/70">&lt;</span>
                  <span className="text-muted-foreground/80">dev </span>
                  <a
                    href="https://linkedin.com/in/atharvgrg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:text-secondary transition-colors"
                  >
                    atharvgrg
                  </a>
                  <span className="text-primary/70"> /&gt;</span>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 text-xs">
              <Link to="/notes" className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                Notes
              </Link>
              <span className="text-border">•</span>
              <Link to="/papers" className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                Papers
              </Link>
              <span className="text-border">•</span>
              <Link to="/gallery" className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                Gallery
              </Link>
              <span className="text-border">•</span>
              <Link to="/contributors" className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">
                Contributors
              </Link>
            </div>
          </div>

          {/* Center: Made with love */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by CSBS '28
          </div>

          {/* Right: Social & Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="mailto:atharv.garg@ietcsbs.tech"
              className="w-8 h-8 rounded-lg bg-muted hover:bg-foreground hover:text-background flex items-center justify-center transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <div className="text-xs text-muted-foreground">
              © {currentYear}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
