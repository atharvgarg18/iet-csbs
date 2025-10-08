import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
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
  Images, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw,
  Info,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GalleryCategory } from '@shared/api';

export default function GalleryCategoriesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Dialog states
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);

  // Form data - matches GalleryCategory interface
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    is_active: true
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Available colors for categories
  const availableColors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16', // Lime
    '#ec4899', // Pink
    '#6b7280'  // Gray
  ];

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
      
      const result = await apiGet('/.netlify/functions/api/admin/gallery-categories');
      const data = result.success ? result.data : result;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch categories error:', error);
      setError('Failed to load gallery categories');
      toast({
        title: "Error",
        description: "Failed to load gallery categories",
        variant: "destructive"
      });
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
      color: '#3b82f6',
      is_active: true
    });
    setShowCategoryDialog(true);
  };

  const openEditDialog = (category: GalleryCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color,
      is_active: category.is_active
    });
    setShowCategoryDialog(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const payload = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        is_active: formData.is_active
      };

      if (editingCategory) {
        await apiPut(`/.netlify/functions/api/admin/gallery-categories/${editingCategory.id}`, payload);
      } else {
        await apiPost('/.netlify/functions/api/admin/gallery-categories', payload);
      }

      toast({
        title: "Success!",
        description: `Category ${editingCategory ? 'updated' : 'created'} successfully`
      });

      setShowCategoryDialog(false);
      fetchCategories();
    } catch (error) {
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
      
      await apiDelete(`/.netlify/functions/api/admin/gallery-categories/${categoryId}`);
      
      toast({
        title: "Success!",
        description: "Category deleted successfully"
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Delete category error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Images className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gallery Categories</h1>
                  <p className="text-gray-600">Organize gallery images by categories</p>
                </div>
              </div>
              <Button 
                onClick={openCreateDialog}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={fetchCategories}
                disabled={loading}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        {error ? (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Info className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchCategories} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.length === 0 ? (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Images className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your filters' 
                        : 'Get started by creating your first gallery category'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Button onClick={openCreateDialog}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Category
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <Badge variant={category.is_active ? "default" : "secondary"}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${category.id}`}
                              >
                                {actionLoading === `delete-${category.id}` ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    {category.description && (
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update the category details' : 'Fill in the details to create a new category'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-2 block">Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded border-2 ${
                        formData.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Active
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveCategory}
                disabled={actionLoading === 'save'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {actionLoading === 'save' ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}