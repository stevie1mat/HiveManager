-- Add DELETE policy for inspections table
-- Run this in your Supabase SQL Editor

CREATE POLICY "Users can delete own inspections"
  ON inspections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hives
      WHERE hives.id = inspections.hive_id
      AND hives.user_id = auth.uid()
    )
  );

