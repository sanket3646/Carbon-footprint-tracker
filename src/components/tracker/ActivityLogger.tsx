// ActivityLogger.tsx
import React, { useState } from "react";

interface ActivityLoggerProps {
  onActivityLogged: (activityData: any) => Promise<void>;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ onActivityLogged }) => {
  const [activityName, setActivityName] = useState("");
  const [points, setPoints] = useState(0);
  const [carbonSaved, setCarbonSaved] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityName || points <= 0) return;

    await onActivityLogged({
      name: activityName,
      points_earned: points,
      carbon_saved: carbonSaved,
      date: new Date().toISOString(),
    });

    setActivityName("");
    setPoints(0);
    setCarbonSaved(0);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-xl shadow space-y-4">
      <h3 className="font-semibold text-gray-900">Log Activity</h3>
      <input
        type="text"
        placeholder="Activity Name"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Points Earned"
        value={points}
        onChange={(e) => setPoints(Number(e.target.value))}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Carbon Saved (kg)"
        value={carbonSaved}
        onChange={(e) => setCarbonSaved(Number(e.target.value))}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Log Activity</button>
    </form>
  );
};

export default ActivityLogger;
