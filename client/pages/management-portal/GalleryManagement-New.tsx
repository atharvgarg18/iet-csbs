import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
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
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  Calendar,
  RefreshCw,
  ImageIcon,
  Folder,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Filter,
  Grid,
  List,
  FolderOpen,
  Hash,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COLORS } from './management-design-system';

interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_count?: number;
}

export default function GalleryManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchTerm || 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = category.is_active;
    else if (statusFilter === 'inactive') matchesStatus = !category.is_active;

    return matchesSearch && matchesStatus;
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const mockData: GalleryCategory[] = [
        {
          id: '1',
          name: 'Campus Events',
          description: 'Photos from various campus events and activities',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image_count: 45
        },
        {
          id: '2',
          name: 'Academic Activities',
          description: 'Classroom sessions, workshops, and academic programs',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image_count: 32
        },
        {
          id: '3',
          name: 'Sports & Recreation',
          description: 'Sports events, tournaments, and recreational activities',
          is_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image_count: 18
        }
      ];
      
      setCategories(mockData);
    } catch (err: any) {
      console.error('Categories fetch error:', err);
      setError('Failed to load gallery categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      is_active: true
    });
    setShowDialog(true);
  };

  const openEditDialog = (category: GalleryCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      is_active: category.is_active
    });
    setShowDialog(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      // Mock save operation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success!",
        description: `Category ${editingCategory ? 'updated' : 'created'} successfully`
      });

      setShowDialog(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Save category error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingCategory ? 'update' : 'create'} category`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setActionLoading(`delete-${categoryId}`);
      
      // Mock delete operation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: "Category deleted successfully"
      });

      fetchCategories();
    } catch (error: any) {
      console.error('Delete category error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete category',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              <Image className="h-6 w-6 animate-pulse" style={{ color: COLORS.primary[600] }} />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.neutral[900] }}>Loading Gallery</h3>
          <p style={{ color: COLORS.neutral[600] }}>Fetching gallery categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: COLORS.neutral[50] }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Gallery Categories</h1>
          <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Organize and manage photo gallery categories</p>
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
            Create Category
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
              onClick={fetchCategories}
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
                <p className="font-medium text-sm" style={{ color: COLORS.primary[600] }}>Total Categories</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>{categories.length}</p>
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
                <p className="font-medium text-sm" style={{ color: COLORS.success[600] }}>Active Categories</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {categories.filter(c => c.is_active).length}
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
                <p className="font-medium text-sm" style={{ color: COLORS.warning[600] }}>Total Images</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {categories.reduce((sum, c) => sum + (c.image_count || 0), 0)}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.warning[100] }}
              >
                <ImageIcon className="h-6 w-6" style={{ color: COLORS.warning[600] }} />
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
                <p className="font-medium text-sm" style={{ color: COLORS.accent[600] }}>Avg per Category</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {categories.length > 0 
                    ? Math.round(categories.reduce((sum, c) => sum + (c.image_count || 0), 0) / categories.length)
                    : 0
                  }
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.accent[100] }}
              >
                <TrendingUp className="h-6 w-6" style={{ color: COLORS.accent[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card 
        className="shadow-sm border-0"
        style={{ backgroundColor: 'white' }}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: COLORS.neutral[400] }} />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border transition-colors duration-200"
                  style={{ borderColor: COLORS.neutral[200] }}
                />
              </div>
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
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2" style={{ color: COLORS.neutral[600] }}>
                <Filter className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {filteredCategories.length} of {categories.length}
                </span>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: COLORS.neutral[100] }}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Display */}
      {filteredCategories.length === 0 ? (
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-12 text-center">
            <Image className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.neutral[300] }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>No Categories Found</h3>
            <p className="mb-6" style={{ color: COLORS.neutral[600] }}>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first gallery category'
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
                Create First Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id} 
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
                      <Folder className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: COLORS.neutral[900] }}>
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          className="text-xs border"
                          style={category.is_active ? { 
                            backgroundColor: COLORS.success[100], 
                            color: COLORS.success[700],
                            borderColor: COLORS.success[200]
                          } : { 
                            backgroundColor: COLORS.neutral[100], 
                            color: COLORS.neutral[600],
                            borderColor: COLORS.neutral[200]
                          }}
                        >
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs" style={{ color: COLORS.neutral[500] }}>
                          {category.image_count || 0} images
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => openEditDialog(category)}
                        className="h-8 w-8 p-0 transition-colors duration-200"
                        style={{ color: COLORS.primary[600] }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0 transition-colors duration-200"
                            style={{ color: COLORS.error[600] }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This will also delete all images in this category.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category.id)}
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
                
                {category.description && (
                  <p className="text-sm mb-4" style={{ color: COLORS.neutral[600] }}>
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: COLORS.neutral[100] }}>
                  <div className="text-xs" style={{ color: COLORS.neutral[500] }}>
                    Created {formatDate(category.created_at)}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs transition-colors duration-200"
                    style={{ 
                      color: COLORS.primary[600],
                      borderColor: COLORS.primary[200]
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id} 
              className="shadow-sm border-0 hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: 'white' }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: COLORS.primary[100] }}
                    >
                      <Folder className="h-5 w-5" style={{ color: COLORS.primary[600] }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: COLORS.neutral[900] }}>
                        {category.name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: COLORS.neutral[600] }}>
                        {category.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge 
                          className="text-xs border"
                          style={category.is_active ? { 
                            backgroundColor: COLORS.success[100], 
                            color: COLORS.success[700],
                            borderColor: COLORS.success[200]
                          } : { 
                            backgroundColor: COLORS.neutral[100], 
                            color: COLORS.neutral[600],
                            borderColor: COLORS.neutral[200]
                          }}
                        >
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs" style={{ color: COLORS.neutral[500] }}>
                          {category.image_count || 0} images • Created {formatDate(category.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="transition-colors duration-200"
                      style={{ 
                        color: COLORS.primary[600],
                        borderColor: COLORS.primary[200]
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Images
                    </Button>
                    
                    {user?.role === 'admin' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(category)}
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
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? This will also delete all images in this category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category.id)}
                                style={{ backgroundColor: COLORS.error[600] }}
                              >
                                Delete
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

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Gallery Category' : 'Create New Gallery Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category information and settings' : 'Create a new category to organize gallery images'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Campus Events, Academic Activities"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this gallery category"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_active">Active category</Label>
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
              onClick={handleSaveCategory}
              disabled={actionLoading === 'save'}
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              {actionLoading === 'save' ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}