import { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { 
  GalleryCategoriesResponse, 
  CreateGalleryCategoryRequest,
  UpdateGalleryCategoryRequest
} from "@shared/api";

// Get all gallery categories
export const getGalleryCategories: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery categories:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch gallery categories',
        error: error.message 
      });
    }

    const response: GalleryCategoriesResponse = {
      success: true,
      data: data || []
    };

    res.json(response);
  } catch (error) {
    console.error('Server error fetching gallery categories:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Create new gallery category
export const createGalleryCategory: RequestHandler = async (req, res) => {
  try {
    const { name, color }: CreateGalleryCategoryRequest = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('gallery_categories')
      .insert({
        name,
        color: color || '#3B82F6'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating gallery category:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create gallery category',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error creating gallery category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update gallery category
export const updateGalleryCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, is_active }: UpdateGalleryCategoryRequest = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('gallery_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating gallery category:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update gallery category',
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Gallery category not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error updating gallery category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete gallery category
export const deleteGalleryCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Category ID is required'
      });
    }

    // Check if category has images
    const { data: images, error: imagesError } = await supabaseAdmin
      .from('gallery_images')
      .select('id')
      .eq('category_id', id)
      .limit(1);

    if (imagesError) {
      console.error('Error checking category images:', imagesError);
      return res.status(500).json({
        success: false,
        message: 'Failed to check category usage'
      });
    }

    if (images && images.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing images. Please move or delete images first.'
      });
    }

    const { error } = await supabaseAdmin
      .from('gallery_categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gallery category:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete gallery category',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Gallery category deleted successfully'
    });
  } catch (error) {
    console.error('Server error deleting gallery category:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};