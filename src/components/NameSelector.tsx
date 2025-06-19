import { useState } from 'react';
import { User, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface NameSelectorProps {
  onComplete: (selectedName: string) => void;
  defaultName?: string;
}

export default function NameSelector({ onComplete, defaultName = '' }: NameSelectorProps) {
  const [customName, setCustomName] = useState(defaultName);
  const [selectedOption, setSelectedOption] = useState<'default' | 'custom'>('default');

  const handleSubmit = () => {
    const finalName = selectedOption === 'custom' ? customName : defaultName;
    if (finalName.trim()) {
      onComplete(finalName.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">What should I call you?</h2>
          <p className="text-gray-600 mt-2">Choose how you'd like the AI to address you during conversations</p>
        </div>

        <div className="space-y-4">
          {/* Default Name Option */}
          <button
            onClick={() => setSelectedOption('default')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedOption === 'default'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Use "{defaultName}"</p>
                <p className="text-sm text-gray-500">Based on your account</p>
              </div>
              {selectedOption === 'default' && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </button>

          {/* Custom Name Option */}
          <button
            onClick={() => setSelectedOption('custom')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedOption === 'custom'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Choose a different name</p>
                <p className="text-sm text-gray-500">Pick something you prefer</p>
              </div>
              {selectedOption === 'custom' && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </div>
          </button>

          {/* Custom Name Input */}
          {selectedOption === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your preferred name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                autoFocus
              />
            </motion.div>
          )}
        </div>

        {/* Continue Button - More Prominent */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={selectedOption === 'custom' && !customName.trim()}
            className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Continue
          </button>
          
          {/* Helpful hint */}
          <p className="text-center text-sm text-gray-500 mt-3">
            {selectedOption === 'custom' && !customName.trim() 
              ? 'Please enter a name to continue' 
              : 'Press Enter or click Continue'
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
}