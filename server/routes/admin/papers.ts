import { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { Paper, CreatePaperRequest, UpdatePaperRequest } from "@shared/api";

// Get all papers with section and batch info
export const getPapers: RequestHandler = async (req, res) => {
  try {
    const { data: papers, error } = await supabaseAdmin
      .from('papers')
      .select(`
        id,
        section_id,
        drive_link,
        description,
        created_at,
        updated_at,
        section:sections (
          id,
          batch_id,
          name,
          is_active,
          batch:batches (
            id,
            name,
            is_active
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching papers:', error);
      return res.status(500).json({ error: 'Failed to fetch papers' });
    }

    res.json({ data: papers });
  } catch (error) {
    console.error('Error in getPapers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single paper
export const getPaper: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: paper, error } = await supabaseAdmin
      .from('papers')
      .select(`
        id,
        section_id,
        drive_link,
        description,
        created_at,
        updated_at,
        section:sections (
          id,
          batch_id,
          name,
          is_active,
          batch:batches (
            id,
            name,
            is_active
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching paper:', error);
      return res.status(404).json({ error: 'Paper not found' });
    }

    res.json({ data: paper });
  } catch (error) {
    console.error('Error in getPaper:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new paper
export const createPaper: RequestHandler = async (req, res) => {
  try {
    const { section_id, drive_link, description }: CreatePaperRequest = req.body;

    if (!section_id || !drive_link?.trim()) {
      return res.status(400).json({ error: 'Section ID and drive link are required' });
    }

    // Check if paper already exists for this section
    const { data: existingPaper } = await supabaseAdmin
      .from('papers')
      .select('id')
      .eq('section_id', section_id)
      .single();

    if (existingPaper) {
      return res.status(400).json({ error: 'Papers link already exists for this section' });
    }

    const { data: paper, error } = await supabaseAdmin
      .from('papers')
      .insert({ 
        section_id,
        drive_link: drive_link.trim(),
        description: description?.trim() || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating paper:', error);
      return res.status(500).json({ error: 'Failed to create paper' });
    }

    res.status(201).json({ data: paper, message: 'Paper created successfully' });
  } catch (error) {
    console.error('Error in createPaper:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update paper
export const updatePaper: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { drive_link, description }: UpdatePaperRequest = req.body;

    if (!drive_link?.trim()) {
      return res.status(400).json({ error: 'Drive link is required' });
    }

    const { data: paper, error } = await supabaseAdmin
      .from('papers')
      .update({
        drive_link: drive_link.trim(),
        description: description?.trim() || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating paper:', error);
      return res.status(500).json({ error: 'Failed to update paper' });
    }

    res.json({ data: paper, message: 'Paper updated successfully' });
  } catch (error) {
    console.error('Error in updatePaper:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete paper
export const deletePaper: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('papers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting paper:', error);
      return res.status(500).json({ error: 'Failed to delete paper' });
    }

    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    console.error('Error in deletePaper:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};