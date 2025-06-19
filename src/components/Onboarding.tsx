import { useState } from 'react';
import { motion } from 'framer-motion';

interface OnboardingProps {
  onComplete: (data: any) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    mood: '',
    interests: [] as string[],
    learningGoals: [] as string[]
  });

  const levels = [
    { id: 1, title: 'Level 1', description: 'Start with the basics and build your confidence!' },
    { id: 2, title: 'Level 2', description: 'Challenge yourself and grow your skills!' },
    { id: 3, title: 'Level 3', description: 'Master the language and become unstoppable!' }
  ];

  const moods = ['HAPPY', 'GOOD', 'ENJOY'];
  
  const interests = [
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Languages',
    'Science'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Level {step}</h2>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-1 rounded ${
                    i <= step ? 'bg-amber-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600">
            {step}/3 - {step === 1 ? "Let's get to know you" : step === 2 ? "Choose your level" : "How are you feeling?"}
          </p>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">What's your name?</h3>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Select your interests</h3>
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => {
                      const newInterests = formData.interests.includes(interest)
                        ? formData.interests.filter(i => i !== interest)
                        : [...formData.interests, interest];
                      setFormData({ ...formData, interests: newInterests });
                    }}
                    className={`p-3 rounded-xl border ${
                      formData.interests.includes(interest)
                        ? 'bg-amber-50 border-amber-400'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold mb-4">Choose your level</h3>
            <div className="space-y-4">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setFormData({ ...formData, level: level.title })}
                  className={`w-full p-4 rounded-xl border ${
                    formData.level === level.title
                      ? 'bg-amber-50 border-amber-400'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="font-semibold">{level.title}</h4>
                      <p className="text-sm text-gray-500">{level.description}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <span className="text-sm">50%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold mb-4">How are you feeling?</h3>
            <div className="space-y-3">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setFormData({ ...formData, mood })}
                  className={`w-full p-4 rounded-xl border ${
                    formData.mood === mood
                      ? 'bg-amber-50 border-amber-400'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            className={`px-6 py-2 rounded-xl ${
              step === 1
                ? 'invisible'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Prior
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-xl bg-black text-white hover:bg-gray-900"
          >
            {step === 3 ? 'Complete' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}