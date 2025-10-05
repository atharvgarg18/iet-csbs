import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  ChevronRight,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Clock,
  FileText,
  Users,
  Archive,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Note, Section, Batch } from "@shared/api";
import { supabase } from "@/lib/supabase";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");

  useEffect(() => {
    document.title = "Study Materials";
    fetchNotesData();
  }, []);

  const fetchNotesData = async () => {
    try {
      setLoading(true);
      
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select(`
          id,
          section_id,
          drive_link,
          description,
          created_at,
          updated_at,
          section:sections (
            id,
            batch_id,
            name,
            is_active,
            batch:batches (
              id,
              name,
              is_active
            )
          )
        `)
        .order('created_at', { ascending: false });

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select(`
          id,
          batch_id,
          name,
          is_active,
          created_at,
          updated_at,
          batch:batches (
            id,
            name,
            is_active
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;
      if (sectionsError) throw sectionsError;

      setNotes(notesData || []);
      setSections(sectionsData || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const groupedData = () => {
    const grouped: { [batchId: string]: { batch: Batch, sections: { section: Section, notes: Note[] }[] } } = {};
    
    notes.forEach(note => {
      if (!note.section?.batch) return;
      
      const batchId = note.section.batch.id;
      if (!grouped[batchId]) {
        grouped[batchId] = {
          batch: note.section.batch,
          sections: []
        };
      }
      
      let sectionGroup = grouped[batchId].sections.find(s => s.section.id === note.section!.id);
      if (!sectionGroup) {
        sectionGroup = { section: note.section, notes: [] };
        grouped[batchId].sections.push(sectionGroup);
      }
      
      sectionGroup.notes.push(note);
    });
    
    return Object.values(grouped);
  };

  const allBatches = Array.from(new Set(notes.map(n => n.section?.batch?.name).filter(Boolean)));
  const filteredData = selectedBatch === "all" ? groupedData() : 
    groupedData().filter(group => group.batch.name === selectedBatch);

  const totalItems = notes.length;
  const recentItems = notes.filter(n => {
    const daysDiff = (Date.now() - new Date(n.created_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B]">
        <Navigation />
        <div className="pt-24 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                <p className="text-white/60 text-sm">Loading content...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0B]">
        <Navigation />
        <div className="pt-24 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Unable to load</h3>
                <p className="text-white/60 mb-6 max-w-sm">{error}</p>
                <Button 
                  onClick={fetchNotesData}
                  className="bg-white text-black hover:bg-white/90 transition-colors"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navigation />
      
      {/* Header Section */}
      <div className="pt-24 pb-12 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm font-medium tracking-wider uppercase">
                  Academic Resources
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight mb-4">
                Study Materials
              </h1>
              <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
                Access comprehensive study resources, lecture materials, and academic content 
                organized by batch and section for optimal learning experience.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center min-w-[120px]">
                <div className="text-2xl font-light text-white mb-1">{totalItems}</div>
                <div className="text-white/60 text-sm">Resources</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center min-w-[120px]">
                <div className="text-2xl font-light text-white mb-1">{recentItems}</div>
                <div className="text-white/60 text-sm">Recent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="py-8 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-white/40" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBatch("all")}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedBatch === "all"
                      ? "bg-white text-black font-medium"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                  }`}
                >
                  All Batches
                </button>
                {allBatches.map((batch) => (
                  <button
                    key={batch}
                    onClick={() => setSelectedBatch(batch)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedBatch === batch
                        ? "bg-white text-black font-medium"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                    }`}
                  >
                    {batch}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all min-w-[250px]"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {totalItems === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-white/20" />
              </div>
              <h3 className="text-2xl font-light text-white mb-3">No materials yet</h3>
              <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
                Study materials and resources will appear here once they're uploaded. 
                Check back soon for updates.
              </p>
              <Button 
                onClick={fetchNotesData}
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredData.map((batchGroup) => (
                <div key={batchGroup.batch.id} className="space-y-8">
                  {/* Batch Header */}
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-white/60 text-sm tracking-wider uppercase">
                          Academic Year
                        </span>
                      </div>
                      <h2 className="text-3xl font-light text-white">
                        {batchGroup.batch.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-4 text-white/40">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {batchGroup.sections.length} sections
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4" />
                        <span className="text-sm">
                          {batchGroup.sections.reduce((total, section) => total + section.notes.length, 0)} items
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sections Grid */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    {batchGroup.sections.map((sectionGroup) => (
                      <Card
                        key={sectionGroup.section.id}
                        className="bg-white/[0.02] backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.04] group overflow-hidden"
                      >
                        <CardContent className="p-0">
                          {/* Section Header */}
                          <div className="p-6 border-b border-white/5">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center">
                                  <span className="text-white font-medium text-sm">
                                    {sectionGroup.section.name}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="text-white font-medium">
                                    Section {sectionGroup.section.name}
                                  </h3>
                                  <p className="text-white/60 text-sm">
                                    {sectionGroup.notes.length} materials available
                                  </p>
                                </div>
                              </div>
                              
                              <Badge className="bg-white/10 text-white/80 border-white/20 hover:bg-white/20">
                                {batchGroup.batch.name}
                              </Badge>
                            </div>
                          </div>

                          {/* Materials List */}
                          <div className="p-6">
                            {sectionGroup.notes.length === 0 ? (
                              <div className="text-center py-8">
                                <FileText className="w-8 h-8 text-white/20 mx-auto mb-3" />
                                <p className="text-white/40 text-sm">No materials uploaded</p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {sectionGroup.notes.slice(0, 3).map((note) => (
                                  <div
                                    key={note.id}
                                    className="group/item flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer border border-transparent hover:border-white/10"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
                                          <FileText className="w-3 h-3 text-white/60" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-white text-sm font-medium truncate">
                                            {note.description || "Study Material"}
                                          </p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Clock className="w-3 h-3 text-white/40" />
                                            <span className="text-white/40 text-xs">
                                              {new Date(note.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                              })}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <Button
                                      size="sm"
                                      onClick={() => window.open(note.drive_link, "_blank")}
                                      className="bg-white/10 hover:bg-white/20 text-white border-white/20 opacity-0 group-hover/item:opacity-100 transition-all ml-4"
                                      variant="outline"
                                    >
                                      <ExternalLink className="w-3 h-3 mr-2" />
                                      Open
                                    </Button>
                                  </div>
                                ))}
                                
                                {sectionGroup.notes.length > 3 && (
                                  <div className="pt-3 border-t border-white/5">
                                    <button className="w-full text-left p-3 rounded-xl hover:bg-white/[0.02] transition-all group/more">
                                      <div className="flex items-center justify-between">
                                        <span className="text-white/60 text-sm">
                                          View {sectionGroup.notes.length - 3} more materials
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-white/40 group-hover/more:text-white/60 group-hover/more:translate-x-1 transition-all" />
                                      </div>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}