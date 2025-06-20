import { useRef, useCallback, useState } from 'react';

export interface RealtimeConfig {
  apiKey: string;
  model: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  language: string;
  instructions: string;
}

export interface RealtimeMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface JobApplicationData {
  id: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  cvContent: string;
  interviewerType: 'friendly' | 'professional' | 'expert';
  language: string;
  voice: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'completed';
  messages: RealtimeMessage[];
  score?: number;
  feedback?: string;
}

export class OpenAIRealtimeService {
  private ws: WebSocket | null = null;
  private config: RealtimeConfig;
  private isConnected = false;
  private messageQueue: any[] = [];
  private onMessageCallback?: (message: RealtimeMessage) => void;
  private onConnectionCallback?: (connected: boolean) => void;
  private onErrorCallback?: (error: string) => void;
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlayingAudio = false;

  constructor(config: RealtimeConfig) {
    this.config = config;
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      console.log('🔗 Connecting to OpenAI Realtime API...');
      
      // OpenAI Realtime API WebSocket endpoint
      const wsUrl = import.meta.env.VITE_OPENAI_REALTIME_WS_URL || 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
      
      this.ws = new WebSocket(wsUrl, [
        'realtime',
        `Bearer.${this.config.apiKey}`
      ]);

      this.ws.onopen = () => {
        console.log('✅ OpenAI Realtime connected');
        this.isConnected = true;
        this.onConnectionCallback?.(true);
        this.initializeSession();
        this.processMessageQueue();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔗 OpenAI Realtime disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.onConnectionCallback?.(false);
      };

      this.ws.onerror = (error) => {
        console.error('🔗 OpenAI Realtime error:', error);
        this.onErrorCallback?.('WebSocket connection error occurred');
      };

    } catch (error) {
      console.error('Failed to connect to OpenAI Realtime:', error);
      this.onErrorCallback?.('Failed to connect to OpenAI Realtime API');
      throw error;
    }
  }

  private initializeSession(): void {
    if (!this.ws) return;

    console.log('🔧 Initializing session with config:', {
      voice: this.config.voice,
      language: this.config.language
    });

    // Configure session with multilingual support
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: this.getMultilingualInstructions(),
        voice: this.config.voice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500
        },
        tools: [],
        tool_choice: 'auto',
        temperature: 0.7,
        max_response_output_tokens: 4096
      }
    };

    this.sendMessage(sessionConfig);
  }

  private getMultilingualInstructions(): string {
    const langCode = this.config.language.split('-')[0];
    
    const instructions = {
      'en': `You are a professional AI interviewer conducting a job interview. Speak naturally and conversationally in English. Ask relevant questions about the candidate's experience, skills, and fit for the role. Keep responses concise but engaging for voice conversation. Be encouraging and professional.`,
      
      'ar': `أنت مُحاور ذكي اصطناعي محترف تقوم بإجراء مقابلة عمل. تحدث بطبيعية وبأسلوب محادثة باللغة العربية. اسأل أسئلة ذات صلة حول خبرة المرشح ومهاراته ومدى ملاءمته للدور. اجعل الردود مختصرة لكن جذابة للمحادثة الصوتية. كن مشجعاً ومهنياً.`,
      
      'tl': `Ikaw ay isang propesyonal na AI interviewer na nagsasagawa ng job interview. Magsalita nang natural at conversational sa Tagalog. Magtanong ng mga relevant na tanong tungkol sa experience, skills, at fit ng candidate para sa role. Gawing concise pero engaging ang mga response para sa voice conversation. Maging encouraging at professional.`,
      
      'my': `သင်သည် အလုပ်အင်တာဗျူး ပြုလုပ်နေသော ပရော်ဖက်ရှင်နယ် AI အင်တာဗျူးယူသူ ဖြစ်သည်။ မြန်မာဘာသာဖြင့် သဘာဝကျကျ စကားပြောဆိုပါ။ ကိုယ်စားလှယ်၏ အတွေ့အကြုံ၊ ကျွမ်းကျင်မှုများနှင့် ရာထူးအတွက် သင့်လျော်မှုအကြောင်း သက်ဆိုင်သော မေးခွန်းများ မေးပါ။ အသံစကားပြောဆိုမှုအတွက် တိုတောင်းပြီး စိတ်ဝင်စားဖွယ်ရာ ဖြစ်အောင် ပြုလုပ်ပါ။`,
      
      'sw': `Wewe ni mhojaji wa AI wa kitaaluma anayefanya mahojiano ya kazi. Zungumza kwa kawaida na kwa mazungumzo kwa Kiswahili. Uliza maswali yanayohusiana na uzoefu wa mgombea, ujuzi, na utoshelevu wake kwa jukumu hilo. Fanya majibu yawe mafupi lakini ya kuvutia kwa mazungumzo ya sauti. Kuwa wa kuhamasisha na wa kitaaluma.`,
      
      'id': `Anda adalah pewawancara AI profesional yang melakukan wawancara kerja. Berbicaralah secara alami dan percakapan dalam Bahasa Indonesia. Ajukan pertanyaan yang relevan tentang pengalaman, keterampilan, dan kesesuaian kandidat untuk peran tersebut. Buat respons yang ringkas namun menarik untuk percakapan suara. Bersikaplah mendorong dan profesional.`
    };

    return instructions[langCode as keyof typeof instructions] || instructions['en'];
  }

  private handleMessage(message: any): void {
    console.log('📨 Received message type:', message.type);

    switch (message.type) {
      case 'session.created':
        console.log('✅ Session created successfully');
        break;
        
      case 'session.updated':
        console.log('✅ Session updated successfully');
        break;

      case 'conversation.item.created':
        if (message.item.type === 'message') {
          this.handleConversationMessage(message.item);
        }
        break;
      
      case 'response.audio.delta':
        this.handleAudioDelta(message);
        break;
      
      case 'response.text.delta':
        this.handleTextDelta(message);
        break;
      
      case 'response.done':
        console.log('✅ Response complete');
        break;
      
      case 'error':
        console.error('❌ OpenAI Realtime error:', message.error);
        this.onErrorCallback?.(message.error.message || 'Unknown error occurred');
        break;
        
      default:
        console.log('📨 Unhandled message type:', message.type);
    }
  }

  private handleConversationMessage(item: any): void {
    const realtimeMessage: RealtimeMessage = {
      id: item.id,
      type: item.role === 'user' ? 'user' : 'assistant',
      content: item.content?.[0]?.text || item.content?.[0]?.transcript || '',
      timestamp: new Date()
    };

    console.log('💬 New conversation message:', realtimeMessage);
    this.onMessageCallback?.(realtimeMessage);
  }

  private handleAudioDelta(message: any): void {
    if (message.delta && this.audioContext) {
      try {
        // Queue audio for playback
        this.queueAudioDelta(message.delta);
      } catch (error) {
        console.error('Audio processing error:', error);
      }
    }
  }

  private async queueAudioDelta(audioData: string): Promise<void> {
    try {
      if (!this.audioContext) return;
      
      const audioBuffer = this.base64ToArrayBuffer(audioData);
      const decodedData = await this.audioContext.decodeAudioData(audioBuffer);
      
      this.audioQueue.push(decodedData);
      
      if (!this.isPlayingAudio) {
        this.playNextAudio();
      }
    } catch (error) {
      console.error('Failed to queue audio:', error);
    }
  }

  private playNextAudio(): void {
    if (this.audioQueue.length === 0 || !this.audioContext) {
      this.isPlayingAudio = false;
      return;
    }

    this.isPlayingAudio = true;
    const audioBuffer = this.audioQueue.shift()!;
    
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    source.onended = () => {
      this.playNextAudio();
    };
    
    source.start();
  }

  private handleTextDelta(message: any): void {
    if (message.delta) {
      console.log('📝 Text delta:', message.delta);
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  sendUserMessage(content: string): void {
    const message = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: content
        }]
      }
    };

    this.sendMessage(message);
    this.triggerResponse();
  }

  sendUserAudio(audioData: ArrayBuffer): void {
    const base64Audio = this.arrayBufferToBase64(audioData);
    
    const message = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_audio',
          audio: base64Audio
        }]
      }
    };

    this.sendMessage(message);
    this.triggerResponse();
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private triggerResponse(): void {
    const responseMessage = {
      type: 'response.create',
      response: {
        modalities: ['text', 'audio'],
        instructions: 'Continue the interview conversation naturally in the specified language.'
      }
    };

    this.sendMessage(responseMessage);
  }

  private sendMessage(message: any): void {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  setOnMessage(callback: (message: RealtimeMessage) => void): void {
    this.onMessageCallback = callback;
  }

  setOnConnection(callback: (connected: boolean) => void): void {
    this.onConnectionCallback = callback;
  }

  setOnError(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  updateLanguage(language: string): void {
    this.config.language = language;
    if (this.isConnected) {
      this.initializeSession();
    }
  }

  updateVoice(voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'): void {
    this.config.voice = voice;
    if (this.isConnected) {
      this.initializeSession();
    }
  }
}

// Job Application Data Persistence Service
export class JobApplicationService {
  private static readonly STORAGE_KEY = 'learnpilot_job_applications';

  static saveJobApplication(data: Omit<JobApplicationData, 'id' | 'createdAt' | 'updatedAt'>): string {
    const applications = this.getAllJobApplications();
    const id = this.generateId();
    
    const newApplication: JobApplicationData = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    applications.push(newApplication);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications));
    
    console.log('💾 Job application saved:', id);
    return id;
  }

  static updateJobApplication(id: string, updates: Partial<JobApplicationData>): void {
    const applications = this.getAllJobApplications();
    const index = applications.findIndex(app => app.id === id);
    
    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        ...updates,
        updatedAt: new Date()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications));
      console.log('💾 Job application updated:', id);
    }
  }

  static getJobApplication(id: string): JobApplicationData | null {
    const applications = this.getAllJobApplications();
    return applications.find(app => app.id === id) || null;
  }

  static getAllJobApplications(): JobApplicationData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const applications = JSON.parse(stored);
        // Convert date strings back to Date objects
        return applications.map((app: any) => ({
          ...app,
          createdAt: new Date(app.createdAt),
          updatedAt: new Date(app.updatedAt),
          messages: app.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })) || []
        }));
      }
    } catch (error) {
      console.error('Error loading job applications:', error);
    }
    return [];
  }

  static deleteJobApplication(id: string): void {
    const applications = this.getAllJobApplications();
    const filtered = applications.filter(app => app.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    console.log('🗑️ Job application deleted:', id);
  }

  static addMessageToApplication(applicationId: string, message: RealtimeMessage): void {
    const application = this.getJobApplication(applicationId);
    if (application) {
      application.messages.push(message);
      this.updateJobApplication(applicationId, { messages: application.messages });
    }
  }

  static completeApplication(applicationId: string, score: number, feedback: string): void {
    this.updateJobApplication(applicationId, {
      status: 'completed',
      score,
      feedback
    });
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static getApplicationsByStatus(status: 'active' | 'completed'): JobApplicationData[] {
    return this.getAllJobApplications().filter(app => app.status === status);
  }

  static getRecentApplications(limit: number = 5): JobApplicationData[] {
    return this.getAllJobApplications()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }
}