
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

export const saveUserPreferences = async (email: string, preferences: UserData): Promise<void> => {
  try {
    console.log('Saving user preferences for:', email);
    
    // First, disable RLS temporarily for this operation
    const { data, error } = await supabase
      .from('user_preference')
      .select('user_email')
      .eq('user_email', email)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking existing preferences:', error);
      toast("Error", {
        description: "Failed to save your preferences",
      });
      return;
    }

    let saveError;
    if (data) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_preference')
        .update({
          preferences: preferences as any
        })
        .eq('user_email', email);
      saveError = updateError;
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('user_preference')
        .insert({
          user_email: email,
          preferences: preferences as any
        });
      saveError = insertError;
    }

    if (saveError) {
      console.error('Error saving preferences:', saveError);
      toast("Error", {
        description: "Failed to save your preferences",
      });
    } else {
      console.log('Preferences saved successfully');
    }
  } catch (error) {
    console.error('Error in saveUserPreferences:', error);
    toast("Error", {
      description: "Failed to save your preferences",
    });
  }
};

export const loadUserPreferences = async (email: string): Promise<UserData | null> => {
  try {
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
      console.log('Preferences loaded successfully');
      toast("Success", {
        description: "Your saved preferences have been loaded",
      });
      return data.preferences as unknown as UserData;
    }

    console.log('No preferences found for user');
    return null;
  } catch (error) {
    console.error('Error in loadUserPreferences:', error);
    toast("Error", {
      description: "Failed to load your preferences",
    });
    return null;
  }
};
