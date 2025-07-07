import Navigation from "@/components/Navigation";
import { useState } from "react";
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

  // Gallery items organized by categories
  const galleryItems = [
    // Freshers Events
    {
      id: 1,
      title: "Freshers Welcome Group Photo",
      date: "2024-09-15",
      category: "Freshers",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F552108fe4a764684a8b4501fd0d58d87?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 2,
      title: "Freshers Campus Group",
      date: "2024-09-20",
      category: "Freshers",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F74f844d18c8d47c0aa93787efffe6666?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // Raas Events
    {
      id: 3,
      title: "Raas Festival Celebration",
      date: "2024-10-25",
      category: "Raas",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F6b53f08755414fee80f9f44c051bc86b?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 4,
      title: "Raas Night Celebration",
      date: "2024-10-30",
      category: "Raas",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F2c6c8ea4b45b47a58b226bee17456622?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // End Sem Events
    {
      id: 5,
      title: "End Semester Convocation",
      date: "2025-01-30",
      category: "End Sem",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2Fdc8c54d75c84425ea80a841e7f8b7ef1?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // Rudra Events
    {
      id: 6,
      title: "Rudra Cultural Performance",
      date: "2025-01-20",
      category: "Rudra",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F7390cf5fc8b841e5926ae081a529f1e7?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // NSS Events
    {
      id: 7,
      title: "NSS Community Service",
      date: "2024-12-10",
      category: "NSS",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2Feeddd3d8c55f4d6e899061b37adaa8ab?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 8,
      title: "NSS Awareness Program",
      date: "2024-12-15",
      category: "NSS",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F40b65184c93b416fa56ae2a7ca03ca79?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // E Cell Events
    {
      id: 9,
      title: "E Cell Startup Event",
      date: "2024-11-15",
      category: "E Cell",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F0b04e28878444bdead55ccea19f67efd?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 10,
      title: "E Cell Workshop",
      date: "2024-11-20",
      category: "E Cell",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F3a9499d8ff3e4e07ade04d048bb4b8ed?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 11,
      title: "E Cell Competition",
      date: "2024-11-25",
      category: "E Cell",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F353921fd1b9b4e29bd249b2aaf691512?format=webp&width=800",
      photographer: "Gallery Division",
    },
    // Campus Life
    {
      id: 12,
      title: "Campus Aerial View",
      date: "2024-11-01",
      category: "Campus",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F13d68a2642f1447aa1a2a4e4289b1e9b?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 13,
      title: "Computer Lab Session",
      date: "2024-11-05",
      category: "Campus",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F8f14f85792ae43e1a354bcbcbe097567?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 14,
      title: "Campus Building",
      date: "2024-11-10",
      category: "Campus",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F039a28beb3594629842418585bf62d31?format=webp&width=800",
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
