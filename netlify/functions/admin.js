const { getSupabaseClient } = require('./_shared/supabase');
const { verifySession, requireAdmin, requireEditor } = require('./_shared/auth');
const { handleOptions, jsonResponse, errorResponse } = require('./_shared/http');

/**
 * Admin Management API - batches, sections, dashboard stats
 * Routes:
 * - GET/POST/PUT/DELETE /api/admin-batches[/:id]
 * - GET/POST/PUT/DELETE /api/admin-sections[/:id]
 * - GET /api/admin-stats - Dashboard statistics
 */
exports.handler = async (event, context) => {
  const { httpMethod, path, body, headers } = event;

  if (httpMethod === 'OPTIONS') {
    return handleOptions(headers);
  }

  try {
    const supabase = getSupabaseClient();

    // Dashboard stats - requires any management role
    if (httpMethod === 'GET' && path.includes('/stats')) {
      const user = await verifySession(headers.cookie);
      if (!user || !['admin', 'editor', 'viewer'].includes(user.role)) {
        return errorResponse('Access denied', headers, 403);
      }

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

      const stats = {
        batches: batchesResult.count || 0,
        sections: sectionsResult.count || 0,
        notes: notesResult.count || 0,
        papers: papersResult.count || 0,
        gallery_images: galleryImagesResult.count || 0,
        notices: noticesResult.count || 0,
        users: usersResult.count || 0,
        user_stats: userStats
      };

      return jsonResponse(stats, headers);
    }

    // All other routes require editor/admin
    const user = await verifySession(headers.cookie);
    if (!requireEditor(user)) {
      return errorResponse('Unauthorized - Editor/Admin access required', headers, 403);
    }

    // --- BATCHES ---
    if (path.includes('/batches')) {
      // GET - List batches
      if (httpMethod === 'GET') {
        const { data, error } = await supabase
          .from('batches')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          return errorResponse(error.message, headers, 500);
        }
        
        return jsonResponse({ success: true, data: data || [] }, headers);
      }

      // POST - Create batch
      if (httpMethod === 'POST') {
        const { name } = JSON.parse(body || '{}');
        
        if (!name) {
          return errorResponse('Batch name required', headers, 400);
        }
        
        const { data, error } = await supabase
          .from('batches')
          .insert({ name })
          .select()
          .single();
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ success: true, data }, headers);
      }

      // PUT - Update batch
      if (httpMethod === 'PUT') {
        const batchId = path.split('/').pop();
        const { name, is_active } = JSON.parse(body || '{}');
        
        const { data, error } = await supabase
          .from('batches')
          .update({ name, is_active })
          .eq('id', batchId)
          .select()
          .single();
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ success: true, data }, headers);
      }

      // DELETE - Delete batch
      if (httpMethod === 'DELETE') {
        const batchId = path.split('/').pop();
        
        const { error } = await supabase
          .from('batches')
          .delete()
          .eq('id', batchId);
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ 
          success: true, 
          message: 'Batch deleted successfully' 
        }, headers);
      }
    }

    // --- SECTIONS ---
    if (path.includes('/sections')) {
      // GET - List sections with batch info
      if (httpMethod === 'GET') {
        const { data, error } = await supabase
          .from('sections')
          .select(`
            *,
            batch:batches(*)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          return errorResponse(error.message, headers, 500);
        }
        
        return jsonResponse({ success: true, data: data || [] }, headers);
      }

      // POST - Create section
      if (httpMethod === 'POST') {
        const { batch_id, name } = JSON.parse(body || '{}');
        
        if (!batch_id || !name) {
          return errorResponse('Batch ID and section name required', headers, 400);
        }
        
        const { data, error } = await supabase
          .from('sections')
          .insert({ batch_id, name })
          .select()
          .single();
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ success: true, data }, headers);
      }

      // PUT - Update section
      if (httpMethod === 'PUT') {
        const sectionId = path.split('/').pop();
        const { batch_id, name } = JSON.parse(body || '{}');
        
        const { data, error } = await supabase
          .from('sections')
          .update({ batch_id, name })
          .eq('id', sectionId)
          .select()
          .single();
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ success: true, data }, headers);
      }

      // DELETE - Delete section
      if (httpMethod === 'DELETE') {
        const sectionId = path.split('/').pop();
        
        const { error } = await supabase
          .from('sections')
          .delete()
          .eq('id', sectionId);
        
        if (error) {
          return errorResponse(error.message, headers, 400);
        }
        
        return jsonResponse({ 
          success: true, 
          message: 'Section deleted successfully' 
        }, headers);
      }
    }

    return errorResponse('Route not found', headers, 404);

  } catch (error) {
    console.error('Admin management API error:', error);
    return errorResponse('Internal server error', headers, 500);
  }
};
