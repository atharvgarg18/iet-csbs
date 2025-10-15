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
  Palette,
  Target,
  BarChart3,
  Folder,
  Hash,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GalleryCategory } from '@shared/api';
import { COLORS } from '@/lib/management-design-system';

export default function GalleryCategoriesManagement() {
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
    color: '#3b82f6',
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const predefinedColors = [
    { value: COLORS.primary[600], label: 'Primary Blue', bg: COLORS.primary[100] },
    { value: COLORS.success[600], label: 'Success Green', bg: COLORS.success[100] },
    { value: COLORS.warning[600], label: 'Warning Orange', bg: COLORS.warning[100] },
    { value: COLORS.error[600], label: 'Error Red', bg: COLORS.error[100] },
    { value: COLORS.accent[600], label: 'Accent Purple', bg: COLORS.accent[100] },
    { value: '#06b6d4', label: 'Cyan', bg: '#cffafe' },
    { value: '#8b5cf6', label: 'Violet', bg: '#ede9fe' },
    { value: '#f59e0b', label: 'Amber', bg: '#fef3c7' },
    { value: '#10b981', label: 'Emerald', bg: '#d1fae5' },
    { value: '#ef4444', label: 'Rose', bg: '#fecaca' }
  ];

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/gallery-categories');
      const data = result.success ? result.data : result;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Categories fetch error:', err);
      setError('Failed to load categories');
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
      color: COLORS.primary[600],
      is_active: true
    });
    setShowDialog(true);
  };

  const openEditDialog = (category: GalleryCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || COLORS.primary[600],
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
      
      const url = editingCategory 
        ? `/.netlify/functions/api/admin/gallery-categories/${editingCategory.id}`
        : '/.netlify/functions/api/admin/gallery-categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
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
        throw new Error(errorData.error || `Failed to ${editingCategory ? 'update' : 'create'} category`);
      }

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
      
      const response = await fetch(`/.netlify/functions/api/admin/gallery-categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete category');
      }

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

  const getCategoryBadgeStyle = (category: GalleryCategory) => {
    const color = category.color || COLORS.primary[600];
    return {
      backgroundColor: `${color}20`,
      color: color,
      borderColor: `${color}40`
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div 
            className="h-8 rounded mb-4"
            style={{ backgroundColor: COLORS.neutral[200] }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="h-32 rounded-lg"
                style={{ backgroundColor: COLORS.neutral[200] }}
              />
            ))}
          </div>
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
          <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Organize gallery images into meaningful categories</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Images className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
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
                <p className="font-medium text-sm" style={{ color: COLORS.accent[600] }}>Color Themes</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {new Set(categories.map(c => c.color)).size}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.accent[100] }}
              >
                <Palette className="h-6 w-6" style={{ color: COLORS.accent[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
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
                  placeholder="Search gallery categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border transition-colors duration-200"
                  style={{ borderColor: COLORS.neutral[200] }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ color: COLORS.neutral[600] }}>
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">
                {filteredCategories.length} of {categories.length} categories
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-12 text-center">
            <Images className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.neutral[300] }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>No Categories Found</h3>
            <p className="mb-6" style={{ color: COLORS.neutral[600] }}>
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Get started by creating your first gallery category'
              }
            </p>
            {!searchTerm && user?.role === 'admin' && (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const badgeStyle = getCategoryBadgeStyle(category);
            return (
              <Card 
                key={category.id} 
                className="shadow-sm border-0 hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: 'white' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: badgeStyle.backgroundColor }}
                      >
                        <Images className="h-5 w-5" style={{ color: badgeStyle.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: COLORS.neutral[900] }}>
                          {category.name}
                        </h3>
                        <Badge 
                          className="text-xs border mt-1"
                          style={badgeStyle}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: badgeStyle.color }}
                          />
                          Color Theme
                        </Badge>
                      </div>
                    </div>
                    
                    {user?.role === 'admin' && (
                      <div className="flex items-center gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openEditDialog(category)}
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
                              <AlertDialogTitle>Delete Gallery Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? This action cannot be undone and may affect existing gallery images.
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
                      Created {new Date(category.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      {category.is_active ? (
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
                placeholder="Optional description of this category"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="color">Category Color</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {predefinedColors.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: colorOption.value })}
                    className={`
                      w-full h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                      ${formData.color === colorOption.value ? 'ring-2 ring-offset-2' : 'hover:scale-105'}
                    `}
                    style={{
                      backgroundColor: colorOption.bg,
                      borderColor: formData.color === colorOption.value ? colorOption.value : 'transparent'
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: colorOption.value }}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-12"
                />
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
              <Label htmlFor="is_active">Active category</Label>
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: COLORS.neutral[50], borderColor: COLORS.neutral[200] }}>
              <h4 className="font-medium mb-2" style={{ color: COLORS.neutral[800] }}>Preview</h4>
              <Badge 
                className="border"
                style={{
                  backgroundColor: `${formData.color}20`,
                  color: formData.color,
                  borderColor: `${formData.color}40`
                }}
              >
                <Images className="h-3 w-3 mr-1" />
                {formData.name || 'Category Name'}
              </Badge>
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