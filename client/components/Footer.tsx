import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary/5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold">CSBS - IET DAVV Indore</span>
        </div>
        <p className="text-muted-foreground">
          Computer Science and Business Systems • Powered by TCS Partnership
        </p>
        <p className="text-lg text-foreground font-medium">
          Made with ❤️ by the CSBS batch of '28
        </p>
        <p className="text-sm text-muted-foreground">
          © 2025 Institute of Engineering & Technology, DAVV Indore. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
