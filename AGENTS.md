# Project Agent Instructions

## Collaboration Boundary

- Default to local development only.
- Do not commit, push, create pull requests, run production migrations, or deploy to production unless the user explicitly asks for that action in the current request.
- When the user asks to "run", "check", "try", or "show the effect", use the local development server and local database by default.
- If a change requires production-impacting work, explain the impact and wait for explicit confirmation before acting.

## Product Scope

- This is a mobile-first health food logging MVP.
- Current priority is the personal daily record flow.
- Map and restaurant features exist in the codebase but are hidden from the main navigation for now.
- The app must present itself as a self-recording and information aggregation tool, not medical diagnosis or treatment advice.

## Local Development Notes

- Prefer validating changes with local commands such as `npm run lint`, `npm run test`, and `npm run build`.
- Use the local Next.js dev server for UI checks.
- Treat local test users and local database data as disposable unless the user says otherwise.
- Keep production credentials and database URLs out of terminal output and documents.

## Deployment Notes

- Production deployment is not part of normal development workflow.
- Vercel, Neon, GitHub push, and production Prisma migrations are production-affecting operations.
- Only run those operations after an explicit user request such as "部署", "上线", "推送到 GitHub", or equivalent.
