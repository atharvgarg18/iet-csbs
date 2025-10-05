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
    // Log all requests for debugging
    console.log('Function called:', {
      method: httpMethod,
      path: path,
      headers: Object.keys(headers),
      body: body ? body.substring(0, 100) : 'no body'
    });
    
    // Parse the path to handle different routes
    // Remove the Netlify function prefix to get the actual API route
    const apiRoute = path.replace('/.netlify/functions/api', '') || '/';
    const pathSegments = apiRoute.split('/').filter(Boolean);
    
    console.log('Parsed route:', { originalPath: path, apiRoute, pathSegments });
    
    // Debug route
    if (httpMethod === 'GET' && apiRoute.includes('/debug')) {
      // Show first few characters of env vars for debugging (safely)
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "API is working on Netlify",
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'production',
          hasSupabaseUrl: !!supabaseUrl,
          hasServiceKey: !!serviceKey,
          supabaseUrlPreview: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing',
          serviceKeyPreview: serviceKey ? serviceKey.substring(0, 20) + '...' : 'missing',
          allEnvKeys: Object.keys(process.env).filter(key => 
            key.includes('SUPABASE') || key.includes('VITE')
          ),
          path: path,
          apiRoute: apiRoute,
          method: httpMethod
        }),
      };
    }

    // Ping route
    if (httpMethod === 'GET' && apiRoute.includes('/ping')) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Hello from Netlify Functions!" }),
      };
    }

    // Auth test route (GET)
    if (httpMethod === 'GET' && apiRoute.includes('/auth/test')) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Auth route redirect is working!",
          path: path,
          method: httpMethod
        }),
      };
    }

    // Login route (with debug logging)
    console.log('Login route check:', httpMethod === 'POST', apiRoute, apiRoute.includes('/auth/login'));
    if (httpMethod === 'POST' && (apiRoute.includes('/auth/login') || apiRoute.includes('auth/login') || apiRoute.endsWith('/login'))) {
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
    if (httpMethod === 'GET' && apiRoute.includes('/auth/check')) {
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

    // User management routes
    if (httpMethod === 'GET' && apiRoute.includes('/admin/users')) {
      // TODO: Add authentication middleware check here
      const supabase = getSupabaseClient();
      
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, is_active, last_login, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: error.message }),
        };
      }

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: users }),
      };
    }

    // Admin routes with actual database operations
    const supabase = getSupabaseClient();

    // GET /admin/batches
    if (httpMethod === 'GET' && apiRoute.includes('/admin/batches')) {
      const { data, error } = await supabase.from('batches').select('*').order('created_at', { ascending: false });
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: data || [] }),
      };
    }

    // POST /admin/batches
    if (httpMethod === 'POST' && apiRoute.includes('/admin/batches')) {
      const { name } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('batches').insert({ name }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: error.message }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data }),
      };
    }

    // GET /admin/sections
    if (httpMethod === 'GET' && apiRoute.includes('/admin/sections')) {
      const { data, error } = await supabase.from('sections').select(`
        *,
        batch:batches(*)
      `).order('created_at', { ascending: false });
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: data || [] }),
      };
    }

    // POST /admin/sections
    if (httpMethod === 'POST' && apiRoute.includes('/admin/sections')) {
      const { batch_id, name } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('sections').insert({ batch_id, name }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: error.message }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data }),
      };
    }

    // GET /admin/notes
    if (httpMethod === 'GET' && apiRoute.includes('/admin/notes')) {
      const { data, error } = await supabase.from('notes').select(`
        *,
        section:sections(*, batch:batches(*))
      `).order('created_at', { ascending: false });
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: data || [] }),
      };
    }

    // POST /admin/notes
    if (httpMethod === 'POST' && apiRoute.includes('/admin/notes')) {
      const { section_id, drive_link, description } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('notes').insert({ section_id, drive_link, description }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: error.message }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data }),
      };
    }

    // GET /admin/papers
    if (httpMethod === 'GET' && apiRoute.includes('/admin/papers')) {
      const { data, error } = await supabase.from('papers').select(`
        *,
        section:sections(*, batch:batches(*))
      `).order('created_at', { ascending: false });
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: data || [] }),
      };
    }

    // POST /admin/papers
    if (httpMethod === 'POST' && apiRoute.includes('/admin/papers')) {
      const { section_id, drive_link, description } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('papers').insert({ section_id, drive_link, description }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: error.message }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data }),
      };
    }

    // GET /admin/gallery-categories
    if (httpMethod === 'GET' && apiRoute.includes('/admin/gallery-categories')) {
      const { data, error } = await supabase.from('gallery_categories').select('*').order('name');
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: data || [] }),
      };
    }

    // POST /admin/gallery-categories
    if (httpMethod === 'POST' && apiRoute.includes('/admin/gallery-categories')) {
      const { name, description } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('gallery_categories').insert({ name, description }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: error.message }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data }),
      };
    }

    // GET /admin/gallery-images
    if (httpMethod === 'GET' && apiRoute.includes('/admin/gallery-images')) {
      const { data, error } = await supabase.from('gallery_images').select(`
        *,
        category:gallery_categories(*)
      `).order('created_at', { ascending: false });
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: data || [] }),
      };
    }

    // POST /admin/gallery-images
    if (httpMethod === 'POST' && apiRoute.includes('/admin/gallery-images')) {
      const { category_id, image_url, title, description } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('gallery_images').insert({ category_id, image_url, title, description }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: error.message }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data }),
      };
    }

    // GET /admin/notice-categories
    if (httpMethod === 'GET' && apiRoute.includes('/admin/notice-categories')) {
      const { data, error } = await supabase.from('notice_categories').select('*').order('name');
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: data || [] }),
      };
    }

    // POST /admin/notice-categories
    if (httpMethod === 'POST' && apiRoute.includes('/admin/notice-categories')) {
      const { name, description } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('notice_categories').insert({ name, description }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: error.message }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data }),
      };
    }

    // GET /admin/notices
    if (httpMethod === 'GET' && apiRoute.includes('/admin/notices')) {
      const { data, error } = await supabase.from('notices').select(`
        *,
        category:notice_categories(*)
      `).order('created_at', { ascending: false });
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: data || [] }),
      };
    }

    // POST /admin/notices
    if (httpMethod === 'POST' && apiRoute.includes('/admin/notices')) {
      const { category_id, title, content, publish_date, is_published } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('notices').insert({ 
        category_id, title, content, publish_date, is_published 
      }).select().single();
      if (error) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: error.message }),
        };
      }
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data }),
      };
    }

    // Logout route
    if (httpMethod === 'POST' && apiRoute.includes('/auth/logout')) {
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

    // Handle unsupported methods with proper error message
    if (['PUT', 'DELETE'].includes(httpMethod)) {
      return {
        statusCode: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: `Method ${httpMethod} not implemented yet for route: ${apiRoute}`,
          route: apiRoute,
          method: httpMethod
        }),
      };
    }

    // Route not found - show detailed debug info
    return {
      statusCode: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: false, 
        message: 'Route not found',
        debug: {
          receivedPath: path,
          receivedMethod: httpMethod,
          pathSegments: pathSegments,
          loginRouteCheck: {
            isPost: httpMethod === 'POST',
            pathIncludesAuth: apiRoute.includes('/auth'),
            pathIncludesLogin: apiRoute.includes('/login'),
            pathIncludesAuthLogin: apiRoute.includes('/auth/login')
          }
        },
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
