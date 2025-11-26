import { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { 
  NoticesResponse, 
  CreateNoticeRequest,
  UpdateNoticeRequest
} from "@shared/api";

// Get all notices with category info
export const getNotices: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('notices')
      .select(`
        *,
        notice_categories (
          id,
          name,
          color
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notices:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch notices',
        error: error.message 
      });
    }

    const response: NoticesResponse = {
      success: true,
      data: data || []
    };

    res.json(response);
  } catch (error) {
    console.error('Server error fetching notices:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get single notice
export const getNotice: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notice ID is required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('notices')
      .select(`
        *,
        notice_categories (
          id,
          name,
          color
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching notice:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Notice not found'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch notice',
        error: error.message
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error fetching notice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new notice
export const createNotice: RequestHandler = async (req, res) => {
  try {
    const { 
      category_id, 
      title, 
      content, 
      attachment_url,
      is_published, 
      is_urgent,
      publish_date 
    }: CreateNoticeRequest = req.body;

    if (!title || !content || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required'
      });
    }

    // Verify category exists
    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from('notice_categories')
      .select('id')
      .eq('id', category_id)
      .single();

    if (categoryError || !categoryData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('notices')
      .insert({
        category_id,
        title,
        content,
        attachment_url,
        is_published: is_published || false,
        is_urgent: is_urgent || false,
        publish_date: publish_date || new Date().toISOString()
      })
      .select(`
        *,
        notice_categories (
          id,
          name,
          color
        )
      `)
      .single();

    if (error) {
      console.error('Error creating notice:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create notice',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error creating notice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update notice
export const updateNotice: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      category_id, 
      title, 
      content, 
      attachment_url,
      is_published, 
      is_urgent,
      publish_date 
    }: UpdateNoticeRequest = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notice ID is required'
      });
    }

    // Verify category exists if category_id is provided
    if (category_id) {
      const { data: categoryData, error: categoryError } = await supabaseAdmin
        .from('notice_categories')
        .select('id')
        .eq('id', category_id)
        .single();

      if (categoryError || !categoryData) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }
    }

    const updateData: any = {};
    if (category_id !== undefined) updateData.category_id = category_id;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (attachment_url !== undefined) updateData.attachment_url = attachment_url;
    if (is_published !== undefined) updateData.is_published = is_published;
    if (is_urgent !== undefined) updateData.is_urgent = is_urgent;
    if (publish_date !== undefined) updateData.publish_date = publish_date;

    const { data, error } = await supabaseAdmin
      .from('notices')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        notice_categories (
          id,
          name,
          color
        )
      `)
      .single();

    if (error) {
      console.error('Error updating notice:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update notice',
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error updating notice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete notice
export const deleteNotice: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Notice ID is required'
      });
    }

    const { error } = await supabaseAdmin
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notice:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete notice',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Server error deleting notice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};