import { useState, useEffect, useRef, useCallback } from 'react';
import { OpenAIRealtimeService, RealtimeConfig, RealtimeMessage, JobApplicationService } from '../services/openaiRealtime';

interface UseOpenAIRealtimeProps {
  jobTitle: string;
  company: string;
  jobDescription: string;
  cvContent: string;
  interviewerType: 'friendly' | 'professional' | 'expert';
  userName: string;
  language: string;
  voiceGender: 'male' | 'female';
}

export const useOpenAIRealtime = ({
  jobTitle,
  company,
  jobDescription,
  cvContent,
  interviewerType,
  userName,
  language,
  voiceGender
}: UseOpenAIRealtimeProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  const serviceRef = useRef<OpenAIRealtimeService | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Get OpenAI API key
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Map voice gender to OpenAI voice names
  const getVoiceName = useCallback((gender: 'male' | 'female') => {
    const voices = {
      male: ['alloy', 'echo', 'onyx'] as const,
      female: ['nova', 'shimmer', 'fable'] as const
    };
    
    // Select first voice of the requested gender
    return voices[gender][0];
  }, []);

  // Initialize the service
  useEffect(() => {
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      setError('OpenAI API key not configured. Please add your OpenAI API key to continue.');
      return;
    }

    const config: RealtimeConfig = {
      apiKey,
      model: 'gpt-4o-realtime-preview-2024-10-01',
      voice: getVoiceName(voiceGender),
      language,
      instructions: `You are conducting a ${interviewerType} job interview for ${jobTitle} at ${company}. The candidate's name is ${userName}. Conduct the interview entirely in the language: ${language}. Keep responses conversational and natural for voice interaction.`
    };

    serviceRef.current = new OpenAIRealtimeService(config);

    // Set up callbacks
    serviceRef.current.setOnMessage((message) => {
      console.log('📨 New message:', message);
      setMessages(prev => [...prev, message]);
      
      // Save message to application if we have an ID
      if (applicationId) {
        JobApplicationService.addMessageToApplication(applicationId, message);
      }
    });

    serviceRef.current.setOnConnection((connected) => {
      console.log('🔗 Connection status:', connected);
      setIsConnected(connected);
    });
    
    serviceRef.current.setOnError((errorMsg) => {
      console.error('❌ OpenAI Realtime error:', errorMsg);
      setError(errorMsg);
    });

    return () => {
      serviceRef.current?.disconnect();
    };
  }, [apiKey, jobTitle, company, interviewerType, userName, language, voiceGender, applicationId, getVoiceName]);

  // Create job application when interview starts
  const createJobApplication = useCallback(() => {
    const id = JobApplicationService.saveJobApplication({
      jobTitle,
      company,
      jobDescription,
      cvContent,
      interviewerType,
      language,
      voice: getVoiceName(voiceGender),
      status: 'active',
      messages: []
    });
    
    setApplicationId(id);
    console.log('💾 Created job application:', id);
    return id;
  }, [jobTitle, company, jobDescription, cvContent, interviewerType, language, voiceGender, getVoiceName]);

  // Connect to OpenAI Realtime
  const connect = useCallback(async () => {
    if (!serviceRef.current) {
      setError('Service not initialized');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔗 Connecting to OpenAI Realtime...');
      await serviceRef.current.connect();
      
      // Create job application when successfully connected
      if (!applicationId) {
        createJobApplication();
      }
      
      console.log('✅ Connected successfully');
      
    } catch (err) {
      console.error('❌ Connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to OpenAI Realtime API');
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, createJobApplication]);

  // Send text message
  const sendMessage = useCallback((content: string) => {
    if (!serviceRef.current || !isConnected) {
      console.warn('⚠️ Cannot send message: not connected');
      return;
    }
    
    console.log('📤 Sending message:', content);
    
    const userMessage: RealtimeMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    serviceRef.current.sendUserMessage(content);
    
    // Save user message to application
    if (applicationId) {
      JobApplicationService.addMessageToApplication(applicationId, userMessage);
    }
  }, [isConnected, applicationId]);

  // Start audio recording
  const startRecording = useCallback(async () => {
    if (!isConnected) {
      console.warn('⚠️ Cannot start recording: not connected');
      return;
    }

    try {
      console.log('🎤 Starting audio recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: Blob[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        console.log('🎤 Recording stopped, processing audio...');
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        
        if (serviceRef.current && isConnected) {
          serviceRef.current.sendUserAudio(arrayBuffer);
        }
      };
      
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      console.log('✅ Recording started');
      
    } catch (err) {
      console.error('❌ Failed to start recording:', err);
      setError('Failed to access microphone. Please check permissions.');
    }
  }, [isConnected]);

  // Stop audio recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('🎤 Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);

  // Update language
  const updateLanguage = useCallback((newLanguage: string) => {
    console.log('🌍 Updating language to:', newLanguage);
    serviceRef.current?.updateLanguage(newLanguage);
  }, []);

  // Update voice
  const updateVoice = useCallback((gender: 'male' | 'female') => {
    const voiceName = getVoiceName(gender);
    console.log('🎭 Updating voice to:', voiceName);
    serviceRef.current?.updateVoice(voiceName);
  }, [getVoiceName]);

  // Complete interview
  const completeInterview = useCallback((score: number, feedback: string) => {
    if (applicationId) {
      console.log('✅ Completing interview with score:', score);
      JobApplicationService.completeApplication(applicationId, score, feedback);
    }
  }, [applicationId]);

  // Disconnect
  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting...');
    serviceRef.current?.disconnect();
    if (mediaRecorderRef.current && isRecording) {
      stopRecording();
    }
  }, [isRecording, stopRecording]);

  return {
    isConnected,
    isLoading,
    messages,
    error,
    isRecording,
    applicationId,
    connect,
    disconnect,
    sendMessage,
    startRecording,
    stopRecording,
    updateLanguage,
    updateVoice,
    completeInterview
  };
};