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
import { Bell, Plus, Edit, Trash2, ExternalLink, Loader2, AlertCircle, Search, Filter, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notice {
  id: number;
  category_id: number;
  title: string;
  content: string;
  link: string | null;
  is_important: boolean;
  created_at: string;
  updated_at: string;
  notice_categories: {
    id: number;
    name: string;
  };
}

interface NoticeCategory {
  id: number;
  name: string;
}

export default function NoticesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Create/Edit notice modal state
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    content: '',
    link: '',
    is_important: false
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');

  // Filter notices based on search and selections
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = !searchTerm || 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.notice_categories.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      notice.notice_categories.id.toString() === selectedCategory;
    
    const matchesImportance = selectedImportance === 'all' ||
      (selectedImportance === 'important' && notice.is_important) ||
      (selectedImportance === 'normal' && !notice.is_important);

    return matchesSearch && matchesCategory && matchesImportance;
  });

  useEffect(() => {
    if (user && ['admin', 'editor', 'viewer'].includes(user.role)) {
      fetchNotices();
      fetchCategories();
    }
  }, [user]);

  const fetchNotices = async () => {
    try {
      setError(null);
      const response = await fetch('/.netlify/functions/api/admin/notices', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notices: ${response.status}`);
      }

      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Fetch notices error:', error);
      setError(error.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/.netlify/functions/api/admin/notice-categories', {
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
        description: 'Failed to load categories. Creating notices may not work properly.',
        variant: 'destructive'
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleSaveNotice = async () => {
    if (!formData.category_id || !formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category, title, and content are required',
        variant: 'destructive'
      });
      return;
    }

    // Validate link if provided
    if (formData.link && formData.link.trim()) {
      try {
        new URL(formData.link);
      } catch {
        toast({
          title: 'Validation Error',
          description: 'Please provide a valid URL for the link',
          variant: 'destructive'
        });
        return;
      }
    }

    setActionLoading('save-notice');
    try {
      const url = editingNotice 
        ? `/.netlify/functions/api/admin/notices/${editingNotice.id}`
        : '/.netlify/functions/api/admin/notices';
      
      const method = editingNotice ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          category_id: parseInt(formData.category_id),
          title: formData.title,
          content: formData.content,
          link: formData.link || null,
          is_important: formData.is_important
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingNotice ? 'update' : 'create'} notice`);
      }

      toast({
        title: 'Success',
        description: `Notice ${editingNotice ? 'updated' : 'created'} successfully`
      });

      setShowNoticeDialog(false);
      resetForm();
      fetchNotices();
    } catch (error) {
      console.error('Save notice error:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${editingNotice ? 'update' : 'create'} notice`,
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotice = async (noticeId: number) => {
    setActionLoading(`delete-notice-${noticeId}`);
    try {
      const response = await fetch(`/.netlify/functions/api/admin/notices/${noticeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete notice');
      }

      toast({
        title: 'Success',
        description: 'Notice deleted successfully'
      });
      
      fetchNotices();
    } catch (error) {
      console.error('Delete notice error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete notice',
        variant: 'destructive'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openNoticeDialog = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        category_id: notice.category_id.toString(),
        title: notice.title,
        content: notice.content,
        link: notice.link || '',
        is_important: notice.is_important
      });
    } else {
      setEditingNotice(null);
      resetForm();
    }
    setShowNoticeDialog(true);
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      title: '',
      content: '',
      link: '',
      is_important: false
    });
    setEditingNotice(null);
  };

  // Check if user has edit access
  const canEdit = user && ['admin', 'editor'].includes(user.role);

  if (!user || !['admin', 'editor', 'viewer'].includes(user.role)) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Only administrators, editors, and viewers can access notices management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Notices Management</h1>
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
          <h1 className="text-2xl font-bold text-gray-900">Notices Management</h1>
          <Button onClick={fetchNotices} variant="outline">
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
          <h1 className="text-2xl font-bold text-gray-900">Notices Management</h1>
          <p className="text-gray-600 mt-1">
            Manage notices and announcements
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => openNoticeDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Notice
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search notices..."
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
            <div>
              <Label htmlFor="importance-filter">Importance</Label>
              <Select value={selectedImportance} onValueChange={setSelectedImportance}>
                <SelectTrigger>
                  <SelectValue placeholder="All Notices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notices</SelectItem>
                  <SelectItem value="important">Important Only</SelectItem>
                  <SelectItem value="normal">Normal Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedImportance('all');
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

      {/* Notices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            Notices ({filteredNotices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotices.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {notices.length === 0 ? 'No notices found' : 'No notices match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {notices.length === 0 
                  ? 'Start by creating your first notice'
                  : 'Try adjusting your search criteria'
                }
              </p>
              {canEdit && notices.length === 0 && (
                <Button onClick={() => openNoticeDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Notice
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <Bell className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">
                            {notice.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {notice.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {notice.notice_categories.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {notice.is_important ? (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          Important
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {notice.content.length > 60 
                            ? notice.content.substring(0, 60) + '...'
                            : notice.content
                          }
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">
                          {new Date(notice.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {notice.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={notice.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {canEdit && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openNoticeDialog(notice)}
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
                                    disabled={actionLoading === `delete-notice-${notice.id}`}
                                  >
                                    {actionLoading === `delete-notice-${notice.id}` && (
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

      {/* Create/Edit Notice Dialog */}
      {canEdit && (
        <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? 'Edit Notice' : 'Create New Notice'}
              </DialogTitle>
              <DialogDescription>
                {editingNotice 
                  ? 'Update the notice information.'
                  : 'Create a new notice or announcement for students and faculty.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="notice-category">Category *</Label>
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
                <Label htmlFor="notice-title">Title *</Label>
                <Input
                  id="notice-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Notice title"
                />
              </div>

              <div>
                <Label htmlFor="notice-content">Content *</Label>
                <Textarea
                  id="notice-content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Notice content and details"
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="notice-link">Link (Optional)</Label>
                <Input
                  id="notice-link"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://example.com/additional-info"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional link for additional information or resources
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notice-important"
                  checked={formData.is_important}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_important: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <Label htmlFor="notice-important">Mark as Important</Label>
                <p className="text-sm text-gray-500">Important notices are highlighted prominently</p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNoticeDialog(false)}
                disabled={actionLoading === 'save-notice'}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNotice}
                disabled={actionLoading === 'save-notice'}
              >
                {actionLoading === 'save-notice' && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingNotice ? 'Update' : 'Create'} Notice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}