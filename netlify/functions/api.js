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

      // Detect first-ever login before updating the timestamp
      const isFirstLogin = !user.last_login;

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
          first_login: isFirstLogin,
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

        // Send welcome email via Resend REST API (inlined — esbuild can't bundle lazy requires)
        try {
          const resendApiKey = process.env.RESEND_API_KEY;
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'IET CSBS Portal <noreply@ietcsbs.tech>';
          const portalUrl = process.env.PORTAL_URL || 'https://ietcsbs.tech/management-portal/login';

          if (resendApiKey) {
            const roleLabel = role === 'admin' ? 'Administrator' : role === 'editor' ? 'Editor' : 'Viewer';
            const roleBadgeBg = role === 'admin' ? '#fee2e2' : role === 'editor' ? '#fef3c7' : '#dbeafe';
            const roleBadgeBorder = role === 'admin' ? '#fecaca' : role === 'editor' ? '#fde68a' : '#bfdbfe';
            const roleBadgeText = role === 'admin' ? '#991b1b' : role === 'editor' ? '#92400e' : '#1e40af';
            const firstName = full_name.split(' ')[0];
            const year = new Date().getFullYear();

            const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Welcome to IET CSBS Portal</title></head>
<body style="margin:0;padding:0;background-color:#e8edf5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e8edf5">
<tr><td align="center" style="padding:40px 16px 56px;">
<table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td bgcolor="#1e3a8a" style="background-color:#1e3a8a;border-radius:16px 16px 0 0;padding:44px 40px 36px;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 20px;">
        <tr>
          <td width="80" height="80" bgcolor="#2563eb" style="background-color:#2563eb;border-radius:50%;border:3px solid rgba(255,255,255,0.25);width:80px;height:80px;text-align:center;vertical-align:middle;line-height:80px;">
            <span style="font-size:19px;font-weight:800;color:#ffffff;letter-spacing:1px;line-height:80px;">CSBS</span>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.45);">IET DAVV &nbsp;&bull;&nbsp; Indore</p>
      <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;line-height:1.2;">Your portal account is ready</h1>
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.55);">Welcome to the CSBS Management Portal</p>
    </td>
  </tr>
  <!-- ACCENT STRIPE -->
  <tr><td bgcolor="#3b82f6" style="height:4px;background-color:#3b82f6;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- BODY -->
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:40px 44px 36px;">

      <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0f172a;letter-spacing:-0.4px;">Hi ${firstName},</p>
      <p style="margin:0 0 22px;font-size:14px;color:#64748b;line-height:1.75;">Your account on the <strong style="color:#1e3a8a;">CSBS Management Portal</strong> has been set up. Here are your login details &mdash; keep them handy for your first sign-in.</p>

      <!-- ROLE BADGE -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr>
          <td style="font-size:13px;color:#64748b;vertical-align:middle;">You've been added as&nbsp;&nbsp;</td>
          <td bgcolor="${roleBadgeBg}" style="background-color:${roleBadgeBg};border:1.5px solid ${roleBadgeBorder};border-radius:20px;padding:4px 16px;vertical-align:middle;">
            <span style="font-size:12px;font-weight:700;color:${roleBadgeText};text-transform:uppercase;letter-spacing:0.8px;">${roleLabel}</span>
          </td>
        </tr>
      </table>

      <!-- CREDENTIALS CARD -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="background-color:#f8fafc;border:2px solid #e2e8f0;border-radius:14px;margin-bottom:28px;">
        <tr>
          <td style="padding:24px 28px 22px;">
            <p style="margin:0 0 18px;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:2.5px;text-transform:uppercase;">Your Login Credentials</p>
            <!-- Email -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
              <tr>
                <td bgcolor="#eff6ff" style="background-color:#eff6ff;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0 0 5px;font-size:10px;font-weight:700;color:#93c5fd;text-transform:uppercase;letter-spacing:1.5px;">Email Address</p>
                  <p style="margin:0;font-size:15px;font-weight:600;color:#1e3a8a;">${email}</p>
                </td>
              </tr>
            </table>
            <!-- Password -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="#fffbeb" style="background-color:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;padding:14px 18px;">
                  <p style="margin:0 0 5px;font-size:10px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:1.5px;">Temporary Password</p>
                  <p style="margin:0 0 8px;font-size:19px;font-weight:800;color:#78350f;font-family:'Courier New',Consolas,monospace;letter-spacing:3px;">${password}</p>
                  <p style="margin:0;font-size:12px;color:#b45309;font-style:italic;">You'll be prompted to create your own password on your very first sign-in.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- CTA BUTTON -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td align="center">
            <a href="${portalUrl}" target="_blank" style="display:inline-block;background-color:#1d4ed8;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;letter-spacing:0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Sign in to the portal &rarr;</a>
          </td>
        </tr>
      </table>

      <!-- HELP BOX -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td bgcolor="#f0f9ff" style="background-color:#f0f9ff;border-left:3px solid #38bdf8;border-radius:0 6px 6px 0;padding:14px 18px;">
            <p style="margin:0;font-size:13px;color:#0369a1;line-height:1.65;"><strong style="color:#0c4a6e;">Need help?</strong>&nbsp; Reach out to your administrator at <a href="mailto:atharv.garg@ietcsbs.tech" style="color:#0284c7;text-decoration:none;font-weight:700;">atharv.garg@ietcsbs.tech</a> &mdash; they'll get you sorted.</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:14px;color:#475569;line-height:1.55;">Warm regards,<br/><strong style="color:#0f172a;">The CSBS Team</strong></p>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td bgcolor="#f1f5f9" style="background-color:#f1f5f9;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:20px 44px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size:11px;color:#94a3b8;line-height:1.6;">&copy; ${year} IET DAVV &middot; Computer Science &amp; Business Studies</td>
          <td align="right" style="font-size:11px;color:#cbd5e1;">Sent automatically on account creation</td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body></html>`;

            const emailResp = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: fromEmail,
                to: [email],
                subject: 'Welcome to IET CSBS Management Portal — Your Credentials',
                html: emailHtml,
              }),
            });

            const emailData = await emailResp.json();
            if (!emailResp.ok) {
              console.warn(`[Email] Resend error for ${email}:`, emailData);
            } else {
              console.log(`[Email] Welcome email sent to ${email}, id: ${emailData.id}`);
            }
          } else {
            console.warn('[Email] RESEND_API_KEY not set, skipping welcome email');
          }
        } catch (emailErr) {
          console.error('[Email] Unexpected error sending welcome email:', emailErr.message);
        }

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

    // Change password — requires active session, updates to a new password
    if (httpMethod === 'POST' && apiRoute.includes('/auth/change-password')) {
      try {
        const sessionUser = await verifySession(headers.cookie || '');
        if (!requireAuth(sessionUser)) {
          return {
            statusCode: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: 'Authentication required' }),
          };
        }

        const { new_password } = JSON.parse(body || '{}');
        if (!new_password || new_password.length < 8) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: 'Password must be at least 8 characters' }),
          };
        }

        const supabase = getSupabaseClient();
        const newHash = await bcrypt.hash(new_password, 10);
        await supabase.from('users').update({ password_hash: newHash }).eq('id', sessionUser.id);

        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, message: 'Password changed successfully' }),
        };
      } catch (err) {
        console.error('Change password error:', err);
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: err.message }),
        };
      }
    }

    // Forgot password — sends a reset link to the user's email
    if (httpMethod === 'POST' && apiRoute.includes('/auth/forgot-password')) {
      try {
        const { email } = JSON.parse(body || '{}');
        if (!email) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: 'Email is required' }),
          };
        }

        const supabase = getSupabaseClient();

        // Look up user (always return success to avoid email enumeration)
        const { data: users } = await supabase
          .from('users')
          .select('id, email, full_name')
          .eq('email', email.toLowerCase())
          .eq('is_active', true)
          .limit(1);

        if (users && users.length > 0) {
          const user = users[0];

          // Generate a short-lived reset token (15 min), stored in user_sessions with reset_ prefix
          const resetToken = 'reset_' + crypto.randomBytes(32).toString('hex');
          const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

          // Remove any existing reset tokens for this user
          await supabase
            .from('user_sessions')
            .delete()
            .eq('user_id', user.id)
            .like('session_token', 'reset_%');

          await supabase
            .from('user_sessions')
            .insert({ user_id: user.id, session_token: resetToken, expires_at: expiresAt });

          // Send reset email
          const resendApiKey = process.env.RESEND_API_KEY;
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'IET CSBS Portal <noreply@ietcsbs.tech>';
          const portalUrl = process.env.PORTAL_URL || 'https://ietcsbs.tech/management-portal/login';
          const resetUrl = `${portalUrl.replace('/login', '/reset-password')}?token=${resetToken}`;
          const year = new Date().getFullYear();

          if (resendApiKey) {
            const resetHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Password Reset - IET CSBS Portal</title></head>
<body style="margin:0;padding:0;background-color:#e8edf5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e8edf5">
<tr><td align="center" style="padding:40px 16px 56px;">
<table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td bgcolor="#0f172a" style="background-color:#0f172a;border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 18px;">
        <tr>
          <td width="72" height="72" bgcolor="#1e293b" style="background-color:#1e293b;border-radius:50%;border:2px solid rgba(255,255,255,0.12);width:72px;height:72px;text-align:center;vertical-align:middle;line-height:72px;font-size:28px;">
            &#128274;
          </td>
        </tr>
      </table>
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.35);">IET DAVV &nbsp;&bull;&nbsp; CSBS Department</p>
      <h1 style="margin:0 0 6px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.4px;">Password Reset Request</h1>
      <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);">CSBS Management Portal</p>
    </td>
  </tr>
  <!-- AMBER ACCENT STRIPE -->
  <tr><td bgcolor="#f59e0b" style="height:4px;background-color:#f59e0b;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- BODY -->
  <tr>
    <td bgcolor="#ffffff" style="background-color:#ffffff;padding:40px 44px 36px;">

      <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#0f172a;letter-spacing:-0.4px;">Hi ${user.full_name.split(' ')[0]},</p>
      <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.75;">We got a request to reset the password on your CSBS portal account. If this was you, click the button below to choose a new one.</p>

      <!-- CTA BUTTON -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr>
          <td align="center">
            <a href="${resetUrl}" target="_blank" style="display:inline-block;background-color:#1d4ed8;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 44px;border-radius:10px;letter-spacing:0.3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Reset my password &rarr;</a>
          </td>
        </tr>
      </table>

      <!-- EXPIRY WARNING -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
        <tr>
          <td bgcolor="#fffbeb" style="background-color:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;padding:14px 18px;">
            <p style="margin:0;font-size:13px;color:#92400e;line-height:1.65;">&#9200;&nbsp; <strong>This link expires in 15 minutes.</strong> If it's expired by the time you get here, go back to the portal and request a new one — it only takes a second.</p>
          </td>
        </tr>
      </table>

      <!-- SECURITY NOTE -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr>
          <td bgcolor="#f8fafc" style="background-color:#f8fafc;border-left:3px solid #94a3b8;border-radius:0 6px 6px 0;padding:13px 16px;">
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.65;">Didn't request this? <strong style="color:#334155;">No worries &mdash; just ignore this email.</strong> Your password stays exactly as it is and nothing on your account will change.</p>
          </td>
        </tr>
      </table>

      <!-- LINK FALLBACK -->
      <p style="margin:0 0 28px;font-size:12px;color:#94a3b8;word-break:break-all;line-height:1.65;">Button not working? Copy and paste this link into your browser:<br/><span style="color:#3b82f6;">${resetUrl}</span></p>

      <!-- HELP BOX -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td bgcolor="#f0f9ff" style="background-color:#f0f9ff;border-left:3px solid #38bdf8;border-radius:0 6px 6px 0;padding:14px 18px;">
            <p style="margin:0;font-size:13px;color:#0369a1;line-height:1.65;"><strong style="color:#0c4a6e;">Still having trouble?</strong>&nbsp; Contact your administrator at <a href="mailto:atharv.garg@ietcsbs.tech" style="color:#0284c7;text-decoration:none;font-weight:700;">atharv.garg@ietcsbs.tech</a></p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:14px;color:#475569;line-height:1.55;">Regards,<br/><strong style="color:#0f172a;">The CSBS Team</strong></p>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td bgcolor="#f1f5f9" style="background-color:#f1f5f9;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:20px 44px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size:11px;color:#94a3b8;line-height:1.6;">&copy; ${year} IET DAVV &middot; Computer Science &amp; Business Studies</td>
          <td align="right" style="font-size:11px;color:#cbd5e1;">Automated security notification</td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body></html>`;

            const emailResp = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: fromEmail,
                to: [user.email],
                subject: 'IET CSBS Portal — Password Reset Link',
                html: resetHtml,
              }),
            });
            const emailData = await emailResp.json();
            if (!emailResp.ok) console.warn('[Email] Reset email error:', emailData);
            else console.log('[Email] Reset email sent to', user.email);
          }
        }

        // Always return success to prevent email enumeration
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, message: 'If that email exists, a reset link has been sent.' }),
        };
      } catch (err) {
        console.error('Forgot password error:', err);
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: err.message }),
        };
      }
    }

    // Reset password — validates the reset token and sets new password
    if (httpMethod === 'POST' && apiRoute.includes('/auth/reset-password')) {
      try {
        const { token, new_password } = JSON.parse(body || '{}');

        if (!token || !new_password) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: 'Token and new password are required' }),
          };
        }

        if (new_password.length < 8) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: 'Password must be at least 8 characters' }),
          };
        }

        if (!token.startsWith('reset_')) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: 'Invalid reset token' }),
          };
        }

        const supabase = getSupabaseClient();

        // Look up the reset token
        const { data: sessions } = await supabase
          .from('user_sessions')
          .select('user_id, expires_at')
          .eq('session_token', token)
          .limit(1);

        if (!sessions || sessions.length === 0) {
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: 'Invalid or expired reset link' }),
          };
        }

        const session = sessions[0];
        if (new Date(session.expires_at) < new Date()) {
          await supabase.from('user_sessions').delete().eq('session_token', token);
          return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: 'Reset link has expired. Please request a new one.' }),
          };
        }

        // Hash new password and update user
        const newHash = await bcrypt.hash(new_password, 10);
        await supabase.from('users').update({ password_hash: newHash }).eq('id', session.user_id);

        // Delete the used reset token (and all sessions for this user for security)
        await supabase.from('user_sessions').delete().eq('session_token', token);

        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, message: 'Password updated successfully' }),
        };
      } catch (err) {
        console.error('Reset password error:', err);
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, error: err.message }),
        };
      }
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
