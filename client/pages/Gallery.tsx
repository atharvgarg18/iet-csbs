import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Calendar,
  Users,
  Clock,
  Upload,
  Eye,
  Download,
} from "lucide-react";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    document.title = "Gallery - CSBS IET DAVV";
  }, []);

  // Gallery items organized by categories
  const galleryItems = [
    // Freshers Events
    {
      id: 1,
      title: "Freshers Welcome",
      date: "2024-09-15",
      category: "Freshers",
      imageUrl: "https://html-starter-beige-beta.vercel.app/freshers_1.jpg",
      photographer: "Gallery Division",
    },
    // Raas Events
    {
      id: 2,
      title: "Raas Festival 1",
      date: "2024-10-25",
      category: "Raas",
      imageUrl: "https://html-starter-beige-beta.vercel.app/raas_1.jpg",
      photographer: "Gallery Division",
    },
    {
      id: 3,
      title: "Raas Festival 2",
      date: "2024-10-26",
      category: "Raas",
      imageUrl: "https://html-starter-beige-beta.vercel.app/raas_2.jpg",
      photographer: "Gallery Division",
    },
    {
      id: 4,
      title: "Raas Festival 3",
      date: "2024-10-27",
      category: "Raas",
      imageUrl: "https://html-starter-beige-beta.vercel.app/raas_3.jpg",
      photographer: "Gallery Division",
    },
    // End Sem Events
    {
      id: 5,
      title: "End Semester",
      date: "2025-01-30",
      category: "End Sem",
      imageUrl: "https://html-starter-beige-beta.vercel.app/end_sem_1.jpg",
      photographer: "Gallery Division",
    },
    // Rudra Events
    {
      id: 6,
      title: "Rudra Cultural Event 1",
      date: "2025-01-20",
      category: "Rudra",
      imageUrl: "https://html-starter-beige-beta.vercel.app/rudra_1.jpg",
      photographer: "Gallery Division",
    },
    {
      id: 7,
      title: "Rudra Cultural Event 2",
      date: "2025-01-21",
      category: "Rudra",
      imageUrl: "https://html-starter-beige-beta.vercel.app/rudra_2.jpg",
      photographer: "Gallery Division",
    },
    {
      id: 8,
      title: "Rudra Cultural Event 3",
      date: "2025-01-22",
      category: "Rudra",
      imageUrl: "https://html-starter-beige-beta.vercel.app/rudra_3.jpg",
      photographer: "Gallery Division",
    },
    // NSS Events
    {
      id: 9,
      title: "NSS Community Service",
      date: "2024-12-10",
      category: "NSS",
      imageUrl: "https://html-starter-beige-beta.vercel.app/nss_1.jpg",
      photographer: "Gallery Division",
    },
    // E Cell Events
    {
      id: 10,
      title: "E Cell Event 1",
      date: "2024-11-15",
      category: "E Cell",
      imageUrl: "https://html-starter-beige-beta.vercel.app/e_cell_1.jpg",
      photographer: "Gallery Division",
    },
    {
      id: 11,
      title: "E Cell Event 2",
      date: "2024-11-20",
      category: "E Cell",
      imageUrl: "https://html-starter-beige-beta.vercel.app/e_cell_2.jpg",
      photographer: "Gallery Division",
    },
    {
      id: 12,
      title: "E Cell Event 3",
      date: "2024-11-25",
      category: "E Cell",
      imageUrl: "https://html-starter-beige-beta.vercel.app/e_cell_3.jpg",
      photographer: "Gallery Division",
    },
    // Campus Life
    {
      id: 13,
      title: "Campus Life 1",
      date: "2024-11-01",
      category: "Campus",
      imageUrl: "https://html-starter-beige-beta.vercel.app/campus_1.jpg",
      photographer: "Gallery Division",
    },
    {
      id: 14,
      title: "Campus Life 2",
      date: "2024-11-05",
      category: "Campus",
      imageUrl: "https://html-starter-beige-beta.vercel.app/campus_2.jpg",
      photographer: "Gallery Division",
    },
    {
      id: 15,
      title: "Campus Life 3",
      date: "2024-11-10",
      category: "Campus",
      imageUrl: "https://html-starter-beige-beta.vercel.app/campus_3.jpg",
      photographer: "Gallery Division",
    },
  ];

  const categories = [
    "All",
    "Freshers",
    "Raas",
    "End Sem",
    "Rudra",
    "NSS",
    "E Cell",
    "Campus",
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "E Cell": "bg-orange-500/10 text-orange-400 border-orange-500/30",
      NSS: "bg-green-500/10 text-green-400 border-green-500/30",
      Rudra: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      Freshers: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      "End Sem": "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      Raas: "bg-pink-500/10 text-pink-400 border-pink-500/30",
      Campus: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-500/10 text-gray-400 border-gray-500/30"
    );
  };

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/10 dark:from-background dark:via-accent/10 dark:to-primary/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
              <Camera className="w-4 h-4" />
              Photo Gallery
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              CSBS{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-secondary animate-gradient">
                Gallery
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Capturing moments and memories from the CSBS journey - from first
              days to achievements and everything in between.
            </p>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="hover:bg-primary/10 hover:text-primary transition-colors duration-300"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Photo Collection
                </h2>
                <p className="text-muted-foreground">
                  Curated by: Bhumi Jain & Pranamya Sharma
                </p>
              </div>
              <Badge variant="secondary" className="px-4 py-2">
                {filteredItems.length} Photos
                {selectedCategory !== "All" && ` in ${selectedCategory}`}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1 text-xs"
                          onClick={() => window.open(item.imageUrl, "_blank")}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1 text-xs"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = item.imageUrl;
                            link.download = `${item.category}_${item.id}.jpg`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className={getCategoryColor(item.category)}
                        size="sm"
                      >
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No photos in this category yet
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for more photos from {selectedCategory}{" "}
                  events!
                </p>
              </div>
            )}

            {/* Upload Section */}
            <Card className="p-8 text-center bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  More Photos Coming Soon
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Our Gallery Division is continuously capturing and curating
                  photos from CSBS events, classes, and campus life.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Curated by Gallery Division</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated regularly</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
