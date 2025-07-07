import Navigation from "@/components/Navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Image as ImageIcon,
  Calendar,
  Users,
  Clock,
  Upload,
  Eye,
  Download,
} from "lucide-react";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Gallery items organized by categories
  const galleryItems = [
    // E Cell Events
    {
      id: 1,
      title: "YEC StartUp Expo - Team Presentation",
      description: "CSBS students presenting their startup ideas at YEC",
      date: "2024-11-15",
      category: "E Cell",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F0cf01d5ccc9446489220032a5035c7a2?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 2,
      title: "YEC Group Photo - Achievement Day",
      description: "CSBS students with faculty at YEC achievement ceremony",
      date: "2024-11-20",
      category: "E Cell",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2Fb515c864faca43bbaa1ecac65dc50fa1?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 3,
      title: "YEC Startup Competition",
      description: "Entrepreneurship competition participation by CSBS batch",
      date: "2024-11-25",
      category: "E Cell",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F5a246bfff5fa44d38d528bc0d05bba97?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // NSS Events
    {
      id: 4,
      title: "NSS Group Photo - Community Service",
      description:
        "CSBS students participating in NSS community service activities",
      date: "2024-12-10",
      category: "NSS",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2Ffd9159a6f76f49108f52cc1b61fba365?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 5,
      title: "NSS Awareness Rally",
      description: "CSBS students at Rajwada during awareness campaign",
      date: "2024-12-15",
      category: "NSS",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F9d3026b056fb4b9980bfbc02b2041084?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // Rudra Events
    {
      id: 6,
      title: "Rudra Cultural Performance",
      description: "Traditional dance performance during Rudra cultural fest",
      date: "2025-01-20",
      category: "Rudra",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F6953770cff18439d958ceb56461f50c9?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // Freshers Events
    {
      id: 7,
      title: "Freshers Welcome - Group Photo",
      description: "Complete CSBS batch during freshers welcome ceremony",
      date: "2024-09-15",
      category: "Freshers",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F9d980b00d32f4aa09c920e0c63b588ff?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 8,
      title: "Freshers Day Celebration",
      description: "Evening freshers party - CSBS batch '28 memories",
      date: "2024-09-20",
      category: "Freshers",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F56ca39159d7c491e8aa54d911b63415e?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // End Sem Events
    {
      id: 9,
      title: "End Semester Convocation",
      description: "CSBS students at end semester graduation ceremony",
      date: "2025-01-30",
      category: "End Sem",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2Fc4f2e241069c4752b6a19548e86f1ab6?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // Raas Events
    {
      id: 10,
      title: "Raas Festival - Group Celebration",
      description: "CSBS students celebrating Raas festival together",
      date: "2024-10-25",
      category: "Raas",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F6baa40eb14654c5ab8ea877950832a3d?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 11,
      title: "Raas Night Celebration",
      description: "Traditional Raas celebration with the entire CSBS batch",
      date: "2024-10-30",
      category: "Raas",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F70cb6b75ed6b41d6bdf6c2a906651e11?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // Academic/Campus
    {
      id: 12,
      title: "Campus Life - Group Study",
      description: "CSBS students during group study session at campus",
      date: "2024-11-01",
      category: "Campus",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F14e9dc25433649c9aaf4951896be9f55?format=webp&width=800",
      photographer: "Gallery Division",
    },
  ];

  const categories = [
    "All",
    "E Cell",
    "NSS",
    "Rudra",
    "Freshers",
    "End Sem",
    "Raas",
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
                {galleryItems.length} Photos Available
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems
                .filter(
                  (item) =>
                    selectedCategory === "All" ||
                    item.category === selectedCategory,
                )
                .map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:scale-105 bg-gradient-to-br from-card to-accent/5 border border-accent/10 backdrop-blur-sm group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getCategoryColor(item.category)}>
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
                    </CardContent>
                  </Card>
                ))}
            </div>

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
      </div>
    </div>
  );
}
