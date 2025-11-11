import React, { useState } from "react";
import { Users, Copy, Share2, Gift, CheckCircle } from "lucide-react";

// ✅ Reusable UI Components (hardcoded inline)
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div
    className={`rounded-2xl border bg-white shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }
> = ({ className = "", variant, children, ...props }) => {
  const base =
    "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center";
  const variants: Record<string, string> = {
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 bg-white shadow-sm",
    default:
      "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
  };
  return (
    <button className={`${base} ${variants[variant || "default"]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    className={`w-full px-4 py-2 rounded-xl border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
);

const Badge: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & { color?: string }
> = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-semibold ${className}`}
  >
    {children}
  </span>
);

// ✅ Main Component
const motivationalQuotes: string[] = [
  "🌍 Be the change you wish to see in the world - Mahatma Gandhi",
  "🌱 The Earth is what we all have in common - Wendell Berry",
  "♻️ Small acts, when multiplied by millions, can transform the world",
  "🌿 There is no planet B. Protect what we have!",
  "🌳 The best time to plant a tree was 20 years ago. The second best time is now",
  "💚 Every drop in the ocean counts. Your actions matter!",
  "🌏 We don't inherit the Earth from our ancestors, we borrow it from our children",
  "⭐ Together, we can create a sustainable future for all",
];

const ReferEarn: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const referralCode =
    "ECO" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://ecotracker.app/join/${referralCode}`;
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join EcoTracker",
          text: "Join me on EcoTracker and start earning carbon credits for your green actions! 🌱",
          url: referralLink,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* 🌿 Motivational Quote */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <div className="text-center">
          <div className="text-4xl mb-3">✨</div>
          <p className="text-lg font-medium text-gray-800 italic leading-relaxed">
            {randomQuote}
          </p>
        </div>
      </Card>

      {/* 🤝 Refer & Earn Section */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Refer & Earn Credits
            </h3>
            <p className="text-gray-600">
              Invite friends to join EcoTracker and earn bonus carbon credits
              when they complete their first activity!
            </p>
          </div>
        </div>

        {/* 🎁 Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-xl text-center border border-purple-200">
            <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">+50</p>
            <p className="text-sm text-gray-600">Credits per referral</p>
          </div>
          <div className="p-4 bg-white rounded-xl text-center border border-purple-200">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">+25</p>
            <p className="text-sm text-gray-600">For your friend too!</p>
          </div>
          <div className="p-4 bg-white rounded-xl text-center border border-purple-200">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">Unlimited</p>
            <p className="text-sm text-gray-600">Referrals allowed</p>
          </div>
        </div>

        {/* 🔗 Referral Link */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Your Referral Link
          </label>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="bg-white" />
            <Button variant="outline" onClick={copyToClipboard} className="gap-2">
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <Button
            onClick={shareReferral}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share with Friends
          </Button>
        </div>

        {/* 📘 How it Works */}
        <div className="mt-6 p-4 bg-white rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-3">How it works:</h4>
          <div className="space-y-2">
            {[
              "Share your unique referral link with friends",
              "They sign up and log their first green activity",
              "Both of you receive bonus carbon credits instantly!",
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <Badge className="bg-purple-100 text-purple-700 mt-0.5">
                  {index + 1}
                </Badge>
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 💡 Pro Tip */}
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <p className="text-sm text-center text-gray-700">
            💡 <strong>Pro Tip:</strong> The more friends you refer, the more
            credits you earn. Build a greener community together!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ReferEarn;
