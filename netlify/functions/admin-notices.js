const { getSupabaseClient } = require('./_shared/supabase');
const { verifySession, requireEditor } = require('./_shared/auth');
const { handleOptions, jsonResponse, errorResponse } = require('./_shared/http');

/**
 * Notices Management API - categories and notices
 * Routes:
 * - GET/POST/PUT/DELETE /api/admin-notices/categories[/:id]
 * - GET/POST/PUT/DELETE /api/admin-notices[/:id]
 */
exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;

  if (httpMethod === 'OPTIONS') {
    return handleOptions(headers);
  }

  try {
    const user = await verifySession(headers.cookie);
    if (!requireEditor(user)) {
      return errorResponse('Unauthorized - Editor/Admin access required', headers, 403);
    }

    const supabase = getSupabaseClient();

    // --- NOTICE CATEGORIES ---
    if (path.includes('/categories')) {
      // GET - List categories
      if (httpMethod === 'GET') {
        const { data, error } = await supabase
          .from('notice_categories')
          .select('*')
          .order('name');
        
        if (error) {
          return errorResponse(error.message, headers, 500);
        }
        
        return jsonResponse({ success: true, data: data || [] }, headers);
      }

      // POST - Create category
      if (httpMethod === 'POST') {
        const { name, description, color, is_active } = JSON.parse(body || '{}');
        
        if (!name) {
          return errorResponse('Category name required', headers, 400);
        }
        
        const { data, error } = await supabase
          .from('notice_categories')
          .insert({ 
            name, 
            description, 
            color: color || '#3b82f6', 
            is_active: is_active !== undefined ? is_active : true 
          })
          .select()
          .single();
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ success: true, data }, headers);
      }

      // PUT - Update category
      if (httpMethod === 'PUT') {
        const categoryId = path.split('/').pop();
        const { name, description, color, is_active } = JSON.parse(body || '{}');
        
        const { data, error } = await supabase
          .from('notice_categories')
          .update({ name, description, color, is_active })
          .eq('id', categoryId)
          .select()
          .single();
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ success: true, data }, headers);
      }

      // DELETE - Delete category
      if (httpMethod === 'DELETE') {
        const categoryId = path.split('/').pop();
        
        const { error } = await supabase
          .from('notice_categories')
          .delete()
          .eq('id', categoryId);
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ 
          success: true, 
          message: 'Notice category deleted successfully' 
        }, headers);
      }
    }

    // --- NOTICES ---
    // GET - List all notices
    if (httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('notices')
        .select(`
          *,
          category:notice_categories(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        return errorResponse(error.message, headers, 500);
      }
      
      return jsonResponse({ success: true, data: data || [] }, headers);
    }

    // POST - Create notice
    if (httpMethod === 'POST') {
      const { category_id, title, content, publish_date, is_published } = JSON.parse(body || '{}');
      
      if (!category_id || !title || !content) {
        return errorResponse('Category ID, title, and content required', headers, 400);
      }
      
      const { data, error } = await supabase
        .from('notices')
        .insert({ category_id, title, content, publish_date, is_published })
        .select()
        .single();
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ success: true, data }, headers);
    }

    // PUT - Update notice
    if (httpMethod === 'PUT') {
      const noticeId = path.split('/').pop();
      const { category_id, title, content, publish_date, is_published } = JSON.parse(body || '{}');
      
      const { data, error } = await supabase
        .from('notices')
        .update({ category_id, title, content, publish_date, is_published })
        .eq('id', noticeId)
        .select()
        .single();
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ success: true, data }, headers);
    }

    // DELETE - Delete notice
    if (httpMethod === 'DELETE') {
      const noticeId = path.split('/').pop();
      
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', noticeId);
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ 
        success: true, 
        message: 'Notice deleted successfully' 
      }, headers);
    }

    return errorResponse(`Method ${httpMethod} not supported`, headers, 405);

  } catch (error) {
    console.error('Notices API error:', error);
    return errorResponse('Internal server error', headers, 500);
  }
};
