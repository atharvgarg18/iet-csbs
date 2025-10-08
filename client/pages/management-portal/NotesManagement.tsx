import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
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
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Upload,
  Download,
  FileText,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  GraduationCap,
  FolderOpen,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_name: string;
  subject: string;
  semester: string;
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

export default function NotesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
    batch_id: '',
    section_id: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    const matchesSemester = selectedSemester === 'all' || note.semester === selectedSemester;
    const matchesBatch = selectedBatch === 'all' || note.batch_name === selectedBatch;

    return matchesSearch && matchesSubject && matchesSemester && matchesBatch;
  });

  // Get unique values for filters
  const subjects = [...new Set(notes.map(note => note.subject))].filter(Boolean);
  const semesters = [...new Set(notes.map(note => note.semester))].filter(Boolean);
  const batchNames = [...new Set(notes.map(note => note.batch_name))].filter(Boolean);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/api/admin/notes', {
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
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Notes fetch error:', err);
      setError('Failed to load notes');
      setNotes([]);
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

      if (response.ok) {
        const result = await response.json();
        const data = result.success ? result.data : result;
        setBatches(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Batches fetch error:', err);
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

      if (response.ok) {
        const result = await response.json();
        const data = result.success ? result.data : result;
        setSections(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Sections fetch error:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchBatches();
    fetchSections();
  }, []);

  const openCreateDialog = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      description: '',
      subject: '',
      semester: '',
      batch_id: '',
      section_id: ''
    });
    setSelectedFile(null);
    setShowNoteDialog(true);
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      description: note.description,
      subject: note.subject,
      semester: note.semester,
      batch_id: '',
      section_id: ''
    });
    setSelectedFile(null);
    setShowNoteDialog(true);
  };

  const handleSaveNote = async () => {
    if (!formData.title || !formData.subject || !formData.semester) {
      toast({
        title: "Validation Error",
        description: "Title, subject, and semester are required",
        variant: "destructive"
      });
      return;
    }

    if (!editingNote && !selectedFile) {
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
      formDataToSend.append('batch_id', formData.batch_id || '');
      formDataToSend.append('section_id', formData.section_id || '');
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const url = editingNote 
        ? `/.netlify/functions/api/admin/notes/${editingNote.id}`
        : '/.netlify/functions/api/admin/notes';
      
      const method = editingNote ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingNote ? 'update' : 'create'} note`);
      }

      toast({
        title: "Success!",
        description: `Note ${editingNote ? 'updated' : 'created'} successfully`
      });

      setShowNoteDialog(false);
      fetchNotes();
    } catch (error) {
      console.error('Save note error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingNote ? 'update' : 'create'} note`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setActionLoading(`delete-${noteId}`);
      
      const response = await fetch(`/.netlify/functions/api/admin/notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete note');
      }

      toast({
        title: "Success!",
        description: "Note deleted successfully"
      });

      fetchNotes();
    } catch (error) {
      console.error('Delete note error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete note',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownload = async (note: Note) => {
    try {
      setActionLoading(`download-${note.id}`);
      
      const response = await fetch(note.file_url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.file_name;
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

  const getSemesterBadgeColor = (semester: string) => {
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
            <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-purple-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Notes</h3>
          <p className="text-slate-500">Fetching study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Notes Management</h1>
          <p className="text-slate-500 mt-1">Manage study materials and resources</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
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
              onClick={fetchNotes}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search notes by title, subject..."
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
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batchNames.map(batch => (
                  <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Notes Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedSubject !== 'all' || selectedSemester !== 'all' || selectedBatch !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first note'
              }
            </p>
            {!searchTerm && selectedSubject === 'all' && selectedSemester === 'all' && selectedBatch === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First Note
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="group hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-500"></div>
                <div className="p-6">
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">{note.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{note.subject}</p>
                      </div>
                    </div>
                  </div>

                  {/* Semester & Batch */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${getSemesterBadgeColor(note.semester)} border-0 shadow-sm font-medium`}>
                      {note.semester}
                    </Badge>
                    {note.batch_name && (
                      <Badge className="bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700 border-0 shadow-sm">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {note.batch_name}
                      </Badge>
                    )}
                    {note.section_name && (
                      <Badge className="bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 border-0 shadow-sm">
                        <FolderOpen className="h-3 w-3 mr-1" />
                        {note.section_name}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {note.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{note.description}</p>
                  )}

                  {/* File Info */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 p-3 bg-slate-50 rounded-xl">
                    <FileText className="h-4 w-4" />
                    <span className="truncate">{note.file_name}</span>
                  </div>

                  {/* Created Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{note.creator_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(note)}
                      disabled={actionLoading === `download-${note.id}`}
                      className="flex-1 hover:bg-green-50 hover:text-green-600"
                    >
                      {actionLoading === `download-${note.id}` ? (
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
                          onClick={() => openEditDialog(note)}
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
                                Delete Note
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Are you sure you want to delete <strong>{note.title}</strong>? This action cannot be undone and will remove the file permanently.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNote(note.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${note.id}`}
                              >
                                {actionLoading === `delete-${note.id}` ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Delete Note
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

      {/* Create/Edit Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-violet-600" />
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingNote ? 'Update note information and content' : 'Add a new study material to the system'}
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
                  placeholder="Enter note title"
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
                placeholder="Enter note description (optional)"
                className="mt-2 border-0 bg-slate-50 focus:bg-white transition-colors"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            <div>
              <Label htmlFor="file" className="text-sm font-semibold text-slate-700">
                File {!editingNote && '*'}
              </Label>
              <div className="mt-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <input
                  id="file"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT
                </p>
                {selectedFile && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-xl">
                    <FileText className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-medium text-slate-700">{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowNoteDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNote}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {editingNote ? 'Update' : 'Create'} Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}