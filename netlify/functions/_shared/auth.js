const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { getSupabaseClient } = require('./supabase');

/**
 * Generate a secure random session token
 * @returns {string}
 */
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a password using bcrypt
 * @param {string} password
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Verify a session token and return the associated user
 * @param {string} cookies - Cookie header string
 * @returns {Promise<{id: string, email: string, role: string, is_active: boolean} | null>}
 */
async function verifySession(cookies) {
  if (!cookies) {
    return null;
  }
  
  const sessionMatch = cookies.match(/session=([^;]+)/);
  if (!sessionMatch) {
    return null;
  }
  
  const sessionToken = sessionMatch[1];
  const supabase = getSupabaseClient();
  
  // Get the session
  const { data: sessions, error: sessionError } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .gte('expires_at', new Date().toISOString())
    .limit(1);

  if (sessionError || !sessions || sessions.length === 0) {
    return null;
  }

  // Get the user
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', sessions[0].user_id)
    .limit(1);

  if (userError || !users || users.length === 0) {
    return null;
  }

  return users[0];
}

/**
 * Check if user is authenticated and active
 * @param {object} user
 * @returns {boolean}
 */
function requireAuth(user) {
  return user && user.is_active;
}

/**
 * Check if user is admin
 * @param {object} user
 * @returns {boolean}
 */
function requireAdmin(user) {
  return user && user.is_active && user.role === 'admin';
}

/**
 * Check if user is editor or admin
 * @param {object} user
 * @returns {boolean}
 */
function requireEditor(user) {
  return user && user.is_active && (user.role === 'admin' || user.role === 'editor');
}

module.exports = {
  generateSessionToken,
  hashPassword,
  verifyPassword,
  verifySession,
  requireAuth,
  requireAdmin,
  requireEditor
};
