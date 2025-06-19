import React from 'react';
import { Video, Lightbulb, PenTool, Users, BookOpen, Zap } from 'lucide-react';
import { useTranslation, isRTL } from '../utils/translations';

const Features = () => {
  const { t, currentLanguage } = useTranslation();

  const features = [
    {
      icon: <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: t('mockInterviews'),
      description: 'Practice with AI interviewers tailored to your field and skill level. Get instant feedback to improve your performance.'
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: t('studyBuddy'),
      description: 'Create flashcards with AI assistance and study with adaptive learning technology that focuses on your weak areas.'
    },
    {
      icon: <PenTool className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: t('flashcards'),
      description: 'Generate effective flashcards from your notes or study materials with AI that understands context and importance.'
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: t('videoMeeting'),
      description: 'Connect with peers or tutors via high-quality video chat with real-time transcription and multilingual captions.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Personalized Learning',
      description: 'Get customized study plans and recommendations based on your progress, goals, and learning style.'
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Progress Analytics',
      description: 'Track your growth with detailed analytics that show your improvement areas and suggest focused practice.'
    }
  ];

  return (
    <section className={`py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`} id="features">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Transform Your Learning Experience
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            LearnPilot combines cutting-edge AI with proven educational methods to create a powerful learning platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;