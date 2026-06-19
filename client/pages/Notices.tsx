import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Notice } from '@shared/api';
import { supabase } from '@/lib/supabase';
import { Reveal, StaggerContainer, StaggerItem, MagneticButton } from "@/components/MotionWrappers";
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
          id, category_id, title, content, is_published, publish_date, attachment_url, created_at, updated_at,
          category:notice_categories (id, name, color, is_active)
        `)
        .eq('is_published', true)
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
    <div className="min-h-screen bg-background text-foreground relative">
      <Navigation />

      <main className="relative z-10 px-4 md:px-16 pt-48 pb-32 max-w-[1600px] mx-auto">
        <Reveal>
          <div className="mb-24">
            <p className="font-syne text-sm uppercase tracking-widest text-primary mb-4">Archive / 04</p>
            <h1 className="font-syne text-6xl md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.9]">
              Official <br /> <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Notices</span>
            </h1>
          </div>
        </Reveal>

        {loading && (
          <div className="flex justify-center py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}

        {error && (
          <div className="py-32 text-destructive font-syne text-2xl uppercase tracking-widest">
            Error: {error}
          </div>
        )}

        {!loading && !error && notices.length > 0 && (
          <StaggerContainer className="flex flex-col border-t border-border">
            {notices.map((notice, idx) => (
              <StaggerItem key={notice.id}>
                <a
                  href={notice.attachment_url || "#"}
                  target={notice.attachment_url ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`group relative border-b border-border py-8 px-4 md:px-8 hover-trigger flex flex-col md:flex-row justify-between md:items-center transition-colors duration-500 overflow-hidden ${!notice.attachment_url ? 'cursor-default pointer-events-none' : 'block'}`}
                >
                  <div className="absolute inset-0 bg-muted/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />

                  <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full">

                    {/* Notice Date / Category */}
                    <div className="md:w-1/4 flex flex-col gap-2">
                      <span className="font-syne text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                        {formatDate(notice.publish_date || notice.created_at)}
                      </span>
                      {notice.category && (
                        <span className="text-sm font-medium tracking-widest text-primary uppercase">
                          {notice.category.name}
                        </span>
                      )}
                      {isRecent(notice.publish_date || notice.created_at) && (
                        <span className="text-xs font-bold tracking-widest text-secondary uppercase animate-pulse">
                          [ NEW ]
                        </span>
                      )}
                    </div>

                    {/* Notice Title and Content */}
                    <div className="md:w-2/4">
                      <h3 className="font-syne text-2xl md:text-4xl font-bold uppercase tracking-tighter mb-4 group-hover:text-foreground transition-colors">
                        {notice.title}
                      </h3>
                      {notice.content && (
                        <p className="text-lg text-muted-foreground line-clamp-2">
                          {notice.content}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="md:w-1/4 flex justify-end items-center mt-4 md:mt-0">
                      {notice.attachment_url && (
                        <MagneticButton>
                          <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors duration-300 pointer-events-auto">
                            <ExternalLink className="w-6 h-6" />
                          </div>
                        </MagneticButton>
                      )}
                    </div>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {!loading && !error && notices.length === 0 && (
          <div className="py-32 text-center text-muted-foreground font-syne text-2xl uppercase tracking-widest">
            No official notices currently.
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
