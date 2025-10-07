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
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  Pin,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Megaphone,
  BookOpen,
  GraduationCap,
  Building,
  Users,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  is_pinned: boolean;
  is_published: boolean;
  publish_date: string;
  expiry_date: string | null;
  created_at: string;
  created_by: string;
  creator_name: string;
}

export default function NoticesManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium',
    is_pinned: false,
    is_published: true,
    publish_date: new Date().toISOString().split('T')[0],
    expiry_date: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = !searchTerm || 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || notice.priority === selectedPriority;
    
    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = notice.is_published;
    else if (statusFilter === 'draft') matchesStatus = !notice.is_published;
    else if (statusFilter === 'pinned') matchesStatus = notice.is_pinned;
    else if (statusFilter === 'expired') {
      const now = new Date();
      const expiry = notice.expiry_date ? new Date(notice.expiry_date) : null;
      matchesStatus = expiry ? expiry < now : false;
    }

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  // Get unique categories
  const categories = [...new Set(notices.map(notice => notice.category))].filter(Boolean);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/api/admin/notices', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const data = result.success ? result.data : result;
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Notices fetch error:', err);
      setError('Failed to load notices');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openCreateDialog = () => {
    setEditingNotice(null);
    setFormData({
      title: '',
      content: '',
      category: '',
      priority: 'medium',
      is_pinned: false,
      is_published: true,
      publish_date: new Date().toISOString().split('T')[0],
      expiry_date: ''
    });
    setShowNoticeDialog(true);
  };

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      priority: notice.priority,
      is_pinned: notice.is_pinned,
      is_published: notice.is_published,
      publish_date: notice.publish_date.split('T')[0],
      expiry_date: notice.expiry_date ? notice.expiry_date.split('T')[0] : ''
    });
    setShowNoticeDialog(true);
  };

  const openPreviewDialog = (notice: Notice) => {
    setPreviewNotice(notice);
    setShowPreviewDialog(true);
  };

  const handleSaveNotice = async () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Title, content, and category are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const payload = {
        ...formData,
        expiry_date: formData.expiry_date || null
      };

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
        body: JSON.stringify(payload)
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
    } catch (error) {
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

  const handleTogglePin = async (notice: Notice) => {
    try {
      setActionLoading(`pin-${notice.id}`);
      
      const response = await fetch(`/api/admin/notices/${notice.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...notice,
          is_pinned: !notice.is_pinned,
          publish_date: notice.publish_date.split('T')[0],
          expiry_date: notice.expiry_date ? notice.expiry_date.split('T')[0] : null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update notice');
      }

      toast({
        title: "Success!",
        description: `Notice ${!notice.is_pinned ? 'pinned' : 'unpinned'} successfully`
      });

      fetchNotices();
    } catch (error) {
      console.error('Toggle pin error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update notice',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    const colors = {
      'high': 'bg-gradient-to-br from-red-50 to-pink-50 text-red-700 border-red-200',
      'medium': 'bg-gradient-to-br from-yellow-50 to-orange-50 text-orange-700 border-orange-200',
      'low': 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border-green-200'
    };
    return colors[priority] || colors['medium'];
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      'high': AlertTriangle,
      'medium': Info,
      'low': CheckCircle
    };
    const Icon = icons[priority] || Info;
    return <Icon className="h-3 w-3" />;
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      'Academic': 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700',
      'Administrative': 'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-700',
      'Events': 'bg-gradient-to-br from-pink-50 to-rose-50 text-pink-700',
      'Exam': 'bg-gradient-to-br from-red-50 to-orange-50 text-red-700',
      'Holiday': 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700',
      'General': 'bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700',
      'Urgent': 'bg-gradient-to-br from-red-100 to-pink-100 text-red-800',
      'Fee': 'bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-700',
      'Result': 'bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700'
    };
    return colors[category] || colors['General'];
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Academic': BookOpen,
      'Administrative': Building,
      'Events': Activity,
      'Exam': GraduationCap,
      'Holiday': Calendar,
      'General': Bell,
      'Urgent': Megaphone,
      'Fee': Users,
      'Result': CheckCircle
    };
    const Icon = icons[category] || Bell;
    return <Icon className="h-3 w-3" />;
  };

  const isExpired = (notice: Notice) => {
    if (!notice.expiry_date) return false;
    return new Date(notice.expiry_date) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Notices</h3>
          <p className="text-slate-500">Fetching notices and announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Notices Management</h1>
          <p className="text-slate-500 mt-1">Manage notices and announcements</p>
        </div>
        {(['admin', 'editor'].includes(user?.role || '')) && (
          <Button 
            onClick={openCreateDialog}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Notice
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
              onClick={fetchNotices}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search notices..."
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
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 border-0 bg-slate-50">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pinned">Pinned</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                {filteredNotices.length} of {notices.length} notices
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Notices Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first notice'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && selectedPriority === 'all' && statusFilter === 'all' && 
             ['admin', 'editor'].includes(user?.role || '') && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create First Notice
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotices
            .sort((a, b) => {
              // Sort by pinned first, then by priority, then by date
              if (a.is_pinned && !b.is_pinned) return -1;
              if (!a.is_pinned && b.is_pinned) return 1;
              
              const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
              const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
              if (priorityDiff !== 0) return priorityDiff;
              
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })
            .map((notice) => (
            <Card key={notice.id} className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="p-6">
                  {/* Notice Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900 text-lg line-clamp-2 leading-tight">{notice.title}</h3>
                        {notice.is_pinned && (
                          <Pin className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                        )}
                      </div>
                      
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge className={`${getCategoryBadgeColor(notice.category)} border-0 shadow-sm font-medium`}>
                          {getCategoryIcon(notice.category)}
                          <span className="ml-1">{notice.category}</span>
                        </Badge>
                        <Badge className={`${getPriorityBadgeColor(notice.priority)} border shadow-sm font-medium`}>
                          {getPriorityIcon(notice.priority)}
                          <span className="ml-1 capitalize">{notice.priority}</span>
                        </Badge>
                        
                        {!notice.is_published && (
                          <Badge className="bg-gradient-to-br from-slate-100 to-gray-100 text-slate-600 border-slate-200 shadow-sm">
                            Draft
                          </Badge>
                        )}
                        
                        {isExpired(notice) && (
                          <Badge className="bg-gradient-to-br from-red-100 to-pink-100 text-red-700 border-red-200 shadow-sm">
                            <XCircle className="h-3 w-3 mr-1" />
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="mb-4">
                    <p className="text-slate-600 line-clamp-3 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>

                  {/* Dates and Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span>Published: {new Date(notice.publish_date).toLocaleDateString()}</span>
                    </div>
                    {notice.expiry_date && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>Expires: {new Date(notice.expiry_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-500">
                      <User className="h-4 w-4" />
                      <span>By {notice.creator_name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPreviewDialog(notice)}
                      className="flex-1 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    
                    {(['admin', 'editor'].includes(user?.role || '')) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePin(notice)}
                          disabled={actionLoading === `pin-${notice.id}`}
                          className={`hover:bg-yellow-50 hover:text-yellow-600 ${notice.is_pinned ? 'text-yellow-600 bg-yellow-50' : ''}`}
                        >
                          {actionLoading === `pin-${notice.id}` ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Pin className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(notice)}
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
                                Delete Notice
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Are you sure you want to delete <strong>{notice.title}</strong>? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNotice(notice.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${notice.id}`}
                              >
                                {actionLoading === `delete-${notice.id}` ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Delete Notice
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
      )}

      {/* Create/Edit Notice Dialog */}
      <Dialog open={showNoticeDialog} onOpenChange={setShowNoticeDialog}>
        <DialogContent className="sm:max-w-3xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-blue-600" />
              {editingNotice ? 'Edit Notice' : 'Create New Notice'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingNotice ? 'Update notice information and content' : 'Create a new notice or announcement'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold text-slate-700">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter notice title"
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-sm font-semibold text-slate-700">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter notice content"
                className="mt-2 border-0 bg-slate-50 focus:bg-white transition-colors min-h-32"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Exam">Exam</SelectItem>
                    <SelectItem value="Holiday">Holiday</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Fee">Fee</SelectItem>
                    <SelectItem value="Result">Result</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority" className="text-sm font-semibold text-slate-700">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="publish_date" className="text-sm font-semibold text-slate-700">Publish Date</Label>
                <Input
                  id="publish_date"
                  type="date"
                  value={formData.publish_date}
                  onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                  className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expiry_date" className="text-sm font-semibold text-slate-700">Expiry Date (Optional)</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="is_pinned"
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="is_pinned" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Pin className="h-4 w-4" />
                  Pin Notice
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="is_published" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Publish Immediately
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowNoticeDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotice}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {editingNotice ? 'Update' : 'Create'} Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notice Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-3xl border-0 shadow-2xl">
          {previewNotice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      {previewNotice.title}
                      {previewNotice.is_pinned && <Pin className="h-5 w-5 text-yellow-600" />}
                    </DialogTitle>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge className={`${getCategoryBadgeColor(previewNotice.category)} border-0 shadow-sm font-medium`}>
                    {getCategoryIcon(previewNotice.category)}
                    <span className="ml-1">{previewNotice.category}</span>
                  </Badge>
                  <Badge className={`${getPriorityBadgeColor(previewNotice.priority)} border shadow-sm font-medium`}>
                    {getPriorityIcon(previewNotice.priority)}
                    <span className="ml-1 capitalize">{previewNotice.priority}</span>
                  </Badge>
                  
                  {!previewNotice.is_published && (
                    <Badge className="bg-gradient-to-br from-slate-100 to-gray-100 text-slate-600 border-slate-200 shadow-sm">
                      Draft
                    </Badge>
                  )}
                  
                  {isExpired(previewNotice) && (
                    <Badge className="bg-gradient-to-br from-red-100 to-pink-100 text-red-700 border-red-200 shadow-sm">
                      <XCircle className="h-3 w-3 mr-1" />
                      Expired
                    </Badge>
                  )}
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Content */}
                <div className="prose max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {previewNotice.content}
                  </p>
                </div>
                
                {/* Dates and Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Published: {new Date(previewNotice.publish_date).toLocaleDateString()}</span>
                  </div>
                  {previewNotice.expiry_date && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Expires: {new Date(previewNotice.expiry_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Created by {previewNotice.creator_name}</span>
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