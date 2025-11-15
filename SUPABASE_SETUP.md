# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Note your project's URL and anon key from Settings > API

## 2. Set Up Environment Variables

Create a `.env` file in the root of your project:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Or if using Vite naming convention:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace:
- `your-project` with your actual Supabase project reference ID
- `your-anon-key` with your Supabase anon/public key

You can find these values in your Supabase dashboard under Settings > API.

## 3. Database Schema

You need to create the following tables in your Supabase database:

### Users Table (already exists in Supabase)
- Managed by Supabase Auth (in `auth.users` table)

### Hives Table

Run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE hives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id text NOT NULL,
  queen_status text,
  strength text,
  last_inspection_date timestamptz,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hives ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own hives"
  ON hives FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hives"
  ON hives FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hives"
  ON hives FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own hives"
  ON hives FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hives_updated_at
  BEFORE UPDATE ON hives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Inspections Table

```sql
CREATE TABLE inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id uuid NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  date timestamptz NOT NULL,
  general_health text NOT NULL,
  queen_status text NOT NULL,
  temperament text,
  swarm_cells text,
  diseases text,
  brood_frames integer,
  honey_frames integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own inspections"
  ON inspections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hives
      WHERE hives.id = inspections.hive_id
      AND hives.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own inspections"
  ON inspections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hives
      WHERE hives.id = inspections.hive_id
      AND hives.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own inspections"
  ON inspections FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hives
      WHERE hives.id = inspections.hive_id
      AND hives.user_id = auth.uid()
    )
  );
```

### Harvests Table

```sql
CREATE TABLE harvests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hive_id uuid NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
  date date NOT NULL,
  quantity numeric NOT NULL,
  unit text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own harvests"
  ON harvests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM hives
      WHERE hives.id = harvests.hive_id
      AND hives.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own harvests"
  ON harvests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM hives
      WHERE hives.id = harvests.hive_id
      AND hives.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own harvests"
  ON harvests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM hives
      WHERE hives.id = harvests.hive_id
      AND hives.user_id = auth.uid()
    )
  );
```

**Note:** If you created the `harvests` table before the `notes` column was added, run the migration in `add_harvests_notes_column.sql` to add the `notes` column.

**Note:** If you need to enable deletion of harvests, run the migration in `add_harvests_delete_policy.sql` to add the DELETE policy.

## 4. Authentication Setup

Supabase handles authentication automatically. The app will:
- Sign up users with email/password
- Sign in users
- Manage sessions automatically
- Include auth tokens in API requests

### Email Confirmation (Optional)

By default, Supabase may require email confirmation. You can:
1. Disable it in Authentication > Settings > Email Auth
2. Or handle email confirmation in your app

## 5. Testing

1. Start your app: `npm start`
2. Try registering a new user
3. Create a hive
4. Add an inspection
5. Log a harvest

## Troubleshooting

- **API errors**: Check that your tables and RLS policies are set up correctly
- **Auth errors**: Verify your Supabase URL and anon key are correct
- **Connection issues**: Make sure your device/emulator can reach Supabase
- **RLS errors**: Ensure Row Level Security policies are created and enabled

## Column Naming

Supabase uses snake_case for database columns, but the app uses camelCase. The HiveContext automatically maps between them:
- `hive_id` ↔ `hiveId`
- `queen_status` ↔ `queenStatus`
- `last_inspection_date` ↔ `lastInspectionDate`
- `general_health` ↔ `generalHealth`
- `swarm_cells` ↔ `swarmCells`
- `user_id` ↔ `userId`
- `created_at` ↔ `createdAt`
- `updated_at` ↔ `updatedAt`

