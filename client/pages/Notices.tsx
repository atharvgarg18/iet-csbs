import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  Calendar,
  ExternalLink,
  AlertCircle,
  BookOpen,
  Star,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Notice } from "@shared/api";
import { supabase } from "@/lib/supabase";

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Notices - CSBS IET DAVV";
    fetchNoticesData();
  }, []);

  const fetchNoticesData = async () => {
    try {
      setLoading(true);
      
      const { data: noticesData, error: noticesError } = await supabase
        .from('notices')
        .select(`
          id,
          category_id,
          title,
          content,
          is_published,
          is_featured,
          publish_date,
          attachment_url,
          created_at,
          updated_at,
          category:notice_categories (
            id,
            name,
            color,
            is_active
          )
        `)
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('publish_date', { ascending: false });

      if (noticesError) throw noticesError;

      setNotices((noticesData || []) as unknown as Notice[]);
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isRecent = (dateString: string) => {
    const noticeDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - noticeDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 7;
  };

  return (
    <div className="min-h-screen bg-background relative">

      <Navigation />
      
      {/* Main content with site-consistent styling */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with site design consistency */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 mb-6">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Official Updates</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Notices
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay updated with important announcements, deadlines, and official communications
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-8">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <Bell className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            </div>
            <p className="text-xl text-foreground font-medium mb-2">Loading notices...</p>
            <p className="text-muted-foreground">Please wait while we fetch the latest updates</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/5 p-12 text-center mb-12">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-destructive mb-2">Unable to Load Content</h3>
              <p className="text-destructive/80 text-lg mb-4">{error}</p>
              <Button onClick={fetchNoticesData} variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Notices List */}
        {!loading && !error && (
          <div className="space-y-3">
            {notices.map((notice, noticeIndex) => (
              <Card key={notice.id} className="border-0 bg-card/50 hover:bg-card/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-lg ${
                      noticeIndex % 4 === 0 ? 'bg-primary/10' :
                      noticeIndex % 4 === 1 ? 'bg-secondary/10' :
                      noticeIndex % 4 === 2 ? 'bg-accent/10' : 'bg-primary/10'
                    } flex items-center justify-center flex-shrink-0 mt-1`}>
                      {notice.is_featured ? (
                        <Star className={`w-4 h-4 ${
                          noticeIndex % 4 === 0 ? 'text-primary' :
                          noticeIndex % 4 === 1 ? 'text-secondary' :
                          noticeIndex % 4 === 2 ? 'text-accent' : 'text-primary'
                        }`} />
                      ) : (
                        <Bell className={`w-4 h-4 ${
                          noticeIndex % 4 === 0 ? 'text-primary' :
                          noticeIndex % 4 === 1 ? 'text-secondary' :
                          noticeIndex % 4 === 2 ? 'text-accent' : 'text-primary'
                        }`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {notice.is_featured && (
                          <Badge variant="default" className="h-5 text-xs bg-primary">
                            Featured
                          </Badge>
                        )}
                        {notice.category && (
                          <Badge variant="secondary" className="h-5 text-xs">
                            {notice.category.name}
                          </Badge>
                        )}
                        {isRecent(notice.publish_date || notice.created_at) && (
                          <Badge variant="outline" className="h-5 text-xs border-accent text-accent">
                            New
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-foreground text-lg mb-2 leading-tight">
                        {notice.title}
                      </h3>
                      
                      {notice.content && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {notice.content}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Published {formatDate(notice.publish_date || notice.created_at)}</span>
                        {notice.created_at !== notice.updated_at && (
                          <>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>Updated {formatDate(notice.updated_at)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {notice.attachment_url && (
                      <div className="flex-shrink-0">
                        <Button asChild size="sm" className={`${
                          noticeIndex % 4 === 0 ? 'bg-primary hover:bg-primary/90' :
                          noticeIndex % 4 === 1 ? 'bg-secondary hover:bg-secondary/90' :
                          noticeIndex % 4 === 2 ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
                        } shadow-sm`}>
                          <a href={notice.attachment_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {notices.length === 0 && (
              <div className="text-center py-24">
                <Card className="p-16 bg-muted/30 border-dashed border-2 border-muted-foreground/20">
                  <CardContent className="p-0">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mx-auto flex items-center justify-center">
                        <Bell className="w-16 h-16 text-primary" />
                      </div>
                      <div className="absolute top-2 right-1/4 animate-bounce">
                        <Star className="w-6 h-6 text-accent" />
                      </div>
                      <div className="absolute bottom-4 left-1/4 animate-pulse">
                        <Star className="w-5 h-5 text-secondary" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">No Notices Available!</h3>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
                      There are no published notices at the moment. Check back later for updates.
                    </p>
                    <Button onClick={fetchNoticesData} variant="outline" className="gap-2">
                      <Bell className="w-4 h-4" />
                      Refresh
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}