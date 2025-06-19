import { UserCircle, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation, isRTL } from '../../utils/translations';

interface InterviewerSelectProps {
  onSelect: (type: 'friendly' | 'professional' | 'expert') => void;
}

export default function InterviewerSelect({ onSelect }: InterviewerSelectProps) {
  const { t, currentLanguage } = useTranslation();

  const interviewers = [
    {
      type: 'friendly',
      icon: <UserCircle className="w-8 h-8" />,
      name: t('friendlyHR'),
      description: t('warmEncouraging'),
      style: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50',
    },
    {
      type: 'professional',
      icon: <Users className="w-8 h-8" />,
      name: t('professionalRecruiter'),
      description: t('structuredBalanced'),
      style: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50',
    },
    {
      type: 'expert',
      icon: <Briefcase className="w-8 h-8" />,
      name: t('industryExpert'),
      description: t('technicalChallenging'),
      style: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50',
    },
  ] as const;

  return (
    <div className={`space-y-6 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('chooseInterviewer')}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('selectInterviewerType')}</p>
      </div>

      <div className="grid gap-6">
        {interviewers.map((interviewer) => (
          <motion.button
            key={interviewer.type}
            onClick={() => onSelect(interviewer.type)}
            className={`w-full p-6 rounded-xl text-left transition-all border border-gray-200 dark:border-gray-700 ${interviewer.style}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80">
                {interviewer.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{interviewer.name}</h3>
                <p className="mt-1 text-sm opacity-90">{interviewer.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}