// Minimal API function to test authentication without external dependencies
exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;
  
  // Simple CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://ietcsbs.tech',
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
    // Parse the path
    const apiRoute = path.replace('/.netlify/functions/minimal-api', '') || '/';
    
    // Simple ping route
    if (httpMethod === 'GET' && apiRoute.includes('/ping')) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: "Minimal API is working!",
          timestamp: new Date().toISOString(),
          route: apiRoute
        }),
      };
    }

    // Simple login simulation (just return success)
    if (httpMethod === 'POST' && apiRoute.includes('/auth/login')) {
      const { email, password } = JSON.parse(body || '{}');
      
      if (email === 'admin@example.com' && password === 'test123') {
        // Create a simple session cookie
        const sessionCookie = `session=test-session-token; HttpOnly; Secure; SameSite=None; Max-Age=86400; Path=/`;
        
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
                id: '1',
                email: 'admin@example.com',
                full_name: 'Test Admin',
                role: 'admin',
                is_active: true
              }
            }
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
        };
      }
    }

    // Auth check simulation
    if (httpMethod === 'GET' && apiRoute.includes('/auth/check')) {
      const cookies = headers.cookie || '';
      const hasSession = cookies.includes('session=test-session-token');
      
      if (hasSession) {
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            success: true,
            data: {
              user: {
                id: '1',
                email: 'admin@example.com',
                full_name: 'Test Admin',
                role: 'admin',
                is_active: true
              }
            }
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'No session found' }),
        };
      }
    }

    // Dashboard stats simulation
    if (httpMethod === 'GET' && apiRoute.includes('/dashboard/stats')) {
      const cookies = headers.cookie || '';
      const hasSession = cookies.includes('session=test-session-token');
      
      if (!hasSession) {
        return {
          statusCode: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: false, message: 'Authentication required' }),
        };
      }
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          batches: 5,
          sections: 12,
          notes: 45,
          papers: 32,
          gallery_images: 28,
          notices: 15,
          users: 8
        }),
      };
    }

    // Default response
    return {
      statusCode: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Route not found', 
        route: apiRoute,
        method: httpMethod 
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Internal server error', 
        error: error.message 
      }),
    };
  }
};