import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Search,
  Calendar,
  Users,
  BookOpen,
  Target,
  FileCheck,
  Clock,
  Database,
  Link,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COLORS } from '@/lib/management-design-system';

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
  department: string;
  is_active: boolean;
}

interface Section {
  id: string;
  name: string;
  batch_id: string;
  batch_name: string;
  current_students: number;
  max_students: number;
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  // Filter sections based on selected batch
  const filteredSections = selectedBatch === 'all' 
    ? sections 
    : sections.filter(section => section.batch_id === selectedBatch);

  // Filter papers based on search and batch
  const filteredPapers = papers.filter(paper => {
    const matchesSearch = !searchTerm || 
      paper.section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.section.batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paper.description && paper.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBatch = selectedBatch === 'all' || paper.section.batch.id === selectedBatch;
    
    return matchesSearch && matchesBatch;
  });

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/papers');
      const data = result.success ? result.data : result;
      setPapers(Array.isArray(data) ? data : []);
    } catch (err: any) {
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
    } catch (err: any) {
      console.error('Batches fetch error:', err);
    }
  };

  const fetchSections = async () => {
    try {
      const result = await apiGet('/.netlify/functions/api/admin/sections');
      const data = result.success ? result.data : result;
      setSections(Array.isArray(data) ? data : []);
    } catch (err: any) {
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

  const validateGoogleDriveLink = (url: string) => {
    const drivePatterns = [
      /^https:\/\/drive\.google\.com\/.*$/,
      /^https:\/\/docs\.google\.com\/.*$/,
      /^https:\/\/www\.google\.com\/drive\/.*$/
    ];
    return drivePatterns.some(pattern => pattern.test(url));
  };

  const handleSavePaper = async () => {
    if (!formData.section_id || !formData.drive_link) {
      toast({
        title: "Validation Error",
        description: "Section and Google Drive link are required",
        variant: "destructive"
      });
      return;
    }

    if (!validateGoogleDriveLink(formData.drive_link)) {
      toast({
        title: "Invalid Link",
        description: "Please enter a valid Google Drive link",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const url = editingPaper 
        ? `/.netlify/functions/api/admin/papers/${editingPaper.id}`
        : '/.netlify/functions/api/admin/papers';
      
      const method = editingPaper ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingPaper ? 'update' : 'create'} paper link`);
      }

      toast({
        title: "Success!",
        description: `Paper link ${editingPaper ? 'updated' : 'created'} successfully`
      });

      setShowPaperDialog(false);
      fetchPapers();
    } catch (error: any) {
      console.error('Save paper error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingPaper ? 'update' : 'create'} paper link`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePaper = async (paperId: string) => {
    try {
      setActionLoading(`delete-${paperId}`);
      
      const response = await fetch(`/.netlify/functions/api/admin/papers/${paperId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete paper link');
      }

      toast({
        title: "Success!",
        description: "Paper link deleted successfully"
      });

      fetchPapers();
    } catch (error: any) {
      console.error('Delete paper error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete paper link',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center" style={{ backgroundColor: COLORS.neutral[50] }}>
        <div className="text-center">
          <div className="relative mb-6">
            <div 
              className="w-16 h-16 border-4 rounded-full animate-spin"
              style={{ 
                borderColor: COLORS.neutral[200],
                borderTopColor: COLORS.primary[600]
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-6 w-6 animate-pulse" style={{ color: COLORS.primary[600] }} />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.neutral[900] }}>Loading Papers</h3>
          <p style={{ color: COLORS.neutral[600] }}>Fetching question paper links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: COLORS.neutral[50] }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Papers Management</h1>
          <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Manage Google Drive links for question papers by section</p>
        </div>
        {['admin', 'editor'].includes(user?.role || '') && (
          <Button 
            onClick={openCreateDialog}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            style={{ 
              backgroundColor: COLORS.primary[600], 
              color: 'white',
              border: 'none'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Paper Link
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div 
          className="rounded-lg p-6 border"
          style={{ 
            backgroundColor: COLORS.error[50], 
            borderColor: COLORS.error[200] 
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-3" style={{ color: COLORS.error[600] }} />
              <div>
                <h3 className="font-semibold mb-1" style={{ color: COLORS.error[800] }}>Connection Issue</h3>
                <p style={{ color: COLORS.error[600] }}>{error}</p>
              </div>
            </div>
            <Button
              onClick={fetchPapers}
              variant="outline"
              className="transition-colors duration-200"
              style={{ 
                color: COLORS.error[600], 
                borderColor: COLORS.error[200] 
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.primary[600] }}>Total Papers</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>{papers.length}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary[100] }}
              >
                <BookOpen className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.success[600] }}>Active Batches</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {batches.filter(b => b.is_active).length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.success[100] }}
              >
                <GraduationCap className="h-6 w-6" style={{ color: COLORS.success[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.warning[600] }}>Sections Covered</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {new Set(papers.map(p => p.section_id)).size}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.warning[100] }}
              >
                <FolderOpen className="h-6 w-6" style={{ color: COLORS.warning[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.accent[600] }}>Recent Updates</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {papers.filter(p => {
                    const updatedDate = new Date(p.updated_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return updatedDate > weekAgo;
                  }).length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.accent[100] }}
              >
                <Clock className="h-6 w-6" style={{ color: COLORS.accent[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card 
        className="shadow-sm border-0"
        style={{ backgroundColor: 'white' }}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: COLORS.neutral[400] }} />
                <Input
                  placeholder="Search papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border transition-colors duration-200"
                  style={{ borderColor: COLORS.neutral[200] }}
                />
              </div>
            </div>
            <div>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger style={{ borderColor: COLORS.neutral[200] }}>
                  <SelectValue placeholder="All Batches" />
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
            </div>
            <div className="flex items-center gap-2" style={{ color: COLORS.neutral[600] }}>
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">
                {filteredPapers.length} of {papers.length} papers
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Papers List */}
      {filteredPapers.length === 0 ? (
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.neutral[300] }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>No Papers Found</h3>
            <p className="mb-6" style={{ color: COLORS.neutral[600] }}>
              {searchTerm || selectedBatch !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first paper link'
              }
            </p>
            {!searchTerm && selectedBatch === 'all' && ['admin', 'editor'].includes(user?.role || '') && (
              <Button 
                onClick={openCreateDialog} 
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: COLORS.primary[600], 
                  color: 'white',
                  border: 'none'
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Paper Link
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPapers.map((paper) => (
            <Card 
              key={paper.id} 
              className="shadow-sm border-0 hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: 'white' }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: COLORS.primary[100] }}
                    >
                      <Link className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: COLORS.neutral[900] }}>
                        {paper.section.batch.name} - Section {paper.section.name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: COLORS.neutral[600] }}>
                        {paper.description || 'Question papers for this section'}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge 
                          className="text-xs border"
                          style={{ 
                            backgroundColor: COLORS.success[100], 
                            color: COLORS.success[700],
                            borderColor: COLORS.success[200]
                          }}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active Link
                        </Badge>
                        <span className="text-xs" style={{ color: COLORS.neutral[500] }}>
                          Updated {new Date(paper.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.open(paper.drive_link, '_blank')}
                      className="px-4 py-2 transition-all duration-200"
                      style={{ 
                        backgroundColor: COLORS.success[600],
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Drive
                    </Button>
                    
                    {['admin', 'editor'].includes(user?.role || '') && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(paper)}
                          className="transition-colors duration-200"
                          style={{ 
                            color: COLORS.primary[600],
                            borderColor: COLORS.primary[200]
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="transition-colors duration-200"
                              style={{ 
                                color: COLORS.error[600],
                                borderColor: COLORS.error[200]
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Paper Link</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this paper link for "{paper.section.batch.name} - Section {paper.section.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePaper(paper.id)}
                                style={{ backgroundColor: COLORS.error[600] }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showPaperDialog} onOpenChange={setShowPaperDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPaper ? 'Edit Paper Link' : 'Add New Paper Link'}
            </DialogTitle>
            <DialogDescription>
              {editingPaper ? 'Update paper link information' : 'Add a Google Drive link for question papers'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="section">Section</Label>
              <Select value={formData.section_id} onValueChange={(value) => setFormData({ ...formData, section_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.batch_name} - {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="drive_link">Google Drive Link</Label>
              <Input
                id="drive_link"
                type="url"
                value={formData.drive_link}
                onChange={(e) => setFormData({ ...formData, drive_link: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs mt-1" style={{ color: COLORS.neutral[500] }}>
                Ensure the link has proper sharing permissions for students
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description (e.g., Mid-term papers, Final exam papers)"
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
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              {actionLoading === 'save' ? 'Saving...' : editingPaper ? 'Update Link' : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}