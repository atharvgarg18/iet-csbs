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
  GraduationCap, 
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
  Clock,
  Award,
  Target,
  TrendingUp,
  UserCheck,
  Settings,
  Eye,
  Building,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Batch {
  id: string;
  name: string;
  description: string;
  start_year: string;
  end_year: string;
  department: string;
  course_type: string;
  max_students: number;
  current_students: number;
  is_active: boolean;
  created_at: string;
  created_by: string;
  creator_name: string;
}

export default function BatchesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_year: '',
    end_year: '',
    department: '',
    course_type: '',
    max_students: 50,
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCourseType, setSelectedCourseType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = !searchTerm || 
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || batch.department === selectedDepartment;
    const matchesCourseType = selectedCourseType === 'all' || batch.course_type === selectedCourseType;
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = batch.is_active;
    else if (statusFilter === 'inactive') matchesStatus = !batch.is_active;
    else if (statusFilter === 'full') matchesStatus = batch.current_students >= batch.max_students;
    else if (statusFilter === 'available') matchesStatus = batch.current_students < batch.max_students;

    return matchesSearch && matchesDepartment && matchesCourseType && matchesStatus;
  });

  // Get unique values for filters
  const departments = [...new Set(batches.map(batch => batch.department))].filter(Boolean);
  const courseTypes = [...new Set(batches.map(batch => batch.course_type))].filter(Boolean);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/batches', {
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
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
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
      start_year: '',
      end_year: '',
      department: '',
      course_type: '',
      max_students: 50,
      is_active: true
    });
    setShowBatchDialog(true);
  };

  const openEditDialog = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      description: batch.description,
      start_year: batch.start_year,
      end_year: batch.end_year,
      department: batch.department,
      course_type: batch.course_type,
      max_students: batch.max_students,
      is_active: batch.is_active
    });
    setShowBatchDialog(true);
  };

  const handleSaveBatch = async () => {
    if (!formData.name || !formData.start_year || !formData.end_year || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Name, start year, end year, and department are required",
        variant: "destructive"
      });
      return;
    }

    if (parseInt(formData.end_year) <= parseInt(formData.start_year)) {
      toast({
        title: "Validation Error",
        description: "End year must be greater than start year",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const url = editingBatch 
        ? `/api/admin/batches/${editingBatch.id}`
        : '/api/admin/batches';
      
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

      setShowBatchDialog(false);
      fetchBatches();
    } catch (error) {
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
      
      const response = await fetch(`/api/admin/batches/${batchId}`, {
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
    } catch (error) {
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

  const getDepartmentBadgeColor = (department: string) => {
    const colors = {
      'Computer Science': 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700',
      'Electronics': 'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700',
      'Mechanical': 'bg-gradient-to-br from-orange-50 to-red-50 text-orange-700',
      'Civil': 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700',
      'Electrical': 'bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-700',
      'Information Technology': 'bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700',
      'Biotechnology': 'bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700',
      'Chemical': 'bg-gradient-to-br from-pink-50 to-rose-50 text-pink-700'
    };
    return colors[department] || 'bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700';
  };

  const getCourseTypeBadgeColor = (courseType: string) => {
    const colors = {
      'B.Tech': 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700',
      'M.Tech': 'bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700',
      'Diploma': 'bg-gradient-to-br from-green-50 to-teal-50 text-green-700',
      'Ph.D': 'bg-gradient-to-br from-red-50 to-orange-50 text-red-700',
      'Certificate': 'bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-700'
    };
    return colors[courseType] || 'bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700';
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-emerald-200/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Batches</h3>
          <p className="text-slate-500">Fetching academic batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Batches Management</h1>
          <p className="text-slate-500 mt-1">Manage academic batches and student enrollment</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Batch
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
              onClick={fetchBatches}
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">Total Batches</p>
                <p className="text-2xl font-black text-blue-900">{batches.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 font-medium text-sm">Active Batches</p>
                <p className="text-2xl font-black text-emerald-900">
                  {batches.filter(b => b.is_active).length}
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
                  {batches.reduce((sum, batch) => sum + batch.current_students, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">Departments</p>
                <p className="text-2xl font-black text-purple-900">{departments.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(department => (
                  <SelectItem key={department} value={department}>{department}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCourseType} onValueChange={setSelectedCourseType}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Course Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Course Types</SelectItem>
                {courseTypes.map(courseType => (
                  <SelectItem key={courseType} value={courseType}>{courseType}</SelectItem>
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
              <GraduationCap className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                {filteredBatches.length} of {batches.length} batches
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batches Grid */}
      {filteredBatches.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Batches Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedDepartment !== 'all' || selectedCourseType !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first batch'
              }
            </p>
            {!searchTerm && selectedDepartment === 'all' && selectedCourseType === 'all' && statusFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create First Batch
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <Card key={batch.id} className="group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <div className="p-6">
                  {/* Batch Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">{batch.name}</h3>
                        <p className="text-sm text-slate-500 font-medium">{batch.start_year} - {batch.end_year}</p>
                      </div>
                    </div>
                    {!batch.is_active && (
                      <Badge className="bg-gradient-to-br from-slate-100 to-gray-100 text-slate-600 border-slate-200 shadow-sm">
                        Inactive
                      </Badge>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <Badge className={`${getDepartmentBadgeColor(batch.department)} border-0 shadow-sm font-medium`}>
                      <Building className="h-3 w-3 mr-1" />
                      {batch.department}
                    </Badge>
                    {batch.course_type && (
                      <Badge className={`${getCourseTypeBadgeColor(batch.course_type)} border-0 shadow-sm font-medium`}>
                        <Award className="h-3 w-3 mr-1" />
                        {batch.course_type}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {batch.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3">{batch.description}</p>
                  )}

                  {/* Capacity Info */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Student Capacity</span>
                      <span className={`text-sm font-bold ${getCapacityColor(batch.current_students, batch.max_students)}`}>
                        {batch.current_students} / {batch.max_students}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((batch.current_students / batch.max_students) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{batch.creator_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(batch.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {(['admin', 'editor'].includes(user?.role || '')) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(batch)}
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
                                Delete Batch
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Are you sure you want to delete <strong>{batch.name}</strong>? This action cannot be undone and will affect all associated sections and students.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBatch(batch.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${batch.id}`}
                              >
                                {actionLoading === `delete-${batch.id}` ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Delete Batch
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

      {/* Create/Edit Batch Dialog */}
      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent className="sm:max-w-2xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              {editingBatch ? 'Edit Batch' : 'Create New Batch'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingBatch ? 'Update batch information and settings' : 'Create a new academic batch for student enrollment'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Batch Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter batch name (e.g., CSE 2020-2024)"
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter batch description (optional)"
                className="mt-2 border-0 bg-slate-50 focus:bg-white transition-colors"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_year" className="text-sm font-semibold text-slate-700">Start Year *</Label>
                <Input
                  id="start_year"
                  value={formData.start_year}
                  onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                  placeholder="e.g., 2024"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="end_year" className="text-sm font-semibold text-slate-700">End Year *</Label>
                <Input
                  id="end_year"
                  value={formData.end_year}
                  onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                  placeholder="e.g., 2028"
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department" className="text-sm font-semibold text-slate-700">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Civil">Civil</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                    <SelectItem value="Chemical">Chemical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="course_type" className="text-sm font-semibold text-slate-700">Course Type</Label>
                <Select value={formData.course_type} onValueChange={(value) => setFormData({ ...formData, course_type: value })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                    <SelectValue placeholder="Select course type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B.Tech">B.Tech</SelectItem>
                    <SelectItem value="M.Tech">M.Tech</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Ph.D">Ph.D</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="max_students" className="text-sm font-semibold text-slate-700">Maximum Students</Label>
              <Input
                id="max_students"
                type="number"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 0 })}
                placeholder="Enter maximum student capacity"
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                min="1"
                max="500"
              />
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
                Active Batch (Available for enrollment)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowBatchDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBatch}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {editingBatch ? 'Update' : 'Create'} Batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}