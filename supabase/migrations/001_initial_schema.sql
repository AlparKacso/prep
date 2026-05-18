-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  email       text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- BOOKS
-- ─────────────────────────────────────────
create table public.books (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  author      text,
  edition     text,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- CHAPTERS
-- ─────────────────────────────────────────
create table public.chapters (
  id          uuid primary key default uuid_generate_v4(),
  book_id     uuid references public.books on delete cascade not null,
  title       text not null,
  order_index integer not null default 0,
  content     text,  -- pasted content used as AI generation context
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- TOPICS
-- ─────────────────────────────────────────
create table public.topics (
  id          uuid primary key default uuid_generate_v4(),
  chapter_id  uuid references public.chapters on delete cascade not null,
  title       text not null,
  order_index integer not null default 0
);

-- ─────────────────────────────────────────
-- QUESTIONS
-- ─────────────────────────────────────────
create table public.questions (
  id           uuid primary key default uuid_generate_v4(),
  chapter_id   uuid references public.chapters on delete cascade not null,
  topic_id     uuid references public.topics on delete set null,
  stem         text not null,
  explanation  text,
  source       text not null default 'ai_generated' check (source in ('ai_generated', 'esaic_sample')),
  status       text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz,
  reviewed_by  uuid references public.profiles on delete set null
);

-- ─────────────────────────────────────────
-- STATEMENTS (5 per question, MTF format)
-- ─────────────────────────────────────────
create table public.statements (
  id           uuid primary key default uuid_generate_v4(),
  question_id  uuid references public.questions on delete cascade not null,
  order_index  integer not null check (order_index between 1 and 5),
  text         text not null,
  is_correct   boolean not null,
  explanation  text,
  unique (question_id, order_index)
);

-- ─────────────────────────────────────────
-- SESSIONS
-- ─────────────────────────────────────────
create table public.sessions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.profiles on delete cascade not null,
  chapter_id    uuid references public.chapters on delete cascade not null,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz
);

-- ─────────────────────────────────────────
-- ANSWERS
-- ─────────────────────────────────────────
create table public.answers (
  id            uuid primary key default uuid_generate_v4(),
  session_id    uuid references public.sessions on delete cascade not null,
  question_id   uuid references public.questions on delete cascade not null,
  statement_id  uuid references public.statements on delete cascade not null,
  user_answer   boolean not null,
  is_correct    boolean not null,
  answered_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- PROGRESS (aggregated per user per chapter)
-- ─────────────────────────────────────────
create table public.progress (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references public.profiles on delete cascade not null,
  chapter_id       uuid references public.chapters on delete cascade not null,
  questions_seen   integer not null default 0,
  correct_total    integer not null default 0,
  last_practiced   timestamptz,
  unique (user_id, chapter_id)
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────
create index on public.questions (chapter_id, status);
create index on public.sessions (user_id, chapter_id);
create index on public.answers (session_id);
create index on public.progress (user_id);
