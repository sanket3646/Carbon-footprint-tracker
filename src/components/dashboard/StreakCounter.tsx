import React from "react";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
}) => {
  return (
    <div className="rounded-2xl border bg-white text-gray-900 shadow-sm p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Daily Streak</h3>
        <span className="text-orange-500 text-2xl">🔥</span>
      </div>

      {/* Streak values */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-bold text-orange-600">
              {currentStreak}
            </span>
            <span className="text-xl text-gray-600 mb-2">days</span>
          </div>
          <p className="text-sm text-gray-600">Keep it up! 🎉</p>
        </div>

        <div className="text-center p-4 bg-white rounded-2xl shadow-md">
          <div className="text-yellow-500 mb-2 text-2xl">🏆</div>
          <p className="text-xs text-gray-600">Best Streak</p>
          <p className="text-2xl font-bold text-gray-900">{longestStreak}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 flex gap-1">
        {[...Array(7)].map((_, i) => {
          const filled = currentStreak > 0 && i < (currentStreak % 7);
          return (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                filled ? "bg-orange-500" : "bg-gray-200"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StreakCounter;
