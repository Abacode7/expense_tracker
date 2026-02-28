---
name: frontend-aesthetics
description: Design distinctive, creative frontends that avoid generic AI aesthetics. Use when creating or styling UI components, pages, or layouts to ensure unique, delightful designs.
allowed-tools: Read, Edit, Write, Glob, Grep, WebSearch
---

# Frontend Aesthetics

Design and implement a distinctive, creative frontend that surprises and delights. Avoid generic "AI slop" aesthetics.

**Target**: $ARGUMENTS (or main page/component if not specified)

## Core Principles

### Typography

Choose fonts that are **beautiful, unique, and interesting**.

**Avoid these generic fonts:**
- Inter, Roboto, Arial, system fonts
- Space Grotesk (overused in AI outputs)
- Open Sans, Lato, Montserrat

**Consider distinctive alternatives:**
- Display serifs: Fraunces, Instrument Serif, Playfair Display
- Geometric sans: Bricolage Grotesque, Syne, Cabinet Grotesk, Satoshi
- Brutalist/expressive: Clash Display, Bebas Neue, Archivo Black
- Vintage revivals: DM Serif Display, Cormorant, Libre Baskerville

### Color & Theme

**Commit to a cohesive aesthetic** - no safe middle ground.

- Use CSS variables for consistency
- **Dominant colors with sharp accents** outperform timid, evenly-distributed palettes
- Vary between light and dark themes based on context

**Draw inspiration from:**
- IDE themes: Dracula, Nord, Catppuccin, Rosepine, Gruvbox, Tokyo Night
- Cultural aesthetics: Japanese minimalism, Memphis design, Swiss modernism, Y2K, Art Deco
- Unexpected palettes: forest greens, terracotta, deep navy, mustard, coral, sage, burgundy

**Avoid:**
- Purple gradients on white backgrounds
- Blue-to-purple gradients
- Generic SaaS color schemes

### Motion & Animation

Prioritize **high-impact moments** over scattered micro-interactions.

- Use CSS-only solutions when possible
- Use Motion library (framer-motion) for React when available
- Focus on:
  - Well-orchestrated page loads with staggered reveals (animation-delay)
  - Meaningful state transitions
  - Intentional hover effects

### Backgrounds & Atmosphere

Create **atmosphere and depth** rather than defaulting to solid colors.

- Layer CSS gradients (mesh gradients, radial gradients, conic gradients)
- Use geometric patterns or contextual effects
- Consider subtle noise textures, grain overlays
- Match background treatment to overall aesthetic

## What to Avoid

- Overused font families
- Clichéd color schemes (purple/blue gradients)
- Predictable layouts and component patterns
- Cookie-cutter card designs with rounded corners and shadows
- Generic hero sections with centered text
- Safe, corporate aesthetics that lack personality

## Implementation Steps

1. **Analyze context** - What is this app for? Who uses it?
2. **Choose a distinctive direction** - Commit to an aesthetic concept
3. **Select typography** - Pick 1-2 fonts that elevate the design
4. **Define color system** - Create CSS variables for a cohesive palette
5. **Design key moments** - Plan entrance animations and transitions
6. **Add atmospheric elements** - Background treatments, textures, depth
7. **Refine details** - Shadows, borders, spacing that feel intentional

## Output

When applying this skill:
- Update component/page with distinctive styling
- Define CSS variables for the color/theme system
- Add required font imports (Google Fonts or similar)
- Include animation definitions (CSS keyframes or framer-motion)
