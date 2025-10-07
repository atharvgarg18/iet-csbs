import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Plus, Edit, Trash2, Loader2, AlertCircle, FolderOpen, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Batch, Section } from '@shared/api';

interface BatchWithSections extends Batch {
  sections: Section[];
}

export default function BatchesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [batches, setBatches] = useState<BatchWithSections[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Create/Edit batch modal state
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [batchName, setBatchName] = useState('');
  
  // Create section modal state
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [sectionName, setSectionName] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchBatches();
    }
  }, [user]);

  const fetchBatches = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/api/admin/batches', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch batches: ${response.status}`);
      }

      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Fetch batches error:', error);
      setError(error.message || 'Failed to load batches');
      toast({
        title: 'Error',
        description: 'Failed to load batches',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBatch = async () => {
    if (!batchName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Batch name is required',
        variant: 'destructive'
      });
      return;
    }

    setActionLoading('save-batch');
    try {
      const url = editingBatch 
        ? `/.netlify/functions/api/admin/batches/${editingBatch.id}`
        : '/.netlify/functions/api/admin/batches';
      
      const method = editingBatch ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: batchName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingBatch ? 'update' : 'create'} batch`);
      }

      toast({
        title: 'Success',
        description: `Batch ${editingBatch ? 'updated' : 'created'} successfully`
      });

      setShowBatchDialog(false);
      setBatchName('');
      setEditingBatch(null);
      fetchBatches();
    } catch (error) {
      console.error('Save batch error:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${editingBatch ? 'update' : 'create'} batch`,
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBatch = async (batchId: number) => {
    setActionLoading(`delete-batch-${batchId}`);
    try {
      const response = await fetch(`/.netlify/functions/api/admin/batches/${batchId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete batch');
      }

      toast({
        title: 'Success',
        description: 'Batch deleted successfully'
      });
      
      fetchBatches();
    } catch (error) {
      console.error('Delete batch error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete batch',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveSection = async () => {
    if (!sectionName.trim() || !selectedBatchId) {
      toast({
        title: 'Validation Error',
        description: 'Section name is required',
        variant: 'destructive'
      });
      return;
    }

    setActionLoading('save-section');
    try {
      const response = await fetch('/.netlify/functions/api/admin/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          batch_id: selectedBatchId,
          name: sectionName 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create section');
      }

      toast({
        title: 'Success',
        description: 'Section created successfully'
      });

      setShowSectionDialog(false);
      setSectionName('');
      setSelectedBatchId(null);
      fetchBatches();
    } catch (error) {
      console.error('Save section error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create section',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    setActionLoading(`delete-section-${sectionId}`);
    try {
      const response = await fetch(`/.netlify/functions/api/admin/sections/${sectionId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete section');
      }

      toast({
        title: 'Success',
        description: 'Section deleted successfully'
      });
      
      fetchBatches();
    } catch (error) {
      console.error('Delete section error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete section',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openBatchDialog = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setBatchName(batch.name);
    } else {
      setEditingBatch(null);
      setBatchName('');
    }
    setShowBatchDialog(true);
  };

  const openSectionDialog = (batchId: number) => {
    setSelectedBatchId(batchId);
    setSectionName('');
    setShowSectionDialog(true);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Only administrators can manage batches.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Batches Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Batches Management</h1>
          <Button onClick={fetchBatches} variant="outline">
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches Management</h1>
          <p className="text-gray-600 mt-1">
            Manage academic batches and their sections
          </p>
        </div>
        <Button onClick={() => openBatchDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Create Batch
        </Button>
      </div>

      {/* Batches List */}
      <div className="space-y-4">
        {batches.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
              <p className="text-gray-600 mb-4">Create your first batch to get started</p>
              <Button onClick={() => openBatchDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Batch
              </Button>
            </CardContent>
          </Card>
        ) : (
          batches.map((batch) => (
            <Card key={batch.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      {batch.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <FolderOpen className="h-3 w-3 mr-1" />
                        {batch.sections.length} sections
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Created: {new Date(batch.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSectionDialog(batch.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Section
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openBatchDialog(batch)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Batch</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{batch.name}"? This will also delete all associated sections and their content. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteBatch(batch.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={actionLoading === `delete-batch-${batch.id}`}
                          >
                            {actionLoading === `delete-batch-${batch.id}` && (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              
              {/* Sections Table */}
              {batch.sections.length > 0 && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Section Name</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batch.sections.map((section) => (
                        <TableRow key={section.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-blue-600" />
                              {section.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(section.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Section</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{section.name}"? This will also delete all associated notes and papers. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSection(section.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={actionLoading === `delete-section-${section.id}`}
                                  >
                                    {actionLoading === `delete-section-${section.id}` && (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    )}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Batch Dialog */}
      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBatch ? 'Edit Batch' : 'Create New Batch'}
            </DialogTitle>
            <DialogDescription>
              {editingBatch 
                ? 'Update the batch information.'
                : 'Create a new academic batch. You can add sections after creating the batch.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="batch-name">Batch Name</Label>
              <Input
                id="batch-name"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g., 2023-2024, Batch A, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBatchDialog(false)}
              disabled={actionLoading === 'save-batch'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBatch}
              disabled={actionLoading === 'save-batch'}
            >
              {actionLoading === 'save-batch' && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingBatch ? 'Update' : 'Create'} Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Section Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
            <DialogDescription>
              Add a new section to the selected batch.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="section-name">Section Name</Label>
              <Input
                id="section-name"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="e.g., CS-A, Section 1, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSectionDialog(false)}
              disabled={actionLoading === 'save-section'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSection}
              disabled={actionLoading === 'save-section'}
            >
              {actionLoading === 'save-section' && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}