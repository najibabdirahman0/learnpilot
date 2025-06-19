import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Monitor, ChevronDown, Bell, Lock, CreditCard, User, Eye, Globe, Volume2, Mic, Clock, Keyboard, ArrowLeft, Save } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import * as Accordion from '@radix-ui/react-accordion';
import { useTranslation, isRTL } from '../utils/translations';
import { speechService } from '../services/speechService';

interface SettingsProps {
  onClose: () => void;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  animations: boolean;
  accentColor: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  notifications: boolean;
  soundEnabled: boolean;
  voiceSettings: {
    provider: string;
    voice: string;
    rate: number;
    pitch: number;
    volume: number;
    language: string;
    autoListen: boolean;
  };
  interviewSettings: {
    defaultInterviewer: 'friendly' | 'professional' | 'expert';
    autoSave: boolean;
    feedbackDetail: 'basic' | 'detailed' | 'comprehensive';
  };
}

export default function Settings({ onClose }: SettingsProps) {
  const { t, currentLanguage } = useTranslation();
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('learnpilot_app_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      animations: true,
      accentColor: '#4146F8',
      language: 'en-US',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      notifications: true,
      soundEnabled: true,
      voiceSettings: {
        provider: 'ElevenLabs',
        voice: 'female1',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        language: 'en-US',
        autoListen: true
      },
      interviewSettings: {
        defaultInterviewer: 'professional',
        autoSave: true,
        feedbackDetail: 'detailed'
      }
    };
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('learnpilot_app_settings', JSON.stringify(settings));
    setHasChanges(true);
  }, [settings]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateVoiceSettings = (updates: Partial<AppSettings['voiceSettings']>) => {
    setSettings(prev => ({
      ...prev,
      voiceSettings: { ...prev.voiceSettings, ...updates }
    }));
  };

  const updateInterviewSettings = (updates: Partial<AppSettings['interviewSettings']>) => {
    setSettings(prev => ({
      ...prev,
      interviewSettings: { ...prev.interviewSettings, ...updates }
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('learnpilot_app_settings', JSON.stringify(settings));
    setHasChanges(false);
    
    // Trigger global settings update event
    const event = new CustomEvent('settings-saved', { detail: settings });
    window.dispatchEvent(event);
    
    console.log('🌍 Global settings saved and applied:', settings);
    
    // Force page reload to apply language changes
    if (settings.language !== currentLanguage) {
      window.location.reload();
    }
  };

  // Handle language change - sync voice language with main language
  const handleLanguageChange = (newLanguage: string) => {
    updateSettings({ language: newLanguage });
    updateVoiceSettings({ language: newLanguage });
  };

  // Test voice function
  const testVoice = async () => {
    try {
      const testMessage = `Hello! This is a test of the ${settings.voiceSettings.provider} voice system. I am speaking in ${languages.find(l => l.code === settings.voiceSettings.language)?.name || 'English'}.`;
      
      await speechService.speak(testMessage, {
        voice: settings.voiceSettings.voice,
        rate: settings.voiceSettings.rate,
        pitch: settings.voiceSettings.pitch,
        volume: settings.voiceSettings.volume,
        language: settings.voiceSettings.language
      });
    } catch (error) {
      console.error('Voice test failed:', error);
    }
  };

  const colors = ['#1E1E1E', '#FF4545', '#00BA88', '#4146F8', '#9747FF'];

  // Updated languages list with only 7 languages
  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
    { code: 'tl-PH', name: 'Tagalog', flag: '🇵🇭' },
    { code: 'my-MM', name: 'မြန်မာ', flag: '🇲🇲' },
    { code: 'sw-KE', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'id-ID', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  ];

  // Apply theme classes based on current theme
  const getThemeClasses = () => {
    if (settings.theme === 'dark') {
      return 'dark bg-gray-900 text-white';
    } else if (settings.theme === 'light') {
      return 'bg-gray-50 text-gray-900';
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-6 h-6 text-gray-900 dark:text-white" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('globalSettings')}</h1>
              </div>
            </div>
            
            {hasChanges && (
              <button
                onClick={saveSettings}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {t('apply')} {t('settings')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Global Language & Region */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('languageRegion')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">This affects the entire application including AI interactions</p>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('applicationLanguage')}
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  ✨ This changes the interface language AND AI conversation language
                </p>
              </div>
            </div>
          </div>

          {/* Appearance & Theme */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('appearance')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize the visual appearance across the entire app</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="h-24 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                    <Sun className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('light')}</span>
                  </div>
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="h-24 bg-gray-900 rounded-md mb-3 flex items-center justify-center">
                    <Moon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('dark')}</span>
                  </div>
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'system' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'system' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-900 rounded-md mb-3 flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Monitor className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('system')}</span>
                  </div>
                </button>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('accentColors')}</h3>
                <div className="flex items-center gap-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ accentColor: color })}
                      className={`w-10 h-10 rounded-full transition-all ${
                        settings.accentColor === color ? 'ring-2 ring-offset-2 ring-blue-600 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => updateSettings({ accentColor: e.target.value })}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Voice & Audio Settings with ElevenLabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Accordion.Root type="single" collapsible defaultValue="voice">
              <Accordion.Item value="voice">
                <Accordion.Trigger className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('voiceAudio')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Configure ElevenLabs AI voice and speech recognition</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-6">
                  <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <strong>🎤 ElevenLabs Integration:</strong> High-quality, multilingual AI voice synthesis with natural-sounding speech in your selected language.
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Note:</strong> Voice language is automatically synced with your main language setting above.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('ttsProvider')}
                        </label>
                        <select
                          value={settings.voiceSettings.provider}
                          onChange={(e) => updateVoiceSettings({ provider: e.target.value })}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="ElevenLabs">🎤 ElevenLabs (Premium AI Voice)</option>
                          <option value="Web Speech API">🔊 Web Speech API (Free)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('voiceType')}
                        </label>
                        <select
                          value={settings.voiceSettings.voice}
                          onChange={(e) => updateVoiceSettings({ voice: e.target.value })}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="male1">🎭 Male Voice 1</option>
                          <option value="male2">🎭 Male Voice 2</option>
                          <option value="female1">🎭 Female Voice</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('speakingSpeed')}: {settings.voiceSettings.rate.toFixed(1)}x
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="1.5"
                          step="0.1"
                          value={settings.voiceSettings.rate}
                          onChange={(e) => updateVoiceSettings({ rate: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('voicePitch')}: {settings.voiceSettings.pitch.toFixed(1)}
                        </label>
                        <input
                          type="range"
                          min="0.8"
                          max="1.2"
                          step="0.1"
                          value={settings.voiceSettings.pitch}
                          onChange={(e) => updateVoiceSettings({ pitch: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('volume')}: {Math.round(settings.voiceSettings.volume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="1"
                          step="0.1"
                          value={settings.voiceSettings.volume}
                          onChange={(e) => updateVoiceSettings({ volume: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('autoStartListening')}</label>
                      <Switch.Root
                        checked={settings.voiceSettings.autoListen}
                        onCheckedChange={(checked) => updateVoiceSettings({ autoListen: checked })}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.voiceSettings.autoListen ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <Switch.Thumb className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.voiceSettings.autoListen ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </Switch.Root>
                    </div>

                    {/* Voice Test Button */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={testVoice}
                        className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        🎤 Test ElevenLabs Voice
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Test the AI voice with current settings in {languages.find(l => l.code === settings.voiceSettings.language)?.name || 'English'}
                      </p>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>

          {/* General Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Accordion.Root type="single" collapsible>
              <Accordion.Item value="general">
                <Accordion.Trigger className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('general')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Basic app preferences</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('showAnimations')}</label>
                      <Switch.Root
                        checked={settings.animations}
                        onCheckedChange={(checked) => updateSettings({ animations: checked })}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.animations ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <Switch.Thumb className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.animations ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </Switch.Root>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('enableNotifications')}</label>
                      <Switch.Root
                        checked={settings.notifications}
                        onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <Switch.Thumb className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </Switch.Root>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('soundEffects')}</label>
                      <Switch.Root
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        <Switch.Thumb className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </Switch.Root>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>

          {/* ElevenLabs Integration Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-xl p-6">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-4">🎤 ElevenLabs AI Voice Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-700 dark:text-green-300">
                  <strong>Provider:</strong> {settings.voiceSettings.provider}
                </p>
                <p className="text-green-700 dark:text-green-300">
                  <strong>Language:</strong> {languages.find(l => l.code === settings.language)?.name}
                </p>
              </div>
              <div>
                <p className="text-green-700 dark:text-green-300">
                  <strong>Voice:</strong> {settings.voiceSettings.voice} ({settings.voiceSettings.language})
                </p>
                <p className="text-green-700 dark:text-green-300">
                  <strong>Quality:</strong> Premium AI Voice Synthesis
                </p>
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-3">
              ElevenLabs provides natural, human-like AI voices that speak fluently in your selected language with perfect pronunciation and intonation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}