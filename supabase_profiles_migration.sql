-- =====================================================
-- PROFILES TABLE MIGRATION
-- =====================================================
-- This migration creates a profiles table linked to auth.users
-- with automatic profile creation on user signup

-- =====================================================
-- 1. CREATE PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_premium BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add index on id for faster lookups
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- =====================================================
-- 2. CREATE TRIGGER FUNCTION
-- =====================================================
-- This function automatically creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, is_premium)
  VALUES (NEW.id, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. CREATE TRIGGER
-- =====================================================
-- Trigger fires after a new user is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE RLS POLICIES
-- =====================================================

-- Policy: Users can read their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (optional, for future use)
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Allow service role to insert profiles (for trigger)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- 6. CREATE FUNCTION TO UPDATE updated_at TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================
-- Grant access to authenticated users
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- To apply this migration:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Create a new query
-- 3. Paste this entire SQL file
-- 4. Click "Run" to execute
-- 
-- To verify:
-- SELECT * FROM public.profiles;
-- =====================================================

