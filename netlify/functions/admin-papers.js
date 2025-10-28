const { getSupabaseClient } = require('./_shared/supabase');
const { verifySession, requireEditor } = require('./_shared/auth');
const { handleOptions, jsonResponse, errorResponse } = require('./_shared/http');

/**
 * Papers Management API
 * Routes:
 * - GET /api/admin-papers - List all papers
 * - POST /api/admin-papers - Create a new paper
 * - PUT /api/admin-papers/:id - Update a paper
 * - DELETE /api/admin-papers/:id - Delete a paper
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

    // GET - List all papers
    if (httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('papers')
        .select(`
          *,
          section:sections(*, batch:batches(*))
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        return errorResponse(error.message, headers, 500);
      }
      
      return jsonResponse({ success: true, data: data || [] }, headers);
    }

    // POST - Create paper
    if (httpMethod === 'POST') {
      const { section_id, drive_link, description } = JSON.parse(body || '{}');
      
      if (!section_id || !drive_link) {
        return errorResponse('Section ID and drive link required', headers, 400);
      }
      
      const { data, error } = await supabase
        .from('papers')
        .insert({ section_id, drive_link, description })
        .select()
        .single();
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ success: true, data }, headers);
    }

    // PUT - Update paper
    if (httpMethod === 'PUT') {
      const paperId = path.split('/').pop();
      const { section_id, drive_link, description } = JSON.parse(body || '{}');
      
      const { data, error } = await supabase
        .from('papers')
        .update({ section_id, drive_link, description })
        .eq('id', paperId)
        .select()
        .single();
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ success: true, data }, headers);
    }

    // DELETE - Delete paper
    if (httpMethod === 'DELETE') {
      const paperId = path.split('/').pop();
      
      const { error } = await supabase
        .from('papers')
        .delete()
        .eq('id', paperId);
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ 
        success: true, 
        message: 'Paper deleted successfully' 
      }, headers);
    }

    return errorResponse(`Method ${httpMethod} not supported`, headers, 405);

  } catch (error) {
    console.error('Papers API error:', error);
    return errorResponse('Internal server error', headers, 500);
  }
};
