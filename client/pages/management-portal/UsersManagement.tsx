import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserCheck, 
  UserX, 
  Crown, 
  Zap, 
  Eye,
  Mail,
  Calendar,
  Sparkles,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  created_at: string;
}

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: '' as 'admin' | 'editor' | 'viewer' | '',
    is_active: true
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && user.is_active) ||
      (selectedStatus === 'inactive' && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/users', {
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
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Users fetch error:', err);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      full_name: '',
      role: '',
      is_active: true
    });
    setShowUserDialog(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active
    });
    setShowUserDialog(true);
  };

  const handleSaveUser = async () => {
    if (!formData.email || !formData.full_name || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setActionLoading('save');
      
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }

      toast({
        title: "Success!",
        description: `User ${editingUser ? 'updated' : 'created'} successfully`
      });

      setShowUserDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Save user error:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingUser ? 'update' : 'create'} user`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setActionLoading(`delete-${userId}`);
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete user');
      }

      toast({
        title: "Success!",
        description: "User deleted successfully"
      });

      fetchUsers();
    } catch (error) {
      console.error('Delete user error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to delete user',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setActionLoading(`toggle-${userId}`);
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          is_active: !currentStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update user status');
      }

      toast({
        title: "Success!",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchUsers();
    } catch (error) {
      console.error('Toggle status error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update user status',
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin': return {
        gradient: 'from-red-500 to-pink-500',
        icon: Crown,
        bgClass: 'bg-gradient-to-br from-red-50 to-pink-50',
        textClass: 'text-red-700',
        label: 'Admin'
      };
      case 'editor': return {
        gradient: 'from-blue-500 to-cyan-500',
        icon: Zap,
        bgClass: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        textClass: 'text-blue-700',
        label: 'Editor'
      };
      case 'viewer': return {
        gradient: 'from-green-500 to-emerald-500',
        icon: Eye,
        bgClass: 'bg-gradient-to-br from-green-50 to-emerald-50',
        textClass: 'text-green-700',
        label: 'Viewer'
      };
      default: return {
        gradient: 'from-gray-500 to-slate-500',
        icon: Shield,
        bgClass: 'bg-gradient-to-br from-gray-50 to-slate-50',
        textClass: 'text-gray-700',
        label: role
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Loading Users</h3>
          <p className="text-slate-500">Fetching user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Control user access and permissions</p>
        </div>
        <Button 
          onClick={openCreateDialog}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
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
              onClick={fetchUsers}
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-0 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-40 h-12 border-0 bg-slate-50">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40 h-12 border-0 bg-slate-50">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Users Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || selectedRole !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first user'
              }
            </p>
            {!searchTerm && selectedRole === 'all' && selectedStatus === 'all' && (
              <Button onClick={openCreateDialog} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const roleConfig = getRoleConfig(user.role);
            const RoleIcon = roleConfig.icon;
            
            return (
              <Card key={user.id} className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className={`h-2 bg-gradient-to-r ${roleConfig.gradient}`}></div>
                  <div className="p-6">
                    {/* User Avatar & Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`relative w-12 h-12 bg-gradient-to-br ${roleConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold">
                            {user.full_name.charAt(0).toUpperCase()}
                          </span>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                            <RoleIcon className="h-2.5 w-2.5 text-slate-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 truncate">{user.full_name}</h3>
                          <div className="flex items-center gap-1 text-slate-500 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      {user.is_active ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      )}
                    </div>

                    {/* Role & Status Badges */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={`${roleConfig.bgClass} ${roleConfig.textClass} border-0 shadow-sm font-medium`}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleConfig.label}
                      </Badge>
                      
                      {user.is_active ? (
                        <Badge className="bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border-0 shadow-sm">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gradient-to-br from-red-50 to-pink-50 text-red-700 border-0 shadow-sm">
                          <UserX className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                        disabled={actionLoading !== null}
                        className="flex-1 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                        disabled={actionLoading === `toggle-${user.id}`}
                        className={`hover:bg-${user.is_active ? 'red' : 'green'}-50 hover:text-${user.is_active ? 'red' : 'green'}-600`}
                      >
                        {actionLoading === `toggle-${user.id}` ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : user.is_active ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {user.id !== currentUser?.id && (
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
                                Delete User
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base">
                                Are you sure you want to delete <strong>{user.full_name}</strong>? This action cannot be undone and will remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === `delete-${user.id}`}
                              >
                                {actionLoading === `delete-${user.id}` ? (
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-purple-600" />
              {editingUser ? 'Edit User' : 'Create New User'}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingUser ? 'Update user information and permissions' : 'Add a new user to the management system'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                disabled={editingUser !== null}
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            
            <div>
              <Label htmlFor="full_name" className="text-sm font-semibold text-slate-700">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter full name"
                className="mt-2 h-12 border-0 bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            
            <div>
              <Label htmlFor="role" className="text-sm font-semibold text-slate-700">User Role</Label>
              <Select value={formData.role} onValueChange={(value: 'admin' | 'editor' | 'viewer') => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="mt-2 h-12 border-0 bg-slate-50">
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">Viewer</div>
                        <div className="text-xs text-slate-500">Read-only access</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Editor</div>
                        <div className="text-xs text-slate-500">Can create and edit content</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium">Admin</div>
                        <div className="text-xs text-slate-500">Full system access</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-2xl">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <div>
                <Label htmlFor="is_active" className="text-sm font-semibold text-slate-700">Active User</Label>
                <p className="text-xs text-slate-500">User can access the system</p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setShowUserDialog(false)}
              disabled={actionLoading === 'save'}
              className="border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={actionLoading === 'save'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {actionLoading === 'save' ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {editingUser ? 'Update' : 'Create'} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}