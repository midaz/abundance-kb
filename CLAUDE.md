# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Next.js 15 application for the Abundance Network's Policy Resource Center - a content management system allowing elected officials to browse and search policy resources.

## Key Commands

```bash
# Development
npm run dev          # Start development server with Turbopack on localhost:3000
npm run build        # Create production build
npm start           # Run production server
npm run lint        # Check code with ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router (`/app` directory)
- **Language**: TypeScript with path aliases (`@/*` maps to root)
- **UI**: React 19 + shadcn/ui components (Radix UI based)
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Fonts**: Custom TT Hoves Pro variable font family

### Directory Structure
- `/app`: Next.js App Router pages and layouts
  - `page.tsx`: Main Policy CMS interface with search, filters, and resource grid
  - `layout.tsx`: Root layout with font configuration
- `/components/ui`: shadcn/ui components (button, card, input, select, etc.)
- `/lib/utils.ts`: Contains `cn()` helper for className merging
- `/public/fonts`: Custom TT Hoves Pro font files

### Key Patterns
1. **Component Styling**: Use `cn()` from `@/lib/utils` for conditional classes
2. **UI Components**: Prefer existing shadcn/ui components in `/components/ui`
3. **State Management**: Currently uses React state; no external state library
4. **Data**: Mock data embedded in `app/page.tsx` - ready for API integration

### Design System
- **Primary Color**: Purple (#7A5CFF)
- **Background**: Light cream (#FFF5EB)
- **Components**: Built on shadcn/ui with Tailwind variants
- **Responsive**: Mobile-first with Tailwind breakpoints

## Development Notes
- No test framework currently configured
- ESLint configured for Next.js standards
- Turbopack enabled for faster development builds
- Mock resource data in `app/page.tsx` awaits backend integration