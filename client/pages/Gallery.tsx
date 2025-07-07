import Navigation from "@/components/Navigation";
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
  // Sample gallery items - these will be updated with real photos
  const galleryItems = [
    {
      id: 1,
      title: "First Day of Classes - Sept 2024",
      description:
        "Historic moment as the inaugural CSBS batch begins their journey",
      date: "2024-09-01",
      category: "Academic",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2Fc79016cf4e3c4708a6b13e21831da2a8?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 2,
      title: "Modern Computer Laboratory",
      description: "State-of-the-art computing facilities for CSBS students",
      date: "2024-10-15",
      category: "Infrastructure",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F62fe5cef9f1d491f8db2da6c0f4ac66e?format=webp&width=800",
      photographer: "Gallery Division",
    },
    {
      id: 3,
      title: "Academic Building - IET DAVV",
      description: "The academic building where CSBS classes are conducted",
      date: "2024-11-01",
      category: "Campus",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets%2F8d13cf5ef2034d99b5c4b2c6e107967e%2F3f6c4bd2576e4a2a9456401e4c9c8782?format=webp&width=800",
      photographer: "Gallery Division",
    },
  ];

  const categories = [
    "All",
    "Academic",
    "Infrastructure",
    "Campus",
    "Events",
    "Student Life",
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Academic: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      Infrastructure: "bg-green-500/10 text-green-400 border-green-500/30",
      Campus: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      Events: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      "Student Life": "bg-pink-500/10 text-pink-400 border-pink-500/30",
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
                  variant="outline"
                  size="sm"
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
              {galleryItems.map((item) => (
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

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
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
                    <CardTitle className="text-lg text-foreground group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Camera className="w-3 h-3" />
                      <span>Photo by: {item.photographer}</span>
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
