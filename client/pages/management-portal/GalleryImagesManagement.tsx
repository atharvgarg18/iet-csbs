import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image, Plus, Edit, Trash2, ExternalLink, Loader2, AlertCircle, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryImage {
  id: number;
  category_id: number;
  image_url: string;
  title: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  gallery_categories: {
    id: number;
    name: string;
  };
}

interface GalleryCategory {
  id: number;
  name: string;
}

export default function GalleryImagesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Create/Edit image modal state
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    image_url: '',
    title: '',
    description: ''
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter images based on search and selections
  const filteredImages = images.filter(image => {
    const matchesSearch = !searchTerm || 
      image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.gallery_categories.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      image.gallery_categories.id.toString() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (user && ['admin', 'editor', 'viewer'].includes(user.role)) {
      fetchImages();
      fetchCategories();
    }
  }, [user]);

  const fetchImages = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/api/admin/gallery-images', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch gallery images: ${response.status}`);
      }

      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Fetch gallery images error:', error);
      setError(error.message || 'Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/.netlify/functions/api/admin/gallery-categories', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Fetch categories error:', error);
      toast({
        title: 'Warning',
        description: 'Failed to load categories. Creating images may not work properly.',
        variant: 'destructive'
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSaveImage = async () => {
    if (!formData.category_id || !formData.image_url.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category and image URL are required',
        variant: 'destructive'
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.image_url);
    } catch {
      toast({
        title: 'Validation Error',
        description: 'Please provide a valid image URL',
        variant: 'destructive'
      });
      return;
    }

    setActionLoading('save-image');
    try {
      const url = editingImage 
        ? `/.netlify/functions/api/admin/gallery-images/${editingImage.id}`
        : '/.netlify/functions/api/admin/gallery-images';
      
      const method = editingImage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          category_id: parseInt(formData.category_id),
          image_url: formData.image_url,
          title: formData.title || null,
          description: formData.description || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingImage ? 'update' : 'create'} image`);
      }

      toast({
        title: 'Success',
        description: `Gallery image ${editingImage ? 'updated' : 'created'} successfully`
      });

      setShowImageDialog(false);
      resetForm();
      fetchImages();
    } catch (error) {
      console.error('Save image error:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${editingImage ? 'update' : 'create'} image`,
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    setActionLoading(`delete-image-${imageId}`);
    try {
      const response = await fetch(`/.netlify/functions/api/admin/gallery-images/${imageId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      toast({
        title: 'Success',
        description: 'Gallery image deleted successfully'
      });
      
      fetchImages();
    } catch (error) {
      console.error('Delete image error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete image',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openImageDialog = (image?: GalleryImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        category_id: image.category_id.toString(),
        image_url: image.image_url,
        title: image.title || '',
        description: image.description || ''
      });
    } else {
      setEditingImage(null);
      resetForm();
    }
    setShowImageDialog(true);
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      image_url: '',
      title: '',
      description: ''
    });
    setEditingImage(null);
  };

  // Check if user has edit access
  const canEdit = user && ['admin', 'editor'].includes(user.role);

  if (!user || !['admin', 'editor', 'viewer'].includes(user.role)) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Only administrators, editors, and viewers can access gallery images management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Gallery Images Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Gallery Images Management</h1>
          <Button onClick={fetchImages} variant="outline">
            Retry
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Images Management</h1>
          <p className="text-gray-600 mt-1">
            Manage gallery images and their categories
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => openImageDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid/Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-purple-600" />
            Gallery Images ({filteredImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredImages.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {images.length === 0 ? 'No images found' : 'No images match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {images.length === 0 
                  ? 'Start by adding your first gallery image'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {canEdit && images.length === 0 && (
                <Button onClick={() => openImageDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Image
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImages.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={image.image_url}
                            alt={image.title || 'Gallery image'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ID: {image.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {image.title || 'Untitled'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {image.gallery_categories.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 text-sm">
                        {image.description ? 
                          (image.description.length > 50 ? 
                            image.description.substring(0, 50) + '...' : 
                            image.description
                          ) : 
                          'No description'
                        }
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(image.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={image.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        {canEdit && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openImageDialog(image)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this gallery image? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteImage(image.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={actionLoading === `delete-image-${image.id}`}
                                  >
                                    {actionLoading === `delete-image-${image.id}` && (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    )}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Image Dialog */}
      {canEdit && (
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </DialogTitle>
              <DialogDescription>
                {editingImage 
                  ? 'Update the gallery image information.'
                  : 'Add a new image to the gallery with category and details.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-category">Category *</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categoriesLoading && (
                  <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="image-url">Image URL *</Label>
                <Input
                  id="image-url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Provide a direct URL to the image file
                </p>
              </div>

              <div>
                <Label htmlFor="image-title">Title</Label>
                <Input
                  id="image-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Image title (optional)"
                />
              </div>

              <div>
                <Label htmlFor="image-description">Description</Label>
                <Textarea
                  id="image-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the image (optional)"
                  rows={3}
                />
              </div>

              {/* Image Preview */}
              {formData.image_url && (
                <div>
                  <Label>Preview</Label>
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowImageDialog(false)}
                disabled={actionLoading === 'save-image'}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveImage}
                disabled={actionLoading === 'save-image'}
              >
                {actionLoading === 'save-image' && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingImage ? 'Update' : 'Add'} Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}