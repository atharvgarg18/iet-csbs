const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Helper to create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jcdciqwvtmgtdxsjyyab.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Helper functions
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Main handler
exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Handle preflight OPTIONS requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // Parse the path to handle different routes
    const pathSegments = path.split('/').filter(Boolean);
    
    // Debug route
    if (httpMethod === 'GET' && path.includes('/debug')) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "API is working on Netlify",
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'production',
          hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          path: path,
          method: httpMethod
        }),
      };
    }

    // Ping route
    if (httpMethod === 'GET' && path.includes('/ping')) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Hello from Netlify Functions!" }),
      };
    }

    // Login route
    if (httpMethod === 'POST' && path.includes('/auth/login')) {
      const { email, password } = JSON.parse(body || '{}');
      
      if (!email || !password) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Email and password are required' }),
        };
      }

      const supabase = getSupabaseClient();
      
      // Get user by email
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .limit(1);

      if (userError || !users || users.length === 0) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
        };
      }

      const user = users[0];
      
      // Verify password
      const passwordValid = await verifyPassword(password, user.password_hash);
      if (!passwordValid) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
        };
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
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Failed to create session' }),
        };
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      // Return success with session cookie
      const sessionCookie = `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`;
      
      return {
        statusCode: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
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

    // Auth check route
    if (httpMethod === 'GET' && path.includes('/auth/check')) {
      const cookies = headers.cookie || '';
      const sessionMatch = cookies.match(/session=([^;]+)/);
      
      if (!sessionMatch) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'No session found' }),
        };
      }

      const sessionToken = sessionMatch[1];
      const supabase = getSupabaseClient();

      // Check session
      const { data: sessions, error: sessionError } = await supabase
        .from('user_sessions')
        .select(`
          *,
          users (*)
        `)
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .limit(1);

      if (sessionError || !sessions || sessions.length === 0) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Invalid or expired session' }),
        };
      }

      const session = sessions[0];
      const user = session.users;

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

    // Logout route
    if (httpMethod === 'POST' && path.includes('/auth/logout')) {
      const cookies = headers.cookie || '';
      const sessionMatch = cookies.match(/session=([^;]+)/);
      
      if (sessionMatch) {
        const sessionToken = sessionMatch[1];
        const supabase = getSupabaseClient();
        
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
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Set-Cookie': clearCookie
        },
        body: JSON.stringify({ success: true, message: 'Logged out successfully' }),
      };
    }

    // Route not found
    return {
      statusCode: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        message: 'Route not found',
        path: path,
        method: httpMethod,
        availableRoutes: [
          'GET /api/ping',
          'GET /api/debug',
          'POST /api/auth/login',
          'GET /api/auth/check',
          'POST /api/auth/logout'
        ]
      }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      }),
    };
  }
};
