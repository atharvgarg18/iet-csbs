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
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  RefreshCw,
  GraduationCap,
  FolderOpen,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COLORS } from '@/lib/management-design-system';

interface Note {
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
    section_id: '',
    drive_link: '',
    description: ''
  });

  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  // Filter sections based on selected batch
  const filteredSections = selectedBatch === 'all' 
    ? sections 
    : sections.filter(section => section.batch_id === selectedBatch);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/notes');
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
    fetchNotes();
    fetchBatches();
    fetchSections();
  }, []);

  const openCreateDialog = () => {
    setEditingNote(null);
    setFormData({
      section_id: '',
      drive_link: '',
      description: ''
    });
    setShowNoteDialog(true);
  };

  const openEditDialog = (note: Note) => {
    setEditingNote(note);
    setFormData({
      section_id: note.section_id,
      drive_link: note.drive_link,
      description: note.description
    });
    setShowNoteDialog(true);
  };

  const handleSaveNote = async () => {
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

      if (editingNote) {
        await apiPut(`/.netlify/functions/api/admin/notes/${editingNote.id}`, formData);
      } else {
        await apiPost('/.netlify/functions/api/admin/notes', formData);
      }

      toast({
        title: "Success!",
        description: `Notes ${editingNote ? 'updated' : 'created'} successfully`
      });

      setShowNoteDialog(false);
      fetchNotes();
    } catch (error) {
      console.error('Save note error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingNote ? 'update' : 'create'} notes`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setActionLoading(`delete-${noteId}`);
      
      await apiDelete(`/.netlify/functions/api/admin/notes/${noteId}`);

      toast({
        title: "Success!",
        description: "Notes deleted successfully"
      });

      fetchNotes();
    } catch (error) {
      console.error('Delete note error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete notes',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div 
            className="h-8 rounded mb-4"
            style={{ backgroundColor: COLORS.neutral[200] }}
          />
          <div 
            className="h-20 rounded-lg mb-6"
            style={{ backgroundColor: COLORS.neutral[200] }}
          />
          <div 
            className="h-64 rounded-lg"
            style={{ backgroundColor: COLORS.neutral[200] }}
          />
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
              style={{ backgroundColor: COLORS.primary[100] }}
            >
              <BookOpen className="w-6 h-6" style={{ color: COLORS.primary[600] }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Notes Management</h1>
              <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Manage Google Drive links for study notes by section</p>
            </div>
          </div>
          <Button 
            onClick={openCreateDialog} 
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            style={{ 
              backgroundColor: COLORS.primary[600], 
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary[700];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.primary[600];
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Notes Link
          </Button>
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
                  <h3 className="font-semibold mb-1" style={{ color: COLORS.error[800] }}>Error Loading Data</h3>
                  <p style={{ color: COLORS.error[600] }}>{error}</p>
                </div>
              </div>
              <Button
                onClick={fetchNotes}
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

        {/* Filters */}
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3" style={{ color: COLORS.neutral[800] }}>
              <Filter className="w-5 h-5" style={{ color: COLORS.primary[600] }} />
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

        {/* Notes List */}
        <div className="grid gap-4">
          {error ? (
            <Card 
              className="border"
              style={{ 
                backgroundColor: COLORS.error[50], 
                borderColor: COLORS.error[200] 
              }}
            >
              <CardContent className="p-6">
                <div className="text-center" style={{ color: COLORS.error[700] }}>{error}</div>
              </CardContent>
            </Card>
          ) : notes.length === 0 ? (
            <Card 
              className="shadow-sm border-0"
              style={{ backgroundColor: 'white' }}
            >
              <CardContent className="p-12">
                <div className="text-center">
                  <BookOpen 
                    className="w-12 h-12 mx-auto mb-4 opacity-50" 
                    style={{ color: COLORS.neutral[400] }} 
                  />
                  <p className="text-lg font-medium mb-2" style={{ color: COLORS.neutral[900] }}>No notes configured</p>
                  <p style={{ color: COLORS.neutral[600] }}>Add Google Drive links for study notes by section</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card 
                key={note.id} 
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
                        <GraduationCap className="w-6 h-6" style={{ color: COLORS.primary[600] }} />
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: COLORS.neutral[900] }}>
                          {note.section.batch.name} - Section {note.section.name}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: COLORS.neutral[600] }}>
                          {note.description || 'Study notes for this section'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: COLORS.neutral[500] }}>
                          <span>Updated: {new Date(note.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(note.drive_link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Drive
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(note)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoading === `delete-${note.id}`}
                          >
                            {actionLoading === `delete-${note.id}` ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Notes Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the notes link for <strong>{note.section.batch.name} - Section {note.section.name}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteNote(note.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Notes
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

        {/* Notes Dialog */}
        <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Edit Notes Link' : 'Add Notes Link'}
              </DialogTitle>
              <DialogDescription>
                Add a Google Drive link containing study notes for a section
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
                  placeholder="Optional description (e.g., Study notes for all subjects)"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowNoteDialog(false)}
                disabled={actionLoading === 'save'}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveNote}
                disabled={actionLoading === 'save'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {actionLoading === 'save' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingNote ? 'Update Notes' : 'Create Notes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}