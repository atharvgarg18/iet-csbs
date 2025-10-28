import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  ExternalLink,
  AlertCircle,
  BookOpen,
  Star,
  Clock,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Paper, Section } from "@shared/api";
import { usePapers, usePapersSections } from "@/hooks/useDataQueries";

export default function Papers() {
  const [page, setPage] = useState(0);
  const [allPapers, setAllPapers] = useState<Paper[]>([]);

  // Use React Query hooks
  const {
    data: papersData,
    isLoading: papersLoading,
    error: papersError
  } = usePapers(page);

  const {
    data: sections = [],
    isLoading: sectionsLoading
  } = usePapersSections();

  const loading = papersLoading || sectionsLoading;
  const error = papersError ? 'Failed to load papers' : null;

  useEffect(() => {
    document.title = "Papers - CSBS IET DAVV";
  }, []);

  // Accumulate papers as pages load
  useEffect(() => {
    if (papersData?.papers) {
      setAllPapers(prev => {
        const newPapers = papersData.papers.filter(
          paper => !prev.some(p => p.id === paper.id)
        );
        return [...prev, ...newPapers];
      });
    }
  }, [papersData]);

  const groupPapersBySection = () => {
    return sections.map(section => {
      const sectionPapers = allPapers.filter(paper => paper.section_id === section.id);
      return {
        section,
        papers: sectionPapers
      };
    }).filter(group => group.papers.length > 0);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  // Get grouped data
  const filteredSections = groupPapersBySection();

  return (
    <div className="min-h-screen bg-background relative">

      <Navigation />
      
      {/* Main content with site-consistent styling */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with site design consistency */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-6">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Exam Resources</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Question Papers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access previous year question papers and exam resources organized by sections for your preparation
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <FileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            </div>
            <p className="text-xl text-foreground font-medium mb-2">Loading question papers...</p>
            <p className="text-muted-foreground">Please wait while we fetch your resources</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5 p-12 text-center mb-12">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-destructive mb-2">Unable to Load Content</h3>
              <p className="text-destructive/80 text-lg mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Groups by Section */}
        {!loading && !error && (
          <div className="space-y-12">
            {filteredSections.map((group, groupIndex) => (
              <div key={group.section.id} className="group">
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border/50">
                  <div className={`w-12 h-12 rounded-2xl ${
                    groupIndex % 3 === 0 ? 'bg-primary/10' :
                    groupIndex % 3 === 1 ? 'bg-secondary/10' : 'bg-accent/10'
                  } flex items-center justify-center`}>
                    <FileText className={`w-6 h-6 ${
                      groupIndex % 3 === 0 ? 'text-primary' :
                      groupIndex % 3 === 1 ? 'text-secondary' : 'text-accent'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground">
                      {group.section.batch?.name} - Section {group.section.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {group.papers.length} papers available
                    </p>
                  </div>
                </div>

                {/* Compact Papers List */}
                <div className="space-y-2">
                  {group.papers.map((paper, paperIndex) => (
                    <Card key={paper.id} className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg ${
                            paperIndex % 4 === 0 ? 'bg-primary/10' :
                            paperIndex % 4 === 1 ? 'bg-secondary/10' :
                            paperIndex % 4 === 2 ? 'bg-accent/10' : 'bg-primary/10'
                          } flex items-center justify-center flex-shrink-0`}>
                            <Star className={`w-4 h-4 ${
                              paperIndex % 4 === 0 ? 'text-primary' :
                              paperIndex % 4 === 1 ? 'text-secondary' :
                              paperIndex % 4 === 2 ? 'text-accent' : 'text-primary'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground mb-1 truncate">
                              {paper.description || "Question Paper"}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Google Drive Resource</span>
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              <span>{new Date(paper.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <Button asChild size="sm" className={`${
                            paperIndex % 4 === 0 ? 'bg-primary hover:bg-primary/90' :
                            paperIndex % 4 === 1 ? 'bg-secondary hover:bg-secondary/90' :
                            paperIndex % 4 === 2 ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
                          } shadow-sm`}>
                            <a href={paper.drive_link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Open
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}

            {filteredSections.length === 0 && (
              <div className="text-center py-24">
                <Card className="p-16 bg-muted/30 border-dashed border-2 border-muted-foreground/20">
                  <CardContent className="p-0">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mx-auto flex items-center justify-center">
                        <FileText className="w-16 h-16 text-primary" />
                      </div>
                      <div className="absolute top-2 right-1/4 animate-bounce">
                        <Star className="w-6 h-6 text-accent" />
                      </div>
                      <div className="absolute bottom-4 left-1/4 animate-pulse">
                        <Star className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">Question Papers Coming Soon!</h3>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
                      We're preparing comprehensive question papers for you. Check back soon for fresh materials!
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && papersData?.hasMore && (
          <div className="text-center mt-8">
            <Button 
              onClick={loadMore}
              disabled={papersLoading}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {papersLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Papers
                  <FileText className="w-4 h-4" />
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {allPapers.length} of {papersData?.total || 0} papers
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}