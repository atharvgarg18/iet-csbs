import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import { Bell, Plus, Edit, Trash2, ExternalLink, Loader2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notice {
  id: number;
  title: string;
  content: string;
  category_id: number;
  priority: string;
  is_active: boolean;
  expires_at: string | null;
  attachment_url: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function NoticeManagementNew() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    priority: 'medium',
    is_active: true,
    expires_at: '',
    attachment_url: ''
  });

  // API Base URL that works for both localhost and Netlify
  const getApiUrl = (endpoint: string) => {
    return `/.netlify/functions/api${endpoint}`;
  };

  // Fetch notices from API
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl('/admin/notices'));
      const data = await response.json();
      
      if (data.success) {
        setNotices(data.data || []);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch notices",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch(getApiUrl('/admin/notice-categories'));
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Create or Update notice
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const url = editingNotice 
        ? getApiUrl(`/admin/notices/${editingNotice.id}`)
        : getApiUrl('/admin/notices');
      
      const method = editingNotice ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id),
          expires_at: formData.expires_at || null
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: editingNotice ? "Notice updated successfully" : "Notice created successfully"
        });
        
        setDialogOpen(false);
        resetForm();
        fetchNotices();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save notice",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving notice:', error);
      toast({
        title: "Error",
        description: "Failed to save notice",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete notice
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(getApiUrl(`/admin/notices/${id}`), {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Notice deleted successfully"
        });
        fetchNotices();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete notice",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast({
        title: "Error",
        description: "Failed to delete notice",
        variant: "destructive"
      });
    }
  };

  // Toggle notice active status
  const toggleActiveStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(getApiUrl(`/admin/notices/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Notice ${!currentStatus ? 'activated' : 'deactivated'} successfully`
        });
        fetchNotices();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update notice status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating notice status:', error);
      toast({
        title: "Error",
        description: "Failed to update notice status",
        variant: "destructive"
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category_id: '',
      priority: 'medium',
      is_active: true,
      expires_at: '',
      attachment_url: ''
    });
    setEditingNotice(null);
  };

  // Open edit dialog
  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category_id: notice.category_id.toString(),
      priority: notice.priority,
      is_active: notice.is_active,
      expires_at: notice.expires_at ? notice.expires_at.split('T')[0] : '',
      attachment_url: notice.attachment_url || ''
    });
    setDialogOpen(true);
  };

  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchNotices();
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notice Management</h1>
          <p className="text-muted-foreground">Manage announcements and important notices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingNotice ? 'Edit Notice' : 'Add New Notice'}
              </DialogTitle>
              <DialogDescription>
                {editingNotice ? 'Update notice information' : 'Create a new notice'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notice title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter notice content"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="attachment_url">Attachment URL (Optional)</Label>
                <Input
                  id="attachment_url"
                  type="url"
                  value={formData.attachment_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, attachment_url: e.target.value }))}
                  placeholder="https://example.com/file.pdf"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingNotice ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            All Notices ({notices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading notices...</span>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notices found. Create your first notice!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{notice.title}</div>
                    </TableCell>
                    <TableCell>{notice.category?.name || `Category ${notice.category_id}`}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(notice.priority)}>
                        {notice.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActiveStatus(notice.id, notice.is_active)}
                      >
                        <Badge variant={notice.is_active ? "default" : "secondary"}>
                          {notice.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {notice.expires_at ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(notice.expires_at).toLocaleDateString()}
                        </div>
                      ) : (
                        "No expiry"
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(notice.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {notice.attachment_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(notice.attachment_url!, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(notice)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
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
                                onClick={() => handleDelete(notice.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}