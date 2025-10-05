import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Users,
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Batch, Section } from "@shared/api";

export default function BatchesManagement() {
  const [batches, setBatches] = useState<(Batch & { sections: Section[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isEditBatchOpen, setIsEditBatchOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [newBatchName, setNewBatchName] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [editBatchName, setEditBatchName] = useState("");

  useEffect(() => {
    document.title = "Batches & Sections - Admin - CSBS IET DAVV";
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/batches');
      const data = await response.json();
      
      if (data.error) {
        console.error('Error loading batches:', data.error);
        return;
      }
      
      setBatches(data.data || []);
    } catch (error) {
      console.error('Error loading batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async () => {
    if (!newBatchName.trim()) return;
    
    try {
      const response = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBatchName })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error adding batch:', data.error);
        return;
      }
      
      setNewBatchName("");
      setIsAddBatchOpen(false);
      loadBatches();
    } catch (error) {
      console.error('Error adding batch:', error);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim() || !selectedBatchId) return;
    
    try {
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          batch_id: selectedBatchId,
          name: newSectionName 
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error adding section:', data.error);
        return;
      }
      
      setNewSectionName("");
      setSelectedBatchId("");
      setIsAddSectionOpen(false);
      loadBatches();
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      const response = await fetch(`/api/admin/batches/${batchId}`, { 
        method: 'DELETE' 
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error deleting batch:', data.error);
        return;
      }
      
      loadBatches();
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/admin/sections/${sectionId}`, { 
        method: 'DELETE' 
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error deleting section:', data.error);
        return;
      }
      
      loadBatches();
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleEditBatch = (batch: Batch & { sections: Section[] }) => {
    setEditingBatch(batch);
    setEditBatchName(batch.name);
    setIsEditBatchOpen(true);
  };

  const handleUpdateBatch = async () => {
    if (!editingBatch || !editBatchName.trim()) return;
    
    try {
      const response = await fetch(`/api/admin/batches/${editingBatch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editBatchName.trim(),
          is_active: editingBatch.is_active 
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        console.error('Error updating batch:', data.error);
        return;
      }
      
      setEditBatchName("");
      setEditingBatch(null);
      setIsEditBatchOpen(false);
      loadBatches();
    } catch (error) {
      console.error('Error updating batch:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Batches & Sections</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Batches & Sections</h1>
          <p className="text-muted-foreground">
            Manage student batches and their sections. Each batch can have multiple sections.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddBatchOpen} onOpenChange={setIsAddBatchOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Batch</DialogTitle>
                <DialogDescription>
                  Create a new student batch. Use format like "2026-30".
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="batch-name">Batch Name</Label>
                  <Input
                    id="batch-name"
                    placeholder="e.g., 2026-30"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddBatchOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBatch}>Add Batch</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Batch Dialog */}
          <Dialog open={isEditBatchOpen} onOpenChange={setIsEditBatchOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Batch</DialogTitle>
                <DialogDescription>
                  Update the batch name. Use format like "2026-30".
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-batch-name">Batch Name</Label>
                  <Input
                    id="edit-batch-name"
                    placeholder="e.g., 2026-30"
                    value={editBatchName}
                    onChange={(e) => setEditBatchName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditBatchOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateBatch}>Update Batch</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Batches Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground">Active student batches</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.reduce((acc, batch) => acc + batch.sections.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all batches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Batch</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.length > 0 ? batches[batches.length - 1].name : "None"}
            </div>
            <p className="text-xs text-muted-foreground">Most recently added</p>
          </CardContent>
        </Card>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {batch.sections.map((section) => (
                        <Badge key={section.id} variant="outline" className="text-xs">
                          {section.name || "Single Section"}
                        </Badge>
                      ))}
                      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => setSelectedBatchId(batch.id)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Section to {batch.name}</DialogTitle>
                            <DialogDescription>
                              Create a new section for this batch (e.g., A, B, C).
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="section-name">Section Name</Label>
                              <Input
                                id="section-name"
                                placeholder="e.g., A, B, C"
                                value={newSectionName}
                                onChange={(e) => setNewSectionName(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddSection}>Add Section</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell>
                    {batch.is_active ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(batch.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditBatch(batch)}
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
                            <AlertDialogTitle>Delete Batch</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete batch "{batch.name}"? This will also delete all associated sections, notes, and papers. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBatch(batch.id)}
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}