-- ─────────────────────────────────────────
-- 004_edaic_topics.sql
-- Paper-aware EDAIC taxonomy, book→topic link, session config
-- Run AFTER 001, 002, 003
-- ─────────────────────────────────────────

-- Official EDAIC Part I topic taxonomy (Paper A + Paper B)
CREATE TABLE IF NOT EXISTS edaic_topics (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  paper       TEXT        NOT NULL CHECK (paper IN ('A', 'B')),
  title       TEXT        NOT NULL,
  color       TEXT        NOT NULL DEFAULT '#6B7280',
  order_index INTEGER     NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Books now belong to exactly one EDAIC topic
ALTER TABLE books
  ADD COLUMN IF NOT EXISTS edaic_topic_id UUID REFERENCES edaic_topics(id) ON DELETE SET NULL;

-- Extend sessions: make chapter_id optional + add practice config
ALTER TABLE sessions ALTER COLUMN chapter_id DROP NOT NULL;

ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS mode          TEXT    NOT NULL DEFAULT 'study'
    CHECK (mode IN ('study', 'exam')),
  ADD COLUMN IF NOT EXISTS config_paper  TEXT
    CHECK (config_paper IN ('A', 'B')),
  ADD COLUMN IF NOT EXISTS config_topics TEXT[],
  ADD COLUMN IF NOT EXISTS config_books  TEXT[],
  ADD COLUMN IF NOT EXISTS config_count  INTEGER;

-- ─────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────

ALTER TABLE edaic_topics ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read topics
CREATE POLICY "edaic_topics_read"
  ON edaic_topics FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can fully manage topics
CREATE POLICY "edaic_topics_admin_all"
  ON edaic_topics FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ─────────────────────────────────────────
-- Seed 16 official EDAIC Part I topics
-- Paper A = cool tones  |  Paper B = warm tones
-- ─────────────────────────────────────────

INSERT INTO edaic_topics (paper, title, color, order_index) VALUES
  -- Paper A — Basic Sciences
  ('A', 'Anatomy',                             '#14B8A6', 1),
  ('A', 'Pharmacology',                        '#8B5CF6', 2),
  ('A', 'Physiology & Biochemistry',           '#3B82F6', 3),
  ('A', 'Physiological Measurement',           '#06B6D4', 4),
  ('A', 'Physics & Principles of Measurement', '#7C3AED', 5),
  ('A', 'Statistics',                          '#10B981', 6),
  -- Paper B — Clinical Anaesthesiology & Intensive Care
  ('B', 'Preoperative Assessment',             '#F97316',  7),
  ('B', 'General Anaesthesia',                 '#EF4444',  8),
  ('B', 'Regional Anaesthesia',                '#F59E0B',  9),
  ('B', 'Obstetric Anaesthesia & Analgesia',   '#A21CAF', 10),
  ('B', 'Special Anaesthesia',                 '#6366F1', 11),
  ('B', 'Perioperative Care',                  '#059669', 12),
  ('B', 'Resuscitation & Emergency Medicine',  '#DC2626', 13),
  ('B', 'Intensive Care',                      '#2563EB', 14),
  ('B', 'Chronic Pain Management',             '#92400E', 15),
  ('B', 'Current Literature',                  '#475569', 16)
ON CONFLICT DO NOTHING;
