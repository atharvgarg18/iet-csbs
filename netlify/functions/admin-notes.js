const { getSupabaseClient } = require('./_shared/supabase');
const { verifySession, requireEditor } = require('./_shared/auth');
const { handleOptions, jsonResponse, errorResponse } = require('./_shared/http');

/**
 * Notes Management API
 * Routes:
 * - GET /api/admin-notes - List all notes
 * - POST /api/admin-notes - Create a new note
 * - PUT /api/admin-notes/:id - Update a note
 * - DELETE /api/admin-notes/:id - Delete a note
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

    // GET - List all notes
    if (httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('notes')
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

    // POST - Create note
    if (httpMethod === 'POST') {
      const { section_id, drive_link, description } = JSON.parse(body || '{}');
      
      if (!section_id || !drive_link) {
        return errorResponse('Section ID and drive link required', headers, 400);
      }
      
      const { data, error } = await supabase
        .from('notes')
        .insert({ section_id, drive_link, description })
        .select()
        .single();
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ success: true, data }, headers);
    }

    // PUT - Update note
    if (httpMethod === 'PUT') {
      const noteId = path.split('/').pop();
      const { section_id, drive_link, description } = JSON.parse(body || '{}');
      
      const { data, error } = await supabase
        .from('notes')
        .update({ section_id, drive_link, description })
        .eq('id', noteId)
        .select()
        .single();
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ success: true, data }, headers);
    }

    // DELETE - Delete note
    if (httpMethod === 'DELETE') {
      const noteId = path.split('/').pop();
      
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
      
      if (error) {
        return errorResponse(error.message, headers, 400);
      }
      
      return jsonResponse({ 
        success: true, 
        message: 'Note deleted successfully' 
      }, headers);
    }

    return errorResponse(`Method ${httpMethod} not supported`, headers, 405);

  } catch (error) {
    console.error('Notes API error:', error);
    return errorResponse('Internal server error', headers, 500);
  }
};
