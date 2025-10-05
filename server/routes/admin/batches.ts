import { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { Batch, Section, CreateBatchRequest, UpdateBatchRequest, CreateSectionRequest, UpdateSectionRequest, ApiResponse } from "@shared/api";

// Get all batches with their sections
export const getBatches: RequestHandler = async (req, res) => {
  try {
    const { data: batches, error: batchesError } = await supabaseAdmin
      .from('batches')
      .select(`
        id,
        name,
        is_active,
        created_at,
        updated_at,
        sections (
          id,
          batch_id,
          name,
          is_active,
          created_at,
          updated_at
        )
      `)
      .order('created_at', { ascending: true });

    if (batchesError) {
      console.error('Error fetching batches:', batchesError);
      return res.status(500).json({ error: 'Failed to fetch batches' });
    }

    res.json({ data: batches });
  } catch (error) {
    console.error('Error in getBatches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single batch with sections
export const getBatch: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: batch, error } = await supabaseAdmin
      .from('batches')
      .select(`
        id,
        name,
        is_active,
        created_at,
        updated_at,
        sections (
          id,
          batch_id,
          name,
          is_active,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching batch:', error);
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.json({ data: batch });
  } catch (error) {
    console.error('Error in getBatch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new batch
export const createBatch: RequestHandler = async (req, res) => {
  try {
    const { name }: CreateBatchRequest = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Batch name is required' });
    }

    const { data: batch, error } = await supabaseAdmin
      .from('batches')
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) {
      console.error('Error creating batch:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Batch name already exists' });
      }
      return res.status(500).json({ error: 'Failed to create batch' });
    }

    res.status(201).json({ data: batch, message: 'Batch created successfully' });
  } catch (error) {
    console.error('Error in createBatch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update batch
export const updateBatch: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates: UpdateBatchRequest = req.body;

    const { data: batch, error } = await supabaseAdmin
      .from('batches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating batch:', error);
      return res.status(500).json({ error: 'Failed to update batch' });
    }

    res.json({ data: batch, message: 'Batch updated successfully' });
  } catch (error) {
    console.error('Error in updateBatch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete batch (and all associated sections, notes, papers)
export const deleteBatch: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('batches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting batch:', error);
      return res.status(500).json({ error: 'Failed to delete batch' });
    }

    res.json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error in deleteBatch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all sections
export const getSections: RequestHandler = async (req, res) => {
  try {
    const { data: sections, error } = await supabaseAdmin
      .from('sections')
      .select(`
        id,
        batch_id,
        name,
        is_active,
        created_at,
        updated_at,
        batch:batches (
          id,
          name,
          is_active
        )
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching sections:', error);
      return res.status(500).json({ error: 'Failed to fetch sections' });
    }

    res.json({ data: sections });
  } catch (error) {
    console.error('Error in getSections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new section
export const createSection: RequestHandler = async (req, res) => {
  try {
    const { batch_id, name }: CreateSectionRequest = req.body;

    if (!batch_id) {
      return res.status(400).json({ error: 'Batch ID is required' });
    }

    const { data: section, error } = await supabaseAdmin
      .from('sections')
      .insert({ 
        batch_id, 
        name: name?.trim() || null 
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating section:', error);
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Section already exists for this batch' });
      }
      return res.status(500).json({ error: 'Failed to create section' });
    }

    res.status(201).json({ data: section, message: 'Section created successfully' });
  } catch (error) {
    console.error('Error in createSection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update section
export const updateSection: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates: UpdateSectionRequest = req.body;

    const { data: section, error } = await supabaseAdmin
      .from('sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating section:', error);
      return res.status(500).json({ error: 'Failed to update section' });
    }

    res.json({ data: section, message: 'Section updated successfully' });
  } catch (error) {
    console.error('Error in updateSection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete section (and all associated notes, papers)
export const deleteSection: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('sections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting section:', error);
      return res.status(500).json({ error: 'Failed to delete section' });
    }

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};