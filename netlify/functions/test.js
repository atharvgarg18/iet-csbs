// Simple test function without any dependencies
exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
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
    // Simple debug route
    if (path.includes('/debug') || path.includes('/ping')) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "Simple Netlify function is working!",
          timestamp: new Date().toISOString(),
          path: path,
          method: httpMethod,
          hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        }),
      };
    }

    // Return 404 for other routes for now
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: 'Route not found - but function is working!',
        path: path,
        method: httpMethod
      }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      }),
    };
  }
};