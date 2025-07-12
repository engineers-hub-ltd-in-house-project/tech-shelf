# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL FAILURES TO NEVER REPEAT 🚨

### [MANDATORY] NEVER DESTROY app.css!!!

**The Disaster**: Tried to "fix" Skeleton UI + TailwindCSS v4 compatibility by editing app.css repeatedly, ultimately deleting everything and turning the site into a blank white page. User was FURIOUS.

**[MANDATORY] ABSOLUTE RULE**:

```css
/* app.css MUST ONLY contain these 2 lines. DO NOT TOUCH! */
@import 'tailwindcss';
@import '@skeletonlabs/skeleton';
```

### [MANDATORY] NO BAND-AID FIXES!

- [MANDATORY] DO NOT delete/comment out code just because you see an error
- [MANDATORY] THINK: "Why is only this page broken when others work?"
- [MANDATORY] UNDERSTAND the root cause before making ANY changes

### [MANDATORY] CONSISTENT AUTHENTICATION PATTERN!

- [MANDATORY] ALWAYS use `requireAuth()` helper - NO EXCEPTIONS
- [MANDATORY] USE `throw redirect(303, '/login')` - DO NOT forget `throw`
- [MANDATORY] Parse cookies with `JSON.parse()` - NO hacky `split(':')` nonsense

**[MANDATORY] REMEMBER**: The user said "ABSOLUTELY, not probably!" These are not suggestions.

## Project Overview

Tech Shelf is a learning platform for programming and technology, built with:

- **Frontend**: SvelteKit v2 with TypeScript
- **Styling**: TailwindCSS v4 + Skeleton UI (注意: 互換性問題あり)
- **Database**: SQLite with Prisma ORM
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Authentication**: Mock authentication using cookies (開発用)

## Essential Commands

```bash
# Development
npm run dev              # Start development server (port 5173)
npm run dev:setup       # Setup database and start dev server

# Database
npm run db:setup        # Run migrations and seed
npm run db:migrate      # Run Prisma migrations
npm run db:seed         # Seed database with test data
npm run db:reset        # Reset database (destructive)
npx prisma studio       # Open Prisma Studio GUI

# Testing
npm run test            # Run all tests
npm run test:unit       # Run unit tests only
npm run test:e2e        # Run Playwright E2E tests
npm run test:watch      # Run tests in watch mode

# Code Quality
npm run check           # Run svelte-check for type checking
npm run lint            # Run Prettier and ESLint checks
npm run format          # Auto-format code with Prettier

# Build
npm run build           # Production build
npm run preview         # Preview production build
```

## Critical Architecture Decisions

### Authentication Pattern

The app uses a mock authentication system stored in cookies:

```typescript
// Always use the auth-helper for consistency
import { requireAuth } from '$lib/server/auth-helper';
const user = await requireAuth(cookies);
```

### Database Schema

Key models in `prisma/schema.prisma`:

- `User` - Users with author role
- `BlogPost` - Blog articles with publishing workflow
- `Book` - E-books with chapters
- `BookCreationProject` - Projects to convert blog posts into books
- `Tag` - Shared tags for blogs and books

### Routing Structure

```
src/routes/
├── (auth)/         # Authentication pages (login/logout)
├── (app)/          # Main app pages (requires auth)
│   ├── blog/       # Blog functionality
│   ├── books/      # E-book reader
│   └── book-projects/ # Book creation projects
└── api/            # API endpoints
```

### UI Components and Styling

**重要**: TailwindCSS v4 と Skeleton UI には互換性問題があります：

- Skeleton UIのコンポーネントをimportしないでください
- クラス名のみを使用してください（例: `class="card"`, `class="btn variant-filled-primary"`）
- `app.css`は以下の2行のみにしてください：

```css
@import 'tailwindcss';
@import '@skeletonlabs/skeleton';
```

### Testing Strategy

- Unit tests: Test server-side logic with mocked Prisma
- Integration tests: Test API endpoints
- E2E tests: Test critical user flows with Playwright

## Common Issues and Solutions

### Skeleton UI Compatibility

If you encounter `@variant` errors with TailwindCSS v4:

1. Do NOT modify `app.css` beyond the basic imports
2. Do NOT import Skeleton UI components directly
3. Use only class names from Skeleton UI

### Authentication Errors

If authentication fails:

1. Check cookie format: `JSON.parse(authCookie)`
2. Use `throw redirect(303, '/login')` not just `redirect()`
3. Always use `requireAuth()` helper for consistency

### Database Issues

- Run `npm run db:reset` if schema changes cause conflicts
- Use `npx prisma db push` for quick schema updates during development
- Check seed data in `prisma/seed.ts` for test users

## Development Workflow

1. **Feature Development**:
   - Create/modify Prisma schema
   - Run `npx prisma db push` to update database
   - Implement server-side logic in `+page.server.ts`
   - Create UI in `+page.svelte`
   - Write tests for new functionality

2. **Before Committing**:
   - Run `npm run check` to verify types
   - Run `npm run lint` to check code style
   - Run `npm run test` to ensure tests pass
   - Never commit if type checking or tests fail

## File Naming Conventions

- Components: PascalCase (e.g., `BlogCard.svelte`)
- Routes: kebab-case directories
- Server files: `+page.server.ts`, `+server.ts`
- Types: `$lib/types/*.ts`
- Utilities: `$lib/utils/*.ts`
