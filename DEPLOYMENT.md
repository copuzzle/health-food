# Vercel + Neon Deployment

This project deploys cleanly to Vercel with a Neon Postgres database. No ECS instance is required.

## 1. Create Neon

1. Create a Neon project.
2. Copy the Postgres connection string.
3. Use the connection string as `DATABASE_URL`.

## 2. Create Vercel Project

1. Push this repository to GitHub.
2. Import the GitHub repository in Vercel.
3. Framework preset: `Next.js`.
4. Build command: `npm run build`.

## 3. Environment Variables

Set these in Vercel:

```bash
DATABASE_URL="postgresql://..."
SESSION_SECRET="a-long-random-production-secret"
NEXT_PUBLIC_AMAP_KEY=""
```

`SESSION_SECRET` is required in production because login cookies are signed.

## 4. Run Database Migrations

Before the first production deploy, run migrations against the Neon database:

```bash
DATABASE_URL="postgresql://..." npm run prisma:deploy
```

Run the same command whenever new Prisma migrations are added.

## 5. Verify Before Deploy

```bash
npm run deploy:check
```

## Notes

- GitHub Pages alone cannot run the API routes or Prisma.
- Vercel runs the Next.js API routes as serverless functions.
- Neon provides the managed Postgres database.
- The current auth is email + password with scrypt password hashing and signed HTTP-only cookies.
