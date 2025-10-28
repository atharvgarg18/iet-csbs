# Netlify Functions API Documentation

This folder contains serverless functions deployed to Netlify. The API has been split into focused, modular functions for better performance and cold start times.

## Shared Utilities

Located in `_shared/` directory:

- **supabase.js** - Supabase client initialization
- **auth.js** - Authentication helpers (session verification, password hashing, role checks)
- **http.js** - HTTP utilities (CORS headers, JSON responses, error handling)

## API Endpoints

### Authentication - `auth.js`

Handles user authentication and session management.

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check session validity
- `GET /api/auth/test` - Health check

### Debug/Health Check - `ping.js`

Simple health check and environment debug endpoints.

- `GET /api/ping` - Simple health check
- `GET /api/debug` - Environment configuration info

### User Management - `admin-users.js`

Admin-only user CRUD operations. Requires admin role.

- `GET /api/admin-users` - List all users
- `POST /api/admin-users` - Create new user
- `PUT /api/admin-users/:id` - Update user
- `DELETE /api/admin-users/:id` - Delete user

### System Management - `admin.js`

Manage batches, sections, and dashboard stats. Requires editor/admin role.

- `GET /api/admin/batches` - List batches
- `POST /api/admin/batches` - Create batch
- `PUT /api/admin/batches/:id` - Update batch
- `DELETE /api/admin/batches/:id` - Delete batch
- `GET /api/admin/sections` - List sections
- `POST /api/admin/sections` - Create section
- `PUT /api/admin/sections/:id` - Update section
- `DELETE /api/admin/sections/:id` - Delete section
- `GET /api/admin/stats` - Dashboard statistics

### Notes Management - `admin-notes.js`

Manage academic notes. Requires editor/admin role.

- `GET /api/admin-notes` - List all notes
- `POST /api/admin-notes` - Create note
- `PUT /api/admin-notes/:id` - Update note
- `DELETE /api/admin-notes/:id` - Delete note

### Papers Management - `admin-papers.js`

Manage question papers. Requires editor/admin role.

- `GET /api/admin-papers` - List all papers
- `POST /api/admin-papers` - Create paper
- `PUT /api/admin-papers/:id` - Update paper
- `DELETE /api/admin-papers/:id` - Delete paper

### Gallery Management - `admin-gallery.js`

Manage gallery categories and images. Requires editor/admin role.

- `GET /api/admin-gallery/categories` - List categories
- `POST /api/admin-gallery/categories` - Create category
- `PUT /api/admin-gallery/categories/:id` - Update category
- `DELETE /api/admin-gallery/categories/:id` - Delete category
- `GET /api/admin-gallery/images` - List images
- `POST /api/admin-gallery/images` - Create image
- `PUT /api/admin-gallery/images/:id` - Update image
- `DELETE /api/admin-gallery/images/:id` - Delete image

### Notices Management - `admin-notices.js`

Manage notice categories and notices. Requires editor/admin role.

- `GET /api/admin-notices/categories` - List categories
- `POST /api/admin-notices/categories` - Create category
- `PUT /api/admin-notices/categories/:id` - Update category
- `DELETE /api/admin-notices/categories/:id` - Delete category
- `GET /api/admin-notices` - List all notices
- `POST /api/admin-notices` - Create notice
- `PUT /api/admin-notices/:id` - Update notice
- `DELETE /api/admin-notices/:id` - Delete notice

## Migration from Old API

The old monolithic `api.js` (1491 lines) has been split into:

1. **Shared utilities** (3 files, ~150 lines) - Reusable helpers
2. **Auth function** (~180 lines) - Authentication only
3. **Ping/Debug function** (~40 lines) - Health checks
4. **Admin users function** (~150 lines) - User management
5. **Admin management function** (~230 lines) - Batches, sections, stats
6. **Notes function** (~110 lines) - Notes CRUD
7. **Papers function** (~110 lines) - Papers CRUD
8. **Gallery function** (~180 lines) - Gallery management
9. **Notices function** (~180 lines) - Notices management

### Benefits

- **Faster cold starts**: Each function is smaller (~150 lines vs 1491)
- **Better caching**: Functions are cached separately
- **Improved organization**: Clear separation of concerns
- **Easier maintenance**: Focused, single-responsibility functions
- **Better error isolation**: Issues in one area don't affect others

### Updating Frontend Code

Replace old API paths with new ones:

```diff
- POST /api/auth/login
+ POST /api/auth (login endpoint)

- GET /api/admin/users
+ GET /api/admin-users

- GET /api/admin/batches
+ GET /api/admin/batches (same path, different function)

- GET /api/admin/notes
+ GET /api/admin-notes

- GET /api/admin/papers
+ GET /api/admin-papers

- GET /api/admin/gallery-images
+ GET /api/admin-gallery/images

- GET /api/admin/notices
+ GET /api/admin-notices
```

## Environment Variables

Required in Netlify dashboard:

- `VITE_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (admin access)

## Development

All functions support CORS and handle preflight OPTIONS requests automatically.

Standard response format:
```json
{
  "success": true,
  "data": { ... }
}
```

Error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```
