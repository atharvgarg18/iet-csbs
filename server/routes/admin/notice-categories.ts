import { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { 
  NoticeCategoriesResponse, 
  CreateNoticeCategoryRequest,
  UpdateNoticeCategoryRequest
} from "@shared/api";

// Get all notice categories
export const getNoticeCategories: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('notice_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notice categories:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch notice categories',
        error: error.message 
      });
    }

    const response: NoticeCategoriesResponse = {
      success: true,
      data: data || []
    };

    res.json(response);
  } catch (error) {
    console.error('Server error fetching notice categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Create new notice category
export const createNoticeCategory: RequestHandler = async (req, res) => {
  try {
    const { name, color, description }: CreateNoticeCategoryRequest = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('notice_categories')
      .insert({
        name,
        color: color || '#3B82F6',
        description
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating notice category:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create notice category',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error creating notice category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update notice category
export const updateNoticeCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, description, is_active }: UpdateNoticeCategoryRequest = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;
    if (description !== undefined) updateData.description = description;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('notice_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating notice category:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update notice category',
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Notice category not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error updating notice category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete notice category
export const deleteNoticeCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    // Check if category has notices
    const { data: notices, error: noticesError } = await supabaseAdmin
      .from('notices')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (noticesError) {
      console.error('Error checking category notices:', noticesError);
      return res.status(500).json({
        success: false,
        message: 'Failed to check category usage'
      });
    }

    if (notices && notices.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing notices. Please move or delete notices first.'
      });
    }

    const { error } = await supabaseAdmin
      .from('notice_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notice category:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete notice category',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Notice category deleted successfully'
    });
  } catch (error) {
    console.error('Server error deleting notice category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};