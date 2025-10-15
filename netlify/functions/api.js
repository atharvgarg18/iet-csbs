const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Helper to create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jcdciqwvtmgtdxsjyyab.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Supabase config check:', {
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing'
  });
  
  if (!supabaseServiceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  try {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw error;
  }
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

// Authentication helper
async function verifySession(cookies) {
  console.log('verifySession called with cookies:', cookies);
  
  if (!cookies) {
    console.log('No cookies provided');
    return null;
  }
  
  const sessionMatch = cookies.match(/session=([^;]+)/);
  if (!sessionMatch) {
    console.log('No session cookie found in:', cookies);
    return null;
  }
  
  const sessionToken = sessionMatch[1];
  console.log('Found session token:', sessionToken.substring(0, 10) + '...');
  console.log('About to query user_sessions table');
  
  const supabase = getSupabaseClient();
  
  // First get the session
  const { data: sessions, error: sessionError } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .gte('expires_at', new Date().toISOString())
    .limit(1);

  if (sessionError) {
    console.log('Session query error:', sessionError);
    return null;
  }

  if (!sessions || sessions.length === 0) {
    console.log('No valid sessions found for token');
    return null;
  }

  // Then get the user separately
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', sessions[0].user_id)
    .limit(1);

  const error = userError;

  if (error) {
    console.log('User query error:', error);
    console.log('Error details:', JSON.stringify(error, null, 2));
    return null;
  }
  
  if (!users || users.length === 0) {
    console.log('No user found for session');
    return null;
  }

  const user = users[0];
  console.log('Session verified for user:', user.email, 'role:', user.role);
  return user;
}

// Authorization helpers
function requireAuth(user) {
  return user && user.is_active;
}

function requireAdmin(user) {
  return user && user.is_active && user.role === 'admin';
}

function requireEditor(user) {
  return user && user.is_active && (user.role === 'admin' || user.role === 'editor');
}

// Main handler
exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;
  
  // Set CORS headers - must specify exact origin when using credentials
  const origin = headers.origin || headers.referer || 'https://ietcsbs.tech';
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
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
    
    // Comprehensive debug endpoint (check FIRST before general debug)
    if (httpMethod === 'GET' && apiRoute.includes('/debug-auth')) {
      const cookies = headers.cookie;
      const sessionMatch = cookies ? cookies.match(/session=([^;]+)/) : null;
      
      let debugInfo = {
        step1_cookies: {
          hasCookies: !!cookies,
          cookieValue: cookies || 'none',
          hasSessionToken: !!sessionMatch,
          sessionToken: sessionMatch ? sessionMatch[1].substring(0, 20) + '...' : 'none'
        },
        step2_headers: {
          allHeaders: Object.keys(headers),
          origin: headers.origin,
          referer: headers.referer,
          userAgent: headers['user-agent']
        }
      };

      if (sessionMatch) {
        try {
          const supabase = getSupabaseClient();
          const sessionToken = sessionMatch[1];
          
          // Test session query
          const { data: sessions, error: sessionError } = await supabase
            .from('user_sessions')
            .select('*')
            .eq('session_token', sessionToken)
            .gte('expires_at', new Date().toISOString())
            .limit(1);

          debugInfo.step3_sessionQuery = {
            hasError: !!sessionError,
            error: sessionError?.message || 'none',
            sessionCount: sessions?.length || 0,
            sessionData: sessions?.[0] ? {
              user_id: sessions[0].user_id,
              expires_at: sessions[0].expires_at,
              is_active: sessions[0].is_active
            } : 'none'
          };

          if (sessions && sessions.length > 0) {
            // Test user query
            const { data: users, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', sessions[0].user_id)
              .limit(1);

            debugInfo.step4_userQuery = {
              hasError: !!userError,
              error: userError?.message || 'none',
              userCount: users?.length || 0,
              userData: users?.[0] ? {
                id: users[0].id,
                email: users[0].email,
                role: users[0].role,
                is_active: users[0].is_active
              } : 'none'
            };
          }
        } catch (error) {
          debugInfo.step3_error = {
            message: error.message,
            stack: error.stack
          };
        }
      }
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(debugInfo, null, 2),
      };
    }
    
    // General debug route
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
      const sessionCookie = `session=${sessionToken}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`;
      
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
        .select('*')
        .eq('session_token', sessionToken)
        .gte('expires_at', new Date().toISOString())
        .limit(1);

      if (sessionError || !sessions || sessions.length === 0) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Invalid or expired session' }),
        };
      }

      // Get user separately
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessions[0].user_id)
        .limit(1);

      if (userError || !users || users.length === 0) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'User not found' }),
        };
      }

      const user = users[0];

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

    // Authentication check for all admin and dashboard routes
    if (apiRoute.startsWith('/admin/') || apiRoute.includes('/dashboard/')) {
      console.log('Auth check triggered for route:', apiRoute);
      console.log('Headers cookie:', headers.cookie ? 'present' : 'missing');
      
      const user = await verifySession(headers.cookie);
      console.log('User from verifySession:', user ? `${user.email} (${user.role})` : 'null');
      
      if (!user || !user.is_active) {
        console.log('Authentication failed - user:', !!user, 'active:', user?.is_active);
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            success: false, 
            message: 'Authentication required',
            debug: {
              hasUser: !!user,
              isActive: user?.is_active,
              route: apiRoute,
              hasCookie: !!headers.cookie
            }
          }),
        };
      }
      
      // Admin-only routes
      if ((apiRoute.includes('/admin/users') || 
           apiRoute.includes('/admin/batches') ||
           apiRoute.includes('/admin/sections') ||
           apiRoute.includes('/admin/gallery-categories') ||
           apiRoute.includes('/admin/notice-categories')) && 
          user.role !== 'admin') {
        return {
          statusCode: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Admin access required' }),
        };
      }

      // Editor+ routes (admin and editor)
      if ((apiRoute.includes('/admin/notes') ||
           apiRoute.includes('/admin/papers') ||
           apiRoute.includes('/admin/gallery-images') ||
           apiRoute.includes('/admin/notices')) &&
          !['admin', 'editor'].includes(user.role)) {
        return {
          statusCode: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Editor access required' }),
        };
      }

      // Store authenticated user for use in route handlers
      event.user = user;
    }

    // Admin routes with actual database operations
    const supabase = getSupabaseClient();

    // GET /admin/users
    if (httpMethod === 'GET' && apiRoute.includes('/admin/users')) {
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

    // POST /admin/users
    if (httpMethod === 'POST' && apiRoute.includes('/admin/users')) {
      try {
        const { email, full_name, role, password, is_active } = JSON.parse(body || '{}');
        
        console.log('Creating user with data:', { email, full_name, role, hasPassword: !!password, is_active });
        
        // Validate required fields
        if (!email || !full_name || !role || !password) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              success: false, 
              error: 'Missing required fields: email, full_name, role, password' 
            }),
          };
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');
        
        const { data, error } = await supabase.from('users').insert({ 
          email, 
          full_name, 
          role: role, // Don't default to 'student', use the provided role
          password_hash: hashedPassword,
          is_active: is_active !== undefined ? is_active : true
        }).select('id, email, full_name, role, is_active, created_at').single();
        
        if (error) {
          console.error('Supabase error creating user:', error);
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: error.message }),
          };
        }
        
        console.log('User created successfully:', data);
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, data }),
        };
      } catch (err) {
        console.error('Error in POST /admin/users:', err);
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: err.message }),
        };
      }
    }

    // PUT /admin/users/:id
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/users/')) {
      try {
        const userId = apiRoute.split('/admin/users/')[1];
        const { email, full_name, role, password, is_active } = JSON.parse(body || '{}');
        
        console.log('Updating user:', userId, 'with data:', { email, full_name, role, hasPassword: !!password, is_active });
        
        // Validate required fields
        if (!email || !full_name || !role) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              success: false, 
              error: 'Missing required fields: email, full_name, role' 
            }),
          };
        }
        
        const updateData = { email, full_name, role, is_active };
        
        // Only hash and update password if provided
        if (password && password.trim() !== '') {
          updateData.password_hash = await bcrypt.hash(password, 10);
          console.log('Password updated for user');
        }
        
        const { data, error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', userId)
          .select('id, email, full_name, role, is_active, last_login, created_at')
          .single();
        
        if (error) {
          console.error('Supabase error updating user:', error);
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: error.message }),
          };
        }
        
        console.log('User updated successfully:', data);
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, data }),
        };
      } catch (err) {
        console.error('Error in PUT /admin/users:', err);
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: err.message }),
        };
      }
    }

    // DELETE /admin/users/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/users/')) {
      try {
        const userId = apiRoute.split('/admin/users/')[1];
        console.log('Deleting user:', userId);
        
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (error) {
          console.error('Supabase error deleting user:', error);
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: error.message }),
          };
        }
        
        console.log('User deleted successfully');
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, message: 'User deleted successfully' }),
        };
      } catch (err) {
        console.error('Error in DELETE /admin/users:', err);
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: err.message }),
        };
      }
    }

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

    // PUT /admin/batches/:id
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/batches/')) {
      const batchId = apiRoute.split('/admin/batches/')[1];
      const { name, is_active } = JSON.parse(body || '{}');
      const { data, error } = await supabase
        .from('batches')
        .update({ name, is_active })
        .eq('id', batchId)
        .select()
        .single();
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

    // DELETE /admin/batches/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/batches/')) {
      const batchId = apiRoute.split('/admin/batches/')[1];
      const { error } = await supabase.from('batches').delete().eq('id', batchId);
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
        body: JSON.stringify({ success: true, message: 'Batch deleted successfully' }),
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

    // PUT /admin/sections/:id
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/sections/')) {
      const sectionId = apiRoute.split('/admin/sections/')[1];
      const { batch_id, name } = JSON.parse(body || '{}');
      const { data, error } = await supabase
        .from('sections')
        .update({ batch_id, name })
        .eq('id', sectionId)
        .select()
        .single();
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

    // DELETE /admin/sections/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/sections/')) {
      const sectionId = apiRoute.split('/admin/sections/')[1];
      const { error } = await supabase.from('sections').delete().eq('id', sectionId);
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
        body: JSON.stringify({ success: true, message: 'Section deleted successfully' }),
      };
    }

    // GET /dashboard/stats - Management dashboard statistics
    if (httpMethod === 'GET' && apiRoute.includes('/dashboard/stats')) {
      const user = await verifySession(headers.cookie);
      if (!user) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: 'Authentication required' }),
        };
      }

      if (!['admin', 'editor', 'viewer'].includes(user.role)) {
        return {
          statusCode: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: 'Access denied' }),
        };
      }

      try {
        const supabase = getSupabaseClient();
        
        // Get basic counts
        const [
          batchesResult,
          sectionsResult,
          notesResult,
          papersResult,
          galleryImagesResult,
          noticesResult,
          usersResult
        ] = await Promise.all([
          supabase.from('batches').select('id', { count: 'exact', head: true }),
          supabase.from('sections').select('id', { count: 'exact', head: true }),
          supabase.from('notes').select('id', { count: 'exact', head: true }),
          supabase.from('papers').select('id', { count: 'exact', head: true }),
          supabase.from('gallery_images').select('id', { count: 'exact', head: true }),
          supabase.from('notices').select('id', { count: 'exact', head: true }),
          supabase.from('users').select('id', { count: 'exact', head: true })
        ]);

        // Get user statistics (admin only)
        let userStats = null;
        if (user.role === 'admin') {
          const { data: userData } = await supabase
            .from('users')
            .select('role, is_active');
          
          if (userData) {
            userStats = {
              active_users: userData.filter(u => u.is_active).length,
              admin_count: userData.filter(u => u.role === 'admin').length,
              editor_count: userData.filter(u => u.role === 'editor').length,
              viewer_count: userData.filter(u => u.role === 'viewer').length
            };
          }
        }

        // Get recent activity (simplified version)
        const recentActivity = [];
        try {
          // Get recent notes
          const { data: recentNotes } = await supabase
            .from('notes')
            .select(`
              id, created_at, description,
              sections!inner(name),
              users!inner(full_name)
            `)
            .order('created_at', { ascending: false })
            .limit(3);

          if (recentNotes) {
            recentNotes.forEach(note => {
              recentActivity.push({
                type: 'create',
                description: `Added note: ${note.description || 'Untitled'} in ${note.sections.name}`,
                timestamp: note.created_at,
                user_name: note.users?.full_name || 'Unknown'
              });
            });
          }

          // Get recent papers
          const { data: recentPapers } = await supabase
            .from('papers')
            .select(`
              id, created_at, description,
              sections!inner(name),
              users!inner(full_name)
            `)
            .order('created_at', { ascending: false })
            .limit(2);

          if (recentPapers) {
            recentPapers.forEach(paper => {
              recentActivity.push({
                type: 'create',
                description: `Added paper: ${paper.description || 'Untitled'} in ${paper.sections.name}`,
                timestamp: paper.created_at,
                user_name: paper.users?.full_name || 'Unknown'
              });
            });
          }
        } catch (activityError) {
          console.error('Error fetching recent activity:', activityError);
        }

        // Sort activity by timestamp
        recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const stats = {
          batches: batchesResult.count || 0,
          sections: sectionsResult.count || 0,
          notes: notesResult.count || 0,
          papers: papersResult.count || 0,
          gallery_images: galleryImagesResult.count || 0,
          notices: noticesResult.count || 0,
          users: usersResult.count || 0,
          recent_activity: recentActivity.slice(0, 5),
          user_stats: userStats
        };

        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify(stats),
        };

      } catch (error) {
        console.error('Dashboard stats error:', error);
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: 'Failed to fetch dashboard statistics' }),
        };
      }
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

    // PUT /admin/notes/:id
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/notes/')) {
      const noteId = apiRoute.split('/admin/notes/')[1];
      const { section_id, drive_link, description } = JSON.parse(body || '{}');
      const { data, error } = await supabase
        .from('notes')
        .update({ section_id, drive_link, description })
        .eq('id', noteId)
        .select()
        .single();
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

    // DELETE /admin/notes/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/notes/')) {
      const noteId = apiRoute.split('/admin/notes/')[1];
      const { error } = await supabase.from('notes').delete().eq('id', noteId);
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
        body: JSON.stringify({ success: true, message: 'Note deleted successfully' }),
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

    // PUT /admin/papers/:id
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/papers/')) {
      const paperId = apiRoute.split('/admin/papers/')[1];
      const { section_id, drive_link, description } = JSON.parse(body || '{}');
      const { data, error } = await supabase
        .from('papers')
        .update({ section_id, drive_link, description })
        .eq('id', paperId)
        .select()
        .single();
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

    // DELETE /admin/papers/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/papers/')) {
      const paperId = apiRoute.split('/admin/papers/')[1];
      const { error } = await supabase.from('papers').delete().eq('id', paperId);
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
        body: JSON.stringify({ success: true, message: 'Paper deleted successfully' }),
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
      const { name, color, is_active } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('gallery_categories').insert({ 
        name, 
        color: color || '#3b82f6', 
        is_active: is_active !== undefined ? is_active : true 
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

    // PUT /admin/gallery-categories/:id  
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/gallery-categories/')) {
      const categoryId = apiRoute.split('/admin/gallery-categories/')[1];
      const { name, color, is_active } = JSON.parse(body || '{}');
      const { data, error } = await supabase
        .from('gallery_categories')
        .update({ name, color, is_active })
        .eq('id', categoryId)
        .select()
        .single();
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

    // DELETE /admin/gallery-categories/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/gallery-categories/')) {
      const categoryId = apiRoute.split('/admin/gallery-categories/')[1];
      const { error } = await supabase.from('gallery_categories').delete().eq('id', categoryId);
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
        body: JSON.stringify({ success: true, message: 'Gallery category deleted successfully' }),
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
      const { category_id, image_url, title } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('gallery_images').insert({ category_id, image_url, title }).select().single();
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

    // PUT /admin/gallery-images/:id
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/gallery-images/')) {
      const imageId = apiRoute.split('/admin/gallery-images/')[1];
      const { category_id, image_url, title } = JSON.parse(body || '{}');
      const { data, error } = await supabase
        .from('gallery_images')
        .update({ category_id, image_url, title })
        .eq('id', imageId)
        .select()
        .single();
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

    // DELETE /admin/gallery-images/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/gallery-images/')) {
      const imageId = apiRoute.split('/admin/gallery-images/')[1];
      const { error } = await supabase.from('gallery_images').delete().eq('id', imageId);
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
        body: JSON.stringify({ success: true, message: 'Gallery image deleted successfully' }),
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
      const { name, description, color, is_active } = JSON.parse(body || '{}');
      const { data, error } = await supabase.from('notice_categories').insert({ 
        name, 
        description, 
        color: color || '#3b82f6', 
        is_active: is_active !== undefined ? is_active : true 
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

    // PUT /admin/notice-categories/:id
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/notice-categories/')) {
      const categoryId = apiRoute.split('/admin/notice-categories/')[1];
      const { name, description, color, is_active } = JSON.parse(body || '{}');
      const { data, error } = await supabase
        .from('notice_categories')
        .update({ name, description, color, is_active })
        .eq('id', categoryId)
        .select()
        .single();
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

    // DELETE /admin/notice-categories/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/notice-categories/')) {
      const categoryId = apiRoute.split('/admin/notice-categories/')[1];
      const { error } = await supabase.from('notice_categories').delete().eq('id', categoryId);
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
        body: JSON.stringify({ success: true, message: 'Notice category deleted successfully' }),
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

    // PUT /admin/notices/:id
    if (httpMethod === 'PUT' && apiRoute.includes('/admin/notices/')) {
      const noticeId = apiRoute.split('/admin/notices/')[1];
      const { category_id, title, content, publish_date, is_published } = JSON.parse(body || '{}');
      const { data, error } = await supabase
        .from('notices')
        .update({ category_id, title, content, publish_date, is_published })
        .eq('id', noticeId)
        .select()
        .single();
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

    // DELETE /admin/notices/:id
    if (httpMethod === 'DELETE' && apiRoute.includes('/admin/notices/')) {
      const noticeId = apiRoute.split('/admin/notices/')[1];
      const { error } = await supabase.from('notices').delete().eq('id', noticeId);
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
        body: JSON.stringify({ success: true, message: 'Notice deleted successfully' }),
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

    // Handle other unsupported methods
    if (['PATCH', 'HEAD'].includes(httpMethod)) {
      return {
        statusCode: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          message: `Method ${httpMethod} not supported`,
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
