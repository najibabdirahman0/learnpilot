import { useState, useEffect, useCallback } from 'react';

interface VoiceSettings {
  enabled: boolean;
  voice: 'male1' | 'male2' | 'female1';
  rate: number;
  pitch: number;
  volume: number;
}

interface UseVoiceAIProps {
  userName?: string;
  onSpeechEnd?: () => void;
}

export const useVoiceAI = ({ userName = 'there', onSpeechEnd }: UseVoiceAIProps = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    voice: 'male1',
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
  });

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getSelectedVoice = useCallback(() => {
    if (voices.length === 0) return null;

    // Try to find male voices based on common patterns
    const maleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('male') ||
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('alex') ||
      voice.name.toLowerCase().includes('daniel') ||
      voice.name.toLowerCase().includes('thomas') ||
      voice.name.toLowerCase().includes('microsoft mark') ||
      voice.name.toLowerCase().includes('google uk english male')
    );

    const femaleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('microsoft zira')
    );

    switch (settings.voice) {
      case 'male1':
        return maleVoices[0] || voices.find(v => v.lang.startsWith('en')) || voices[0];
      case 'male2':
        return maleVoices[1] || maleVoices[0] || voices.find(v => v.lang.startsWith('en')) || voices[0];
      case 'female1':
        return femaleVoices[0] || voices.find(v => v.lang.startsWith('en')) || voices[0];
      default:
        return voices[0];
    }
  }, [voices, settings.voice]);

  const speak = useCallback((text: string, options?: { interrupt?: boolean }) => {
    if (!isSupported || !settings.enabled) return;

    // Stop current speech if interrupt is true
    if (options?.interrupt) {
      speechSynthesis.cancel();
    }

    // Personalize the text with user's name
    const personalizedText = text.replace(/\b(there|user)\b/gi, userName);

    const utterance = new SpeechSynthesisUtterance(personalizedText);
    const selectedVoice = getSelectedVoice();
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeechEnd?.();
    };
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isSupported, settings, getSelectedVoice, userName, onSpeechEnd]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const getAvailableVoices = useCallback(() => {
    const maleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('male') ||
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('alex') ||
      voice.name.toLowerCase().includes('daniel') ||
      voice.name.toLowerCase().includes('thomas') ||
      voice.name.toLowerCase().includes('microsoft mark')
    );

    const femaleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('microsoft zira')
    );

    return {
      male1: maleVoices[0]?.name || 'Default Male Voice 1',
      male2: maleVoices[1]?.name || 'Default Male Voice 2',
      female1: femaleVoices[0]?.name || 'Default Female Voice'
    };
  }, [voices]);

  return {
    isSupported,
    isSpeaking,
    settings,
    speak,
    stop,
    updateSettings,
    getAvailableVoices
  };
};