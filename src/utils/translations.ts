// Comprehensive translation system for 7 languages
export interface Translation {
  // Navigation & Common
  learnPilot: string;
  features: string;
  howItWorks: string;
  pricing: string;
  testimonials: string;
  login: string;
  signUp: string;
  getStarted: string;
  learnMore: string;
  
  // Hero Section
  learnFasterWith: string;
  aiPowered: string;
  education: string;
  heroDescription: string;
  trustedByThousands: string;
  
  // Dashboard
  welcomeBack: string;
  readyToContinue: string;
  learningProgress: string;
  overallPerformance: string;
  keyFeatures: string;
  mockInterviews: string;
  studyBuddy: string;
  flashcards: string;
  videoMeeting: string;
  practiceWithAI: string;
  aiPoweredLearning: string;
  reviewCreate: string;
  liveSessions: string;
  learningAnalytics: string;
  learningInsights: string;
  settings: string;
  changeName: string;
  allAIInteractions: string;
  sessions: string;
  interviews: string;
  hoursStudied: string;
  score: string;
  latestInterviewPractice: string;
  mockInterviewPerformance: string;
  completed: string;
  today: string;
  studyProgress: string;
  hoursOfLearning: string;
  dayStreak: string;
  recent: string;
  keepPracticingInsights: string;
  updated: string;
  
  // Mock Interview
  aiMockInterview: string;
  uploadCV: string;
  jobDescription: string;
  chooseInterviewer: string;
  friendlyHR: string;
  professionalRecruiter: string;
  industryExpert: string;
  warmEncouraging: string;
  structuredBalanced: string;
  technicalChallenging: string;
  interviewInProgress: string;
  aiSpeaking: string;
  listening: string;
  finishInterview: string;
  interviewComplete: string;
  
  // File Upload
  uploadCVResume: string;
  dragDropCV: string;
  browseFiles: string;
  pasteJobDescriptionHere: string;
  quickStart: string;
  skipUpload: string;
  skipUploadDescription: string;
  aiFeatures: string;
  realTimeVoiceConversation: string;
  cvBasedPersonalizedQuestions: string;
  multipleInterviewerPersonalities: string;
  instantPerformanceFeedback: string;
  multiLanguageSupport: string;
  recentInterviews: string;
  jobDetails: string;
  enterJobDetailsDescription: string;
  enterJobDetailsToStart: string;
  selectInterviewerType: string;
  
  // Settings
  globalSettings: string;
  languageRegion: string;
  applicationLanguage: string;
  appearance: string;
  light: string;
  dark: string;
  system: string;
  accentColors: string;
  voiceAudio: string;
  voiceType: string;
  ttsProvider: string;
  speakingSpeed: string;
  voicePitch: string;
  volume: string;
  autoStartListening: string;
  general: string;
  showAnimations: string;
  enableNotifications: string;
  soundEffects: string;
  
  // Interview Phrases
  hello: string;
  welcomeToInterview: string;
  tellMeAboutYourself: string;
  whyInterested: string;
  greatestStrengths: string;
  challengingProject: string;
  difficultTeamMember: string;
  learnSomethingNew: string;
  stayCurrentTrends: string;
  problemSolvingProcess: string;
  whereDoYouSee: string;
  questionsForMe: string;
  anythingElse: string;
  thankYouInterview: string;
  background: string;
  experience: string;
  technical: string;
  closing: string;
  whatMotivated: string;
  
  // Feedback
  excellent: string;
  good: string;
  needsImprovement: string;
  strengths: string;
  areasForImprovement: string;
  nextSteps: string;
  downloadCV: string;
  downloadCoverLetter: string;
  youSaid: string;
  
  // Common Actions
  continue: string;
  back: string;
  next: string;
  save: string;
  cancel: string;
  apply: string;
  done: string;
  startInterview: string;
  
  // Time & Progress
  duration: string;
  questions: string;
  phase: string;
  progress: string;
  
  // Voice Status
  aiReady: string;
  listeningForResponse: string;
  readyForConversation: string;
  testVoice: string;
  voiceEnabled: string;
  voiceDisabled: string;
  stopListening: string;
  startListening: string;
}

