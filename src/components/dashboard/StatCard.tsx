import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  colorClass?: string;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  colorClass = "from-green-500 to-emerald-600",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Hardcoded Card styles here */}
      <div className="rounded-2xl border border-green-100 bg-white/80 backdrop-blur p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>

            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
              {unit && <span className="text-lg text-gray-500">{unit}</span>}
            </div>

            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trendValue}
                </span>
                <span className="text-sm text-gray-500">vs last week</span>
              </div>
            )}
          </div>

          <div
            className={`p-3 rounded-2xl bg-gradient-to-br ${colorClass} shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
