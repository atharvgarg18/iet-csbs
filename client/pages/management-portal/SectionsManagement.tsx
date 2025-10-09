import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users,
  RefreshCw,
  BookOpen,
  MapPin,
  Clock,
  Check,
  X,
  FolderOpen,
  UserCheck,
  Target,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COLORS } from './management-design-system';

interface Section {
  id: string;
  name: string;
  description: string;
  batch_id: string;
  batch_name: string;
  max_students: number;
  current_students: number;
  is_active: boolean;
  room_number: string;
  class_timing: string;
  created_at: string;
  created_by: string;
  creator_name: string;
}

interface Batch {
  id: string;
  name: string;
  department: string;
  is_active: boolean;
}

export default function SectionsManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    batch_id: '',
    max_students: 30,
    room_number: '',
    class_timing: '',
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSections = sections.filter(section => {
    const matchesSearch = !searchTerm || 
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.batch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = selectedBatch === 'all' || section.batch_id === selectedBatch;
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = section.is_active;
    else if (statusFilter === 'inactive') matchesStatus = !section.is_active;
    else if (statusFilter === 'full') matchesStatus = section.current_students >= section.max_students;
    else if (statusFilter === 'available') matchesStatus = section.current_students < section.max_students;

    return matchesSearch && matchesBatch && matchesStatus;
  });

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/sections');
      const data = result.success ? result.data : result;
      setSections(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Sections fetch error:', err);
      setError('Failed to load sections');
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const result = await apiGet('/.netlify/functions/api/admin/batches');
      const data = result.success ? result.data : result;
      setBatches(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Batches fetch error:', err);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchBatches();
  }, []);

  const openCreateDialog = () => {
    setEditingSection(null);
    setFormData({
      name: '',
      description: '',
      batch_id: '',
      max_students: 30,
      room_number: '',
      class_timing: '',
      is_active: true
    });
    setShowSectionDialog(true);
  };

  const openEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      description: section.description,
      batch_id: section.batch_id,
      max_students: section.max_students,
      room_number: section.room_number,
      class_timing: section.class_timing,
      is_active: section.is_active
    });
    setShowSectionDialog(true);
  };

  const handleSaveSection = async () => {
    if (!formData.name || !formData.batch_id) {
      toast({
        title: "Validation Error",
        description: "Section name and batch are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const url = editingSection 
        ? `/.netlify/functions/api/admin/sections/${editingSection.id}`
        : '/.netlify/functions/api/admin/sections';
      
      const method = editingSection ? 'PUT' : 'POST';
      
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
        throw new Error(errorData.error || `Failed to ${editingSection ? 'update' : 'create'} section`);
      }

      toast({
        title: "Success!",
        description: `Section ${editingSection ? 'updated' : 'created'} successfully`
      });

      setShowSectionDialog(false);
      fetchSections();
    } catch (error: any) {
      console.error('Save section error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingSection ? 'update' : 'create'} section`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      setActionLoading(`delete-${sectionId}`);
      
      const response = await fetch(`/.netlify/functions/api/admin/sections/${sectionId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete section');
      }

      toast({
        title: "Success!",
        description: "Section deleted successfully"
      });

      fetchSections();
    } catch (error: any) {
      console.error('Delete section error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete section',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
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
              <FolderOpen className="h-6 w-6 animate-pulse" style={{ color: COLORS.primary[600] }} />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.neutral[900] }}>Loading Sections</h3>
          <p style={{ color: COLORS.neutral[600] }}>Fetching class sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: COLORS.neutral[50] }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Sections Management</h1>
          <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Manage class sections and student assignments</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
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
            Create Section
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
            <div>
              <h3 className="font-semibold mb-1" style={{ color: COLORS.error[800] }}>Connection Issue</h3>
              <p style={{ color: COLORS.error[600] }}>{error}</p>
            </div>
            <Button
              onClick={fetchSections}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="shadow-sm border-0 transition-shadow duration-200 hover:shadow-md"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm" style={{ color: COLORS.primary[600] }}>Total Sections</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>{sections.length}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary[100] }}
              >
                <FolderOpen className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
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
                <p className="font-medium text-sm" style={{ color: COLORS.success[600] }}>Active Sections</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {sections.filter(s => s.is_active).length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.success[100] }}
              >
                <UserCheck className="h-6 w-6" style={{ color: COLORS.success[600] }} />
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
                <p className="font-medium text-sm" style={{ color: COLORS.warning[600] }}>Total Students</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {sections.reduce((sum, section) => sum + section.current_students, 0)}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.warning[100] }}
              >
                <Users className="h-6 w-6" style={{ color: COLORS.warning[600] }} />
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
                <p className="font-medium text-sm" style={{ color: COLORS.accent[600] }}>Avg. Capacity</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {sections.length > 0 
                    ? Math.round(sections.reduce((sum, s) => sum + (s.current_students / s.max_students * 100), 0) / sections.length)
                    : 0}%
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.accent[100] }}
              >
                <Target className="h-6 w-6" style={{ color: COLORS.accent[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card 
        className="shadow-sm border-0"
        style={{ backgroundColor: 'white' }}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: COLORS.neutral[400] }} />
                <Input
                  placeholder="Search sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border transition-colors duration-200"
                  style={{ borderColor: COLORS.neutral[200] }}
                />
              </div>
            </div>
            <div>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger style={{ borderColor: COLORS.neutral[200] }}>
                  <SelectValue placeholder="All Batches" />
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
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger style={{ borderColor: COLORS.neutral[200] }}>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                  <SelectItem value="full">Full Capacity</SelectItem>
                  <SelectItem value="available">Available Seats</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2" style={{ color: COLORS.neutral[600] }}>
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">
                {filteredSections.length} of {sections.length} sections
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections List */}
      {filteredSections.length === 0 ? (
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.neutral[300] }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>No Sections Found</h3>
            <p className="mb-6" style={{ color: COLORS.neutral[600] }}>
              {searchTerm || selectedBatch !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first section'
              }
            </p>
            {!searchTerm && selectedBatch === 'all' && statusFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
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
                Create First Section
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSections.map((section) => (
            <Card 
              key={section.id} 
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
                      <FolderOpen className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: COLORS.neutral[900] }}>
                        {section.name}
                      </h3>
                      <p className="text-sm" style={{ color: COLORS.neutral[600] }}>
                        {section.batch_name} • {section.current_students}/{section.max_students} students
                      </p>
                      {section.room_number && (
                        <p className="text-xs mt-1" style={{ color: COLORS.neutral[500] }}>
                          Room {section.room_number} {section.class_timing && `• ${section.class_timing}`}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      className="border"
                      style={section.is_active ? { 
                        backgroundColor: COLORS.success[100], 
                        color: COLORS.success[700],
                        borderColor: COLORS.success[200]
                      } : { 
                        backgroundColor: COLORS.neutral[100], 
                        color: COLORS.neutral[600],
                        borderColor: COLORS.neutral[200]
                      }}
                    >
                      {section.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    
                    {(['admin', 'editor'].includes(user?.role || '')) && (
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(section)}
                          className="transition-colors duration-200"
                          style={{ 
                            color: COLORS.primary[600],
                            borderColor: COLORS.primary[200]
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="transition-colors duration-200"
                              style={{ 
                                color: COLORS.error[600],
                                borderColor: COLORS.error[200]
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Section</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{section.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSection(section.id)}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? 'Edit Section' : 'Create New Section'}
            </DialogTitle>
            <DialogDescription>
              {editingSection ? 'Update section information and settings' : 'Create a new class section within a batch'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Section Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Section A, Morning Batch"
              />
            </div>

            <div>
              <Label htmlFor="batch">Batch</Label>
              <Select value={formData.batch_id} onValueChange={(value) => setFormData({ ...formData, batch_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room">Room Number</Label>
                <Input
                  id="room"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  placeholder="e.g., 101, Lab-A"
                />
              </div>
              <div>
                <Label htmlFor="max_students">Max Students</Label>
                <Input
                  id="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 30 })}
                  min="1"
                  max="200"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="timing">Class Timing</Label>
              <Input
                id="timing"
                value={formData.class_timing}
                onChange={(e) => setFormData({ ...formData, class_timing: e.target.value })}
                placeholder="e.g., 9:00 AM - 12:00 PM"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description of the section"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_active">Active section</Label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSectionDialog(false)}
              disabled={actionLoading === 'save'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSection}
              disabled={actionLoading === 'save'}
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              {actionLoading === 'save' ? 'Saving...' : editingSection ? 'Update Section' : 'Create Section'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}