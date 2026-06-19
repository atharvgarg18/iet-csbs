import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Paper } from '@shared/api';
import { usePapers, usePapersSections } from '@/hooks/useDataQueries';
import { Reveal, StaggerContainer, StaggerItem, MagneticButton } from "@/components/MotionWrappers";

export default function Papers() {
  const [page, setPage] = useState(0);
  const [allPapers, setAllPapers] = useState<Paper[]>([]);

  const { data: papersData, isLoading: papersLoading, error: papersError } = usePapers(page);
  const { data: sections = [], isLoading: sectionsLoading } = usePapersSections();

  const loading = papersLoading || sectionsLoading;
  const error = papersError ? 'Failed to load papers' : '';

  useEffect(() => {
    document.title = "Papers - CSBS IET DAVV";
  }, []);

  useEffect(() => {
    if (papersData?.papers) {
      setAllPapers(prev => {
        const newPapers = papersData.papers.filter(paper => !prev.some(p => p.id === paper.id));
        return [...prev, ...newPapers];
      });
    }
  }, [papersData]);

  const groupPapersBySection = () => {
    return sections.map(section => {
      const sectionPapers = allPapers.filter(paper => paper.section_id === section.id);
      return { section, papers: sectionPapers };
    }).filter(group => group.papers.length > 0);
  };

  const filteredSections = groupPapersBySection();

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navigation />

      <main className="relative z-10 px-4 md:px-16 pt-48 pb-32 max-w-[1600px] mx-auto">
        <Reveal>
          <div className="mb-24">
            <p className="font-syne text-sm uppercase tracking-widest text-secondary mb-4">Archive / 02</p>
            <h1 className="font-syne text-6xl md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.9]">
              Question <br /> <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>Papers</span>
            </h1>
          </div>
        </Reveal>

        {loading && allPapers.length === 0 && (
          <div className="flex justify-center py-32">
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
          </div>
        )}

        {error && (
          <div className="py-32 text-destructive font-syne text-2xl uppercase tracking-widest">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-32">
            {filteredSections.map((group, sectionIndex) => (
              <StaggerContainer key={group.section.id} className="space-y-8">
                <StaggerItem>
                  <h2 className="font-syne text-3xl md:text-5xl font-bold uppercase tracking-tight mb-12 flex items-baseline gap-4">
                    <span className="text-sm text-secondary tracking-widest">Sec. {group.section.name}</span>
                    {group.section.batch?.name}
                  </h2>
                </StaggerItem>

                <div className="flex flex-col border-t border-border">
                  {group.papers.map((paper) => (
                    <StaggerItem key={paper.id}>
                      <a href={paper.drive_link} target="_blank" rel="noopener noreferrer" className="group relative border-b border-border py-6 px-4 md:px-8 hover-trigger flex justify-between items-center transition-colors duration-500 overflow-hidden block">
                        <div className="absolute inset-0 bg-secondary/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 w-full">
                          <h3 className="font-syne text-xl md:text-3xl font-bold uppercase tracking-tighter w-full md:w-1/2 group-hover:text-secondary transition-colors">
                            {paper.description || "Question Paper"}
                          </h3>
                          <div className="flex gap-4 md:w-1/4 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                            <span>Google Drive</span>
                            <span>/</span>
                            <span>{new Date(paper.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="md:w-1/4 flex justify-end">
                            <MagneticButton>
                              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-secondary group-hover:text-black transition-colors duration-300">
                                <ExternalLink className="w-5 h-5" />
                              </div>
                            </MagneticButton>
                          </div>
                        </div>
                      </a>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            ))}

            {filteredSections.length === 0 && !loading && (
              <div className="py-32 text-center text-muted-foreground font-syne text-2xl uppercase tracking-widest">
                No materials available yet.
              </div>
            )}
          </div>
        )}

        {!loading && !error && papersData?.hasMore && (
          <div className="mt-32 flex justify-center">
            <MagneticButton>
              <button onClick={() => setPage(p => p + 1)} className="font-syne text-lg uppercase tracking-widest px-12 py-4 rounded-full border border-secondary text-secondary hover:bg-secondary hover:text-black transition-colors duration-300">
                Load More Archive
              </button>
            </MagneticButton>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
