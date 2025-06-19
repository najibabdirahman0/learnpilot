import { useState, useEffect } from 'react';
import { Calendar, Clock, Building, User, Star, Trash2, Eye, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { JobApplicationService, JobApplicationData } from '../../services/openaiRealtime';
import { useTranslation, isRTL } from '../../utils/translations';

interface JobApplicationHistoryProps {
  onViewApplication?: (application: JobApplicationData) => void;
}

export default function JobApplicationHistory({ onViewApplication }: JobApplicationHistoryProps) {
  const { t, currentLanguage } = useTranslation();
  const [applications, setApplications] = useState<JobApplicationData[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadApplications();
  }, [filter]);

  const loadApplications = () => {
    let apps: JobApplicationData[];
    
    if (filter === 'all') {
      apps = JobApplicationService.getAllJobApplications();
    } else {
      apps = JobApplicationService.getApplicationsByStatus(filter);
    }
    
    // Sort by most recent first
    apps.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    setApplications(apps);
  };

  const deleteApplication = (id: string) => {
    if (confirm('Are you sure you want to delete this job application?')) {
      JobApplicationService.deleteJobApplication(id);
      loadApplications();
    }
  };

  const exportApplication = (application: JobApplicationData) => {
    const data = {
      jobTitle: application.jobTitle,
      company: application.company,
      date: application.createdAt.toLocaleDateString(),
      duration: Math.round((application.updatedAt.getTime() - application.createdAt.getTime()) / 1000 / 60),
      messages: application.messages.length,
      score: application.score,
      feedback: application.feedback,
      conversation: application.messages.map(msg => ({
        speaker: msg.type === 'user' ? 'You' : 'AI Interviewer',
        message: msg.content,
        time: msg.timestamp.toLocaleTimeString()
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${application.company}-${application.jobTitle}-${application.createdAt.toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${isRTL(currentLanguage) ? 'rtl' : 'ltr'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Job Application History</h2>
        
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No job applications found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Start a new interview to create your first application
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {application.jobTitle}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{application.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{application.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {Math.round((application.updatedAt.getTime() - application.createdAt.getTime()) / 1000 / 60)} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{application.messages.length} messages</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      Language: <span className="font-medium">{application.language}</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      Voice: <span className="font-medium">{application.voice}</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      Type: <span className="font-medium">{application.interviewerType}</span>
                    </span>
                    {application.score && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className={`font-medium ${getScoreColor(application.score)}`}>
                          {application.score}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onViewApplication && (
                    <button
                      onClick={() => onViewApplication(application)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => exportApplication(application)}
                    className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    title="Export Data"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteApplication(application.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}