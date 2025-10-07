import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
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
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Users,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  BookOpen,
  GraduationCap,
  UserCheck,
  Settings,
  Eye,
  Building,
  Target,
  Activity,
  MapPin,
  Layers,
  Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      
      const response = await fetch('/.netlify/functions/api/sections', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setSections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Sections fetch error:', err);
      setError('Failed to load sections');
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await fetch('/.netlify/functions/api/batches', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBatches(Array.isArray(data) ? data : []);
      }
    } catch (err) {
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
        ? `/.netlify/functions/api/sections/${editingSection.id}`
        : '/.netlify/functions/api/sections';
      
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
    } catch (error) {
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
      
      const response = await fetch(`/.netlify/functions/api/sections/${sectionId}`, {
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
    } catch (error) {
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

  const getSectionBadgeColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700',
      'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700',
      'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700',
      'bg-gradient-to-br from-orange-50 to-red-50 text-orange-700',
      'bg-gradient-to-br from-pink-50 to-rose-50 text-pink-700',
      'bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700',
      'bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700',
      'bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-700'
    ];
    return colors[index % colors.length];
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBatchInfo = (batchId: string) => {
    return batches.find(batch => batch.id === batchId);
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-indigo-200/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-indigo-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Sections</h3>
          <p className="text-slate-500">Fetching class sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Sections Management</h1>
          <p className="text-slate-500 mt-1">Manage class sections and student assignments</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Section
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
              onClick={fetchSections}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-medium text-sm">Total Sections</p>
                <p className="text-2xl font-black text-indigo-900">{sections.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 font-medium text-sm">Active Sections</p>
                <p className="text-2xl font-black text-emerald-900">
                  {sections.filter(s => s.is_active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium text-sm">Total Students</p>
                <p className="text-2xl font-black text-orange-900">
                  {sections.reduce((sum, section) => sum + section.current_students, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">Avg. Capacity</p>
                <p className="text-2xl font-black text-blue-900">
                  {sections.length > 0 
                    ? Math.round(sections.reduce((sum, s) => sum + (s.current_students / s.max_students * 100), 0) / sections.length)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.filter(batch => batch.is_active).map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
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
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                {filteredSections.length} of {sections.length} sections
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections Grid */}
      {filteredSections.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Sections Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedBatch !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first section'
              }
            </p>
            {!searchTerm && selectedBatch === 'all' && statusFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create First Section
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section, index) => (
            <Card key={section.id} className="group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="p-6">
                  {/* Section Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <FolderOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">{section.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">{section.batch_name}</p>
                      </div>
                    </div>
                    {!section.is_active && (
                      <Badge className="bg-gradient-to-br from-slate-100 to-gray-100 text-slate-600 border-slate-200 shadow-sm">
                        Inactive
                      </Badge>
                    )}
                  </div>

                  {/* Section Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={`${getSectionBadgeColor(index)} border-0 shadow-sm font-medium`}>
                      <Layers className="h-3 w-3 mr-1" />
                      Section {section.name.split(' ').pop() || section.name}
                    </Badge>
                    {getBatchInfo(section.batch_id) && (
                      <Badge className="bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700 border-0 shadow-sm">
                        <Building className="h-3 w-3 mr-1" />
                        {getBatchInfo(section.batch_id)?.department}
                      </Badge>
                    )}
                  </div>

                  {/* Room and Timing Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {section.room_number && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">Room {section.room_number}</span>
                      </div>
                    )}
                    {section.class_timing && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 p-2 bg-slate-50 rounded-lg">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{section.class_timing}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {section.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{section.description}</p>
                  )}

                  {/* Capacity Info */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Student Capacity</span>
                      <span className={`text-sm font-bold ${getCapacityColor(section.current_students, section.max_students)}`}>
                        {section.current_students} / {section.max_students}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((section.current_students / section.max_students) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{section.creator_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(section.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Students
                    </Button>
                    
                    {(['admin', 'editor'].includes(user?.role || '')) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(section)}
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
                                Delete Section
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Are you sure you want to delete <strong>{section.name}</strong>? This action cannot be undone and will affect all assigned students.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSection(section.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${section.id}`}
                              >
                                {actionLoading === `delete-${section.id}` ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Delete Section
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

      {/* Create/Edit Section Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="sm:max-w-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              {editingSection ? 'Edit Section' : 'Create New Section'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingSection ? 'Update section information and settings' : 'Create a new class section within a batch'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Section Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter section name (e.g., Section A)"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="batch" className="text-sm font-semibold text-slate-700">Batch *</Label>
                <Select value={formData.batch_id} onValueChange={(value) => setFormData({ ...formData, batch_id: value })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.filter(batch => batch.is_active).map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name} - {batch.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter section description (optional)"
                className="mt-2 border-0 bg-slate-50 focus:bg-white transition-colors"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="max_students" className="text-sm font-semibold text-slate-700">Max Students</Label>
                <Input
                  id="max_students"
                  type="number"
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 0 })}
                  placeholder="Enter max capacity"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                  min="1"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="room_number" className="text-sm font-semibold text-slate-700">Room Number</Label>
                <Input
                  id="room_number"
                  value={formData.room_number}
                  onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                  placeholder="e.g., 101, A-201"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="class_timing" className="text-sm font-semibold text-slate-700">Class Timing</Label>
                <Input
                  id="class_timing"
                  value={formData.class_timing}
                  onChange={(e) => setFormData({ ...formData, class_timing: e.target.value })}
                  placeholder="e.g., 9:00 AM - 10:00 AM"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-slate-300"
              />
              <Label htmlFor="is_active" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Active Section (Available for student assignment)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSectionDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveSection}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {editingSection ? 'Update' : 'Create'} Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}