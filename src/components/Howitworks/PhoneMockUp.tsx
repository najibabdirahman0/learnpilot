import React from 'react';
import Logo from './Logo';

export function PhoneMockUp() {
  return (
    <div className="relative w-64 h-[530px] mx-auto bg-gray-900 rounded-[3rem] p-3 shadow-xl">
      {/* Phone screen */}
      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-10"></div>

        {/* Screen content */}
        <div className="w-full h-full bg-white pt-8 px-4">
          {/* Status bar */}
          <div className="flex justify-between text-xs text-gray-600 mb-4">
            <span>9:41</span>
            <div className="flex space-x-1">
              <span>●●●</span>
            </div>
          </div>

          {/* App content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Logo />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Today's Learning</h2>
              
              {/* Interview Prep Card */}
              <div className="bg-blue-50 rounded-xl p-4 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Interview Prep</h3>
                    <p className="text-sm text-gray-500">30 min • Software Engineering</p>
                  </div>
                </div>
              </div>

              {/* Study Buddy Card */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Study Buddy</h3>
                    <p className="text-sm text-gray-500">45 flashcards • Data Structures</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Upcoming Sessions</h2>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Video Chat</h3>
                    <p className="text-sm text-gray-500">Tomorrow, 3:00 PM • Study Group</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneMockUp;