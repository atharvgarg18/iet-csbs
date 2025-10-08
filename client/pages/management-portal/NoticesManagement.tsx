import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
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
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  Calendar,
  RefreshCw,
  Info,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Notice, NoticeCategory } from '@shared/api';

export default function NoticesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Dialog states
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);

  // Form data - only includes supported backend fields
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    is_published: true,
    publish_date: new Date().toISOString().split('T')[0]
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredNotices = notices.filter(notice => {
    const categoryName = notice.category?.name || '';
    const matchesSearch = !searchTerm || 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || notice.category_id === selectedCategory;
    
    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = notice.is_published;
    else if (statusFilter === 'draft') matchesStatus = !notice.is_published;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/notices');
      const data = result.success ? result.data : result;
      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch notices error:', error);
      setError('Failed to load notices');
      toast({
        title: "Error",
        description: "Failed to load notices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await apiGet('/.netlify/functions/api/admin/notice-categories');
      const data = result.success ? result.data : result;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch categories error:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      category_id: '',
      is_published: true,
      publish_date: new Date().toISOString().split('T')[0]
    });
    setShowNoticeDialog(true);
  };

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category_id: notice.category_id || '',
      is_published: notice.is_published,
      publish_date: notice.publish_date.split('T')[0]
    });
    setShowNoticeDialog(true);
  };

  const openPreviewDialog = (notice: Notice) => {
    setPreviewNotice(notice);
    setShowPreviewDialog(true);
  };

  const handleSaveNotice = async () => {
    if (!formData.title || !formData.content || !formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Title, content, and category are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      // Backend expects these exact fields
      const payload = {
        category_id: formData.category_id,
        title: formData.title,
        content: formData.content,
        publish_date: formData.publish_date,
        is_published: formData.is_published
      };

      if (editingNotice) {
        await apiPut(`/.netlify/functions/api/admin/notices/${editingNotice.id}`, payload);
      } else {
        await apiPost('/.netlify/functions/api/admin/notices', payload);
      }

      toast({
        title: "Success!",
        description: `Notice ${editingNotice ? 'updated' : 'created'} successfully`
      });

      setShowNoticeDialog(false);
      fetchNotices();
    } catch (error) {
      console.error('Save notice error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingNotice ? 'update' : 'create'} notice`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      setActionLoading(`delete-${noticeId}`);
      
      await apiDelete(`/.netlify/functions/api/admin/notices/${noticeId}`);
      
      toast({
        title: "Success!",
        description: "Notice deleted successfully"
      });
      
      fetchNotices();
    } catch (error) {
      console.error('Delete notice error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete notice",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notices Management</h1>
                  <p className="text-gray-600">Create and manage notices for students</p>
                </div>
              </div>
              <Button 
                onClick={openCreateDialog}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Notice
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={fetchNotices}
                disabled={loading}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notices Grid */}
        {error ? (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Info className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchNotices} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredNotices.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Get started by creating your first notice'
                    }
                  </p>
                  {!searchTerm && selectedCategory === 'all' && statusFilter === 'all' && (
                    <Button onClick={openCreateDialog}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Notice
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredNotices.map((notice) => (
                <Card key={notice.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {notice.title}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            {notice.category && (
                              <Badge 
                                variant="secondary"
                                style={{ backgroundColor: `${notice.category.color}20`, color: notice.category.color }}
                              >
                                {notice.category.name}
                              </Badge>
                            )}
                            <Badge variant={notice.is_published ? "default" : "secondary"}>
                              {notice.is_published ? 'Published' : 'Draft'}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(notice.publish_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                          {notice.content}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPreviewDialog(notice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(notice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{notice.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNotice(notice.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${notice.id}`}
                              >
                                {actionLoading === `delete-${notice.id}` ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </DialogTitle>
              <DialogDescription>
                {editingNotice ? 'Update the notice details' : 'Fill in the details to create a new notice'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter notice title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content" className="text-sm font-semibold text-slate-700">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter notice content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="publish_date" className="text-sm font-semibold text-slate-700">Publish Date</Label>
                  <Input
                    id="publish_date"
                    type="date"
                    value={formData.publish_date}
                    onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_published" className="text-sm font-medium text-slate-700">
                    Published
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNoticeDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveNotice}
                disabled={actionLoading === 'save'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {actionLoading === 'save' ? 'Saving...' : (editingNotice ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Notice Preview</DialogTitle>
            </DialogHeader>
            
            {previewNotice && (
              <div className="py-4">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {previewNotice.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                    {previewNotice.category && (
                      <Badge 
                        variant="secondary"
                        style={{ backgroundColor: `${previewNotice.category.color}20`, color: previewNotice.category.color }}
                      >
                        {previewNotice.category.name}
                      </Badge>
                    )}
                    <Badge variant={previewNotice.is_published ? "default" : "secondary"}>
                      {previewNotice.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(previewNotice.publish_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {previewNotice.content}
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}