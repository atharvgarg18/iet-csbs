import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Plus, Edit, Trash2, ExternalLink, Loader2, AlertCircle, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Paper {
  id: number;
  section_id: number;
  drive_link: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  sections: {
    id: number;
    name: string;
    batches: {
      id: number;
      name: string;
    };
  };
}

interface Section {
  id: number;
  name: string;
  batch_id: number;
  batches: {
    id: number;
    name: string;
  };
}

export default function PapersManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Create/Edit paper modal state
  const [showPaperDialog, setShowPaperDialog] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [formData, setFormData] = useState({
    section_id: '',
    drive_link: '',
    description: ''
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  // Get unique batches for filter
  const batches = Array.from(
    new Map(sections.map(section => [section.batches.id, section.batches])).values()
  );

  // Filter papers based on search and selections
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = !searchTerm || 
      paper.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.sections.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.sections.batches.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = selectedBatch === 'all' || 
      paper.sections.batches.id.toString() === selectedBatch;
    
    const matchesSection = selectedSection === 'all' || 
      paper.sections.id.toString() === selectedSection;

    return matchesSearch && matchesBatch && matchesSection;
  });

  // Get sections for the selected batch (for filter)
  const sectionsForBatch = selectedBatch === 'all' 
    ? sections 
    : sections.filter(section => section.batches.id.toString() === selectedBatch);

  useEffect(() => {
    if (user && ['admin', 'editor', 'viewer'].includes(user.role)) {
      fetchPapers();
      fetchSections();
    }
  }, [user]);

  const fetchPapers = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/api/admin/papers', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch papers: ${response.status}`);
      }

      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Fetch papers error:', error);
      setError(error.message || 'Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      setSectionsLoading(true);
      const response = await fetch('/.netlify/functions/api/admin/sections', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sections: ${response.status}`);
      }

      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Fetch sections error:', error);
      toast({
        title: 'Warning',
        description: 'Failed to load sections. Creating papers may not work properly.',
        variant: 'destructive'
      });
    } finally {
      setSectionsLoading(false);
    }
  };

  const handleSavePaper = async () => {
    if (!formData.section_id || !formData.drive_link.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Section and drive link are required',
        variant: 'destructive'
      });
      return;
    }

    // Validate Google Drive link
    if (!formData.drive_link.includes('drive.google.com') && !formData.drive_link.includes('docs.google.com')) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a valid Google Drive link',
        variant: 'destructive'
      });
      return;
    }

    setActionLoading('save-paper');
    try {
      const url = editingPaper 
        ? `/.netlify/functions/api/admin/papers/${editingPaper.id}`
        : '/.netlify/functions/api/admin/papers';
      
      const method = editingPaper ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          section_id: parseInt(formData.section_id),
          drive_link: formData.drive_link,
          description: formData.description || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingPaper ? 'update' : 'create'} paper`);
      }

      toast({
        title: 'Success',
        description: `Paper ${editingPaper ? 'updated' : 'created'} successfully`
      });

      setShowPaperDialog(false);
      resetForm();
      fetchPapers();
    } catch (error) {
      console.error('Save paper error:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${editingPaper ? 'update' : 'create'} paper`,
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePaper = async (paperId: number) => {
    setActionLoading(`delete-paper-${paperId}`);
    try {
      const response = await fetch(`/.netlify/functions/api/admin/papers/${paperId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete paper');
      }

      toast({
        title: 'Success',
        description: 'Paper deleted successfully'
      });
      
      fetchPapers();
    } catch (error) {
      console.error('Delete paper error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete paper',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openPaperDialog = (paper?: Paper) => {
    if (paper) {
      setEditingPaper(paper);
      setFormData({
        section_id: paper.section_id.toString(),
        drive_link: paper.drive_link,
        description: paper.description || ''
      });
    } else {
      setEditingPaper(null);
      resetForm();
    }
    setShowPaperDialog(true);
  };

  const resetForm = () => {
    setFormData({
      section_id: '',
      drive_link: '',
      description: ''
    });
    setEditingPaper(null);
  };

  // Check if user has edit access
  const canEdit = user && ['admin', 'editor'].includes(user.role);

  if (!user || !['admin', 'editor', 'viewer'].includes(user.role)) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Only administrators, editors, and viewers can access papers management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Papers Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Papers Management</h1>
          <Button onClick={fetchPapers} variant="outline">
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Papers Management</h1>
          <p className="text-gray-600 mt-1">
            Manage exam papers and question papers
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => openPaperDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Paper
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="batch-filter">Batch</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="section-filter">Section</Label>
              <Select 
                value={selectedSection} 
                onValueChange={setSelectedSection}
                disabled={selectedBatch !== 'all' && sectionsForBatch.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sectionsForBatch.map((section) => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBatch('all');
                  setSelectedSection('all');
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Papers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Papers ({filteredPapers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPapers.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {papers.length === 0 ? 'No papers found' : 'No papers match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {papers.length === 0 
                  ? 'Start by adding your first paper'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {canEdit && papers.length === 0 && (
                <Button onClick={() => openPaperDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Paper
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPapers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">
                            {paper.description || 'Untitled Paper'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {paper.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {paper.sections.batches.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {paper.sections.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(paper.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={paper.drive_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        {canEdit && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPaperDialog(paper)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Paper</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this paper? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePaper(paper.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={actionLoading === `delete-paper-${paper.id}`}
                                  >
                                    {actionLoading === `delete-paper-${paper.id}` && (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    )}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Paper Dialog */}
      {canEdit && (
        <Dialog open={showPaperDialog} onOpenChange={setShowPaperDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPaper ? 'Edit Paper' : 'Add New Paper'}
              </DialogTitle>
              <DialogDescription>
                {editingPaper 
                  ? 'Update the paper information.'
                  : 'Add a new exam or question paper with a Google Drive link.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="paper-section">Section *</Label>
                <Select 
                  value={formData.section_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, section_id: value }))}
                  disabled={sectionsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id.toString()}>
                        {section.batches.name} - {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {sectionsLoading && (
                  <p className="text-sm text-gray-500 mt-1">Loading sections...</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="paper-link">Google Drive Link *</Label>
                <Input
                  id="paper-link"
                  value={formData.drive_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, drive_link: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Paste the shareable Google Drive link for the paper
                </p>
              </div>

              <div>
                <Label htmlFor="paper-description">Description</Label>
                <Textarea
                  id="paper-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the paper (e.g., Mid-term Exam 2023, Final Paper, etc.)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPaperDialog(false)}
                disabled={actionLoading === 'save-paper'}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePaper}
                disabled={actionLoading === 'save-paper'}
              >
                {actionLoading === 'save-paper' && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingPaper ? 'Update' : 'Add'} Paper
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}