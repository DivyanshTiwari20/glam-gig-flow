-- Add template column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_template TEXT DEFAULT 'classic';