export interface UserProfile {
  id: string;                     // ← FK → auth.users (Supabase)
  carbon_credits: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  total_carbon_saved: number;
  badges_earned: string[];        // ← badge ids
  avatar_url?: string;
  location?: string;
  preferred_transport?: "cycling" | "walking" | "public_transport" | "mixed";
}
