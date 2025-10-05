import { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { 
  GalleryImagesResponse, 
  CreateGalleryImageRequest,
  UpdateGalleryImageRequest
} from "@shared/api";

// Get all gallery images with category info
export const getGalleryImages: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .select(`
        *,
        gallery_categories (
          id,
          name,
          color
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery images:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch gallery images',
        error: error.message 
      });
    }

    const response: GalleryImagesResponse = {
      success: true,
      data: data || []
    };

    res.json(response);
  } catch (error) {
    console.error('Server error fetching gallery images:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Create new gallery image
export const createGalleryImage: RequestHandler = async (req, res) => {
  try {
    const { title, image_url, category_id, photographer, event_date, is_featured }: CreateGalleryImageRequest = req.body;

    if (!title || !image_url || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Title, image URL, and category are required'
      });
    }

    // Verify category exists
    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from('gallery_categories')
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
      .from('gallery_images')
      .insert({
        title,
        image_url,
        category_id,
        photographer,
        event_date,
        is_featured: is_featured || false
      })
      .select(`
        *,
        gallery_categories (
          id,
          name,
          color
        )
      `)
      .single();

    if (error) {
      console.error('Error creating gallery image:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create gallery image',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error creating gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update gallery image
export const updateGalleryImage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, category_id, photographer, event_date, is_featured }: UpdateGalleryImageRequest = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Image ID is required'
      });
    }

    // Verify category exists if category_id is provided
    if (category_id) {
      const { data: categoryData, error: categoryError } = await supabaseAdmin
        .from('gallery_categories')
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
    if (title !== undefined) updateData.title = title;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (photographer !== undefined) updateData.photographer = photographer;
    if (event_date !== undefined) updateData.event_date = event_date;
    if (is_featured !== undefined) updateData.is_featured = is_featured;

    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        gallery_categories (
          id,
          name,
          color
        )
      `)
      .single();

    if (error) {
      console.error('Error updating gallery image:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update gallery image',
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Server error updating gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete gallery image
export const deleteGalleryImage: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Image ID is required'
      });
    }

    const { error } = await supabaseAdmin
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting gallery image:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete gallery image',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Server error deleting gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};