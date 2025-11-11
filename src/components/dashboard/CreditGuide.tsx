import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Leaf,
  Activity,
  Award,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    icon: Leaf,
    title: "Welcome to EcoTracker!",
    description:
      "Earn carbon credits by taking green actions. Every eco-friendly activity you log helps save the planet and earns you rewards!",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Activity,
    title: "Log Green Activities",
    description:
      "Use the Tracker page to log activities like cycling, walking, public transport, recycling, and more. Our AI verifies each activity.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: TrendingUp,
    title: "Earn Carbon Credits",
    description:
      "Each activity earns you points based on CO₂ saved. Accumulate credits to unlock badges and redeem exciting rewards!",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Award,
    title: "Redeem Rewards",
    description:
      "Use your points to get Amazon gift cards! 1000 points = ₹100. Track your progress and compete with yourself to do more!",
    color: "from-yellow-500 to-orange-600",
  },
];

interface CreditGuideProps {
  onClose: () => void;
}

const CreditGuide: React.FC<CreditGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onClose();
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-lg w-full bg-white rounded-2xl shadow-lg overflow-hidden p-8 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Step Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-green-600"
                  : index < currentStep
                  ? "w-2 bg-green-400"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {step.title}
            </h3>

            <p className="text-gray-600 leading-relaxed mb-8">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors duration-200 ${
              currentStep === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <span className="text-sm text-gray-500">
            {currentStep + 1} / {steps.length}
          </span>

          <button
            onClick={nextStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r ${step.color} hover:opacity-90 transition`}
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreditGuide;
