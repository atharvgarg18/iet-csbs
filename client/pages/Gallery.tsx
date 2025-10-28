import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedImage } from "@/components/OptimizedImage";
import {
  Camera,
  Calendar,
  Filter,
  AlertCircle,
  BookOpen,
  Star,
  Clock,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GalleryImage } from "@shared/api";
import { useGalleryImages, useGalleryCategories } from "@/hooks/useDataQueries";

export default function Gallery() {
  const [page, setPage] = useState(0);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);

  // Use React Query hooks
  const { 
    data: imagesData, 
    isLoading: imagesLoading, 
    error: imagesError 
  } = useGalleryImages(page);
  
  const { 
    data: categories = [], 
    isLoading: categoriesLoading 
  } = useGalleryCategories();

  const loading = imagesLoading || categoriesLoading;
  const error = imagesError ? 'Failed to load gallery' : null;

  useEffect(() => {
    document.title = "Gallery - CSBS IET DAVV";
  }, []);

  // Accumulate images as pages load
  useEffect(() => {
    if (imagesData?.images) {
      setAllImages(prev => {
        // Avoid duplicates when re-fetching
        const newImages = imagesData.images.filter(
          img => !prev.some(p => p.id === img.id)
        );
        return [...prev, ...newImages];
      });
    }
  }, [imagesData]);

  // Update filtered images when category changes or images load
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

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const filterByCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  // Update filtered images when allImages change
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredImages(allImages);
    } else {
      setFilteredImages(allImages.filter(image => image.category_id === selectedCategory));
    }
  }, [allImages, selectedCategory]);

  return (
    <div className="min-h-screen bg-background relative">

      <Navigation />
      
      {/* Main content with site-consistent styling */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with site design consistency */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-6">
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Visual Memories</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore moments and memories captured during various events, activities, and milestones
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <Camera className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            </div>
            <p className="text-xl text-foreground font-medium mb-2">Loading gallery...</p>
            <p className="text-muted-foreground">Please wait while we fetch the latest images</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5 p-12 text-center mb-12">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-destructive mb-2">Unable to Load Content</h3>
              <p className="text-destructive/80 text-lg mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        {!loading && !error && categories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => filterByCategory(null)}
                className="h-8"
              >
                All Images
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByCategory(category.id)}
                  className="h-8"
                  style={selectedCategory === category.id ? {
                    backgroundColor: category.color,
                    borderColor: category.color,
                    color: 'white'
                  } : {
                    borderColor: category.color,
                    color: category.color
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Image Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => openImageModal(image)}
              >
                <OptimizedImage
                  src={image.image_url}
                  alt={image.title}
                  aspectRatio="square"
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay with subtle info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    {image.event_date && (
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(image.event_date)}</span>
                      </div>
                    )}
                    {image.photographer && (
                      <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
                        <Camera className="w-3 h-3" />
                        <span>{image.photographer}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Featured badge */}
                {image.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-primary-foreground text-xs h-5 px-2">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}

                {/* Category badge */}
                {image.category && (
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs h-5 px-2 bg-white/90 text-gray-800"
                    >
                      {image.category.name}
                    </Badge>
                  </div>
                )}
              </div>
            ))}

            {filteredImages.length === 0 && allImages.length > 0 && (
              <div className="col-span-full text-center py-24">
                <Card className="p-12 bg-muted/30 border-dashed border-2 border-muted-foreground/20">
                  <CardContent className="p-0">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mx-auto flex items-center justify-center">
                        <Filter className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">No Images Found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      No images found in the selected category. Try selecting a different category.
                    </p>
                    <Button onClick={() => filterByCategory(null)} variant="outline" className="gap-2">
                      <X className="w-4 h-4" />
                      Clear Filter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {allImages.length === 0 && (
              <div className="col-span-full text-center py-24">
                <Card className="p-16 bg-muted/30 border-dashed border-2 border-muted-foreground/20">
                  <CardContent className="p-0">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mx-auto flex items-center justify-center">
                        <Camera className="w-16 h-16 text-primary" />
                      </div>
                      <div className="absolute top-2 right-1/4 animate-bounce">
                        <Star className="w-6 h-6 text-accent" />
                      </div>
                      <div className="absolute bottom-4 left-1/4 animate-pulse">
                        <Star className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">Gallery Coming Soon!</h3>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
                      Images will be uploaded soon. Check back later to see the latest captures.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && imagesData?.hasMore && (
          <div className="text-center mt-8">
            <Button 
              onClick={loadMore}
              disabled={imagesLoading}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {imagesLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Images
                  <Camera className="w-4 h-4" />
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredImages.length} of {imagesData?.total || 0} images
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <OptimizedImage
              src={selectedImage.image_url}
              alt={selectedImage.title}
              aspectRatio="auto"
              className="max-w-full max-h-[90vh] rounded-lg"
              showBlurPlaceholder={false}
            />
            
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              ×
            </button>
            
            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {selectedImage.title}
                  </h3>

                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    {selectedImage.event_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedImage.event_date)}</span>
                      </div>
                    )}
                    {selectedImage.photographer && (
                      <div className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        <span>{selectedImage.photographer}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedImage.category && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {selectedImage.category.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}