import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryImage {
  id: string;
  category_id: string;
  title: string;
  image_url: string;
  photographer?: string;
  event_date?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

interface GalleryCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  is_active: boolean;
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
    image_url: '',
    photographer: '',
    event_date: '',
    is_featured: false,
    is_active: true
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter images based on selected category
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(image => image.category_id === selectedCategory);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const [imagesResult, categoriesResult] = await Promise.all([
        apiGet('/.netlify/functions/api/admin/gallery-images'),
        apiGet('/.netlify/functions/api/admin/gallery-categories')
      ]);

      const imagesData = imagesResult.success ? imagesResult.data : imagesResult;
      const categoriesData = categoriesResult.success ? categoriesResult.data : categoriesResult;

      setImages(Array.isArray(imagesData) ? imagesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Images fetch error:', err);
      setError('Failed to load images');
      setImages([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openCreateDialog = () => {
    setEditingImage(null);
    setFormData({
      category_id: '',
      title: '',
      image_url: '',
      photographer: '',
      event_date: '',
      is_featured: false,
      is_active: true
    });
    setShowImageDialog(true);
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      category_id: image.category_id,
      title: image.title,
      image_url: image.image_url,
      photographer: image.photographer || '',
      event_date: image.event_date ? image.event_date.split('T')[0] : '',
      is_featured: image.is_featured,
      is_active: image.is_active
    });
    setShowImageDialog(true);
  };

  const handleSaveImage = async () => {
    try {
      if (!formData.category_id || !formData.title || !formData.image_url) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      setActionLoading('save');

      const payload = {
        ...formData,
        event_date: formData.event_date || null
      };

      if (editingImage) {
        await apiPut(`/.netlify/functions/api/admin/gallery-images/${editingImage.id}`, payload);
      } else {
        await apiPost('/.netlify/functions/api/admin/gallery-images', payload);
      }

      toast({
        title: "Success!",
        description: `Image ${editingImage ? 'updated' : 'added'} successfully`
      });

      setShowImageDialog(false);
      fetchImages();
    } catch (error) {
      console.error('Save image error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingImage ? 'update' : 'add'} image`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      setActionLoading(`delete-${imageId}`);
      
      await apiDelete(`/.netlify/functions/api/admin/gallery-images/${imageId}`);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading gallery images...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gallery Images</h1>
              <p className="text-gray-600">Manage gallery images using URLs</p>
            </div>
          </div>
          <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Filter by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {error ? (
            <Card className="border-red-200 bg-red-50 col-span-full">
              <CardContent className="p-6">
                <div className="text-center text-red-700">{error}</div>
              </CardContent>
            </Card>
          ) : filteredImages.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12">
                <div className="text-center text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No images found</p>
                  <p>Add images to the gallery using image URLs</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {image.is_featured && (
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                    <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                      image.is_active 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {image.is_active ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Hidden
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{image.title}</h3>
                    
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: image.category?.color || '#6b7280' }}
                      />
                      <span className="text-sm text-gray-600">{image.category?.name}</span>
                    </div>

                    {image.photographer && (
                      <p className="text-sm text-gray-500">By {image.photographer}</p>
                    )}

                    {image.event_date && (
                      <p className="text-sm text-gray-500">
                        {new Date(image.event_date).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(image.image_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(image)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actionLoading === `delete-${image.id}`}
                            >
                              {actionLoading === `delete-${image.id}` ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Image</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete <strong>{image.title}</strong>? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteImage(image.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Image
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Image Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Image' : 'Add Image'}
              </DialogTitle>
              <DialogDescription>
                Add an image to the gallery using its URL
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="category_id">Category *</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData({...formData, category_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Image title"
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="photographer">Photographer</Label>
                <Input
                  id="photographer"
                  value={formData.photographer}
                  onChange={(e) => setFormData({...formData, photographer: e.target.value})}
                  placeholder="Photographer name"
                />
              </div>

              <div>
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <Label htmlFor="is_featured">Featured Image</Label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">Active (Visible on site)</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowImageDialog(false)}
                disabled={actionLoading === 'save'}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveImage}
                disabled={actionLoading === 'save'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {actionLoading === 'save' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingImage ? 'Update Image' : 'Add Image'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}