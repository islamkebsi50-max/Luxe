# E-Commerce Platform Design Guidelines

## Design Approach
**Premium & Minimalist Strategy**: Drawing inspiration from modern luxury e-commerce leaders like Allbirds, Everlane, and Warby Parker. Focus on clean product presentation, generous whitespace, and a sophisticated visual hierarchy that adapts based on product category.

## Core Design Principles
1. **Product-First Philosophy**: Products are heroes - generous imagery, clear pricing, minimal distraction
2. **Minimalist Aesthetic**: Embracing whitespace, clean typography, and a calm visual environment
3. **Trust & Clarity**: Professional polish that builds confidence in purchasing decisions
4. **Category-Specific Theming**: Visual adaptation based on product type creates intuitive navigation
5. **Generous Whitespace**: Liberal padding and margins create breathing room and reduce cognitive load

## Premium Visual Foundation

### Base Colors (Light Mode)
- **Background**: Pure white (`#FFFFFF` / `0 0% 100%`)
- **Text Primary**: Dark charcoal (`#2D3D47` / `0 0% 20%`) - not pure black for reduced eye strain
- **Text Secondary**: Soft gray (`#6B7280` / `0 0% 42%`) for supporting content
- **Cards/Panels**: Off-white (`#FAFAFA` / `0 0% 98%`) with subtle borders
- **Borders**: Light gray (`#E5E7EB` / `0 0% 90%`) - minimal visual weight

### Typography System

**Font Families** (via Google Fonts):
- Primary: Inter (400, 500, 600, 700) - Clean, modern, highly legible
- Accent: Playfair Display (600, 700) - Elegant headers and brand moments

**Hierarchy**:
- Hero Headlines: Playfair Display, 5xl-7xl, font-bold, dark charcoal
- Section Headers: Playfair Display, 3xl-4xl, font-bold
- Product Titles: Inter, xl-2xl, font-semibold
- Body Text: Inter, base, font-normal, line-height-relaxed, secondary gray
- Product Prices: Inter, 2xl, font-bold, dark charcoal
- Microcopy: Inter, sm, font-medium, secondary gray

## Dual Theme Color Palette

### Food Category - Fresh & Organic
**Primary Color**: Sage Green (`#059669` / `160 84% 39%`)
- Used for: Food category badges, Food tab active state, "Add to Cart" buttons for food items
- Hover state: Slightly darker sage (`#047857`)
- Light accent: Very light green (`#ECFDF5`) for backgrounds/highlights
- Psychology: Fresh, natural, trustworthy, farm-to-table, healthy

**Secondary Accent**: Warm Earth Orange (`#D97706` / `38 92% 50%`)
- Used for: Secondary CTAs, decorative accents, complementary highlights

### Cosmetics Category - Luxurious & Refined
**Primary Color**: Warm Gold (`#D97706` / `38 92% 50%`)
- Used for: Cosmetics category badges, Cosmetics tab active state, "Add to Cart" buttons for cosmetics
- Hover state: Slightly darker gold (`#B45309`)
- Light accent: Very light gold/cream (`#FFFBEB`) for backgrounds/highlights

**Secondary Accent**: Rose Pink (`#EC4899` / `334 85% 57%`)
- Used for: Premium highlights, decorative accents, special offers
- Creates an upscale, beauty-focused aesthetic

## Spacing & Layout System

**Principle**: Generous whitespace creates premium feel
- Extra-large padding: p-8 to p-12 for major sections
- Standard padding: p-6 for cards and components
- Section spacing: py-20 to py-32 between major sections
- Container max-width: max-w-7xl for content containment
- Card gaps: gap-6 to gap-8 for balanced breathing room

**Grid Structures**:
- Product grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8
- Featured collections: grid-cols-1 md:grid-cols-2 gap-10
- Category toggle: Large, well-spaced buttons with clear visual feedback

## Component Design

### Navigation & Header
- Sticky positioning with minimal border (light gray)
- Logo in serif font, dark charcoal, generous left padding
- Search bar with light gray borders, subtle focus state
- Cart icon with badge - uses category color if applicable
- Category links with color-coded indicators (green for food, gold for cosmetics)

### Product Cards
- White cards with subtle light gray border
- Square aspect ratio images with gentle hover zoom (scale-105)
- Product name in semi-bold Inter, dark charcoal
- Category badge with appropriate dual-theme color
- Price in bold, dark charcoal
- "Add to Cart" button uses dual-theme color matching category
- Shadow on hover (subtle elevation, not harsh drop shadow)
- Generous internal padding (p-6)

### Category Toggle/Tabs
- Large, clear buttons (min-h-10 to min-h-12)
- Background color fills entire button when active
- Uses dual-theme colors (green for food, gold for cosmetics)
- Inactive state: White background with light border
- Transition animations smooth but brisk (200ms)
- Extra padding for touch-friendly interaction

### Forms (Admin)
- Light gray input backgrounds
- Subtle focus states with category color border
- Clear, readable labels in semi-bold Inter
- Generous spacing between form fields
- Category dropdown matches dual-theme

### Whitespace Strategy
- Minimum 20px margin between major sections
- Padding inside cards: p-6 minimum
- Gap between card columns: gap-8 (32px)
- Gap between grid items: gap-6 (24px)
- Hero section padding: py-32
- Standard section padding: py-20

## Visual Interactions

**Hover States**:
- Product cards: Subtle shadow elevation, image scale (105%)
- Buttons: Slightly darker color, maintained category theming
- Links: Slight color shift, no underline until hover

**Active States**:
- Category buttons: Full background color fill with white/contrasting text
- Form inputs: Focus ring in category color (green for food, gold for cosmetics)

**Animations**:
- Transitions: 200ms ease-out for most interactions
- Hover effects: Smooth and subtle, not jarring
- Page transitions: Fade effects, minimal motion

## Accessibility
- Proper heading hierarchy (h1 → h6)
- Focus indicators visible in category colors
- Alt text on all product images
- Color contrast: WCAG AA compliant (dark charcoal on white is 12:1 contrast)
- Font sizes never below 14px for readability
- Line height: 1.6 or greater for body text

## Key Design Rules

1. **Never use pure black** - Always use dark charcoal (#2D3D47)
2. **Maximize whitespace** - More is better than less
3. **One primary color per category** - Green for food, Gold for cosmetics
4. **Clean sans-serif first** - Use serif only for headers and branding
5. **Subtle shadows** - Use elevation sparingly, prefer color/whitespace
6. **Generous padding** - 24px minimum between content and edges
7. **Clear visual hierarchy** - Size and color guide user attention
8. **Dual-theme consistency** - Every category color carries its theme throughout

This design delivers a premium, refined e-commerce experience that feels modern, trustworthy, and beautifully organized.
