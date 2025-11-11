import { supabase } from "../lib/supabaseClient";

// Get logged-in user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Get or create user profile
export async function getOrCreateProfile(userId: string) {
  // Try to fetch existing profile
  const { data: existing, error: selectError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (selectError && selectError.code !== "PGRST116") throw selectError;
  if (existing) return existing;

  // If not found, create a new profile
  const { data: newProfile, error: insertError } = await supabase
    .from("user_profiles")
    .insert([
      {
        id: userId,
        carbon_credits: 0,
        total_points: 0,
        current_streak: 0,
        longest_streak: 0,
        total_carbon_saved: 0,
        badges_earned: [],
      },
    ])
    .select()
    .single();

  if (insertError) throw insertError;
  return newProfile;
}

// Fetch all activities for a user
export async function getActivities(userId: string) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

// Fetch all badges
export async function getBadges() {
  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return data;
}

// Redeem a reward
export async function redeemReward(userId: string, rewardId: number) {
  // Here you would implement updating points, marking reward claimed, etc.
  const { data, error } = await supabase
    .from("user_rewards")
    .insert([{ user_id: userId, reward_id: rewardId, claimed_at: new Date() }]);

  if (error) throw error;
  return data;
}
