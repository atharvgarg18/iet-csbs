import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
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
  Sparkles,
  RefreshCw,
  GraduationCap,
  FolderOpen,
  Clock,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Paper {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  subject: string;
  semester: string;
  year: string;
  exam_type: string;
  batch_name: string;
  section_name: string;
  created_at: string;
  created_by: string;
  creator_name: string;
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
    title: '',
    description: '',
    subject: '',
    semester: '',
    year: '',
    exam_type: '',
    batch_id: '',
    section_id: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = !searchTerm || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || paper.subject === selectedSubject;
    const matchesSemester = selectedSemester === 'all' || paper.semester === selectedSemester;
    const matchesYear = selectedYear === 'all' || paper.year === selectedYear;
    const matchesExamType = selectedExamType === 'all' || paper.exam_type === selectedExamType;

    return matchesSearch && matchesSubject && matchesSemester && matchesYear && matchesExamType;
  });

  // Get unique values for filters
  const subjects = [...new Set(papers.map(paper => paper.subject))].filter(Boolean);
  const semesters = [...new Set(papers.map(paper => paper.semester))].filter(Boolean);
  const years = [...new Set(papers.map(paper => paper.year))].filter(Boolean);
  const examTypes = [...new Set(papers.map(paper => paper.exam_type))].filter(Boolean);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/api/papers', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
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
      const response = await fetch('/.netlify/functions/api/batches', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBatches(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Batches fetch error:', err);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch('/.netlify/functions/api/sections', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSections(Array.isArray(data) ? data : []);
      }
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
      title: '',
      description: '',
      subject: '',
      semester: '',
      year: '',
      exam_type: '',
      batch_id: '',
      section_id: ''
    });
    setSelectedFile(null);
    setShowPaperDialog(true);
  };

  const openEditDialog = (paper: Paper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      description: paper.description,
      subject: paper.subject,
      semester: paper.semester,
      year: paper.year,
      exam_type: paper.exam_type,
      batch_id: '',
      section_id: ''
    });
    setSelectedFile(null);
    setShowPaperDialog(true);
  };

  const handleSavePaper = async () => {
    if (!formData.title || !formData.subject || !formData.semester || !formData.year) {
      toast({
        title: "Validation Error",
        description: "Title, subject, semester, and year are required",
        variant: "destructive"
      });
      return;
    }

    if (!editingPaper && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('semester', formData.semester);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('exam_type', formData.exam_type || '');
      formDataToSend.append('batch_id', formData.batch_id || '');
      formDataToSend.append('section_id', formData.section_id || '');
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const url = editingPaper 
        ? `/.netlify/functions/api/papers/${editingPaper.id}`
        : '/.netlify/functions/api/papers';
      
      const method = editingPaper ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: formDataToSend
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
      
      const response = await fetch(`/.netlify/functions/api/papers/${paperId}`, {
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

  const handleDownload = async (paper: Paper) => {
    try {
      setActionLoading(`download-${paper.id}`);
      
      const response = await fetch(paper.file_url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = paper.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "File downloaded successfully"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getExamTypeBadgeColor = (examType: string) => {
    const colors = {
      'Mid Term': 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700',
      'Final': 'bg-gradient-to-br from-red-50 to-pink-50 text-red-700',
      'Quiz': 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700',
      'Assignment': 'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700',
      'Practice': 'bg-gradient-to-br from-yellow-50 to-orange-50 text-orange-700',
      'Previous Year': 'bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700'
    };
    return colors[examType] || 'bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700';
  };

  const getSemesterBadeColor = (semester: string) => {
    const colors = [
      'bg-gradient-to-br from-red-50 to-pink-50 text-red-700',
      'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700',
      'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700',
      'bg-gradient-to-br from-yellow-50 to-orange-50 text-orange-700',
      'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700',
      'bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700',
      'bg-gradient-to-br from-pink-50 to-rose-50 text-pink-700',
      'bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700'
    ];
    const index = parseInt(semester.replace(/\D/g, '')) || 1;
    return colors[(index - 1) % colors.length] || colors[0];
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-indigo-200/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="h-6 w-6 text-indigo-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Papers</h3>
          <p className="text-slate-500">Fetching question papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Papers Management</h1>
          <p className="text-slate-500 mt-1">Manage question papers and exam materials</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Paper
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-bold mb-1">Connection Issue</h3>
              <p className="text-red-600">{error}</p>
            </div>
            <Button
              onClick={fetchPapers}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search papers by title, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map(semester => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {examTypes.map(examType => (
                  <SelectItem key={examType} value={examType}>{examType}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Papers Grid */}
      {filteredPapers.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Papers Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedSubject !== 'all' || selectedSemester !== 'all' || selectedYear !== 'all' || selectedExamType !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first paper'
              }
            </p>
            {!searchTerm && selectedSubject === 'all' && selectedSemester === 'all' && selectedYear === 'all' && selectedExamType === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First Paper
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <div className="p-6">
                  {/* Paper Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">{paper.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{paper.subject}</p>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <Badge className={`${getSemesterBadeColor(paper.semester)} border-0 shadow-sm font-medium`}>
                      {paper.semester}
                    </Badge>
                    {paper.exam_type && (
                      <Badge className={`${getExamTypeBadgeColor(paper.exam_type)} border-0 shadow-sm font-medium`}>
                        {paper.exam_type}
                      </Badge>
                    )}
                    <Badge className="bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700 border-0 shadow-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {paper.year}
                    </Badge>
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {paper.batch_name && (
                      <Badge className="bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 border-0 shadow-sm">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {paper.batch_name}
                      </Badge>
                    )}
                    {paper.section_name && (
                      <Badge className="bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-700 border-0 shadow-sm">
                        <FolderOpen className="h-3 w-3 mr-1" />
                        {paper.section_name}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {paper.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{paper.description}</p>
                  )}

                  {/* File Info */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 p-3 bg-slate-50 rounded-xl">
                    <FileText className="h-4 w-4" />
                    <span className="truncate">{paper.file_name}</span>
                  </div>

                  {/* Created Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{paper.creator_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(paper.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(paper)}
                      disabled={actionLoading === `download-${paper.id}`}
                      className="flex-1 hover:bg-green-50 hover:text-green-600"
                    >
                      {actionLoading === `download-${paper.id}` ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download
                    </Button>
                    
                    {(['admin', 'editor'].includes(user?.role || '')) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(paper)}
                          disabled={actionLoading !== null}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoading !== null}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-0 shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5 text-red-600" />
                                Delete Paper
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Are you sure you want to delete <strong>{paper.title}</strong>? This action cannot be undone and will remove the file permanently.
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
        <DialogContent className="sm:max-w-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              {editingPaper ? 'Edit Paper' : 'Create New Paper'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingPaper ? 'Update paper information and content' : 'Add a new question paper to the system'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter paper title"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="subject" className="text-sm font-semibold text-slate-700">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter subject name"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter paper description (optional)"
                className="mt-2 border-0 bg-slate-50 focus:bg-white transition-colors"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="semester" className="text-sm font-semibold text-slate-700">Semester *</Label>
                <Input
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="e.g., Semester 1"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="year" className="text-sm font-semibold text-slate-700">Year *</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., 2024"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="exam_type" className="text-sm font-semibold text-slate-700">Exam Type</Label>
                <Select value={formData.exam_type} onValueChange={(value) => setFormData({ ...formData, exam_type: value })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific type</SelectItem>
                    <SelectItem value="Mid Term">Mid Term</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                    <SelectItem value="Quiz">Quiz</SelectItem>
                    <SelectItem value="Assignment">Assignment</SelectItem>
                    <SelectItem value="Practice">Practice</SelectItem>
                    <SelectItem value="Previous Year">Previous Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="batch" className="text-sm font-semibold text-slate-700">Batch</Label>
                <Select value={formData.batch_id} onValueChange={(value) => setFormData({ ...formData, batch_id: value, section_id: '' })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific batch</SelectItem>
                    {batches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="section" className="text-sm font-semibold text-slate-700">Section</Label>
              <Select 
                value={formData.section_id} 
                onValueChange={(value) => setFormData({ ...formData, section_id: value })}
                disabled={!formData.batch_id}
              >
                <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific section</SelectItem>
                  {sections
                    .filter(section => section.batch_id === formData.batch_id)
                    .map(section => (
                      <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file" className="text-sm font-semibold text-slate-700">
                File {!editingPaper && '*'}
              </Label>
              <div className="mt-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <input
                  id="file"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG
                </p>
                {selectedFile && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-xl">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPaperDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePaper}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {editingPaper ? 'Update' : 'Create'} Paper
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}