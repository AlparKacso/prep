# prep — Project Context for Claude Code

## What is prep?

prep is a web app for EDAIC Part I exam preparation, targeting Romanian and Eastern European anaesthesia residents (ATI = Anestezie și Terapie Intensivă). It generates MTF (Multiple True/False) questions in the exact EDAIC Part I format, organized by bibliography chapter, with progress tracking per user.

**EDAIC Part I format:** 2 papers × 60 MTF questions. Each MTF question has a stem + 5 independent true/false statements. No negative marking.

---

## Business Context

- **Target market:** ~200 Romanian ATI year-5 residents/year who sit EDAIC Part I as a mandatory specialization exam. Broader Eastern Europe adds ~500–1,000 more annually.
- **No official link to ESAIC or EDAIC** — branding must be clearly independent.
- **ATI** is the Romanian acronym for the specialty (Anestezie și Terapie Intensivă). The name `prep` is the working title.
- **MVP monetization:** out of scope. No tiers, no payments in MVP.
- **Revenue model (future):** €15–30/month or €80–120/year subscription.

---

## MVP Scope

### In scope
1. Authentication (email/password + magic link)
2. Student UI/UX flow: dashboard → chapter → practice → results
3. AI-generated questions limited to 1 sample question list + 1 book (admin-seeded)
4. Admin section for bibliography management and question review queue
5. Progress tracking per user per chapter

### Out of scope (MVP)
- Subscription tiers
- Payments (Stripe)
- Multi-language support
- Mobile app
- Leaderboards / social features
- On-demand generation by students (admin-triggered only)

---

## Tech Stack

Identical to the Kidvo project stack:

| Layer | Technology |
|---|---|
| Frontend + API | Next.js 15 (App Router) |
| Hosting | Vercel (5th project: `prep`) |
| Database + Auth | Supabase (new isolated project) |
| Email | Resend via `noreply@kidvo.eu` |
| AI generation | Anthropic API (`claude-sonnet-4-20250514`) |
| Domain | `prep.kidvo.eu` → GoDaddy CNAME → Vercel |

**Env vars required:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
RESEND_API_KEY
NEXT_PUBLIC_SITE_URL
```

---

## Architecture

```
prep.kidvo.eu
     │
     ├── Next.js 15 (App Router)
     │     ├── /app/(auth)          → login, signup
     │     ├── /app/(app)           → dashboard, chapter, practice, results
     │     ├── /app/admin           → bibliography, review queue
     │     └── /app/api             → generate, progress, auth/signout
     │
     ├── Supabase
     │     ├── Auth (email + magic link)
     │     ├── Database (9 tables, see schema below)
     │     └── RLS (users see only own data; admins see all)
     │
     └── Anthropic API
           └── Admin-triggered MTF question generation
```

---

## Database Schema

```
profiles       → extends auth.users; role: 'user' | 'admin'
books          → reference books (title, author, edition)
chapters       → chapters within a book; contains `content` field for AI context
topics         → topics within a chapter
questions      → stem, source (ai_generated | esaic_sample), status (pending_review | approved | rejected)
statements     → 5 per question; text, is_correct, explanation
sessions       → user practice session per chapter
answers        → individual statement answers within a session
progress       → aggregated per user per chapter (questions_seen, correct_total)
```

**Key constraints:**
- `statements.order_index` is 1–5, unique per question
- Questions must be `status = 'approved'` to be visible to students
- `progress` has unique constraint on `(user_id, chapter_id)`

---

## User Roles

| Role | Access |
|---|---|
| `user` | Dashboard, chapter view, practice, results, own progress |
| `admin` | Everything above + admin section, bibliography CRUD, question review queue, trigger generation |

Admin role is set manually in Supabase table editor (`profiles.role = 'admin'`).

---

## Core User Flows

### Student flow
```
Sign up → Email confirm → Dashboard
Dashboard → Chapter list (with progress bars) → Chapter detail
Chapter detail → "Start Practice" → Practice mode
Practice mode → MTF question (stem + 5 T/F statements) → Submit → See answers + explanations → Next question
Last question → Results page (score, per-statement breakdown) → Dashboard
```

### Admin flow
```
/admin → Stats overview (pending, approved, chapters)
/admin/bibliography → Add book → Add chapter (paste content) → "Generate 5 Qs" button
/admin/queue → Review AI-generated questions → Approve / Reject
```

### AI generation flow
```
Admin clicks "Generate 5 Qs" for a chapter
→ POST /api/generate { chapter_id }
→ Fetch chapter content from DB
→ Fetch up to 3 ESAIC sample questions as style reference
→ Send to Claude with MTF prompt
→ Parse JSON response (5 questions × 5 statements)
→ Insert into questions + statements tables as status: 'pending_review'
→ Admin reviews in queue → approves → visible to students
```

---

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/generate` | POST | Admin only. Triggers Claude generation for a chapter. |
| `/api/progress` | POST | Submit session answers, update progress table. |
| `/api/progress` | GET | Fetch all progress for current user. |
| `/api/auth/signout` | POST | Sign out via Supabase. |
| `/auth/callback` | GET | Magic link / OAuth callback handler. |