export const translations: Record<string, Translation> = {
  'en-US': {
    // Navigation & Common
    learnPilot: 'LearnPilot',
    features: 'Features',
    howItWorks: 'How It Works',
    pricing: 'Pricing',
    testimonials: 'Testimonials',
    login: 'Log in',
    signUp: 'Sign up',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // Hero Section
    learnFasterWith: 'Learn Faster with',
    aiPowered: 'AI-Powered',
    education: 'Education',
    heroDescription: 'Master interviews, ace your studies, and connect with peers using LearnPilot\'s cutting-edge AI learning platform.',
    trustedByThousands: 'Trusted by thousands of learners',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    readyToContinue: 'Ready to continue your learning journey?',
    learningProgress: 'Your Learning Progress',
    overallPerformance: 'Overall performance score with LearnPilot',
    keyFeatures: 'Key Features',
    mockInterviews: 'Mock Interviews',
    studyBuddy: 'Study Buddy',
    flashcards: 'Flashcards',
    videoMeeting: 'Video Meeting',
    practiceWithAI: 'Practice with AI',
    aiPoweredLearning: 'AI-powered learning',
    reviewCreate: 'Review & create',
    liveSessions: 'Live sessions',
    learningAnalytics: 'Learning Analytics',
    learningInsights: 'Learning Insights',
    settings: 'Settings',
    changeName: 'Change name',
    allAIInteractions: 'All AI interactions will use the name',
    sessions: 'sessions',
    interviews: 'interviews',
    hoursStudied: 'h studied',
    score: 'Score',
    latestInterviewPractice: 'Latest Interview Practice',
    mockInterviewPerformance: 'Your mock interview performance',
    completed: 'completed',
    today: 'Today',
    studyProgress: 'Study Progress',
    hoursOfLearning: 'hours of focused learning',
    dayStreak: 'day streak',
    recent: 'Recent',
    keepPracticingInsights: 'Keep practicing to unlock insights!',
    updated: 'Updated',
    
    // Mock Interview
    aiMockInterview: 'AI Mock Interview',
    uploadCV: 'Upload your CV and job description for a personalized interview experience',
    jobDescription: 'Job Description',
    chooseInterviewer: 'Choose Your Interviewer',
    friendlyHR: 'Friendly HR',
    professionalRecruiter: 'Professional Recruiter',
    industryExpert: 'Industry Expert',
    warmEncouraging: 'Warm and encouraging',
    structuredBalanced: 'Structured and balanced',
    technicalChallenging: 'Technical and challenging',
    interviewInProgress: 'Interview in Progress',
    aiSpeaking: 'AI Speaking',
    listening: 'Listening',
    finishInterview: 'Finish Interview',
    interviewComplete: 'Interview Complete!',
    
    // File Upload
    uploadCVResume: 'Upload your CV/Resume',
    dragDropCV: 'Drag and drop your CV here, or',
    browseFiles: 'browse files',
    pasteJobDescriptionHere: 'Paste the job description here...',
    quickStart: 'Quick Start',
    skipUpload: 'Skip Upload',
    skipUploadDescription: 'Skip file upload and manually enter job details for a general interview practice.',
    aiFeatures: 'AI Features',
    realTimeVoiceConversation: 'Real-time voice conversation',
    cvBasedPersonalizedQuestions: 'CV-based personalized questions',
    multipleInterviewerPersonalities: 'Multiple interviewer personalities',
    instantPerformanceFeedback: 'Instant performance feedback',
    multiLanguageSupport: 'Multi-language support',
    recentInterviews: 'Recent Interviews',
    jobDetails: 'Job Details',
    enterJobDetailsDescription: 'Enter the job details for your mock interview',
    enterJobDetailsToStart: 'Enter job details to get started with your AI-powered mock interview.',
    selectInterviewerType: 'Select the type of interview experience you want',
    
    // Settings
    globalSettings: 'Global Settings',
    languageRegion: 'Language & Region',
    applicationLanguage: 'Application Language',
    appearance: 'Appearance',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    accentColors: 'Accent Colors',
    voiceAudio: 'Voice & Audio',
    voiceType: 'Voice Type',
    ttsProvider: 'TTS Provider',
    speakingSpeed: 'Speaking Speed',
    voicePitch: 'Voice Pitch',
    volume: 'Volume',
    autoStartListening: 'Auto-start listening after AI speaks',
    general: 'General',
    showAnimations: 'Show Animations',
    enableNotifications: 'Enable Notifications',
    soundEffects: 'Sound Effects',
    
    // Interview Phrases
    hello: 'Hello',
    welcomeToInterview: 'Welcome to your interview',
    tellMeAboutYourself: 'Tell me about yourself and what brings you here today.',
    whyInterested: 'Why are you specifically interested in this role?',
    greatestStrengths: 'What are your greatest strengths?',
    challengingProject: 'Tell me about a challenging project you worked on.',
    difficultTeamMember: 'Describe a time when you had to work with a difficult team member.',
    learnSomethingNew: 'Give me an example of when you had to learn something new quickly.',
    stayCurrentTrends: 'How do you stay current with industry trends?',
    problemSolvingProcess: 'Describe your problem-solving process.',
    whereDoYouSee: 'Where do you see yourself in 5 years?',
    questionsForMe: 'Do you have any questions for me?',
    anythingElse: 'Is there anything else you\'d like me to know?',
    thankYouInterview: 'Thank you for the interview! You did great.',
    background: 'Background',
    experience: 'Experience',
    technical: 'Technical/Skills',
    closing: 'Closing',
    whatMotivated: 'What motivated you to pursue a career in this field?',
    
    // Feedback
    excellent: 'Excellent',
    good: 'Good',
    needsImprovement: 'Needs Improvement',
    strengths: 'Strengths',
    areasForImprovement: 'Areas for Improvement',
    nextSteps: 'Next Steps',
    downloadCV: 'Download Enhanced CV',
    downloadCoverLetter: 'Download Cover Letter',
    youSaid: 'You said',
    
    // Common Actions
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    save: 'Save',
    cancel: 'Cancel',
    apply: 'Apply',
    done: 'Done',
    startInterview: 'Start Interview',
    
    // Time & Progress
    duration: 'Duration',
    questions: 'Questions',
    phase: 'Phase',
    progress: 'Progress',
    
    // Voice Status
    aiReady: 'AI Ready',
    listeningForResponse: 'Listening for your response',
    readyForConversation: 'Ready for conversation',
    testVoice: 'Test Voice',
    voiceEnabled: 'Voice enabled',
    voiceDisabled: 'Voice disabled',
    stopListening: 'Stop listening',
    startListening: 'Start listening',
  },
  
  'ar-SA': {
    // Navigation & Common
    learnPilot: 'ليرن بايلوت',
    features: 'الميزات',
    howItWorks: 'كيف يعمل',
    pricing: 'الأسعار',
    testimonials: 'الشهادات',
    login: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    getStarted: 'ابدأ الآن',
    learnMore: 'اعرف المزيد',
    
    // Hero Section
    learnFasterWith: 'تعلم بشكل أسرع مع',
    aiPowered: 'الذكاء الاصطناعي',
    education: 'التعليم',
    heroDescription: 'أتقن المقابلات، وانجح في دراستك، وتواصل مع الأقران باستخدام منصة التعلم المتطورة بالذكاء الاصطناعي من ليرن بايلوت.',
    trustedByThousands: 'موثوق به من قبل آلاف المتعلمين',
    
    // Dashboard
    welcomeBack: 'مرحباً بعودتك',
    readyToContinue: 'هل أنت مستعد لمواصلة رحلة التعلم؟',
    learningProgress: 'تقدمك في التعلم',
    overallPerformance: 'نتيجة الأداء الإجمالية مع ليرن بايلوت',
    keyFeatures: 'الميزات الرئيسية',
    mockInterviews: 'مقابلات وهمية',
    studyBuddy: 'رفيق الدراسة',
    flashcards: 'البطاقات التعليمية',
    videoMeeting: 'اجتماع فيديو',
    practiceWithAI: 'تدرب مع الذكاء الاصطناعي',
    aiPoweredLearning: 'تعلم بالذكاء الاصطناعي',
    reviewCreate: 'راجع وأنشئ',
    liveSessions: 'جلسات مباشرة',
    learningAnalytics: 'تحليلات التعلم',
    learningInsights: 'رؤى التعلم',
    settings: 'الإعدادات',
    changeName: 'تغيير الاسم',
    allAIInteractions: 'جميع تفاعلات الذكاء الاصطناعي ستستخدم الاسم',
    sessions: 'جلسات',
    interviews: 'مقابلات',
    hoursStudied: 'ساعة دراسة',
    score: 'النتيجة',
    latestInterviewPractice: 'آخر تدريب مقابلة',
    mockInterviewPerformance: 'أداء المقابلة الوهمية',
    completed: 'مكتملة',
    today: 'اليوم',
    studyProgress: 'تقدم الدراسة',
    hoursOfLearning: 'ساعات من التعلم المركز',
    dayStreak: 'سلسلة أيام',
    recent: 'حديث',
    keepPracticingInsights: 'استمر في التدريب لفتح الرؤى!',
    updated: 'محدث',
    
    // Mock Interview
    aiMockInterview: 'مقابلة وهمية بالذكاء الاصطناعي',
    uploadCV: 'ارفع سيرتك الذاتية ووصف الوظيفة للحصول على تجربة مقابلة شخصية',
    jobDescription: 'وصف الوظيفة',
    chooseInterviewer: 'اختر المحاور',
    friendlyHR: 'موارد بشرية ودود',
    professionalRecruiter: 'مجند محترف',
    industryExpert: 'خبير في المجال',
    warmEncouraging: 'دافئ ومشجع',
    structuredBalanced: 'منظم ومتوازن',
    technicalChallenging: 'تقني وصعب',
    interviewInProgress: 'المقابلة جارية',
    aiSpeaking: 'الذكاء الاصطناعي يتحدث',
    listening: 'يستمع',
    finishInterview: 'إنهاء المقابلة',
    interviewComplete: 'المقابلة مكتملة!',
    
    // File Upload
    uploadCVResume: 'ارفع سيرتك الذاتية',
    dragDropCV: 'اسحب وأفلت سيرتك الذاتية هنا، أو',
    browseFiles: 'تصفح الملفات',
    pasteJobDescriptionHere: 'الصق وصف الوظيفة هنا...',
    quickStart: 'بداية سريعة',
    skipUpload: 'تخطي الرفع',
    skipUploadDescription: 'تخطي رفع الملف وأدخل تفاصيل الوظيفة يدوياً لممارسة مقابلة عامة.',
    aiFeatures: 'ميزات الذكاء الاصطناعي',
    realTimeVoiceConversation: 'محادثة صوتية في الوقت الفعلي',
    cvBasedPersonalizedQuestions: 'أسئلة شخصية مبنية على السيرة الذاتية',
    multipleInterviewerPersonalities: 'شخصيات متعددة للمحاورين',
    instantPerformanceFeedback: 'تقييم فوري للأداء',
    multiLanguageSupport: 'دعم متعدد اللغات',
    recentInterviews: 'المقابلات الأخيرة',
    jobDetails: 'تفاصيل الوظيفة',
    enterJobDetailsDescription: 'أدخل تفاصيل الوظيفة لمقابلتك الوهمية',
    enterJobDetailsToStart: 'أدخل تفاصيل الوظيفة للبدء بمقابلتك الوهمية بالذكاء الاصطناعي.',
    selectInterviewerType: 'اختر نوع تجربة المقابلة التي تريدها',
    
    // Settings
    globalSettings: 'الإعدادات العامة',
    languageRegion: 'اللغة والمنطقة',
    applicationLanguage: 'لغة التطبيق',
    appearance: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
    accentColors: 'الألوان المميزة',
    voiceAudio: 'الصوت والصوتيات',
    voiceType: 'نوع الصوت',
    ttsProvider: 'مزود تحويل النص إلى كلام',
    speakingSpeed: 'سرعة الكلام',
    voicePitch: 'نبرة الصوت',
    volume: 'مستوى الصوت',
    autoStartListening: 'ابدأ الاستماع تلقائياً بعد كلام الذكاء الاصطناعي',
    general: 'عام',
    showAnimations: 'إظهار الرسوم المتحركة',
    enableNotifications: 'تفعيل الإشعارات',
    soundEffects: 'المؤثرات الصوتية',
    
    // Interview Phrases
    hello: 'مرحباً',
    welcomeToInterview: 'مرحباً بك في مقابلتك',
    tellMeAboutYourself: 'أخبرني عن نفسك وما الذي جعلك تأتي إلى هنا اليوم.',
    whyInterested: 'لماذا أنت مهتم بهذا المنصب تحديداً؟',
    greatestStrengths: 'ما هي أعظم نقاط قوتك؟',
    challengingProject: 'أخبرني عن مشروع صعب عملت عليه.',
    difficultTeamMember: 'صف وقتاً اضطررت فيه للعمل مع عضو فريق صعب.',
    learnSomethingNew: 'أعطني مثالاً عن وقت اضطررت فيه لتعلم شيء جديد بسرعة.',
    stayCurrentTrends: 'كيف تبقى مطلعاً على اتجاهات الصناعة؟',
    problemSolvingProcess: 'صف عملية حل المشكلات لديك.',
    whereDoYouSee: 'أين ترى نفسك خلال 5 سنوات؟',
    questionsForMe: 'هل لديك أي أسئلة لي؟',
    anythingElse: 'هل هناك أي شيء آخر تريد أن أعرفه؟',
    thankYouInterview: 'شكراً لك على المقابلة! لقد أديت بشكل رائع.',
    background: 'الخلفية',
    experience: 'الخبرة',
    technical: 'التقني/المهارات',
    closing: 'الختام',
    whatMotivated: 'ما الذي دفعك لمتابعة مهنة في هذا المجال؟',
    
    // Feedback
    excellent: 'ممتاز',
    good: 'جيد',
    needsImprovement: 'يحتاج تحسين',
    strengths: 'نقاط القوة',
    areasForImprovement: 'مجالات التحسين',
    nextSteps: 'الخطوات التالية',
    downloadCV: 'تحميل السيرة الذاتية المحسنة',
    downloadCoverLetter: 'تحميل خطاب التغطية',
    youSaid: 'قلت',
    
    // Common Actions
    continue: 'متابعة',
    back: 'رجوع',
    next: 'التالي',
    save: 'حفظ',
    cancel: 'إلغاء',
    apply: 'تطبيق',
    done: 'تم',
    startInterview: 'بدء المقابلة',
    
    // Time & Progress
    duration: 'المدة',
    questions: 'الأسئلة',
    phase: 'المرحلة',
    progress: 'التقدم',
    
    // Voice Status
    aiReady: 'الذكاء الاصطناعي جاهز',
    listeningForResponse: 'يستمع لردك',
    readyForConversation: 'جاهز للمحادثة',
    testVoice: 'اختبار الصوت',
    voiceEnabled: 'الصوت مفعل',
    voiceDisabled: 'الصوت معطل',
    stopListening: 'إيقاف الاستماع',
    startListening: 'بدء الاستماع',
  },

  'tl-PH': {
    // Navigation & Common
    learnPilot: 'LearnPilot',
    features: 'Mga Tampok',
    howItWorks: 'Paano Gumagana',
    pricing: 'Presyo',
    testimonials: 'Mga Testimonial',
    login: 'Mag-login',
    signUp: 'Mag-sign up',
    getStarted: 'Magsimula',
    learnMore: 'Matuto Pa',
    
    // Hero Section
    learnFasterWith: 'Matuto nang Mas Mabilis gamit ang',
    aiPowered: 'AI-Powered',
    education: 'Edukasyon',
    heroDescription: 'Maging dalubhasa sa mga interview, magtagumpay sa inyong pag-aaral, at makipag-ugnayan sa mga kapwa gamit ang makabagong AI learning platform ng LearnPilot.',
    trustedByThousands: 'Pinagkakatiwalaan ng libu-libong mag-aaral',
    
    // Dashboard
    welcomeBack: 'Maligayang pagbabalik',
    readyToContinue: 'Handa na bang ipagpatuloy ang inyong learning journey?',
    learningProgress: 'Inyong Learning Progress',
    overallPerformance: 'Kabuuang performance score gamit ang LearnPilot',
    keyFeatures: 'Mga Pangunahing Tampok',
    mockInterviews: 'Mock Interviews',
    studyBuddy: 'Study Buddy',
    flashcards: 'Flashcards',
    videoMeeting: 'Video Meeting',
    practiceWithAI: 'Mag-practice gamit ang AI',
    aiPoweredLearning: 'AI-powered na pag-aaral',
    reviewCreate: 'Mag-review at lumikha',
    liveSessions: 'Live sessions',
    learningAnalytics: 'Learning Analytics',
    learningInsights: 'Learning Insights',
    settings: 'Mga Setting',
    changeName: 'Palitan ang pangalan',
    allAIInteractions: 'Lahat ng AI interactions ay gagamitin ang pangalan',
    sessions: 'mga session',
    interviews: 'mga interview',
    hoursStudied: 'oras ng pag-aaral',
    score: 'Score',
    latestInterviewPractice: 'Pinakabagong Interview Practice',
    mockInterviewPerformance: 'Inyong mock interview performance',
    completed: 'natapos',
    today: 'Ngayon',
    studyProgress: 'Study Progress',
    hoursOfLearning: 'oras ng focused learning',
    dayStreak: 'araw na tuloy-tuloy',
    recent: 'Kamakailang',
    keepPracticingInsights: 'Magpatuloy sa pag-practice para ma-unlock ang insights!',
    updated: 'Na-update',
    
    // Mock Interview
    aiMockInterview: 'AI Mock Interview',
    uploadCV: 'I-upload ang inyong CV at job description para sa personalized interview experience',
    jobDescription: 'Job Description',
    chooseInterviewer: 'Piliin ang Inyong Interviewer',
    friendlyHR: 'Friendly HR',
    professionalRecruiter: 'Professional Recruiter',
    industryExpert: 'Industry Expert',
    warmEncouraging: 'Mainit at nakakaengganyo',
    structuredBalanced: 'Structured at balanced',
    technicalChallenging: 'Technical at challenging',
    interviewInProgress: 'Interview ay Tumutulong',
    aiSpeaking: 'Nagsasalita ang AI',
    listening: 'Nakikinig',
    finishInterview: 'Tapusin ang Interview',
    interviewComplete: 'Tapos na ang Interview!',
    
    // File Upload
    uploadCVResume: 'I-upload ang inyong CV/Resume',
    dragDropCV: 'I-drag at i-drop ang inyong CV dito, o',
    browseFiles: 'mag-browse ng files',
    pasteJobDescriptionHere: 'I-paste ang job description dito...',
    quickStart: 'Quick Start',
    skipUpload: 'Laktawan ang Upload',
    skipUploadDescription: 'Laktawan ang file upload at manual na ilagay ang job details para sa general interview practice.',
    aiFeatures: 'Mga AI Features',
    realTimeVoiceConversation: 'Real-time voice conversation',
    cvBasedPersonalizedQuestions: 'CV-based na personalized questions',
    multipleInterviewerPersonalities: 'Maraming interviewer personalities',
    instantPerformanceFeedback: 'Instant performance feedback',
    multiLanguageSupport: 'Multi-language support',
    recentInterviews: 'Mga Kamakailang Interview',
    jobDetails: 'Mga Job Details',
    enterJobDetailsDescription: 'Ilagay ang job details para sa inyong mock interview',
    enterJobDetailsToStart: 'Ilagay ang job details para magsimula sa inyong AI-powered mock interview.',
    selectInterviewerType: 'Piliin ang uri ng interview experience na gusto ninyo',
    
    // Settings
    globalSettings: 'Global Settings',
    languageRegion: 'Wika at Rehiyon',
    applicationLanguage: 'Wika ng Application',
    appearance: 'Hitsura',
    light: 'Maliwanag',
    dark: 'Madilim',
    system: 'System',
    accentColors: 'Accent Colors',
    voiceAudio: 'Voice at Audio',
    voiceType: 'Uri ng Voice',
    ttsProvider: 'TTS Provider',
    speakingSpeed: 'Bilis ng Pagsasalita',
    voicePitch: 'Voice Pitch',
    volume: 'Volume',
    autoStartListening: 'Automatic na magsimulang makinig pagkatapos magsalita ng AI',
    general: 'General',
    showAnimations: 'Ipakita ang Animations',
    enableNotifications: 'I-enable ang Notifications',
    soundEffects: 'Sound Effects',
    
    // Interview Phrases
    hello: 'Kumusta',
    welcomeToInterview: 'Maligayang pagdating sa inyong interview',
    tellMeAboutYourself: 'Sabihin ninyo sa akin ang tungkol sa inyong sarili at kung ano ang nagdala sa inyo dito ngayon.',
    whyInterested: 'Bakit kayo specifically interested sa role na ito?',
    greatestStrengths: 'Ano ang inyong pinakamalalaking strengths?',
    challengingProject: 'Sabihin ninyo sa akin ang tungkol sa challenging project na ginawa ninyo.',
    difficultTeamMember: 'Ilarawan ang panahong kailangan ninyong makipagtrabaho sa mahirap na team member.',
    learnSomethingNew: 'Magbigay ng halimbawa kung kailan kailangan ninyong matuto ng bagong bagay nang mabilis.',
    stayCurrentTrends: 'Paano ninyo sinusubaybayan ang mga industry trends?',
    problemSolvingProcess: 'Ilarawan ang inyong problem-solving process.',
    whereDoYouSee: 'Saan ninyo nakikita ang inyong sarili sa loob ng 5 taon?',
    questionsForMe: 'May mga tanong ba kayo para sa akin?',
    anythingElse: 'May iba pa bang gusto ninyong malaman ko?',
    thankYouInterview: 'Salamat sa interview! Napakagaling ninyo.',
    background: 'Background',
    experience: 'Experience',
    technical: 'Technical/Skills',
    closing: 'Pagtatapos',
    whatMotivated: 'Ano ang nag-motivate sa inyo na magpursue ng career sa field na ito?',
    
    // Feedback
    excellent: 'Napakagaling',
    good: 'Maganda',
    needsImprovement: 'Kailangan ng Improvement',
    strengths: 'Mga Strengths',
    areasForImprovement: 'Mga Area para sa Improvement',
    nextSteps: 'Mga Susunod na Hakbang',
    downloadCV: 'I-download ang Enhanced CV',
    downloadCoverLetter: 'I-download ang Cover Letter',
    youSaid: 'Sinabi ninyo',
    
    // Common Actions
    continue: 'Magpatuloy',
    back: 'Bumalik',
    next: 'Susunod',
    save: 'I-save',
    cancel: 'I-cancel',
    apply: 'I-apply',
    done: 'Tapos na',
    startInterview: 'Simulan ang Interview',
    
    // Time & Progress
    duration: 'Duration',
    questions: 'Mga Tanong',
    phase: 'Phase',
    progress: 'Progress',
    
    // Voice Status
    aiReady: 'Handa na ang AI',
    listeningForResponse: 'Nakikinig sa inyong response',
    readyForConversation: 'Handa na para sa conversation',
    testVoice: 'Test Voice',
    voiceEnabled: 'Naka-enable ang voice',
    voiceDisabled: 'Naka-disable ang voice',
    stopListening: 'Tumigil sa pakikinig',
    startListening: 'Simulan ang pakikinig',
  },

  'my-MM': {
    // Navigation & Common
    learnPilot: 'LearnPilot',
    features: 'လုပ်ဆောင်ချက်များ',
    howItWorks: 'အလုပ်လုပ်ပုံ',
    pricing: 'စျေးနှုန်း',
    testimonials: 'သက်သေခံချက်များ',
    login: 'ဝင်ရောက်ရန်',
    signUp: 'စာရင်းသွင်းရန်',
    getStarted: 'စတင်ရန်',
    learnMore: 'ပိုမိုလေ့လာရန်',
    
    // Hero Section
    learnFasterWith: 'ပိုမိုမြန်ဆန်စွာ သင်ယူပါ',
    aiPowered: 'AI စွမ်းအားဖြင့်',
    education: 'ပညာရေး',
    heroDescription: 'LearnPilot ၏ ခေတ်မီ AI သင်ယူမှုပလပ်ဖောင်းကို အသုံးပြု၍ အင်တာဗျူးများကို ကျွမ်းကျင်စွာ လုပ်ဆောင်ပါ၊ သင်ယူမှုတွင် အောင်မြင်ပါ၊ သူငယ်ချင်းများနှင့် ဆက်သွယ်ပါ။',
    trustedByThousands: 'ထောင်ပေါင်းများစွာသော သင်ယူသူများ ယုံကြည်အားကိုးသည်',
    
    // Dashboard
    welcomeBack: 'ပြန်လည်ကြိုဆိုပါသည်',
    readyToContinue: 'သင်ယူမှုခရီးကို ဆက်လက်လုပ်ဆောင်ရန် အဆင်သင့်ဖြစ်ပါသလား?',
    learningProgress: 'သင်၏ သင်ယူမှုတိုးတက်မှု',
    overallPerformance: 'LearnPilot နှင့် အတူ အလုံးစုံစွမ်းဆောင်ရည်ရမှတ်',
    keyFeatures: 'အဓိကလုပ်ဆောင်ချက်များ',
    mockInterviews: 'အင်တာဗျူးလေ့ကျင့်ခန်း',
    studyBuddy: 'သင်ယူမှုအဖော်',
    flashcards: 'ဖလက်ရှ်ကတ်များ',
    videoMeeting: 'ဗီဒီယိုအစည်းအဝေး',
    practiceWithAI: 'AI နှင့် လေ့ကျင့်ပါ',
    aiPoweredLearning: 'AI စွမ်းအားဖြင့် သင်ယူမှု',
    reviewCreate: 'ပြန်လည်သုံးသပ်ပြီး ဖန်တီးပါ',
    liveSessions: 'တိုက်ရိုက်ထုတ်လွှင့်မှုများ',
    learningAnalytics: 'သင်ယူမှုခွဲခြမ်းစိတ်ဖြာမှု',
    learningInsights: 'သင်ယူမှုထိုးထွင်းသိမြင်မှု',
    settings: 'ဆက်တင်များ',
    changeName: 'နာမည်ပြောင်းရန်',
    allAIInteractions: 'AI အပြန်အလှန်တုံ့ပြန်မှုများအားလုံးသည် နာမည်ကို အသုံးပြုမည်',
    sessions: 'ကဏ္ဍများ',
    interviews: 'အင်တာဗျူးများ',
    hoursStudied: 'နာရီ သင်ယူခဲ့',
    score: 'ရမှတ်',
    latestInterviewPractice: 'နောက်ဆုံးအင်တာဗျူးလေ့ကျင့်ခန်း',
    mockInterviewPerformance: 'သင်၏ အင်တာဗျူးလေ့ကျင့်ခန်းစွမ်းဆောင်ရည်',
    completed: 'ပြီးစီးခဲ့',
    today: 'ယနေ့',
    studyProgress: 'သင်ယူမှုတိုးတက်မှု',
    hoursOfLearning: 'အာရုံစူးစိုက်သင်ယူမှုနာရီများ',
    dayStreak: 'နေ့ဆက်တိုက်',
    recent: 'မကြာသေးမီက',
    keepPracticingInsights: 'ထိုးထွင်းသိမြင်မှုများကို ဖွင့်လှစ်ရန် ဆက်လက်လေ့ကျင့်ပါ!',
    updated: 'အပ်ဒိတ်လုပ်ပြီး',
    
    // Mock Interview
    aiMockInterview: 'AI အင်တာဗျူးလေ့ကျင့်ခန်း',
    uploadCV: 'ကိုယ်ရေးအကျဉ်းနှင့် အလုပ်ဖော်ပြချက်ကို တင်ပြီး ကိုယ်ပိုင်အင်တာဗျူးအတွေ့အကြုံရယူပါ',
    jobDescription: 'အလုပ်ဖော်ပြချက်',
    chooseInterviewer: 'သင်၏အင်တာဗျူးယူသူကို ရွေးချယ်ပါ',
    friendlyHR: 'ဖော်ရွေသော HR',
    professionalRecruiter: 'ပရော်ဖက်ရှင်နယ် စုဆောင်းသူ',
    industryExpert: 'စက်မှုကျွမ်းကျင်သူ',
    warmEncouraging: 'နွေးထွေးပြီး အားပေးသော',
    structuredBalanced: 'ဖွဲ့စည်းပုံရှိပြီး ဟန်ချက်ညီသော',
    technicalChallenging: 'နည်းပညာပိုင်းနှင့် စိန်ခေါ်မှုရှိသော',
    interviewInProgress: 'အင်တာဗျူးလုပ်ဆောင်နေသည်',
    aiSpeaking: 'AI ပြောနေသည်',
    listening: 'နားထောင်နေသည်',
    finishInterview: 'အင်တာဗျူးပြီးဆုံးရန်',
    interviewComplete: 'အင်တာဗျူးပြီးဆုံးပြီ!',
    
    // File Upload
    uploadCVResume: 'သင်၏ကိုယ်ရေးအကျဉ်းကို တင်ပါ',
    dragDropCV: 'သင်၏ကိုယ်ရေးအကျဉ်းကို ဤနေရာတွင် ဆွဲချပါ၊ သို့မဟုတ်',
    browseFiles: 'ဖိုင်များကို ရှာဖွေပါ',
    pasteJobDescriptionHere: 'အလုပ်ဖော်ပြချက်ကို ဤနေရာတွင် ကူးထည့်ပါ...',
    quickStart: 'မြန်ဆန်စွာစတင်ရန်',
    skipUpload: 'တင်ခြင်းကို ကျော်ပါ',
    skipUploadDescription: 'ဖိုင်တင်ခြင်းကို ကျော်ပြီး အလုပ်အသေးစိတ်များကို လက်ဖြင့်ရိုက်ထည့်ပြီး ယေဘုယျအင်တာဗျူးလေ့ကျင့်ခန်းလုပ်ပါ။',
    aiFeatures: 'AI လုပ်ဆောင်ချက်များ',
    realTimeVoiceConversation: 'အချိန်နှင့်တပြေးညီ အသံစကားပြောဆိုမှု',
    cvBasedPersonalizedQuestions: 'ကိုယ်ရေးအကျဉ်းအပေါ်အခြေခံသော ကိုယ်ပိုင်မေးခွန်းများ',
    multipleInterviewerPersonalities: 'အင်တာဗျူးယူသူ ကိုယ်ရည်ကိုယ်သွေးများစွာ',
    instantPerformanceFeedback: 'ချက်ချင်းစွမ်းဆောင်ရည်တုံ့ပြန်ချက်',
    multiLanguageSupport: 'ဘာသာစကားများစွာ ပံ့ပိုးမှု',
    recentInterviews: 'မကြာသေးမီကအင်တာဗျူးများ',
    jobDetails: 'အလုပ်အသေးစိတ်များ',
    enterJobDetailsDescription: 'သင်၏အင်တာဗျူးလေ့ကျင့်ခန်းအတွက် အလုပ်အသေးစိတ်များကို ရိုက်ထည့်ပါ',
    enterJobDetailsToStart: 'AI စွမ်းအားဖြင့် အင်တာဗျူးလေ့ကျင့်ခန်းကို စတင်ရန် အလုပ်အသေးစိတ်များကို ရိုက်ထည့်ပါ။',
    selectInterviewerType: 'သင်လိုချင်သော အင်တာဗျူးအတွေ့အကြုံအမျိုးအစားကို ရွေးချယ်ပါ',
    
    // Settings
    globalSettings: 'ကမ္ဘာ့ဆက်တင်များ',
    languageRegion: 'ဘာသာစကားနှင့်ဒေသ',
    applicationLanguage: 'အပ္ပလီကေးရှင်းဘာသာစကား',
    appearance: 'အသွင်အပြင်',
    light: 'အလင်း',
    dark: 'အမှောင်',
    system: 'စနစ်',
    accentColors: 'အထူးအရောင်များ',
    voiceAudio: 'အသံနှင့်အသံစနစ်',
    voiceType: 'အသံအမျိုးအစား',
    ttsProvider: 'TTS ပံ့ပိုးပေးသူ',
    speakingSpeed: 'ပြောဆိုမှုအမြန်နှုန်း',
    voicePitch: 'အသံအမြင့်အနိမ့်',
    volume: 'အသံအတိုးအကျယ်',
    autoStartListening: 'AI ပြောပြီးနောက် အလိုအလျောက်နားထောင်စတင်ရန်',
    general: 'ယေဘုယျ',
    showAnimations: 'ရွေ့လျားမှုများပြရန်',
    enableNotifications: 'အကြောင်းကြားချက်များကို ဖွင့်ရန်',
    soundEffects: 'အသံအကျိုးသက်ရောက်မှုများ',
    
    // Interview Phrases
    hello: 'မင်္ဂလာပါ',
    welcomeToInterview: 'သင်၏အင်တာဗျူးသို့ ကြိုဆိုပါသည်',
    tellMeAboutYourself: 'သင်အကြောင်းနှင့် ယနေ့ဤနေရာသို့ ရောက်လာရသည့်အကြောင်းကို ပြောပြပါ။',
    whyInterested: 'ဤရာထူးကို အထူးစိတ်ဝင်စားရသည့်အကြောင်းရင်းကား?',
    greatestStrengths: 'သင်၏အကြီးမားဆုံးအားသာချက်များကား?',
    challengingProject: 'သင်လုပ်ဆောင်ခဲ့သော စိန်ခေါ်မှုရှိသောပရောဂျက်တစ်ခုအကြောင်း ပြောပြပါ။',
    difficultTeamMember: 'ခက်ခဲသောအဖွဲ့ဝင်တစ်ဦးနှင့် အလုပ်လုပ်ရသည့်အချိန်ကို ဖော်ပြပါ။',
    learnSomethingNew: 'အမြန်ဆန်စွာ အသစ်တစ်ခုခုကို သင်ယူရသည့်ဥပမာတစ်ခု ပေးပါ။',
    stayCurrentTrends: 'စက်မှုလုပ်ငန်းလမ်းကြောင်းများကို မည်သို့လိုက်နေပါသလဲ?',
    problemSolvingProcess: 'သင်၏ပြဿနာဖြေရှင်းမှုလုပ်ငန်းစဉ်ကို ဖော်ပြပါ။',
    whereDoYouSee: '၅နှစ်အတွင်း သင်ကိုယ်တိုင်ကို ဘယ်နေရာတွင် မြင်ပါသလဲ?',
    questionsForMe: 'ကျွန်ုပ်အတွက် မေးခွန်းများရှိပါသလား?',
    anythingElse: 'ကျွန်ုပ်သိစေလိုသည့် အခြားအရာများရှိပါသလား?',
    thankYouInterview: 'အင်တာဗျူးအတွက် ကျေးဇူးတင်ပါသည်! သင်အလွန်ကောင်းမွန်စွာလုပ်ဆောင်ခဲ့သည်။',
    background: 'နောက်ခံ',
    experience: 'အတွေ့အကြုံ',
    technical: 'နည်းပညာ/ကျွမ်းကျင်မှု',
    closing: 'အပိတ်',
    whatMotivated: 'ဤနယ်ပယ်တွင် အသက်မွေးဝမ်းကြောင်းလုပ်ရန် သင့်ကို မည်သည့်အရာက လှုံ့ဆော်ခဲ့သနည်း?',
    
    // Feedback
    excellent: 'အလွန်ကောင်းမွန်',
    good: 'ကောင်းမွန်',
    needsImprovement: 'တိုးတက်မှုလိုအပ်',
    strengths: 'အားသာချက်များ',
    areasForImprovement: 'တိုးတက်မှုလိုအပ်သောနယ်ပယ်များ',
    nextSteps: 'နောက်ထပ်ခြေလှမ်းများ',
    downloadCV: 'တိုးတက်ကောင်းမွန်သောကိုယ်ရေးအကျဉ်းကို ဒေါင်းလုဒ်လုပ်ရန်',
    downloadCoverLetter: 'အကျုံးဝင်စာကို ဒေါင်းလုဒ်လုပ်ရန်',
    youSaid: 'သင်ပြောခဲ့သည်',
    
    // Common Actions
    continue: 'ဆက်လက်လုပ်ဆောင်ရန်',
    back: 'ပြန်သွားရန်',
    next: 'နောက်တစ်ခု',
    save: 'သိမ်းဆည်းရန်',
    cancel: 'ပယ်ဖျက်ရန်',
    apply: 'အသုံးချရန်',
    done: 'ပြီးပြီ',
    startInterview: 'အင်တာဗျူးစတင်ရန်',
    
    // Time & Progress
    duration: 'ကြာချိန်',
    questions: 'မေးခွန်းများ',
    phase: 'အဆင့်',
    progress: 'တိုးတက်မှု',
    
    // Voice Status
    aiReady: 'AI အဆင်သင့်',
    listeningForResponse: 'သင်၏တုံ့ပြန်ချက်ကို နားထောင်နေသည်',
    readyForConversation: 'စကားပြောဆိုရန် အဆင်သင့်',
    testVoice: 'အသံစမ်းသပ်ရန်',
    voiceEnabled: 'အသံဖွင့်ထားသည်',
    voiceDisabled: 'အသံပိတ်ထားသည်',
    stopListening: 'နားထောင်ခြင်းရပ်ရန်',
    startListening: 'နားထောင်ခြင်းစတင်ရန်',
  },

  'sw-KE': {
    // Navigation & Common
    learnPilot: 'LearnPilot',
    features: 'Vipengele',
    howItWorks: 'Jinsi Inavyofanya Kazi',
    pricing: 'Bei',
    testimonials: 'Ushahidi',
    login: 'Ingia',
    signUp: 'Jisajili',
    getStarted: 'Anza',
    learnMore: 'Jifunze Zaidi',
    
    // Hero Section
    learnFasterWith: 'Jifunze Haraka zaidi na',
    aiPowered: 'AI-Powered',
    education: 'Elimu',
    heroDescription: 'Bingwa mahojiano, fanikiwa katika masomo yako, na unganisha na wenzako kwa kutumia jukwaa la kujifunza la AI la kisasa la LearnPilot.',
    trustedByThousands: 'Linaaminiwa na maelfu ya wanafunzi',
    
    // Dashboard
    welcomeBack: 'Karibu tena',
    readyToContinue: 'Uko tayari kuendelea na safari yako ya kujifunza?',
    learningProgress: 'Maendeleo Yako ya Kujifunza',
    overallPerformance: 'Alama ya jumla ya utendaji na LearnPilot',
    keyFeatures: 'Vipengele Muhimu',
    mockInterviews: 'Mahojiano ya Mazoezi',
    studyBuddy: 'Mwenzako wa Kusoma',
    flashcards: 'Kadi za Haraka',
    videoMeeting: 'Mkutano wa Video',
    practiceWithAI: 'Fanya mazoezi na AI',
    aiPoweredLearning: 'Kujifunza kwa AI',
    reviewCreate: 'Kagua na uunde',
    liveSessions: 'Vipindi vya moja kwa moja',
    learningAnalytics: 'Uchambuzi wa Kujifunza',
    learningInsights: 'Maarifa ya Kujifunza',
    settings: 'Mipangilio',
    changeName: 'Badilisha jina',
    allAIInteractions: 'Mazungumzo yote ya AI yatatumia jina',
    sessions: 'vipindi',
    interviews: 'mahojiano',
    hoursStudied: 'masaa ya kusoma',
    score: 'Alama',
    latestInterviewPractice: 'Mazoezi ya Hivi Karibuni ya Mahojiano',
    mockInterviewPerformance: 'Utendaji wako wa mahojiano ya mazoezi',
    completed: 'imekamilika',
    today: 'Leo',
    studyProgress: 'Maendeleo ya Masomo',
    hoursOfLearning: 'masaa ya kujifunza kwa makini',
    dayStreak: 'siku za mfululizo',
    recent: 'Hivi Karibuni',
    keepPracticingInsights: 'Endelea kufanya mazoezi ili kufungua maarifa!',
    updated: 'Imesasishwa',
    
    // Mock Interview
    aiMockInterview: 'Mahojiano ya Mazoezi ya AI',
    uploadCV: 'Pakia CV yako na maelezo ya kazi kwa uzoefu wa mahojiano ya kibinafsi',
    jobDescription: 'Maelezo ya Kazi',
    chooseInterviewer: 'Chagua Mhoji Wako',
    friendlyHR: 'HR Mwenye Urafiki',
    professionalRecruiter: 'Mwajiri wa Kitaaluma',
    industryExpert: 'Mtaalamu wa Sekta',
    warmEncouraging: 'Mwenye joto na kuhamasisha',
    structuredBalanced: 'Mpangilifu na wa usawa',
    technicalChallenging: 'Wa kiufundi na changamoto',
    interviewInProgress: 'Mahojiano Yanaendelea',
    aiSpeaking: 'AI Inazungumza',
    listening: 'Inasikiliza',
    finishInterview: 'Maliza Mahojiano',
    interviewComplete: 'Mahojiano Yamekamilika!',
    
    // File Upload
    uploadCVResume: 'Pakia CV/Wasifu Wako',
    dragDropCV: 'Buruta na udondoshe CV yako hapa, au',
    browseFiles: 'vinjari faili',
    pasteJobDescriptionHere: 'Bandika maelezo ya kazi hapa...',
    quickStart: 'Anza Haraka',
    skipUpload: 'Ruka Kupakia',
    skipUploadDescription: 'Ruka kupakia faili na uingize maelezo ya kazi kwa mkono kwa mazoezi ya mahojiano ya jumla.',
    aiFeatures: 'Vipengele vya AI',
    realTimeVoiceConversation: 'Mazungumzo ya sauti ya wakati halisi',
    cvBasedPersonalizedQuestions: 'Maswali ya kibinafsi yanayotegemea CV',
    multipleInterviewerPersonalities: 'Tabia nyingi za wahoji',
    instantPerformanceFeedback: 'Maoni ya utendaji ya papo hapo',
    multiLanguageSupport: 'Msaada wa lugha nyingi',
    recentInterviews: 'Mahojiano ya Hivi Karibuni',
    jobDetails: 'Maelezo ya Kazi',
    enterJobDetailsDescription: 'Ingiza maelezo ya kazi kwa mahojiano yako ya mazoezi',
    enterJobDetailsToStart: 'Ingiza maelezo ya kazi ili kuanza mahojiano yako ya mazoezi yanayotumia AI.',
    selectInterviewerType: 'Chagua aina ya uzoefu wa mahojiano unayotaka',
    
    // Settings
    globalSettings: 'Mipangilio ya Kimataifa',
    languageRegion: 'Lugha na Mkoa',
    applicationLanguage: 'Lugha ya Programu',
    appearance: 'Mwonekano',
    light: 'Mwanga',
    dark: 'Giza',
    system: 'Mfumo',
    accentColors: 'Rangi za Msisitizo',
    voiceAudio: 'Sauti na Sauti',
    voiceType: 'Aina ya Sauti',
    ttsProvider: 'Mtoa Huduma wa TTS',
    speakingSpeed: 'Kasi ya Kuzungumza',
    voicePitch: 'Mlolongo wa Sauti',
    volume: 'Sauti',
    autoStartListening: 'Anza kusikiliza kiotomatiki baada ya AI kuzungumza',
    general: 'Jumla',
    showAnimations: 'Onyesha Michoro ya Mwendo',
    enableNotifications: 'Wezesha Arifa',
    soundEffects: 'Athari za Sauti',
    
    // Interview Phrases
    hello: 'Hujambo',
    welcomeToInterview: 'Karibu kwenye mahojiano yako',
    tellMeAboutYourself: 'Niambie kuhusu wewe na kile kinachokuelekeza hapa leo.',
    whyInterested: 'Kwa nini unapenda kazi hii hasa?',
    greatestStrengths: 'Ni nguvu gani kubwa zaidi unazozimiliki?',
    challengingProject: 'Niambie kuhusu mradi mgumu uliofanya kazi.',
    difficultTeamMember: 'Eleza wakati ulipobidi ufanye kazi na mwanatimu mgumu.',
    learnSomethingNew: 'Nipe mfano wa wakati ulipobidi ujifunze kitu kipya haraka.',
    stayCurrentTrends: 'Unajuaje mienendo ya sekta?',
    problemSolvingProcess: 'Eleza mchakato wako wa kutatua matatizo.',
    whereDoYouSee: 'Unaona wapi mwenyewe katika miaka 5?',
    questionsForMe: 'Una maswali yoyote kwangu?',
    anythingElse: 'Kuna kitu kingine chochote ungependa nijue?',
    thankYouInterview: 'Asante kwa mahojiano! Umefanya vizuri sana.',
    background: 'Mazingira',
    experience: 'Uzoefu',
    technical: 'Kiufundi/Ujuzi',
    closing: 'Mwisho',
    whatMotivated: 'Ni nini kilichokusukuma kufuata kazi katika uwanda huu?',
    
    // Feedback
    excellent: 'Bora Sana',
    good: 'Nzuri',
    needsImprovement: 'Inahitaji Kuboresha',
    strengths: 'Nguvu',
    areasForImprovement: 'Maeneo ya Kuboresha',
    nextSteps: 'Hatua Zinazofuata',
    downloadCV: 'Pakua CV Iliyoboreshwa',
    downloadCoverLetter: 'Pakua Barua ya Kujitambulisha',
    youSaid: 'Ulisema',
    
    // Common Actions
    continue: 'Endelea',
    back: 'Rudi',
    next: 'Ifuatayo',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    apply: 'Tumia',
    done: 'Imemaliza',
    startInterview: 'Anza Mahojiano',
    
    // Time & Progress
    duration: 'Muda',
    questions: 'Maswali',
    phase: 'Awamu',
    progress: 'Maendeleo',
    
    // Voice Status
    aiReady: 'AI Iko Tayari',
    listeningForResponse: 'Inasikiliza jibu lako',
    readyForConversation: 'Tayari kwa mazungumzo',
    testVoice: 'Jaribu Sauti',
    voiceEnabled: 'Sauti imewezeshwa',
    voiceDisabled: 'Sauti imezimwa',
    stopListening: 'Acha kusikiliza',
    startListening: 'Anza kusikiliza',
  },

  'id-ID': {
    // Navigation & Common
    learnPilot: 'LearnPilot',
    features: 'Fitur',
    howItWorks: 'Cara Kerja',
    pricing: 'Harga',
    testimonials: 'Testimoni',
    login: 'Masuk',
    signUp: 'Daftar',
    getStarted: 'Mulai',
    learnMore: 'Pelajari Lebih Lanjut',
    
    // Hero Section
    learnFasterWith: 'Belajar Lebih Cepat dengan',
    aiPowered: 'Bertenaga AI',
    education: 'Pendidikan',
    heroDescription: 'Kuasai wawancara, unggul dalam studi Anda, dan terhubung dengan rekan menggunakan platform pembelajaran AI canggih LearnPilot.',
    trustedByThousands: 'Dipercaya oleh ribuan pelajar',
    
    // Dashboard
    welcomeBack: 'Selamat datang kembali',
    readyToContinue: 'Siap melanjutkan perjalanan belajar Anda?',
    learningProgress: 'Kemajuan Belajar Anda',
    overallPerformance: 'Skor kinerja keseluruhan dengan LearnPilot',
    keyFeatures: 'Fitur Utama',
    mockInterviews: 'Wawancara Simulasi',
    studyBuddy: 'Teman Belajar',
    flashcards: 'Kartu Flash',
    videoMeeting: 'Pertemuan Video',
    practiceWithAI: 'Berlatih dengan AI',
    aiPoweredLearning: 'Pembelajaran bertenaga AI',
    reviewCreate: 'Tinjau & buat',
    liveSessions: 'Sesi langsung',
    learningAnalytics: 'Analitik Pembelajaran',
    learningInsights: 'Wawasan Pembelajaran',
    settings: 'Pengaturan',
    changeName: 'Ubah nama',
    allAIInteractions: 'Semua interaksi AI akan menggunakan nama',
    sessions: 'sesi',
    interviews: 'wawancara',
    hoursStudied: 'jam belajar',
    score: 'Skor',
    latestInterviewPractice: 'Latihan Wawancara Terbaru',
    mockInterviewPerformance: 'Kinerja wawancara simulasi Anda',
    completed: 'selesai',
    today: 'Hari ini',
    studyProgress: 'Kemajuan Belajar',
    hoursOfLearning: 'jam pembelajaran terfokus',
    dayStreak: 'hari berturut-turut',
    recent: 'Terbaru',
    keepPracticingInsights: 'Terus berlatih untuk membuka wawasan!',
    updated: 'Diperbarui',
    
    // Mock Interview
    aiMockInterview: 'Wawancara Simulasi AI',
    uploadCV: 'Unggah CV dan deskripsi pekerjaan Anda untuk pengalaman wawancara yang dipersonalisasi',
    jobDescription: 'Deskripsi Pekerjaan',
    chooseInterviewer: 'Pilih Pewawancara Anda',
    friendlyHR: 'HR Ramah',
    professionalRecruiter: 'Perekrut Profesional',
    industryExpert: 'Ahli Industri',
    warmEncouraging: 'Hangat dan mendorong',
    structuredBalanced: 'Terstruktur dan seimbang',
    technicalChallenging: 'Teknis dan menantang',
    interviewInProgress: 'Wawancara Sedang Berlangsung',
    aiSpeaking: 'AI Berbicara',
    listening: 'Mendengarkan',
    finishInterview: 'Selesaikan Wawancara',
    interviewComplete: 'Wawancara Selesai!',
    
    // File Upload
    uploadCVResume: 'Unggah CV/Resume Anda',
    dragDropCV: 'Seret dan jatuhkan CV Anda di sini, atau',
    browseFiles: 'jelajahi file',
    pasteJobDescriptionHere: 'Tempel deskripsi pekerjaan di sini...',
    quickStart: 'Mulai Cepat',
    skipUpload: 'Lewati Unggahan',
    skipUploadDescription: 'Lewati unggahan file dan masukkan detail pekerjaan secara manual untuk latihan wawancara umum.',
    aiFeatures: 'Fitur AI',
    realTimeVoiceConversation: 'Percakapan suara real-time',
    cvBasedPersonalizedQuestions: 'Pertanyaan yang dipersonalisasi berdasarkan CV',
    multipleInterviewerPersonalities: 'Beberapa kepribadian pewawancara',
    instantPerformanceFeedback: 'Umpan balik kinerja instan',
    multiLanguageSupport: 'Dukungan multi-bahasa',
    recentInterviews: 'Wawancara Terbaru',
    jobDetails: 'Detail Pekerjaan',
    enterJobDetailsDescription: 'Masukkan detail pekerjaan untuk wawancara simulasi Anda',
    enterJobDetailsToStart: 'Masukkan detail pekerjaan untuk memulai wawancara simulasi bertenaga AI Anda.',
    selectInterviewerType: 'Pilih jenis pengalaman wawancara yang Anda inginkan',
    
    // Settings
    globalSettings: 'Pengaturan Global',
    languageRegion: 'Bahasa & Wilayah',
    applicationLanguage: 'Bahasa Aplikasi',
    appearance: 'Tampilan',
    light: 'Terang',
    dark: 'Gelap',
    system: 'Sistem',
    accentColors: 'Warna Aksen',
    voiceAudio: 'Suara & Audio',
    voiceType: 'Jenis Suara',
    ttsProvider: 'Penyedia TTS',
    speakingSpeed: 'Kecepatan Bicara',
    voicePitch: 'Nada Suara',
    volume: 'Volume',
    autoStartListening: 'Mulai mendengarkan otomatis setelah AI berbicara',
    general: 'Umum',
    showAnimations: 'Tampilkan Animasi',
    enableNotifications: 'Aktifkan Notifikasi',
    soundEffects: 'Efek Suara',
    
    // Interview Phrases
    hello: 'Halo',
    welcomeToInterview: 'Selamat datang di wawancara Anda',
    tellMeAboutYourself: 'Ceritakan tentang diri Anda dan apa yang membawa Anda ke sini hari ini.',
    whyInterested: 'Mengapa Anda secara khusus tertarik dengan peran ini?',
    greatestStrengths: 'Apa kekuatan terbesar Anda?',
    challengingProject: 'Ceritakan tentang proyek menantang yang pernah Anda kerjakan.',
    difficultTeamMember: 'Jelaskan saat Anda harus bekerja dengan anggota tim yang sulit.',
    learnSomethingNew: 'Berikan contoh ketika Anda harus belajar sesuatu yang baru dengan cepat.',
    stayCurrentTrends: 'Bagaimana Anda mengikuti tren industri?',
    problemSolvingProcess: 'Jelaskan proses pemecahan masalah Anda.',
    whereDoYouSee: 'Di mana Anda melihat diri Anda dalam 5 tahun?',
    questionsForMe: 'Apakah Anda memiliki pertanyaan untuk saya?',
    anythingElse: 'Apakah ada hal lain yang ingin Anda sampaikan?',
    thankYouInterview: 'Terima kasih atas wawancaranya! Anda melakukannya dengan hebat.',
    background: 'Latar Belakang',
    experience: 'Pengalaman',
    technical: 'Teknis/Keterampilan',
    closing: 'Penutup',
    whatMotivated: 'Apa yang memotivasi Anda untuk mengejar karir di bidang ini?',
    
    // Feedback
    excellent: 'Sangat Baik',
    good: 'Baik',
    needsImprovement: 'Perlu Perbaikan',
    strengths: 'Kekuatan',
    areasForImprovement: 'Area untuk Perbaikan',
    nextSteps: 'Langkah Selanjutnya',
    downloadCV: 'Unduh CV yang Ditingkatkan',
    downloadCoverLetter: 'Unduh Surat Lamaran',
    youSaid: 'Anda berkata',
    
    // Common Actions
    continue: 'Lanjutkan',
    back: 'Kembali',
    next: 'Selanjutnya',
    save: 'Simpan',
    cancel: 'Batal',
    apply: 'Terapkan',
    done: 'Selesai',
    startInterview: 'Mulai Wawancara',
    
    // Time & Progress
    duration: 'Durasi',
    questions: 'Pertanyaan',
    phase: 'Fase',
    progress: 'Kemajuan',
    
    // Voice Status
    aiReady: 'AI Siap',
    listeningForResponse: 'Mendengarkan respons Anda',
    readyForConversation: 'Siap untuk percakapan',
    testVoice: 'Tes Suara',
    voiceEnabled: 'Suara diaktifkan',
    voiceDisabled: 'Suara dinonaktifkan',
    stopListening: 'Berhenti mendengarkan',
    startListening: 'Mulai mendengarkan',
  },
};

// Hook to use translations with reactive language switching
export const useTranslation = () => {
  // Get current language from global app settings
  const getCurrentLanguage = (): string => {
    try {
      const saved = localStorage.getItem('learnpilot_app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.language || 'en-US';
      }
    } catch (error) {
      console.error('Error loading language setting:', error);
    }
    return 'en-US';
  };

  const currentLanguage = getCurrentLanguage();
  
  const t = (key: keyof Translation): string => {
    const translation = translations[currentLanguage];
    if (translation && translation[key]) {
      return translation[key];
    }
    
    // Fallback to English if translation not found
    const fallback = translations['en-US'];
    return fallback[key] || key;
  };

  return { t, currentLanguage };
};

// RTL languages
export const RTL_LANGUAGES = ['ar-SA'];

export const isRTL = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language);
};