import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SoundWaveVisualizerProps {
  isActive: boolean;
  audioLevel: number;
  language: string;
}

export default function SoundWaveVisualizer({ isActive, audioLevel, language }: SoundWaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const barsRef = useRef<number[]>(Array(20).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barsRef.current.length;
      const centerY = canvas.height / 2;

      barsRef.current.forEach((height, index) => {
        // Update bar heights based on audio level and add some randomness
        if (isActive) {
          const targetHeight = (audioLevel * 40 + Math.random() * 20) * (0.5 + Math.sin(Date.now() * 0.01 + index) * 0.5);
          barsRef.current[index] = height + (targetHeight - height) * 0.3;
        } else {
          barsRef.current[index] = height * 0.9; // Fade out when not active
        }

        const x = index * barWidth + barWidth / 2;
        const barHeight = Math.max(2, barsRef.current[index]);

        // Create gradient
        const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
        if (isActive) {
          gradient.addColorStop(0, '#10B981'); // Green
          gradient.addColorStop(0.5, '#34D399');
          gradient.addColorStop(1, '#6EE7B7');
        } else {
          gradient.addColorStop(0, '#6B7280'); // Gray
          gradient.addColorStop(0.5, '#9CA3AF');
          gradient.addColorStop(1, '#D1D5DB');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x - barWidth * 0.3, centerY - barHeight, barWidth * 0.6, barHeight * 2);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, audioLevel]);

  const getListeningText = () => {
    const langCode = language.split('-')[0];
    
    const texts = {
      'en': 'Listening...',
      'ar': 'أستمع...',
      'es': 'Escuchando...',
      'fr': 'J\'écoute...',
      'de': 'Höre zu...',
      'zh': '正在听...',
      'ja': '聞いています...',
      'id': 'Mendengarkan...',
      'my': 'နားထောင်နေသည်...',
      'tl': 'Nakikinig...',
      'sw': 'Sikiliza...',
      'hi': 'सुन रहा हूं...',
      'pt': 'Ouvindo...',
      'it': 'Ascoltando...',
      'ru': 'Слушаю...',
      'ko': '듣고 있습니다...'
    };

    return texts[langCode as keyof typeof texts] || texts['en'];
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="rounded-lg bg-gray-800/50 backdrop-blur-sm"
      />
      
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-2 px-3 py-1 bg-green-600/20 backdrop-blur-sm rounded-full border border-green-400/30"
        >
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <span className="text-green-400 text-sm font-medium">
            {getListeningText()}
          </span>
        </motion.div>
      )}
    </div>
  );
}