# Estate & Estate

An editorial real estate agency website built with Astro SSR, Tailwind CSS v4, Neon PostgreSQL, Drizzle ORM, and Zod.

## Local setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to the Neon PostgreSQL connection string.
2. Configure `STAFF_EMAIL`, `STAFF_PASSWORD`, and a unique `SESSION_SECRET` of at least 32 characters for private property management.
3. Optionally set `BUSINESS_EMAIL`, `BUSINESS_PHONE`, `BUSINESS_ADDRESS`, and `BUSINESS_SERVICE_AREA` to display the business details you choose to publish.
4. Optionally set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to enable signed image uploads. Staff can still enter an image URL without Cloudinary.
5. Apply the database schema in `drizzle/0001_estate_schema.sql` to the Neon database.
6. Start Astro with `astro dev --background` (stop, check, and read logs with `astro dev stop`, `astro dev status`, and `astro dev logs`).

## Routes

- `/` — agency homepage
- `/properties` — published properties only
- `/properties/[slug]` — published property detail and inquiry entry point
- `/contact` — validated visitor inquiry form
- `/admin` — staff login, create, publish, unpublish, and delete listings
- `/admin/[id]` — staff property editor
- `/api/admin/upload` — authenticated Cloudinary image upload endpoint (enabled only when credentials are configured)

Listings are drafts by default. Public visitors cannot create listings or access staff operations. The website contains architectural photography for visual presentation, but it is explicitly illustrative and is not represented as the agency's property inventory.

## Build

Use the existing Bun scripts (`bun run dev`, `bun run build`, and `bun run preview`). No extra frontend framework is used.
