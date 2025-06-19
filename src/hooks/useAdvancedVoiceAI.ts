import { useState, useEffect, useCallback, useRef } from 'react';
import { speechService, speechRecognition, TTSOptions } from '../services/speechService';

interface VoiceSettings {
  enabled: boolean;
  voice: 'male1' | 'male2' | 'female1';
  rate: number;
  pitch: number;
  volume: number;
  noiseReduction: boolean;
  autoGainControl: boolean;
  language: string;
  provider: string;
}

interface UseAdvancedVoiceAIProps {
  userName?: string;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onListeningStart?: () => void;
  onListeningEnd?: () => void;
  onUserSpeech?: (text: string) => void;
}

export const useAdvancedVoiceAI = ({ 
  userName = 'there', 
  onSpeechStart,
  onSpeechEnd,
  onListeningStart,
  onListeningEnd,
  onUserSpeech
}: UseAdvancedVoiceAIProps = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const conversationContextRef = useRef<string[]>([]);
  const lastUserInputRef = useRef<string>('');
  const initializationRef = useRef(false);

  // Get the actual display name from dashboard
  const getDisplayName = useCallback(() => {
    const savedDisplayName = localStorage.getItem(`learnpilot_display_name_${userName}`);
    return savedDisplayName || userName;
  }, [userName]);

  // Load settings from global app settings
  const loadSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem('learnpilot_app_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.voiceSettings) {
          console.log('✅ Loaded voice settings from global app settings:', parsed.voiceSettings);
          return {
            enabled: true,
            voice: parsed.voiceSettings.voice || 'female1',
            rate: parsed.voiceSettings.rate || 1.0,
            pitch: parsed.voiceSettings.pitch || 1.0,
            volume: parsed.voiceSettings.volume || 1.0,
            noiseReduction: true,
            autoGainControl: true,
            language: parsed.voiceSettings.language || parsed.language || 'en-US',
            provider: 'ElevenLabs' // Default to ElevenLabs
          };
        }
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
    
    const defaultSettings = {
      enabled: true,
      voice: 'female1',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      noiseReduction: true,
      autoGainControl: true,
      language: 'en-US',
      provider: 'ElevenLabs'
    };
    
    console.log('🔧 Using default voice settings:', defaultSettings);
    return defaultSettings;
  }, []);

  const [settings, setSettings] = useState<VoiceSettings>(loadSettings);

  // Enhanced language configurations - limited to 7 languages
  const languageConfig = {
    'en-US': { name: 'English (US)', greeting: 'Hello', code: 'en-US' },
    'ar-SA': { name: 'العربية', greeting: 'مرحبا', code: 'ar-SA' },
    'tl-PH': { name: 'Tagalog', greeting: 'Kumusta', code: 'tl-PH' },
    'my-MM': { name: 'မြန်မာ', greeting: 'မင်္ဂလာပါ', code: 'my-MM' },
    'sw-KE': { name: 'Kiswahili', greeting: 'Hujambo', code: 'sw-KE' },
    'id-ID': { name: 'Bahasa Indonesia', greeting: 'Halo', code: 'id-ID' }
  };

  // Listen for global settings changes
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      if (event.detail) {
        console.log('🔄 Voice AI received global settings update:', event.detail);
        
        // Update voice settings from global settings
        const newVoiceSettings = {
          enabled: settings.enabled,
          voice: event.detail.voiceSettings?.voice || settings.voice,
          rate: event.detail.voiceSettings?.rate || settings.rate,
          pitch: event.detail.voiceSettings?.pitch || settings.pitch,
          volume: event.detail.voiceSettings?.volume || settings.volume,
          noiseReduction: settings.noiseReduction,
          autoGainControl: settings.autoGainControl,
          language: event.detail.voiceSettings?.language || event.detail.language || settings.language,
          provider: event.detail.voiceSettings?.provider || settings.provider
        };
        
        setSettings(newVoiceSettings);
        
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
  }, [settings]);

  // Initialize voice system
  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    console.log('🔊 Initializing advanced voice system with ElevenLabs...');
    
    // Check if speech services are available
    const availableProviders = speechService.getAvailableProviders();
    if (availableProviders.length > 0) {
      setIsSupported(true);
      console.log('✅ Speech synthesis supported with providers:', availableProviders.map(p => p.name));
      
      // Set preferred provider
      if (settings.provider && speechService.setProvider(settings.provider)) {
        console.log('✅ Set provider to:', settings.provider);
      }
    } else {
      console.error('❌ No speech synthesis providers available');
    }
  }, [settings.provider]);

  // Process user input and generate AI response
  const processUserInput = useCallback((userInput: string) => {
    console.log('🧠 Processing user input:', userInput);
    
    // Store user input
    lastUserInputRef.current = userInput;
    conversationContextRef.current.push(`User: ${userInput}`);
    
    // Call the callback
    onUserSpeech?.(userInput);
    
    // Generate contextual AI response
    generateAIResponse(userInput);
  }, [onUserSpeech]);

  // Enhanced AI response generation with proper name usage and language support
  const generateAIResponse = useCallback((userInput: string) => {
    const input = userInput.toLowerCase();
    const currentLang = settings.language;
    
    let response = '';
    
    console.log('🧠 Generating response in language:', currentLang, 'for input:', input);
    
    // Get the actual display name from dashboard
    const displayName = getDisplayName();
    console.log('👤 Using display name:', displayName);
    
    // Generate responses based on selected language
    const langCode = currentLang.split('-')[0];
    
    if (langCode === 'id') {
      if (input.includes('halo') || input.includes('hai') || input.includes('selamat')) {
        response = `Halo ${displayName}! Senang bertemu dengan Anda. Bagaimana saya bisa membantu Anda hari ini?`;
      } else if (input.includes('apa kabar') || input.includes('bagaimana kabar')) {
        response = `Saya baik-baik saja, terima kasih ${displayName}! Bagaimana dengan Anda? Ceritakan tentang diri Anda.`;
      } else {
        const responseOptions = [
          `Itu sangat menarik, ${displayName}. Bisakah Anda menceritakan lebih detail tentang pengalaman tersebut?`,
          `Perspektif yang bagus, ${displayName}. Bagaimana menurut Anda hal itu akan membantu dalam peran ini?`,
          `Saya dapat melihat Anda telah memikirkan hal ini dengan baik, ${displayName}. Apa tantangan terbesar yang Anda hadapi?`
        ];
        response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      }
    } else if (langCode === 'ar') {
      if (input.includes('مرحبا') || input.includes('أهلا') || input.includes('السلام')) {
        response = `مرحباً ${displayName}! أهلاً وسهلاً بك. كيف يمكنني مساعدتك اليوم؟`;
      } else if (input.includes('كيف حالك') || input.includes('كيف الأحوال')) {
        response = `أنا بخير، شكراً لك ${displayName}! كيف حالك؟ أخبرني عن نفسك.`;
      } else {
        const responseOptions = [
          `هذا رائع ${displayName}. هل يمكنك أن تخبرني المزيد عن هذه التجربة؟`,
          `وجهة نظر ممتازة ${displayName}. كيف تعتقد أن هذا سيفيد فريقنا؟`,
          `أستطيع أن أرى أنك فكرت في هذا جيداً ${displayName}. ما هو أكبر تحدٍ واجهته؟`
        ];
        response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      }
    } else if (langCode === 'tl') {
      if (input.includes('kumusta') || input.includes('hello') || input.includes('hi')) {
        response = `Kumusta ${displayName}! Masaya akong makilala ka. Paano kita matutulungan ngayon?`;
      } else if (input.includes('kamusta ka') || input.includes('kumusta ka')) {
        response = `Mabuti naman ako, salamat ${displayName}! Kumusta ka? Ikwento mo sa akin ang tungkol sa iyong sarili.`;
      } else {
        const responseOptions = [
          `Napaka-interesting niyan, ${displayName}. Pwede mo bang ikwento pa ng mas detalyado ang tungkol sa experience na iyon?`,
          `Magandang perspective, ${displayName}. Paano sa tingin mo makakatulong ito sa role na ito?`,
          `Nakikita ko na pinag-isipan mo ito nang mabuti, ${displayName}. Ano ang pinakamahirap na challenge na naranasan mo?`
        ];
        response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      }
    } else if (langCode === 'my') {
      if (input.includes('မင်္ဂလာပါ') || input.includes('ဟယ်လို')) {
        response = `မင်္ဂလာပါ ${displayName}! သင့်ကို တွေ့ရတာ ဝမ်းသာပါတယ်။ ယနေ့ သင့်ကို ဘယ်လို ကူညီပေးရမလဲ?`;
      } else if (input.includes('ဘယ်လိုနေလဲ') || input.includes('နေကောင်းလား')) {
        response = `ကျွန်တော်/မ နေကောင်းပါတယ်၊ ကျေးဇူးတင်ပါတယ် ${displayName}! သင်ရောလဲ? သင့်အကြောင်း ပြောပြပါ။`;
      } else {
        const responseOptions = [
          `အဲဒါ အရမ်းစိတ်ဝင်စားစရာပါပဲ၊ ${displayName}။ အဲဒီအတွေ့အကြုံအကြောင်း ပိုပြီး အသေးစိတ် ပြောပြနိုင်မလား?`,
          `ကောင်းတဲ့ အမြင်ပါ၊ ${displayName}။ ဒီအရာက ဒီရာထူးမှာ ဘယ်လိုအကူအညီဖြစ်မယ်လို့ ထင်ပါသလဲ?`,
          `သင် ဒီအကြောင်းကို သေချာစဉ်းစားထားတာ မြင်ရပါတယ်၊ ${displayName}။ သင် ရင်ဆိုင်ခဲ့ရတဲ့ အကြီးမားဆုံး စိန်ခေါ်မှုက ဘာလဲ?`
        ];
        response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      }
    } else if (langCode === 'sw') {
      if (input.includes('hujambo') || input.includes('habari') || input.includes('jambo')) {
        response = `Hujambo ${displayName}! Ninafurahi kukutana nawe. Nawezaje kukusaidia leo?`;
      } else if (input.includes('habari yako') || input.includes('hali gani')) {
        response = `Niko salama, asante ${displayName}! Je, wewe hujambo? Nieleze kuhusu wewe mwenyewe.`;
      } else {
        const responseOptions = [
          `Hiyo ni ya kuvutia sana, ${displayName}. Unaweza kunieleza zaidi kuhusu uzoefu huo?`,
          `Mtazamo mzuri, ${displayName}. Unafikiri hii itasaidia vipi katika jukumu hili?`,
          `Naona umefikiria hili vizuri, ${displayName}. Ni changamoto gani kubwa uliyokumbana nayo?`
        ];
        response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      }
    } else {
      // English responses (default)
      if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        response = `Hello ${displayName}! It's wonderful to meet you. I'm excited to learn more about your background. How are you feeling today?`;
      } else if (input.includes('how are you')) {
        response = `I'm doing excellent, thank you for asking ${displayName}! I'm here and ready to have a great conversation with you. Tell me about yourself.`;
      } else {
        const responseOptions = [
          `That's a thoughtful response, ${displayName}. Could you tell me more about how that experience has prepared you for this role?`,
          `Interesting perspective, ${displayName}. How do you think that approach would benefit our team?`,
          `I can see you've given this consideration, ${displayName}. What's the most important lesson you learned from that?`
        ];
        response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      }
    }
    
    // Add response to context
    conversationContextRef.current.push(`AI: ${response}`);
    
    // Keep context manageable
    if (conversationContextRef.current.length > 20) {
      conversationContextRef.current = conversationContextRef.current.slice(-20);
    }
    
    console.log('🧠 Generated response:', response);
    
    // Speak the response immediately with ElevenLabs
    setTimeout(() => {
      speak(response, { priority: true });
    }, 800);
    
  }, [settings.language, getDisplayName]);

  const speak = useCallback((text: string, options?: { interrupt?: boolean; priority?: boolean }) => {
    if (!isSupported || !settings.enabled) {
      console.log('🔊 ❌ Speech not supported or disabled');
      return;
    }

    console.log('🔊 Speak called with ElevenLabs:', text.substring(0, 50) + '...', options);

    // Use the actual display name from dashboard
    const displayName = getDisplayName();
    const personalizedText = text.replace(/\b(there|user)\b/gi, displayName);

    console.log('🔊 Speaking with ElevenLabs (using name:', displayName + '):', personalizedText.substring(0, 50) + '...');

    const ttsOptions: TTSOptions = {
      voice: settings.voice,
      rate: settings.rate,
      pitch: settings.pitch,
      volume: settings.volume,
      language: settings.language,
      onStart: () => {
        console.log('🔊 ElevenLabs started speaking');
        setIsSpeaking(true);
        onSpeechStart?.();
      },
      onEnd: () => {
        console.log('🔊 ElevenLabs finished speaking');
        setIsSpeaking(false);
        onSpeechEnd?.();
        
        // Auto-start listening after AI speaks
        if (settings.enabled && !isListening) {
          console.log('🎤 Auto-starting listening...');
          setTimeout(() => {
            startListening();
          }, 1000);
        }
      },
      onError: (error) => {
        console.warn('🔊 ElevenLabs speech error (continuing):', error);
        setIsSpeaking(false);
        
        setTimeout(() => {
          if (!isListening && settings.enabled) {
            startListening();
          }
        }, 1000);
      }
    };

    // Use ElevenLabs for speech synthesis
    speechService.speak(personalizedText, ttsOptions).catch(error => {
      console.error('🔊 Speech synthesis failed:', error);
      setIsSpeaking(false);
    });
  }, [isSupported, settings, getDisplayName, onSpeechStart, onSpeechEnd, isListening]);

  const startListening = useCallback(async () => {
    if (!speechRecognition.isAvailable()) {
      console.log('🎤 ❌ Recognition not available');
      return;
    }

    if (isListening) {
      console.log('🎤 ⚠️ Already listening');
      return;
    }

    if (isSpeaking) {
      console.log('🎤 ⚠️ Cannot listen while speaking');
      return;
    }

    try {
      console.log('🎤 Starting recognition with language:', settings.language);
      
      await speechRecognition.startListening({
        language: settings.language,
        onStart: () => {
          setIsListening(true);
          console.log('🎤 Started listening in', settings.language);
          onListeningStart?.();
        },
        onResult: (transcript) => {
          console.log('🎤 User said:', transcript);
          processUserInput(transcript);
        },
        onEnd: () => {
          setIsListening(false);
          console.log('🎤 Stopped listening');
          onListeningEnd?.();
        },
        onError: (error) => {
          console.error('🎤 Recognition error:', error);
          setIsListening(false);
          onListeningEnd?.();
          
          if (error.error === 'no-speech' || error.error === 'network') {
            setTimeout(() => {
              if (!isSpeaking && settings.enabled) {
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
  }, [isListening, isSpeaking, settings.enabled, settings.language, onListeningStart, onListeningEnd, processUserInput]);

  const stopListening = useCallback(() => {
    if (isListening) {
      console.log('🎤 Stopping recognition...');
      speechRecognition.stopListening();
    }
  }, [isListening]);

  const stop = useCallback(() => {
    console.log('🛑 Stopping all voice activity...');
    
    // Stop speech synthesis
    speechService.speak('', { onEnd: () => setIsSpeaking(false) }).catch(() => {});
    setIsSpeaking(false);
    
    if (isListening) {
      stopListening();
    }
    
    console.log('🛑 All voice activity stopped');
  }, [isListening, stopListening]);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    console.log('⚙️ Updating voice settings:', newSettings);
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Save to global app settings
      try {
        const appSettings = JSON.parse(localStorage.getItem('learnpilot_app_settings') || '{}');
        appSettings.voiceSettings = {
          voice: updated.voice,
          rate: updated.rate,
          pitch: updated.pitch,
          volume: updated.volume,
          language: updated.language,
          provider: updated.provider
        };
        
        // Also update main language if voice language changed
        if (newSettings.language) {
          appSettings.language = newSettings.language;
        }
        
        localStorage.setItem('learnpilot_app_settings', JSON.stringify(appSettings));
        console.log('✅ Voice settings saved to global app settings');
        
        // Trigger global settings update event
        const event = new CustomEvent('settings-saved', { detail: appSettings });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Error saving voice settings:', error);
      }
      
      return updated;
    });
    
    // Update speech service provider
    if (newSettings.provider) {
      speechService.setProvider(newSettings.provider);
    }
  }, []);

  const getAvailableVoices = useCallback(() => {
    return {
      male1: 'ElevenLabs Male Voice 1',
      male2: 'ElevenLabs Male Voice 2',
      female1: 'ElevenLabs Female Voice'
    };
  }, []);

  const getAvailableLanguages = useCallback(() => {
    return languageConfig;
  }, []);

  return {
    isSupported,
    isSpeaking,
    isListening,
    settings,
    speak,
    startListening,
    stopListening,
    stop,
    updateSettings,
    getAvailableVoices,
    getAvailableLanguages
  };
};