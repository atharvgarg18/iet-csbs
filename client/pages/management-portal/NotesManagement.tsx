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
  FolderOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading notes...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notes Management</h1>
              <p className="text-gray-600">Manage Google Drive links for study notes by section</p>
            </div>
          </div>
          <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Notes Link
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Filter by Batch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-64">
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
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="text-center text-red-700">{error}</div>
              </CardContent>
            </Card>
          ) : notes.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <div className="text-center text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No notes configured</p>
                  <p>Add Google Drive links for study notes by section</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {note.section.batch.name} - Section {note.section.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {note.description || 'Study notes for this section'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
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