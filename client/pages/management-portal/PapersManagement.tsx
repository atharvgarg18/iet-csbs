import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  RefreshCw,
  GraduationCap,
  FolderOpen,
  Filter,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COLORS } from './management-design-system';

interface Paper {
  id: string;
  section_id: string;
  drive_link: string;
  description: string;
  created_at: string;
  updated_at: string;
  section: {
    id: string;
    name: string;
    batch: {
      id: string;
      name: string;
    };
  };
}

interface Batch {
  id: string;
  name: string;
}

interface Section {
  id: string;
  name: string;
  batch_id: string;
}

export default function PapersManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showPaperDialog, setShowPaperDialog] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [formData, setFormData] = useState({
    section_id: '',
    drive_link: '',
    description: ''
  });

  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  // Filter sections based on selected batch
  const filteredSections = selectedBatch === 'all' 
    ? sections 
    : sections.filter(section => section.batch_id === selectedBatch);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/papers');
      const data = result.success ? result.data : result;
      setPapers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Papers fetch error:', err);
      setError('Failed to load papers');
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const result = await apiGet('/.netlify/functions/api/admin/batches');
      const data = result.success ? result.data : result;
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Batches fetch error:', err);
    }
  };

  const fetchSections = async () => {
    try {
      const result = await apiGet('/.netlify/functions/api/admin/sections');
      const data = result.success ? result.data : result;
      setSections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Sections fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPapers();
    fetchBatches();
    fetchSections();
  }, []);

  const openCreateDialog = () => {
    setEditingPaper(null);
    setFormData({
      section_id: '',
      drive_link: '',
      description: ''
    });
    setShowPaperDialog(true);
  };

  const openEditDialog = (paper: Paper) => {
    setEditingPaper(paper);
    setFormData({
      section_id: paper.section_id,
      drive_link: paper.drive_link,
      description: paper.description
    });
    setShowPaperDialog(true);
  };

  const handleSavePaper = async () => {
    try {
      if (!formData.section_id || !formData.drive_link) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      setActionLoading('save');

      if (editingPaper) {
        await apiPut(`/.netlify/functions/api/admin/papers/${editingPaper.id}`, formData);
      } else {
        await apiPost('/.netlify/functions/api/admin/papers', formData);
      }

      toast({
        title: "Success!",
        description: `Papers ${editingPaper ? 'updated' : 'created'} successfully`
      });

      setShowPaperDialog(false);
      fetchPapers();
    } catch (error) {
      console.error('Save paper error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingPaper ? 'update' : 'create'} papers`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePaper = async (paperId: string) => {
    try {
      setActionLoading(`delete-${paperId}`);
      
      await apiDelete(`/.netlify/functions/api/admin/papers/${paperId}`);

      toast({
        title: "Success!",
        description: "Papers deleted successfully"
      });

      fetchPapers();
    } catch (error) {
      console.error('Delete paper error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete papers',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading papers...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: COLORS.neutral[50] }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.accent[100] }}
            >
              <FileText className="w-6 h-6" style={{ color: COLORS.accent[600] }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Papers Management</h1>
              <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Manage Google Drive links for question papers by section</p>
            </div>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            style={{ 
              backgroundColor: COLORS.accent[600], 
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.accent[700];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.accent[600];
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Papers Link
          </Button>
        </div>

        {/* Filters */}
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3" style={{ color: COLORS.neutral[800] }}>
              <Filter className="w-5 h-5" style={{ color: COLORS.accent[600] }} />
              Filter by Batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger 
                className="w-64 border transition-colors duration-200"
                style={{ borderColor: COLORS.neutral[200] }}
              >
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Papers List */}
        <div className="grid gap-4">
          {error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="text-center text-red-700">{error}</div>
              </CardContent>
            </Card>
          ) : papers.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No papers configured</p>
                  <p>Add Google Drive links for question papers by section</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            papers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {paper.section.batch.name} - Section {paper.section.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {paper.description || 'Question papers for this section'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Updated: {new Date(paper.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(paper.drive_link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Drive
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(paper)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoading === `delete-${paper.id}`}
                          >
                            {actionLoading === `delete-${paper.id}` ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Papers Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the papers link for <strong>{paper.section.batch.name} - Section {paper.section.name}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePaper(paper.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Papers
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Papers Dialog */}
        <Dialog open={showPaperDialog} onOpenChange={setShowPaperDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPaper ? 'Edit Papers Link' : 'Add Papers Link'}
              </DialogTitle>
              <DialogDescription>
                Add a Google Drive link containing question papers for a section
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="section_id">Section *</Label>
                <Select 
                  value={formData.section_id} 
                  onValueChange={(value) => setFormData({...formData, section_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSections.map((section) => {
                      const batch = batches.find(b => b.id === section.batch_id);
                      return (
                        <SelectItem key={section.id} value={section.id}>
                          {batch?.name} - Section {section.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="drive_link">Google Drive Link *</Label>
                <Input
                  id="drive_link"
                  value={formData.drive_link}
                  onChange={(e) => setFormData({...formData, drive_link: e.target.value})}
                  placeholder="https://drive.google.com/drive/folders/..."
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Optional description (e.g., Question papers for all semesters)"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowPaperDialog(false)}
                disabled={actionLoading === 'save'}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSavePaper}
                disabled={actionLoading === 'save'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {actionLoading === 'save' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingPaper ? 'Update Papers' : 'Create Papers'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}