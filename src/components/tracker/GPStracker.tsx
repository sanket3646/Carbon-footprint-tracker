import React, { useEffect, useRef } from "react";

interface GPStrackerProps {
  onActivityDetected: (activityData: any) => Promise<void>;
}

const GPStracker: React.FC<GPStrackerProps> = ({ onActivityDetected }) => {
  const lastPosition = useRef<GeolocationCoordinates | null>(null);

  // Haversine formula to calculate distance between two coordinates in meters
  const getDistance = (pos1: GeolocationCoordinates, pos2: GeolocationCoordinates) => {
    const R = 6371e3; // meters
    const φ1 = (pos1.latitude * Math.PI) / 180;
    const φ2 = (pos2.latitude * Math.PI) / 180;
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        if (lastPosition.current) {
          const distance = getDistance(lastPosition.current, position.coords);
          if (distance < 50) return; // only trigger if user moved >50 meters
        }

        lastPosition.current = position.coords;

        const activityData = {
          name: "Walk",
          points_earned: 5,
          carbon_saved: 0.2,
          date: new Date().toISOString(),
          location: { latitude, longitude },
        };

        await onActivityDetected(activityData);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onActivityDetected]);

  return (
    <div className="p-4 bg-blue-50 rounded-xl shadow mb-4">
      <p className="text-gray-700">
        GPS Auto-tracker active. Moves will be logged automatically.
      </p>
    </div>
  );
};

export default GPStracker;
