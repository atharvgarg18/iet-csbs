import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  ExternalLink,
  Star,
  Loader2
} from 'lucide-react';
import { Note, Section } from '@shared/api';
import { useNotes, useNotesSections } from '@/hooks/useDataQueries';

export default function Notes() {
  const [page, setPage] = useState(0);
  const [allNotes, setAllNotes] = useState<Note[]>([]);

  // Use React Query hooks
  const {
    data: notesData,
    isLoading: notesLoading,
    error: notesError
  } = useNotes(page);

  const {
    data: sections = [],
    isLoading: sectionsLoading
  } = useNotesSections();

  const loading = notesLoading || sectionsLoading;
  const error = notesError ? 'Failed to load notes' : '';

  useEffect(() => {
    document.title = "Notes - CSBS IET DAVV";
  }, []);

  // Accumulate notes as pages load
  useEffect(() => {
    if (notesData?.notes) {
      setAllNotes(prev => {
        const newNotes = notesData.notes.filter(
          note => !prev.some(p => p.id === note.id)
        );
        return [...prev, ...newNotes];
      });
    }
  }, [notesData]);

  const groupNotesBySection = () => {
    return sections.map(section => {
      const sectionNotes = allNotes.filter(note => note.section_id === section.id);
      return {
        section,
        notes: sectionNotes
      };
    }).filter(group => group.notes.length > 0);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  // Get grouped data
  const filteredSections = groupNotesBySection();

  return (
    <div className="min-h-screen bg-background relative">


      <Navigation />
      
      {/* Main content with site-consistent styling */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with site design consistency */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Academic Resources</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Study Notes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Access comprehensive study materials and resources organized by sections for your academic success
          </p>
        </div>



        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <BookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            </div>
            <p className="text-xl text-foreground font-medium mb-2">Loading study materials...</p>
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

        {/* Main Content */}
        {!loading && !error && (
          <div className="space-y-12">
            {filteredSections.map((group, sectionIndex) => (
              <div key={group.section.id} className="mb-8">
                
                {/* Compact Section Header */}
                <div className="flex items-center gap-4 mb-4 pb-3 border-b border-border/50">
                  <div className={`w-10 h-10 rounded-lg ${
                    sectionIndex % 3 === 0 ? 'bg-primary' :
                    sectionIndex % 3 === 1 ? 'bg-secondary' : 'bg-accent'
                  } flex items-center justify-center`}>
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground">
                      {group.section.batch?.name} - Section {group.section.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {group.notes.length} materials available
                    </p>
                  </div>
                </div>

                {/* Compact Notes List */}
                <div className="space-y-2">
                  {group.notes.map((note, noteIndex) => (
                    <Card key={note.id} className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg ${
                            noteIndex % 4 === 0 ? 'bg-primary/10' :
                            noteIndex % 4 === 1 ? 'bg-secondary/10' :
                            noteIndex % 4 === 2 ? 'bg-accent/10' : 'bg-primary/10'
                          } flex items-center justify-center flex-shrink-0`}>
                            <Star className={`w-4 h-4 ${
                              noteIndex % 4 === 0 ? 'text-primary' :
                              noteIndex % 4 === 1 ? 'text-secondary' :
                              noteIndex % 4 === 2 ? 'text-accent' : 'text-primary'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground mb-1 truncate">
                              {note.description || "Study Material"}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Google Drive Resource</span>
                              <span>•</span>
                              <Clock className="w-3 h-3" />
                              <span>{new Date(note.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <Button asChild size="sm" className={`${
                            noteIndex % 4 === 0 ? 'bg-primary hover:bg-primary/90' :
                            noteIndex % 4 === 1 ? 'bg-secondary hover:bg-secondary/90' :
                            noteIndex % 4 === 2 ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
                          } shadow-sm`}>
                            <a href={note.drive_link} target="_blank" rel="noopener noreferrer">
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

            {/* Empty State */}
            {filteredSections.length === 0 && (
              <div className="text-center py-24">
                <Card className="p-16 bg-muted/30 border-dashed border-2 border-muted-foreground/20">
                  <CardContent className="p-0">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mx-auto flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary" />
                      </div>
                      <div className="absolute top-2 right-1/4 animate-bounce">
                        <Star className="w-6 h-6 text-accent" />
                      </div>
                      <div className="absolute bottom-4 left-1/4 animate-pulse">
                        <Star className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">Study Materials Coming Soon!</h3>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
                      We're preparing comprehensive study resources for you. Check back soon for fresh materials!
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && notesData?.hasMore && (
          <div className="text-center mt-8">
            <Button 
              onClick={loadMore}
              disabled={notesLoading}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {notesLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Notes
                  <FileText className="w-4 h-4" />
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {allNotes.length} of {notesData?.total || 0} notes
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}