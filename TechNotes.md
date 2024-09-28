# Important Tech Notes Related to the Project

## References

- [Video 1](https://www.youtube.com/watch?v=dLRKV-bajS4&t=1289s)
- [Video 2](https://www.youtube.com/watch?v=TyV12oBDsYI)
- [Video 3](https://www.youtube.com/watch?v=lXITA5MZIiI&t=2824s)

## Tech Stack Overview

- Next.js
- Prisma - Drizzel
- ESLint, Prettier, T3 Env
- PNPM
- TypeScript & JavaScript
- ShadCN/UI, Tailwind CSS
- Neon, Vercel (PostgreSQL) - PlanetScale (MySQL), Supabase
- [Lucia](https://lucia-auth.com/), - Auth.js, [Clerk](https://clerk.com/), [Kinde](https://kinde.com/),  [Lucia Auth or NextAuth](https://blog.ronanru.com/lucia-auth-vs-next-auth/)

## Importance of Naming Relations (e.g., UserSessions)

- **Clarity of Relationships**: Naming provides clear context about the relationship between models.

- **Multiple Relationships**: Distinguishes between different relationships between the same models (e.g., User and Session).

- **Ease of Querying**: Makes it simpler to understand and manage queries when using an ORM like Prisma.

- **Management in Complex Schemas**: Helps simplify the handling of relationships in more intricate data models.

- **Avoiding Ambiguity**: Without a name, Prisma generates a default name, which may lead to confusion and errors in complex queries.

Using named relations improves clarity, especially in complex applications, making future maintenance easier
