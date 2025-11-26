/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// CMS Database Types

export interface Batch {
  id: string;
  name: string; // "2024-28", "2025-29"
  description?: string;
  start_year?: number;
  end_year?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  batch_id: string;
  name: string | null; // "A", "B", or null for single section
  is_active: boolean;
  created_at: string;
  updated_at: string;
  batch?: Batch; // Related batch data
}

export interface Note {
  id: string;
  section_id: string;
  drive_link: string;
  description?: string;
  created_at: string;
  updated_at: string;
  section?: Section; // Related section data
}

export interface Paper {
  id: string;
  section_id: string;
  drive_link: string;
  description?: string;
  created_at: string;
  updated_at: string;
  section?: Section; // Related section data
}

export interface GalleryCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  category_id: string;
  title: string;
  image_url: string;
  photographer?: string;
  event_date?: string;
  is_featured: boolean;
  is_published: boolean;
  is_active: boolean;
  views?: number;
  likes?: number;
  created_at: string;
  updated_at: string;
  category?: GalleryCategory; // Related category data
}

export interface NoticeCategory {
  id: string;
  name: string;
  color: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notice {
  id: string;
  category_id: string;
  title: string;
  content: string;
  is_published: boolean;
  is_urgent: boolean;
  publish_date: string;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
  category?: NoticeCategory; // Related category data
}

// API Request/Response Types

export interface CreateBatchRequest {
  name: string;
}

export interface UpdateBatchRequest {
  name?: string;
  is_active?: boolean;
}

export interface CreateSectionRequest {
  batch_id: string;
  name?: string;
}

export interface UpdateSectionRequest {
  name?: string;
  is_active?: boolean;
}

export interface CreateNoteRequest {
  section_id: string;
  drive_link: string;
  description?: string;
}

export interface UpdateNoteRequest {
  drive_link?: string;
  description?: string;
}

export interface CreatePaperRequest {
  section_id: string;
  drive_link: string;
  description?: string;
}

export interface UpdatePaperRequest {
  drive_link?: string;
  description?: string;
}

export interface CreateGalleryCategoryRequest {
  name: string;
  color?: string;
  description?: string;
}

export interface UpdateGalleryCategoryRequest {
  name?: string;
  color?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateGalleryImageRequest {
  category_id: string;
  title: string;
  image_url: string;
  photographer?: string;
  event_date?: string;
  is_featured?: boolean;
}

export interface UpdateGalleryImageRequest {
  category_id?: string;
  title?: string;
  image_url?: string;
  photographer?: string;
  event_date?: string;
  is_featured?: boolean;
  is_active?: boolean;
}

export interface CreateNoticeCategoryRequest {
  name: string;
  color?: string;
  description?: string;
}

export interface UpdateNoticeCategoryRequest {
  name?: string;
  color?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateNoticeRequest {
  category_id: string;
  title: string;
  content: string;
  attachment_url?: string;
  is_published?: boolean;
  is_urgent?: boolean;
  publish_date?: string;
}

export interface UpdateNoticeRequest {
  category_id?: string;
  title?: string;
  content?: string;
  attachment_url?: string;
  is_published?: boolean;
  is_urgent?: boolean;
  publish_date?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Specific Response Types
export interface BatchesResponse {
  success: boolean;
  data: Batch[];
  message?: string;
}

export interface SectionsResponse {
  success: boolean;
  data: Section[];
  message?: string;
}

export interface NotesResponse {
  success: boolean;
  data: Note[];
  message?: string;
}

export interface PapersResponse {
  success: boolean;
  data: Paper[];
  message?: string;
}

export interface GalleryCategoriesResponse {
  success: boolean;
  data: GalleryCategory[];
  message?: string;
}

export interface GalleryImagesResponse {
  success: boolean;
  data: GalleryImage[];
  message?: string;
}

export interface NoticeCategoriesResponse {
  success: boolean;
  data: NoticeCategory[];
  message?: string;
}

export interface NoticesResponse {
  success: boolean;
  data: Notice[];
  message?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBatches: number;
  totalNotes: number;
  totalPapers: number;
  totalNotices: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message?: string;
}

// Authentication Types

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

// Auth Request/Response Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    session_token: string;
    expires_at: string;
  };
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface RegisterResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export interface AuthCheckResponse {
  success: boolean;
  data?: {
    user: User;
    session_valid: boolean;
  };
  message?: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  message?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}
