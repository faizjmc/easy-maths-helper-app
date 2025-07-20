
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface UserData {
  tabs: {
    tabData: { [key: string]: string };
    tabNames: { [key: string]: string };
    activeTab: string;
    tabCount: number;
  };
  settings: {
    textToSpeech: boolean;
    symbolSize: number;
    highContrast: boolean;
  };
}

export const saveUserPreferences = async (preferences: UserData): Promise<void> => {
  try {
    // Get current user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) {
      console.error('No authenticated user found');
      toast("Error", {
        description: "You must be logged in to save preferences",
      });
      return;
    }

    const email = user.email;
    console.log('Saving user preferences for:', email);
    console.log('Preferences data:', preferences);
    
    // Use upsert to either insert or update
    const { error } = await supabase
      .from('user_preference')
      .upsert({
        user_email: email,
        preferences: preferences as any
      }, {
        onConflict: 'user_email'
      });

    if (error) {
      console.error('Error saving preferences:', error);
      toast("Error", {
        description: "Failed to save your preferences",
      });
    } else {
      console.log('Preferences saved successfully for:', email);
      toast("Success", {
        description: "Your preferences have been saved",
      });
    }
  } catch (error) {
    console.error('Error in saveUserPreferences:', error);
    toast("Error", {
      description: "Failed to save your preferences",
    });
  }
};

export const loadUserPreferences = async (): Promise<UserData | null> => {
  try {
    // Get current user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) {
      console.error('No authenticated user found');
      return null;
    }

    const email = user.email;
    console.log('Loading user preferences for:', email);
    
    const { data, error } = await supabase
      .from('user_preference')
      .select('preferences')
      .eq('user_email', email)
      .maybeSingle();

    if (error) {
      console.error('Error loading preferences:', error);
      toast("Error", {
        description: "Failed to load your preferences",
      });
      return null;
    }

    if (data && data.preferences) {
      console.log('Preferences loaded successfully for:', email);
      console.log('Loaded data:', data.preferences);
      toast("Success", {
        description: "Your saved preferences have been loaded",
      });
      return data.preferences as unknown as UserData;
    }

    console.log('No preferences found for user:', email);
    return null;
  } catch (error) {
    console.error('Error in loadUserPreferences:', error);
    toast("Error", {
      description: "Failed to load your preferences",
    });
    return null;
  }
};
