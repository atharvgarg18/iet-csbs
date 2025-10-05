import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff, Star, AlertCircle, Calendar } from 'lucide-react';
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
import { Notice, NoticeCategory } from '@shared/api';

const NoticeManagement: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    attachment_url: '',
    is_published: false,
    is_featured: false,
    publish_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    Promise.all([fetchNotices(), fetchCategories()]);
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/.netlify/functions/api/admin/notices');
      const data = await response.json();

      if (data.success) {
        setNotices(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch notices');
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notices');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch notices"
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/.netlify/functions/api/admin/notice-categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data.filter((cat: NoticeCategory) => cat.is_active));
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
      content: '',
      category_id: '',
      attachment_url: '',
      is_published: false,
      is_featured: false,
      publish_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleCreateNotice = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/api/admin/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setNotices(prev => [data.data, ...prev]);
        setIsCreateOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Notice created successfully"
        });
      } else {
        throw new Error(data.message || 'Failed to create notice');
      }
    } catch (err) {
      console.error('Error creating notice:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create notice"
      });
    }
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category_id: notice.category_id,
      attachment_url: notice.attachment_url || '',
      is_published: notice.is_published,
      is_featured: notice.is_featured,
      publish_date: notice.publish_date.split('T')[0]
    });
    setIsEditOpen(true);
  };

  const handleUpdateNotice = async () => {
    if (!editingNotice) return;

    if (!formData.title.trim() || !formData.content.trim() || !formData.category_id) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/notices/${editingNotice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setNotices(prev => prev.map(notice => notice.id === editingNotice.id ? data.data : notice));
        setIsEditOpen(false);
        setEditingNotice(null);
        resetForm();
        toast({
          title: "Success",
          description: "Notice updated successfully"
        });
      } else {
        throw new Error(data.message || 'Failed to update notice');
      }
    } catch (err) {
      console.error('Error updating notice:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update notice"
      });
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/notices/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setNotices(prev => prev.filter(notice => notice.id !== id));
        toast({
          title: "Success",
          description: "Notice deleted successfully"
        });
      } else {
        throw new Error(data.message || 'Failed to delete notice');
      }
    } catch (err) {
      console.error('Error deleting notice:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete notice"
      });
    }
  };

  const toggleNoticeStatus = async (notice: Notice, field: 'is_published' | 'is_featured') => {
    try {
      const response = await fetch(`/api/admin/notices/${notice.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: !notice[field] }),
      });

      const data = await response.json();

      if (data.success) {
        setNotices(prev => prev.map(n => n.id === notice.id ? data.data : n));
        toast({
          title: "Success",
          description: `Notice ${field === 'is_published' ? 'publication' : 'featured'} status updated`
        });
      } else {
        throw new Error(data.message || 'Failed to update notice status');
      }
    } catch (err) {
      console.error('Error updating notice status:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update notice status"
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
          No active notice categories found. Please create categories first before adding notices.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
          <p className="text-gray-600">Create and manage notices and announcements</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
              <DialogDescription>
                Create a new notice or announcement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notice title"
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
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter notice content"
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="attachment_url">Attachment URL (Optional)</Label>
                <Input
                  id="attachment_url"
                  type="url"
                  value={formData.attachment_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, attachment_url: e.target.value }))}
                  placeholder="https://example.com/document.pdf"
                />
              </div>
              <div>
                <Label htmlFor="publish_date">Publish Date</Label>
                <Input
                  id="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNotice}>Create Notice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {notices.map((notice) => (
          <Card key={notice.id} className={`${!notice.is_published ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{notice.title}</CardTitle>
                    {notice.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: notice.category?.color,
                        color: notice.category?.color 
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full mr-1" 
                        style={{ backgroundColor: notice.category?.color }}
                      />
                      {notice.category?.name}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(notice.publish_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNoticeStatus(notice, 'is_published')}
                    className="h-8 w-8 p-0"
                  >
                    {notice.is_published ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleNoticeStatus(notice, 'is_featured')}
                    className="h-8 w-8 p-0"
                  >
                    <Star className={`h-4 w-4 ${notice.is_featured ? 'text-yellow-600 fill-current' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </div>
              <CardDescription className="line-clamp-3">
                {notice.content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Created: {new Date(notice.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditNotice(notice)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteNotice(notice.id)}
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

      {notices.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
            <p className="text-gray-600 text-center mb-4">
              Create your first notice or announcement
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Notice
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
            <DialogDescription>
              Update notice details and content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notice title"
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
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter notice content"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="edit-attachment_url">Attachment URL (Optional)</Label>
              <Input
                id="edit-attachment_url"
                type="url"
                value={formData.attachment_url}
                onChange={(e) => setFormData(prev => ({ ...prev, attachment_url: e.target.value }))}
                placeholder="https://example.com/document.pdf"
              />
            </div>
            <div>
              <Label htmlFor="edit-publish_date">Publish Date</Label>
              <Input
                id="edit-publish_date"
                type="date"
                value={formData.publish_date}
                onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="edit-is_published">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="edit-is_featured">Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNotice}>Update Notice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticeManagement;