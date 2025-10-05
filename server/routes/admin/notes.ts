import { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabase";
import { Note, CreateNoteRequest, UpdateNoteRequest } from "@shared/api";

// Get all notes with section and batch info
export const getNotes: RequestHandler = async (req, res) => {
  try {
    const { data: notes, error } = await supabaseAdmin
      .from('notes')
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
      console.error('Error fetching notes:', error);
      return res.status(500).json({ error: 'Failed to fetch notes' });
    }

    res.json({ data: notes });
  } catch (error) {
    console.error('Error in getNotes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single note
export const getNote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: note, error } = await supabaseAdmin
      .from('notes')
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
      console.error('Error fetching note:', error);
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ data: note });
  } catch (error) {
    console.error('Error in getNote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new note
export const createNote: RequestHandler = async (req, res) => {
  try {
    const { section_id, drive_link, description }: CreateNoteRequest = req.body;

    if (!section_id || !drive_link?.trim()) {
      return res.status(400).json({ error: 'Section ID and drive link are required' });
    }

    // Check if note already exists for this section
    const { data: existingNote } = await supabaseAdmin
      .from('notes')
      .select('id')
      .eq('section_id', section_id)
      .single();

    if (existingNote) {
      return res.status(400).json({ error: 'Notes link already exists for this section' });
    }

    const { data: note, error } = await supabaseAdmin
      .from('notes')
      .insert({ 
        section_id,
        drive_link: drive_link.trim(),
        description: description?.trim() || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return res.status(500).json({ error: 'Failed to create note' });
    }

    res.status(201).json({ data: note, message: 'Note created successfully' });
  } catch (error) {
    console.error('Error in createNote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update note
export const updateNote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { drive_link, description }: UpdateNoteRequest = req.body;

    if (!drive_link?.trim()) {
      return res.status(400).json({ error: 'Drive link is required' });
    }

    const { data: note, error } = await supabaseAdmin
      .from('notes')
      .update({
        drive_link: drive_link.trim(),
        description: description?.trim() || null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return res.status(500).json({ error: 'Failed to update note' });
    }

    res.json({ data: note, message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error in updateNote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete note
export const deleteNote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      return res.status(500).json({ error: 'Failed to delete note' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error in deleteNote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};