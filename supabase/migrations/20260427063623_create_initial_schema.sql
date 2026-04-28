/*
  # Create initial schema for Robux Store

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `roblox_username` (text, nullable)
      - `created_at` (timestamptz)
    - `purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `robux_amount` (integer)
      - `price` (bigint) - price in IDR
      - `roblox_username` (text)
      - `payment_method` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamptz)
    - `reviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Profiles: users can read all, update own
    - Purchases: users can read own, insert own
    - Reviews: anyone can read, authenticated can insert own, users can delete own

  3. Important Notes
    - Anti-spam: one review per user per day using trigger
    - Rating validated to be between 1 and 5
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  roblox_username text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  robux_amount integer NOT NULL,
  price bigint NOT NULL,
  roblox_username text NOT NULL,
  payment_method text NOT NULL DEFAULT 'transfer',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text NOT NULL CHECK (length(content) >= 1 AND length(content) <= 500),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Anti-spam: prevent more than one review per user per day via trigger
CREATE OR REPLACE FUNCTION check_review_spam()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM reviews
    WHERE user_id = NEW.user_id
    AND created_at >= date_trunc('day', now())
    AND created_at < date_trunc('day', now()) + interval '1 day'
  ) THEN
    RAISE EXCEPTION 'You can only submit one review per day';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_one_review_per_day ON reviews;
CREATE TRIGGER enforce_one_review_per_day
  BEFORE INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION check_review_spam();

-- Index for faster review queries
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases (user_id);
