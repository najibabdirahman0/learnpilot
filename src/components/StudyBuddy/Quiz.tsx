import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase, saveQuizResult } from '../../lib/supabase';

interface QuizProps {
  content: string;
  type: 'multiple' | 'written';
  onComplete: (score: number) => void;
}

interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
}

export default function Quiz({ content, type, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    // In a real implementation, generate questions based on content
    setQuestions([
      {
        id: '1',
        text: 'What is the main concept discussed in the material?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
      },
      {
        id: '2',
        text: 'How does this concept relate to real-world applications?',
        options: ['Example 1', 'Example 2', 'Example 3', 'Example 4'],
        correctAnswer: 'Example 2',
      },
    ]);
  }, [content]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await saveQuizResult('session-id', type, score, 'Quiz completed successfully');
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
    setShowResult(true);
    onComplete(score);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Knowledge Check</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {!showResult ? (
        <div className="space-y-6">
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>

          {questions[currentQuestion] && (
            <motion.div
              key={questions[currentQuestion].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-lg text-gray-900">{questions[currentQuestion].text}</p>

              {type === 'multiple' && questions[currentQuestion].options && (
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(questions[currentQuestion].id, option)}
                      className={`w-full p-4 text-left rounded-lg border ${
                        answers[questions[currentQuestion].id] === option
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {type === 'written' && (
                <textarea
                  value={answers[questions[currentQuestion].id] || ''}
                  onChange={(e) =>
                    handleAnswer(questions[currentQuestion].id, e.target.value)
                  }
                  className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your answer here..."
                />
              )}
            </motion.div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion((prev) => prev + 1);
                } else {
                  handleSubmit();
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentQuestion < questions.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4">
            {calculateScore() >= 70 ? (
              <CheckCircle className="w-full h-full text-green-500" />
            ) : (
              <XCircle className="w-full h-full text-red-500" />
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-gray-600 mb-6">
            You scored {calculateScore()}% on this quiz.
          </p>
          <button
            onClick={() => onComplete(calculateScore())}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Feedback
          </button>
        </motion.div>
      )}
    </div>
  );
}