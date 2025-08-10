# @repo/server

This is the backend server for the my-lab application, built with **Hono.js**. It provides authentication, API endpoints, and serves as the central hub for all backend functionality.

## 🎯 **What Does This Server Do?**

### Core Functions:
1. **🔐 Authentication** - User registration, login, session management via Better Auth
2. **📡 API Layer** - Type-safe RPC endpoints via oRPC for business logic
3. **📚 Documentation** - Auto-generated OpenAPI docs with Scalar UI
4. **🛡️ Security** - CORS, session management, protected routes
5. **🔍 Monitoring** - Health checks and user info endpoints

### Why We Need It:
- **Centralized Auth**: Single source of truth for user authentication
- **Type Safety**: Full-stack type safety between frontend and backend
- **Database Integration**: Secure access to PostgreSQL via Drizzle ORM
- **API Documentation**: Automatically generated and always up-to-date docs
- **Development Experience**: Hot reload, comprehensive error handling

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Server        │    │   Database      │
│   (Next.js)     │◄──►│   (Hono.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Auth Client   │    │ - Better Auth   │    │ - User Tables   │
│ - oRPC Client   │    │ - oRPC Server   │    │ - Posts Tables  │
│ - UI Components │    │ - API Routes    │    │ - Sessions      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 **Project Structure**

```
src/
├── 📄 index.ts          # Entry point - exports the main app
├── 🎯 app.ts            # Main application composition & middleware setup
├── 🔐 auth.ts           # Better Auth configuration
├── ⚙️  config/          # Configuration files
│   ├── cors.ts          # CORS settings for frontend integration
│   ├── server.ts        # Server configuration (ports, URLs)
│   └── index.ts         # Config exports
├── 🛡️  middleware/      # Reusable middleware functions
│   ├── session.ts       # Extract user session from requests
│   ├── rpc.ts           # Handle oRPC requests with context
│   └── index.ts         # Middleware exports
├── 🛣️  routes/          # Route handlers organized by domain
│   ├── auth.ts          # Better Auth endpoints (/api/auth/*)
│   ├── api.ts           # General API routes (/health, /me)
│   ├── docs.ts          # Documentation routes (/openapi)
│   └── index.ts         # Route exports
├── 📚 docs/             # Documentation generation
│   ├── openapi.ts       # Combine Better Auth + oRPC specs
│   ├── scalar.ts        # Generate Scalar UI HTML
│   └── index.ts         # Docs exports
└── 🔧 utils/            # Utilities and type definitions
    ├── types.ts         # TypeScript type definitions
    └── index.ts         # Utils exports
```

## 🚀 **Getting Started**

### Development
```bash
# Start the server with hot reload
bun run dev

# Server will be available at:
# http://localhost:4000
```

### Key Endpoints
```
GET  /health              # Health check
GET  /me                  # Current user info
POST /api/auth/sign-up    # User registration
POST /api/auth/sign-in    # User login
POST /rpc/posts/create    # Create a post (via oRPC)
GET  /rpc/posts/list      # List posts (via oRPC)
GET  /openapi             # API documentation
GET  /openapi/spec.json   # OpenAPI specification
```

## 📋 **How to Add New Features**

### Example: Adding Image Upload Route

Let's say you want to add an image upload feature. Here's the step-by-step process:

#### **Step 1: Plan the Feature**
```
Feature: Image Upload
- Endpoint: POST /api/upload/image
- Authentication: Required
- Input: FormData with image file
- Output: { url: string, id: string }
```

#### **Step 2: Add Route Handler**
Create `src/routes/upload.ts`:
```typescript
import { Hono } from "hono";
import type { Variables } from "../utils";

const uploadRoutes = new Hono<{ Variables: Variables }>();

uploadRoutes.post("/api/upload/image", async (c) => {
  // Check authentication
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get uploaded file
  const body = await c.req.parseBody();
  const file = body.image as File;
  
  if (!file) {
    return c.json({ error: "No image provided" }, 400);
  }

  // TODO: Process file upload (save to storage, validate, etc.)
  const uploadResult = await processImageUpload(file, user.id);
  
  return c.json({
    url: uploadResult.url,
    id: uploadResult.id
  });
});

async function processImageUpload(file: File, userId: string) {
  // Implementation depends on your storage solution:
  // - AWS S3, Cloudinary, local storage, etc.
  // For now, return mock data
  return {
    url: `https://example.com/uploads/${Date.now()}.jpg`,
    id: `img_${Date.now()}`
  };
}

