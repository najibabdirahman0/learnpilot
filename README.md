# LearnPilot - AI-Powered Multilingual Mock Interview Platform

A comprehensive mock interview platform with real-time voice-to-voice AI conversation, personalized feedback, and full multilingual support powered by ElevenLabs AI voice synthesis.

## 🚀 Features

### 🎤 Real-Time Multilingual Voice-to-Voice AI Conversation
- **ElevenLabs AI Voice Synthesis** with natural, human-like speech in 17+ languages
- **Two-way audio interaction** using Web Speech API and advanced TTS
- **Crystal clear voice output** with customizable settings
- **Real-time speech recognition** with noise reduction
- **Auto-listening** after AI responses for natural conversation flow
- **Language-specific voice selection** with native pronunciation

### 🌍 Full Multilingual Support
- **17 Supported Languages**: English (US/UK), Arabic, Spanish, French, German, Chinese, Japanese, Indonesian, Burmese, Tagalog, Swahili, Hindi, Portuguese, Italian, Russian, Korean
- **Complete UI Translation** - Every interface element translated
- **AI Speaks Your Language** - Interview conducted entirely in selected language
- **Cultural Adaptation** - Interview style adapted to cultural norms
- **RTL Language Support** - Proper right-to-left layout for Arabic and other RTL languages

### 🧠 Contextual AI Interview Questions
- **CV-based personalization** using OpenAI GPT-4o
- **Job description analysis** for relevant questions
- **Multiple interviewer personalities**:
  - 🤝 Friendly HR - Warm and encouraging
  - 💼 Professional Recruiter - Structured and balanced
  - 🎯 Industry Expert - Technical and challenging
- **Dynamic question generation** based on user responses
- **Conversation context awareness** for follow-up questions

### ⚙️ Comprehensive Settings System
- **Persistent settings** saved across sessions
- **Voice customization**: Provider, language, speed, pitch, volume
- **Interview preferences**: Default interviewer type, feedback detail
- **Theme customization**: Light, dark, system themes with accent colors
- **Global language setting** affects entire application

### 📊 Advanced Analytics & Feedback
- **AI-powered performance analysis** using GPT-4o
- **Detailed feedback** with strengths and improvement areas
- **Scoring system** (0-100) based on multiple factors
- **Progress tracking** across multiple interview sessions
- **Session history** with performance trends

## 🛠️ Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling with dark mode support
- **Framer Motion** for animations
- **Radix UI** for accessible components
- **Vite** for fast development and building

### AI & Voice Services
- **OpenAI GPT-4o** for conversation and analysis
- **ElevenLabs API** for premium multilingual voice synthesis
- **Web Speech API** for speech recognition and fallback TTS
- **Multilingual voice models** with native pronunciation

### Data Persistence
- **localStorage** for settings and progress
- **Supabase** integration for cloud storage (optional)
- **Session management** with automatic saving

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd learnpilot
npm install
```

### 2. Environment Setup
Create a `.env` file based on `.env.example`:

```env
# Required for AI conversation
VITE_OPENAI_API_KEY=your_openai_api_key_here

# REQUIRED for premium multilingual voice synthesis
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional for cloud storage
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Get API Keys

#### OpenAI API Key (Required)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and navigate to API Keys
3. Create a new API key
4. Add to your `.env` file

#### ElevenLabs API Key (REQUIRED for Multilingual Voice)
1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Sign up and go to your profile
3. Copy your API key
4. Add to your `.env` file

**Note**: ElevenLabs is now the primary voice provider for the best multilingual experience. Web Speech API is available as a fallback.

### 4. Run the Application
```bash
npm run dev
```

Visit `http://localhost:5173` to start using LearnPilot!

## 🌍 Multilingual Features

### Supported Languages
1. **English (US/UK)** - Native voices with regional accents
2. **العربية (Arabic)** - RTL support with proper cultural adaptation
3. **Español (Spanish)** - Professional business terminology
4. **Français (French)** - Formal interview etiquette
5. **Deutsch (German)** - Direct and systematic approach
6. **中文 (Chinese)** - Respectful hierarchical communication
7. **日本語 (Japanese)** - Proper keigo (honorific language)
8. **Bahasa Indonesia** - Warm but professional tone
9. **မြန်မာ (Burmese)** - Respectful cultural values
10. **Tagalog** - Filipino cultural warmth
11. **Kiswahili (Swahili)** - East African professional norms
12. **हिन्दी (Hindi)** - Indian cultural hierarchy respect
13. **Português (Portuguese)** - Brazilian/Portuguese context
14. **Italiano (Italian)** - Expressive but professional
15. **Русский (Russian)** - Direct and systematic
16. **한국어 (Korean)** - Proper honorific structure

### Language-Specific Features
- **Native Pronunciation** - ElevenLabs provides natural speech patterns
- **Cultural Interview Styles** - Adapted to local business customs
- **Proper Greetings** - Culturally appropriate opening phrases
- **Business Terminology** - Industry-specific vocabulary in each language
- **RTL Layout Support** - Proper text direction for Arabic and other RTL languages

## 🎯 How to Use

### 1. **Set Your Language**
   - Go to Settings → Language & Region
   - Select your preferred language
   - The entire interface and AI will switch to your language

### 2. **Upload CV & Job Description**
   - Upload your CV (PDF/Word) or enter manually
   - Paste the job description for personalized questions
   - Or skip and use general interview mode

### 3. **Choose Your Interviewer**
   - **Friendly HR**: Supportive and encouraging
   - **Professional Recruiter**: Standard interview format
   - **Industry Expert**: Technical and challenging

### 4. **Start Multilingual Voice Interview**
   - AI greets you in your selected language
   - Speak naturally - the system listens automatically
   - AI responds with follow-up questions in your language
   - Continue the conversation naturally

### 5. **Receive Detailed Feedback**
   - Performance score (0-100)
   - Strengths and areas for improvement in your language
   - Specific recommendations
   - Progress tracking over time

## 🔧 Voice Configuration

### ElevenLabs Integration
- **Premium AI Voices** - Natural, human-like speech
- **Multilingual Models** - Native pronunciation in each language
- **Voice Customization** - Choose male/female voices
- **Speed & Pitch Control** - Adjust to your preference
- **High Quality Audio** - Crystal clear speech synthesis

### Settings Options
- **TTS Provider**: ElevenLabs (Premium) or Web Speech API (Free)
- **Voice Type**: Male Voice 1, Male Voice 2, Female Voice
- **Speaking Speed**: 0.5x to 1.5x
- **Volume**: 50% to 100%
- **Auto-listen**: Automatically start listening after AI speaks

## 🔒 Privacy & Security

- **Local-first**: Settings and progress stored locally
- **No audio recording**: Voice is processed in real-time
- **API security**: All API calls use secure HTTPS
- **Optional cloud sync**: Use Supabase for cross-device sync

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set environment variables in the deployment platform
3. Deploy with build command: `npm run build`
4. Serve from `dist` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across multiple languages
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the console for error messages
2. Verify API keys are correctly set (especially ElevenLabs)
3. Ensure microphone permissions are granted
4. Test with different browsers and languages if needed

## 🔮 Roadmap

- [ ] Video interview mode with facial expression analysis
- [ ] Industry-specific question banks in multiple languages
- [ ] Team interview simulations
- [ ] Integration with job boards
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] More language support (Turkish, Vietnamese, Thai, etc.)
- [ ] Voice cloning for personalized interviewer voices