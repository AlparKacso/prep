-- ─────────────────────────────────────────
-- 005_update_mock_data.sql
-- Restructure mock books to reflect Paper → Topic → Book hierarchy.
-- Safe: re-uses existing chapter/question/statement IDs so sessions
-- and progress rows are preserved.
-- Run AFTER 004
-- ─────────────────────────────────────────

-- Step 1: Create 3 topic-specific books (each scoped to one EDAIC topic)
INSERT INTO books (id, title, author, edition, edaic_topic_id) VALUES
  (
    'c1b2c3d4-0001-0001-0000-000000000000',
    'Physiology of the Heart',
    'Arnold M. Katz',
    '5th Edition',
    (SELECT id FROM edaic_topics WHERE title = 'Physiology & Biochemistry' AND paper = 'A')
  ),
  (
    'c1b2c3d4-0001-0002-0000-000000000000',
    'Clinical Pharmacology of Inhalational Anaesthetics',
    'Eger / Saidman / Westhorpe',
    '1st Edition',
    (SELECT id FROM edaic_topics WHERE title = 'Pharmacology' AND paper = 'A')
  ),
  (
    'c1b2c3d4-0001-0003-0000-000000000000',
    'Practical Airway Management',
    'Hung / Murphy',
    '2nd Edition',
    (SELECT id FROM edaic_topics WHERE title = 'General Anaesthesia' AND paper = 'B')
  )
ON CONFLICT (id) DO NOTHING;

-- Step 2: Re-parent chapters to the correct new books
UPDATE chapters
  SET book_id = 'c1b2c3d4-0001-0001-0000-000000000000', order_index = 1
  WHERE id = 'a1b2c3d4-0002-0001-0000-000000000000';   -- Cardiovascular Physiology

UPDATE chapters
  SET book_id = 'c1b2c3d4-0001-0002-0000-000000000000', order_index = 1
  WHERE id = 'a1b2c3d4-0002-0002-0000-000000000000';   -- Pharmacology of Inhalational Agents

UPDATE chapters
  SET book_id = 'c1b2c3d4-0001-0003-0000-000000000000', order_index = 1
  WHERE id = 'a1b2c3d4-0002-0003-0000-000000000000';   -- Airway Management

-- Step 3: Remove the original "Miller's Anesthesia" composite book
-- (chapters have been re-parented above so no cascade occurs)
DELETE FROM books WHERE id = 'a1b2c3d4-0001-0000-0000-000000000000';
