# Estate & Estate

Nuxt 4 property website with a designed admin workspace. Admin accounts, properties, permissions, settings and activity are development prototype data held in server process memory.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development prototype authentication

Authentication is deliberately limited to local development. It uses an HMAC-signed, HttpOnly session cookie, scrypt password hashes, one-time expiring reset tokens, and server-side permission checks. This is not a production identity system: reset links are shown in the UI because no email delivery is configured, and data and password changes are lost when the server restarts. The auth endpoints refuse to run in production.

Copy `.env.example` to `.env` and set a unique development password and a random secret with at least 32 characters. The administrator email must match the seeded system administrator, `saimtahir3211@gmail.com`.

```dotenv
NUXT_AUTH_MODE=development-prototype
NUXT_AUTH_SECRET=replace-with-a-random-value-of-at-least-32-characters
NUXT_AUTH_DEMO_ADMIN_EMAIL=saimtahir3211@gmail.com
NUXT_AUTH_DEMO_ADMIN_PASSWORD=replace-with-a-unique-password-of-at-least-12-characters
```

Keep `.env` private and never reuse the prototype password or secret in another environment. Other seeded accounts do not have an initial password; in this prototype, request a one-time development reset link from the forgot-password page.

## Development server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production build

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
