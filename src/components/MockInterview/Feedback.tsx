import { useState } from 'react';
import { CheckCircle, Download, RefreshCcw, ThumbsUp, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackProps {
  score: number;
  onStartNew: () => void;
}

export default function Feedback({ score, onStartNew }: FeedbackProps) {
  const [activeTab, setActiveTab] = useState<'feedback' | 'cv' | 'cover'>('feedback');

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Outstanding performance!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good effort!';
    return 'Keep practicing!';
  };

  const feedbackData = {
    strengths: [
      'Clear communication style',
      'Strong technical knowledge',
      'Good examples provided',
      'Confident delivery'
    ],
    improvements: [
      'Elaborate more on leadership experiences',
      'Provide more quantitative results',
      'Structure responses using STAR method',
      'Practice concise storytelling'
    ],
    cvSuggestions: [
      'Add metrics to achievements',
      'Highlight leadership roles',
      'Include relevant certifications',
      'Optimize for ATS systems'
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header with Score */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Interview Complete!</h2>
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" />
            <span className={`text-lg font-semibold ${getScoreColor(score)}`}>{score}/100</span>
          </div>
        </div>
        <p className="text-blue-100">
          {getScoreMessage(score)} Here's your personalized feedback and suggestions for improvement.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: 'feedback', label: 'Feedback', icon: <CheckCircle className="w-4 h-4" /> },
            { id: 'cv', label: 'CV Review', icon: <FileText className="w-4 h-4" /> },
            { id: 'cover', label: 'Cover Letter', icon: <FileText className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strengths</h3>
                <div className="space-y-2">
                  {feedbackData.strengths.map((strength, index) => (
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
                  {feedbackData.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="w-5 h-5" />
                      <span>{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cv' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">CV Improvement Suggestions</h3>
                <div className="space-y-2">
                  {feedbackData.cvSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                <Download className="w-5 h-5" />
                Download Improved CV
              </button>
            </motion.div>
          )}

          {activeTab === 'cover' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  Based on your interview performance and CV, we can help you generate a tailored cover letter.
                </p>
              </div>

              <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Generate Cover Letter
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onStartNew}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCcw className="w-5 h-5" />
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}