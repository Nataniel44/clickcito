# Agent Instructions for LinksGastronomi

This is a Next.js 15 project for Clickcito - a digital menu/ordering platform for restaurants.

## Project Overview

- **Framework**: Next.js 15.5.6 with React 19
- **Database**: PostgreSQL with Prisma ORM 6.18
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: lucide-react
- **Auth**: JWT with jose library
- **File Storage**: MinIO (S3-compatible)
- **Deployment**: Firebase Hosting

## Build & Development Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint (next/core-web-vitals)
npm run lint:fix     # Auto-fix linting issues (if available)

# Database
npm run seed         # Seed PostgreSQL database (ts-node prisma/seed.js)
npm run seed:firebase # Seed Firebase data (ts-node scripts/seed-firebase.ts)
npx prisma studio     # Open Prisma Studio (database GUI)
npx prisma generate   # Regenerate Prisma client
npx prisma db push    # Push schema changes to database

# Deployment
npm run deploy        # Build + firebase deploy
```

## Testing

This project currently has **no test suite**. If adding tests:
- Use Vitest for unit tests
- Use Playwright for E2E tests
- Run specific tests: `npm test -- --run src/path/to.test.ts`

## Code Style Guidelines

### File Organization

```
app/                    # Next.js App Router pages
  /actions/            # Server Actions
  /components/         # Shared components
  /context/            # React Context providers
  /dashboard/          # Admin dashboard
    /components/       # Dashboard-specific components
  /negocio/[slug]/     # Dynamic restaurant pages
  /explorar/           # Restaurant discovery page
  /login/              # Authentication pages

components/            # Legacy/shared components
  /explorar/          # Explore page components
  /ui/                # Reusable UI primitives
  /hooks/             # Custom React hooks
  /contexts/          # Additional context providers

context/               # Root-level contexts (CartContext)
lib/                   # Utilities (prisma, auth, storage, wordpress)
types/                 # TypeScript type definitions
prisma/                # Database schema and seed data
scripts/               # Database seeding scripts
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `CartSidebar.tsx`, `ProductCard.tsx` |
| Contexts | PascalCase | `CartContext.tsx`, `AuthContext.tsx` |
| Hooks | camelCase with `use` prefix | `useCart.ts`, `useCustomerPhone.ts` |
| Types | PascalCase | `Product.ts`, `CartItem` |
| Server Actions | camelCase with `Action` suffix | `uploadLogoAction.ts` |
| Files (JS) | PascalCase for components | `Hero.jsx`, `HeroBlob.jsx` |
| CSS Classes | kebab-case (Tailwind) | `bg-gray-50`, `text-center` |
| Prisma Models | PascalCase | `Restaurant`, `OrderItem` |
| Prisma Fields | camelCase | `restaurantId`, `whatsappSent` |

### TypeScript Guidelines

- Use TypeScript for new files (`.ts`, `.tsx`)
- Existing JS files (`.js`, `.jsx`) can be used for simpler components
- Export types from `types/` directory
- Define interfaces for component props:

```typescript
interface CartSidebarProps {
    restaurantName: string;
    whatsappNumber?: string;
    primaryColor?: string;
}
```

- Enable strictNullChecks in tsconfig.json

### Component Patterns

**Client Components**: Add `"use client"` at the top:
```typescript
"use client";

import React from 'react';
```

**Server Components**: Default (no directive needed)

**Server Actions**: Add `"use server"` at the top:
```typescript
"use server";

export async function uploadLogoAction(formData: FormData) { ... }
```

**Component Export Style**: Use named exports:
```typescript
export function CartSidebar({ ... }: CartSidebarProps) { ... }
```

### Context & State Patterns

Use the provider pattern with custom hooks:

```typescript
// Context creation
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) { ... }

// Custom hook with error boundary
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
```

### Styling Guidelines

- **Always use Tailwind CSS** for component styling
- Follow the existing color palette from `tailwind.config.js`
- Support dark mode with `dark:` prefix where needed
- Use `className` for inline Tailwind classes
- Avoid inline styles except for dynamic values (e.g., `style={{ backgroundColor: primaryColor }}`)

### Import Organization

1. React / Next.js imports
2. Third-party libraries (lucide-react, etc.)
3. Internal imports (context, components, lib)
4. Type imports

```typescript
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
```

Use path aliases:
- `@/*` maps to project root

### Error Handling

- Use try/catch for async operations
- Provide user-friendly error messages
- Log errors appropriately for debugging
- For server actions, throw errors (not return):

```typescript
export async function uploadLogoAction(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");
    // ...
}
```

### Prisma Guidelines

- Use PascalCase for model names
- Use camelCase for field names
- Always define relations explicitly
- Use `onDelete: Cascade` for related records
- Add appropriate indexes with `@@unique`

```prisma
model Restaurant {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  categories  Category[]
  @@unique([restaurantId, slug])
}
```

### API Patterns

**Server Actions** (preferred for Next.js 15):
- Put in `app/actions/` directory
- Name with `Action` suffix
- Return data or throw errors

**Route Handlers** (for REST-like endpoints):
- Put in `app/api/` directory
- Use proper HTTP methods

### Linting & Formatting

- ESLint config extends `next/core-web-vitals`
- Run `npm run lint` before committing
- Fix issues with ESLint auto-fix

## Common Tasks

### Adding a new restaurant page
1. Create `app/negocio/[slug]/page.tsx` as Server Component
2. Fetch restaurant data from Prisma
3. Pass data to client components

### Adding a dashboard panel
1. Create component in `app/dashboard/components/`
2. Add to dashboard sidebar navigation
3. Connect to Prisma for data

### Adding new product type
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update `types/product.ts` with TypeScript types
4. Update relevant components

## Environment Variables

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- Firebase configuration variables
- MinIO configuration for file uploads

## Deployment

The project uses Firebase Hosting. Deploy with:
```bash
npm run deploy
```

This runs `npm run build && firebase deploy`.
