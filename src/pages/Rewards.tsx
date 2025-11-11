import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, Gift, Download, Star, Trophy, Lock, Check } from "lucide-react";
import { getCurrentUser, getOrCreateProfile, getBadges } from "../api/supabaseAPI"; // your Supabase API

interface BadgeType {
  id: number;
  name: string;
  description: string;
  requirement_type: "points" | "streak" | "carbon_saved" | "activities";
  requirement_value: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface BadgeCardProps {
  badge: BadgeType;
  earned: boolean;
  progress?: number;
}

const rarityColors: Record<string, string> = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-600",
};

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, earned, progress }) => {
  const colorClass = rarityColors[badge.rarity] || rarityColors.common;
  return (
    <motion.div whileHover={{ scale: earned ? 1.05 : 1 }} transition={{ type: "spring", stiffness: 300 }}>
      <div className={`p-6 ${earned ? 'bg-white border-green-200' : 'bg-gray-50 border-gray-200'} rounded-xl relative overflow-hidden shadow`}>
        {earned && (
          <div className="absolute top-2 right-2 p-1 bg-green-500 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center mb-4 shadow-lg ${!earned ? 'opacity-40' : ''}`}>
            {earned ? <Award className="w-10 h-10 text-white" /> : <Lock className="w-10 h-10 text-white" />}
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${earned ? 'text-gray-900' : 'text-gray-500'}`}>{badge.name}</h3>
          <p className={`text-sm mb-3 ${earned ? 'text-gray-600' : 'text-gray-400'}`}>{badge.description}</p>
          <div className={`px-2 py-1 rounded-full border text-xs font-medium capitalize ${
            badge.rarity === 'legendary' ? 'border-yellow-500 text-yellow-700' :
            badge.rarity === 'epic' ? 'border-purple-500 text-purple-700' :
            badge.rarity === 'rare' ? 'border-blue-500 text-blue-700' :
            'border-gray-500 text-gray-700'
          }`}>
            {badge.rarity}
          </div>

          {!earned && progress !== undefined && (
            <div className="mt-4 w-full">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Rewards() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      const profileData = await getOrCreateProfile(currentUser.id);
      setProfile(profileData);
    };
    fetchUserProfile();
  }, []);

  const { data: badges = [] } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => await getBadges(),
    initialData: [],
    enabled: !!user,
  });

  const availableBadges: BadgeType[] = [
    { id: 1, name: "First Steps", description: "Log your first activity", requirement_type: "activities", requirement_value: 1, rarity: "common" },
    { id: 2, name: "Eco Warrior", description: "Earn 100 points", requirement_type: "points", requirement_value: 100, rarity: "rare" },
    { id: 3, name: "Week Streak", description: "Maintain a 7-day streak", requirement_type: "streak", requirement_value: 7, rarity: "epic" },
    { id: 4, name: "Carbon Saver", description: "Save 10kg of CO₂", requirement_type: "carbon_saved", requirement_value: 10, rarity: "rare" },
    { id: 5, name: "Legend", description: "Earn 1000 points", requirement_type: "points", requirement_value: 1000, rarity: "legendary" },
  ];

  const calculateBadgeProgress = (badge: BadgeType) => {
    if (!profile) return 0;
    let current = 0;
    switch (badge.requirement_type) {
      case "points": current = profile.total_points; break;
      case "streak": current = profile.current_streak; break;
      case "carbon_saved": current = profile.total_carbon_saved; break;
      case "activities": current = profile.total_activities; break;
    }
    return Math.min(Math.round((current / badge.requirement_value) * 100), 100);
  };

  const isBadgeEarned = (badge: BadgeType) => calculateBadgeProgress(badge) >= 100;
  const earnedBadges = availableBadges.filter(isBadgeEarned);
  const pointsToNextReward = profile ? Math.ceil(profile.total_points / 100) * 100 - profile.total_points : 0;

  const downloadCertificate = () => alert("Certificate download coming soon!");

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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Rewards Center</h1>
        <p className="text-lg text-gray-600">Track your achievements and claim rewards</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Points */}
        <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-xl"><Star className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <h3 className="font-semibold text-gray-900">Total Points</h3>
              <p className="text-3xl font-bold text-yellow-600">{profile.total_points}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{pointsToNextReward} points to next reward</p>
        </div>

        {/* Badges Earned */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl"><Trophy className="w-6 h-6 text-purple-600" /></div>
            <div>
              <h3 className="font-semibold text-gray-900">Badges Earned</h3>
              <p className="text-3xl font-bold text-purple-600">{earnedBadges.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{availableBadges.length - earnedBadges.length} more to unlock</p>
        </div>

        {/* Certificates */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl"><Award className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="font-semibold text-gray-900">Certificates</h3>
              <p className="text-3xl font-bold text-green-600">{earnedBadges.length}</p>
            </div>
          </div>
          <button
            className={`w-full py-2 rounded text-white font-medium ${earnedBadges.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
            onClick={downloadCertificate}
            disabled={earnedBadges.length === 0}
          >
            <Download className="w-4 h-4 inline mr-2" /> Download
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievement Badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              earned={isBadgeEarned(badge)}
              progress={calculateBadgeProgress(badge)}
            />
          ))}
        </div>
      </div>

      {/* Rewards Redemption */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl shadow">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl"><Gift className="w-6 h-6 text-blue-600" /></div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Redeem Rewards</h3>
            <p className="text-gray-600 mb-4">Exchange your points for Amazon gift cards! (1000 points = ₹100)</p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <div className="p-6 bg-white rounded-xl border-2 border-blue-200 shadow-lg text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Amazon Gift Card</h4>
            <p className="text-4xl font-bold text-green-600 mb-2">₹100</p>
            <p className="text-sm text-gray-600 mb-4">1000 points required</p>

            <div className={`px-3 py-2 rounded-full border text-white font-medium mb-4 ${
              profile.total_points >= 1000 ? 'bg-green-600' : 'bg-gray-400'
            }`}>
              {profile.total_points >= 1000 ? "✓ Available to Redeem" : `🔒 Need ${1000 - profile.total_points} more points`}
            </div>

            <button
              className={`w-full py-3 rounded text-white font-semibold ${profile.total_points >= 1000 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
              disabled={profile.total_points < 1000}
              onClick={() => alert("Redemption coming soon!")}
            >
              {profile.total_points >= 1000 ? "Redeem Now" : "Locked"}
            </button>

            {profile.total_points >= 1000 && (
              <p className="text-sm text-green-600 mt-3 font-medium">🎉 Congratulations! You can redeem this reward</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
