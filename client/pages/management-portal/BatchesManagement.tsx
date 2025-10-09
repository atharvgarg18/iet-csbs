import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  GraduationCap, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users,
  Calendar,
  RefreshCw,
  BookOpen,
  Award,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Filter,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Batch } from '@shared/api';
import { COLORS } from '@/lib/management-design-system';

export default function BatchesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear() + 4,
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (batch.description && batch.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = batch.is_active;
    else if (statusFilter === 'inactive') matchesStatus = !batch.is_active;
    
    return matchesSearch && matchesStatus;
  });

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/batches');
      const data = result.success ? result.data : result;
      setBatches(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Batches fetch error:', err);
      setError('Failed to load batches');
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const openCreateDialog = () => {
    setEditingBatch(null);
    setFormData({
      name: '',
      description: '',
      start_year: new Date().getFullYear(),
      end_year: new Date().getFullYear() + 4,
      is_active: true
    });
    setShowDialog(true);
  };

  const openEditDialog = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      description: batch.description || '',
      start_year: batch.start_year || new Date().getFullYear(),
      end_year: batch.end_year || new Date().getFullYear() + 4,
      is_active: batch.is_active
    });
    setShowDialog(true);
  };

  const handleSaveBatch = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Batch name is required",
        variant: "destructive"
      });
      return;
    }

    if (formData.end_year <= formData.start_year) {
      toast({
        title: "Validation Error",
        description: "End year must be after start year",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const url = editingBatch 
        ? `/.netlify/functions/api/admin/batches/${editingBatch.id}`
        : '/.netlify/functions/api/admin/batches';
      
      const method = editingBatch ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingBatch ? 'update' : 'create'} batch`);
      }

      toast({
        title: "Success!",
        description: `Batch ${editingBatch ? 'updated' : 'created'} successfully`
      });

      setShowDialog(false);
      fetchBatches();
    } catch (error: any) {
      console.error('Save batch error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingBatch ? 'update' : 'create'} batch`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      setActionLoading(`delete-${batchId}`);
      
      const response = await fetch(`/.netlify/functions/api/admin/batches/${batchId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete batch');
      }

      toast({
        title: "Success!",
        description: "Batch deleted successfully"
      });

      fetchBatches();
    } catch (error: any) {
      console.error('Delete batch error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete batch',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getBatchYearRange = (batch: Batch) => {
    if (batch.start_year && batch.end_year) {
      return `${batch.start_year}-${batch.end_year}`;
    }
    return 'Year not set';
  };

  const getBatchStatus = (batch: Batch) => {
    const currentYear = new Date().getFullYear();
    if (!batch.start_year || !batch.end_year) return 'pending';
    if (currentYear < batch.start_year) return 'upcoming';
    if (currentYear >= batch.start_year && currentYear <= batch.end_year) return 'active';
    return 'completed';
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return { backgroundColor: COLORS.success[100], color: COLORS.success[700], borderColor: COLORS.success[200] };
      case 'upcoming':
        return { backgroundColor: COLORS.primary[100], color: COLORS.primary[700], borderColor: COLORS.primary[200] };
      case 'completed':
        return { backgroundColor: COLORS.neutral[100], color: COLORS.neutral[700], borderColor: COLORS.neutral[200] };
      default:
        return { backgroundColor: COLORS.warning[100], color: COLORS.warning[700], borderColor: COLORS.warning[200] };
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center" style={{ backgroundColor: COLORS.neutral[50] }}>
        <div className="text-center">
          <div className="relative mb-6">
            <div 
              className="w-16 h-16 border-4 rounded-full animate-spin"
              style={{ 
                borderColor: COLORS.neutral[200],
                borderTopColor: COLORS.primary[600]
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 animate-pulse" style={{ color: COLORS.primary[600] }} />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.neutral[900] }}>Loading Batches</h3>
          <p style={{ color: COLORS.neutral[600] }}>Fetching batch information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: COLORS.neutral[50] }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Batch Management</h1>
          <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Organize and manage student batches and academic years</p>
        </div>
        {user?.role === 'admin' && (
          <Button 
            onClick={openCreateDialog}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            style={{ 
              backgroundColor: COLORS.primary[600], 
              color: 'white',
              border: 'none'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Batch
          </Button>
        )}
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
                <h3 className="font-semibold mb-1" style={{ color: COLORS.error[800] }}>Connection Issue</h3>
                <p style={{ color: COLORS.error[600] }}>{error}</p>
              </div>
            </div>
            <Button
              onClick={fetchBatches}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.primary[600] }}>Total Batches</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>{batches.length}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary[100] }}
              >
                <GraduationCap className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.success[600] }}>Active Batches</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {batches.filter(b => b.is_active).length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.success[100] }}
              >
                <CheckCircle className="h-6 w-6" style={{ color: COLORS.success[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.warning[600] }}>Current Year</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {batches.filter(b => getBatchStatus(b) === 'active').length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.warning[100] }}
              >
                <Clock className="h-6 w-6" style={{ color: COLORS.warning[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.accent[600] }}>Upcoming</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {batches.filter(b => getBatchStatus(b) === 'upcoming').length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.accent[100] }}
              >
                <Calendar className="h-6 w-6" style={{ color: COLORS.accent[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card 
        className="shadow-sm border-0"
        style={{ backgroundColor: 'white' }}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: COLORS.neutral[400] }} />
                <Input
                  placeholder="Search batches by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border transition-colors duration-200"
                  style={{ borderColor: COLORS.neutral[200] }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border transition-colors duration-200" style={{ borderColor: COLORS.neutral[200] }}>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2" style={{ color: COLORS.neutral[600] }}>
                <Filter className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {filteredBatches.length} of {batches.length}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batches Grid */}
      {filteredBatches.length === 0 ? (
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.neutral[300] }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>No Batches Found</h3>
            <p className="mb-6" style={{ color: COLORS.neutral[600] }}>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first batch'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && user?.role === 'admin' && (
              <Button 
                onClick={openCreateDialog} 
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
                style={{ 
                  backgroundColor: COLORS.primary[600], 
                  color: 'white',
                  border: 'none'
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Batch
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => {
            const status = getBatchStatus(batch);
            const statusStyle = getStatusBadgeStyle(status);
            return (
              <Card 
                key={batch.id} 
                className="shadow-sm border-0 hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: 'white' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: COLORS.primary[100] }}
                      >
                        <GraduationCap className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: COLORS.neutral[900] }}>
                          {batch.name}
                        </h3>
                        <p className="text-sm" style={{ color: COLORS.neutral[500] }}>
                          {getBatchYearRange(batch)}
                        </p>
                      </div>
                    </div>
                    
                    {user?.role === 'admin' && (
                      <div className="flex items-center gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openEditDialog(batch)}
                          className="h-8 w-8 p-0 transition-colors duration-200"
                          style={{ 
                            color: COLORS.primary[600]
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0 transition-colors duration-200"
                              style={{ 
                                color: COLORS.error[600]
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Batch</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{batch.name}"? This action cannot be undone and may affect related sections and students.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBatch(batch.id)}
                                style={{ backgroundColor: COLORS.error[600] }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  
                  {batch.description && (
                    <p className="text-sm mb-4" style={{ color: COLORS.neutral[600] }}>
                      {batch.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      className="text-xs border capitalize"
                      style={statusStyle}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      {status}
                    </Badge>
                    <div className="flex items-center">
                      {batch.is_active ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" style={{ color: COLORS.success[600] }} />
                          <span className="text-xs" style={{ color: COLORS.success[600] }}>Active</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" style={{ color: COLORS.neutral[400] }} />
                          <span className="text-xs" style={{ color: COLORS.neutral[500] }}>Inactive</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t" style={{ borderColor: COLORS.neutral[100] }}>
                    <div className="text-xs" style={{ color: COLORS.neutral[500] }}>
                      Created {new Date(batch.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingBatch ? 'Edit Batch' : 'Create New Batch'}
            </DialogTitle>
            <DialogDescription>
              {editingBatch ? 'Update batch information and settings' : 'Create a new batch for managing students'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Batch Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., CSE Batch 2024-28"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description of this batch"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_year">Start Year</Label>
                <Input
                  id="start_year"
                  type="number"
                  min="2020"
                  max="2050"
                  value={formData.start_year}
                  onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) || new Date().getFullYear() })}
                />
              </div>
              <div>
                <Label htmlFor="end_year">End Year</Label>
                <Input
                  id="end_year"
                  type="number"
                  min="2020"
                  max="2050"
                  value={formData.end_year}
                  onChange={(e) => setFormData({ ...formData, end_year: parseInt(e.target.value) || new Date().getFullYear() + 4 })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active batch</Label>
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: COLORS.neutral[50], borderColor: COLORS.neutral[200] }}>
              <h4 className="font-medium mb-2" style={{ color: COLORS.neutral[800] }}>Preview</h4>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: COLORS.primary[100] }}
                >
                  <GraduationCap className="h-4 w-4" style={{ color: COLORS.primary[600] }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: COLORS.neutral[900] }}>
                    {formData.name || 'Batch Name'}
                  </p>
                  <p className="text-sm" style={{ color: COLORS.neutral[500] }}>
                    {formData.start_year}-{formData.end_year}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
              disabled={actionLoading === 'save'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveBatch}
              disabled={actionLoading === 'save'}
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              {actionLoading === 'save' ? 'Saving...' : editingBatch ? 'Update Batch' : 'Create Batch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}