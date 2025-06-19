import { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Settings, Play, Pause, RotateCcw, Clock, User, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InterviewAI, InterviewContext } from '../../services/openai';
import { speechService, speechRecognition, TTSOptions } from '../../services/speechService';
import { useProgressTracking } from '../../hooks/useProgressTracking';
import { useTranslation, isRTL } from '../../utils/translations';
import GeodeticSphere from '../GeodeticSphere';
import SoundWaveVisualizer from './SoundWaveVisualizer';

interface EnhancedVoiceInterviewProps {
  jobData: {
    title: string;
    company: string;
    description: string;
  };
  cvContent: string;
  interviewer: 'friendly' | 'professional' | 'expert';
  userName: string;
  onComplete: (score: number) => void;
}

interface VoiceSettings {
  provider: string;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
}

interface ConversationEntry {
  speaker: 'AI' | 'User';
  text: string;
  timestamp: Date;
  duration?: number;
  quality?: 'excellent' | 'good' | 'needs-improvement';
}

export default function EnhancedVoiceInterview({ 
  jobData, 
  cvContent,
  interviewer, 
  userName, 
  onComplete 
}: EnhancedVoiceInterviewProps) {
  const { t, currentLanguage } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationLog, setConversationLog] = useState<ConversationEntry[]>([]);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [interviewStartTime] = useState(Date.now());
  const [currentPhase, setCurrentPhase] = useState<'greeting' | 'background' | 'experience' | 'technical' | 'closing'>('greeting');
  const [questionCount, setQuestionCount] = useState(0);
  const [interviewDuration, setInterviewDuration] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [lastUserResponse, setLastUserResponse] = useState('');
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  
  const interviewAIRef = useRef<InterviewAI | null>(null);
  const { logActivity } = useProgressTracking(userName);
  const durationTimerRef = useRef<NodeJS.Timeout>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Load voice settings from global app settings with current language
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('learnpilot_app_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        provider: parsed.voiceSettings?.provider || 'ElevenLabs',
        voice: parsed.voiceSettings?.voice || 'female1',
        rate: parsed.voiceSettings?.rate || 0.9,
        pitch: parsed.voiceSettings?.pitch || 1.0,
        volume: parsed.voiceSettings?.volume || 0.8,
        language: parsed.voiceSettings?.language || parsed.language || currentLanguage
      };
    }
    return {
      provider: 'ElevenLabs',
      voice: 'female1',
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      language: currentLanguage
    };
  });

  // Update voice settings when global language changes
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      if (event.detail) {
        console.log('🔄 Interview received global settings update:', event.detail);
        
        const newVoiceSettings = {
          provider: event.detail.voiceSettings?.provider || voiceSettings.provider,
          voice: event.detail.voiceSettings?.voice || voiceSettings.voice,
          rate: event.detail.voiceSettings?.rate || voiceSettings.rate,
          pitch: event.detail.voiceSettings?.pitch || voiceSettings.pitch,
          volume: event.detail.voiceSettings?.volume || voiceSettings.volume,
          language: event.detail.voiceSettings?.language || event.detail.language || voiceSettings.language
        };
        
        setVoiceSettings(newVoiceSettings);
        
        // Update speech service provider
        if (newVoiceSettings.provider) {
          speechService.setProvider(newVoiceSettings.provider);
        }
      }
    };

    window.addEventListener('settings-saved', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('settings-saved', handleSettingsChange as EventListener);
    };
  }, [voiceSettings]);

  // Setup audio visualization
  useEffect(() => {
    const setupAudioVisualization = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
        
        microphoneRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        
        const updateAudioLevel = () => {
          if (analyserRef.current && isListening) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            setAudioLevel(average / 255);
          }
          requestAnimationFrame(updateAudioLevel);
        };
        
        updateAudioLevel();
      } catch (error) {
        console.error('Error setting up audio visualization:', error);
      }
    };

    setupAudioVisualization();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isListening]);

  // Start duration timer
  useEffect(() => {
    durationTimerRef.current = setInterval(() => {
      setInterviewDuration(Math.floor((Date.now() - interviewStartTime) / 1000));
    }, 1000);

    return () => {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, [interviewStartTime]);

  // Initialize Interview AI with current language
  useEffect(() => {
    if (isInitialized) return;
    
    const context: InterviewContext = {
      jobTitle: jobData.title,
      company: jobData.company,
      jobDescription: jobData.description,
      cvContent,
      interviewerType: interviewer,
      userName,
      language: voiceSettings.language // Use voice settings language
    };

    interviewAIRef.current = new InterviewAI(context);
    setIsInitialized(true);

    // Set speech service provider
    speechService.setProvider(voiceSettings.provider);

    // Start interview with greeting after a brief delay
    setTimeout(() => {
      startInterview();
    }, 2000);
  }, [jobData, cvContent, interviewer, userName, voiceSettings.language, isInitialized]);

  const addToConversationLog = (speaker: 'AI' | 'User', text: string, duration?: number, quality?: 'excellent' | 'good' | 'needs-improvement') => {
    const entry: ConversationEntry = {
      speaker,
      text,
      timestamp: new Date(),
      duration,
      quality
    };
    
    setConversationLog(prev => [...prev, entry]);
  };

  const startInterview = async () => {
    const displayName = localStorage.getItem(`learnpilot_display_name_${userName}`) || userName;
    
    // Generate greeting in the selected language
    const langCode = voiceSettings.language.split('-')[0];
    let greeting = '';
    
    switch (langCode) {
      case 'ar':
        greeting = `مرحباً ${displayName}! أهلاً وسهلاً بك في مقابلة ${jobData.title} في ${jobData.company}. أنا ${interviewer === 'friendly' ? 'مسؤول موارد بشرية ودود' : interviewer === 'professional' ? 'مجند محترف' : 'خبير في المجال'}. أخبرني عن نفسك وما الذي جعلك تأتي إلى هنا اليوم.`;
        break;
      case 'es':
        greeting = `¡Hola ${displayName}! Bienvenido a tu entrevista para ${jobData.title} en ${jobData.company}. Soy un ${interviewer === 'friendly' ? 'representante de RRHH amigable' : interviewer === 'professional' ? 'reclutador profesional' : 'experto de la industria'}. Cuéntame sobre ti y qué te trae aquí hoy.`;
        break;
      case 'fr':
        greeting = `Bonjour ${displayName}! Bienvenue à votre entretien pour ${jobData.title} chez ${jobData.company}. Je suis un ${interviewer === 'friendly' ? 'représentant RH amical' : interviewer === 'professional' ? 'recruteur professionnel' : 'expert de l\'industrie'}. Parlez-moi de vous et de ce qui vous amène ici aujourd'hui.`;
        break;
      case 'de':
        greeting = `Hallo ${displayName}! Willkommen zu Ihrem Interview für ${jobData.title} bei ${jobData.company}. Ich bin ein ${interviewer === 'friendly' ? 'freundlicher HR-Vertreter' : interviewer === 'professional' ? 'professioneller Recruiter' : 'Branchenexperte'}. Erzählen Sie mir von sich und was Sie heute hierher bringt.`;
        break;
      case 'id':
        greeting = `Halo ${displayName}! Selamat datang di wawancara untuk ${jobData.title} di ${jobData.company}. Saya adalah ${interviewer === 'friendly' ? 'perwakilan HR yang ramah' : interviewer === 'professional' ? 'perekrut profesional' : 'ahli industri'}. Ceritakan tentang diri Anda dan apa yang membawa Anda ke sini hari ini.`;
        break;
      case 'zh':
        greeting = `你好 ${displayName}！欢迎参加${jobData.company}的${jobData.title}职位面试。我是一位${interviewer === 'friendly' ? '友好的人力资源代表' : interviewer === 'professional' ? '专业招聘人员' : '行业专家'}。请告诉我关于您自己以及今天是什么带您来到这里的。`;
        break;
      case 'ja':
        greeting = `こんにちは ${displayName}さん！${jobData.company}の${jobData.title}のポジションの面接へようこそ。私は${interviewer === 'friendly' ? 'フレンドリーなHR担当者' : interviewer === 'professional' ? 'プロフェッショナルなリクルーター' : '業界エキスパート'}です。ご自身について、そして今日ここに来られた理由を教えてください。`;
        break;
      default:
        greeting = `Hello ${displayName}! Welcome to your interview for ${jobData.title} at ${jobData.company}. I'm a ${interviewer === 'friendly' ? 'friendly HR representative' : interviewer === 'professional' ? 'professional recruiter' : 'industry expert'}. Tell me about yourself and what brings you here today.`;
    }
    
    addToConversationLog('AI', greeting);
    
    try {
      await speakText(greeting);
      setCurrentPhase('background');
      setWaitingForResponse(true);
    } catch (error) {
      console.error('Error starting interview:', error);
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  };

  const speakText = async (text: string) => {
    try {
      // Stop any ongoing speech before starting new speech
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        // Small delay to allow cancellation to propagate
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setIsSpeaking(true);
      setWaitingForResponse(false);
      
      const options: TTSOptions = {
        voice: voiceSettings.voice,
        rate: voiceSettings.rate,
        pitch: voiceSettings.pitch,
        volume: voiceSettings.volume,
        language: voiceSettings.language,
        onStart: () => {
          console.log('🔊 AI started speaking in', voiceSettings.language);
        },
        onEnd: () => {
          console.log('🔊 AI finished speaking');
          setIsSpeaking(false);
          
          // Auto-start listening after AI speaks
          setTimeout(() => {
            if (!isInterviewEnded) {
              startListening();
            }
          }, 1000);
        },
        onError: (error) => {
          console.warn('🔊 Speech error (continuing):', error);
          setIsSpeaking(false);
          
          // Only start listening if the error is not 'interrupted'
          if (error.error !== 'interrupted') {
            setTimeout(() => {
              if (!isInterviewEnded) {
                startListening();
              }
            }, 1000);
          }
        }
      };

      await speechService.speak(text, options);
    } catch (error) {
      // Only log non-interrupted errors to avoid console clutter
      if (error.error !== 'interrupted') {
        console.error('Speech error:', error);
      }
      setIsSpeaking(false);
      
      // Only start listening if the error is not 'interrupted'
      if (error.error !== 'interrupted') {
        setTimeout(() => {
          if (!isInterviewEnded) {
            startListening();
          }
        }, 1000);
      }
    }
  };

  const startListening = async () => {
    if (!speechRecognition.isAvailable() || isListening || isSpeaking || isInterviewEnded) {
      return;
    }

    try {
      setWaitingForResponse(true);
      
      await speechRecognition.startListening({
        language: voiceSettings.language,
        onStart: () => {
          setIsListening(true);
          console.log('🎤 Started listening in', voiceSettings.language);
        },
        onResult: (transcript) => {
          console.log('🎤 User said:', transcript);
          setLastUserResponse(transcript);
          handleUserResponse(transcript);
        },
        onEnd: () => {
          setIsListening(false);
          console.log('🎤 Stopped listening');
        },
        onError: (error) => {
          console.error('🎤 Recognition error:', error);
          setIsListening(false);
          
          if (error.error === 'no-speech' || error.error === 'network') {
            setTimeout(() => {
              if (!isInterviewEnded && !isSpeaking) {
                startListening();
              }
            }, 2000);
          }
        }
      });
    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
    }
  };

  const evaluateResponseQuality = (userInput: string): 'excellent' | 'good' | 'needs-improvement' => {
    const wordCount = userInput.trim().split(/\s+/).length;
    const hasSpecificExamples = /\b(example|instance|specifically|particular|when|during|project|experience|result|achieved|improved|increased|decreased|managed|led|developed|created|implemented)\b/i.test(userInput);
    const hasQuantifiableResults = /\b(\d+%|\d+\s*(percent|million|thousand|years?|months?|weeks?|days?|hours?|people|team|members|customers|clients|users|projects?))\b/i.test(userInput);
    
    if (wordCount >= 50 && hasSpecificExamples && hasQuantifiableResults) {
      return 'excellent';
    } else if (wordCount >= 30 && (hasSpecificExamples || hasQuantifiableResults)) {
      return 'good';
    } else {
      return 'needs-improvement';
    }
  };

  const handleUserResponse = async (userInput: string) => {
    if (!interviewAIRef.current || isInterviewEnded) return;

    setWaitingForResponse(false);

    // Evaluate response quality
    const quality = evaluateResponseQuality(userInput);
    
    // Add user response to log with quality assessment
    addToConversationLog('User', userInput, undefined, quality);
    setQuestionCount(prev => prev + 1);

    try {
      // Generate AI response
      const aiResponse = await interviewAIRef.current.generateResponse(userInput);
      
      // Add AI response to log
      addToConversationLog('AI', aiResponse);
      
      // Progress through interview phases
      progressInterview();
      
      // Speak AI response
      await speakText(aiResponse);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Use contextual fallback response in current language
      const fallbackResponse = generateFallbackResponse(userInput);
      addToConversationLog('AI', fallbackResponse);
      await speakText(fallbackResponse);
    }
  };

  const generateFallbackResponse = (userInput: string): string => {
    const displayName = localStorage.getItem(`learnpilot_display_name_${userName}`) || userName;
    
    // Generate responses based on current language
    const langCode = voiceSettings.language.split('-')[0];
    
    const responses = {
      'en': [
        `That's wonderful, ${displayName}! I can see you have great experience. Could you tell me more about your leadership style?`,
        `Excellent point, ${displayName}! That shows real initiative. How do you handle challenging situations?`,
        `I appreciate your honesty, ${displayName}. That kind of self-awareness is valuable. What motivates you most?`,
      ],
      'ar': [
        `هذا رائع، ${displayName}! أستطيع أن أرى أن لديك خبرة عظيمة. هل يمكنك أن تخبرني المزيد عن أسلوب قيادتك؟`,
        `نقطة ممتازة، ${displayName}! هذا يظهر مبادرة حقيقية. كيف تتعامل مع المواقف الصعبة؟`,
        `أقدر صدقك، ${displayName}. هذا النوع من الوعي الذاتي قيم. ما الذي يحفزك أكثر؟`,
      ],
      'es': [
        `¡Eso es maravilloso, ${displayName}! Puedo ver que tienes gran experiencia. ¿Podrías contarme más sobre tu estilo de liderazgo?`,
        `¡Excelente punto, ${displayName}! Eso muestra verdadera iniciativa. ¿Cómo manejas las situaciones desafiantes?`,
        `Aprecio tu honestidad, ${displayName}. Ese tipo de autoconciencia es valiosa. ¿Qué te motiva más?`,
      ],
      'fr': [
        `C'est merveilleux, ${displayName}! Je peux voir que vous avez une grande expérience. Pourriez-vous me parler davantage de votre style de leadership?`,
        `Excellent point, ${displayName}! Cela montre une vraie initiative. Comment gérez-vous les situations difficiles?`,
        `J'apprécie votre honnêteté, ${displayName}. Ce type de conscience de soi est précieux. Qu'est-ce qui vous motive le plus?`,
      ],
      'de': [
        `Das ist wunderbar, ${displayName}! Ich kann sehen, dass Sie große Erfahrung haben. Könnten Sie mir mehr über Ihren Führungsstil erzählen?`,
        `Ausgezeichneter Punkt, ${displayName}! Das zeigt echte Initiative. Wie gehen Sie mit herausfordernden Situationen um?`,
        `Ich schätze Ihre Ehrlichkeit, ${displayName}. Diese Art von Selbstbewusstsein ist wertvoll. Was motiviert Sie am meisten?`,
      ],
      'id': [
        `Itu luar biasa, ${displayName}! Saya bisa melihat Anda memiliki pengalaman yang hebat. Bisakah Anda menceritakan lebih banyak tentang gaya kepemimpinan Anda?`,
        `Poin yang sangat baik, ${displayName}! Itu menunjukkan inisiatif yang nyata. Bagaimana Anda menangani situasi yang menantang?`,
        `Saya menghargai kejujuran Anda, ${displayName}. Jenis kesadaran diri seperti itu sangat berharga. Apa yang paling memotivasi Anda?`,
      ]
    };

    const roleResponses = responses[langCode as keyof typeof responses] || responses['en'];
    return roleResponses[Math.floor(Math.random() * roleResponses.length)];
  };

  const progressInterview = () => {
    if (questionCount >= 8 && currentPhase !== 'closing') {
      setCurrentPhase('closing');
    } else if (questionCount >= 6 && currentPhase !== 'technical') {
      setCurrentPhase('technical');
    } else if (questionCount >= 4 && currentPhase !== 'experience') {
      setCurrentPhase('experience');
    } else if (questionCount >= 2 && currentPhase !== 'background') {
      setCurrentPhase('background');
    }
  };

  const finishInterview = async () => {
    if (isInterviewEnded) return;
    setIsInterviewEnded(true);

    speechRecognition.stopListening();
    setIsListening(false);
    setIsSpeaking(false);

    const duration = Math.round((Date.now() - interviewStartTime) / 1000 / 60);

    try {
      let score = 70;
      
      // Calculate score based on response quality
      const excellentResponses = conversationLog.filter(entry => entry.quality === 'excellent').length;
      const goodResponses = conversationLog.filter(entry => entry.quality === 'good').length;
      
      score += excellentResponses * 8;
      score += goodResponses * 4;
      score += Math.min(20, questionCount * 2);
      
      if (duration >= 10 && duration <= 30) {
        score += 10;
      }
      
      score = Math.max(60, Math.min(100, score));

      // Analyze interview performance if AI is available
      let analysis = null;
      try {
        analysis = await interviewAIRef.current?.analyzeInterview();
        if (analysis?.overallScore) {
          score = analysis.overallScore;
        }
      } catch (error) {
        console.log('Using fallback scoring');
      }

      // Log activity
      logActivity('interview', score, duration, {
        jobTitle: jobData.title,
        company: jobData.company,
        interviewer,
        questionsAnswered: questionCount,
        phase: currentPhase,
        conversationLog: conversationLog.slice(-10),
        analysis,
        language: voiceSettings.language
      });

      // Final message in current language
      const langCode = voiceSettings.language.split('-')[0];
      let finalMessage = '';
      
      switch (langCode) {
        case 'ar':
          finalMessage = 'شكراً لك على المقابلة! لقد أديت بشكل رائع.';
          break;
        case 'es':
          finalMessage = '¡Gracias por la entrevista! Lo hiciste genial.';
          break;
        case 'fr':
          finalMessage = 'Merci pour l\'entretien! Vous avez très bien fait.';
          break;
        case 'de':
          finalMessage = 'Vielen Dank für das Interview! Sie haben das großartig gemacht.';
          break;
        case 'id':
          finalMessage = 'Terima kasih atas wawancaranya! Anda melakukannya dengan hebat.';
          break;
        default:
          finalMessage = 'Thank you for the interview! You did great.';
      }
      
      await speakText(finalMessage);

      setTimeout(() => {
        onComplete(score);
      }, 3000);

    } catch (error) {
      console.error('Error analyzing interview:', error);
      
      const fallbackScore = Math.max(70, 70 + questionCount * 2);
      logActivity('interview', fallbackScore, duration, {
        jobTitle: jobData.title,
        company: jobData.company,
        interviewer,
        questionsAnswered: questionCount,
        phase: currentPhase,
        conversationLog: conversationLog.slice(-10),
        language: voiceSettings.language
      });

      onComplete(fallbackScore);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      speechRecognition.stopListening();
    } else {
      startListening();
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseProgress = () => {
    const phases = ['greeting', 'background', 'experience', 'technical', 'closing'];
    const currentIndex = phases.indexOf(currentPhase);
    return ((currentIndex + 1) / phases.length) * 100;
  };

  const getPhaseNames = () => {
    return {
      greeting: t('welcomeToInterview'),
      background: t('background'),
      experience: t('experience'),
      technical: t('technical'),
      closing: t('closing')
    };
  };

  const phases = getPhaseNames();

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-6xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">{jobData.title}</h2>
                <p className="text-gray-400 text-sm">{jobData.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
              <User className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">{userName}</span>
            </div>
            <div className="px-3 py-1 bg-purple-800 rounded-full text-xs">
              <span className="text-purple-400 text-sm">🌍 {voiceSettings.language}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatDuration(interviewDuration)}</span>
            </div>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={finishInterview}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Interview Progress */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{t('progress')}</span>
            <span className="text-sm text-gray-400">{questionCount} {t('questions').toLowerCase()}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getPhaseProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {Object.entries(phases).map(([phase, name]) => (
              <span
                key={phase}
                className={currentPhase === phase ? 'text-blue-400 font-medium' : ''}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-800 border-b border-gray-700 p-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">{t('ttsProvider')}</label>
                  <select
                    value={voiceSettings.provider}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, provider: e.target.value }))}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                  >
                    <option value="ElevenLabs">ElevenLabs (Premium)</option>
                    <option value="Web Speech API">Web Speech API</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">{t('voiceType')}</label>
                  <select
                    value={voiceSettings.voice}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, voice: e.target.value }))}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                  >
                    <option value="male1">🎭 Male Voice 1</option>
                    <option value="male2">🎭 Male Voice 2</option>
                    <option value="female1">🎭 Female Voice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">{t('speakingSpeed')}: {voiceSettings.rate.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.1"
                    value={voiceSettings.rate}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">{t('volume')}: {Math.round(voiceSettings.volume * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.volume}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSpeaking ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-700 text-gray-300'
            }`}>
              {isSpeaking ? `🎤 ${t('aiSpeaking')}` : t('aiReady')}
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isListening ? 'bg-green-600 text-white animate-pulse' : 'bg-gray-700 text-gray-300'
            }`}>
              {isListening ? `👂 ${t('listening')}` : 'Standby'}
            </div>

            <div className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs">
              {phases[currentPhase]}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleListening}
              disabled={isSpeaking}
              className={`p-3 rounded-lg transition-colors ${
                isListening
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => window.location.reload()}
              className="p-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              title="Restart Interview"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Interview Area */}
        <div className="flex flex-col lg:flex-row">
          {/* AI Visualization */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
              <GeodeticSphere
                isActive={true}
                isSpeaking={isSpeaking}
                isListening={isListening}
                className="w-64 h-64 lg:w-80 lg:h-80"
              />
            </div>

            {/* Sound Wave Visualizer */}
            {isListening && (
              <SoundWaveVisualizer
                isActive={isListening}
                audioLevel={audioLevel}
                language={voiceSettings.language}
              />
            )}

            {/* Status Indicators - NO TEXT DISPLAY */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <motion.div 
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <span>🌍 {voiceSettings.language} Voice Interview Active</span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                {isSpeaking && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full">
                    <Volume2 className="w-4 h-4" />
                    <span>{t('aiSpeaking')}</span>
                  </div>
                )}
                
                {isListening && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-full">
                    <Mic className="w-4 h-4" />
                    <span>{t('listening')}</span>
                  </div>
                )}
                
                {waitingForResponse && !isSpeaking && !isListening && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded-full">
                    <Clock className="w-4 h-4" />
                    <span>Waiting for your response...</span>
                  </div>
                )}
                
                {!isSpeaking && !isListening && !waitingForResponse && (
                  <div className="text-gray-400">
                    {t('readyForConversation')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conversation Log */}
          <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-medium">Conversation Log</h3>
              <p className="text-gray-400 text-sm">{conversationLog.length} exchanges</p>
            </div>
            <div className="h-96 lg:h-[500px] overflow-y-auto p-4 space-y-3">
              {conversationLog.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: entry.speaker === 'AI' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg ${
                    entry.speaker === 'AI' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{entry.speaker}</span>
                    <div className="flex items-center gap-2">
                      {entry.quality && (
                        <span className="text-xs">
                          {entry.quality === 'excellent' ? '⭐' : entry.quality === 'good' ? '👍' : '💡'}
                        </span>
                      )}
                      <span className="text-xs opacity-70">
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{entry.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-6 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{t('duration')}: {formatDuration(interviewDuration)}</span>
              <span>•</span>
              <span>{t('questions')}: {questionCount}</span>
              <span>•</span>
              <span>{t('phase')}: {phases[currentPhase]}</span>
              <span>•</span>
              <span>🌍 {voiceSettings.language}</span>
            </div>
            
            <button
              onClick={finishInterview}
              disabled={isInterviewEnded}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInterviewEnded ? 'Ending Interview...' : t('finishInterview')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}