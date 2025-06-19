import { Volume2, VolumeX, Settings, Mic, MicOff, Globe, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAdvancedVoiceAI } from '../hooks/useAdvancedVoiceAI';
import * as Dialog from '@radix-ui/react-dialog';

interface VoiceControlsProps {
  userName?: string;
  onSpeechEnd?: () => void;
  className?: string;
}

export default function VoiceControls({ userName, onSpeechEnd, className = '' }: VoiceControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  
  // Get the actual display name from dashboard
  const getDisplayName = () => {
    const savedDisplayName = localStorage.getItem(`learnpilot_display_name_${userName}`);
    return savedDisplayName || userName || 'there';
  };

  const displayName = getDisplayName();

  const { 
    isSupported, 
    isSpeaking, 
    isListening,
    settings, 
    stop,
    startListening,
    stopListening,
    updateSettings, 
    getAvailableVoices,
    getAvailableLanguages,
    speak
  } = useAdvancedVoiceAI({ userName: displayName, onSpeechEnd });

  // Listen for display name changes
  useEffect(() => {
    const handleNameChange = () => {
      // Force re-render when name changes
      const event = new CustomEvent('voice-controls-update');
      window.dispatchEvent(event);
    };

    window.addEventListener('display-name-changed', handleNameChange);
    
    return () => {
      window.removeEventListener('display-name-changed', handleNameChange);
    };
  }, []);

  if (!isSupported) {
    return (
      <div className={`text-gray-400 text-sm ${className}`}>
        Voice not supported
      </div>
    );
  }

  const availableVoices = getAvailableVoices();
  const availableLanguages = getAvailableLanguages();

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const testVoice = () => {
    console.log('🔊 Testing voice with current settings...');
    const testMessage = `Hello ${displayName}! This is a voice test. Can you hear me clearly? I am speaking in ${availableLanguages[settings.language]?.name || 'English'}.`;
    speak(testMessage, { interrupt: true });
  };

  const handleSettingsChange = (newSettings: any) => {
    console.log('⚙️ Voice controls settings changed:', newSettings);
    updateSettings(newSettings);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Voice Status Indicator */}
      <div className="flex items-center gap-2">
        {isSpeaking && (
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium animate-pulse">
            <Volume2 className="w-3 h-3" />
            <span>AI Speaking</span>
          </div>
        )}
        
        {isListening && (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium animate-pulse">
            <Mic className="w-3 h-3" />
            <span>Listening</span>
          </div>
        )}
        
        {!isSpeaking && !isListening && settings.enabled && (
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            <span>Ready for {displayName}</span>
          </div>
        )}
      </div>

      {/* Language Indicator */}
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
        <Globe className="w-3 h-3" />
        <span>{availableLanguages[settings.language]?.name.split(' ')[0] || 'EN'}</span>
      </div>

      {/* Voice Test Button */}
      <button
        onClick={testVoice}
        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
        title={`Test voice for ${displayName}`}
      >
        <Play className="w-4 h-4" />
      </button>

      {/* Voice Toggle */}
      <button
        onClick={() => handleSettingsChange({ enabled: !settings.enabled })}
        className={`p-2 rounded-lg transition-colors ${
          settings.enabled 
            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
        }`}
        title={settings.enabled ? 'Voice enabled' : 'Voice disabled'}
      >
        {settings.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Manual Listening Toggle */}
      <button
        onClick={toggleListening}
        disabled={!settings.enabled}
        className={`p-2 rounded-lg transition-colors ${
          isListening
            ? 'bg-green-100 text-green-600 hover:bg-green-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {/* Stop Button (when speaking) */}
      {isSpeaking && (
        <button
          onClick={stop}
          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          title="Stop all voice activity"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      )}

      {/* Settings */}
      <Dialog.Root open={showSettings} onOpenChange={setShowSettings}>
        <Dialog.Trigger asChild>
          <button
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Voice settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-lg font-semibold mb-4">Quick Voice Settings</Dialog.Title>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>AI will address you as:</strong> {displayName}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Change this in Dashboard → Change name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingsChange({ language: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(availableLanguages).map(([code, config]) => (
                    <option key={code} value={code}>
                      {config.greeting} - {config.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Type
                </label>
                <select
                  value={settings.voice}
                  onChange={(e) => handleSettingsChange({ voice: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male1">🎭 Male Voice 1 ({availableVoices.male1})</option>
                  <option value="male2">🎭 Male Voice 2 ({availableVoices.male2})</option>
                  <option value="female1">🎭 Female Voice ({availableVoices.female1})</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaking Speed: {settings.rate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) => handleSettingsChange({ rate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => handleSettingsChange({ volume: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span>75%</span>
                  <span>Max</span>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  💡 <strong>Tip:</strong> Use the green test button to check if you can hear the AI voice clearly. For full settings, visit the main Settings page.
                </p>
              </div>

              <button
                onClick={testVoice}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Test Voice for {displayName}
              </button>
            </div>

            <div className="flex justify-end mt-6">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Done
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}