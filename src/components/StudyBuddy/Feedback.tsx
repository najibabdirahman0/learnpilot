import { CheckCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedbackProps {
  onRestart: () => void;
}

export default function Feedback({ onRestart }: FeedbackProps) {
  const strengths = [
    'Strong understanding of core concepts',
    'Good application of knowledge',
    'Clear communication of ideas',
  ];

  const improvements = [
    'Review advanced topics',
    'Practice more real-world examples',
    'Focus on problem-solving speed',
  ];

  const nextSteps = [
    'Complete practice exercises',
    'Join study group sessions',
    'Schedule mock assessments',
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Study Session Complete!</h2>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-lg font-semibold">85/100</span>
          </div>
        </div>
        <p className="text-blue-100">
          Great progress! Here's your personalized feedback and next steps.
        </p>
      </div>

      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths</h3>
          <div className="space-y-2">
            {strengths.map((strength, index) => (
              <div key={index} className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
          <div className="space-y-2">
            {improvements.map((improvement, index) => (
              <div key={index} className="flex items-center gap-2 text-amber-600">
                <ArrowRight className="w-5 h-5" />
                <span>{improvement}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <motion.button
                key={index}
                className="w-full p-4 text-left bg-gray-50 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span>{step}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <RefreshCcw className="w-5 h-5" />
          Start New Session
        </button>
      </div>
    </div>
  );
}