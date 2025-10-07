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
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  ImageIcon,
  Play,
  Heart,
  Download,
  ZoomIn,
  Grid3x3,
  List,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  is_featured: boolean;
  created_at: string;
  created_by: string;
  creator_name: string;
}

export default function GalleryManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    is_featured: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesFeatured = featuredFilter === 'all' || 
      (featuredFilter === 'featured' && item.is_featured) ||
      (featuredFilter === 'regular' && !item.is_featured);

    return matchesSearch && matchesCategory && matchesFeatured;
  });

  // Get unique categories
  const categories = [...new Set(galleryItems.map(item => item.category))].filter(Boolean);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/api/gallery', {
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
      setGalleryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gallery fetch error:', err);
      setError('Failed to load gallery items');
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      is_featured: false
    });
    setSelectedFile(null);
    setShowGalleryDialog(true);
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      is_featured: item.is_featured
    });
    setSelectedFile(null);
    setShowGalleryDialog(true);
  };

  const openPreviewDialog = (item: GalleryItem) => {
    setPreviewItem(item);
    setShowPreviewDialog(true);
  };

  const handleSaveItem = async () => {
    if (!formData.title || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Title and category are required",
        variant: "destructive"
      });
      return;
    }

    if (!editingItem && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('category', formData.category);
      formDataToSend.append('is_featured', formData.is_featured.toString());
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const url = editingItem 
        ? `/.netlify/functions/api/gallery/${editingItem.id}`
        : '/.netlify/functions/api/gallery';
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingItem ? 'update' : 'create'} gallery item`);
      }

      toast({
        title: "Success!",
        description: `Gallery item ${editingItem ? 'updated' : 'created'} successfully`
      });

      setShowGalleryDialog(false);
      fetchGalleryItems();
    } catch (error) {
      console.error('Save gallery item error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingItem ? 'update' : 'create'} gallery item`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      setActionLoading(`delete-${itemId}`);
      
      const response = await fetch(`/.netlify/functions/api/gallery/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete gallery item');
      }

      toast({
        title: "Success!",
        description: "Gallery item deleted successfully"
      });

      fetchGalleryItems();
    } catch (error) {
      console.error('Delete gallery item error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete gallery item',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadImage = async (item: GalleryItem) => {
    try {
      setActionLoading(`download-${item.id}`);
      
      const response = await fetch(item.image_url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: "Image downloaded successfully"
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'Events': 'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700',
      'Campus': 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700',
      'Students': 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700',
      'Faculty': 'bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700',
      'Achievements': 'bg-gradient-to-br from-yellow-50 to-orange-50 text-orange-700',
      'Infrastructure': 'bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700',
      'Sports': 'bg-gradient-to-br from-red-50 to-pink-50 text-red-700',
      'Cultural': 'bg-gradient-to-br from-pink-50 to-rose-50 text-pink-700',
      'Academic': 'bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700'
    };
    return colors[category] || 'bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700';
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-purple-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Gallery</h3>
          <p className="text-slate-500">Fetching gallery items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gallery Management</h1>
          <p className="text-slate-500 mt-1">Manage photo gallery and visual content</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          {(['admin', 'editor'].includes(user?.role || '')) && (
            <Button 
              onClick={openCreateDialog}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          )}
        </div>
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
              onClick={fetchGalleryItems}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search gallery..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="regular">Regular Only</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                {filteredItems.length} of {galleryItems.length} items
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid/List */}
      {filteredItems.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Images Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedCategory !== 'all' || featuredFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first image'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && featuredFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First Image
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Featured Badge */}
                  {item.is_featured && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      onClick={() => openPreviewDialog(item)}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadImage(item)}
                      disabled={actionLoading === `download-${item.id}`}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20"
                    >
                      {actionLoading === `download-${item.id}` ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Title and Category */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate mb-1">{item.title}</h3>
                      <Badge className={`${getCategoryBadgeColor(item.category)} border-0 shadow-sm text-xs`}>
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
                  )}

                  {/* Created Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{item.creator_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {(['admin', 'editor'].includes(user?.role || '')) && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                        disabled={actionLoading !== null}
                        className="flex-1 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
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
                              Delete Image
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-base">
                              Are you sure you want to delete <strong>{item.title}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteItem(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={actionLoading === `delete-${item.id}`}
                            >
                              {actionLoading === `delete-${item.id}` ? (
                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Delete Image
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-2xl">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.is_featured && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
                        <Badge className={`${getCategoryBadgeColor(item.category)} border-0 shadow-sm`}>
                          {item.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openPreviewDialog(item)}
                          className="hover:bg-purple-50 hover:text-purple-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadImage(item)}
                          disabled={actionLoading === `download-${item.id}`}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          {actionLoading === `download-${item.id}` ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                        
                        {(['admin', 'editor'].includes(user?.role || '')) && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(item)}
                              disabled={actionLoading !== null}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
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
                                    Delete Image
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-base">
                                    Are you sure you want to delete <strong>{item.title}</strong>? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={actionLoading === `delete-${item.id}`}
                                  >
                                    {actionLoading === `delete-${item.id}` ? (
                                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Delete Image
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-slate-600 mb-3">{item.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{item.creator_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Gallery Dialog */}
      <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-purple-600" />
              {editingItem ? 'Edit Image' : 'Add New Image'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingItem ? 'Update image information' : 'Add a new image to the gallery'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter image title"
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter image description (optional)"
                className="mt-2 border-0 bg-slate-50 focus:bg-white transition-colors"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Campus">Campus</SelectItem>
                    <SelectItem value="Students">Students</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Achievements">Achievements</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl w-full">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-slate-300"
                  />
                  <Label htmlFor="featured" className="text-sm font-medium text-slate-700">
                    Featured Image
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="image" className="text-sm font-semibold text-slate-700">
                Image {!editingItem && '*'}
              </Label>
              <div className="mt-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <input
                  id="image"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept="image/*"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Supported formats: JPG, PNG, GIF, WebP
                </p>
                {selectedFile && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-white rounded-xl">
                    <ImageIcon className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-700">{selectedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowGalleryDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveItem}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {editingItem ? 'Update' : 'Add'} Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-4xl border-0 shadow-2xl p-0 overflow-hidden">
          {previewItem && (
            <>
              <div className="relative">
                <img
                  src={previewItem.image_url}
                  alt={previewItem.title}
                  className="w-full max-h-[70vh] object-contain bg-slate-100"
                />
                {previewItem.is_featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreviewDialog(false)}
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
                >
                  ×
                </Button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{previewItem.title}</h2>
                    <Badge className={`${getCategoryBadgeColor(previewItem.category)} border-0 shadow-sm`}>
                      {previewItem.category}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleDownloadImage(previewItem)}
                    disabled={actionLoading === `download-${previewItem.id}`}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    {actionLoading === `download-${previewItem.id}` ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download
                  </Button>
                </div>
                
                {previewItem.description && (
                  <p className="text-slate-600 mb-4">{previewItem.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Added by {previewItem.creator_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(previewItem.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}