const { handleOptions, jsonResponse } = require('./_shared/http');

/**
 * Debug and health check endpoint
 * Routes:
 * - GET /api/ping - Simple health check
 * - GET /api/debug - Environment debug info
 */
exports.handler = async (event, context) => {
  const { httpMethod, path, headers } = event;

  if (httpMethod === 'OPTIONS') {
    return handleOptions(headers);
  }

  if (httpMethod === 'GET' && path.includes('/ping')) {
    return jsonResponse({ 
      message: "Hello from Netlify Functions!",
      timestamp: new Date().toISOString()
    }, headers);
  }

  if (httpMethod === 'GET' && path.includes('/debug')) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    return jsonResponse({
      message: "API is working on Netlify",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!serviceKey,
      path: path,
      method: httpMethod
    }, headers);
  }

  return jsonResponse({ 
    message: "Route not found" 
  }, headers, 404);
};
