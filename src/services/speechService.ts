// Enhanced Speech Service with ElevenLabs API integration
export interface TTSProvider {
  name: string;
  speak: (text: string, options: TTSOptions) => Promise<void>;
  isAvailable: () => boolean;
}

export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

// ElevenLabs API Provider with multilingual support
class ElevenLabsProvider implements TTSProvider {
  name = 'ElevenLabs';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey !== 'your_elevenlabs_api_key_here' && 'fetch' in window;
  }

  // Get appropriate voice ID based on language and voice type
  private getVoiceId(language: string, voiceType: string): string {
    const voiceMap: Record<string, Record<string, string>> = {
      'en-US': {
        'male1': '21m00Tcm4TlvDq8ikWAM', // Rachel (high quality)
        'male2': 'AZnzlk1XvdvUeBnXmlld', // Domi
        'female1': 'EXAVITQu4vr4xnSDxMaL' // Bella
      },
      'ar-SA': {
        'male1': '21m00Tcm4TlvDq8ikWAM', // Use multilingual voice for Arabic
        'male2': 'AZnzlk1XvdvUeBnXmlld',
        'female1': 'EXAVITQu4vr4xnSDxMaL'
      },
      'tl-PH': {
        'male1': '21m00Tcm4TlvDq8ikWAM', // Use multilingual voice for Tagalog
        'male2': 'AZnzlk1XvdvUeBnXmlld',
        'female1': 'EXAVITQu4vr4xnSDxMaL'
      },
      'my-MM': {
        'male1': '21m00Tcm4TlvDq8ikWAM', // Use multilingual voice for Myanmar
        'male2': 'AZnzlk1XvdvUeBnXmlld',
        'female1': 'EXAVITQu4vr4xnSDxMaL'
      },
      'sw-KE': {
        'male1': '21m00Tcm4TlvDq8ikWAM', // Use multilingual voice for Swahili
        'male2': 'AZnzlk1XvdvUeBnXmlld',
        'female1': 'EXAVITQu4vr4xnSDxMaL'
      },
      'id-ID': {
        'male1': '21m00Tcm4TlvDq8ikWAM', // Use multilingual voice for Indonesian
        'male2': 'AZnzlk1XvdvUeBnXmlld',
        'female1': 'EXAVITQu4vr4xnSDxMaL'
      }
    };

    const langCode = language.split('-')[0];
    const voices = voiceMap[language] || voiceMap[`${langCode}-${langCode.toUpperCase()}`] || voiceMap['en-US'];
    
    return voices[voiceType] || voices['female1'] || '21m00Tcm4TlvDq8ikWAM';
  }

  async speak(text: string, options: TTSOptions): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('ElevenLabs API not available or API key missing');
    }

    try {
      console.log('🎤 ElevenLabs: Starting speech synthesis for language:', options.language);
      options.onStart?.();

      const voiceId = this.getVoiceId(options.language || 'en-US', options.voice || 'female1');
      console.log('🎤 ElevenLabs: Using voice ID:', voiceId);

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2', // Use multilingual model
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎤 ElevenLabs API error:', response.status, errorText);
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Apply volume setting
      if (options.volume !== undefined) {
        audio.volume = options.volume;
      }

      // Apply rate setting (playback speed)
      if (options.rate !== undefined) {
        audio.playbackRate = options.rate;
      }

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        console.log('🎤 ElevenLabs: Speech completed');
        options.onEnd?.();
      };

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        console.error('🎤 ElevenLabs: Audio playback error:', error);
        options.onError?.(error);
      };

      console.log('🎤 ElevenLabs: Playing audio...');
      await audio.play();
    } catch (error) {
      console.error('🎤 ElevenLabs: Speech synthesis error:', error);
      options.onError?.(error);
      throw error;
    }
  }
}

// Browser Web Speech API Provider (fallback)
class WebSpeechProvider implements TTSProvider {
  name = 'Web Speech API';

  isAvailable(): boolean {
    return 'speechSynthesis' in window;
  }

