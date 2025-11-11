import React from "react";
import { Bike, Footprints, Bus, Leaf, Zap, Recycle } from "lucide-react";
import { format } from "date-fns";

// Define the props type
interface Activity {
  id: string;
  type: string;
  date: string;
  points_earned: number;
  carbon_saved: number;
}

interface RecentActivityProps {
  activities: Activity[];
}

// Icons and colors for each activity type
const activityIcons: Record<string, React.ElementType> = {
  cycling: Bike,
  walking: Footprints,
  public_transport: Bus,
  plant_based_meal: Leaf,
  energy_saving: Zap,
  recycling: Recycle,
};

const activityColors: Record<string, string> = {
  cycling: "bg-blue-100 text-blue-600",
  walking: "bg-green-100 text-green-600",
  public_transport: "bg-purple-100 text-purple-600",
  plant_based_meal: "bg-emerald-100 text-emerald-600",
  energy_saving: "bg-yellow-100 text-yellow-600",
  recycling: "bg-teal-100 text-teal-600",
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="p-6 rounded-2xl border bg-white/80 backdrop-blur text-gray-900 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Leaf className="w-5 h-5 text-green-600" />
        Recent Activities
      </h3>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No activities yet. Start tracking your green actions!</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = activityIcons[activity.type] || Leaf;
            const colorClass =
              activityColors[activity.type] || "bg-gray-100 text-gray-600";

            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 transition-colors duration-200"
              >
                <div className={`p-3 rounded-xl ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 capitalize">
                    {activity.type.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(activity.date), "MMM d, yyyy")}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    +{activity.points_earned} pts
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.carbon_saved.toFixed(1)} kg CO₂
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
