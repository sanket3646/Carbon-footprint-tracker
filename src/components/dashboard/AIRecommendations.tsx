import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Recommendation {
  title: string;
  description: string;
  potential_points: number;
  carbon_impact: number;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-purple-100 rounded-xl">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
      </div>

      {/* Recommendations list */}
      <div className="space-y-3 mb-4">
        {recommendations && recommendations.length > 0 ? (
          recommendations.slice(0, 3).map((rec, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-xl border border-purple-100 hover:border-purple-300 transition-colors duration-200"
            >
              <p className="font-medium text-gray-900 mb-1">{rec.title}</p>
              <p className="text-sm text-gray-600">{rec.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  +{rec.potential_points} pts
                </span>
                <span className="text-xs text-gray-500">
                  Save {rec.carbon_impact} kg CO₂
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm text-center py-8">
            No recommendations yet. Complete actions to get personalized insights!
          </div>
        )}
      </div>

      {/* Button */}
      <Link
        to="/insights"
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-purple-300 text-purple-700 font-medium rounded-xl hover:bg-purple-100 transition-colors duration-200"
      >
        View All Insights
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default AIRecommendations;
