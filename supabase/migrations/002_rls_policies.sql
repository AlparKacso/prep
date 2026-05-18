-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY POLICIES
-- ─────────────────────────────────────────

-- Enable RLS on all tables
alter table public.profiles   enable row level security;
alter table public.books       enable row level security;
alter table public.chapters    enable row level security;
alter table public.topics      enable row level security;
alter table public.questions   enable row level security;
alter table public.statements  enable row level security;
alter table public.sessions    enable row level security;
alter table public.answers     enable row level security;
alter table public.progress    enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- ─────────────────────────────────────────
-- BOOKS (public read, admin write)
-- ─────────────────────────────────────────
create policy "Anyone can read books"
  on public.books for select
  using (true);

create policy "Admins can manage books"
  on public.books for all
  using (public.is_admin());

-- ─────────────────────────────────────────
-- CHAPTERS (public read, admin write)
-- ─────────────────────────────────────────
create policy "Anyone can read chapters"
  on public.chapters for select
  using (true);

create policy "Admins can manage chapters"
  on public.chapters for all
  using (public.is_admin());

-- ─────────────────────────────────────────
-- TOPICS (public read, admin write)
-- ─────────────────────────────────────────
create policy "Anyone can read topics"
  on public.topics for select
  using (true);

create policy "Admins can manage topics"
  on public.topics for all
  using (public.is_admin());

-- ─────────────────────────────────────────
-- QUESTIONS
-- ─────────────────────────────────────────
create policy "Users can read approved questions"
  on public.questions for select
  using (status = 'approved' or public.is_admin());

create policy "Admins can manage all questions"
  on public.questions for all
  using (public.is_admin());

-- ─────────────────────────────────────────
-- STATEMENTS
-- ─────────────────────────────────────────
create policy "Users can read statements of approved questions"
  on public.statements for select
  using (
    exists (
      select 1 from public.questions q
      where q.id = question_id and (q.status = 'approved' or public.is_admin())
    )
  );

create policy "Admins can manage statements"
  on public.statements for all
  using (public.is_admin());

-- ─────────────────────────────────────────
-- SESSIONS
-- ─────────────────────────────────────────
create policy "Users can manage own sessions"
  on public.sessions for all
  using (auth.uid() = user_id);

create policy "Admins can read all sessions"
  on public.sessions for select
  using (public.is_admin());

-- ─────────────────────────────────────────
-- ANSWERS
-- ─────────────────────────────────────────
create policy "Users can manage own answers"
  on public.answers for all
  using (
    exists (
      select 1 from public.sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

create policy "Admins can read all answers"
  on public.answers for select
  using (public.is_admin());

-- ─────────────────────────────────────────
-- PROGRESS
-- ─────────────────────────────────────────
create policy "Users can manage own progress"
  on public.progress for all
  using (auth.uid() = user_id);

create policy "Admins can read all progress"
  on public.progress for select
  using (public.is_admin());
