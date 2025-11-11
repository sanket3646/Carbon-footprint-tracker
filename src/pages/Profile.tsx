import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Hardcoded UI components
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`rounded-xl shadow p-6 bg-white ${className || ""}`}>{children}</div>
);

const Button: React.FC<React.PropsWithChildren<{ onClick?: () => void; disabled?: boolean; className?: string }>> = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md text-white font-semibold ${className || ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input className="w-full border border-gray-300 rounded-md p-2 bg-gray-50" {...props} />
);

const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string }>> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block font-medium text-gray-700 mb-1">{children}</label>
);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [location, setLocation] = useState("");
  const [preferredTransport, setPreferredTransport] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUserAndProfile() {
      // Get current user
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return console.error(error);
      if (!user) return;

      setUser(user);

      // Get or create profile
      const { data: existingProfile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error(profileError);
        return;
      }

      if (existingProfile) {
        setProfile(existingProfile);
        setLocation(existingProfile.location || "");
        setPreferredTransport(existingProfile.preferred_transport || "");
      } else {
        const { data: newProfile, error: insertError } = await supabase
          .from("user_profiles")
          .insert([{
            id: user.id,
            carbon_credits: 0,
            total_points: 0,
            current_streak: 0,
            longest_streak: 0,
            total_carbon_saved: 0,
            location: "",
            preferred_transport: "",
            badges_earned: []
          }])
          .select()
          .single();

        if (insertError) return console.error(insertError);
        setProfile(newProfile);
      }
    }

    fetchUserAndProfile();
  }, []);

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("user_profiles")
      .update({ location, preferred_transport: preferredTransport })
      .eq("id", user.id);

    setSaving(false);

    if (error) alert("Failed to save profile: " + error.message);
    else {
      alert("Profile updated successfully!");
      setProfile({ ...profile, location, preferred_transport: preferredTransport });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  const initials = user.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-lg text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Header */}
      <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
            {initials}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.user_metadata?.full_name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="text-center p-4 bg-white rounded-2xl shadow-md">
            <p className="text-sm text-gray-600">Carbon Credits</p>
            <p className="text-3xl font-bold text-green-600">{profile.carbon_credits || 0}</p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-2">Total Points</p>
          <p className="text-3xl font-bold text-yellow-600">{profile.total_points}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-2">Current Streak</p>
          <p className="text-3xl font-bold text-orange-600">{profile.current_streak} days</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-2">CO₂ Saved</p>
          <p className="text-3xl font-bold text-green-600">{profile.total_carbon_saved.toFixed(1)} kg</p>
        </Card>
      </div>

      {/* Settings */}
      <Card className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h3>

        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={user.user_metadata?.full_name || ""} disabled />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email} disabled />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter your city" />
          </div>

          <div>
            <Label htmlFor="transport">Preferred Green Transport</Label>
            <select value={preferredTransport} onChange={(e) => setPreferredTransport(e.target.value)} className="w-full border border-gray-300 rounded-md p-2">
              <option value="">Select</option>
              <option value="cycling">Cycling</option>
              <option value="walking">Walking</option>
              <option value="public_transport">Public Transport</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>

      {/* Logout */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sign Out</h3>
            <p className="text-sm text-gray-600">Log out from your account</p>
          </div>
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
