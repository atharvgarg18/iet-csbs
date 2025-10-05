import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image, Star, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useToast } from '../../hooks/use-toast';
import { GalleryImage, GalleryCategory } from '@shared/api';

const GalleryImagesManagement: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category_id: '',
    photographer: '',
    event_date: '',
    is_featured: false
  });

  useEffect(() => {
    Promise.all([fetchImages(), fetchCategories()]);
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/.netlify/functions/api/admin/gallery-images');
      const data = await response.json();

      if (data.success) {
        setImages(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch images');
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch gallery images"
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/.netlify/functions/api/admin/gallery-categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data.filter((cat: GalleryCategory) => cat.is_active));
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      category_id: '',
      photographer: '',
      event_date: '',
      is_featured: false
    });
  };

  const handleCreateImage = async () => {
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a title"
      });
      return;
    }

    if (!formData.image_url.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error", 
        description: "Please enter an image URL"
      });
      return;
    }

    if (!formData.category_id) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a category"
      });
      return;
    }

    try {
      // Clean the form data - convert empty strings to null for optional fields
      const cleanFormData = {
        ...formData,
        photographer: formData.photographer.trim() || null,
        event_date: formData.event_date.trim() || null
      };
      
      console.log('Creating image with data:', cleanFormData);
      console.log('JSON body:', JSON.stringify(cleanFormData));
      
      const response = await fetch('/.netlify/functions/api/admin/gallery-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanFormData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
        setImages(prev => [data.data, ...prev]);
        setIsCreateOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Gallery image created successfully"
        });
      } else {
        console.error('Server error details:', data);
        throw new Error(data.message || data.error || 'Failed to create image');
      }
    } catch (err) {
      console.error('Error creating image:', err);
      
      // Show more detailed error message
      let errorMessage = "Failed to create image";
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // If it's a network error, show more details
        if (err.message.includes('fetch')) {
          errorMessage = "Network error. Please check your connection and try again.";
        }
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
    }
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      image_url: image.image_url,
      category_id: image.category_id,
      photographer: image.photographer || '',
      event_date: image.event_date || '',
      is_featured: image.is_featured
    });
    setIsEditOpen(true);
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    if (!formData.title.trim() || !formData.image_url.trim() || !formData.category_id) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      // Clean the form data - convert empty strings to null for optional fields
      const cleanFormData = {
        ...formData,
        photographer: formData.photographer.trim() || null,
        event_date: formData.event_date.trim() || null
      };
      
      const response = await fetch(`/.netlify/functions/api/admin/gallery-images/${editingImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanFormData),
      });

      const data = await response.json();

      if (data.success) {
        setImages(prev => prev.map(img => img.id === editingImage.id ? data.data : img));
        setIsEditOpen(false);
        setEditingImage(null);
        resetForm();
        toast({
          title: "Success",
          description: "Gallery image updated successfully"
        });
      } else {
        throw new Error(data.message || 'Failed to update image');
      }
    } catch (err) {
      console.error('Error updating image:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update image"
      });
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/.netlify/functions/api/admin/gallery-images/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setImages(prev => prev.filter(img => img.id !== id));
        toast({
          title: "Success",
          description: "Gallery image deleted successfully"
        });
      } else {
        throw new Error(data.message || 'Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete image"
      });
    }
  };

  const toggleImageStatus = async (image: GalleryImage) => {
    try {
      const response = await fetch(`/.netlify/functions/api/admin/gallery-images/${image.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !image.is_active }),
      });

      const data = await response.json();

      if (data.success) {
        setImages(prev => prev.map(img => img.id === image.id ? data.data : img));
        toast({
          title: "Success",
          description: `Image ${data.data.is_active ? 'activated' : 'deactivated'} successfully`
        });
      } else {
        throw new Error(data.message || 'Failed to update image status');
      }
    } catch (err) {
      console.error('Error updating image status:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update image status"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (categories.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No active gallery categories found. Please create categories first before adding images.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Images</h1>
          <p className="text-gray-600">Manage gallery images with category assignment</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Gallery Image</DialogTitle>
              <DialogDescription>
                Add a new image to the gallery with category assignment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 ? (
                      <SelectItem value="" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {categories.length === 0 && (
                  <p className="text-sm text-destructive">
                    No categories available. Please create a category first.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="photographer">Photographer</Label>
                <Input
                  id="photographer"
                  value={formData.photographer}
                  onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                  placeholder="Photographer name (optional)"
                />
              </div>
              <div>
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured">Featured Image</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateImage}>Create Image</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className={`${!image.is_active ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="aspect-video relative overflow-hidden rounded-md bg-gray-100">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                {image.is_featured && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">{image.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: image.category?.color,
                      color: image.category?.color 
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: image.category?.color }}
                    />
                    {image.category?.name || 'Unknown Category'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleImageStatus(image)}
                    className="h-8 w-8 p-0"
                  >
                    {image.is_active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                
                {image.photographer && (
                  <p className="text-sm text-gray-600">
                    📸 {image.photographer}
                  </p>
                )}
                
                {image.event_date && (
                  <p className="text-sm text-gray-600">
                    📅 {new Date(image.event_date).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditImage(image)}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteImage(image.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Image className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
            <p className="text-gray-600 text-center mb-4">
              Start by adding your first gallery image
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Image
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Gallery Image</DialogTitle>
            <DialogDescription>
              Update image details and category assignment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter image title"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
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
              <Label htmlFor="edit-image_url">Image URL *</Label>
              <Input
                id="edit-image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="edit-photographer">Photographer</Label>
              <Input
                id="edit-photographer"
                value={formData.photographer}
                onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                placeholder="Photographer name (optional)"
              />
            </div>
            <div>
              <Label htmlFor="edit-event_date">Event Date</Label>
              <Input
                id="edit-event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="edit-is_featured">Featured Image</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateImage}>Update Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryImagesManagement;
