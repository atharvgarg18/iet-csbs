import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { User, UserRole } from '@shared/api';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Middleware to check if user is authenticated
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find valid session with user data
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('user_sessions')
      .select(`
        *,
        user:users (
          id,
          email,
          full_name,
          role,
          is_active,
          last_login,
          created_at,
          updated_at
        )
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

    // Check if user is active
    if (!session.user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Extend session expiry
    await supabaseAdmin
      .from('user_sessions')
      .update({ 
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .eq('session_token', sessionToken);

    // Attach user to request
    req.user = session.user as User;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Middleware to check if user has specific role
export const requireRole = (roles: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware for admin-only routes
export const requireAdmin = requireRole('admin');

// Middleware for admin and editor roles
export const requireEditor = requireRole(['admin', 'editor']);

// Middleware for any authenticated user
export const requireUser = requireRole(['admin', 'editor', 'viewer']);