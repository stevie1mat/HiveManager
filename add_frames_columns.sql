-- Add brood_frames and honey_frames columns to inspections table
-- Run this in your Supabase SQL Editor

ALTER TABLE inspections
ADD COLUMN IF NOT EXISTS brood_frames integer,
ADD COLUMN IF NOT EXISTS honey_frames integer;

