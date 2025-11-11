import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Lightbulb, Target } from "lucide-react";
import { getCurrentUser, getOrCreateProfile, getActivities } from "../api/supabaseAPI"; // your Supabase API

interface AIInsight {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  potential_points: number;
  carbon_impact: number;
  icon: React.ElementType;
  color: string;
}

export default function Insights() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Fetch logged-in user and profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      const profileData = await getOrCreateProfile(currentUser.id); // use id instead of email
      setProfile(profileData);
    };
    fetchUserProfile();
  }, []);

  // Fetch user activities if needed
  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => (user ? await getActivities(user.id) : []),
    initialData: [],
    enabled: !!user,
  });

  const aiInsights: AIInsight[] = [
    {
      title: "Switch to Public Transport",
      description: "Using the metro 3 times a week could save 7.5kg CO₂ monthly",
      impact: "High",
      potential_points: 150,
      carbon_impact: 7.5,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Increase Cycling Days",
      description: "You've cycled 2 days this week. Try 4 days to double your impact!",
      impact: "Medium",
      potential_points: 80,
      carbon_impact: 4,
      icon: Target,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Plant-Based Meals",
      description: "Having 3 plant-based meals per week reduces your carbon footprint",
      impact: "Medium",
      potential_points: 90,
      carbon_impact: 5.4,
      icon: Lightbulb,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Optimize Your Routes",
      description: "Walk to destinations under 1km instead of driving saves energy",
      impact: "Low",
      potential_points: 40,
      carbon_impact: 2,
      icon: TrendingUp,
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "Carpool with Colleagues",
      description: "Sharing rides to work reduces your commute emissions by 50%",
      impact: "High",
      potential_points: 120,
      carbon_impact: 6,
      icon: Target,
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "Use Energy-Efficient Appliances",
      description: "Switching to LED bulbs and efficient devices can reduce home energy by 30%",
      impact: "Medium",
      potential_points: 70,
      carbon_impact: 3.5,
      icon: Lightbulb,
      color: "from-teal-500 to-green-600",
    },
  ];

  const impactColors: Record<string, string> = {
    High: "bg-green-100 text-green-700 border-green-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-blue-100 text-blue-700 border-blue-300",
  };

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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Sparkles className="w-10 h-10 text-purple-600" />
          AI-Powered Insights
        </h1>
        <p className="text-lg text-gray-600">Personalized recommendations to improve your carbon credits</p>
      </div>

      {/* Current Credits Card */}
      <div className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Current Carbon Credits</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-purple-600">{profile.carbon_credits || 0}</span>
              <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">Great Progress!</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Potential Increase</p>
            <p className="text-3xl font-bold text-green-600">
              +{Math.round(aiInsights.reduce((sum, i) => sum + i.potential_points, 0) * 0.1)}
            </p>
            <p className="text-xs text-gray-500">by following insights</p>
          </div>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white/80 backdrop-blur rounded-xl h-full flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-2 py-1 rounded-full border text-xs font-medium ${impactColors[insight.impact]}`}>
                    {insight.impact} Impact
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{insight.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{insight.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Potential Points</p>
                    <p className="text-lg font-bold text-yellow-600">+{insight.potential_points}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">CO₂ Impact</p>
                    <p className="text-lg font-bold text-green-600">{insight.carbon_impact} kg</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Tips Section */}
      <div className="p-6 mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Tips for Today</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Walk or cycle for trips under 2km instead of driving",
            "Turn off lights and electronics when not in use",
            "Use reusable bags and containers for shopping",
            "Choose seasonal and local produce when possible"
          ].map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <p className="text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
