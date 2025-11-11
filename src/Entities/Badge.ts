export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  requirement_type: "points" | "streak" | "carbon_saved" | "activities";
  requirement_value: number;
  color?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
}
