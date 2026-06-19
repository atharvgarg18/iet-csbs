import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Camera, Filter, X, Loader2 } from 'lucide-react';
import { GalleryImage } from '@shared/api';
import { useGalleryImages, useGalleryCategories } from '@/hooks/useDataQueries';
import { Reveal, StaggerContainer, StaggerItem } from "@/components/MotionWrappers";
import { motion, AnimatePresence } from "framer-motion";
import { OptimizedImage } from '@/components/OptimizedImage';

export default function Gallery() {
  const [page, setPage] = useState(0);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);

  const { data: imagesData, isLoading: imagesLoading, error: imagesError } = useGalleryImages(page, true);
  const { data: categories = [], isLoading: categoriesLoading } = useGalleryCategories();

  const loading = imagesLoading || categoriesLoading;
  const error = imagesError ? 'Failed to load gallery' : null;

  useEffect(() => {
    document.title = "Gallery - CSBS IET DAVV";
  }, []);

  useEffect(() => {
    if (imagesData?.images) {
      setAllImages(prev => {
        const newImages = imagesData.images.filter(img => !prev.some(p => p.id === img.id));
        return [...prev, ...newImages];
      });
    }
  }, [imagesData]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredImages(allImages.filter(img => img.category_id === selectedCategory));
    } else {
      setFilteredImages(allImages);
    }
  }, [selectedCategory, allImages]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navigation />

      <main className="relative z-10 px-4 md:px-16 pt-48 pb-32 max-w-[1600px] mx-auto">
        <Reveal>
          <div className="mb-16">
            <p className="font-syne text-sm uppercase tracking-widest text-primary mb-4">Archive / 07</p>
            <h1 className="font-syne text-6xl md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.9]">
              Visual <br /> <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Memories</span>
            </h1>
          </div>
        </Reveal>

        {/* Category Filters */}
        {!loading && !error && categories.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mb-24 flex flex-wrap gap-4 border-t border-b border-border py-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`font-syne text-sm uppercase tracking-widest px-8 py-3 rounded-full border transition-all duration-300 ${selectedCategory === null ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground'}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`font-syne text-sm uppercase tracking-widest px-8 py-3 rounded-full border transition-all duration-300 ${selectedCategory === cat.id ? 'bg-primary text-black border-primary' : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {loading && allImages.length === 0 && (
          <div className="flex justify-center py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}

        {error && (
          <div className="py-32 text-destructive font-syne text-2xl uppercase tracking-widest">
            Error: {error}
          </div>
        )}

        {/* Parallax Masonry Grid */}
        {!loading && !error && (
          <StaggerContainer className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredImages.map((image) => (
              <StaggerItem key={image.id} className="break-inside-avoid">
                <div
                  className="group relative overflow-hidden bg-muted/10 cursor-pointer hover-trigger"
                  onClick={() => setSelectedImage(image)}
                >
                  {/* Image wrapper for scale effect */}
                  <div className="relative w-full overflow-hidden">
                    <OptimizedImage
                      src={image.image_url}
                      alt={image.title}
                      aspectRatio="auto"
                      className="w-full h-auto object-cover transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-110"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Info Reveal */}
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                    <h3 className="font-syne text-2xl font-bold uppercase tracking-tighter text-foreground mb-2">
                      {image.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm font-medium tracking-widest uppercase text-primary">
                      <span>{image.event_date ? formatDate(image.event_date) : ''}</span>
                      <span>{image.category?.name}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {filteredImages.length === 0 && !loading && allImages.length > 0 && (
          <div className="py-32 text-center text-muted-foreground font-syne text-2xl uppercase tracking-widest">
            No images in this category.
          </div>
        )}

      </main>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-16"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-foreground hover:text-primary transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={selectedImage.image_url}
                alt={selectedImage.title}
                aspectRatio="auto"
                className="max-w-full max-h-full object-contain border border-border"
                showBlurPlaceholder={false}
              />

              <div className="absolute -bottom-16 left-0 right-0 flex justify-between items-center text-foreground font-syne uppercase tracking-widest text-sm">
                <span className="font-bold text-xl">{selectedImage.title}</span>
                <span className="text-primary">{selectedImage.event_date ? formatDate(selectedImage.event_date) : ''}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
