import React from 'react';
import { BookOpen } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
        <BookOpen size={24} />
      </div>
      <span className="text-xl font-bold text-blue-600">LearnPilot</span>
    </div>
  );
};

export default Logo;
