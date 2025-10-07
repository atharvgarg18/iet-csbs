import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { registerServiceWorker } from "@/lib/serviceWorker";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import Papers from "./pages/Papers";
import Contributors from "./pages/Contributors";
import Notices from "./pages/Notices";
import AtAGlance from "./pages/AtAGlance";
import Gallery from "./pages/Gallery";
import Syllabus from "./pages/Syllabus";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BatchesManagement from "./pages/admin/BatchesManagement";
import NotesManagement from "./pages/admin/NotesManagement_new";
import PapersManagement from "./pages/admin/PapersManagement_new";
import GalleryImagesManagement from "./pages/admin/GalleryImagesManagement_new";
import GalleryCategoriesManagement from "./pages/admin/GalleryCategoriesManagement";
import NoticeCategoriesManagement from "./pages/admin/NoticeCategoriesManagement";
import NoticeManagement from "./pages/admin/NoticeManagement_new";
import UserManagement from "./pages/admin/UserManagement";
import AdminLogin from "./pages/admin/AdminLogin";
import { AuthProvider } from "./components/auth/AuthProvider";

const queryClient = new QueryClient();

// Register service worker for caching
registerServiceWorker();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/papers" element={<Papers />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/at-a-glance" element={<AtAGlance />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="batches" element={<BatchesManagement />} />
              <Route path="notes" element={<NotesManagement />} />
              <Route path="papers" element={<PapersManagement />} />
              <Route path="gallery-categories" element={<GalleryCategoriesManagement />} />
              <Route path="gallery-images" element={<GalleryImagesManagement />} />
              <Route path="notice-categories" element={<NoticeCategoriesManagement />} />
              <Route path="notices" element={<NoticeManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
