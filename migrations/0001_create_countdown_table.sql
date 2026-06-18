-- Migration: 0001_create_countdown_table.sql
-- Description: Create countdown settings table for global sync

CREATE TABLE IF NOT EXISTS countdown (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  enabled BOOLEAN NOT NULL DEFAULT 0,
  ends_at TEXT NOT NULL DEFAULT '',
  redirect_url TEXT NOT NULL DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default row if it doesn't exist
INSERT OR IGNORE INTO countdown (id, enabled, ends_at, redirect_url) 
VALUES (1, 0, '', '');
