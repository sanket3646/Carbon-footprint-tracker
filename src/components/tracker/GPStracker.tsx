import React, { useEffect, useRef, useState } from "react";

interface GPStrackerProps {
  onActivityDetected: (activityData: any) => Promise<void>;
}

const GPStracker: React.FC<GPStrackerProps> = ({ onActivityDetected }) => {
  const lastPosition = useRef<GeolocationCoordinates | null>(null);
  const [accelMagnitude, setAccelMagnitude] = useState(0);
  const accelBuffer = useRef<number[]>([]);

  // --- Haversine distance ---
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

    return R * c;
  };

  // --- Detect activity based on speed + acceleration pattern ---
  const detectActivityType = (speed: number, accelVar: number): string => {
    // speed in m/s
    const kmh = speed * 3.6;

    if (kmh < 1.5) return "stationary";
    if (kmh < 6 && accelVar > 1) return "walking";
    if (kmh < 20 && accelVar > 0.5) return "cycling";
    if (kmh < 60 && accelVar > 0.3) return "two_wheeler";
    if (kmh < 100 && accelVar < 0.3) return "car";
    return "public_transport";
  };

  // --- Carbon factors (kg CO₂ per km) ---
  const carbonFactors: Record<string, number> = {
    walking: 0,
    cycling: 0,
    two_wheeler: 0.075,
    car: 0.192,
    public_transport: 0.08,
  };

  // --- Average of last N accel magnitudes ---
  const getVariance = (arr: number[]): number => {
    if (arr.length < 2) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    return arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  };

  useEffect(() => {
    // Track acceleration
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.sqrt(
        (acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2
      );
      accelBuffer.current.push(magnitude);
      if (accelBuffer.current.length > 20)
        accelBuffer.current.shift(); // keep last 20 samples
      setAccelMagnitude(magnitude);
    };
    window.addEventListener("devicemotion", handleMotion);

    // Track GPS
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, speed = 0 } = position.coords;

        if (lastPosition.current) {
          const distance = getDistance(lastPosition.current, position.coords);
          if (distance < 20) return; // ignore tiny movement
        }

        const accelVar = getVariance(accelBuffer.current);
        const activity = detectActivityType(speed ?? 0, accelVar);

        if (activity === "stationary") return;

        // Distance moved since last reading (km)
        const distanceKm = lastPosition.current
          ? getDistance(lastPosition.current, position.coords) / 1000
          : 0;

        // Carbon saved vs car baseline
        const baseline = carbonFactors["car"];
        const current = carbonFactors[activity] ?? 0;
        const carbonSaved = (baseline - current) * distanceKm;

        lastPosition.current = position.coords;

        const activityData = {
          name: activity,
          distance: distanceKm,
          points_earned: Math.round(carbonSaved * 100), // arbitrary scoring
          carbon_saved: carbonSaved,
          date: new Date().toISOString(),
          location: { latitude, longitude },
        };

        console.log("Detected Activity:", activityData);
        await onActivityDetected(activityData);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [onActivityDetected]);

  return (
    <div className="p-4 bg-green-50 rounded-xl shadow mb-4 text-gray-700">
      <p className="font-medium">
        🌍 Smart Tracker Active — detecting movement patterns automatically.
      </p>
      <p className="text-sm mt-2 text-gray-500">
        Acceleration: {accelMagnitude.toFixed(2)} m/s²
      </p>
      <p className="text-xs text-gray-400">Movement detection in progress...</p>
    </div>
  );
};

export default GPStracker;
