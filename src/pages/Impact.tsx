import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Leaf, Activity, Award, TrendingUp } from "lucide-react";
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl shadow p-6 bg-white ${className}`}>{children}</div>;
}
import { getCurrentUser, getOrCreateProfile, getActivities } from "../api/supabaseAPI"; // your real Supabase API

export default function Impact() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Fetch logged-in user and profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        const profileData = await getOrCreateProfile(currentUser.id);
        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch user activities via React Query
const { data: activities = [] } = useQuery({
  queryKey: ["activities", user?.id],
  queryFn: async () => (user ? await getActivities(user.id) : []),
  enabled: !!user,
});


  // Activity type distribution
  const activityTypeData = activities.reduce((acc: any[], activity: any) => {
    const typeName = activity.type?.replace(/_/g, " ") || "Unknown";
    const existing = acc.find(item => item.name === typeName);
    if (existing) {
      existing.value += 1;
      existing.carbon += activity.carbon_saved || 0;
    } else {
      acc.push({
        name: typeName,
        value: 1,
        carbon: activity.carbon_saved || 0
      });
    }
    return acc;
  }, []);

  // Monthly trend (last 6 months)
  const monthlyData = [...Array(6)].map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthStr = date.toISOString().slice(0, 7);

    const monthActivities = activities.filter((a: any) =>
      a.date?.startsWith(monthStr)
    );
    const carbonSaved = monthActivities.reduce(
      (sum, a) => sum + (a.carbon_saved || 0),
      0
    );
    const points = monthActivities.reduce(
      (sum, a) => sum + (a.points_earned || 0),
      0
    );

    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      carbon: parseFloat(carbonSaved.toFixed(2)),
      points: points,
      activities: monthActivities.length
    };
  });

  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];

  const totalActivities = activities.length;
  const totalCarbonSaved = activities.reduce(
    (sum: number, a: any) => sum + (a.carbon_saved || 0),
    0
  );
  const totalPoints = profile?.total_points || 0;

  const treesPlanted = Math.round(totalCarbonSaved / 21.77);
  const carMilesAvoided = Math.round(totalCarbonSaved / 0.411);

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Impact Summary</h1>
        <p className="text-lg text-gray-600">Visualize your contribution to a greener planet</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <h3 className="font-semibold text-gray-900">Total CO₂ Saved</h3>
          </div>
          <p className="text-4xl font-bold text-green-600">{totalCarbonSaved.toFixed(1)}</p>
          <p className="text-sm text-gray-600 mt-1">kg of carbon dioxide</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Activities</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">{totalActivities}</p>
          <p className="text-sm text-gray-600 mt-1">green actions taken</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-yellow-600" />
            <h3 className="font-semibold text-gray-900">Points Earned</h3>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{totalPoints}</p>
          <p className="text-sm text-gray-600 mt-1">total rewards points</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Carbon Credits</h3>
          </div>
          <p className="text-4xl font-bold text-purple-600">{profile.carbon_credits || 0}</p>
          <p className="text-sm text-gray-600 mt-1">your eco rating</p>
        </Card>
      </div>

      {/* Environmental Impact */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Impact Equivalent To:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
            <div className="text-5xl">🌳</div>
            <div>
              <p className="text-3xl font-bold text-green-600">{treesPlanted}</p>
              <p className="text-gray-600">Trees planted (yearly CO₂ absorption)</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
            <div className="text-5xl">🚗</div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{carMilesAvoided}</p>
              <p className="text-gray-600">Car miles avoided</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend */}
        <Card className="p-6 bg-white/80 backdrop-blur border-green-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Carbon Savings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="carbon"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6 }}
                name="CO₂ Saved (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Distribution */}
        <Card className="p-6 bg-white/80 backdrop-blur border-green-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Activity Breakdown</h3>
          {activityTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.value})`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No activities logged yet</p>
                <p className="text-sm mt-1">Start tracking to see your breakdown</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Points Over Time */}
      <Card className="p-6 bg-white/80 backdrop-blur border-green-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Progress Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="points" fill="#f59e0b" name="Points Earned" radius={[8, 8, 0, 0]} />
            <Bar dataKey="activities" fill="#3b82f6" name="Activities" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
