import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface ProgressChartProps {
  data: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

interface FeatureAnalysis {
  title: string;
  timeRange: {
    start: string;
    end: string;
    duration: string;
  };
  participation: {
    total: number;
    active: number;
    engagement: string;
  };
  performance: {
    score: number;
    trend: string;
    improvement: string[];
  };
  nextSteps: string[];
  activityData: {
    dates: string[];
    values: number[];
    engagement: number[];
  };
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const featureAnalysis: Record<string, FeatureAnalysis> = {
    'Mock Interviews': {
      title: 'Interview Practice Analysis',
      timeRange: {
        start: '09:00 AM',
        end: '10:30 AM',
        duration: '1h 30m'
      },
      participation: {
        total: 12,
        active: 10,
        engagement: '83%'
      },
      performance: {
        score: 85,
        trend: '+12%',
        improvement: [
          'Response clarity needs work',
          'Technical depth could be improved',
          'Good communication skills'
        ]
      },
      nextSteps: [
        'Schedule advanced topic practice',
        'Review technical fundamentals',
        'Practice system design questions'
      ],
      activityData: {
        dates: ['18 Jul', '25 Jul', '3 Aug', '10 Aug', '17 Aug'],
        values: [65, 72, 78, 82, 85],
        engagement: [70, 75, 80, 85, 90]
      }
    },
    'Study Buddy': {
      title: 'AI Learning Assistant Analysis',
      timeRange: {
        start: '2:00 PM',
        end: '4:30 PM',
        duration: '2h 30m'
      },
      participation: {
        total: 15,
        active: 13,
        engagement: '87%'
      },
      performance: {
        score: 92,
        trend: '+15%',
        improvement: [
          'Consistent daily practice',
          'Good question variety',
          'Need more complex scenarios'
        ]
      },
      nextSteps: [
        'Increase difficulty level',
        'Try new topic areas',
        'Join study groups'
      ],
      activityData: {
        dates: ['18 Jul', '25 Jul', '3 Aug', '10 Aug', '17 Aug'],
        values: [75, 80, 85, 88, 92],
        engagement: [80, 82, 85, 88, 90]
      }
    },
    'Flashcards': {
      title: 'Flashcard Learning Analysis',
      timeRange: {
        start: '11:00 AM',
        end: '12:30 PM',
        duration: '1h 30m'
      },
      participation: {
        total: 100,
        active: 85,
        engagement: '85%'
      },
      performance: {
        score: 78,
        trend: '+8%',
        improvement: [
          'Review frequency could improve',
          'Good retention rate',
          'Need more varied content'
        ]
      },
      nextSteps: [
        'Create more specialized decks',
        'Increase review frequency',
        'Share with study group'
      ],
      activityData: {
        dates: ['18 Jul', '25 Jul', '3 Aug', '10 Aug', '17 Aug'],
        values: [60, 65, 70, 75, 78],
        engagement: [75, 78, 80, 82, 85]
      }
    },
    'Video Meeting': {
      title: 'Video Sessions Analysis',
      timeRange: {
        start: '3:00 PM',
        end: '4:30 PM',
        duration: '1h 30m'
      },
      participation: {
        total: 8,
        active: 7,
        engagement: '88%'
      },
      performance: {
        score: 90,
        trend: '+10%',
        improvement: [
          'Good participation rate',
          'Active discussion',
          'Could use more structured agenda'
        ]
      },
      nextSteps: [
        'Schedule regular sessions',
        'Create session agendas',
        'Implement feedback system'
      ],
      activityData: {
        dates: ['18 Jul', '25 Jul', '3 Aug', '10 Aug', '17 Aug'],
        values: [70, 75, 80, 85, 90],
        engagement: [75, 80, 85, 88, 90]
      }
    }
  };

  const chartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      events: {
        click: function(e: any) {
          if (e.point) {
            setSelectedSegment(e.point.name);
            setShowAnalysis(true);
          }
        }
      }
    },
    colors: data.map(item => item.color),
    title: {
      text: ''
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderWidth: 0,
      borderRadius: 8,
      shadow: true,
      style: {
        padding: '12px',
        fontSize: '14px'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        borderRadius: 4,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            fontSize: '13px',
            fontWeight: '500'
          },
          distance: 20
        },
        states: {
          hover: {
            brightness: 0.1,
            halo: {
              size: 10,
              opacity: 0.25
            }
          }
        }
      }
    },
    series: [{
      name: 'Progress',
      innerSize: '65%',
      data: data.map(item => ({
        name: item.name,
        y: item.percentage,
        color: item.color
      }))
    }]
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
          <p className="text-sm text-gray-500">Click on segments for detailed analysis</p>
        </div>
      </div>

      <div className="h-[300px]">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>

      <AnimatePresence>
        {showAnalysis && selectedSegment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{featureAnalysis[selectedSegment]?.title}</h3>
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Time and Participation */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium">Session Time</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">Start: {featureAnalysis[selectedSegment]?.timeRange.start}</p>
                      <p className="text-sm">End: {featureAnalysis[selectedSegment]?.timeRange.end}</p>
                      <p className="text-sm font-medium">Duration: {featureAnalysis[selectedSegment]?.timeRange.duration}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium">Participation</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">Total: {featureAnalysis[selectedSegment]?.participation.total}</p>
                      <p className="text-sm">Active: {featureAnalysis[selectedSegment]?.participation.active}</p>
                      <p className="text-sm font-medium">Engagement: {featureAnalysis[selectedSegment]?.participation.engagement}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium">Progress Over Time</h4>
                  </div>
                  <div className="h-48">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={{
                        chart: {
                          type: 'line',
                          backgroundColor: 'transparent'
                        },
                        title: { text: '' },
                        xAxis: {
                          categories: featureAnalysis[selectedSegment]?.activityData.dates
                        },
                        yAxis: [{
                          title: { text: 'Performance' },
                          min: 0,
                          max: 100
                        }, {
                          title: { text: 'Engagement' },
                          opposite: true,
                          min: 0,
                          max: 100
                        }],
                        series: [{
                          name: 'Performance',
                          data: featureAnalysis[selectedSegment]?.activityData.values,
                          color: data.find(d => d.name === selectedSegment)?.color
                        }, {
                          name: 'Engagement',
                          data: featureAnalysis[selectedSegment]?.activityData.engagement,
                          yAxis: 1,
                          color: '#10B981'
                        }]
                      }}
                    />
                  </div>
                </div>

                {/* Improvements and Next Steps */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <h4 className="font-medium">Areas for Improvement</h4>
                    </div>
                    <ul className="space-y-2">
                      {featureAnalysis[selectedSegment]?.performance.improvement.map((item, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium">Next Steps</h4>
                    </div>
                    <ul className="space-y-2">
                      {featureAnalysis[selectedSegment]?.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}