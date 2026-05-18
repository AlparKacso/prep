# prep

EDAIC Part I MTF practice platform.

## Local setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env.local`
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Required variables:
```
NEXT_PUBLIC_SUPABASE_URL=       # from Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # from Supabase project settings → API
SUPABASE_SERVICE_ROLE_KEY=      # from Supabase project settings → API
ANTHROPIC_API_KEY=              # from console.anthropic.com
RESEND_API_KEY=                 # from resend.com (optional for local)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up Supabase
1. Create a new project at supabase.com
2. Go to SQL Editor and run both migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
3. In Supabase Auth settings → enable Email provider
4. Set your redirect URL: `http://localhost:3000/auth/callback`

### 4. Make yourself admin
After signing up via the app, go to Supabase table editor → `profiles` → find your row → set `role` to `admin`.

### 5. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Flow

1. Sign up / log in
2. Admin: go to `/admin/bibliography` → add a book → add a chapter with content → click "Generate 5 Qs"
3. Admin: go to `/admin/queue` → review and approve questions
4. Student: go to `/dashboard` → pick a chapter → practice

## Project structure

```
src/
├── app/
│   ├── (auth)/login & signup     # Auth pages
│   ├── (app)/dashboard           # Chapter list + progress
│   ├── (app)/chapter/[id]        # Chapter detail
│   ├── (app)/practice/[id]       # MTF practice mode
│   ├── (app)/results/[id]        # Session results
│   ├── admin/                    # Admin pages
│   └── api/                      # generate, progress, auth
├── components/practice/          # MTF question UI
├── lib/supabase/                 # client, server, service
├── lib/anthropic/                # question generation
└── types/                        # shared TypeScript types
```
