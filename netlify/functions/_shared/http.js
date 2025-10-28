/**
 * Standard CORS headers for API responses
 * @param {object} headers - Request headers
 * @returns {object}
 */
function getCorsHeaders(headers) {
  const origin = headers.origin || headers.referer || 'https://ietcsbs.tech';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * Handle preflight OPTIONS request
 * @param {object} headers - Request headers
 * @returns {object} Netlify function response
 */
function handleOptions(headers) {
  return {
    statusCode: 200,
    headers: getCorsHeaders(headers),
    body: '',
  };
}

/**
 * Send JSON success response
 * @param {object} data - Response data
 * @param {object} headers - Request headers
 * @param {number} statusCode - HTTP status code
 * @returns {object} Netlify function response
 */
function jsonResponse(data, headers, statusCode = 200) {
  return {
    statusCode,
    headers: {
      ...getCorsHeaders(headers),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  };
}

/**
 * Send JSON error response
 * @param {string} message - Error message
 * @param {object} headers - Request headers
 * @param {number} statusCode - HTTP status code
 * @returns {object} Netlify function response
 */
function errorResponse(message, headers, statusCode = 400) {
  return jsonResponse({ success: false, message }, headers, statusCode);
}

/**
 * Parse route segments from path
 * @param {string} path - Full request path
 * @returns {{apiRoute: string, segments: string[]}}
 */
function parseRoute(path) {
  const apiRoute = path.replace('/.netlify/functions/api', '') || '/';
  const segments = apiRoute.split('/').filter(Boolean);
  return { apiRoute, segments };
}

module.exports = {
  getCorsHeaders,
  handleOptions,
  jsonResponse,
  errorResponse,
  parseRoute
};
