import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { COLORS, COMPONENTS, ROLE_COLORS } from '@/lib/management-design-system';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserCheck, 
  UserX, 
  Mail,
  Calendar,
  Shield,
  MoreHorizontal,
  Filter,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'viewer' as User['role'],
    is_active: true,
    password: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await apiGet('/.netlify/functions/api/users');
      const data = result.success ? result.data : result;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingUser) {
        const updateData = {
          full_name: formData.full_name,
          role: formData.role,
          is_active: formData.is_active
        };
        
        await apiPut(`/.netlify/functions/api/users/${editingUser.id}`, updateData);
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        await apiPost('/.netlify/functions/api/users', formData);
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: editingUser ? 'Failed to update user' : 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await apiDelete(`/.netlify/functions/api/users/${userId}`);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      fetchUsers();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      await apiPut(`/.netlify/functions/api/users/${user.id}`, {
        ...user,
        is_active: !user.is_active
      });
      toast({
        title: 'Success',
        description: `User ${!user.is_active ? 'activated' : 'deactivated'} successfully`,
      });
      fetchUsers();
    } catch (error) {
      console.error('Status toggle error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      role: 'viewer',
      is_active: true,
      password: ''
    });
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
      password: ''
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: COLORS.neutral[900] }}>
            User Management
          </h1>
          <p className="mt-2" style={{ color: COLORS.neutral[600] }}>
            Manage system users and their permissions
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="text-white shadow-lg"
          style={{ backgroundColor: COLORS.primary[600] }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: COLORS.neutral[50] }}>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" 
                       style={{ color: COLORS.neutral[500] }} />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-0 shadow-sm focus:ring-2"
                  style={{ 
                    backgroundColor: COLORS.neutral[50],
                    borderColor: COLORS.neutral[300],
                    focusRingColor: COLORS.primary[500]
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 h-10 border-0 shadow-sm" style={{ backgroundColor: COLORS.neutral[50] }}>
                  <Filter className="h-4 w-4 mr-2" style={{ color: COLORS.neutral[500] }} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-10 border-0 shadow-sm" style={{ backgroundColor: COLORS.neutral[50] }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                className="h-10 px-3 border-0 shadow-sm"
                style={{ backgroundColor: COLORS.neutral[50] }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: COLORS.neutral[50] }}>
        <CardHeader>
          <CardTitle className="flex items-center text-xl" style={{ color: COLORS.neutral[900] }}>
            <Users className="h-5 w-5 mr-2" style={{ color: COLORS.primary[600] }} />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.neutral[400] }} />
              <p className="text-lg font-medium" style={{ color: COLORS.neutral[600] }}>
                No users found
              </p>
              <p className="text-sm mt-1" style={{ color: COLORS.neutral[500] }}>
                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first user'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: COLORS.neutral[100] }}>
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: COLORS.neutral[700] }}>
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: COLORS.neutral[700] }}>
                      Role
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: COLORS.neutral[700] }}>
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: COLORS.neutral[700] }}>
                      Last Login
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold" style={{ color: COLORS.neutral[700] }}>
                      Created
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold" style={{ color: COLORS.neutral[700] }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => {
                    const roleConfig = ROLE_COLORS[user.role];
                    return (
                      <tr 
                        key={user.id} 
                        className="border-t hover:bg-gray-50 transition-colors"
                        style={{ borderTopColor: COLORS.neutral[200] }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: roleConfig.background }}
                            >
                              <span 
                                className="text-sm font-medium uppercase"
                                style={{ color: roleConfig.text }}
                              >
                                {user.full_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: COLORS.neutral[900] }}>
                                {user.full_name}
                              </p>
                              <div className="flex items-center mt-1">
                                <Mail className="h-3 w-3 mr-1" style={{ color: COLORS.neutral[500] }} />
                                <p className="text-sm" style={{ color: COLORS.neutral[600] }}>
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            className="capitalize border"
                            style={{
                              backgroundColor: roleConfig.background,
                              color: roleConfig.text,
                              borderColor: roleConfig.border
                            }}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            className="border"
                            style={user.is_active 
                              ? {
                                  backgroundColor: COLORS.success[100],
                                  color: COLORS.success[800],
                                  borderColor: COLORS.success[200]
                                }
                              : {
                                  backgroundColor: COLORS.neutral[100],
                                  color: COLORS.neutral[600],
                                  borderColor: COLORS.neutral[300]
                                }
                            }
                          >
                            {user.is_active ? (
                              <UserCheck className="h-3 w-3 mr-1" />
                            ) : (
                              <UserX className="h-3 w-3 mr-1" />
                            )}
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" style={{ color: COLORS.neutral[500] }} />
                            <span className="text-sm" style={{ color: COLORS.neutral[600] }}>
                              {user.last_login 
                                ? new Date(user.last_login).toLocaleDateString()
                                : 'Never'
                              }
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm" style={{ color: COLORS.neutral[600] }}>
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                                {user.is_active ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              {user.id !== currentUser?.id && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => e.preventDefault()}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {user.full_name}? 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: COLORS.neutral[900] }}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name" style={{ color: COLORS.neutral[700] }}>
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" style={{ color: COLORS.neutral[700] }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                  required
                  disabled={editingUser !== null}
                />
              </div>
            </div>
            
            {!editingUser && (
              <div>
                <Label htmlFor="password" style={{ color: COLORS.neutral[700] }}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role" style={{ color: COLORS.neutral[700] }}>
                  Role
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: User['role']) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label style={{ color: COLORS.neutral[700] }}>
                  Status
                </Label>
                <div className="flex items-center space-x-2 mt-3">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <span className="text-sm" style={{ color: COLORS.neutral[600] }}>
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={formLoading}
                className="text-white"
                style={{ backgroundColor: COLORS.primary[600] }}
              >
                {formLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : null}
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}