  async speak(text: string, options: TTSOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) {
        reject(new Error('Web Speech API not available'));
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply options
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.volume) utterance.volume = options.volume;
      if (options.language) utterance.lang = options.language;

      // Set voice if specified
      if (options.voice) {
        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => 
          voice.name.includes(options.voice!) || 
          voice.lang.includes(options.language || 'en')
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => {
        console.log('🎤 Web Speech: Speech started');
        options.onStart?.();
      };

      utterance.onend = () => {
        console.log('🎤 Web Speech: Speech ended');
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('🎤 Web Speech: Speech error:', event);
        options.onError?.(event);
        reject(event);
      };

      speechSynthesis.speak(utterance);
    });
  }
}

// Speech Service Manager
export class SpeechService {
  private providers: TTSProvider[] = [];
  private currentProvider: TTSProvider;

  constructor() {
    // Initialize ElevenLabs provider first (priority)
    const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (elevenLabsKey && elevenLabsKey !== 'your_elevenlabs_api_key_here') {
      console.log('🎤 Initializing ElevenLabs provider...');
      this.providers.push(new ElevenLabsProvider(elevenLabsKey));
    }

    // Add Web Speech API as fallback
    this.providers.push(new WebSpeechProvider());

    // Set default provider (prefer ElevenLabs)
    this.currentProvider = this.providers.find(p => p.isAvailable()) || this.providers[0];
    
    console.log('🎤 Speech Service initialized with provider:', this.currentProvider?.name);
  }

  getAvailableProviders(): TTSProvider[] {
    return this.providers.filter(p => p.isAvailable());
  }

  setProvider(providerName: string): boolean {
    const provider = this.providers.find(p => p.name === providerName && p.isAvailable());
    if (provider) {
      this.currentProvider = provider;
      console.log('🎤 Switched to provider:', providerName);
      return true;
    }
    console.warn('🎤 Provider not available:', providerName);
    return false;
  }

  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!this.currentProvider) {
      throw new Error('No TTS provider available');
    }

    console.log('🎤 Speaking with provider:', this.currentProvider.name, 'Language:', options.language);
    return this.currentProvider.speak(text, options);
  }

  getCurrentProvider(): string {
    return this.currentProvider?.name || 'None';
  }
}

// Speech Recognition Service
export class SpeechRecognitionService {
  private recognition: any;
  private isListening = false;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  isAvailable(): boolean {
    return !!this.recognition;
  }

  async startListening(options: {
    language?: string;
    onResult?: (text: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
  } = {}): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error('Speech recognition not available');
    }

    if (this.isListening) {
      return;
    }

    return new Promise((resolve, reject) => {
      // Stop any existing recognition session before starting a new one
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore errors from stopping non-active recognition
      }

      // Small delay to ensure the stop operation completes
      setTimeout(() => {
        this.recognition.lang = options.language || 'en-US';
        console.log('🎤 Speech Recognition: Starting with language:', this.recognition.lang);

        this.recognition.onstart = () => {
          this.isListening = true;
          console.log('🎤 Speech Recognition: Started');
          options.onStart?.();
        };

        this.recognition.onresult = (event: any) => {
          if (event.results && event.results.length > 0) {
            const transcript = event.results[0][0].transcript.trim();
            console.log('🎤 Speech Recognition: Result:', transcript);
            options.onResult?.(transcript);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          console.log('🎤 Speech Recognition: Ended');
          options.onEnd?.();
          resolve();
        };

        this.recognition.onerror = (event: any) => {
          this.isListening = false;
          console.error('🎤 Speech Recognition: Error:', event.error);
          options.onError?.(event);
          reject(event);
        };

        try {
          this.recognition.start();
        } catch (error) {
          this.isListening = false;
          console.error('🎤 Speech Recognition: Failed to start:', error);
          reject(error);
        }
      }, 100);
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

// Export singleton instances
export const speechService = new SpeechService();
export const speechRecognition = new SpeechRecognitionService();