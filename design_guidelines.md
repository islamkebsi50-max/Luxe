# E-Commerce Platform Design Guidelines

## Design Approach
**Reference-Based Strategy**: Drawing inspiration from modern e-commerce leaders like Shopify, Allbirds, and Everlane. Focus on clean product presentation, immersive imagery, and seamless shopping experience.

## Core Design Principles
1. **Product-First Philosophy**: Products are heroes - generous imagery, clear pricing, minimal distraction
2. **Trust & Clarity**: Professional polish that builds confidence in purchasing decisions
3. **Effortless Shopping Flow**: Reduce friction from discovery to checkout
4. **Category-Specific Branding**: Green accents for Food products, Gold/Pink accents for Cosmetics

## Color Palette

### Food Category - Green
- Primary: `#10B981` (Emerald Green)
- Light: `#D1FAE5` (Light Green)
- Dark: `#065F46` (Dark Green)
- Uses: Food category badges, Food tab active state, Food product highlights

### Cosmetics Category - Gold/Pink
- Primary: `#D97706` (Amber Gold)
- Accent: `#EC4899` (Rose Pink)
- Light: `#FED7AA` (Light Gold)
- Dark: `#92400E` (Dark Gold)
- Uses: Cosmetics category badges, Cosmetics tab active state, Cosmetics product highlights

## Typography System

**Font Families** (via Google Fonts):
- Primary: Inter (400, 500, 600, 700) - UI elements, body text, pricing
- Accent: Playfair Display (600, 700) - Headers, brand moments

**Hierarchy**:
- Hero Headlines: text-5xl to text-7xl, font-bold, Playfair Display
- Product Titles: text-xl to text-2xl, font-semibold, Inter
- Section Headers: text-3xl to text-4xl, font-bold
- Body Text: text-base, font-normal, leading-relaxed
- Product Prices: text-2xl, font-bold for current price, text-lg line-through for original
- Microcopy (labels, captions): text-sm, font-medium

## Layout & Spacing System

**Tailwind Spacing Units**: Consistently use 4, 6, 8, 12, 16, 20, 24, 32
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-32
- Card gaps: gap-6 to gap-8
- Container max-width: max-w-7xl

**Grid Structures**:
- Product grids: grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
- Featured collections: grid-cols-1 md:grid-cols-2 gap-8
- Category cards: grid-cols-2 md:grid-cols-4 gap-4

## Component Library

### Navigation
- Sticky header with logo left, search center, cart/account right
- Category links for Food and Cosmetics with color-coded indicators
- Breadcrumb navigation on product/category pages
- Mobile: Hamburger menu with slide-out drawer

### Product Cards
- Square aspect ratio image (1:1) with hover zoom effect
- Product name, price prominently displayed
- Quick add to cart button on hover (desktop)
- Category-colored badge based on product type
- Rating stars below title
- Color-coded borders based on category

### Shopping Cart
- Slide-out drawer from right (desktop), full-page (mobile)
- Line items with thumbnail, title, quantity selector, price, remove
- Sticky footer with subtotal and checkout CTA
- Free shipping progress indicator

### Product Detail Page
- Large image gallery: main image + 4-6 thumbnails in grid below
- Right panel: Title, price, star rating, short description
- Size/variant selector with visual swatches
- Quantity selector + prominent "Add to Cart" button
- Accordion sections: Description, Specifications, Shipping, Reviews
- "You May Also Like" carousel below

### Search & Filters
- Sidebar filters (category, price range) on desktop
- Bottom sheet filters on mobile
- Active filters displayed as dismissible tags
- Sort dropdown: Featured, Price Low-High, Price High-Low, Newest

### Checkout Flow
- Multi-step with progress indicator: Cart → Shipping → Payment → Confirm
- Form fields with clear labels, validation states
- Order summary sticky sidebar (desktop)
- Trust badges near payment section

## Images

**Hero Section**: 
- Full-width hero banner (h-screen or min-h-[600px]) featuring lifestyle product photography
- 2-3 images rotating in subtle crossfade carousel
- Overlay with heading + CTA button (blurred background for button: backdrop-blur-md bg-white/20)

**Product Images**:
- High-quality product photography on clean white/light gray backgrounds
- Lifestyle shots showing products in use
- 1200x1200px minimum resolution for main product images

**Category Banners**:
- 16:9 aspect ratio hero images for each category page
- Atmospheric lifestyle photography relevant to category

**Additional Imagery**:
- About/Story section: Team photos, behind-the-scenes manufacturing
- Instagram feed grid showing user-generated content
- Trust indicators: Payment logos, security badges, shipping icons

**Image Placement**:
- Homepage: Large hero, featured collections (3-4 with images), category grid (6-8 with images)
- Product pages: Gallery of 5-7 images per product
- Footer: Payment method logos

## Interactions & States

**Micro-interactions**:
- Product card image scale on hover (scale-105)
- Smooth cart drawer slide animation
- Quantity button haptic feedback (slight scale on click)
- Form field focus states with border accent
- Category tab smooth transitions

**Loading States**:
- Skeleton screens for product grids
- Spinner for cart updates
- Progress bar for checkout steps

## Accessibility
- Proper heading hierarchy (h1 → h6)
- ARIA labels on interactive elements (cart button, search)
- Keyboard navigation for all interactions
- Focus indicators on all clickable elements (ring-2)
- Alt text for all product images

## Key Pages Structure

**Homepage**: Category toggle (Food/Cosmetics) → Product grid filtered by category → Featured collections → Newsletter signup → Footer

**Product Listing**: Breadcrumb → Filters sidebar + Product grid (4-column) → Load more/pagination

**Product Detail**: Breadcrumb → Image gallery + Details panel → Related products → Footer

**Cart/Checkout**: Persistent header → Content area → Sticky summary (desktop) → Footer

This design delivers a premium, conversion-optimized e-commerce experience with modern aesthetics and intuitive user flows.
