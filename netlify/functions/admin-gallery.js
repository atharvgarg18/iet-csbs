const { getSupabaseClient } = require('./_shared/supabase');
const { verifySession, requireEditor } = require('./_shared/auth');
const { handleOptions, jsonResponse, errorResponse } = require('./_shared/http');

/**
 * Gallery Management API - categories and images
 * Routes:
 * - GET/POST/PUT/DELETE /api/admin-gallery/categories[/:id]
 * - GET/POST/PUT/DELETE /api/admin-gallery/images[/:id]
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

    // --- GALLERY CATEGORIES ---
    if (path.includes('/categories')) {
      // GET - List categories
      if (httpMethod === 'GET') {
        const { data, error } = await supabase
          .from('gallery_categories')
          .select('*')
          .order('name');
        
        if (error) {
          return errorResponse(error.message, headers, 500);
        }
        
        return jsonResponse({ success: true, data: data || [] }, headers);
      }

      // POST - Create category
      if (httpMethod === 'POST') {
        const { name, color, is_active } = JSON.parse(body || '{}');
        
        if (!name) {
          return errorResponse('Category name required', headers, 400);
        }
        
        const { data, error } = await supabase
          .from('gallery_categories')
          .insert({ 
            name, 
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
        const { name, color, is_active } = JSON.parse(body || '{}');
        
        const { data, error } = await supabase
          .from('gallery_categories')
          .update({ name, color, is_active })
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
          .from('gallery_categories')
          .delete()
          .eq('id', categoryId);
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ 
          success: true, 
          message: 'Gallery category deleted successfully' 
        }, headers);
      }
    }

    // --- GALLERY IMAGES ---
    if (path.includes('/images')) {
      // GET - List images
      if (httpMethod === 'GET') {
        const { data, error } = await supabase
          .from('gallery_images')
          .select(`
            *,
            category:gallery_categories(*)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          return errorResponse(error.message, headers, 500);
        }
        
        return jsonResponse({ success: true, data: data || [] }, headers);
      }

      // POST - Create image
      if (httpMethod === 'POST') {
        const { category_id, image_url, title } = JSON.parse(body || '{}');
        
        if (!category_id || !image_url) {
          return errorResponse('Category ID and image URL required', headers, 400);
        }
        
        const { data, error } = await supabase
          .from('gallery_images')
          .insert({ category_id, image_url, title })
          .select()
          .single();
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ success: true, data }, headers);
      }

      // PUT - Update image
      if (httpMethod === 'PUT') {
        const imageId = path.split('/').pop();
        const { category_id, image_url, title } = JSON.parse(body || '{}');
        
        const { data, error } = await supabase
          .from('gallery_images')
          .update({ category_id, image_url, title })
          .eq('id', imageId)
          .select()
          .single();
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ success: true, data }, headers);
      }

      // DELETE - Delete image
      if (httpMethod === 'DELETE') {
        const imageId = path.split('/').pop();
        
        const { error } = await supabase
          .from('gallery_images')
          .delete()
          .eq('id', imageId);
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ 
          success: true, 
          message: 'Gallery image deleted successfully' 
        }, headers);
      }
    }

    return errorResponse('Route not found', headers, 404);

  } catch (error) {
    console.error('Gallery API error:', error);
    return errorResponse('Internal server error', headers, 500);
  }
};
