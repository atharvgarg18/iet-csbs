import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import {
  login,
  logout,
  checkAuth,
  register,
  getUsers,
  updateUser,
  deleteUser,
  changePassword
} from "./routes/auth";
import { requireAuth, requireAdmin, requireEditor } from "./middleware/auth";
import { 
  getBatches, 
  getBatch, 
  createBatch, 
  updateBatch, 
  deleteBatch,
  getSections,
  createSection,
  updateSection,
  deleteSection
} from "./routes/admin/batches";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from "./routes/admin/notes";
import {
  getPapers,
  getPaper,
  createPaper,
  updatePaper,
  deletePaper
} from "./routes/admin/papers";
import {
  getGalleryCategories,
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory
} from "./routes/admin/gallery-categories";
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} from "./routes/admin/gallery-images";
import {
  getNoticeCategories,
  createNoticeCategory,
  updateNoticeCategory,
  deleteNoticeCategory
} from "./routes/admin/notice-categories";
import {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice
} from "./routes/admin/notices";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: true, // Allow all origins in development, configure for production
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Debug route to check if API is working
  app.get("/api/debug", (_req, res) => {
    res.json({ 
      message: "API is working",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/check", checkAuth);
  app.post("/api/auth/register", requireAuth, requireAdmin, register);
  app.post("/api/auth/change-password", changePassword);

  // User management routes (admin only)
  app.get("/api/admin/users", requireAuth, requireAdmin, getUsers);
  app.put("/api/admin/users/:id", requireAuth, requireAdmin, updateUser);
  app.delete("/api/admin/users/:id", requireAuth, requireAdmin, deleteUser);

  // Admin API routes - Batches & Sections
  app.get("/api/admin/batches", requireAuth, requireEditor, getBatches);
  app.get("/api/admin/batches/:id", requireAuth, requireEditor, getBatch);
  app.post("/api/admin/batches", requireAuth, requireEditor, createBatch);
  app.put("/api/admin/batches/:id", requireAuth, requireEditor, updateBatch);
  app.delete("/api/admin/batches/:id", requireAuth, requireEditor, deleteBatch);
  
  app.get("/api/admin/sections", requireAuth, requireEditor, getSections);
  app.post("/api/admin/sections", requireAuth, requireEditor, createSection);
  app.put("/api/admin/sections/:id", requireAuth, requireEditor, updateSection);
  app.delete("/api/admin/sections/:id", requireAuth, requireEditor, deleteSection);

  // Admin API routes - Notes
  app.get("/api/admin/notes", requireAuth, requireEditor, getNotes);
  app.get("/api/admin/notes/:id", requireAuth, requireEditor, getNote);
  app.post("/api/admin/notes", requireAuth, requireEditor, createNote);
  app.put("/api/admin/notes/:id", requireAuth, requireEditor, updateNote);
  app.delete("/api/admin/notes/:id", requireAuth, requireEditor, deleteNote);

  // Admin API routes - Papers
  app.get("/api/admin/papers", requireAuth, requireEditor, getPapers);
  app.get("/api/admin/papers/:id", requireAuth, requireEditor, getPaper);
  app.post("/api/admin/papers", requireAuth, requireEditor, createPaper);
  app.put("/api/admin/papers/:id", requireAuth, requireEditor, updatePaper);
  app.delete("/api/admin/papers/:id", requireAuth, requireEditor, deletePaper);

  // Admin API routes - Gallery Categories
  app.get("/api/admin/gallery-categories", requireAuth, requireEditor, getGalleryCategories);
  app.post("/api/admin/gallery-categories", requireAuth, requireEditor, createGalleryCategory);
  app.put("/api/admin/gallery-categories/:id", requireAuth, requireEditor, updateGalleryCategory);
  app.delete("/api/admin/gallery-categories/:id", requireAuth, requireEditor, deleteGalleryCategory);

  // Admin API routes - Gallery Images
  app.get("/api/admin/gallery-images", requireAuth, requireEditor, getGalleryImages);
  app.post("/api/admin/gallery-images", requireAuth, requireEditor, createGalleryImage);
  app.put("/api/admin/gallery-images/:id", requireAuth, requireEditor, updateGalleryImage);
  app.delete("/api/admin/gallery-images/:id", requireAuth, requireEditor, deleteGalleryImage);

  // Admin API routes - Notice Categories
  app.get("/api/admin/notice-categories", requireAuth, requireEditor, getNoticeCategories);
  app.post("/api/admin/notice-categories", requireAuth, requireEditor, createNoticeCategory);
  app.put("/api/admin/notice-categories/:id", requireAuth, requireEditor, updateNoticeCategory);
  app.delete("/api/admin/notice-categories/:id", requireAuth, requireEditor, deleteNoticeCategory);

  // Admin API routes - Notices
  app.get("/api/admin/notices", requireAuth, requireEditor, getNotices);
  app.get("/api/admin/notices/:id", requireAuth, requireEditor, getNotice);
  app.post("/api/admin/notices", requireAuth, requireEditor, createNotice);
  app.put("/api/admin/notices/:id", requireAuth, requireEditor, updateNotice);
  app.delete("/api/admin/notices/:id", requireAuth, requireEditor, deleteNotice);

  return app;
}
