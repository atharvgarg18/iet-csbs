import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Megaphone,
  Target,
  TrendingUp,
  FileText,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Notice, NoticeCategory } from '@shared/api';
import { COLORS } from '@/lib/management-design-system';

export default function NoticesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    attachment_url: '',
    is_urgent: false,
    is_published: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = !searchTerm || 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notice.category && notice.category.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      (notice.category && notice.category.id === selectedCategory);
    
    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = notice.is_published;
    else if (statusFilter === 'draft') matchesStatus = !notice.is_published;
    else if (statusFilter === 'urgent') matchesStatus = notice.is_urgent;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiGet('/.netlify/functions/api/admin/notices');
      const data = result.success ? result.data : result;
      setNotices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Notices fetch error:', err);
      setError('Failed to load notices');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await apiGet('/.netlify/functions/api/admin/notice-categories');
      const data = result.success ? result.data : result;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Categories fetch error:', err);
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
    attachment_url: '',
    is_urgent: false,
    is_published: true
  });
  setShowNoticeDialog(true);
};  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category_id: notice.category?.id || '',
      attachment_url: notice.attachment_url || '',
      is_urgent: notice.is_urgent,
      is_published: notice.is_published
    });
    setShowNoticeDialog(true);
  };

  const handleSaveNotice = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      // Clean up the data - convert empty strings to null for optional fields
      const dataToSend = {
        ...formData,
        attachment_url: formData.attachment_url?.trim() || null,
      };
      
      console.log('Sending notice data:', dataToSend);
      
      const url = editingNotice 
        ? `/.netlify/functions/api/admin/notices/${editingNotice.id}`
        : '/.netlify/functions/api/admin/notices';
      
      const method = editingNotice ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingNotice ? 'update' : 'create'} notice`);
      }

      toast({
        title: "Success!",
        description: `Notice ${editingNotice ? 'updated' : 'created'} successfully`
      });

      setShowNoticeDialog(false);
      fetchNotices();
    } catch (error: any) {
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
      
      const response = await fetch(`/.netlify/functions/api/admin/notices/${noticeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete notice');
      }

      toast({
        title: "Success!",
        description: "Notice deleted successfully"
      });

      fetchNotices();
    } catch (error: any) {
      console.error('Delete notice error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete notice',
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryBadgeStyle = (category: NoticeCategory) => {
    const colors = [
      { bg: COLORS.primary[100], text: COLORS.primary[700], border: COLORS.primary[200] },
      { bg: COLORS.success[100], text: COLORS.success[700], border: COLORS.success[200] },
      { bg: COLORS.warning[100], text: COLORS.warning[700], border: COLORS.warning[200] },
      { bg: COLORS.accent[100], text: COLORS.accent[700], border: COLORS.accent[200] },
      { bg: COLORS.error[100], text: COLORS.error[700], border: COLORS.error[200] }
    ];
    const colorIndex = category.name.length % colors.length;
    return colors[colorIndex];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div 
            className="h-8 rounded mb-4"
            style={{ backgroundColor: COLORS.neutral[200] }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="h-32 rounded-lg"
                style={{ backgroundColor: COLORS.neutral[200] }}
              />
            ))}
          </div>
          <div 
            className="h-64 rounded-lg"
            style={{ backgroundColor: COLORS.neutral[200] }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ backgroundColor: COLORS.neutral[50] }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>Notices Management</h1>
          <p className="mt-2" style={{ color: COLORS.neutral[600] }}>Create, manage and publish important announcements</p>
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
            <Plus className="h-4 w-4 mr-2" />
            Create Notice
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
              onClick={fetchNotices}
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
                <p className="font-medium text-sm" style={{ color: COLORS.primary[600] }}>Total Notices</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>{notices.length}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary[100] }}
              >
                <Bell className="h-6 w-6" style={{ color: COLORS.primary[600] }} />
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
                  {notices.filter(n => n.is_published).length}
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
                <p className="font-medium text-sm" style={{ color: COLORS.warning[600] }}>Urgent Notices</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>
                  {notices.filter(n => n.is_urgent && n.is_published).length}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.warning[100] }}
              >
                <Megaphone className="h-6 w-6" style={{ color: COLORS.warning[600] }} />
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
                <p className="font-medium text-sm" style={{ color: COLORS.accent[600] }}>Categories</p>
                <p className="text-2xl font-bold" style={{ color: COLORS.neutral[900] }}>{categories.length}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.accent[100] }}
              >
                <Tag className="h-6 w-6" style={{ color: COLORS.accent[600] }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card 
        className="shadow-sm border-0"
        style={{ backgroundColor: 'white' }}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: COLORS.neutral[400] }} />
                <Input
                  placeholder="Search notices..."
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
                  <SelectItem value="urgent">Urgent Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2" style={{ color: COLORS.neutral[600] }}>
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">
                {filteredNotices.length} of {notices.length} notices
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <Card 
          className="shadow-sm border-0"
          style={{ backgroundColor: 'white' }}
        >
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.neutral[300] }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.neutral[900] }}>No Notices Found</h3>
            <p className="mb-6" style={{ color: COLORS.neutral[600] }}>
              {searchTerm || selectedCategory !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first notice'
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
                <Plus className="h-4 w-4 mr-2" />
                Create First Notice
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredNotices.map((notice) => {
            const categoryStyle = notice.category ? getCategoryBadgeStyle(notice.category) : null;
            return (
              <Card 
                key={notice.id} 
                className="shadow-sm border-0 hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: 'white' }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: notice.is_urgent ? COLORS.warning[100] : COLORS.primary[100] }}
                        >
                          {notice.is_urgent ? (
                            <Megaphone className="h-5 w-5" style={{ color: COLORS.warning[600] }} />
                          ) : (
                            <Bell className="h-5 w-5" style={{ color: COLORS.primary[600] }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate" style={{ color: COLORS.neutral[900] }}>
                            {notice.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            {notice.category && categoryStyle && (
                              <Badge 
                                className="text-xs border"
                                style={{
                                  backgroundColor: categoryStyle.bg,
                                  color: categoryStyle.text,
                                  borderColor: categoryStyle.border
                                }}
                              >
                                {notice.category.name}
                              </Badge>
                            )}
                            <Badge 
                              className="text-xs border"
                              style={notice.is_published ? { 
                                backgroundColor: COLORS.success[100], 
                                color: COLORS.success[700],
                                borderColor: COLORS.success[200]
                              } : { 
                                backgroundColor: COLORS.neutral[100], 
                                color: COLORS.neutral[600],
                                borderColor: COLORS.neutral[200]
                              }}
                            >
                              {notice.is_published ? 'Published' : 'Draft'}
                            </Badge>
                            {notice.is_urgent && (
                              <Badge 
                                className="text-xs border"
                                style={{ 
                                  backgroundColor: COLORS.warning[100], 
                                  color: COLORS.warning[700],
                                  borderColor: COLORS.warning[200]
                                }}
                              >
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: COLORS.neutral[600] }}>
                        {notice.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs" style={{ color: COLORS.neutral[500] }}>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created {formatDate(notice.created_at)}
                        </div>
                        {notice.updated_at !== notice.created_at && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Updated {formatDate(notice.updated_at)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {['admin', 'editor'].includes(user?.role || '') && (
                      <div className="flex items-center gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditDialog(notice)}
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
                              <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{notice.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNotice(notice.id)}
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
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingNotice ? 'Edit Notice' : 'Create New Notice'}
            </DialogTitle>
            <DialogDescription>
              {editingNotice ? 'Update notice information and settings' : 'Create a new announcement for students and staff'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Notice Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter notice title"
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
              <Label htmlFor="content">Notice Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter detailed notice content"
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="attachment_url">Attachment Link (Optional)</Label>
              <Input
                id="attachment_url"
                value={formData.attachment_url}
                onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
                placeholder="https://example.com/document.pdf"
                type="url"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add a link to view additional documents or resources
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_urgent"
                  checked={formData.is_urgent}
                  onChange={(e) => setFormData({ ...formData, is_urgent: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_urgent">Mark as urgent</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_published">Publish immediately</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNoticeDialog(false)}
              disabled={actionLoading === 'save'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNotice}
              disabled={actionLoading === 'save'}
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              {actionLoading === 'save' ? 'Saving...' : editingNotice ? 'Update Notice' : 'Create Notice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}