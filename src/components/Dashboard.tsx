import { useState, useEffect } from 'react';
import { Home, Users, BookOpen, Calendar, Settings, PieChart, MessageCircle, HelpCircle, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import Onboarding from './Onboarding';
import ProgressChart from './ProgressChart';
import NameSelector from './NameSelector';
import SettingsComponent from './Settings';
import { useProgressTracking } from '../hooks/useProgressTracking';
import { useTranslation, isRTL } from '../utils/translations';

interface DashboardProps {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  keyFeatures: Array<{
    icon: React.ReactNode;
    name: string;
    description: string;
  }>;
  popularServices: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  onStartInterview: () => void;
  onStartStudy: () => void;
  userName: string;
  userScore?: number;
}

export default function Dashboard({ 
  profileImage, 
  setProfileImage, 
  keyFeatures, 
  popularServices, 
  onStartInterview, 
  onStartStudy,
  userName,
  userScore = 80
}: DashboardProps) {
  const { t, currentLanguage } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNameSelector, setShowNameSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [displayName, setDisplayName] = useState(userName);

  const { progressData, getOverallScore, getLearningInsights } = useProgressTracking(displayName);

  // Get current theme from global settings
  const getCurrentTheme = () => {
    try {
      const saved = localStorage.getItem('learnpilot_app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.theme || 'light';
      }
    } catch (error) {
      console.error('Error loading theme setting:', error);
    }
    return 'light';
  };

  const [currentTheme, setCurrentTheme] = useState(getCurrentTheme());

  // Listen for theme changes
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      if (event.detail && event.detail.theme) {
        setCurrentTheme(event.detail.theme);
      }
    };

    window.addEventListener('settings-saved', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('settings-saved', handleSettingsChange as EventListener);
    };
  }, []);

  // Check if user has a custom display name preference
  useEffect(() => {
    const savedDisplayName = localStorage.getItem(`learnpilot_display_name_${userName}`);
    if (savedDisplayName) {
      setDisplayName(savedDisplayName);
    } else {
      // Show name selector for new users
      setShowNameSelector(true);
    }

    // Load saved profile image
    const savedProfileImage = localStorage.getItem(`learnpilot_profile_image_${userName}`);
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, [userName, setProfileImage]);

  const handleOnboardingComplete = (data: any) => {
    setShowOnboarding(false);
  };

  const handleNameSelection = (selectedName: string) => {
    setDisplayName(selectedName);
    localStorage.setItem(`learnpilot_display_name_${userName}`, selectedName);
    setShowNameSelector(false);
    
    // Trigger global name update event
    const event = new CustomEvent('display-name-changed', { 
      detail: { 
        userName, 
        displayName: selectedName 
      } 
    });
    window.dispatchEvent(event);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        // Save profile image to localStorage
        localStorage.setItem(`learnpilot_profile_image_${userName}`, imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get real progress score
  const realScore = getOverallScore();
  const insights = getLearningInsights();

  const knowledgeKeynotes = [
    {
      title: t('latestInterviewPractice'),
      description: `${t('mockInterviewPerformance')}: ${realScore}% (${progressData.completedInterviews} ${t('completed')})`,
      color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      date: t('today')
    },
    {
      title: t('studyProgress'),
      description: `${Math.round(progressData.studyHours)} ${t('hoursOfLearning')} • ${progressData.totalSessions} ${t('sessions')}`,
      color: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      date: progressData.streakDays > 0 ? `${progressData.streakDays} ${t('dayStreak')}` : t('recent')
    },
    {
      title: t('learningInsights'),
      description: insights.length > 0 ? insights[0] : t('keepPracticingInsights'),
      color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      date: t('updated')
    }
  ];

  if (showNameSelector) {
    return <NameSelector onComplete={handleNameSelection} defaultName={userName} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (showSettings) {
    return <SettingsComponent onClose={() => setShowSettings(false)} />;
  }

  // Get theme-aware classes
  const getThemeClasses = () => {
    if (currentTheme === 'dark') {
      return 'dark bg-gray-900 text-white';
    } else if (currentTheme === 'light') {
      return 'bg-gray-50 text-gray-900';
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()} ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">{t('learnPilot')}</span>
            </div>
            
            {/* Navigation Items */}
            <div className="flex items-center space-x-4">
              {/* Prominent Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors font-medium shadow-sm"
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:block">{t('settings')}</span>
              </button>
              
              {/* Profile Section */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <label className="cursor-pointer w-full h-full flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                  {profileImage && (
                    <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors">
                      <Upload className="w-3 h-3" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('score')}: {realScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    <span className="text-gray-600 dark:text-gray-300 font-semibold text-lg">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('welcomeBack')}, {displayName}!</h1>
                <button
                  onClick={() => setShowNameSelector(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                >
                  {t('changeName')}
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400">{t('readyToContinue')}</p>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {t('allAIInteractions')}: <strong>{displayName}</strong>
              </div>
            </div>
          </div>

          {/* Learning Progress Card */}
          <motion.div 
            className="mt-6 bg-blue-600 dark:bg-blue-700 rounded-xl p-6 text-white transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 dark:text-blue-200">{t('learningProgress')}</p>
                <h2 className="text-4xl font-bold mt-2">{realScore}%</h2>
                <p className="mt-1">{t('overallPerformance')}</p>
                <div className="mt-3 text-sm text-blue-100 dark:text-blue-200">
                  {progressData.totalSessions} {t('sessions')} • {progressData.completedInterviews} {t('interviews')} • {Math.round(progressData.studyHours)}{t('hoursStudied')}
                </div>
              </div>
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <span className="text-gray-600 font-semibold text-lg">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {t('keyFeatures')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyFeatures.map((feature, index) => (
              <motion.button
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => {
                  if (feature.name === t('mockInterviews')) {
                    onStartInterview();
                  } else if (feature.name === t('studyBuddy')) {
                    onStartStudy();
                  }
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Popular Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('learningAnalytics')}</h2>
          <ProgressChart data={popularServices} />
        </div>

        {/* Knowledge Keynotes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-20 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('learningInsights')}</h2>
          <div className="space-y-4">
            {knowledgeKeynotes.map((keynote, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg transition-colors duration-300 ${keynote.color}`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold mb-1">{keynote.title}</h3>
                    <p className="text-sm opacity-90">{keynote.description}</p>
                  </div>
                  <span className="text-xs opacity-75">{keynote.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}