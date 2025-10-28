const { getSupabaseClient } = require('./_shared/supabase');
const { verifySession, requireAdmin, hashPassword } = require('./_shared/auth');
const { handleOptions, jsonResponse, errorResponse } = require('./_shared/http');

/**
 * Admin User Management API
 * Routes:
 * - GET /api/admin-users - List all users
 * - POST /api/admin-users - Create a new user
 * - PUT /api/admin-users/:id - Update a user
 * - DELETE /api/admin-users/:id - Delete a user
 */
exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;

  if (httpMethod === 'OPTIONS') {
    return handleOptions(headers);
  }

  try {
    // Verify admin session
    const user = await verifySession(headers.cookie);
    if (!requireAdmin(user)) {
      return errorResponse('Unauthorized - Admin access required', headers, 403);
    }

    const supabase = getSupabaseClient();

    // GET - List all users
    if (httpMethod === 'GET') {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, is_active, last_login, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return errorResponse(error.message, headers, 500);
      }

      return jsonResponse({ success: true, data: users }, headers);
    }

    // POST - Create new user
    if (httpMethod === 'POST') {
      const { email, full_name, role, password, is_active } = JSON.parse(body || '{}');
      
      if (!email || !full_name || !role || !password) {
        return errorResponse(
          'Missing required fields: email, full_name, role, password',
          headers,
          400
        );
      }
      
      // Hash password
      const password_hash = await hashPassword(password);
      
      const { data, error } = await supabase
        .from('users')
        .insert({ 
          email, 
          full_name, 
          role,
          password_hash,
          is_active: is_active !== undefined ? is_active : true
        })
        .select('id, email, full_name, role, is_active, created_at')
        .single();
      
      if (error) {
        console.error('Error creating user:', error);
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ success: true, data }, headers);
    }

    // PUT - Update user
    if (httpMethod === 'PUT') {
      const userId = path.split('/').pop();
      if (!userId || userId === 'admin-users') {
        return errorResponse('User ID required', headers, 400);
      }

      const { email, full_name, role, password, is_active } = JSON.parse(body || '{}');
      
      if (!email || !full_name || !role) {
        return errorResponse(
          'Missing required fields: email, full_name, role',
          headers,
          400
        );
      }
      
      const updateData = { email, full_name, role, is_active };
      
      // Only update password if provided
      if (password && password.trim() !== '') {
        updateData.password_hash = await hashPassword(password);
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select('id, email, full_name, role, is_active, last_login, created_at')
        .single();
      
      if (error) {
        console.error('Error updating user:', error);
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ success: true, data }, headers);
    }

    // DELETE - Delete user
    if (httpMethod === 'DELETE') {
      const userId = path.split('/').pop();
      if (!userId || userId === 'admin-users') {
        return errorResponse('User ID required', headers, 400);
      }
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ 
        success: true, 
        message: 'User deleted successfully' 
      }, headers);
    }

    return errorResponse(`Method ${httpMethod} not supported`, headers, 405);

  } catch (error) {
    console.error('Admin users API error:', error);
    return errorResponse('Internal server error', headers, 500);
  }
};
