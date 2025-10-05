import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  Link as LinkIcon,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Note, Section, Batch } from "@shared/api";

export default function NotesManagement() {
  const [notes, setNotes] = useState<(Note & { section: Section & { batch: Batch } })[]>([]);
  const [sections, setSections] = useState<(Section & { batch: Batch })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    section_id: "",
    drive_link: "",
    description: ""
  });

  useEffect(() => {
    document.title = "Notes Management - Admin - CSBS IET DAVV";
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load sections first
      const sectionsResponse = await fetch('/.netlify/functions/api/admin/sections');
      const sectionsData = await sectionsResponse.json();
      
      if (sectionsData.error) {
        console.error('Error loading sections:', sectionsData.error);
        return;
      }
      
      setSections(sectionsData.data || []);
      
      // Load notes
      const notesResponse = await fetch('/.netlify/functions/api/admin/notes');
      const notesData = await notesResponse.json();
      
      if (notesData.error) {
        console.error('Error loading notes:', notesData.error);
        return;
      }
      
      setNotes(notesData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!formData.section_id || !formData.drive_link.trim()) return;
    
    try {
      const response = await fetch('/.netlify/functions/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error adding note:', data.error);
        return;
      }
      
      setFormData({ section_id: "", drive_link: "", description: "" });
      setIsAddNoteOpen(false);
      loadData();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = (note: Note & { section: Section & { batch: Batch } }) => {
    setEditingNote(note);
    setFormData({
      section_id: note.section_id,
      drive_link: note.drive_link,
      description: note.description || ""
    });
    setIsEditNoteOpen(true);
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !formData.drive_link.trim()) return;
    
    try {
      const response = await fetch(`/api/admin/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drive_link: formData.drive_link,
          description: formData.description
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error updating note:', data.error);
        return;
      }
      
      setFormData({ section_id: "", drive_link: "", description: "" });
      setEditingNote(null);
      setIsEditNoteOpen(false);
      loadData();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/admin/notes/${noteId}`, { 
        method: 'DELETE' 
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error deleting note:', data.error);
        return;
      }
      
      loadData();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const getSectionDisplay = (section: Section & { batch: Batch }) => {
    return `${section.batch.name} - ${section.name || 'Single Section'}`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Notes Management</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Notes Management</h1>
          <p className="text-muted-foreground">
            Manage Google Drive links for notes per section. Each section should have one main drive link.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Notes Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Notes Link</DialogTitle>
                <DialogDescription>
                  Add a Google Drive link for notes for a specific section.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="section-select">Section</Label>
                  <Select value={formData.section_id} onValueChange={(value) => setFormData({...formData, section_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {getSectionDisplay(section)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="drive-link">Google Drive Link</Label>
                  <Input
                    id="drive-link"
                    placeholder="https://drive.google.com/..."
                    value={formData.drive_link}
                    onChange={(e) => setFormData({...formData, drive_link: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details about these notes..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote}>Add Notes Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Note Dialog */}
          <Dialog open={isEditNoteOpen} onOpenChange={setIsEditNoteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Notes Link</DialogTitle>
                <DialogDescription>
                  Update the Google Drive link and description for this section.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-drive-link">Google Drive Link</Label>
                  <Input
                    id="edit-drive-link"
                    placeholder="https://drive.google.com/..."
                    value={formData.drive_link}
                    onChange={(e) => setFormData({...formData, drive_link: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Additional details about these notes..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditNoteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateNote}>Update Notes Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes Links</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">Across all sections</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sections Covered</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(notes.map(note => note.section_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Out of {sections.length} sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drive Links</CardTitle>
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">Google Drive folders</p>
          </CardContent>
        </Card>
      </div>

      {/* Notes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Notes Links</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Drive Link</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{note.section.batch.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {note.section.name || 'Single Section'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => window.open(note.drive_link, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open Drive
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">
                      {note.description || 'No description'}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditNote(note)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Notes Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this notes link for {getSectionDisplay(note.section)}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteNote(note.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {notes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No notes links added yet</p>
                      <p className="text-sm text-muted-foreground">Add your first notes link to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}