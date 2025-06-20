"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useWhisper } from "@chengsokdara/use-whisper";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function VoiceAssistant() {
  const [aiFinishedSpeaking, setAiFinishedSpeaking] = useState(true);
  const [firstGreetingDone, setFirstGreetingDone] = useState(false);

  const {
    transcript,
    startRecording,
    stopRecording,
    recording,
  } = useWhisper({
    apiKey: OPENAI_API_KEY,
    whisperConfig: { language: "en" },
    streaming: true,
    timeSlice: 1000,
    autoStart: true,
    onDataAvailable: async () => {
      stopRecording();
    },
  });

  const { messages, append } = useChat({
    api: "/api/chat",  // Assuming you have an API route for chat or default
    body: { transcript },
    onFinish: (message) => {
      speak(message.content);
    },
  });

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setAiFinishedSpeaking(false);
    utterance.onend = () => {
      setAiFinishedSpeaking(true);
      setTimeout(() => {
        startRecording();
      }, 500);
    };
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (transcript?.text?.toLowerCase().includes("hello") && !firstGreetingDone) {
      setFirstGreetingDone(true);
      append({ role: "user", content: "Hello" });
    }

    if (firstGreetingDone && transcript?.text && aiFinishedSpeaking) {
      append({ role: "user", content: transcript.text });
    }
  }, [transcript]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🎙️ Speak Now – AI Is Listening</h1>
      <div className="bg-gray-100 p-3 rounded">
        <strong>Live:</strong> {transcript?.text || "Waiting..."}
      </div>
      <div className="mt-4">
        {messages.map((m) => (
          <p key={m.id}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
          </p>
        ))}
      </div>
    </div>
  );
}
