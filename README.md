# SubTracker

Track your monthly subscriptions and see exactly how much you spend.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up the database (creates prisma/dev.db)
npm run db:push

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account, and start adding subscriptions.

## Features

- Register / login (each user sees only their own data)
- Add subscriptions: name, price, billing cycle (monthly/yearly), category, next billing date
- Dashboard with total monthly & yearly costs
- Yearly subscriptions automatically converted to monthly equivalent
- Most expensive subscriptions highlighted
- Upcoming payments sorted by due date (today / soon indicators)
- Delete subscriptions

## Stack

- **Next.js 14** (App Router)
- **Prisma** + **SQLite** (local database file at `prisma/dev.db`)
- **NextAuth** (JWT sessions, credentials provider)
- **Tailwind CSS**

## Environment Variables

Copy `.env.example` to `.env` and adjust if needed:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-me-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

> For production, set `NEXTAUTH_SECRET` to a long random string and update `NEXTAUTH_URL`.
