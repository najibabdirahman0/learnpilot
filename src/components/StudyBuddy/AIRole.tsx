import { Brain, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIRoleProps {
  onSelect: (role: 'lecturer' | 'student' | 'colleague') => void;
}

const roles = [
  {
    type: 'lecturer',
    icon: <Brain className="w-8 h-8" />,
    name: 'AI Lecturer',
    description: 'Learn from an expert who explains concepts clearly and thoroughly',
    style: 'bg-blue-100 text-blue-600 hover:bg-blue-50',
  },
  {
    type: 'student',
    icon: <Users className="w-8 h-8" />,
    name: 'Fellow Student',
    description: 'Study with a peer who helps you understand through discussion',
    style: 'bg-green-100 text-green-600 hover:bg-green-50',
  },
  {
    type: 'colleague',
    icon: <Briefcase className="w-8 h-8" />,
    name: 'Workplace Mentor',
    description: 'Practice with a professional who shares real-world insights',
    style: 'bg-purple-100 text-purple-600 hover:bg-purple-50',
  },
] as const;

export default function AIRole({ onSelect }: AIRoleProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Study Partner</h2>
        <p className="mt-2 text-gray-600">Select the type of AI assistant you'd like to learn with</p>
      </div>

      <div className="grid gap-6">
        {roles.map((role) => (
          <motion.button
            key={role.type}
            onClick={() => onSelect(role.type)}
            className={`w-full p-6 rounded-xl text-left transition-all ${role.style}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-white/80">
                {role.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{role.name}</h3>
                <p className="mt-1 text-sm opacity-90">{role.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}