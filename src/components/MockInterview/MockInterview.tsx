import { useState } from 'react';
import { Filter, Mic, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobSetup from './JobSetup';
import InterviewGuides from './InterviewGuides';
import InterviewerSelect from './InterviewerSelect';
import OpenAIRealtimeInterview from './OpenAIRealtimeInterview';
import Feedback from './Feedback';
import FileUpload from './FileUpload';
import JobApplicationHistory from './JobApplicationHistory';
import { useTranslation, isRTL } from '../../utils/translations';
import { JobApplicationService } from '../../services/openaiRealtime';

type InterviewStep = 'file-upload' | 'job-setup' | 'guides' | 'interviewer' | 'interview' | 'feedback' | 'history';
type InterviewerType = 'friendly' | 'professional' | 'expert';

interface JobData {
  title: string;
  company: string;
  description: string;
}

interface MockInterviewProps {
  userName?: string;
}

export default function MockInterview({ userName = 'there' }: MockInterviewProps) {
  const { t, currentLanguage } = useTranslation();
  const [step, setStep] = useState<InterviewStep>('file-upload');
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    description: ''
  });
  const [cvContent, setCvContent] = useState<string>('');
  const [interviewer, setInterviewer] = useState<InterviewerType>('friendly');
  const [interviewScore, setInterviewScore] = useState<number>(0);

  // Get recent applications for display
  const recentApplications = JobApplicationService.getRecentApplications(3);

  const handleFileUpload = (cv: File | null, jobDescription: string) => {
    if (cv) {
      // In a real implementation, you would extract text from the CV file
      setCvContent(`CV Content for ${cv.name}:\n\nThis would contain the extracted text from the uploaded CV file. In a production environment, you would use libraries like pdf-parse for PDFs or mammoth for Word documents to extract the actual text content.`);
    }
    
    if (jobDescription) {
      // Parse job description to extract job data
      const lines = jobDescription.split('\n');
      const title = lines.find(line => line.toLowerCase().includes('title') || line.toLowerCase().includes('position'))?.split(':')[1]?.trim() || 'Software Developer';
      const company = lines.find(line => line.toLowerCase().includes('company'))?.split(':')[1]?.trim() || 'Tech Company';
      
      setJobData({
        title,
        company,
        description: jobDescription
      });
    }
    
    setStep('guides');
  };

  const handleJobSetup = (data: JobData) => {
    setJobData(data);
    setStep('guides');
  };

  const handleStartInterview = () => {
    setStep('interviewer');
  };

  const handleInterviewerSelect = (type: InterviewerType) => {
    setInterviewer(type);
    setStep('interview');
  };

  const handleInterviewComplete = (score: number) => {
    setInterviewScore(score);
    setStep('feedback');
  };

  const startNewInterview = () => {
    setJobData({ title: '', company: '', description: '' });
    setCvContent('');
    setStep('file-upload');
  };

  if (step === 'history') {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview History</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                View and manage your saved job applications and interview sessions
              </p>
            </div>
            <button
              onClick={() => setStep('file-upload')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mic className="w-4 h-4" />
              New Interview
            </button>
          </div>
          
          <JobApplicationHistory />
        </div>
      </div>
    );
  }

  if (step === 'file-upload') {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('aiMockInterview')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('uploadCV')} {userName ? `• ${t('welcomeBack')} ${userName}!` : ''}
              </p>
            </div>
            
            <button
              onClick={() => setStep('history')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <History className="w-4 h-4" />
              View History
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <FileUpload onComplete={handleFileUpload} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('quickStart')}</h3>
                  <button 
                    onClick={() => setStep('job-setup')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Mic className="w-4 h-4" />
                    {t('skipUpload')}
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('skipUploadDescription')}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">🤖 OpenAI Realtime Features</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Real-time voice conversation with AI</li>
                  <li>• Automatic language detection</li>
                  <li>• Male/Female voice selection</li>
                  <li>• Auto-save job applications</li>
                  <li>• Multilingual support (7 languages)</li>
                  <li>• Professional interview feedback</li>
                </ul>
              </div>

              {recentApplications.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Applications</h3>
                  <div className="space-y-3">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">{app.jobTitle}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">{app.company}</p>
                            <p className="text-gray-400 dark:text-gray-500 text-xs">
                              {app.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          {app.score && (
                            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">{app.score}%</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep('history')}
                    className="w-full mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    View All Applications →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'job-setup') {
    return (
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('jobDetails')}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('enterJobDetailsDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <JobSetup onComplete={handleJobSetup} />
            </div>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">{t('enterJobDetailsToStart')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {step === 'guides' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InterviewGuides 
                jobData={jobData} 
                onStartInterview={handleStartInterview}
              />
            </motion.div>
          )}

          {step === 'interviewer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InterviewerSelect onSelect={handleInterviewerSelect} />
            </motion.div>
          )}

          {step === 'interview' && (
            <OpenAIRealtimeInterview
              jobData={jobData}
              cvContent={cvContent}
              interviewer={interviewer}
              userName={userName}
              onComplete={handleInterviewComplete}
            />
          )}

          {step === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Feedback 
                score={interviewScore}
                onStartNew={startNewInterview} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}