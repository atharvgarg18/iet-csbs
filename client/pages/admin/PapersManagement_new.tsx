import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { FileText, Plus, Edit, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Paper {
  id: number;
  title: string;
  description: string;
  drive_link: string;
  batch_id: number;
  subject_name: string;
  year: number;
  exam_type: string;
  created_at: string;
  updated_at: string;
  batch?: {
    name: string;
  };
}

interface Batch {
  id: number;
  name: string;
  year: number;
  semester: number;
}

export default function PapersManagementNew() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    drive_link: '',
    batch_id: '',
    subject_name: '',
    year: '',
    exam_type: ''
  });

  // API Base URL that works for both localhost and Netlify
  const getApiUrl = (endpoint: string) => {
    return `/.netlify/functions/api${endpoint}`;
  };

  // Fetch papers from API
  const fetchPapers = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/admin/papers'));
      const data = await response.json();
      
      if (data.success) {
        setPapers(data.data || []);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch papers",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch papers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch batches for dropdown
  const fetchBatches = async () => {
    try {
      const response = await fetch(getApiUrl('/admin/batches'));
      const data = await response.json();
      
      if (data.success) {
        setBatches(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  // Create or Update paper
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.drive_link || !formData.batch_id || !formData.subject_name || !formData.year || !formData.exam_type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const url = editingPaper 
        ? getApiUrl(`/admin/papers/${editingPaper.id}`)
        : getApiUrl('/admin/papers');
      
      const method = editingPaper ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          batch_id: parseInt(formData.batch_id),
          year: parseInt(formData.year)
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: editingPaper ? "Paper updated successfully" : "Paper created successfully"
        });
        
        setDialogOpen(false);
        resetForm();
        fetchPapers();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save paper",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving paper:', error);
      toast({
        title: "Error",
        description: "Failed to save paper",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete paper
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(getApiUrl(`/admin/papers/${id}`), {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Paper deleted successfully"
        });
        fetchPapers();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete paper",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting paper:', error);
      toast({
        title: "Error",
        description: "Failed to delete paper",
        variant: "destructive"
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      drive_link: '',
      batch_id: '',
      subject_name: '',
      year: '',
      exam_type: ''
    });
    setEditingPaper(null);
  };

  // Open edit dialog
  const openEditDialog = (paper: Paper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      description: paper.description || '',
      drive_link: paper.drive_link,
      batch_id: paper.batch_id.toString(),
      subject_name: paper.subject_name,
      year: paper.year.toString(),
      exam_type: paper.exam_type
    });
    setDialogOpen(true);
  };

  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchPapers();
    fetchBatches();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Papers Management</h1>
          <p className="text-muted-foreground">Manage previous year papers and exam materials</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Paper
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPaper ? 'Edit Paper' : 'Add New Paper'}
              </DialogTitle>
              <DialogDescription>
                {editingPaper ? 'Update paper information' : 'Create a new paper entry'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter paper title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="subject_name">Subject *</Label>
                <Input
                  id="subject_name"
                  value={formData.subject_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject_name: e.target.value }))}
                  placeholder="Enter subject name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="exam_type">Exam Type *</Label>
                  <Select
                    value={formData.exam_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, exam_type: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mid-sem">Mid Semester</SelectItem>
                      <SelectItem value="end-sem">End Semester</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="batch">Batch *</Label>
                <Select
                  value={formData.batch_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, batch_id: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="drive_link">Google Drive Link *</Label>
                <Input
                  id="drive_link"
                  type="url"
                  value={formData.drive_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, drive_link: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingPaper ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Papers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Papers ({papers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading papers...</span>
            </div>
          ) : papers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No papers found. Create your first paper!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Drive Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {papers.map((paper) => (
                  <TableRow key={paper.id}>
                    <TableCell className="font-medium">{paper.title}</TableCell>
                    <TableCell>{paper.subject_name}</TableCell>
                    <TableCell>{paper.year}</TableCell>
                    <TableCell className="capitalize">{paper.exam_type.replace('-', ' ')}</TableCell>
                    <TableCell>{paper.batch?.name || `Batch ${paper.batch_id}`}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(paper.drive_link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(paper)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Paper</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{paper.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(paper.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}