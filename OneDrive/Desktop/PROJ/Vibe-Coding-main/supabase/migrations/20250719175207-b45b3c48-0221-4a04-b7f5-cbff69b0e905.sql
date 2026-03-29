-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  mood TEXT DEFAULT 'neutral',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create soul_rooms table for connecting two users
CREATE TABLE public.soul_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT false,
  plant_health INTEGER DEFAULT 50,
  plant_watered_at TIMESTAMP WITH TIME ZONE,
  candle_lit BOOLEAN DEFAULT false,
  candle_lit_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for chat
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.soul_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'reaction', 'system')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create thoughts table for anonymous thought exchange
CREATE TABLE public.thoughts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.soul_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_revealed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE POLICY "Authenticated users can insert their own messages"
ON messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Authenticated users can insert their own messages"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);





-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soul_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Soul rooms policies
CREATE POLICY "Users can view rooms they're part of" ON public.soul_rooms 
FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create rooms" ON public.soul_rooms 
FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update rooms they're part of" ON public.soul_rooms 
FOR UPDATE USING (auth.uid() = creator_id OR auth.uid() = partner_id);

-- Messages policies
CREATE POLICY "Users can view messages in their rooms" ON public.messages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.soul_rooms 
    WHERE id = messages.room_id 
    AND (creator_id = auth.uid() OR partner_id = auth.uid())
  )
);

CREATE POLICY "Users can insert messages in their rooms" ON public.messages 
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.soul_rooms 
    WHERE id = messages.room_id 
    AND (creator_id = auth.uid() OR partner_id = auth.uid())
  )
);

-- Thoughts policies
CREATE POLICY "Users can view thoughts in their rooms" ON public.thoughts 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.soul_rooms 
    WHERE id = thoughts.room_id 
    AND (creator_id = auth.uid() OR partner_id = auth.uid())
  )
);

CREATE POLICY "Users can insert thoughts in their rooms" ON public.thoughts 
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.soul_rooms 
    WHERE id = thoughts.room_id 
    AND (creator_id = auth.uid() OR partner_id = auth.uid())
  )
);

-- Create function to generate unique room codes
CREATE OR REPLACE FUNCTION generate_room_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_soul_rooms_updated_at
  BEFORE UPDATE ON public.soul_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', 'Anonymous Soul'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for all tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.soul_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.thoughts REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.soul_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.thoughts;