
-- Create a table to store user preferences
CREATE TABLE public.user_preference (
  user_email TEXT PRIMARY KEY,
  preferences JSON NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_preference ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to manage their own preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preference 
  FOR SELECT 
  USING (user_email = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can insert their own preferences" 
  ON public.user_preference 
  FOR INSERT 
  WITH CHECK (user_email = (auth.jwt() ->> 'email'));

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preference 
  FOR UPDATE 
  USING (user_email = (auth.jwt() ->> 'email'));

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_preference_updated_at 
    BEFORE UPDATE ON public.user_preference 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
