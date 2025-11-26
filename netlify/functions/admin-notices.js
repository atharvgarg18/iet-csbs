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
      const requestBody = JSON.parse(body || '{}');
      const { category_id, title, content, attachment_url, publish_date, is_published, is_urgent } = requestBody;
      
      console.log('Creating notice with data:', requestBody);
      console.log('Attachment URL received:', attachment_url);
      
      if (!category_id || !title || !content) {
        return errorResponse('Category ID, title, and content required', headers, 400);
      }
      
      const insertData = { 
        category_id, 
        title, 
        content, 
        attachment_url: attachment_url || null,
        publish_date, 
        is_published: is_published !== undefined ? is_published : false,
        is_urgent: is_urgent !== undefined ? is_urgent : false
      };
      
      console.log('Inserting into database:', insertData);
      
      const { data, error } = await supabase
        .from('notices')
        .insert(insertData)
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
      const requestBody = JSON.parse(body || '{}');
      const { category_id, title, content, attachment_url, publish_date, is_published, is_urgent } = requestBody;
      
      console.log('Updating notice', noticeId, 'with data:', requestBody);
      console.log('Attachment URL received:', attachment_url);
      
      const updateData = {};
      if (category_id !== undefined) updateData.category_id = category_id;
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (attachment_url !== undefined) updateData.attachment_url = attachment_url;
      if (publish_date !== undefined) updateData.publish_date = publish_date;
      if (is_published !== undefined) updateData.is_published = is_published;
      if (is_urgent !== undefined) updateData.is_urgent = is_urgent;
      
      console.log('Update data to apply:', updateData);
      
      const { data, error } = await supabase
        .from('notices')
        .update(updateData)
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
