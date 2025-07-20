-- Enable Row Level Security on user_preference table
ALTER TABLE public.user_preference ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preference;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.user_preference;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preference;

-- Create RLS policies for Supabase Auth
CREATE POLICY "Users can view their own preferences" 
ON public.user_preference 
FOR SELECT 
USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preference 
FOR INSERT 
WITH CHECK (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update their own preferences" 
ON public.user_preference 
FOR UPDATE 
USING (user_email = auth.jwt() ->> 'email')
WITH CHECK (user_email = auth.jwt() ->> 'email');