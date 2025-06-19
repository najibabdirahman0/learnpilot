import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, MessageCircle } from 'lucide-react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/Howitworks/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import MockInterview from './components/MockInterview/MockInterview';
import StudyBuddy from './components/StudyBuddy/StudyBuddy';
import { useTranslation, isRTL } from './utils/translations';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  animations: boolean;
  accentColor: string;
  voiceSettings: {
    language: string;
    voice: string;
    rate: number;
    pitch: number;
    volume: number;
  };
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'interview' | 'study'>('dashboard');
  const [userName, setUserName] = useState<string>('');
  const [userScore, setUserScore] = useState<number>(80);

  // Get translations
  const { t, currentLanguage } = useTranslation();

  // Global app settings
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('learnpilot_app_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'en-US',
      animations: true,
      accentColor: '#4146F8',
      voiceSettings: {
        language: 'en-US',
        voice: 'female1',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
      }
    };
  });

  const keyFeatures = [
    { icon: <Users className="h-6 w-6" />, name: t('mockInterviews'), description: t('practiceWithAI') },
    { icon: <MessageCircle className="h-6 w-6" />, name: t('studyBuddy'), description: t('aiPoweredLearning') },
    { icon: <BookOpen className="h-6 w-6" />, name: t('flashcards'), description: t('reviewCreate') },
    { icon: <Calendar className="h-6 w-6" />, name: t('videoMeeting'), description: t('liveSessions') },
  ];

  const popularServices = [
    { name: t('mockInterviews'), percentage: 40, color: '#4CAF50' },
    { name: t('studyBuddy'), percentage: 25, color: '#2196F3' },
    { name: t('flashcards'), percentage: 20, color: '#FF9800' },
    { name: t('videoMeeting'), percentage: 15, color: '#E91E63' },
  ];

  // Apply global settings to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    console.log('🎨 Applying theme:', appSettings.theme);
    
    // Remove all theme classes first
    root.classList.remove('dark');
    body.classList.remove('dark');
    
    // Apply theme with proper CSS variables and classes
    if (appSettings.theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      body.style.backgroundColor = '#111827';
      body.style.color = '#f9fafb';
      
      // Set CSS custom properties for dark theme
      root.style.setProperty('--bg-primary', '#111827');
      root.style.setProperty('--bg-secondary', '#1f2937');
      root.style.setProperty('--text-primary', '#f9fafb');
      root.style.setProperty('--text-secondary', '#d1d5db');
      
      console.log('🌙 Applied dark theme with CSS variables');
    } else if (appSettings.theme === 'light') {
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#111827';
      
      // Set CSS custom properties for light theme
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f9fafb');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#374151');
      
      console.log('☀️ Applied light theme with CSS variables');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        body.classList.add('dark');
        body.style.backgroundColor = '#111827';
        body.style.color = '#f9fafb';
        
        root.style.setProperty('--bg-primary', '#111827');
        root.style.setProperty('--bg-secondary', '#1f2937');
        root.style.setProperty('--text-primary', '#f9fafb');
        root.style.setProperty('--text-secondary', '#d1d5db');
        
        console.log('🌙 Applied system dark theme with CSS variables');
      } else {
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#111827';
        
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f9fafb');
        root.style.setProperty('--text-primary', '#111827');
        root.style.setProperty('--text-secondary', '#374151');
        
        console.log('☀️ Applied system light theme with CSS variables');
      }
    }

    // Apply accent color
    root.style.setProperty('--accent-color', appSettings.accentColor);
    console.log('🎨 Applied accent color:', appSettings.accentColor);
    
    // Apply language to document
    document.documentElement.lang = appSettings.language.split('-')[0];
    
    // Set page title based on language
    const titles = {
      'en': 'LearnPilot - AI-Powered Learning Platform',
      'ar': 'ليرن بايلوت - منصة التعلم بالذكاء الاصطناعي',
      'tl': 'LearnPilot - AI Learning Platform',
      'my': 'LearnPilot - AI သင်ခန်းစာ ပလပ်ဖောင်း',
      'sw': 'LearnPilot - Jukwaa la Kujifunza la AI',
      'id': 'LearnPilot - Platform Pembelajaran AI'
    };
    
    const langCode = appSettings.language.split('-')[0];
    document.title = titles[langCode as keyof typeof titles] || titles.en;
    
    // Apply RTL for Arabic and other RTL languages
    if (isRTL(appSettings.language)) {
      document.documentElement.dir = 'rtl';
      body.style.fontFamily = 'Tahoma, Arial, sans-serif'; // Better Arabic font support
    } else {
      document.documentElement.dir = 'ltr';
      body.style.fontFamily = 'Inter, ui-sans-serif, system-ui, sans-serif';
    }

    console.log('🌍 Applied global settings:', appSettings);
  }, [appSettings]);

  // Listen for settings changes
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      console.log('🔄 App received global settings update:', event.detail);
      setAppSettings(event.detail);
      localStorage.setItem('learnpilot_app_settings', JSON.stringify(event.detail));
    };

    window.addEventListener('settings-saved', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('settings-saved', handleSettingsChange as EventListener);
    };
  }, []);

  useEffect(() => {
    // Check if user is remembered
    const rememberedUser = localStorage.getItem('learnpilot_remembered_user');
    if (rememberedUser) {
      const userData = JSON.parse(rememberedUser);
      setIsLoggedIn(true);
      setUserName(userData.name);
      setUserScore(userData.score || 80);
      setProfileImage(userData.profileImage || null);
    }
  }, []);

  const handleLogin = (email: string, password: string, rememberMe: boolean) => {
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    setIsLoggedIn(true);
    setShowLogin(false);
    setUserName(formattedName);
    
    // Save user data if remember me is checked
    if (rememberMe) {
      const userData = {
        email,
        name: formattedName,
        score: userScore,
        profileImage
      };
      localStorage.setItem('learnpilot_remembered_user', JSON.stringify(userData));
    }
  };

  const handleSignUp = (data: any) => {
    setIsLoggedIn(true);
    setShowSignUp(false);
    setUserName(data.name || 'User');
    
    // Save user data
    const userData = {
      email: data.email,
      name: data.name,
      score: 80,
      profileImage: null
    };
    localStorage.setItem('learnpilot_user', JSON.stringify(userData));
  };

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const updateUserScore = (newScore: number) => {
    setUserScore(newScore);
    
    // Update stored user data
    const rememberedUser = localStorage.getItem('learnpilot_remembered_user');
    if (rememberedUser) {
      const userData = JSON.parse(rememberedUser);
      userData.score = newScore;
      localStorage.setItem('learnpilot_remembered_user', JSON.stringify(userData));
    }
  };

  // Get display name for AI interactions
  const getDisplayName = () => {
    const savedDisplayName = localStorage.getItem(`learnpilot_display_name_${userName}`);
    return savedDisplayName || userName;
  };

  if (isLoggedIn) {
    switch (currentView) {
      case 'interview':
        return <MockInterview userName={getDisplayName()} />;
      case 'study':
        return <StudyBuddy userName={getDisplayName()} />;
      default:
        return (
          <Dashboard
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            keyFeatures={keyFeatures}
            popularServices={popularServices}
            onStartInterview={() => setCurrentView('interview')}
            onStartStudy={() => setCurrentView('study')}
            userName={userName}
            userScore={userScore}
          />
        );
    }
  }

  // Get theme classes for landing page with proper dark mode support
  const getThemeClasses = () => {
    if (appSettings.theme === 'dark') {
      return 'dark bg-gray-900 text-white';
    } else if (appSettings.theme === 'light') {
      return 'bg-white text-gray-900';
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900';
    }
  };

  return (
    <div className={`font-sans antialiased transition-colors duration-300 ${getThemeClasses()} ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      <Navbar onLoginClick={() => setShowLogin(true)} onSignUpClick={() => setShowSignUp(true)} />
      <Hero onGetStarted={() => setShowSignUp(true)} onLearnMore={scrollToHowItWorks} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
      {showLogin && <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      {showSignUp && <SignUp onSignUp={handleSignUp} onClose={() => setShowSignUp(false)} />}
    </div>
  );
}

export default App;