import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, isRTL } from '../../utils/translations';

interface InterviewGuidesProps {
  jobData: {
    title: string;
    company: string;
    description: string;
  };
  onStartInterview: () => void;
}

interface Question {
  id: string;
  question: string;
  expanded: boolean;
  answer?: string;
}

export default function InterviewGuides({ jobData, onStartInterview }: InterviewGuidesProps) {
  const { t, currentLanguage } = useTranslation();
  
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: t('tellMeAboutYourself'),
      expanded: false,
    },
    {
      id: '2',
      question: `${t('whyInterested')} ${jobData.company}?`,
      expanded: false,
    },
    {
      id: '3',
      question: t('greatestStrengths'),
      expanded: false,
    },
    {
      id: '4',
      question: t('challengingProject'),
      expanded: false,
    },
    {
      id: '5',
      question: t('whereDoYouSee'),
      expanded: false,
    },
  ]);

  const toggleQuestion = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, expanded: !q.expanded } : q
    ));
  };

  const generateAnswer = (questionId: string) => {
    const sampleAnswers = {
      '1': `I'm a passionate ${jobData.title.toLowerCase()} with experience in building scalable applications. I enjoy solving complex problems and collaborating with cross-functional teams to deliver high-quality solutions.`,
      '2': `I'm excited about ${jobData.company} because of your innovative approach to technology and commitment to excellence. This role aligns perfectly with my skills and career goals.`,
      '3': `My greatest strengths include problem-solving, attention to detail, and the ability to learn new technologies quickly. I'm also skilled at communicating complex technical concepts to non-technical stakeholders.`,
      '4': `I recently led a project to redesign our company's main application, which involved coordinating with multiple teams and implementing new technologies. Despite tight deadlines, we delivered on time and improved user satisfaction by 40%.`,
      '5': `In 5 years, I see myself in a senior technical role where I can mentor junior developers and contribute to architectural decisions. I'd like to continue growing my expertise while making a meaningful impact on the products I work on.`,
    };

    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, answer: sampleAnswers[questionId as keyof typeof sampleAnswers] } : q
    ));
  };

  return (
    <div className={`space-y-6 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Study Guide</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Prepare for your {jobData.title} interview at {jobData.company}
            </p>
          </div>
          <button
            onClick={onStartInterview}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <span>{t('startInterview')}</span>
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleQuestion(question.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white">{question.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    question.expanded ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {question.expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="p-4 bg-gray-50 dark:bg-gray-700">
                      {question.answer ? (
                        <div className="space-y-3">
                          <p className="text-gray-700 dark:text-gray-300">{question.answer}</p>
                          <button
                            onClick={() => generateAnswer(question.id)}
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                          >
                            <Sparkles className="w-4 h-4" />
                            Generate New Answer
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => generateAnswer(question.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate Answer
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}