export { uploadRoutes };
```

#### **Step 3: Register the Route**
Update `src/routes/index.ts`:
```typescript
export { apiRoutes } from "./api";
export { authRoutes } from "./auth";
export { docsRoutes } from "./docs";
export { uploadRoutes } from "./upload";  // Add this line
```

#### **Step 4: Add to Main App**
Update `src/app.ts`:
```typescript
import { apiRoutes, authRoutes, docsRoutes, uploadRoutes } from "./routes";

// ... existing middleware setup ...

// 5) API routes (health, me, etc.)
app.route("/", apiRoutes);

// 6) Upload routes  
app.route("/", uploadRoutes);  // Add this line

// 7) Documentation routes
app.route("/", docsRoutes);
```

#### **Step 5: Add Database Schema (if needed)**
If you need to store image metadata in the database:

Update `packages/db/src/schema/core.ts`:
```typescript
export const imagesTable = pgTable("images", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  userId: text("user_id").references(() => user.id),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### **Step 6: Add oRPC Endpoint (Alternative)**
Instead of a direct route, you could add it to the oRPC API:

Update `packages/api/src/routers/upload.ts`:
```typescript
import { requireAuth } from "../middleware";
import * as z from "zod";

export const uploadImage = requireAuth
  .input(z.object({
    imageData: z.string(), // base64 encoded image
    filename: z.string(),
  }))
  .handler(async ({ context, input }) => {
    // Process upload logic here
    return { url: "...", id: "..." };
  });

export const uploadRouter = {
  image: uploadImage,
};
```

#### **Step 7: Test the Feature**
```bash
# Test with curl
curl -X POST http://localhost:4000/api/upload/image \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test-image.jpg" \
  -H "Cookie: your-session-cookie"
```

### 🔄 **General Pattern for New Routes**

1. **🎯 Plan**: Define endpoint, auth requirements, input/output
2. **📁 Create**: New route file in `src/routes/`
3. **🔗 Export**: Add to `src/routes/index.ts`
4. **🎪 Register**: Add to `src/app.ts`
5. **🗄️ Database**: Update schema if needed
6. **🧪 Test**: Verify functionality
7. **📚 Document**: Update this README if needed

### 🔄 **Pattern for oRPC Endpoints**

1. **📁 Create**: New router in `packages/api/src/routers/`
2. **🎯 Define**: Input/output schemas with Zod
3. **🔗 Export**: Add to `packages/api/src/routers/index.ts`
4. **🧪 Test**: Auto-documented in `/openapi`

## 🔧 **Configuration**

### Environment Variables
Create `.env` in the server root:
```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
PORT=4000
NODE_ENV=development
```

### CORS Settings
Update `src/config/cors.ts` to add new origins:
```typescript
export const corsConfig = {
  origin: [
    "http://localhost:3000",  # Next.js frontend
    "http://localhost:3001",  # Add new frontend URL
  ],
  // ... other settings
};
```

## 🐛 **Debugging Tips**

### Common Issues:
1. **CORS Errors**: Check `src/config/cors.ts` has your frontend URL
2. **Auth Issues**: Verify session cookies are being sent
3. **oRPC Errors**: Check `/openapi` for correct request format
4. **Database Errors**: Ensure `@repo/db` package is running migrations

### Useful Endpoints:
- `GET /health` - Check if server is running
- `GET /me` - Check current user session
- `GET /openapi` - View all available API endpoints

## 🚀 **Deployment**

### Production Checklist:
- [ ] Update `src/config/server.ts` with production URLs
- [ ] Set proper environment variables
- [ ] Configure production database
- [ ] Update CORS origins for production frontend
- [ ] Set up proper file upload storage (AWS S3, etc.)

---

This server provides a solid foundation for building scalable backend functionality while maintaining type safety and excellent developer experience! 🎉
