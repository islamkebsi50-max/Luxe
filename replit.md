# E-Commerce Platform

## Overview

This is a modern, bilingual (English/Arabic) e-commerce platform built for selling premium organic products and cosmetics. The application features a minimalist, luxury-focused design inspired by brands like Allbirds and Everlane, with category-specific theming that adapts visual elements based on product types (nuts, grains, spices, dried fruits, organic products, and cosmetics).

The platform emphasizes a product-first philosophy with generous whitespace, clean typography, and a calm visual environment that builds trust and confidence in purchasing decisions. It supports session-based shopping carts, product browsing with advanced filtering, and a streamlined checkout process.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: shadcn/ui components (based on Radix UI primitives) with Tailwind CSS for styling. The design system implements a dual-theme approach where food/organic products use sage green accents while cosmetics use warm gold/pink accents.

**Routing**: Wouter for client-side routing (lightweight alternative to React Router).

**State Management**: 
- TanStack Query (React Query) for server state management, data fetching, and caching
- Local React state for UI interactions (cart drawer visibility, search queries, filters)
- LanguageContext for managing bilingual content (English/Arabic with RTL support)

**Design System**:
- Typography: Inter (primary) and Playfair Display (accent/headers) from Google Fonts
- Color palette adapts based on product category (food = sage green, cosmetics = warm gold)
- Responsive design with mobile-first approach
- Custom elevation system using CSS custom properties for hover/active states

**Key Pages**:
- HomePage: Hero carousel, category browsing, featured products, bundle offers
- ProductListingPage: Filterable product grid with search, category, price range, and sorting
- ProductDetailPage: Image gallery, quantity selection, related products, accordion details
- CheckoutPage: Multi-step form for shipping information and order placement
- AdminPage: Product management (CRUD operations) with image upload support

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with the following endpoints:
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST/PUT/DELETE /api/admin/products` - Admin product management
- `GET /api/cart` - Fetch cart items for current session
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item
- `POST /api/orders` - Place order

**Session Management**: Cookie-based sessions using `cookie-parser`. Each user gets a unique session ID stored in an HTTP-only cookie that persists for 30 days. This session ID links anonymous users to their cart items.

**Database Layer**: Storage abstraction pattern with `IStorage` interface implemented by either `FirestoreStorage` (for Firestore backend) or `MemoryStorage` (for development without Firebase credentials). This allows for flexible database implementations without changing business logic.

**Development vs Production**:
- Development: Memory storage by default (no external database required)
- Production (with Firebase): Firestore backend with imgbb for image hosting
- Static file serving from pre-built `dist/public` directory

**Seed Data**: Automatic seeding on startup with sample products.

### Data Storage

**Database Options**:
1. **Development (Default)**: In-memory storage (`MemoryStorage`) - no external configuration needed
2. **Production (Optional)**: Cloud Firestore with Firebase Admin SDK

**Image Hosting**: imgbb API for converting and hosting uploaded images as URLs

**Schema Design** (defined in `shared/schema.ts`):

1. **Products Table**:
   - Primary fields: id (UUID), name, description, price, originalPrice, category, image
   - Arrays: images[], tags[]
   - Metadata: rating, reviewCount, inStock, featured
   - All product data is strongly typed with Zod validation schemas

2. **Cart Items Table**:
   - Links sessionId to productId with quantity
   - Ephemeral data (cleared after checkout)
   - No user authentication required

3. **Orders Table**:
   - Stores order history with shipping details
   - Items stored as JSON string
   - Includes total, shipping address fields

**Type Safety**: Shared types between frontend and backend through `@shared/schema` imports. Zod schemas provide both TypeScript types and runtime validation.

### Authentication & Authorization

**Current Implementation**: Anonymous session-based shopping using browser cookies. No user accounts or authentication system.

**Admin Access**: Secret URL path (`/admin-panel-secret`) accessible by clicking "Privacy Policy" in footer 7 times consecutively. No password protection implemented.

**Future Considerations**: The architecture supports adding proper authentication (user accounts, JWT tokens, role-based access control) without major refactoring.

### Design Patterns

**Component Composition**: Extensive use of compound components (Card, Form, Dialog) for flexible UI building.

**Container/Presentational Pattern**: Pages act as smart containers managing data fetching and state, while components remain presentational.

**Custom Hooks**: 
- `useToast` for notification system
- `useLanguage` for bilingual content management
- `useIsMobile` for responsive behavior

**Optimistic Updates**: Cart mutations use React Query's optimistic update pattern for instant UI feedback.

## External Dependencies

### Third-Party Services

**Image Hosting**: imgbb (requires `IMGBB_API_KEY`) - converts uploaded image files to permanent URLs

**Firebase (Optional for Production)**:
- Firestore database for persistent data storage
- Firebase Admin SDK for server-side operations

**CDN/Assets**: 
- Google Fonts API for Inter and Playfair Display typefaces
- imgbb for product images
- Local `/attached_assets/generated_images/` for reference

**Communication**: WhatsApp Business integration via WhatsAppButton component (configurable phone number).

### Key NPM Packages

**UI & Styling**:
- `@radix-ui/*` - Accessible UI primitives (30+ components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe component variants
- `lucide-react` - Icon library

**Forms & Validation**:
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration for forms

**Data Fetching**:
- `@tanstack/react-query` - Server state management
- `firebase-admin` - Firebase Admin SDK for server-side database operations

**Image Handling**:
- `form-data` - Multipart form data for image uploads

**Development**:
- `vite` - Build tool and dev server
- `tsx` - TypeScript execution for Node.js
- `@replit/vite-plugin-*` - Replit-specific development plugins

### Environment Variables

Optional (for Firestore backend):
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_API_KEY` - Firebase API key (for client-side configuration)
- `FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `FIREBASE_PRIVATE_KEY` - Firebase service account private key (for server-side admin SDK)
- `FIREBASE_CLIENT_EMAIL` - Firebase service account client email
- `IMGBB_API_KEY` - imgbb API key for image uploads

Development:
- Uses in-memory storage by default (no configuration needed)
- Falls back to memory storage if Firebase credentials are missing

Development Tools:
- `REPL_ID` - Replit environment identifier (for dev plugins)