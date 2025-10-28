const { getSupabaseClient } = require('./_shared/supabase');
const {
  generateSessionToken,
  verifyPassword,
  verifySession
} = require('./_shared/auth');
const {
  handleOptions,
  jsonResponse,
  errorResponse
} = require('./_shared/http');

/**
 * Auth API handler - login, logout, session check
 * Routes:
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET /api/auth/check
 * - GET /api/auth/test (debug)
 */
exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;

  // Handle OPTIONS preflight
  if (httpMethod === 'OPTIONS') {
    return handleOptions(headers);
  }

  try {
    const supabase = getSupabaseClient();

    // Test route
    if (httpMethod === 'GET' && path.includes('/test')) {
      return jsonResponse({
        message: "Auth API is working!",
        path: path,
        method: httpMethod
      }, headers);
    }

    // LOGIN - POST /api/auth/login
    if (httpMethod === 'POST' && path.includes('/login')) {
      const { email, password } = JSON.parse(body || '{}');
      
      if (!email || !password) {
        return errorResponse('Email and password are required', headers, 400);
      }

      // Get user by email
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .limit(1);

      if (userError || !users || users.length === 0) {
        return errorResponse('Invalid credentials', headers, 401);
      }

      const user = users[0];
      
      // Verify password
      const passwordValid = await verifyPassword(password, user.password_hash);
      if (!passwordValid) {
        return errorResponse('Invalid credentials', headers, 401);
      }

      // Create session
      const sessionToken = generateSessionToken();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString()
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return errorResponse('Failed to create session', headers, 500);
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Return success with session cookie
      const sessionCookie = `session=${sessionToken}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`;
      
      return {
        statusCode: 200,
        headers: { 
          ...jsonResponse({}, headers).headers,
          'Set-Cookie': sessionCookie
        },
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              full_name: user.full_name,
              role: user.role,
              is_active: user.is_active
            }
          }
        }),
      };
    }

    // CHECK SESSION - GET /api/auth/check
    if (httpMethod === 'GET' && path.includes('/check')) {
      const user = await verifySession(headers.cookie);
      
      if (!user) {
        return errorResponse('Invalid or expired session', headers, 401);
      }

      return jsonResponse({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            is_active: user.is_active
          }
        }
      }, headers);
    }

    // LOGOUT - POST /api/auth/logout
    if (httpMethod === 'POST' && path.includes('/logout')) {
      const cookies = headers.cookie || '';
      const sessionMatch = cookies.match(/session=([^;]+)/);
      
      if (sessionMatch) {
        const sessionToken = sessionMatch[1];
        
        // Delete session
        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }

      // Clear session cookie
      const clearCookie = 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/';
      
      return {
        statusCode: 200,
        headers: { 
          ...jsonResponse({}, headers).headers,
          'Set-Cookie': clearCookie
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Logged out successfully' 
        }),
      };
    }

    return errorResponse('Route not found', headers, 404);

  } catch (error) {
    console.error('Auth API error:', error);
    return errorResponse(
      'Internal server error',
      headers,
      500
    );
  }
};
