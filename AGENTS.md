# AGENTS.md - Coding Agent Guidelines

## Project Overview

Clickcito is a Next.js 15 e-commerce platform for local gastronomy businesses in Misiones, Argentina. Built with the App Router, Firebase (Firestore, Auth, Storage), Tailwind CSS, and MinIO for image storage.

## Build / Dev / Lint Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint (next/core-web-vitals)
npm run deploy       # Build + Firebase deploy
npm run seed:firebase # Seed Firestore database (ts-node)
```

**No test framework is configured.** There are no test files, no test runner in dependencies, and no test scripts. Do not assume Jest, Vitest, or any other testing tool is available.

## Project Structure

```
app/                  # Next.js App Router pages & layouts
  actions/            # Server Actions ("use server")
  components/         # App-specific shared components
  context/            # React Context providers (AuthContext, CartContext)
  dashboard/          # Dashboard page & sub-components
  firebase/           # Firebase client config & Firestore helpers
  services/           # Business logic services
  utils/              # Utility functions
components/           # Global shared components (outside app/)
context/              # Root-level context (CartContext.tsx)
lib/                  # Core libraries (auth, minio, prisma, storage, wordpress)
types/                # TypeScript type definitions
scripts/              # One-off scripts (seed, migration)
```

## Code Style Guidelines

### File Types & Directives
- Use `.tsx` for React components, `.ts` for utilities and server code
- Mix of `.js` and `.tsx` exists in the codebase (e.g., `app/page.js`, `app/layout.js`); new files should use `.tsx`/`.ts`
- Always add `"use client"` at the top of client components
- Always add `"use server"` at the top of Server Actions

### Imports
- Use `@/` path alias for imports from project root (e.g., `@/lib/minio`, `@/app/context/AuthContext`)
- Group imports: React/Next first, then third-party, then local
```tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
```

### TypeScript
- `strict` mode is OFF, but `strictNullChecks` is ON
- Use `any` sparingly but it is tolerated in this codebase (especially for Firestore data)
- Define interfaces/types in `types/` directory or inline near usage
- Export types with `export type` or `export interface`
```tsx
interface ProductCardProps {
    product: Product;
    primaryColor?: string;
}
```

### Naming Conventions
- **Components**: PascalCase (`ProductCard`, `CartSidebar`)
- **Functions/handlers**: camelCase (`handleCambiarEstado`, `addToCart`)
- **Files**: PascalCase for components (`ProductCard.tsx`), camelCase for utilities (`compressImage.ts`)
- **Firestore collections**: snake_case (`transacciones`, `productos_catalogo`, `negocios`)
- **Firestore fields**: snake_case (`id_negocio`, `precio_unitario`, `createdAt`)
- Spanish used in comments, variable names, and UI text

### React Patterns
- Custom hooks pattern: `export function useCart() { ... }` with context validation
- Context providers exported from dedicated files in `app/context/` or `components/contexts/`
- Heavy use of `useMemo` and `useEffect` in dashboard pages
- Firebase `onSnapshot` for real-time data subscriptions with cleanup functions

### Styling
- Tailwind CSS exclusively — no CSS modules or styled-components
- Dark mode classes used: `dark:bg-zinc-900`, `dark:text-white`
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Common patterns: `rounded-2xl`, `shadow-xl`, `transition-all`, `active:scale-95`

### Error Handling
- `try/catch` blocks with `toast.error()` for user-facing errors
- `console.error()` for developer debugging
- Firebase errors caught and displayed via `react-hot-toast`
```tsx
try {
    await updateDoc(ref, data);
    toast.success("Actualizado");
} catch {
    toast.error("Error al actualizar");
}
```

### Firebase Patterns
- Client SDK initialized in `app/firebase/config.ts` with singleton pattern
- Firestore helpers in `app/firebase/db.ts` (CRUD operations)
- Avoid multiple app initialization: `!getApps().length ? initializeApp(...) : getApp()`
- Use `onSnapshot` for real-time listeners, always return cleanup function

## Key Dependencies

- `next@^15.5.6` (App Router, Server Actions)
- `firebase@^12.10.0` / `firebase-admin@^13.7.0`
- `react@^19.0.0` / `react-dom@^19.0.0`
- `tailwindcss@^3.4.1`
- `lucide-react` for icons
- `react-hot-toast` for notifications
- `minio` for object storage


## Environment Variables

Required in `.env.local` (never commit these):
- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config
- `JWT_SECRET` — Auth token signing
- `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY` — File storage

## Important Notes

- `reactStrictMode` is OFF in next.config.mjs
- Console logs are stripped in production via `compiler.removeConsole`
- Server Actions have a 10MB body size limit
- The `.agents/rules/` directory exists but contains an empty rules file
- No Cursor rules (`.cursorrules`, `.cursor/rules/`) or Copilot instructions exist
