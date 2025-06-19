import { useState } from 'react';
import { Book, Upload, MessageSquare, Brain, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './FileUpload';
import AIRole from './AIRole';
import StudySession from './StudySession';
import Quiz from './Quiz';
import Feedback from './Feedback';

type StudyStep = 'role' | 'type' | 'session' | 'quiz' | 'feedback';
type AIRoleType = 'lecturer' | 'student' | 'colleague';
type StudyType = 'file' | 'book' | 'custom';

interface StudyBuddyProps {
  userName?: string;
}

export default function StudyBuddy({ userName = 'there' }: StudyBuddyProps) {
  const [step, setStep] = useState<StudyStep>('role');
  const [aiRole, setAIRole] = useState<AIRoleType>('lecturer');
  const [studyType, setStudyType] = useState<StudyType>('file');
  const [content, setContent] = useState('');
  const [quizType, setQuizType] = useState<'multiple' | 'written'>('multiple');

  const handleFileUpload = (content: string) => {
    setContent(content);
    setStep('session');
  };

  const handleQuizComplete = (score: number) => {
    setStep('feedback');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Study Buddy</h1>
          <p className="mt-2 text-gray-600">
            Your personalized learning assistant {userName ? `• Welcome ${userName}!` : ''}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { icon: <Brain className="w-6 h-6" />, label: 'Choose AI Role' },
              { icon: <Upload className="w-6 h-6" />, label: 'Study Material' },
              { icon: <MessageSquare className="w-6 h-6" />, label: 'Study Session' },
              { icon: <Book className="w-6 h-6" />, label: 'Quiz' },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex items-center ${
                  i < ['role', 'type', 'session', 'quiz', 'feedback'].indexOf(step) + 1
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i < ['role', 'type', 'session', 'quiz', 'feedback'].indexOf(step) + 1
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {s.icon}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:block">{s.label}</span>
                {i < 3 && (
                  <div
                    className={`h-1 w-12 mx-4 ${
                      i < ['role', 'type', 'session', 'quiz', 'feedback'].indexOf(step)
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AIRole onSelect={(role) => {
                setAIRole(role);
                setStep('type');
              }} />
            </motion.div>
          )}

          {step === 'type' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FileUpload onUpload={handleFileUpload} />
            </motion.div>
          )}

          {step === 'session' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StudySession
                content={content}
                aiRole={aiRole}
                onComplete={() => setStep('quiz')}
                userName={userName}
              />
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Quiz
                content={content}
                type={quizType}
                onComplete={handleQuizComplete}
              />
            </motion.div>
          )}

          {step === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Feedback onRestart={() => setStep('role')} />
            </motion.div>
          )}
        </AnimatePresence>

        {step !== 'role' && (
          <button
            onClick={() => {
              const steps: StudyStep[] = ['role', 'type', 'session', 'quiz', 'feedback'];
              const currentIndex = steps.indexOf(step);
              setStep(steps[currentIndex - 1]);
            }}
            className="mt-8 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        )}
      </div>
    </div>
  );
}