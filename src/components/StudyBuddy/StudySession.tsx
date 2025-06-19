import { useState, useEffect } from 'react';
import { MessageSquare, Send, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { supabase, createStudySession, uploadStudyMaterial } from '../../lib/supabase';
import { useVoiceAI } from '../../hooks/useVoiceAI';
import VoiceControls from '../VoiceControls';

interface StudySessionProps {
  content: string;
  aiRole: 'lecturer' | 'student' | 'colleague';
  onComplete: () => void;
  userName?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

export default function StudySession({ 
  content, 
  aiRole, 
  onComplete, 
  userName = 'there' 
}: StudySessionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Get the dashboard display name
  const displayName = localStorage.getItem(`learnpilot_display_name_${userName}`) || userName;

  const { speak, isSpeaking } = useVoiceAI({ 
    userName: displayName, // Use dashboard name
    onSpeechEnd: () => {
      // Can add logic here when AI finishes speaking
    }
  });

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const session = await createStudySession(user.id, aiRole, 'custom');
          setSessionId(session.id);
          await uploadStudyMaterial(session.id, content);
        }
      } catch (error) {
        console.error('Error initializing study session:', error);
      }

      // Initial AI message based on role
      const roleMessages = {
        lecturer: `Hello ${displayName}! I'm your AI instructor today. I've reviewed your study material and I'm ready to help you master these concepts. What would you like to explore first?`,
        student: `Hey ${displayName}! I'm excited to study this together with you. I've gone through the material - what part should we focus on first? I find it helps when we discuss things together!`,
        colleague: `Hi ${displayName}! Great to collaborate with you on this. I've analyzed the content from a professional perspective. What's your initial take on this material? Let's dive deep into the practical applications.`,
      };

      const initialMessage = {
        id: '1',
        text: roleMessages[aiRole],
        sender: 'ai' as const,
        timestamp: new Date(),
      };

      setMessages([initialMessage]);
      
      // Speak the initial message
      setTimeout(() => {
        speak(roleMessages[aiRole]);
      }, 1000);
    };

    initializeSession();
  }, [aiRole, content, displayName, speak]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Generate AI response based on role and user input
    setTimeout(() => {
      const responses = {
        lecturer: [
          `Excellent question, ${displayName}! Let me break this down step by step for you. This concept is fundamental because...`,
          `That's a great observation, ${displayName}! You're thinking like a true scholar. This relates to the principle of...`,
          `I can see you're grasping the material well, ${displayName}. Let's explore this further with a practical example...`,
          `Perfect! ${displayName}, you've identified a key point. Now, let's examine how this applies in real-world scenarios...`,
        ],
        student: [
          `Oh wow, ${displayName}, that's exactly what I was thinking too! Maybe we could approach it this way...`,
          `I'm still wrapping my head around that part too, ${displayName}. Should we work through it together step by step?`,
          `That makes so much sense now, ${displayName}! It reminds me of something we covered earlier. Do you see the connection?`,
          `Great point, ${displayName}! I hadn't thought of it that way. This is why studying together is so helpful!`,
        ],
        colleague: [
          `From a professional standpoint, ${displayName}, that's exactly the kind of strategic thinking we need in the workplace...`,
          `Excellent insight, ${displayName}! In my experience, this concept becomes crucial when dealing with...`,
          `That's a very practical approach, ${displayName}. Have you considered how this might scale in enterprise environments?`,
          `Spot on, ${displayName}! This is the kind of analysis that separates good professionals from great ones...`,
        ],
      };

      const roleResponses = responses[aiRole];
      const randomResponse = roleResponses[Math.floor(Math.random() * roleResponses.length)];

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'ai' as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
      
      // Speak the AI response
      speak(randomResponse);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Study Session</h3>
              <p className="text-sm text-gray-500">
                AI Role: {aiRole.charAt(0).toUpperCase() + aiRole.slice(1)} • {displayName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <VoiceControls userName={displayName} className="mr-2" />
            <button
              onClick={onComplete}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto p-4 space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Study Material:</h4>
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        </div>

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-xl ${
                message.sender === 'ai'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}

        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}

        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm">
              🎤 AI is speaking...
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or share your thoughts..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}