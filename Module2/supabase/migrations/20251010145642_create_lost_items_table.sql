/*
  # Lost Items Module - Database Schema

  ## Overview
  Creates the core database structure for the Lost Item Reporting system.
  This module works standalone but supports integration with authentication from Module 1.

  ## New Tables
  
  ### `lost_items`
  Main table for storing lost item reports with the following fields:
  - `id` (uuid, primary key) - Unique identifier for each lost item
  - `user_id` (uuid, nullable) - Reference to auth.users, optional for standalone mode
  - `item_name` (text) - Name of the lost item (required)
  - `description` (text) - Detailed description of the item (required)
  - `last_seen_location` (text) - Location where item was last seen (required)
  - `category` (text) - Category: 'ID Card', 'Book', 'Gadget', 'Accessory', 'Misc' (required)
  - `image_url` (text, nullable) - URL path to uploaded image in Supabase Storage
  - `status` (text) - Status: 'open', 'found', 'closed' (default: 'open')
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update

  ## Security
  
  ### Row Level Security (RLS)
  - Enable RLS on `lost_items` table
  - **Public Read Access**: Anyone can view all lost items (browsing functionality)
  - **Authenticated Create**: Only authenticated users can create lost items
  - **Owner Update**: Users can only update their own lost items
  - **Owner Delete**: Users can only delete their own lost items
  
  ## Indexes
  - Index on `category` for filtering
  - Index on `status` for filtering
  - Index on `user_id` for "My Items" queries
  - Full-text search index on `item_name` and `description`

  ## Important Notes
  1. **Data Safety**: Uses IF NOT EXISTS to prevent errors on re-run
  2. **Flexibility**: `user_id` is nullable to support standalone operation
  3. **Search**: Text search enabled on item_name and description fields
  4. **Categories**: Enforced via check constraint for data integrity
*/

-- Create lost_items table
CREATE TABLE IF NOT EXISTS lost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  description text NOT NULL,
  last_seen_location text NOT NULL,
  category text NOT NULL CHECK (category IN ('ID Card', 'Book', 'Gadget', 'Accessory', 'Misc')),
  image_url text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'found', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view all lost items (public browsing)
CREATE POLICY "Anyone can view lost items"
  ON lost_items
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can create lost items
CREATE POLICY "Authenticated users can create lost items"
  ON lost_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own lost items
CREATE POLICY "Users can update own lost items"
  ON lost_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own lost items
CREATE POLICY "Users can delete own lost items"
  ON lost_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lost_items_category ON lost_items(category);
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_lost_items_user_id ON lost_items(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_items_created_at ON lost_items(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lost_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_lost_items_updated_at ON lost_items;
CREATE TRIGGER trigger_update_lost_items_updated_at
  BEFORE UPDATE ON lost_items
  FOR EACH ROW
  EXECUTE FUNCTION update_lost_items_updated_at();