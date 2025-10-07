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
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  Tag,
  Activity,
  TrendingUp,
  Eye,
  Settings,
  BookOpen,
  Building,
  Users,
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle,
  Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NoticeCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  priority_level: string;
  is_active: boolean;
  notice_count: number;
  created_at: string;
  created_by: string;
  creator_name: string;
}

export default function NoticeCategoriesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NoticeCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    icon: 'Bell',
    priority_level: 'medium',
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchTerm || 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || category.priority_level === priorityFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = category.is_active;
    else if (statusFilter === 'inactive') matchesStatus = !category.is_active;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const availableIcons = [
    { name: 'Bell', label: 'Bell', icon: Bell },
    { name: 'Megaphone', label: 'Megaphone', icon: Megaphone },
    { name: 'AlertTriangle', label: 'Alert', icon: AlertTriangle },
    { name: 'Info', label: 'Info', icon: Info },
    { name: 'CheckCircle', label: 'Check', icon: CheckCircle },
    { name: 'BookOpen', label: 'Academic', icon: BookOpen },
    { name: 'Building', label: 'Administrative', icon: Building },
    { name: 'Users', label: 'Community', icon: Users },
    { name: 'Activity', label: 'Events', icon: Activity },
    { name: 'Calendar', label: 'Schedule', icon: Calendar }
  ];

  const availableColors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', 
    '#f97316', '#eab308', '#22c55e', '#10b981', 
    '#06b6d4', '#6366f1', '#8b5cf6', '#f59e0b'
  ];

  const priorityColors = {
    'high': '#ef4444',
    'medium': '#f97316', 
    'low': '#22c55e'
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/api/notice-categories', {
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
      color: '#3b82f6',
      icon: 'Bell',
      priority_level: 'medium',
      is_active: true
    });
    setShowCategoryDialog(true);
  };

  const openEditDialog = (category: NoticeCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      priority_level: category.priority_level,
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
        ? `/.netlify/functions/api/notice-categories/${editingCategory.id}`
        : '/.netlify/functions/api/notice-categories';
      
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
      
      const response = await fetch(`/.netlify/functions/api/notice-categories/${categoryId}`, {
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
    return iconData ? iconData.icon : Bell;
  };

  const getPriorityBadgeColor = (priority: string) => {
    const colors = {
      'high': 'bg-gradient-to-br from-red-50 to-pink-50 text-red-700 border-red-200',
      'medium': 'bg-gradient-to-br from-orange-50 to-yellow-50 text-orange-700 border-orange-200',
      'low': 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border-green-200'
    };
    return colors[priority] || colors['medium'];
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Categories</h3>
          <p className="text-slate-500">Fetching notice categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Notice Categories</h1>
          <p className="text-slate-500 mt-1">Organize and manage notice categories</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium text-sm">Total Categories</p>
                <p className="text-2xl font-black text-blue-900">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-600" />
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
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium text-sm">Total Notices</p>
                <p className="text-2xl font-black text-orange-900">
                  {categories.reduce((sum, cat) => sum + cat.notice_count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Megaphone className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">High Priority</p>
                <p className="text-2xl font-black text-purple-900">
                  {categories.filter(c => c.priority_level === 'high').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="flex items-center gap-2">
              <Button
                variant={priorityFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter('all')}
                className={priorityFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                All Priority
              </Button>
              <Button
                variant={priorityFilter === 'high' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPriorityFilter('high')}
                className={priorityFilter === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                High
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className={statusFilter === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Active
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Categories Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first category'
              }
            </p>
            {!searchTerm && priorityFilter === 'all' && statusFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
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
              <Card key={category.id} className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
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
                            <Badge className={`${getPriorityBadgeColor(category.priority_level)} border shadow-sm text-xs font-medium`}>
                              {category.priority_level.charAt(0).toUpperCase() + category.priority_level.slice(1)}
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
                        <span className="text-sm font-bold text-slate-900">
                          <Hash className="h-3 w-3 inline mr-1" />
                          {category.notice_count} notices
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            background: `linear-gradient(to right, ${category.color}, ${category.color}dd)`,
                            width: `${Math.min((category.notice_count / Math.max(...categories.map(c => c.notice_count))) * 100, 100)}%` 
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
                        className="flex-1 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Notices
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
                                  Are you sure you want to delete <strong>{category.name}</strong>? This will affect {category.notice_count} notices in this category.
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
              <Sparkles className="h-5 w-5 text-blue-600" />
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingCategory ? 'Update category information and settings' : 'Create a new notice category for organizing announcements'}
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

            <div>
              <Label className="text-sm font-semibold text-slate-700">Priority Level</Label>
              <div className="flex gap-2 mt-2">
                {['low', 'medium', 'high'].map((priority) => (
                  <Button
                    key={priority}
                    variant={formData.priority_level === priority ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, priority_level: priority })}
                    className={`flex-1 ${
                      formData.priority_level === priority 
                        ? priority === 'high' ? 'bg-red-600 hover:bg-red-700' :
                          priority === 'medium' ? 'bg-orange-600 hover:bg-orange-700' :
                          'bg-green-600 hover:bg-green-700'
                        : ''
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-slate-700">Icon</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {availableIcons.slice(0, 10).map((iconData) => {
                    const IconComponent = iconData.icon;
                    return (
                      <Button
                        key={iconData.name}
                        variant={formData.icon === iconData.name ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData({ ...formData, icon: iconData.name })}
                        className={`h-10 ${formData.icon === iconData.name ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
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
                      className={`h-10 border-2 ${formData.color === color ? 'border-slate-900' : 'border-slate-200'}`}
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
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
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