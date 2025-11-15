-- Add DELETE policy for harvests table
-- Run this in your Supabase SQL Editor

CREATE POLICY "Users can delete own harvests"
  ON harvests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hives
      WHERE hives.id = harvests.hive_id
      AND hives.user_id = auth.uid()
    )
  );

