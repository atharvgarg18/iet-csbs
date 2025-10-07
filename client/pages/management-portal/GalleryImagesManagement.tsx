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
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  Tag,
  Activity,
  TrendingUp,
  Eye,
  Upload,
  Filter,
  Download,
  ExternalLink,
  ImageIcon,
  Folder,
  Grid3X3,
  List,
  Heart,
  Share2,
  Archive,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  category_id: string;
  category_name: string;
  category_color: string;
  image_url: string;
  title: string;
  description: string;
  alt_text: string;
  file_size: number;
  width: number;
  height: number;
  mime_type: string;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  upload_date: string;
  uploaded_by: string;
  uploader_name: string;
}

interface GalleryCategory {
  id: string;
  name: string;
  color: string;
  image_count: number;
}

export default function GalleryImagesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    alt_text: '',
    is_featured: false,
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('upload_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const filteredImages = images.filter(image => {
    const matchesSearch = !searchTerm || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.category_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || image.category_id === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = image.is_active;
    else if (statusFilter === 'inactive') matchesStatus = !image.is_active;

    let matchesFeatured = true;
    if (featuredFilter === 'featured') matchesFeatured = image.is_featured;
    else if (featuredFilter === 'not-featured') matchesFeatured = !image.is_featured;

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  }).sort((a, b) => {
    const aValue = a[sortBy as keyof GalleryImage];
    const bValue = b[sortBy as keyof GalleryImage];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [imagesResponse, categoriesResponse] = await Promise.all([
        fetch('/api/admin/gallery-images', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('/api/admin/gallery-categories', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      if (!imagesResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const imagesResult = await imagesResponse.json();
      const categoriesResult = await categoriesResponse.json();
      
      const imagesData = imagesResult.success ? imagesResult.data : imagesResult;
      const categoriesData = categoriesResult.success ? categoriesResult.data : categoriesResult;
      
      setImages(Array.isArray(imagesData) ? imagesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load gallery images');
      setImages([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const openCreateDialog = () => {
    setEditingImage(null);
    setFormData({
      category_id: '',
      title: '',
      description: '',
      alt_text: '',
      is_featured: false,
      is_active: true
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowImageDialog(true);
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      category_id: image.category_id,
      title: image.title,
      description: image.description,
      alt_text: image.alt_text,
      is_featured: image.is_featured,
      is_active: image.is_active
    });
    setSelectedFile(null);
    setPreviewUrl(image.image_url);
    setShowImageDialog(true);
  };

  const handleSaveImage = async () => {
    if (!formData.title || !formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Title and category are required",
        variant: "destructive"
      });
      return;
    }

    if (!editingImage && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const submitData = new FormData();
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }
      submitData.append('category_id', formData.category_id);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('alt_text', formData.alt_text);
      submitData.append('is_featured', formData.is_featured.toString());
      submitData.append('is_active', formData.is_active.toString());

      const url = editingImage 
        ? `/api/admin/gallery-images/${editingImage.id}`
        : '/api/admin/gallery-images';
      
      const method = editingImage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: submitData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingImage ? 'update' : 'upload'} image`);
      }

      toast({
        title: "Success!",
        description: `Image ${editingImage ? 'updated' : 'uploaded'} successfully`
      });

      setShowImageDialog(false);
      fetchImages();
    } catch (error) {
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
      
      const response = await fetch(`/api/admin/gallery-images/${imageId}`, {
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
    } catch (error) {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Gallery</h3>
          <p className="text-slate-500">Fetching gallery images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gallery Images</h1>
          <p className="text-slate-500 mt-1">Manage and organize gallery images</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
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
              onClick={fetchImages}
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
                <p className="text-blue-600 font-medium text-sm">Total Images</p>
                <p className="text-2xl font-black text-blue-900">{images.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 font-medium text-sm">Active Images</p>
                <p className="text-2xl font-black text-emerald-900">
                  {images.filter(img => img.is_active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">Featured Images</p>
                <p className="text-2xl font-black text-purple-900">
                  {images.filter(img => img.is_featured).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium text-sm">Total Views</p>
                <p className="text-2xl font-black text-orange-900">
                  {images.reduce((sum, img) => sum + img.view_count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Bar */}
      <Card className="shadow-xl border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 h-12 border-0 bg-slate-50">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-12 border-0 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger className="w-36 h-12 border-0 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="not-featured">Regular</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-l-xl rounded-r-none ${viewMode === 'grid' ? 'bg-blue-600 text-white' : ''}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-r-xl rounded-l-none ${viewMode === 'list' ? 'bg-blue-600 text-white' : ''}`}
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
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Images Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || featuredFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by uploading your first image'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && featuredFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload First Image
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                {/* Image Preview */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {image.is_featured && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {!image.is_active && (
                      <Badge className="bg-gradient-to-r from-slate-500 to-gray-500 text-white border-0 shadow-lg">
                        Inactive
                      </Badge>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge 
                      className="text-white border-0 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${image.category_color}, ${image.category_color}dd)` }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {image.category_name}
                    </Badge>
                  </div>

                  {/* View Count */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm">
                      <Eye className="h-3 w-3 mr-1" />
                      {image.view_count}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight mb-2">{image.title}</h3>
                  
                  {image.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">{image.description}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{image.uploader_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(image.upload_date)}</span>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4 p-2 bg-slate-50 rounded-lg">
                    <span>{image.width} × {image.height}</span>
                    <span>{formatFileSize(image.file_size)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => window.open(image.image_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    
                    {(['admin', 'editor'].includes(user?.role || '')) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(image)}
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
                                Delete Image
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Are you sure you want to delete <strong>{image.title}</strong>? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteImage(image.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${image.id}`}
                              >
                                {actionLoading === `delete-${image.id}` ? (
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List View
        <Card className="shadow-xl border-0">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredImages.map((image) => (
                <div key={image.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || image.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 truncate">{image.title}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2 mt-1">{image.description}</p>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <Badge 
                              className="text-white border-0"
                              style={{ background: `linear-gradient(135deg, ${image.category_color}, ${image.category_color}dd)` }}
                            >
                              {image.category_name}
                            </Badge>
                            
                            {image.is_featured && (
                              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                                Featured
                              </Badge>
                            )}
                            
                            {!image.is_active && (
                              <Badge className="bg-slate-500 text-white border-0">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="text-right text-sm text-slate-500 ml-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Eye className="h-4 w-4" />
                            <span>{image.view_count} views</span>
                          </div>
                          <div>{image.width} × {image.height}</div>
                          <div>{formatFileSize(image.file_size)}</div>
                          <div className="text-xs text-slate-400 mt-1">{formatDate(image.upload_date)}</div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(image.image_url, '_blank')}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          
                          {(['admin', 'editor'].includes(user?.role || '')) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(image)}
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
                                      Delete Image
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-base">
                                      Are you sure you want to delete <strong>{image.title}</strong>? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteImage(image.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={actionLoading === `delete-${image.id}`}
                                    >
                                      {actionLoading === `delete-${image.id}` ? (
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload/Edit Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-blue-600" />
              {editingImage ? 'Edit Image' : 'Upload New Image'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingImage ? 'Update image information and settings' : 'Upload a new image to the gallery'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* File Upload (only for new images) */}
            {!editingImage && (
              <div>
                <Label className="text-sm font-semibold text-slate-700">Image File *</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-600">Click to select image</span>
                        <span className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* Preview for editing */}
            {editingImage && previewUrl && (
              <div>
                <Label className="text-sm font-semibold text-slate-700">Current Image</Label>
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt={formData.title}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
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
                <Label className="text-sm font-semibold text-slate-700">Category *</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          ></div>
                          {category.name}
                        </div>
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
                placeholder="Enter image description (optional)"
                className="mt-2 border-0 bg-slate-50 focus:bg-white transition-colors"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="alt_text" className="text-sm font-semibold text-slate-700">Alt Text</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Enter alt text for accessibility"
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="is_featured" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Featured Image
                </Label>
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
                  Active
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowImageDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveImage}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {editingImage ? 'Update' : 'Upload'} Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}