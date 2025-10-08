import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
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
  Search, 
  Download,
  Calendar,
  User,
  RefreshCw,
  GraduationCap,
  FolderOpen,
  Clock,
  BookOpen,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Paper {
  id: string;
  title: string;
  description: string;
  file_url: string;
  semester: string;
  subject: string;
  paper_type: string;
  batch_id: string;
  batch_name: string;
  section_id: string;
  section_name: string;
  uploaded_by: string;
  uploader_name: string;
  upload_date: string;
  file_size: number;
  download_count: number;
  is_active: boolean;
}

interface Batch {
  id: string;
  name: string;
  year: number;
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
    title: '',
    description: '',
    semester: '',
    subject: '',
    paper_type: '',
    batch_id: '',
    section_id: '',
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = !searchTerm || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = batchFilter === 'all' || paper.batch_id === batchFilter;
    const matchesType = typeFilter === 'all' || paper.paper_type === typeFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = paper.is_active;
    else if (statusFilter === 'inactive') matchesStatus = !paper.is_active;

    return matchesSearch && matchesBatch && matchesType && matchesStatus;
  });

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/api/admin/papers', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
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
      const response = await fetch('/.netlify/functions/api/admin/batches', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data = result.success ? result.data : result;
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Batches fetch error:', err);
      setBatches([]);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch('/.netlify/functions/api/admin/sections', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data = result.success ? result.data : result;
      setSections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Sections fetch error:', err);
      setSections([]);
    }
  };

  useEffect(() => {
    fetchPapers();
    fetchBatches();
    fetchSections();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const openCreateDialog = () => {
    setEditingPaper(null);
    setFormData({
      title: '',
      description: '',
      semester: '',
      subject: '',
      paper_type: '',
      batch_id: '',
      section_id: '',
      is_active: true
    });
    setSelectedFile(null);
    setShowPaperDialog(true);
  };

  const openEditDialog = (paper: Paper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      description: paper.description,
      semester: paper.semester,
      subject: paper.subject,
      paper_type: paper.paper_type,
      batch_id: paper.batch_id,
      section_id: paper.section_id,
      is_active: paper.is_active
    });
    setSelectedFile(null);
    setShowPaperDialog(true);
  };

  const handleSavePaper = async () => {
    if (!formData.title || !formData.batch_id || !formData.section_id) {
      toast({
        title: "Validation Error",
        description: "Title, batch, and section are required",
        variant: "destructive"
      });
      return;
    }

    if (!editingPaper && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const submitData = new FormData();
      if (selectedFile) {
        submitData.append('file', selectedFile);
      }
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('semester', formData.semester);
      submitData.append('subject', formData.subject);
      submitData.append('paper_type', formData.paper_type);
      submitData.append('batch_id', formData.batch_id);
      submitData.append('section_id', formData.section_id);
      submitData.append('is_active', formData.is_active.toString());

      const url = editingPaper 
        ? `/.netlify/functions/api/admin/papers/${editingPaper.id}`
        : '/.netlify/functions/api/admin/papers';
      
      const method = editingPaper ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingPaper ? 'update' : 'create'} paper`);
      }

      toast({
        title: "Success!",
        description: `Paper ${editingPaper ? 'updated' : 'created'} successfully`
      });

      setShowPaperDialog(false);
      fetchPapers();
    } catch (error) {
      console.error('Save paper error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingPaper ? 'update' : 'create'} paper`,
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
        throw new Error(errorData.error || 'Failed to delete paper');
      }

      toast({
        title: "Success!",
        description: "Paper deleted successfully"
      });

      fetchPapers();
    } catch (error) {
      console.error('Delete paper error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete paper',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'mid-term': 'bg-blue-100 text-blue-800',
      'end-term': 'bg-purple-100 text-purple-800',
      'quiz': 'bg-green-100 text-green-800',
      'assignment': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Papers</h3>
            <p className="text-gray-600">Fetching papers data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Papers Management</h1>
          <p className="text-gray-600 mt-1">Manage and organize academic papers</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Paper
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Connection Issue</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <Button
              onClick={fetchPapers}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Papers</p>
                <p className="text-2xl font-bold text-gray-900">{papers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Papers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {papers.filter(p => p.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Batches</p>
                <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Download className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {papers.reduce((sum, p) => sum + p.download_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search papers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by batch" />
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mid-term">Mid Term</SelectItem>
                <SelectItem value="end-term">End Term</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Papers List */}
      {filteredPapers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Papers Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || batchFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first paper'
              }
            </p>
            {!searchTerm && batchFilter === 'all' && typeFilter === 'all' && statusFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Paper
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {paper.title}
                      </h3>
                      <Badge className={getTypeColor(paper.paper_type)}>
                        {paper.paper_type}
                      </Badge>
                      {!paper.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    
                    {paper.description && (
                      <p className="text-gray-600 mb-3 line-clamp-2">{paper.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Subject:</span> {paper.subject}
                      </div>
                      <div>
                        <span className="font-medium">Semester:</span> {paper.semester}
                      </div>
                      <div>
                        <span className="font-medium">Batch:</span> {paper.batch_name}
                      </div>
                      <div>
                        <span className="font-medium">Section:</span> {paper.section_name}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{paper.uploader_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(paper.upload_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{paper.download_count} downloads</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{formatFileSize(paper.file_size)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(paper.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {(['admin', 'editor'].includes(user?.role || '')) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(paper)}
                          disabled={actionLoading !== null}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actionLoading !== null}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Paper</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete <strong>{paper.title}</strong>? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePaper(paper.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${paper.id}`}
                              >
                                {actionLoading === `delete-${paper.id}` ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Delete Paper
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

      {/* Create/Edit Paper Dialog */}
      <Dialog open={showPaperDialog} onOpenChange={setShowPaperDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPaper ? 'Edit Paper' : 'Add New Paper'}
            </DialogTitle>
            <DialogDescription>
              {editingPaper ? 'Update paper information' : 'Upload a new academic paper'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* File Upload (only for new papers) */}
            {!editingPaper && (
              <div>
                <Label className="text-sm font-medium">PDF File *</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter paper title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter paper description (optional)"
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Semester</Label>
                <Input
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="e.g., 5th Sem"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Paper Type</Label>
              <Select value={formData.paper_type} onValueChange={(value) => setFormData({ ...formData, paper_type: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select paper type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mid-term">Mid Term</SelectItem>
                  <SelectItem value="end-term">End Term</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Batch *</Label>
                <Select value={formData.batch_id} onValueChange={(value) => setFormData({ ...formData, batch_id: value, section_id: '' })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Section *</Label>
                <Select 
                  value={formData.section_id} 
                  onValueChange={(value) => setFormData({ ...formData, section_id: value })}
                  disabled={!formData.batch_id}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections
                      .filter(section => section.batch_id === formData.batch_id)
                      .map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active" className="text-sm font-medium">
                Active (Available for download)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
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
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editingPaper ? 'Update' : 'Create'} Paper
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}