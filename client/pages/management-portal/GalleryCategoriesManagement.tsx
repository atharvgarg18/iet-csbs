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
  Folder, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ImageIcon,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  Tag,
  Activity,
  TrendingUp,
  Eye,
  Settings,
  Layers,
  Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  is_active: boolean;
  image_count: number;
  created_at: string;
  created_by: string;
  creator_name: string;
}

export default function GalleryCategoriesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    icon: 'ImageIcon',
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchTerm || 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = category.is_active;
    else if (statusFilter === 'inactive') matchesStatus = !category.is_active;

    return matchesSearch && matchesStatus;
  });

  const availableIcons = [
    { name: 'ImageIcon', label: 'Image', icon: ImageIcon },
    { name: 'Camera', label: 'Camera', icon: Activity },
    { name: 'Folder', label: 'Folder', icon: Folder },
    { name: 'Tag', label: 'Tag', icon: Tag },
    { name: 'Layers', label: 'Layers', icon: Layers },
    { name: 'Eye', label: 'Eye', icon: Eye },
    { name: 'Settings', label: 'Settings', icon: Settings },
    { name: 'TrendingUp', label: 'Trending', icon: TrendingUp }
  ];

  const availableColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
    '#f97316', '#eab308', '#22c55e', '#10b981', 
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6'
  ];

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/api/admin/gallery-categories', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data = result.success ? result.data : result;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
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
      color: '#6366f1',
      icon: 'ImageIcon',
      is_active: true
    });
    setShowCategoryDialog(true);
  };

  const openEditDialog = (category: GalleryCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
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
    } catch (error) {
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

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    return iconData ? iconData.icon : ImageIcon;
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Folder className="h-6 w-6 text-purple-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Categories</h3>
          <p className="text-slate-500">Fetching gallery categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gallery Categories</h1>
          <p className="text-slate-500 mt-1">Organize and manage gallery image categories</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Category
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
              onClick={fetchCategories}
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">Total Categories</p>
                <p className="text-2xl font-black text-purple-900">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Folder className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 font-medium text-sm">Active Categories</p>
                <p className="text-2xl font-black text-emerald-900">
                  {categories.filter(c => c.is_active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">Total Images</p>
                <p className="text-2xl font-black text-blue-900">
                  {categories.reduce((sum, cat) => sum + cat.image_count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium text-sm">Avg. per Category</p>
                <p className="text-2xl font-black text-orange-900">
                  {categories.length > 0 
                    ? Math.round(categories.reduce((sum, cat) => sum + cat.image_count, 0) / categories.length)
                    : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                  className={statusFilter === 'inactive' ? 'bg-slate-600 hover:bg-slate-700' : ''}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <Folder className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Categories Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first category'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create First Category
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <Card key={category.id} className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-2" style={{ background: `linear-gradient(to right, ${category.color}, ${category.color}dd)` }}></div>
                  <div className="p-6">
                    {/* Category Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)` }}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight">{category.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700 border-0 shadow-sm text-xs">
                              <Hash className="h-3 w-3 mr-1" />
                              {category.image_count} images
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {!category.is_active && (
                        <Badge className="bg-gradient-to-br from-slate-100 to-gray-100 text-slate-600 border-slate-200 shadow-sm">
                          Inactive
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    {category.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">{category.description}</p>
                    )}

                    {/* Usage Stats */}
                    <div className="mb-4 p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Usage</span>
                        <span className="text-sm font-bold text-slate-900">{category.image_count} images</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            background: `linear-gradient(to right, ${category.color}, ${category.color}dd)`,
                            width: `${Math.min((category.image_count / Math.max(...categories.map(c => c.image_count))) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Created Info */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{category.creator_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(category.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 hover:bg-purple-50 hover:text-purple-600"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Images
                      </Button>
                      
                      {(['admin', 'editor'].includes(user?.role || '')) && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(category)}
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
                                  Delete Category
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-base">
                                  Are you sure you want to delete <strong>{category.name}</strong>? This will affect {category.image_count} images in this category.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={actionLoading === `delete-${category.id}`}
                                >
                                  {actionLoading === `delete-${category.id}` ? (
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Delete Category
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
            );
          })}
        </div>
      )}

      {/* Create/Edit Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-purple-600" />
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingCategory ? 'Update category information and settings' : 'Create a new gallery category for organizing images'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description (optional)"
                className="mt-2 border-0 bg-slate-50 focus:bg-white transition-colors"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-slate-700">Icon</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {availableIcons.map((iconData) => {
                    const IconComponent = iconData.icon;
                    return (
                      <Button
                        key={iconData.name}
                        variant={formData.icon === iconData.name ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData({ ...formData, icon: iconData.name })}
                        className={`h-12 ${formData.icon === iconData.name ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-slate-700">Color</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {availableColors.map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-12 border-2 ${formData.color === color ? 'border-slate-900' : 'border-slate-200'}`}
                      style={{ backgroundColor: color }}
                    >
                      <span className="sr-only">{color}</span>
                    </Button>
                  ))}
                </div>
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
                <Activity className="h-4 w-4" />
                Active Category (Available for use)
              </Label>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCategoryDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}