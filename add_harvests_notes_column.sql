-- Add notes column to harvests table
-- Run this in your Supabase SQL Editor

ALTER TABLE harvests
ADD COLUMN IF NOT EXISTS notes text;

