import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Award, TrendingUp, Zap, HelpCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import StatCard from "../components/dashboard/StatCard";
import StreakCounter from "../components/dashboard/StreakCounter";
import RecentActivity from "../components/dashboard/RecentActivity";
import AIRecommendations from "../components/dashboard/AIRecommendations";
import CreditGuide from "../components/dashboard/CreditGuide";
import ReferEarn from "../components/dashboard/ReferEarn";
import { AnimatePresence } from "framer-motion";
import { getCurrentUser, getOrCreateProfile, getActivities } from "../api/supabaseAPI";

// TypeScript interfaces for clarity
interface UserProfile {
  carbon_credits: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  total_carbon_saved: number;
}

interface Activity {
  id: string;
  type: string;
  date: string;
  carbon_saved: number;
  points_earned: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;

        setUser(currentUser);

        const profileData = await getOrCreateProfile(currentUser.id);
        setProfile(profileData);

        if (profileData.total_points === 0 && !localStorage.getItem("guideShown")) {
          setShowGuide(true);
          localStorage.setItem("guideShown", "true");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

const { data: activities = [] } = useQuery<Activity[]>({
  queryKey: ["activities", user?.id],
  queryFn: async () => (user ? await getActivities(user.id) : []),
  enabled: !!user, // only run after user exists
});


const recentActivities = (activities ?? []).slice(0, 5);
const todayActivities = (activities ?? []).filter((a) => {
    const today = new Date().toDateString();
    return new Date(a.date).toDateString() === today;
  });

  const aiRecommendations = [
    {
      title: "Try public transport today",
      description: "Save up to 2.5kg CO₂ by using metro instead of car",
      potential_points: 50,
      carbon_impact: 2.5,
    },
    {
      title: "Choose a plant-based meal",
      description: "Reduce your carbon footprint with veggie options",
      potential_points: 30,
      carbon_impact: 1.8,
    },
    {
      title: "Cycle to nearby destinations",
      description: "Great for health and the environment",
      potential_points: 40,
      carbon_impact: 2.0,
    },
  ];

  const motivationalMessages = [
    "Every small action counts! 🌱",
    "You're making a difference! 🌍",
    "Keep up the great work! ⭐",
    "Together we can save the planet! 💚",
  ];

  const randomMessage =
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const userName =
    user.user_metadata?.full_name?.split(" ")[0] || "Eco Warrior";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Help Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setShowGuide(true)}
          className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          size="icon"
        >
          <HelpCircle className="w-6 h-6" />
        </Button>
      </div>

      {/* Credit Guide Popup */}
      <AnimatePresence>
        {showGuide && <CreditGuide onClose={() => setShowGuide(false)} />}
      </AnimatePresence>

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-lg text-gray-600">{randomMessage}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Carbon Credits"
          value={profile.carbon_credits || 0}
          icon={Leaf}
          trend="up"
          trendValue="+12%"
          colorClass="from-green-500 to-emerald-600"
          delay={0}
        />
        <StatCard
          title="Total Points"
          value={profile.total_points}
          icon={Award}
          trend="up"
          trendValue="+8%"
          colorClass="from-yellow-500 to-orange-600"
          delay={0.1}
        />
        <StatCard
          title="Carbon Saved"
          value={profile.total_carbon_saved.toFixed(1)}
          unit="kg"
          icon={TrendingUp}
          trend="up"
          trendValue="+15%"
          colorClass="from-blue-500 to-cyan-600"
          delay={0.2}
        />
        <StatCard
          title="Today's Actions"
          value={todayActivities.length}
          icon={Zap}
          colorClass="from-purple-500 to-pink-600"
          delay={0.3}
        />
      </div>

      {/* Streak + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <StreakCounter
            currentStreak={profile.current_streak}
            longestStreak={profile.longest_streak}
          />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mb-8">
        <AIRecommendations recommendations={aiRecommendations} />
      </div>

      {/* Refer & Earn Section */}
      <ReferEarn />
    </div>
  );
}
