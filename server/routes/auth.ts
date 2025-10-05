import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { supabaseAdmin } from "../lib/supabase";
import { 
  LoginRequest, 
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthCheckResponse,
  UsersResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  User,
  UserRole
} from "@shared/api";

// Helper function to generate session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper function to hash password
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Helper function to verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Login endpoint
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create session
    const { error: sessionError } = await supabaseAdmin
      .from('user_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create session'
      });
    }

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Remove password hash from response
    const { password_hash, ...userResponse } = user;

    // Set session cookie
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const response: LoginResponse = {
      success: true,
      data: {
        user: userResponse as User,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout endpoint
export const logout: RequestHandler = async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;

    if (sessionToken) {
      // Delete session from database
      await supabaseAdmin
        .from('user_sessions')
        .delete()
        .eq('session_token', sessionToken);
    }

    // Clear session cookie
    res.clearCookie('session_token');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check authentication status
export const checkAuth: RequestHandler = async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: 'No session token'
      });
    }

    // Find valid session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('user_sessions')
      .select(`
        *,
        user:users (*)
      `)
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session || !session.user) {
      // Clear invalid session cookie
      res.clearCookie('session_token');
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }

    // Extend session expiry
    await supabaseAdmin
      .from('user_sessions')
      .update({ 
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('session_token', sessionToken);

    // Remove password hash from response
    const { password_hash, ...userResponse } = session.user;

    const response: AuthCheckResponse = {
      success: true,
      data: {
        user: userResponse as User,
        session_valid: true
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Register new user (admin only)
export const register: RequestHandler = async (req, res) => {
  try {
    const { email, password, full_name, role = 'viewer' }: RegisterRequest = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name,
        role
      })
      .select('id, email, full_name, role, is_active, created_at, updated_at')
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }

    const response: RegisterResponse = {
      success: true,
      data: user as User
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users (admin only)
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, is_active, last_login, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }

    const response: UsersResponse = {
      success: true,
      data: users as User[]
    };

    res.json(response);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user (admin only)
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, full_name, role, is_active }: UpdateUserRequest = req.body;

    const updateData: any = {};
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (full_name !== undefined) updateData.full_name = full_name;
    if (role !== undefined) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, full_name, role, is_active, last_login, created_at, updated_at')
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user'
      });
    }

    res.json({
      success: true,
      data: user as User
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user (admin only)
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deleting the last admin
    const { data: adminCount } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .eq('is_active', true);

    if (adminCount && adminCount.length <= 1) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', id)
        .single();

      if (user && user.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin user'
        });
      }
    }

    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Change password
export const changePassword: RequestHandler = async (req, res) => {
  try {
    const { current_password, new_password }: ChangePasswordRequest = req.body;
    const sessionToken = req.cookies.session_token;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Get user from session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('user_sessions')
      .select('user_id')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    // Get user data
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', session.user_id)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await verifyPassword(current_password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(new_password);

    // Update password
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', user.id);

    if (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to change password'
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};