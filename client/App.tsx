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
import { lazy, Suspense } from "react";
import { AuthProvider } from "./components/auth/AuthProvider";
import { PageLoading } from "@/components/Loading";

// Lazy load all page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Notes = lazy(() => import("./pages/Notes"));
const Papers = lazy(() => import("./pages/Papers"));
const Contributors = lazy(() => import("./pages/Contributors"));
const Notices = lazy(() => import("./pages/Notices"));
const AtAGlance = lazy(() => import("./pages/AtAGlance"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Syllabus = lazy(() => import("./pages/Syllabus"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load management portal components (heaviest code)
const ManagementLogin = lazy(() => import("./pages/management-portal/ManagementLogin"));
const ManagementLayout = lazy(() => import("./pages/management-portal/ManagementLayout"));
const ManagementDashboard = lazy(() => import("./pages/management-portal/ManagementDashboard"));
const BatchesManagement = lazy(() => import("./pages/management-portal/BatchesManagement"));
const SectionsManagement = lazy(() => import("./pages/management-portal/SectionsManagement"));
const NotesManagement = lazy(() => import("./pages/management-portal/NotesManagement"));
const PapersManagement = lazy(() => import("./pages/management-portal/PapersManagement"));
const UsersManagement = lazy(() => import("./pages/management-portal/UsersManagement"));
const GalleryCategoriesManagement = lazy(() => import("./pages/management-portal/GalleryCategoriesManagement"));
const GalleryImagesManagement = lazy(() => import("./pages/management-portal/GalleryImagesManagement"));
const NoticeCategoriesManagement = lazy(() => import("./pages/management-portal/NoticeCategoriesManagement"));
const NoticesManagement = lazy(() => import("./pages/management-portal/NoticesManagement"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
            <Suspense fallback={<PageLoading />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/papers" element={<Papers />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/at-a-glance" element={<AtAGlance />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/syllabus" element={<Syllabus />} />
            
            {/* Management Portal Routes */}
            <Route path="/management-portal/login" element={<ManagementLogin />} />
            <Route path="/management-portal" element={<ManagementLayout />}>
              <Route index element={<ManagementDashboard />} />
              <Route path="batches" element={<BatchesManagement />} />
              <Route path="sections" element={<SectionsManagement />} />
              <Route path="notes" element={<NotesManagement />} />
              <Route path="papers" element={<PapersManagement />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="gallery-categories" element={<GalleryCategoriesManagement />} />
              <Route path="gallery-images" element={<GalleryImagesManagement />} />
              <Route path="notice-categories" element={<NoticeCategoriesManagement />} />
              <Route path="notices" element={<NoticesManagement />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
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