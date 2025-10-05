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
  FileText,
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
import { Paper, Section, Batch } from "@shared/api";

export default function PapersManagement() {
  const [papers, setPapers] = useState<(Paper & { section: Section & { batch: Batch } })[]>([]);
  const [sections, setSections] = useState<(Section & { batch: Batch })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPaperOpen, setIsAddPaperOpen] = useState(false);
  const [isEditPaperOpen, setIsEditPaperOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [formData, setFormData] = useState({
    section_id: "",
    drive_link: "",
    description: ""
  });

  useEffect(() => {
    document.title = "Papers Management - Admin - CSBS IET DAVV";
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
      
      // Load papers
      const papersResponse = await fetch('/.netlify/functions/api/admin/papers');
      const papersData = await papersResponse.json();
      
      if (papersData.error) {
        console.error('Error loading papers:', papersData.error);
        return;
      }
      
      setPapers(papersData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaper = async () => {
    if (!formData.section_id || !formData.drive_link.trim()) return;
    
    try {
      const response = await fetch('/.netlify/functions/api/admin/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error adding paper:', data.error);
        return;
      }
      
      setFormData({ section_id: "", drive_link: "", description: "" });
      setIsAddPaperOpen(false);
      loadData();
    } catch (error) {
      console.error('Error adding paper:', error);
    }
  };

  const handleEditPaper = (paper: Paper & { section: Section & { batch: Batch } }) => {
    setEditingPaper(paper);
    setFormData({
      section_id: paper.section_id,
      drive_link: paper.drive_link,
      description: paper.description || ""
    });
    setIsEditPaperOpen(true);
  };

  const handleUpdatePaper = async () => {
    if (!editingPaper || !formData.drive_link.trim()) return;
    
    try {
      const response = await fetch(`/api/admin/papers/${editingPaper.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drive_link: formData.drive_link,
          description: formData.description
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error updating paper:', data.error);
        return;
      }
      
      setFormData({ section_id: "", drive_link: "", description: "" });
      setEditingPaper(null);
      setIsEditPaperOpen(false);
      loadData();
    } catch (error) {
      console.error('Error updating paper:', error);
    }
  };

  const handleDeletePaper = async (paperId: string) => {
    try {
      const response = await fetch(`/api/admin/papers/${paperId}`, { 
        method: 'DELETE' 
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error deleting paper:', data.error);
        return;
      }
      
      loadData();
    } catch (error) {
      console.error('Error deleting paper:', error);
    }
  };

  const getSectionDisplay = (section: Section & { batch: Batch }) => {
    return `${section.batch.name} - ${section.name || 'Single Section'}`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Papers Management</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Papers Management</h1>
          <p className="text-muted-foreground">
            Manage Google Drive links for question papers per section. Each section should have one main drive link.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddPaperOpen} onOpenChange={setIsAddPaperOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Papers Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Papers Link</DialogTitle>
                <DialogDescription>
                  Add a Google Drive link for question papers for a specific section.
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
                    placeholder="Additional details about these papers..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPaperOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPaper}>Add Papers Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Paper Dialog */}
          <Dialog open={isEditPaperOpen} onOpenChange={setIsEditPaperOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Papers Link</DialogTitle>
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
                    placeholder="Additional details about these papers..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditPaperOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePaper}>Update Papers Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Papers Links</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{papers.length}</div>
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
              {new Set(papers.map(paper => paper.section_id)).size}
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
            <div className="text-2xl font-bold">{papers.length}</div>
            <p className="text-xs text-muted-foreground">Google Drive folders</p>
          </CardContent>
        </Card>
      </div>

      {/* Papers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Papers Links</CardTitle>
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
              {papers.map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{paper.section.batch.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {paper.section.name || 'Single Section'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => window.open(paper.drive_link, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open Drive
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground truncate">
                      {paper.description || 'No description'}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(paper.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditPaper(paper)}
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
                            <AlertDialogTitle>Delete Papers Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this papers link for {getSectionDisplay(paper.section)}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePaper(paper.id)}
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
              {papers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No papers links added yet</p>
                      <p className="text-sm text-muted-foreground">Add your first papers link to get started</p>
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