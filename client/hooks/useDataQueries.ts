import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { GalleryImage, GalleryCategory, Note, Paper, Section } from '@shared/api';

// Query keys for better cache management
export const queryKeys = {
  gallery: {
    all: ['gallery'] as const,
    images: (page?: number) => ['gallery', 'images', page] as const,
    categories: () => ['gallery', 'categories'] as const,
  },
  notes: {
    all: ['notes'] as const,
    list: (page?: number) => ['notes', 'list', page] as const,
    sections: () => ['notes', 'sections'] as const,
  },
  papers: {
    all: ['papers'] as const,
    list: (page?: number) => ['papers', 'list', page] as const,
    sections: () => ['papers', 'sections'] as const,
  },
  notices: {
    all: ['notices'] as const,
    list: (page?: number) => ['notices', 'list', page] as const,
  },
};

// Constants
const ITEMS_PER_PAGE = 20;

// Gallery hooks
export function useGalleryImages(page = 0) {
  return useQuery({
    queryKey: queryKeys.gallery.images(page),
    queryFn: async () => {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('gallery_images')
        .select(`
          id,
          category_id,
          title,
          image_url,
          photographer,
          event_date,
          is_featured,
          is_active,
          created_at,
          updated_at,
          category:gallery_categories (
            id,
            name,
            color,
            description,
            is_active
          )
        `, { count: 'exact' })
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('event_date', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        images: (data || []) as unknown as GalleryImage[],
        total: count || 0,
        hasMore: count ? (from + ITEMS_PER_PAGE) < count : false,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: queryKeys.gallery.categories(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data || []) as GalleryCategory[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  });
}

// Notes hooks
export function useNotes(page = 0) {
  return useQuery({
    queryKey: queryKeys.notes.list(page),
    queryFn: async () => {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
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
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        notes: (data || []) as unknown as Note[],
        total: count || 0,
        hasMore: count ? (from + ITEMS_PER_PAGE) < count : false,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useNotesSections() {
  return useQuery({
    queryKey: queryKeys.notes.sections(),
    queryFn: async () => {
      const { data, error } = await supabase
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
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Section[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

// Papers hooks
export function usePapers(page = 0) {
  return useQuery({
    queryKey: queryKeys.papers.list(page),
    queryFn: async () => {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
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
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        papers: (data || []) as unknown as Paper[],
        total: count || 0,
        hasMore: count ? (from + ITEMS_PER_PAGE) < count : false,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePapersSections() {
  return useQuery({
    queryKey: queryKeys.papers.sections(),
    queryFn: async () => {
      const { data, error } = await supabase
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
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Section[];
    },
    staleTime: 10 * 60 * 1000,
  });
}