---

## Claude Generation Prompt Structure

```
System: Expert anaesthesiology examiner. EDAIC Part I MTF format.
        Return ONLY valid JSON array. No markdown, no preamble.

User:   Chapter: {chapter.title}
        Content: {chapter.content}
        Sample ESAIC questions for style: {up to 3 approved esaic_sample questions}

        Generate {count} MTF questions. Each must have:
        - stem (string)
        - explanation (string)
        - statements: array of exactly 5 objects:
            { order_index: 1-5, text, is_correct: bool, explanation }

        Mix of true and false statements. Difficulty: year 5 resident.
```

---

## File Structure

```
prep/
├── middleware.ts                          # Auth protection + admin guard
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
├── .env.example
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql         # All tables + trigger
│       └── 002_rls_policies.sql           # RLS + is_admin() helper
└── src/
    ├── types/index.ts                     # All TypeScript types
    ├── middleware.ts                      # (old location — now root)
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts                  # Browser client
    │   │   └── server.ts                  # Server client + service role client
    │   └── anthropic/
    │       └── generate.ts               # generateQuestions() function
    ├── components/
    │   └── practice/
    │       └── PracticeClient.tsx         # MTF question UI (client component)
    └── app/
        ├── layout.tsx                     # Root layout (DM Sans font)
        ├── globals.css                    # Design system (CSS variables + components)
        ├── page.tsx                       # Redirects to /dashboard
        ├── auth/callback/route.ts         # Magic link handler
        ├── (auth)/
        │   ├── login/
        │   │   ├── page.tsx
        │   │   └── AuthForm.tsx           # Shared login/signup form
        │   └── signup/page.tsx
        ├── (app)/
        │   ├── dashboard/page.tsx         # Chapter list + overall progress
        │   ├── chapter/[id]/page.tsx      # Chapter detail + CTA
        │   ├── practice/[chapter_id]/page.tsx  # Loads questions, creates session
        │   └── results/[session_id]/page.tsx   # Score + per-statement breakdown
        ├── admin/
        │   ├── page.tsx                   # Admin home with stats
        │   ├── bibliography/
        │   │   ├── page.tsx
        │   │   └── BibliographyClient.tsx # Book/chapter CRUD + generate trigger
        │   └── queue/
        │       ├── page.tsx
        │       └── QueueClient.tsx        # Approve/reject queue
        └── api/
            ├── generate/route.ts
            ├── progress/route.ts
            └── auth/signout/route.ts
```

---

## Design System

Dark theme. CSS variables defined in `globals.css`:

```css
--bg:         #0f1117   /* page background */
--bg-card:    #161b27   /* card background */
--bg-subtle:  #1c2333   /* inputs, subtle backgrounds */
--border:     #2a3448
--text:       #e8edf5
--text-muted: #6b7fa3
--accent:     #3d8ef0   /* primary blue */
--success:    #22c55e
--error:      #ef4444
--warning:    #f59e0b
```

Font: `DM Sans` (body) + `DM Mono` (mono). Loaded via `next/font/google`.

Reusable CSS classes: `.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.input`, `.label`, `.badge`, `.progress-bar`, `.statement-row`, `.tf-btn`

---

## Key Decisions & Constraints

- **Admin-gated question approval:** AI-generated questions must be reviewed and approved by an admin before students can see them. This is non-negotiable for medical accuracy.
- **Service role client for generation:** `/api/generate` uses `createServiceClient()` (bypasses RLS) to insert questions. All other operations use the standard anon client with RLS.
- **No on-demand generation by students** in MVP. Generation is admin-triggered only.
- **Shuffle questions** on practice page load (server-side `Math.random()` sort).
- **Progress is additive:** each session adds to `progress.questions_seen` and `progress.correct_total`. It does not reset.
- **Middleware location:** `middleware.ts` must be at the project root (not inside `src/`).

---

## Local Development

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev                   # http://localhost:3000
```

Supabase setup:
1. Create new Supabase project (region: Frankfurt eu-central-1)
2. Run `001_initial_schema.sql` then `002_rls_policies.sql` in SQL Editor
3. Auth settings → add redirect URL: `http://localhost:3000/auth/callback`
4. After first signup → set `profiles.role = 'admin'` in table editor

---

## Future (Post-MVP)

- Stripe subscription (€15–30/month)
- Multiple books / full EDAIC syllabus coverage
- Per-topic progress breakdown
- Weak area detection and spaced repetition
- Romanian language UI option
- EDAIC Part II SOE (oral exam) preparation module
- Landing page at `prep.kidvo.eu`
