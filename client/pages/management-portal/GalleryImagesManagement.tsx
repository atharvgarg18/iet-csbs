import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Image as ImageIcon,
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  RefreshCw,
  Camera,
  Star,
  Eye,
  EyeOff,
  Search,
  Filter,
  Grid,
  List,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Heart,
  Download,
  ZoomIn,
  Maximize2,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { COLORS } from '@/lib/management-design-system';
import { GalleryImage, GalleryCategory } from '@shared/api';

export default function GalleryImagesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    image_url: '',
    is_featured: false,
    is_published: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredImages = images.filter(image => {
    const matchesSearch = !searchTerm || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.category?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || image.category_id === selectedCategory;
    
    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = image.is_published;
    else if (statusFilter === 'draft') matchesStatus = !image.is_published;
    else if (statusFilter === 'featured') matchesStatus = image.is_featured;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/gallery-images');
      const data = result.success ? result.data : result;
      setImages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Images fetch error:', err);
      setError('Failed to load gallery images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await apiGet('/.netlify/functions/api/admin/gallery-categories');
      const data = result.success ? result.data : result;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Categories fetch error:', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingImage(null);
    setFormData({
      title: '',
      category_id: '',
      image_url: '',
      is_featured: false,
      is_published: true
    });
    setShowDialog(true);
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      category_id: image.category_id,
      image_url: image.image_url,
      is_featured: image.is_featured,
      is_published: image.is_published
    });
    setShowDialog(true);
  };

  const handleSaveImage = async () => {
    if (!formData.title.trim() || !formData.image_url.trim() || !formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Title, image URL, and category are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const url = editingImage 
        ? `/.netlify/functions/api/admin/gallery-images/${editingImage.id}`
        : '/.netlify/functions/api/admin/gallery-images';
      
      const method = editingImage ? 'PUT' : 'POST';
      
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
        throw new Error(errorData.error || `Failed to ${editingImage ? 'update' : 'upload'} image`);
      }
      
      toast({
        title: "Success!",
        description: `Image ${editingImage ? 'updated' : 'uploaded'} successfully`
      });

      setShowDialog(false);
      fetchImages();
    } catch (error: any) {
      console.error('Save image error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingImage ? 'update' : 'upload'} image`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      setActionLoading(`delete-${imageId}`);
      
      const response = await fetch(`/.netlify/functions/api/admin/gallery-images/${imageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete image');
      }

      toast({
        title: "Success!",
        description: "Image deleted successfully"
      });

      fetchImages();
    } catch (error: any) {
      console.error('Delete image error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete image',
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
              <Camera className="h-6 w-6 animate-pulse" style={{ color: COLORS.primary[600] }} />
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.neutral[900] }}>Loading Gallery Images</h3>
          <p style={{ color: COLORS.neutral[600] }}>Fetching image collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: COLORS.neutral[50] }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Gallery Images</h1>
          <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Upload and manage gallery images across different categories</p>
        </div>
        {['admin', 'editor'].includes(user?.role || '') && (
          <Button 
            onClick={openCreateDialog}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            style={{ 
              backgroundColor: COLORS.primary[600], 
              color: 'white',
              border: 'none'
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
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
              onClick={fetchImages}
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
                <p className="font-medium text-sm" style={{ color: COLORS.primary[600] }}>Total Images</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>{images.length}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary[100] }}
              >
                <ImageIcon className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
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
                <p className="font-medium text-sm" style={{ color: COLORS.success[600] }}>Published</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {images.filter(i => i.is_published).length}
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
                <p className="font-medium text-sm" style={{ color: COLORS.warning[600] }}>Featured</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {images.filter(i => i.is_featured).length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.warning[100] }}
              >
                <Star className="h-6 w-6" style={{ color: COLORS.warning[600] }} />
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
                <p className="font-medium text-sm" style={{ color: COLORS.accent[600] }}>Total Views</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {images.reduce((sum, i) => sum + (i.views || 0), 0).toLocaleString()}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.accent[100] }}
              >
                <Eye className="h-6 w-6" style={{ color: COLORS.accent[600] }} />
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: COLORS.neutral[400] }} />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 border transition-colors duration-200"
                  style={{ borderColor: COLORS.neutral[200] }}
                />
              </div>
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger style={{ borderColor: COLORS.neutral[200] }}>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
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
                  <SelectItem value="published">Published Only</SelectItem>
                  <SelectItem value="draft">Drafts Only</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2" style={{ color: COLORS.neutral[600] }}>
                <Filter className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {filteredImages.length} of {images.length}
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

      {/* Images Display */}
      {filteredImages.length === 0 ? (
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-12 text-center">
            <Camera className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.neutral[300] }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>No Images Found</h3>
            <p className="mb-6" style={{ color: COLORS.neutral[600] }}>
              {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by uploading your first image'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && statusFilter === 'all' && 
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
                <Upload className="h-4 w-4 mr-2" />
                Upload First Image
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card 
              key={image.id} 
              className="shadow-sm border-0 hover:shadow-md transition-all duration-200 overflow-hidden"
              style={{ backgroundColor: 'white' }}
            >
              <div className="relative">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {image.is_featured && (
                    <Badge 
                      className="text-xs border"
                      style={{ 
                        backgroundColor: COLORS.warning[100], 
                        color: COLORS.warning[700],
                        borderColor: COLORS.warning[200]
                      }}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge 
                    className="text-xs border"
                    style={image.is_published ? { 
                      backgroundColor: COLORS.success[100], 
                      color: COLORS.success[700],
                      borderColor: COLORS.success[200]
                    } : { 
                      backgroundColor: COLORS.neutral[100], 
                      color: COLORS.neutral[600],
                      borderColor: COLORS.neutral[200]
                    }}
                  >
                    {image.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-1" style={{ color: COLORS.neutral[900] }}>
                  {image.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge 
                    className="text-xs border"
                    style={{ 
                      backgroundColor: COLORS.primary[100], 
                      color: COLORS.primary[700],
                      borderColor: COLORS.primary[200]
                    }}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {image.category?.name}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs mb-3" style={{ color: COLORS.neutral[500] }}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {image.views?.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {image.likes || 0}
                    </div>
                  </div>
                  <span>{formatDate(image.created_at)}</span>
                </div>

                {['admin', 'editor'].includes(user?.role || '') && (
                  <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: COLORS.neutral[100] }}>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openEditDialog(image)}
                      className="flex-1 text-xs transition-colors duration-200"
                      style={{ 
                        color: COLORS.primary[600],
                        borderColor: COLORS.primary[200]
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 text-xs transition-colors duration-200"
                          style={{ 
                            color: COLORS.error[600],
                            borderColor: COLORS.error[200]
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{image.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteImage(image.id)}
                            style={{ backgroundColor: COLORS.error[600] }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredImages.map((image) => (
            <Card 
              key={image.id} 
              className="shadow-sm border-0 hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: 'white' }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1" style={{ color: COLORS.neutral[900] }}>
                      {image.title}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <Badge 
                        className="text-xs border"
                        style={{ 
                          backgroundColor: COLORS.primary[100], 
                          color: COLORS.primary[700],
                          borderColor: COLORS.primary[200]
                        }}
                      >
                        {image.category?.name}
                      </Badge>
                      
                      {image.is_featured && (
                        <Badge 
                          className="text-xs border"
                          style={{ 
                            backgroundColor: COLORS.warning[100], 
                            color: COLORS.warning[700],
                            borderColor: COLORS.warning[200]
                          }}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      
                      <Badge 
                        className="text-xs border"
                        style={image.is_published ? { 
                          backgroundColor: COLORS.success[100], 
                          color: COLORS.success[700],
                          borderColor: COLORS.success[200]
                        } : { 
                          backgroundColor: COLORS.neutral[100], 
                          color: COLORS.neutral[600],
                          borderColor: COLORS.neutral[200]
                        }}
                      >
                        {image.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      
                      <div className="flex items-center gap-3 text-xs" style={{ color: COLORS.neutral[500] }}>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {image.views?.toLocaleString() || 0} views
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {image.likes || 0} likes
                        </div>
                        <span>Created {formatDate(image.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {['admin', 'editor'].includes(user?.role || '') && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(image.image_url, '_blank')}
                        className="transition-colors duration-200"
                        style={{ 
                          color: COLORS.success[600],
                          borderColor: COLORS.success[200]
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditDialog(image)}
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
                            <AlertDialogTitle>Delete Image</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{image.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteImage(image.id)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? 'Edit Gallery Image' : 'Upload New Image'}
            </DialogTitle>
            <DialogDescription>
              {editingImage ? 'Update image information and settings' : 'Add a new image to the gallery'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Image Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter descriptive title for the image"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured image</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>
            </div>

            {formData.image_url && (
              <div className="border rounded-lg p-4" style={{ backgroundColor: COLORS.neutral[50] }}>
                <h4 className="font-medium mb-2" style={{ color: COLORS.neutral[800] }}>Preview</h4>
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
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
              onClick={handleSaveImage}
              disabled={actionLoading === 'save'}
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              {actionLoading === 'save' ? 'Saving...' : editingImage ? 'Update Image' : 'Upload Image'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}