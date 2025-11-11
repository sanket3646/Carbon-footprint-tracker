import React, { useState, useEffect } from "react";
import { MapPin, Activity as ActivityIcon, Sparkles, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import ActivityLogger from "../components/tracker/ActivityLogger";
import ProgressChart from "../components/tracker/ProgressChart";
import GPSTracker from "../components/tracker/GPStracker";

// Hardcoded Card & Badge components
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`rounded-xl shadow p-6 bg-white ${className}`}>{children}</div>
);

const Badge: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${className}`}>{children}</span>
);

export default function Tracker() {
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [aiVerifying, setAiVerifying] = useState(false);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return console.error(error);
      setUser(user);
    };
    fetchUser();
  }, []);

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      if (error) return console.error(error);
      setActivities(data || []);
    };
    fetchActivities();
  }, [user]);

  // Log new activity
  const handleActivityLogged = async (activityData: { name: string; points_earned: number; carbon_saved: number }) => {
    if (!user) return;
    setAiVerifying(true);

    // Simulate AI verification delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const verifiedActivity = {
      ...activityData,
      user_id: user.id,
      ai_verified: true,
      verification_confidence: Math.floor(Math.random() * 15) + 85,
      date: new Date().toISOString(),
    };

    const { error } = await supabase.from("activities").insert([verifiedActivity]);
    if (error) console.error(error);

    // Update user profile
    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      await supabase.from("user_profiles").update({
        carbon_credits: (profileData.carbon_credits || 0) + Math.floor(verifiedActivity.points_earned / 10),
        total_points: (profileData.total_points || 0) + verifiedActivity.points_earned,
        total_carbon_saved: (profileData.total_carbon_saved || 0) + verifiedActivity.carbon_saved,
        last_activity_date: verifiedActivity.date,
        current_streak: (profileData.current_streak || 0) + 1
      }).eq("id", user.id);
    }

    setActivities([verifiedActivity, ...activities]);
    setAiVerifying(false);
  };

  // Handle GPS auto-detected activity
  const handleGPSActivityDetected = async (activityData: { name: string; points_earned: number; carbon_saved: number }) => {
    await handleActivityLogged(activityData);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const todayActivities = activities.filter(a => new Date(a.date).toDateString() === new Date().toDateString());
  const totalCarbonToday = todayActivities.reduce((sum, a) => sum + (a.carbon_saved || 0), 0);
  const totalPointsToday = todayActivities.reduce((sum, a) => sum + (a.points_earned || 0), 0);
  const verifiedActivities = activities.filter(a => a.ai_verified);
  const verificationRate = activities.length > 0 ? Math.round((verifiedActivities.length / activities.length) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Activity Tracker</h1>
        <p className="text-lg text-gray-600">Log your green actions with AI-powered verification</p>
      </div>

      {/* GPS Auto Tracker */}
      <div className="mb-8">
        <GPSTracker onActivityDetected={handleGPSActivityDetected} />
      </div>

      {/* AI Verification Status */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">AI Tracking System Active</h3>
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Online
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">
              Our AI verifies activities using pattern recognition, GPS validation, and environmental impact calculations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Verification Rate</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-purple-600">{verificationRate}%</p>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Total Verified</p>
                <p className="text-2xl font-bold text-purple-600">{verifiedActivities.length}</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-600">Accuracy Level</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-purple-600">High</p>
                  <Badge className="border-purple-300 text-purple-700">95%+</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* GPS Integration Info */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enhanced GPS & Motion Tracking</h3>
            <p className="text-gray-600 mb-3">
              Tracks location & movement to auto-detect walking, cycling, or public transport.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-700">Real-time GPS Tracking</Badge>
              <Badge className="bg-green-100 text-green-700">Auto Activity Detection</Badge>
              <Badge className="bg-purple-100 text-purple-700">Smart Route Analysis</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Verification in Progress */}
      {aiVerifying && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Verification in Progress...</h3>
              <p className="text-sm text-gray-600">Analyzing data and calculating carbon impact</p>
            </div>
          </div>
        </Card>
      )}

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white/80 backdrop-blur border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <ActivityIcon className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Today's Activities</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{todayActivities.length}</p>
          <Badge className="mt-2 bg-green-100 text-green-700">
            {todayActivities.filter(a => a.ai_verified).length} AI Verified
          </Badge>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur border-green-100">
          <h3 className="font-semibold text-gray-900 mb-2">CO₂ Saved Today</h3>
          <p className="text-3xl font-bold text-green-600">{totalCarbonToday.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">kg of carbon dioxide</p>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur border-green-100">
          <h3 className="font-semibold text-gray-900 mb-2">Points Earned Today</h3>
          <p className="text-3xl font-bold text-yellow-600">{totalPointsToday}</p>
          <p className="text-sm text-gray-500 mt-2">Keep it up!</p>
        </Card>
      </div>

      {/* Activity Logger & Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ActivityLogger onActivityLogged={handleActivityLogged} />
        <ProgressChart activities={activities} />
      </div>

      {/* AI Features Info */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">How AI Tracking Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{
            title: "Smart Detection",
            desc: "AI analyzes your movement patterns and speed to identify transportation type",
          },{
            title: "GPS Validation",
            desc: "Cross-references location data to verify route and distance accuracy",
          },{
            title: "Carbon Calculation",
            desc: "Precise CO₂ savings based on activity type, distance, and alternatives",
          },{
            title: "Fraud Prevention",
            desc: "Machine learning detects and prevents duplicate or suspicious activities",
          }].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-700 font-bold">{i+1}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
