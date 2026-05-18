-- Add content field to books for full book text (used for book-level AI generation)
ALTER TABLE books ADD COLUMN IF NOT EXISTS content TEXT;
