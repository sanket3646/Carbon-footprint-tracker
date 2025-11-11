export interface Activity {
  id: string;
  user_id: string;              // ← FK → UserProfile
  type:
    | "cycling"
    | "walking"
    | "public_transport"
    | "electric_vehicle"
    | "recycling"
    | "plant_based_meal"
    | "energy_saving";
  duration?: number;
  distance?: number;
  carbon_saved: number;
  points_earned: number;
  location?: string;
  date: string;                 // ISO date string
  ai_verified?: boolean;
}
