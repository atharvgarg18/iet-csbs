import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import Papers from "./pages/Papers";
import Contributors from "./pages/Contributors";
import Notices from "./pages/Notices";
import AtAGlance from "./pages/AtAGlance";
import Gallery from "./pages/Gallery";
import Syllabus from "./pages/Syllabus";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/papers" element={<Papers />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/at-a-glance" element={<AtAGlance />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/syllabus" element={<Syllabus />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
